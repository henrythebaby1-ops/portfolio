#!/usr/bin/env python3
"""Claude Blocks <-> Raspberry Pi 5 bridge.

Run this on your Raspberry Pi:   python3 pi-bridge.py
Then type the address and token it prints into the "Pi 5" tab in Claude Blocks.

It lets Claude Blocks control GPIO pins (via gpiozero) and run shell commands and
Python programs on the Pi. Anyone with the token on your network can run commands,
so only use it on networks you trust and stop it (Ctrl+C) when you're done.
Set CB_TOKEN to choose your own token and CB_PORT to change the port (default 8765).
"""
import getpass
import glob
import hmac
import json
import os
import platform
import secrets
import socket
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("CB_PORT", "8765"))
TOKEN = os.environ.get("CB_TOKEN") or secrets.token_hex(4)
MAX_OUTPUT = 200_000

try:
    from gpiozero import (AngularServo, DigitalInputDevice, DigitalOutputDevice, DistanceSensor, LEDBarGraph, MCP3008,
                          Motor, MotionSensor, PWMOutputDevice, RGBLED, TonalBuzzer, TrafficLights)
    from gpiozero.tones import Tone
    GPIO_OK = True
except Exception as exc:  # not on a Pi, or gpiozero missing
    GPIO_OK = False
    GPIO_ERROR = str(exc)

state = {"cwd": os.path.expanduser("~")}
devices, practice_pins = {}, {}
gpio_lock = threading.Lock()


def read_file(path):
    try:
        with open(path) as f:
            return f.read().strip("\x00\n ")
    except OSError:
        return None


def info():
    temp = read_file("/sys/class/thermal/thermal_zone0/temp")
    return {
        "hostname": socket.gethostname(),
        "model": read_file("/proc/device-tree/model") or platform.platform(),
        "temp": round(int(temp) / 1000, 1) if temp and temp.isdigit() else None,
        "gpio": GPIO_OK,
        "user": getpass.getuser(),
        "cwd": state["cwd"],
        "home": os.path.expanduser("~"),
    }


def text(value):
    if value is None:
        return ""
    if isinstance(value, bytes):
        value = value.decode(errors="replace")
    return value[-MAX_OUTPUT:]


def run_command(cmd):
    cmd = cmd.strip()
    if cmd == "cd" or cmd.startswith("cd "):
        target = os.path.expanduser(cmd[2:].strip() or "~")
        path = os.path.normpath(os.path.join(state["cwd"], target))
        if os.path.isdir(path):
            state["cwd"] = path
            return {"stdout": "", "stderr": "", "code": 0, "cwd": path}
        return {"stdout": "", "stderr": f"cd: no such directory: {target}\n", "code": 1, "cwd": state["cwd"]}
    print(f"$ {cmd}", flush=True)
    env = dict(os.environ, TERM="dumb")
    try:
        p = subprocess.run(cmd, shell=True, cwd=state["cwd"], capture_output=True, text=True, timeout=30, env=env)
        return {"stdout": text(p.stdout), "stderr": text(p.stderr), "code": p.returncode, "cwd": state["cwd"]}
    except subprocess.TimeoutExpired as e:
        return {"stdout": text(e.stdout), "stderr": text(e.stderr) + "\n(stopped after 30 seconds)\n", "code": -1, "cwd": state["cwd"]}


def run_python(code):
    print("$ (running Python from Claude Blocks)", flush=True)
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(code)
        path = f.name
    try:
        p = subprocess.run([sys.executable, path], cwd=state["cwd"], capture_output=True, text=True, timeout=60)
        return {"stdout": text(p.stdout), "stderr": text(p.stderr), "code": p.returncode}
    except subprocess.TimeoutExpired as e:
        return {"stdout": text(e.stdout), "stderr": text(e.stderr) + "\n(stopped after 60 seconds)\n", "code": -1}
    finally:
        os.unlink(path)


def device(pin, kind):
    d = devices.get(pin)
    if d is not None and type(d) is kind:
        return d
    if d is not None:
        d.close()
    for key in [k for k in parts if isinstance(k, tuple) and k[1] == pin]:  # free the pin from a servo/buzzer
        parts.pop(key).close()
    d = kind(pin, pull_up=True) if kind is DigitalInputDevice else kind(pin)
    devices[pin] = d
    return d


def gpio(req):
    action = req.get("action")
    pin = int(req.get("pin", -1))
    if not 0 <= pin <= 27:
        raise ValueError("GPIO pin must be between 0 and 27")
    if not GPIO_OK:  # practice mode when not running on a Pi
        if action == "write":
            practice_pins[pin] = bool(req.get("value"))
        if action == "pwm":
            practice_pins[pin] = float(req.get("value", 0)) > 0
        if action == "read":
            return {"value": practice_pins.get(pin, True), "practice": True}
        if action == "pressed":
            return {"value": False, "practice": True}
        return {"ok": True, "practice": True}
    with gpio_lock:
        if action == "write":
            device(pin, DigitalOutputDevice).value = 1 if req.get("value") else 0
            return {"ok": True}
        if action == "pwm":
            duty = max(0.0, min(100.0, float(req.get("value", 0))))
            device(pin, PWMOutputDevice).value = duty / 100
            return {"ok": True}
        if action in ("read", "pressed"):
            active = device(pin, DigitalInputDevice).is_active  # pull-up: active means the pin is pulled low
            return {"value": active if action == "pressed" else not active}
    raise ValueError(f"unknown GPIO action: {action}")


# ---------- parts: servo, RGB LED, buzzer, LCD, sensors and the active cooler ----------
parts = {}
FAN_LEVELS = {"off": 0, "low": 1, "medium": 2, "high": 3, "full": 4}


def part(key, make):
    """Create a gpiozero part once and reuse it (a pin can only be used by one part at a time)."""
    if key not in parts:
        for pin in [key[1]] if isinstance(key, tuple) else []:
            old = devices.pop(pin, None)
            if old is not None:
                old.close()
        parts[key] = make()
    return parts[key]


def fan_percent():
    for path in glob.glob("/sys/devices/platform/cooling_fan/hwmon/hwmon*/pwm1"):
        value = read_file(path)
        if value and value.isdigit():
            return round(int(value) / 255 * 100)
    return 0


def set_fan(mode):
    devs = [d for d in glob.glob("/sys/class/thermal/cooling_device*") if read_file(d + "/type") in ("pwm-fan", "cooling_fan")]
    if not devs:
        raise ValueError("No active cooler found — is the Raspberry Pi Active Cooler plugged into the FAN header?")
    if mode == "auto":
        return {"ok": True, "note": "The Pi's firmware controls the fan automatically."}
    try:
        with open(devs[0] + "/cur_state", "w") as f:
            f.write(str(FAN_LEVELS.get(mode, 0)))
    except PermissionError:
        raise ValueError("To control the fan, start the bridge with: sudo python3 pi-bridge.py")
    return {"ok": True}


def lcd():
    try:
        from RPLCD.i2c import CharLCD
    except ImportError:
        raise ValueError("The LCD needs RPLCD: run  pip install RPLCD smbus2 --break-system-packages  and turn on I2C in raspi-config")
    return part("lcd", lambda: CharLCD("PCF8574", 0x27, cols=16, rows=2))


# Parts that need extra libraries or wiring we don't support on real hardware yet.
EMULATOR_ONLY = {"neopixel": "NeoPixel strip", "segment": "4-digit display", "oled": "OLED screen"}


def hw(req):
    dev = req.get("device")
    if dev in EMULATOR_ONLY or (dev == "read" and req.get("sensor") in ("temperature", "humidity")):
        name = EMULATOR_ONLY.get(dev, "temperature & humidity sensor")
        raise ValueError(f"The {name} only works in the Claude Blocks emulator for now.")
    if dev == "fan":
        return set_fan(str(req.get("mode")))
    if dev == "read" and req.get("sensor") == "fan":
        return {"value": fan_percent()}
    if dev == "lcd":
        with gpio_lock:
            screen = lcd()
            action = req.get("action")
            if action == "clear":
                screen.clear()
            elif action == "backlight":
                screen.backlight_enabled = bool(req.get("on"))
            else:
                screen.cursor_pos = (1 if int(req.get("line", 1)) == 2 else 0, 0)
                screen.write_string(str(req.get("text", ""))[:16].ljust(16))
        return {"ok": True}
    if not GPIO_OK:  # practice mode when not running on a Pi
        if dev == "read":
            return {"value": {"pot": 50, "distance": 40, "motion": False, "light": 60, "joyx": 0, "joyy": 0}.get(req.get("sensor")), "practice": True}
        return {"ok": True, "practice": True}
    with gpio_lock:
        if dev == "servo":
            pin = int(req.get("pin", 18))
            servo = part(("servo", pin), lambda: AngularServo(pin, min_angle=0, max_angle=180))
            servo.angle = max(0.0, min(180.0, float(req.get("angle", 90))))
            return {"ok": True}
        if dev == "rgb":
            led = part("rgb", lambda: RGBLED(5, 6, 13))
            led.color = tuple(max(0.0, min(1.0, float(req.get(c, 0)))) for c in "rgb")
            return {"ok": True}
        if dev == "buzzer":
            pin = int(req.get("pin", 22))
            buzzer = part(("buzzer", pin), lambda: TonalBuzzer(pin, octaves=3))
            buzzer.play(Tone(midi=int(max(36, min(102, float(req.get("note", 60)))))))
            threading.Timer(float(req.get("secs", 0.5)), buzzer.stop).start()
            return {"ok": True}
        if dev == "traffic":
            lights = part("traffic", lambda: TrafficLights(14, 15, 25))
            on = {"red": (1, 0, 0), "amber": (0, 1, 0), "green": (0, 0, 1), "all": (1, 1, 1)}.get(req.get("light"), (0, 0, 0))
            lights.value = on
            return {"ok": True}
        if dev == "bargraph":
            bar = part("bargraph", lambda: LEDBarGraph(7, 12, 19, 26, pwm=True))
            bar.value = max(0.0, min(100.0, float(req.get("value", 0)))) / 100
            return {"ok": True}
        if dev == "motor":
            motor = part("motor", lambda: Motor(forward=20, backward=21))
            speed = max(0.0, min(100.0, float(req.get("speed", 50)))) / 100
            {"forward": motor.forward, "backward": motor.backward}.get(req.get("dir"), lambda _=0: motor.stop())(speed)
            return {"ok": True}
        if dev == "read":
            sensor = req.get("sensor")
            if sensor == "light":
                return {"value": round(part("light", lambda: MCP3008(channel=1)).value * 100, 1)}
            if sensor in ("joyx", "joyy"):
                ch = 2 if sensor == "joyx" else 3
                return {"value": round(part(sensor, lambda: MCP3008(channel=ch)).value * 200 - 100)}
            if sensor == "pot":
                return {"value": round(part("pot", lambda: MCP3008(channel=0)).value * 100, 1)}
            if sensor == "distance":
                return {"value": round(part("distance", lambda: DistanceSensor(echo=24, trigger=23)).distance * 100, 1)}
            if sensor == "motion":
                return {"value": part("motion", lambda: MotionSensor(4)).motion_detected}
    raise ValueError(f"unknown device: {dev}")


class Handler(BaseHTTPRequestHandler):
    def cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-CB-Token")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Private-Network", "true")

    def reply(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def authorized(self):
        if hmac.compare_digest(self.headers.get("X-CB-Token", ""), TOKEN):
            return True
        self.reply(401, {"error": "wrong token"})
        return False

    def do_OPTIONS(self):
        self.send_response(204)
        self.cors()
        self.end_headers()

    def do_GET(self):
        if self.path == "/ping":  # lets Claude Blocks' "View devices" find this Pi (no secrets here)
            return self.reply(200, {"app": "claude-blocks-pi-bridge", "hostname": socket.gethostname(),
                                    "model": read_file("/proc/device-tree/model") or platform.platform()})
        if not self.authorized():
            return
        if self.path == "/info":
            return self.reply(200, info())
        self.reply(404, {"error": "not found"})

    def do_POST(self):
        if not self.authorized():
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            req = json.loads(self.rfile.read(length) or b"{}")
            if self.path == "/exec":
                return self.reply(200, run_command(str(req.get("cmd", ""))))
            if self.path == "/python":
                return self.reply(200, run_python(str(req.get("code", ""))))
            if self.path == "/hw":
                return self.reply(200, hw(req))
            if self.path == "/gpio":
                return self.reply(200, gpio(req))
            self.reply(404, {"error": "not found"})
        except Exception as e:
            self.reply(400, {"error": str(e)})

    def log_message(self, fmt, *args):
        pass


def local_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("10.255.255.255", 1))
            return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print("Claude Blocks Pi bridge is running!")
    name = socket.gethostname().removesuffix(".local")
    print(f"  Address:  {name}.local:{PORT}   (or {local_ip()}:{PORT})")
    print(f"  Token:    {TOKEN}")
    if not GPIO_OK:
        print(f"  Note: GPIO is in practice mode ({GPIO_ERROR})")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nBye!")
