# DayDreaming

A 3D first-person puzzle prototype set in a liminal "backrooms" space, built with
[Three.js](https://threejs.org/) + [Vite](https://vitejs.dev/).

## What's here

- A first-person controller (pointer-lock mouse look, WASD movement, simple wall collision).
- A procedurally-textured backrooms corridor (yellow wallpaper, damp carpet, flickering
  fluorescent ceiling panels) — no external art assets required.
- A working environmental puzzle: pull all three levers (walk up, look at one, press **E**)
  to unlock the door at the far end and win.

This is a scaffold / vertical slice, not a full game — it's meant as a starting point to keep
building rooms, puzzles, and mechanics on top of.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`) in a browser. Click the
screen to lock the pointer and start playing.

## Building for production

```bash
npm run build
npm run preview   # serve the built dist/ folder locally to test it
```

The `dist/` folder is fully static — deploy it anywhere that serves static files (GitHub Pages,
Netlify, Vercel, an S3 bucket, etc).

## Where to go from here

- `src/main.js` currently holds everything (scene setup, movement, puzzle logic) in one file —
  as the game grows, split it into modules (e.g. `player.js`, `room.js`, `puzzles/lever-door.js`).
- Add more rooms by extending the wall/collider generation and chaining puzzles together.
- Swap the procedural canvas textures for real image/texture assets once you have art direction
  locked in.
- Consider a state manager (even a simple object) once you have multiple puzzles and rooms to
  track completion across.
- No monetization or platform-specific build config is wired up yet — add that when you're ready
  to ship (e.g. `vite build` output works as-is for web; wrapping in Electron/Tauri would get you
  a desktop build if you want a native app instead of a browser tab).
