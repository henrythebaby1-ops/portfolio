# Portfolio

My projects in one place: AI tools, developer tools, strategy games and chess bots. Every project can be played from the site.

## Run it

```bash
node serve.mjs
```

Open http://localhost:5500. This also starts the projects that need their own server (multiplayer chess, Localhoster and Fileupdater) when their code is next to this folder.

## What's inside

- `index.html`: the site
- `projects.js`: the list of projects. Add one there and it shows up on the site and in "Playtest everything"
- `bits.js`: interactive effects based on React Bits (click spark, rotating text, decrypted text, spotlight cards, magnet buttons, dock, count up)
- `games/`: playable copies of each browser project
- `shots/`: screenshots for the project cards

Projects that run on their own server (Multiplayer Chess, Localhoster, Fileupdater, Claude Blocks) only work when running locally. Stacks, studyoung and Blank AI need your own OpenRouter key.
