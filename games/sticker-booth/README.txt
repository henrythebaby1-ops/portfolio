STICKER BOOTH — build your own macOS app (.dmg)
================================================

What's in this folder
----------------------
- index.html   -> the actual sticker-booth app (camera + face tracking + accessories)
- main.js      -> tiny Electron wrapper that opens index.html in its own app window
- package.json -> build configuration

Why you build the .dmg yourself
--------------------------------
Turning this into a real double-clickable macOS .dmg requires Apple's own
disk-image tool (hdiutil), which only runs on macOS. I put together and
tested the app itself, but I can't produce the final .dmg file from here —
you'll do that last step on your own Mac, and it only takes a couple of
minutes.

How to build it (on your Mac)
-------------------------------
1. Install Node.js if you don't have it: https://nodejs.org (LTS version)
2. Open Terminal and go into this folder, e.g.:
     cd ~/Downloads/StickerBoothApp
3. Install dependencies:
     npm install
4. Build the .dmg:
     npm run dist
5. Look in the new "dist" folder — you'll find "Sticker Booth-1.0.0.dmg".
   Double-click it, drag the app into Applications, and you're done.

The first time you open the app, macOS will ask for Camera permission —
click Allow. Everything runs locally; no video ever leaves your Mac.

Just want to try it right now, no install?
--------------------------------------------
Double-click index.html and open it in Chrome or Safari — the exact same
app runs right in the browser tab.
