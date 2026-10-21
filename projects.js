// Every project on the site. Add one here and it shows up in Projects and in "Playtest everything".
//   play:  link to open it
//   port:  set for projects that need their own server (status is checked live)
//   shot:  screenshot in shots/ (leave out to use the art in `art`)
const PROJECTS = [
  { id: 'opencode', name: 'OpenCode', cat: 'ai tools', featured: true, shot: 'opencode.jpg', play: 'games/opencode/index.html',
    desc: 'An AI coding workspace that runs entirely on your own machine using local models through Ollama. Type a prompt and get a working project.',
    bullets: ['5 modes: build, fix, design, talk, ship', 'Built-in terminal, file explorer and live code sandbox', 'Voice chat with on-device text-to-speech', '40+ animated WebGL backgrounds and themes'],
    tags: ['React', 'Vite', 'Ollama', 'Three.js', 'GSAP'], note: 'Chat needs Ollama running on this computer.' },
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
    tags: ['HTML', 'Comedy'] }
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
        <a class="play" data-magnet href="${p.play}" target="_blank" rel="noopener">Play it →</a>
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
