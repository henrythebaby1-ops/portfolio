// Every project on the site. Add one here and it shows up in Projects and in "Playtest everything".
//   play:  link to open it
//   port:  set for projects that need their own server (status is checked live)
//   shot:  screenshot in shots/ (leave out to use the art in `art`)
const PROJECTS = [
  { id: 'opencode', name: 'OpenCode', cat: 'ai tools', featured: true, shot: 'opencode.jpg', play: 'https://henrythebaby1-ops.github.io/OpenCode/',
    desc: 'An AI coding workspace that runs entirely on your own machine using local models through Ollama. Type a prompt and get a working project.',
    bullets: ['5 modes: build, fix, design, talk, ship', 'Built-in terminal, file explorer and live code sandbox', 'Voice chat with on-device text-to-speech', '40+ animated WebGL backgrounds and themes'],
    tags: ['React', 'Vite', 'Ollama', 'Three.js', 'GSAP'], note: 'Chat needs Ollama running on this computer.' },
  { id: 'paradise', name: 'The Other Side of Paradise', cat: 'games', shot: 'paradise.jpg', play: 'https://henrythebaby1-ops.github.io/the-other-side-of-paradise/',
    extra: { label: 'PICO 4 emulator →', href: 'https://henrythebaby1-ops.github.io/the-other-side-of-paradise/pico-emulator.html' },
    desc: "A VR puzzle game set to Glass Animals. Wake up in Professor Ersheim's room of illusions, escape it, then find the number between 3 and 4.",
    bullets: ['Play with mouse and keyboard, or in a VR headset', 'PICO 4 emulator mode: try the VR version without a headset'],
    tags: ['WebXR', 'Three.js', 'VR'] },
  { id: 'breakfast', name: 'The Breakfast', cat: 'games', shot: 'breakfast.jpg', play: 'https://henrythebaby1-ops.github.io/the-breakfast/',
    desc: 'A two-player cooking game on one keyboard. Player one presses A to stop pieces sideways, player two presses L to stop them up and down, and together you plate the order.',
    bullets: ['Easy, Normal and Hard (rush hour) modes', 'A breakfast remake of The Dinner by Deanna Zhao'],
    tags: ['Two players', 'JavaScript', 'Game jam remake'] },
  { id: 'worstfish', name: 'Worstfish', cat: 'games ai', shot: 'worstfish.jpg', play: 'games/worstfish.html',
    desc: 'A real chess engine that searches every line properly, then plays the move that helps you most. It wins almost never.',
    bullets: ['Live eval bar and a "worst first" shortlist', 'Roasts its own blunders', 'Worstfish vs Worstfish mode'],
    tags: ['JavaScript', 'Negamax search', 'chess.js'] },
  { id: 'poolrooms', name: 'Level 37 Poolrooms', cat: 'games', shot: 'poolrooms.jpg', play: 'games/poolrooms.html',
    desc: 'A first-person Backrooms game filmed like a found camcorder tape. Every level on the Backrooms Wiki is playable, and each exit is sealed until you solve its puzzle.',
    tags: ['Three.js', 'WebGL', 'Procedural levels'] },
  { id: 'imperium', name: 'IMPERIUM', cat: 'games', shot: 'imperium.jpg', play: 'games/imperium.html',
    desc: 'Turn-based world conquest. Pick an era and a civilization, recruit armies, run diplomacy and keep your people happy, or face protests and impeachment.',
    tags: ['JavaScript', 'Strategy', 'Save games'] },
  { id: 'sky-force', name: 'Sky Force', cat: 'games', shot: 'sky-force.jpg', play: 'games/sky-force.html',
    desc: 'Arcade shooter with a 10-mission campaign across space and land, plus Survival, Bomb Rush and Boss Rush modes.',
    tags: ['Canvas', 'Arcade', 'Bosses'] },
  { id: 'claude-blocks', name: 'Claude Blocks', cat: 'tools ai', shot: 'claude-blocks.jpg', play: 'http://localhost:8642/', port: 8642,
    desc: 'A Scratch-style block coding app where Claude is the sprite. Drag blocks, animate costumes and add 3D. Runs as a Mac app and on the web.',
    tags: ['Block coding', 'Three.js', 'Mac app'] },
  { id: 'fileupdater', name: 'Fileupdater', cat: 'tools', shot: 'fileupdater.jpg', play: 'http://localhost:8790/', port: 8790,
    desc: 'A shared file manager. Make an account, create or join a workspace by invite, and everyone sees edits instantly. Older versions stay in History.',
    tags: ['Node.js', 'Accounts', 'Live sync'] },
  { id: 'doom-vault', name: 'Doom Vault', cat: 'tools', shot: 'doom-vault.jpg', play: 'games/doom-vault.html',
    desc: 'Keeps every version of your files. Connect a file or folder once, press Update files, and download any older copy later.',
    tags: ['File System Access', 'Versioning'] },
  { id: 'the-room', name: 'The Room', cat: 'games', shot: 'the-room.jpg', play: 'games/the-room.html',
    desc: 'Something wakes up in a room. Feed it, pet it, build it furniture, or punish it. It gets more aware the longer you play.',
    tags: ['JavaScript', 'Simulation', 'AI'] },
  { id: 'top-banana', name: 'Top Banana', cat: 'games', shot: 'top-banana.jpg', play: 'games/top-banana.html',
    desc: 'A banana clicker with combos, clicks per second and a monkey crew you hire to peel for you.',
    tags: ['Clicker', 'JavaScript'] },
  { id: 'stacks', name: 'Stacks: Library AI', cat: 'ai', shot: 'stacks.jpg', play: 'games/stacks.html',
    desc: 'Describe what you feel like reading and get book picks with live links to Santa Clara County Library availability.',
    tags: ['OpenRouter', 'AI search'], note: 'Needs an OpenRouter key.' },
  { id: 'studyoung', name: 'studyoung', cat: 'ai', shot: 'studyoung.jpg', play: 'games/studyoung.html',
    desc: 'Study smarter, not longer: paste your notes and get flashcards and quizzes, from a built-in generator or a real AI model.',
    tags: ['Flashcards', 'OpenRouter'] },
  { id: 'blank-ai', name: 'Blank AI (API Bench)', cat: 'ai tools', shot: 'blank-ai.jpg', play: 'games/blank-ai.html',
    desc: 'Test an OpenRouter key: write a prompt, pick a model and watch the live response. Admins can share house keys.',
    tags: ['OpenRouter', 'API testing'] },
  { id: 'freecard', name: 'FreeCard', cat: 'games tools', play: 'games/freecard.html',
    art: '<div class="art-freecard"><b>💎</b><span>FreeCard</span><small>Everything free</small></div>',
    desc: 'A Discord-style chat app where everything is free: servers, DMs, a games tab, a shop and Nitro.',
    tags: ['JavaScript', 'Chat UI'] },
  { id: 'claude-terminal', name: 'Claude Terminal', cat: 'ai tools', shot: 'claude-terminal.jpg', play: 'games/claude-terminal.html',
    desc: 'A terminal-style workspace with a code editor, file explorer and chat panel, with Clawd the pixel mascot.',
    tags: ['HTML', 'CSS', 'JavaScript'] },
  { id: 'localhoster', name: 'Localhoster', cat: 'tools', shot: 'localhoster.jpg', play: 'http://localhost:4000/', port: 4000,
    desc: 'Free local hosting for HTML sites and Node servers, run from a dashboard on your computer. One click puts a site online.',
    tags: ['Node.js', 'Zero deps', 'Cloudflare'] },
  { id: 'chess', name: 'Multiplayer Chess', cat: 'games', shot: 'chess.jpg', play: 'http://localhost:3000/', port: 3000,
    desc: 'Real-time chess: create a room, share the code, and play a friend in the browser.',
    tags: ['Node.js', 'Socket.IO'] },
  { id: 'chessly', name: 'Chessly', cat: 'games', shot: 'chessly.jpg', play: 'games/chessly.html',
    desc: 'A clean chess board with all the rules: castling, en passant, undo and flip board.',
    tags: ['JavaScript', 'Chess'] },
  { id: 'platformer', name: '3D Platformer', cat: 'games', shot: 'platformer.jpg', play: 'games/platformer.html',
    desc: 'A Three.js platformer starter: run, jump and land on floating platforms.',
    tags: ['Three.js', '3D'] },
  { id: 'jumpscare', name: 'this is a jumpscare', cat: 'games', play: 'games/jumpscare.html',
    art: '<div class="art-jump">there is no<br>jumpscare here.</div>',
    desc: 'It is not a jumpscare. It is a very long, very polite page about waiting.',
    tags: ['HTML', 'Comedy'] },
  { id: 'gamemode-tag', name: 'Gamemode Tag', cat: 'games tools', shot: 'gamemode-tag.jpg', play: 'https://henrythebaby1-ops.github.io/gamemode-tag/',
    desc: 'A voting site for Challenger Strawberry Park: players vote on the next tag gamemode (Classic, Freeze, Infection) and admins run the rounds.',
    tags: ['Supabase', 'Voting', 'Live'] },
  { id: 'claude-blocks-site', name: 'Claude Blocks: Download Site', cat: 'tools ai', shot: 'claude-blocks-site.jpg', play: 'games/claude-blocks-site/index.html',
    desc: 'The download page for Claude Blocks: code with blocks, 15 lessons, 44 templates, 141 sprites, an AI helper, 3D worlds and Raspberry Pi 5 support.',
    tags: ['Website', 'Mac', 'Android'] },
  { id: 'henry-universe', name: 'Henry Universe Hub', cat: 'games', shot: 'henry-universe.jpg', play: 'games/henry-universe/index.html',
    desc: 'One hub for all of Henry\'s game collections: the OG arcade, the Studio game maker, Imperium and online 3D multiplayer.',
    tags: ['Hub', 'Multiplayer', '3D'] },
  { id: 'henrys-world', name: 'Henry\'s World Studio', cat: 'games tools', shot: 'henrys-world.jpg', play: 'games/henrys-world.html',
    desc: 'An arcade and game maker in one: Sky Runner, Neon Snake, Meteor Blaster, a 2-player Arena Duel, a 3D Neon Tunnel and your own custom game.',
    tags: ['Game maker', '2 players', 'Canvas'] },
  { id: 'henrys', name: 'Henry\'s', cat: 'games', shot: 'henrys.jpg', play: 'games/henrys.html',
    desc: 'A gaming platform: play mini-games in the browser, upload an avatar, earn credits and spend them in the shop.',
    tags: ['Platform', 'Accounts', 'Shop'] },
  { id: 'darkwatch', name: 'DARKWATCH', cat: 'games', shot: 'darkwatch.jpg', play: 'games/darkwatch.html',
    desc: 'A survival horror first-person shooter. Survive waves in the dark, level up and keep your flashlight steady.',
    tags: ['FPS', 'Horror', 'Three.js'] },
  { id: 'deadzone', name: 'DEADZONE: Outbreak', cat: 'games', shot: 'deadzone.jpg', play: 'games/deadzone.html',
    desc: 'A zombie shooter: pick a callsign and a color and hold out against the outbreak.',
    tags: ['Shooter', 'Zombies'] },
  { id: 'daydreaming', name: 'DayDreaming', cat: 'games', shot: 'daydreaming.jpg', play: 'games/daydreaming/index.html',
    desc: 'A first-person liminal-space walk. The hum never stops and the lights never quite reach the corners.',
    tags: ['3D', 'Exploration'] },
  { id: 'zombie-beat', name: 'Zombie Beat Smash', cat: 'games', shot: 'zombie-beat.jpg', play: 'games/zombie-beat.html',
    desc: 'Zombies march to the drum: smash them on the beat, chain combos and grab airdrop weapons. You can even play to your own song.',
    tags: ['Rhythm', 'Music', 'Arcade'] },
  { id: 'chaos-sandbox', name: 'Chaos Sandbox', cat: 'games', shot: 'chaos-sandbox.jpg', play: 'games/chaos-sandbox.html',
    desc: 'A physics sandbox: spawn humans, zombies, melons and barrels, then hit them with rockets, lasers, black holes, storms and nukes.',
    tags: ['Physics', 'Sandbox'] },
  { id: 'bananas-caribbean', name: 'The Bananas of the Caribbean', cat: 'games', shot: 'bananas-caribbean.jpg', play: 'games/bananas-caribbean.html',
    desc: 'Sail island to island across the Caribbean, fight banana whales and banana snakes, and leave the sea banana-free.',
    tags: ['Adventure', 'Turn-based'] },
  { id: 'peppas', name: 'Five Nights at Peppa\'s', cat: 'games', shot: 'peppas.jpg', play: 'games/peppas/index.html',
    desc: 'A five-nights-style horror parody: watch the cameras, manage your power and shut the doors in time.',
    tags: ['Horror parody', 'Cameras'] },
  { id: 'fire-ice', name: 'Fire & Ice: Fake Temple', cat: 'games', shot: 'fire-ice.jpg', play: 'games/fire-ice.html',
    desc: 'A temple puzzle that pretends to be impossible, until you find the secret command.',
    tags: ['Puzzle', 'Platformer'] },
  { id: 'tangyuan', name: '汤圆勇者：拯救嘻嘻', cat: 'games', shot: 'tangyuan.jpg', play: 'games/tangyuan.html',
    desc: 'A Chinese pixel platformer: Tangyuan crosses 120 levels to save little sister Xixi. Includes a level maker and an endless runner mode.',
    tags: ['Platformer', '120 levels', 'Level maker'] },
  { id: 'snake-arena', name: 'Snake Arena', cat: 'games', shot: 'snake-arena.jpg', play: 'games/snake-arena.html',
    desc: 'Snake with custom skins and power-ups, solo or battling up to 10 friends.',
    tags: ['Multiplayer', 'Arcade'] },
  { id: 'blind-box', name: 'Blind Box Simulator', cat: 'games', shot: 'blind-box.jpg', play: 'games/blind-box.html',
    desc: 'Buy blind boxes, open them one at a time or ten at once, then build or sell your collection.',
    tags: ['Simulator', 'Collecting'] },
  { id: 'roboarena', name: 'RoboArena', cat: 'games', shot: 'roboarena.jpg', play: 'games/roboarena.html',
    desc: 'Build a VEX IQ robot, pick its AI and fight. Made for Professor Edgar\'s robotics class.',
    tags: ['Robotics', 'VEX IQ', 'Battle'] },
  { id: 'project-i', name: 'Project I', cat: 'games', shot: 'project-i.jpg', play: 'games/project-i/index.html',
    desc: 'An online world: enter a username and join other players in real time.',
    tags: ['Multiplayer', 'Online'] },
  { id: 'appel', name: 'Appel', cat: 'games', art: '<div class="art-scratch">Appel<small>made in Scratch</small></div>', play: 'games/appel/index.html',
    desc: 'A Scratch game packaged as a web page with TurboWarp.',
    tags: ['Scratch', 'TurboWarp'] },
  { id: 'show-of-hands', name: 'SHOW OF HANDS', cat: 'games ai', shot: 'show-of-hands.jpg', play: 'games/show-of-hands.html',
    desc: 'A gesture arcade: point your webcam at yourself and play rock paper scissors, a gun duel and more with just your hands. Solo or head-to-head.',
    tags: ['Webcam', 'Hand tracking', '2 players'] },
  { id: 'pose-shooter', name: 'POSE SHOOTER', cat: 'games ai', shot: 'pose-shooter.jpg', play: 'games/pose-shooter.html',
    desc: 'Your body is the controller: run in place to move, punch to shoot, lean to strafe.',
    tags: ['Webcam', 'Pose tracking'] },
  { id: 'handcam', name: 'HandCam', cat: 'tools ai', shot: 'handcam.jpg', play: 'games/handcam.html',
    desc: 'Control your screen with your hands: point to move, pinch to click, gesture to scroll, copy and paste. Plus AR drawing and body tag games.',
    tags: ['MediaPipe', 'Gestures'] },
  { id: 'handmouse', name: 'HandMouse', cat: 'tools ai', shot: 'handmouse.jpg', play: 'games/handmouse/index.html',
    desc: 'Turn your webcam into a mouse: open hand moves, a fist left-clicks, one finger right-clicks.',
    tags: ['Webcam', 'Accessibility'] },
  { id: 'sticker-booth', name: 'Sticker Booth', cat: 'tools', shot: 'sticker-booth.jpg', play: 'games/sticker-booth/index.html',
    desc: 'A camera photo booth: pick a hat, add floating stickers and strike a pose.',
    tags: ['Camera', 'Fun'] },
  { id: 'clawd-street', name: 'Clawd Street', cat: 'games', shot: 'clawd-street.jpg', play: 'games/clawd-street/index.html',
    desc: 'An 8-bit street where Clawd walks by day and sleeps at night. Feed it, drop potions and change the weather.',
    tags: ['Pixel art', 'Desktop pet'] },
  { id: 'solar-sandbox', name: 'Solar Sandbox', cat: 'games tools', shot: 'solar-sandbox.jpg', play: 'games/solar-sandbox.html',
    desc: 'A gravity sandbox: build solar systems, binary stars, black holes and galaxy collisions, then watch them play out.',
    tags: ['Physics', 'Space'] },
  { id: 'space-tracker', name: 'MAP: Space Tracker', cat: 'tools', shot: 'space-tracker.jpg', play: 'games/space-tracker.html',
    desc: 'A live space dashboard: ISS tracker, Mars rovers, 3D planets, asteroids, space weather and missions.',
    tags: ['Live data', 'Space'] },
  { id: 'pathogen', name: 'Pathogen', cat: 'games', shot: 'pathogen.jpg', play: 'games/pathogen/index.html',
    desc: 'Design a made-up disease, drop it in a country and watch it race the world\'s cure.',
    tags: ['Simulation', 'Strategy'] },
  { id: 'nova', name: 'NOVA AI', cat: 'ai', shot: 'nova.jpg', play: 'games/nova.html',
    desc: 'A sleek AI chat assistant for code, writing and big questions.',
    tags: ['AI chat'] },
  { id: 'blank-ai-v2', name: 'blank_ai v2', cat: 'ai', shot: 'blank-ai-v2.jpg', play: 'games/blank-ai-v2.html',
    desc: 'An AI chat app with switchable providers and models, memory and saves.',
    tags: ['AI chat', 'Multi-provider'], note: 'Needs your own API key.' },
  { id: 'claude-code-terminal', name: 'Claude Code Terminal', cat: 'ai tools', shot: 'claude-code-terminal.jpg', play: 'games/claude-code-terminal.html',
    desc: 'A Claude Code-style terminal for local Ollama models, with a model library and desktop or mobile layouts.',
    tags: ['Ollama', 'Terminal'], note: 'Chat needs Ollama running on this computer.' },
  { id: 'talkomatic-ai', name: 'Talkomatic AI Assistant', cat: 'ai tools', shot: 'talkomatic-ai.jpg', play: 'games/talkomatic-ai.html',
    desc: 'Writes AI chat replies you paste in yourself, so you stay in control and stay transparent.',
    tags: ['OpenRouter', 'Chrome extension'], note: 'Needs an OpenRouter key.' },
  { id: 'hummy', name: 'Hummy AI: Library Search', cat: 'ai', shot: 'hummy.jpg', play: 'games/hummy.html',
    desc: 'Search the Santa Clara County Library in plain words, keep a reading list and try "I\'m feeling lucky".',
    tags: ['OpenRouter', 'Library'], note: 'Needs an OpenRouter key.' },
  { id: 'duelforge', name: 'DuelForge', cat: 'ai', shot: 'duelforge.jpg', play: 'games/duelforge/home.html',
    desc: 'A set of subject-focused AI models (history, language, learning, coding, math, reading) plus a guide to making your own AI.',
    tags: ['AI', 'Learning'] },
  { id: 's-sim', name: 'S Sim', cat: 'games ai', shot: 's-sim.jpg', play: 'games/duelforge/s-sim/index.html',
    desc: 'Autopilot displays, flight AI and playful robots: a tablet-style self-driving view, plane autopilot and a robot zone.',
    tags: ['Simulation', 'Autopilot'] },
  { id: 'grammar-galaxy', name: 'Grammar Galaxy', cat: 'learn games', shot: 'grammar-galaxy.jpg', play: 'games/grammar-galaxy.html',
    desc: 'Five planets, five completely different grammar games. Earn stars and level up your Guardian.',
    tags: ['Grammar', 'Learning game'] },
  { id: 'grammarquest', name: 'GrammarQuest', cat: 'learn', shot: 'grammarquest.jpg', play: 'games/grammarquest.html',
    desc: 'Master English grammar one question at a time, with a mistake pad, leaderboard and break reminders (or a quick chess game).',
    tags: ['Grammar', 'Quiz'] },
  { id: 'grammar-arena', name: 'Grammar Arena', cat: 'learn games', shot: 'grammar-arena.jpg', play: 'games/grammar-arena/index.html',
    desc: 'A fast learning game: grammar first, plus math, history and English, with quests, blitz and pass-and-play duels.',
    tags: ['Learning', 'PvP'] },
  { id: 'word-sound', name: 'EchoType', cat: 'learn games', shot: 'word-sound.jpg', play: 'games/word-sound.html',
    desc: 'Hear it, type it: 10 listening-and-spelling modes from easy to extreme.',
    tags: ['Typing', 'Spelling'] },
  { id: 'capspin', name: 'CapSpin Championship', cat: 'tools', shot: 'capspin.jpg', play: 'games/capspin/index.html',
    desc: 'The official site for a marker-cap spinning league: events, registration, rules, logins and an admin page.',
    tags: ['Website', 'Accounts'] },
  { id: 'capspin-lesson', name: 'Capspin Lesson Place', cat: 'learn', shot: 'capspin-lesson.jpg', play: 'games/capspin-lesson/index.html',
    desc: 'Step-by-step lessons for spinning a marker cap, from setup to advanced moves.',
    tags: ['Lessons'] },
  { id: 'kingside', name: 'Kingside', cat: 'learn games', shot: 'kingside.jpg', play: 'games/kingside.html',
    desc: 'A chess learning platform: video courses, training games and opening theory, from beginner to club player.',
    tags: ['Chess', 'Courses'] },
  { id: 'kingside-courses', name: 'Kingside: Free Courses', cat: 'learn games', shot: 'kingside-courses.jpg', play: 'games/kingside-courses.html',
    desc: 'The free-courses version of Kingside.',
    tags: ['Chess', 'Free'] },
  { id: 'rvr', name: 'RVR Dynamics', cat: 'tools', shot: 'rvr.jpg', play: 'games/rvr/index.html',
    desc: 'A robotics company site ("Robots for everyone") with a Start Coding page.',
    tags: ['Website', 'Robotics'] },
  { id: 'rvr-videos', name: 'RVR Videos', cat: 'tools', shot: 'rvr-videos.jpg', play: 'games/rvr-videos.html',
    desc: 'A free 2D animation editor: drag shapes, set keyframes on a timeline, play it and download a video.',
    tags: ['Animation', 'Editor'] },
  { id: 'microbit-ide', name: 'micro:bit Deluxe IDE', cat: 'tools', shot: 'microbit-ide.jpg', play: 'games/microbit-ide.html',
    desc: 'Code a micro:bit in Python or blocks, run it on a simulated board, then flash it.',
    tags: ['micro:bit', 'Python', 'Blocks'] },
  { id: 'uno-bench', name: 'Uno Bench', cat: 'tools', shot: 'uno-bench.jpg', play: 'games/uno-bench/index.html',
    desc: 'An Arduino UNO workbench: write a sketch and watch it run on a simulated board.',
    tags: ['Arduino', 'Simulator'] },
  { id: 'smart-garden', name: 'The Official: Smart Garden', cat: 'tools', shot: 'smart-garden.jpg', play: 'games/smart-garden.html',
    desc: 'A smart garden companion app with accounts that tracks your plants as your garden grows.',
    tags: ['App', 'Gardening'] },
  { id: 'focus-planner', name: 'Focus Planner', cat: 'tools', shot: 'focus-planner.jpg', play: 'games/focus-planner/index.html',
    desc: 'Plan tasks by priority, then work through them with a focus timer.',
    tags: ['Productivity', 'Timer'] },
  { id: 'calling-app', name: 'Signal Flow Calls', cat: 'tools', shot: 'calling-app.jpg', play: 'games/calling-app/index.html',
    desc: 'A phone-style calling app with a dialer, contacts and recent calls.',
    tags: ['App UI'] },
  { id: 'elsewhere', name: 'Elsewhere Departures', cat: 'games', shot: 'elsewhere.jpg', play: 'games/elsewhere/index.html',
    desc: 'A departures board that sends you to a random website, with a trip log of where you\'ve been.',
    tags: ['Random', 'Web'] },
  { id: 'zoo-explorer', name: 'ZooExplorer', cat: 'learn', shot: 'zoo-explorer.jpg', play: 'games/zoo-explorer.html',
    desc: 'Browse 100+ animals with photos, scientific names and facts.',
    tags: ['Animals', 'Learning'] },
  { id: 'hbit', name: 'H-BIT', cat: 'tools', shot: 'hbit.jpg', play: 'games/hbit.html',
    desc: 'A chat community with accounts, channels and moderation.',
    tags: ['Chat', 'Accounts'] },
];

(() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const grid = document.getElementById('grid');
  grid.innerHTML = PROJECTS.map(p => `
    <article class="card${p.featured ? ' featured' : ''}" data-cat="${p.cat}" id="p-${p.id}">
      <a class="shot" href="${p.play}" target="_blank" rel="noopener" aria-label="Open ${esc(p.name)}">
        ${p.shot ? `<img src="shots/${p.shot}" alt="${esc(p.name)} screenshot" loading="lazy">` : p.art || ''}
        ${p.port ? `<span class="badge" data-port="${p.port}">:${p.port}</span>` : ''}
      </a>
      <div class="info">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        ${p.bullets ? `<ul>${p.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="plays">
          <a class="play" data-magnet href="${p.play}" target="_blank" rel="noopener">Play it →</a>
          ${p.extra ? `<a class="play alt" data-magnet href="${p.extra.href}" target="_blank" rel="noopener">${esc(p.extra.label)}</a>` : ''}
        </div>
      </div>
    </article>`).join('');

  // Playtest everything
  const list = document.getElementById('pt-list');
  list.innerHTML = PROJECTS.map(p => `
    <li>
      <span class="pt-dot" data-id="${p.id}"></span>
      <span class="pt-name">${esc(p.name)}<small>${p.port ? 'localhost:' + p.port : p.note || 'runs in the browser'}</small></span>
      <a class="pt-go" data-magnet href="${p.play}" target="_blank" rel="noopener">Launch</a>
    </li>`).join('');

  // On the public site, server projects only run on my computer, so don't ping the visitor's localhost
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const status = async p => {
    const dot = list.querySelector(`.pt-dot[data-id="${p.id}"]`);
    if (!p.port) { dot.className = 'pt-dot ok'; dot.title = 'Ready'; return; }
    if (!local) {
      dot.className = 'pt-dot local'; dot.title = 'Runs locally';
      dot.nextElementSibling.querySelector('small').textContent = 'runs locally with node serve.mjs';
      document.querySelectorAll(`.badge[data-port="${p.port}"]`).forEach(b => { b.textContent = 'local'; });
      return;
    }
    try {
      await fetch(`http://localhost:${p.port}/`, { mode: 'no-cors', cache: 'no-store' });
      dot.className = 'pt-dot ok'; dot.title = 'Server running';
    } catch {
      dot.className = 'pt-dot off'; dot.title = 'Server offline: run node serve.mjs';
    }
    document.querySelectorAll(`.badge[data-port="${p.port}"]`).forEach(b => b.classList.toggle('off', dot.classList.contains('off')));
    updateCount();
  };
  const updateCount = () => {
    const ok = list.querySelectorAll('.pt-dot.ok').length;
    document.getElementById('pt-count').textContent = `${ok} of ${PROJECTS.length} ready`;
  };
  const checkAll = () => PROJECTS.forEach(status);
  checkAll();
  updateCount();
  document.getElementById('pt-refresh').addEventListener('click', checkAll);
})();
