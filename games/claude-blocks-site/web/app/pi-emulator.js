/* Claude Blocks: Raspberry Pi 5 emulator — a virtual kit of parts you can add and remove, an active cooler,
   and a pretend Pi shell. Pi blocks talk to this when the Pi 5 tab is in "Emulator" mode. */
(() => {
  const CB = window.CB, rt = CB.rt;
  const $ = s => document.querySelector(s);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const ok = { ok: true };

  const st = {
    pins: {}, parts: [], servo: {}, lcd: { lines: ['', ''], backlight: true }, oled: ['', '', '', ''], seg: '',
    neo: Array.from({ length: 8 }, () => [0, 0, 0]), motor: { dir: 'stop', speed: 0, angle: 0 },
    fanMode: 'auto', fan: 0, fanAngle: 0, temp: 42, load: 20, pot: 50, distance: 40, light: 60, roomTemp: 22, humidity: 45,
    joy: { x: 0, y: 0 }, motion: false, rgb: [0, 0, 0], cwd: '/home/pi', boot: Date.now(), beepUntil: 0,
  };
  const pinVal = p => (st.pins[p] ? st.pins[p].value : 0);

  // ---------- sound ----------
  let audio = null, hum = null;
  const actx = () => (audio = audio || new (window.AudioContext || window.webkitAudioContext)());
  function beep(note, secs) {
    try {
      const a = actx(), o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
      o.type = 'square'; o.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
      g.gain.setValueAtTime(0.06, t); g.gain.setValueAtTime(0.06, t + secs); g.gain.linearRampToValueAtTime(0, t + secs + 0.02);
      o.connect(g).connect(a.destination); o.start(t); o.stop(t + secs + 0.05);
      st.beepUntil = Date.now() + secs * 1000;
    } catch (_) { /* no audio */ }
  }
  function click() {
    try {
      const a = actx(), len = Math.floor(a.sampleRate * 0.015), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = a.createBufferSource(), g = a.createGain(); g.gain.value = 0.3;
      src.buffer = buf; src.connect(g).connect(a.destination); src.start();
    } catch (_) { /* no audio */ }
  }
  function buzzerHum(on) {
    try {
      if (on && !hum) { const a = actx(); hum = a.createOscillator(); const g = a.createGain(); g.gain.value = 0.04; hum.type = 'square'; hum.frequency.value = 2300; hum.connect(g).connect(a.destination); hum.start(); }
      else if (!on && hum) { hum.stop(); hum = null; }
    } catch (_) { /* no audio */ }
  }

  // ---------- parts ----------
  const glow = (e, v, color) => {
    e.style.opacity = 0.25 + 0.75 * v;
    e.style.boxShadow = v > 0.02 ? `0 0 ${6 + 18 * v}px ${2 + 6 * v}px ${color}` : 'none';
  };
  // Hold-to-press that still registers a quick tap (stays down at least 0.2 s).
  function latch(btn, set) {
    let at = 0, timer = null;
    btn.addEventListener('pointerdown', e => { e.preventDefault(); clearTimeout(timer); at = Date.now(); set(true); });
    const up = () => { clearTimeout(timer); timer = setTimeout(() => set(false), Math.max(0, 200 - (Date.now() - at))); };
    for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) btn.addEventListener(ev, up);
  }
  function slider(label, min, max, get, set, unit = '') {
    const wrap = el('label', 'emu-slider'), head = el('span'), val = el('b'), input = el('input');
    head.append(label + ' ', val);
    Object.assign(input, { type: 'range', min, max, value: get() });
    input.oninput = () => set(+input.value);
    wrap.append(head, input);
    return { el: wrap, update() { val.textContent = get() + unit; if (document.activeElement !== input) input.value = get(); } };
  }
  const LED_COLORS = [['red', '#ff3b30'], ['green', '#34c759'], ['yellow', '#ffcc00'], ['blue', '#0a84ff'], ['white', '#f5f5f5']];
  const TRAFFIC = [14, 15, 25], BAR = [7, 12, 19, 26], MOTOR = [20, 21], BUS_PINS = [2, 3, 8, 9, 10, 11];

  const TYPES = {
    led: {
      name: 'LED', icon: '💡', desc: 'A light on any pin. “set GPIO pin to high” turns it on, PWM dims it.', config: ['pin', 'color'], defaults: { pin: 17, color: '#ff3b30' },
      pins: p => [p.pin],
      build(p) { const d = el('div', 'led'); d.style.setProperty('--c', p.color); return { el: d, update() { glow(d, pinVal(p.pin), p.color); } }; },
    },
    rgb: {
      name: 'RGB LED', icon: '🌈', desc: 'Mix any colour with “set RGB LED to”.', single: true, pins: () => [5, 6, 13],
      build() {
        const d = el('div', 'led rgb');
        return { el: d, update() { const c = [5, 6, 13].map((pin, i) => Math.max(pinVal(pin), st.rgb[i])); const css = `rgb(${c.map(v => Math.round(v * 255)).join(',')})`; d.style.background = css; glow(d, Math.max(...c), css); } };
      },
    },
    button: {
      name: 'Push button', icon: '🔴', desc: 'Click or hold it. Read it with “button on pin … pressed?”.', config: ['pin'], defaults: { pin: 16 }, pins: p => [p.pin],
      build(p) { const b = el('button', 'emu-button'); b.type = 'button'; b.setAttribute('aria-label', 'Press the button'); latch(b, v => { p.pressed = v; b.classList.toggle('down', v); }); return { el: b, update() {} }; },
    },
    tilt: {
      name: 'Tilt switch', icon: '📐', desc: 'Tip it over and the pin reads low, just like a pressed button.', config: ['pin'], defaults: { pin: 12 }, pins: p => [p.pin],
      build(p) { const b = el('button', 'emu-toggle', '📐 Tilt'); b.type = 'button'; b.onclick = () => { p.tilted = !p.tilted; b.classList.toggle('on', p.tilted); b.textContent = p.tilted ? '📐 Tilted!' : '📐 Tilt'; }; return { el: b, update() {} }; },
    },
    buzzer: {
      name: 'Buzzer', icon: '🔊', desc: 'Beeps when its pin is high, or plays notes with “play buzzer”.', config: ['pin'], defaults: { pin: 22 }, pins: p => [p.pin],
      build(p) { const d = el('div', 'emu-buzzer', '🔈'); return { el: d, update() { const on = pinVal(p.pin) > 0 || st.beepUntil > Date.now(); d.textContent = on ? '🔊' : '🔈'; d.classList.toggle('on', on); } }; },
    },
    relay: {
      name: 'Relay + lamp', icon: '🔌', desc: 'A switch that turns big things (like a lamp) on and off. Clicks when it switches.', config: ['pin'], defaults: { pin: 26 }, pins: p => [p.pin],
      build(p) {
        const d = el('div', 'emu-relay', '💡'); let was = 0;
        return { el: d, update() { const on = pinVal(p.pin) > 0 ? 1 : 0; if (on !== was) { click(); was = on; } d.classList.toggle('on', !!on); } };
      },
    },
    servo: {
      name: 'Servo', icon: '🦾', desc: 'Turns to an angle from 0° to 180° with “set servo”.', config: ['pin'], defaults: { pin: 18 }, pins: p => [p.pin],
      build(p) {
        const wrap = el('div', 'emu-col');
        wrap.innerHTML = '<svg viewBox="0 0 100 60" class="emu-servo"><path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="#d6d3c9" stroke-width="2" stroke-dasharray="3 3"/><rect x="30" y="44" width="40" height="14" rx="3" fill="#2b5bd7"/><g class="arm"><line x1="50" y1="52" x2="50" y2="16" stroke="#f0eee6" stroke-width="7" stroke-linecap="round"/><line x1="50" y1="52" x2="50" y2="16" stroke="#555" stroke-width="2" stroke-linecap="round"/></g><circle cx="50" cy="52" r="5" fill="#fff" stroke="#555"/></svg><b class="deg"></b>';
        const arm = wrap.querySelector('.arm'), deg = wrap.querySelector('.deg'); let shown = 90;
        return { el: wrap, update() { deg.textContent = Math.round(st.servo[p.pin] ?? 90) + '°'; }, frame() { shown += ((st.servo[p.pin] ?? 90) - shown) * 0.2; arm.setAttribute('transform', `rotate(${shown - 90} 50 52)`); } };
      },
    },
    motor: {
      name: 'DC motor', icon: '⚙️', desc: 'Spins forward or backward at any speed with the “motor” block.', single: true, pins: () => MOTOR,
      build() {
        const wrap = el('div', 'emu-col');
        wrap.innerHTML = `<svg viewBox="0 0 60 60" class="emu-fan"><circle cx="30" cy="30" r="27" fill="#333"/><circle cx="30" cy="30" r="20" fill="#555"/><g class="spokes">${[0, 60, 120].map(a => `<rect x="28" y="12" width="4" height="36" rx="2" fill="#ccc" transform="rotate(${a} 30 30)"/>`).join('')}</g><circle cx="30" cy="30" r="5" fill="#d97757"/></svg><b class="deg"></b>`;
        const spokes = wrap.querySelector('.spokes'), lab = wrap.querySelector('.deg');
        return {
          el: wrap,
          update() { lab.textContent = st.motor.dir === 'stop' ? 'stopped' : `${st.motor.dir} ${st.motor.speed}%`; },
          frame() { const s = st.motor.dir === 'stop' ? 0 : st.motor.speed * (st.motor.dir === 'backward' ? -1 : 1); st.motor.angle = (st.motor.angle + s * 0.15) % 360; spokes.setAttribute('transform', `rotate(${st.motor.angle} 30 30)`); },
        };
      },
    },
    fan: {
      name: 'Active cooler', icon: '🌀', desc: 'The Pi 5 fan. Auto mode follows the CPU temperature, or set it yourself.', single: true, pins: () => [],
      build() {
        const wrap = el('div', 'emu-col');
        wrap.innerHTML = `<svg viewBox="0 0 60 60" class="emu-fan"><rect x="2" y="2" width="56" height="56" rx="8" fill="#2a2a2a"/><g class="blades">${Array.from({ length: 7 }, (_, i) => `<path transform="rotate(${i * 51.4} 30 30)" d="M30 30 C 33 18, 42 12, 46 14 C 44 20, 38 26, 30 30 Z" fill="#9aa0a6"/>`).join('')}</g><circle cx="30" cy="30" r="6" fill="#444"/></svg><b class="deg"></b>`;
        const blades = wrap.querySelector('.blades'), lab = wrap.querySelector('.deg');
        return { el: wrap, update() { lab.textContent = `${st.fanMode} · ${Math.round(st.fan)}%`; }, frame() { st.fanAngle = (st.fanAngle + st.fan * 0.35) % 360; blades.setAttribute('transform', `rotate(${st.fanAngle} 30 30)`); } };
      },
    },
    traffic: {
      name: 'Traffic light', icon: '🚦', desc: 'Red, amber and green lights. Use “set traffic light to”.', single: true, pins: () => TRAFFIC,
      build() {
        const box = el('div', 'emu-traffic'); const lights = ['#ff3b30', '#ff9f0a', '#34c759'].map(c => { const l = el('div', 'led'); l.style.setProperty('--c', c); box.appendChild(l); return [l, c]; });
        return { el: box, update() { lights.forEach(([l, c], i) => glow(l, pinVal(TRAFFIC[i]), c)); } };
      },
    },
    bargraph: {
      name: 'LED bar graph', icon: '📶', desc: 'Four LEDs in a row that show a level from 0 to 100%.', single: true, pins: () => BAR,
      build() {
        const box = el('div', 'emu-bar'); const segs = BAR.map(() => box.appendChild(el('div', 'seg')));
        return { el: box, update() { segs.forEach((s, i) => { const v = pinVal(BAR[i]); s.style.opacity = 0.2 + 0.8 * v; s.style.boxShadow = v > 0.05 ? `0 0 ${8 * v}px #34c759` : 'none'; }); } };
      },
    },
    neopixel: {
      name: 'NeoPixel strip', icon: '🎆', desc: '8 colour LEDs you can set one by one. (Emulator only for now.)', single: true, wide: true, pins: () => [10],
      build() {
        const box = el('div', 'emu-neo'); const px = st.neo.map(() => box.appendChild(el('div', 'px')));
        return { el: box, update() { px.forEach((d, i) => { const c = st.neo[i], css = `rgb(${c.map(v => Math.round(v * 255)).join(',')})`; d.style.background = Math.max(...c) > 0.02 ? css : '#222'; d.style.boxShadow = Math.max(...c) > 0.02 ? `0 0 8px ${css}` : 'none'; }); } };
      },
    },
    segment: {
      name: '4-digit display', icon: '🔢', desc: 'A red number display, like a clock. (Emulator only for now.)', single: true, pins: () => [],
      build() { const d = el('div', 'emu-seg'); return { el: d, update() { d.textContent = st.seg.padStart(4, ' ').slice(-4).replace(/ /g, ' '); } }; },
    },
    lcd: {
      name: 'LCD 16×2', icon: '📟', desc: 'Two lines of 16 letters with a backlight. I²C address 0x27.', single: true, wide: true, pins: () => [2, 3],
      build() { const d = el('div', 'emu-lcd'); d.append(el('div'), el('div')); return { el: d, update() { d.classList.toggle('dark', !st.lcd.backlight); d.children[0].textContent = st.lcd.lines[0].padEnd(16); d.children[1].textContent = st.lcd.lines[1].padEnd(16); } }; },
    },
    oled: {
      name: 'OLED screen', icon: '🖥️', desc: 'A small 128×64 screen with 4 lines of text. I²C 0x3C. (Emulator only for now.)', single: true, wide: true, pins: () => [2, 3],
      build() { const d = el('div', 'emu-oled'); for (let i = 0; i < 4; i++) d.appendChild(el('div')); return { el: d, update() { st.oled.forEach((t, i) => { d.children[i].textContent = t.padEnd(16); }); } }; },
    },
    pot: {
      name: 'Potentiometer', icon: '🎛️', desc: 'A turning knob (ADC channel 0). Read it with “potentiometer value”.', single: true, wide: true, pins: () => [8, 9, 10, 11],
      build() { return slider('🎛️ Value', 0, 100, () => st.pot, v => { st.pot = v; }); },
    },
    light: {
      name: 'Light sensor', icon: '☀️', desc: 'Measures brightness from 0 (dark) to 100 (bright). ADC channel 1.', single: true, wide: true, pins: () => [8, 9, 10, 11],
      build() { return slider('☀️ Light level', 0, 100, () => st.light, v => { st.light = v; }); },
    },
    joystick: {
      name: 'Joystick', icon: '🕹️', desc: 'Drag the stick! Gives x and y from -100 to 100. ADC channels 2 and 3.', single: true, pins: () => [8, 9, 10, 11],
      build() {
        const pad = el('div', 'emu-joy'), knob = el('div', 'knob'); pad.appendChild(knob);
        let dragging = false;
        const move = e => {
          if (!dragging) return;
          const r = pad.getBoundingClientRect();
          st.joy.x = Math.round(clamp(((e.clientX - r.left) / r.width) * 200 - 100, -100, 100));
          st.joy.y = Math.round(clamp(100 - ((e.clientY - r.top) / r.height) * 200, -100, 100));
        };
        pad.addEventListener('pointerdown', e => { dragging = true; pad.setPointerCapture(e.pointerId); move(e); });
        pad.addEventListener('pointermove', move);
        pad.addEventListener('pointerup', () => { dragging = false; st.joy.x = 0; st.joy.y = 0; });
        return { el: pad, update() { knob.style.left = 50 + st.joy.x / 2.6 + '%'; knob.style.top = 50 - st.joy.y / 2.6 + '%'; pad.title = `x ${st.joy.x}, y ${st.joy.y}`; } };
      },
    },
    distance: {
      name: 'Distance sensor', icon: '📏', desc: 'Ultrasonic HC-SR04: how far away something is, in cm.', single: true, wide: true, pins: () => [23, 24],
      build() { return slider('📏 Distance', 2, 400, () => st.distance, v => { st.distance = v; }, ' cm'); },
    },
    dht: {
      name: 'Temperature & humidity', icon: '🌡️', desc: 'DHT22 sensor for the room’s temperature and humidity. (Emulator only for now.)', single: true, wide: true, pins: () => [4],
      build() {
        const a = slider('🌡️ Room temperature', -10, 50, () => st.roomTemp, v => { st.roomTemp = v; }, ' °C');
        const b = slider('💧 Humidity', 0, 100, () => st.humidity, v => { st.humidity = v; }, ' %');
        const box = el('div', 'emu-col'); box.append(a.el, b.el);
        return { el: box, update() { a.update(); b.update(); } };
      },
    },
    motion: {
      name: 'Motion sensor', icon: '👋', desc: 'A PIR sensor that notices movement. Click “wave” to trigger it.', config: ['pin'], defaults: { pin: 4 }, pins: p => [p.pin],
      build() {
        const b = el('button', 'emu-toggle', '👋 Wave'); b.type = 'button';
        b.onclick = () => { st.motion = true; clearTimeout(st.motionTimer); st.motionTimer = setTimeout(() => { st.motion = false; }, 3000); };
        return { el: b, update() { b.classList.toggle('on', st.motion); } };
      },
    },
  };
  const DEFAULT_KIT = [
    { type: 'led', pin: 17, color: '#ff3b30' }, { type: 'led', pin: 27, color: '#34c759' }, { type: 'rgb' }, { type: 'button', pin: 16 },
    { type: 'buzzer', pin: 22 }, { type: 'servo', pin: 18 }, { type: 'fan' }, { type: 'lcd' }, { type: 'pot' }, { type: 'distance' }, { type: 'motion', pin: 4 },
  ];
  const GPIO_CHOICES = [4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

  function pinUsage(except) {
    const use = {};
    for (const p of st.parts) if (p !== except) for (const pin of TYPES[p.type].pins(p)) (use[pin] = use[pin] || []).push(p);
    return use;
  }
  const partLabel = p => (p.type === 'led' ? `${(LED_COLORS.find(c => c[1] === p.color) || ['', ''])[0]} LED`.replace(/^./, c => c.toUpperCase()) : TYPES[p.type].name);

  // ---------- requests from Pi blocks / the Pi console (same shape as pi-bridge.py replies) ----------
  function handle(path, body) {
    body = body || {};
    if (path === '/info') return { hostname: 'raspberrypi', model: 'Raspberry Pi 5 Model B (emulator)', temp: Math.round(st.temp * 10) / 10, gpio: true, user: 'pi', cwd: st.cwd, home: '/home/pi', emulator: true };
    if (path === '/gpio') return gpio(body);
    if (path === '/hw') return hw(body);
    if (path === '/exec') return shell(String(body.cmd || ''));
    if (path === '/python') return { stdout: '', stderr: 'The emulator can’t run Python files. Use “▶ Run in browser”, or switch the 🍓 Pi 5 tab to Real Pi.\n', code: 1 };
    throw new Error('The emulator does not know ' + path);
  }

  function gpio({ action, pin, value }) {
    pin = Number(pin);
    if (!(pin >= 0 && pin <= 27)) throw new Error('GPIO pin must be between 0 and 27');
    if (action === 'write') { st.pins[pin] = { mode: 'out', value: value ? 1 : 0 }; return ok; }
    if (action === 'pwm') { st.pins[pin] = { mode: 'pwm', value: clamp(Number(value) || 0, 0, 100) / 100 }; return ok; }
    if (action === 'read' || action === 'pressed') {
      if (st.parts.some(p => p.type === 'motion' && p.pin === pin)) return { value: st.motion };
      // Inputs use a pull-up, so a pressed button (or tipped tilt switch) pulls the pin low.
      const sw = st.parts.find(p => (p.type === 'button' || p.type === 'tilt') && p.pin === pin);
      const low = sw ? !!(sw.pressed || sw.tilted) : st.pins[pin] ? !st.pins[pin].value : false;
      return { value: action === 'pressed' ? low : !low };
    }
    throw new Error('Unknown GPIO action ' + action);
  }

  const need = (type, what) => { if (!st.parts.some(p => p.type === type)) throw new Error(`Add a ${TYPES[type].name} to the emulator first (＋ Add part) to use ${what}.`); };
  function hw(b) {
    switch (b.device) {
      case 'servo': st.servo[Number(b.pin) || 18] = clamp(Number(b.angle) || 0, 0, 180); return ok;
      case 'lcd':
        if (b.action === 'clear') st.lcd.lines = ['', ''];
        else if (b.action === 'backlight') st.lcd.backlight = !!b.on;
        else st.lcd.lines[Number(b.line) === 2 ? 1 : 0] = String(b.text).slice(0, 16);
        return ok;
      case 'oled':
        need('oled', 'OLED blocks');
        if (b.action === 'clear') st.oled = ['', '', '', ''];
        else st.oled[clamp(Math.round(Number(b.line) || 1), 1, 4) - 1] = String(b.text).slice(0, 16);
        return ok;
      case 'segment': need('segment', 'the 4-digit display'); st.seg = String(b.text).slice(0, 4); return ok;
      case 'neopixel': {
        need('neopixel', 'NeoPixel blocks');
        const c = [b.r, b.g, b.b].map(x => clamp(Number(x) || 0, 0, 1));
        if (b.action === 'clear') st.neo = st.neo.map(() => [0, 0, 0]);
        else if (b.action === 'fill') st.neo = st.neo.map(() => c.slice());
        else { const i = Math.round(Number(b.index)) - 1; if (i >= 0 && i < 8) st.neo[i] = c; }
        return ok;
      }
      case 'traffic': {
        const on = { red: [1, 0, 0], amber: [0, 1, 0], green: [0, 0, 1], all: [1, 1, 1], off: [0, 0, 0] }[b.light] || [0, 0, 0];
        TRAFFIC.forEach((pin, i) => { st.pins[pin] = { mode: 'out', value: on[i] }; });
        return ok;
      }
      case 'bargraph': {
        const v = clamp(Number(b.value) || 0, 0, 100) / 100 * BAR.length;
        BAR.forEach((pin, i) => { st.pins[pin] = { mode: 'pwm', value: clamp(v - i, 0, 1) }; });
        return ok;
      }
      case 'motor': st.motor.dir = ['forward', 'backward'].includes(b.dir) ? b.dir : 'stop'; st.motor.speed = clamp(Number(b.speed) || 0, 0, 100); return ok;
      case 'fan': st.fanMode = String(b.mode); return ok;
      case 'buzzer': beep(Number(b.note) || 60, Number(b.secs) || 0.5); return ok;
      case 'rgb': st.rgb = [b.r, b.g, b.b].map(x => clamp(Number(x) || 0, 0, 1)); return ok;
      case 'read': {
        const sensor = b.sensor;
        const owner = { temperature: 'dht', humidity: 'dht', light: 'light', joyx: 'joystick', joyy: 'joystick' }[sensor];
        if (owner) need(owner, 'that sensor');
        return { value: { pot: st.pot, distance: st.distance, motion: st.motion, fan: Math.round(st.fan), temperature: st.roomTemp, humidity: st.humidity, light: st.light, joyx: st.joy.x, joyy: st.joy.y }[sensor] };
      }
    }
    throw new Error('Unknown device ' + b.device);
  }

  // ---------- pretend Pi shell ----------
  const FILES = { 'hello.py': 'print("Hello from the Raspberry Pi emulator!")\n', 'README.txt': 'This is an emulated Raspberry Pi 5. Try: pinout, pinctrl get, vcgencmd measure_temp, help\n' };
  const DIRS = ['Desktop', 'Documents', 'Downloads', 'claude-blocks'];
  const out = (stdout, stderr = '', code = 0) => ({ stdout, stderr, code, cwd: st.cwd });
  function pinTable() {
    const use = pinUsage();
    let s = 'GPIO  STATE              PART\n';
    for (let p = 0; p <= 27; p++) {
      const v = st.pins[p], sw = st.parts.find(x => (x.type === 'button' || x.type === 'tilt') && x.pin === p);
      const state = sw ? ((sw.pressed || sw.tilted) ? 'lo (pressed)' : 'hi (pull-up)') : !v ? 'input, pull-up' : v.mode === 'pwm' ? `pwm ${Math.round(v.value * 100)}%` : v.value ? 'output hi' : 'output lo';
      s += `${String(p).padStart(2)}    ${state.padEnd(19)}${(use[p] || []).map(partLabel).join(', ')}\n`;
    }
    return s;
  }
  function shell(line) {
    const cmd = line.trim().replace(/^sudo\s+/, '');
    const [name, ...args] = cmd.split(/\s+/);
    const up = Math.round((Date.now() - st.boot) / 60000);
    switch (name) {
      case '': return out('');
      case 'help': return out('This is an emulated Raspberry Pi 5. Commands you can try:\n  ls  pwd  cd  cat  echo  whoami  hostname  uname -a  date  uptime  free -h  df -h\n  vcgencmd measure_temp   vcgencmd get_throttled\n  pinout                  pinctrl get     pinctrl set 17 op dh   (or dl)\n');
      case 'ls': return out(st.cwd === '/home/pi' ? [...DIRS, ...Object.keys(FILES)].join('  ') + '\n' : '');
      case 'pwd': return out(st.cwd + '\n');
      case 'cd': {
        const t = (args[0] || '~').replace(/\/$/, '');
        if (t === '~' || t === '/home/pi') st.cwd = '/home/pi';
        else if (t === '..') st.cwd = st.cwd === '/home/pi' ? '/home' : '/home/pi';
        else if (DIRS.includes(t) && st.cwd === '/home/pi') st.cwd = '/home/pi/' + t;
        else return out('', `cd: ${t}: No such file or directory\n`, 1);
        return out('');
      }
      case 'cat':
        if (args[0] === '/proc/device-tree/model') return out('Raspberry Pi 5 Model B Rev 1.0\n');
        if (FILES[args[0]] && st.cwd === '/home/pi') return out(FILES[args[0]]);
        return out('', `cat: ${args[0] || ''}: No such file or directory\n`, 1);
      case 'echo': return out(args.join(' ').replace(/^["']|["']$/g, '') + '\n');
      case 'whoami': return out('pi\n');
      case 'hostname': return out('raspberrypi\n');
      case 'uname': return out(args.includes('-a') ? 'Linux raspberrypi 6.6.51+rpt-rpi-2712 #1 SMP PREEMPT Debian aarch64 GNU/Linux\n' : 'Linux\n');
      case 'date': return out(new Date().toString() + '\n');
      case 'uptime': return out(` ${new Date().toTimeString().slice(0, 8)} up ${up} min,  1 user,  load average: ${(st.load / 25).toFixed(2)}, ${(st.load / 30).toFixed(2)}, ${(st.load / 35).toFixed(2)}\n`);
      case 'free': return out('               total        used        free\nMem:           7.9Gi       1.2Gi       6.7Gi\nSwap:          511Mi          0B       511Mi\n');
      case 'df': return out('Filesystem      Size  Used Avail Use% Mounted on\n/dev/mmcblk0p2   58G  6.1G   49G  12% /\n');
      case 'vcgencmd':
        if (args[0] === 'measure_temp') return out(`temp=${st.temp.toFixed(1)}'C\n`);
        if (args[0] === 'get_throttled') return out(`throttled=${st.temp > 80 ? '0x80008' : '0x0'}\n`);
        return out('', 'vcgencmd: try measure_temp or get_throttled\n', 1);
      case 'pinctrl': case 'gpio':
        if (args[0] === 'set' && args[1] != null) {
          const pin = Number(args[1]), level = args.slice(2).join(' ');
          if (/dh|hi|1/.test(level)) gpio({ action: 'write', pin, value: true });
          else if (/dl|lo|0/.test(level)) gpio({ action: 'write', pin, value: false });
          return out('');
        }
        return out(pinTable());
      case 'pinout': {
        let s = 'Raspberry Pi 5 (emulator) — parts in your kit:\n';
        for (const p of st.parts) { const pins = TYPES[p.type].pins(p); s += `  ${partLabel(p).padEnd(24)}${pins.length ? 'GPIO ' + pins.join(', ') : p.type === 'fan' ? 'fan header' : '(no pins)'}\n`; }
        return out(s);
      }
      case 'python3': case 'python': return out('', 'Python isn’t available in the emulator. Use Code Editor → “▶ Run in browser”.\n', 1);
      default: return out('', `bash: ${name}: command not found (type help to see what the emulator can do)\n`, 127);
    }
  }

  // ---------- UI ----------
  // Physical 40-pin header (pin number -> BCM GPIO, or a power/ground label).
  const HEADER = [null, '3V3', '5V', 2, '5V', 3, 'GND', 4, 14, 'GND', 15, 17, 18, 27, 'GND', 22, 23, '3V3', 24, 10, 'GND', 9, 25, 11, 8, 'GND', 7, 'ID', 'ID', 5, 'GND', 6, 12, 13, 'GND', 19, 16, 26, 20, 'GND', 21];
  const root = $('#piEmu');
  root.innerHTML = `
    <div class="emu-board">
      <div class="emu-chip"><b>Raspberry Pi 5</b><small>emulator</small></div>
      <div class="emu-stat"><small>CPU temp</small><b id="emTemp">–</b></div>
      <div class="emu-stat"><small>Fan</small><b id="emFanPct">–</b></div>
      <label class="emu-load"><small>CPU load <span id="emLoadVal"></span></small><input type="range" id="emLoad" min="0" max="100" value="20"></label>
    </div>
    <div class="emu-header" id="emHeader" aria-label="GPIO header"></div>
    <div class="emu-grid" id="emParts"></div>
    <div class="row"><button type="button" class="small primary" id="emAdd">＋ Add part</button><span class="spacer"></span><button type="button" class="small" id="emReset">↺ Reset kit</button></div>`;
  const header = $('#emHeader'), pinEls = {};
  for (const row of [2, 1]) {
    for (let phys = row; phys <= 40; phys += 2) {
      const lab = HEADER[phys], d = el('span', 'pin ' + (typeof lab === 'number' ? 'gpio' : lab === 'GND' ? 'gnd' : lab === 'ID' ? 'id' : 'pwr'));
      d.title = `Pin ${phys} · ${typeof lab === 'number' ? 'GPIO ' + lab : lab}`;
      if (typeof lab === 'number') pinEls[lab] = d;
      header.appendChild(d);
    }
  }
  $('#emLoad').oninput = e => { st.load = +e.target.value; };

  let ui = [];
  function renderParts() {
    const grid = $('#emParts'), use = pinUsage();
    grid.textContent = '';
    ui = st.parts.map(p => {
      const t = TYPES[p.type], part = t.build(p), card = el('div', 'emu-part' + (t.wide ? ' wide' : ''));
      // I²C (2, 3) and SPI (8–11) are buses that many parts can share; any other pin used twice gets a warning.
      const pins = t.pins(p), clash = pins.filter(pin => !BUS_PINS.includes(pin) && use[pin].some(o => o !== p));
      const del = el('button', 'emu-del', '×'); del.type = 'button'; del.title = 'Remove part';
      del.onclick = () => { st.parts.splice(st.parts.indexOf(p), 1); changed(); };
      card.append(del, part.el, el('span', null, partLabel(p)), el('small', null, (pins.length ? `GPIO ${pins.join(' · ')}` : p.type === 'fan' ? 'fan header' : 'emulator only') + (clash.length ? ` ⚠ shares GPIO ${clash.join(', ')}` : '')));
      if (clash.length) card.classList.add('clash');
      grid.appendChild(card);
      return part;
    });
    if (!st.parts.length) grid.appendChild(el('div', 'emu-empty', 'No parts yet — click ＋ Add part.'));
    update();
  }
  function changed() { renderParts(); if (CB.scheduleSave) CB.scheduleSave(); }

  function update() {
    $('#emTemp').textContent = st.temp.toFixed(1) + '°C';
    $('#emTemp').style.color = st.temp > 75 ? '#ff8a80' : st.temp > 60 ? '#ffd27a' : '';
    $('#emFanPct').textContent = st.parts.some(p => p.type === 'fan') ? Math.round(st.fan) + '%' : 'none';
    $('#emLoadVal').textContent = st.load + '%';
    for (const part of ui) part.update();
    const sw = st.parts.filter(p => p.type === 'button' || p.type === 'tilt');
    for (const [p, e] of Object.entries(pinEls)) {
      const pin = Number(p), s = sw.find(x => x.pin === pin);
      const v = s ? ((s.pressed || s.tilted) ? 0 : 1) : st.parts.some(x => x.type === 'motion' && x.pin === pin) ? (st.motion ? 1 : 0) : pinVal(pin);
      e.classList.toggle('on', v > 0);
      e.style.opacity = st.pins[p] && st.pins[p].mode === 'pwm' ? 0.35 + 0.65 * v : '';
    }
  }

  // Temperature model: CPU load heats the chip, the active cooler cools it (Pi 5 default fan curve in "auto").
  setInterval(() => {
    const hasFan = st.parts.some(p => p.type === 'fan');
    const curve = t => (t < 50 ? 0 : t < 60 ? 30 : t < 67.5 ? 50 : t < 75 ? 70 : 100);
    const target = !hasFan ? 0 : ({ auto: curve(st.temp), off: 0, low: 30, medium: 50, high: 70, full: 100 }[st.fanMode] ?? 0);
    st.fan += (target - st.fan) * 0.25;
    st.temp += (38 + st.load * 0.47 - st.fan * 0.2 - st.temp) * 0.04;
    buzzerHum(st.parts.some(p => p.type === 'buzzer' && pinVal(p.pin) > 0));
    update();
  }, 200);
  (function animate() { for (const part of ui) if (part.frame) part.frame(); requestAnimationFrame(animate); })();

  // ---------- add-part dialog ----------
  const dlg = $('#partsDialog'), lib = $('#partsList'), cfg = $('#partConfig');
  function openLibrary() {
    lib.textContent = ''; cfg.hidden = true;
    for (const [type, t] of Object.entries(TYPES)) {
      const have = t.single && st.parts.some(p => p.type === type);
      const card = el('button', 'part-card'); card.type = 'button'; card.disabled = have;
      card.append(el('span', 'part-icon', t.icon), el('b', null, t.name), el('small', null, have ? 'Already in your kit' : t.desc));
      card.onclick = () => (t.config ? configure(type) : add({ type }));
      lib.appendChild(card);
    }
    dlg.showModal();
  }
  function configure(type) {
    const t = TYPES[type], use = pinUsage(), p = { type, ...t.defaults };
    if (use[p.pin]) p.pin = GPIO_CHOICES.find(g => !use[g]) ?? p.pin;
    cfg.hidden = false; cfg.textContent = '';
    cfg.appendChild(el('b', null, `${t.icon} ${t.name}`));
    const pinSel = el('select'); pinSel.setAttribute('aria-label', 'GPIO pin');
    for (const g of GPIO_CHOICES) pinSel.add(new Option(`GPIO ${g}${use[g] ? ` (used by ${use[g].map(partLabel).join(', ')})` : ''}`, g));
    pinSel.value = p.pin;
    const pinLab = el('label', null, 'Pin '); pinLab.appendChild(pinSel); cfg.appendChild(pinLab);
    let colorSel = null;
    if (t.config.includes('color')) {
      colorSel = el('select'); colorSel.setAttribute('aria-label', 'LED colour');
      for (const [n, c] of LED_COLORS) colorSel.add(new Option(n, c));
      const free = LED_COLORS.find(([, c]) => !st.parts.some(x => x.type === 'led' && x.color === c));
      colorSel.value = (free || LED_COLORS[0])[1];
      const cl = el('label', null, 'Colour '); cl.appendChild(colorSel); cfg.appendChild(cl);
    }
    const addBtn = el('button', 'primary small', 'Add to kit'); addBtn.type = 'button';
    addBtn.onclick = () => add({ ...p, pin: Number(pinSel.value), ...(colorSel ? { color: colorSel.value } : {}) });
    cfg.appendChild(addBtn);
    cfg.scrollIntoView({ block: 'nearest' });
  }
  function add(p) { st.parts.push(p); dlg.close(); changed(); }
  $('#emAdd').onclick = openLibrary;
  $('#emReset').onclick = async () => {
    if (await CB.confirm('Put the emulator back to the starter kit? Parts you added will be removed.', 'Reset kit')) setParts(null);
  };

  function setParts(list) {
    st.parts = (Array.isArray(list) ? list : DEFAULT_KIT).filter(p => TYPES[p && p.type]).map(p => ({ ...p }));
    changed();
  }
  const getParts = () => st.parts.map(({ pressed, tilted, ...p }) => p);

  setParts(CB.pendingPiParts);
  rt.piEmulator = { handle };
  CB.piEmu = { state: st, getParts, setParts, defaultKit: () => DEFAULT_KIT.map(p => ({ ...p })) };
})();
