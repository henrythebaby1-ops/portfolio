# 🖐 HandMouse

Control your computer cursor using hand gestures via webcam — built with Electron + MediaPipe.

## Gestures

| Gesture | Action |
|---------|--------|
| 🖐 Open hand | Move cursor |
| ✊ Fist | Left click |
| ☝ Index finger only | Right click |
| `ESC` key | Stop tracking |

## Setup & Run

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A webcam
- Internet connection (MediaPipe loads from CDN)

### Platform-specific requirements for cursor control

**macOS:**
- Go to **System Settings → Privacy & Security → Accessibility**
- Add your Terminal app (or the HandMouse app) and enable it
- This is required for cursor movement via AppleScript

**Linux:**
- Install `xdotool`: `sudo apt install xdotool`

**Windows:**
- No extra setup needed (uses PowerShell)

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Run the app
npm start
```

### Build a standalone app (optional)

```bash
# Install electron-builder
npm install electron-builder --save-dev

# Build for your platform
npm run build-mac    # macOS .dmg
npm run build-win    # Windows .exe installer
npm run build-linux  # Linux AppImage
```

The built app will be in the `dist/` folder.

## How it works

1. **MediaPipe Hands** detects 21 hand landmarks from your webcam feed
2. Landmark positions are mapped to your screen coordinates
3. Cursor moves are sent to the OS via native commands (AppleScript/xdotool/PowerShell)
4. Gesture recognition checks finger extension to detect open hand vs fist vs point

## Settings

- **Sensitivity** — How much the cursor moves relative to hand movement
- **Smoothing** — Reduces jitter (higher = smoother but laggier)

## Troubleshooting

**Cursor doesn't move:**
- macOS: Grant Accessibility permissions to Terminal/app
- Linux: Install `xdotool`
- Windows: Run as Administrator if PowerShell is blocked

**Camera not working:**
- Grant camera permissions when prompted
- Make sure no other app is using the camera

**Hand not detected:**
- Ensure good lighting
- Keep hand within frame
- Try adjusting sensitivity
