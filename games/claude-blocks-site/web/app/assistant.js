/* Claude Blocks AI assistant, powered by a local Ollama model.
   💬 Chat: ask questions about your project.  🪄 Build: describe something and the AI makes the blocks for you. */
(() => {
  const CB = window.CB, rt = CB.rt;
  const $ = s => document.querySelector(s);
  const log = $('#aiLog'), input = $('#aiInput'), modelSel = $('#aiModel'), hostIn = $('#aiHost'), ctxBox = $('#aiCtx'), sendBtn = $('#aiSend');
  hostIn.value = rt.config.ai.host || 'http://localhost:11434';
  let history = [], controller = null, loadedOnce = false, helpShown = false, mode = 'chat', queue = Promise.resolve();

  const SYSTEM = `You are the friendly AI helper inside Claude Blocks, a Scratch-style block coding app for learners.
Help the user build projects with blocks and explain coding ideas simply and encouragingly.
Block categories: Motion, Looks, Sound, Events, Control, Sensing, Operators, Variables, My Blocks, plus optional extensions
(Raspberry Pi 5 GPIO, Three.js 3D, React UI, AI). There is also a Python editor, an HTML editor, a paint editor and text boxes.
When you suggest a script, write it as an indented list of block labels inside a code block, for example:
\`\`\`
when green flag clicked
  forever
    move (10) steps
    if on edge, bounce
\`\`\`
If the user wants you to make it for them, tell them to switch to 🪄 Build mode. Keep answers short.`;

  const base = () => (hostIn.value.trim() || 'http://localhost:11434').replace(/\/+$/, '');
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const md = t => esc(t)
    .replace(/```[\w-]*\n?([\s\S]*?)(```|$)/g, (_, c) => `<pre>${c.replace(/\n$/, '')}</pre>`)
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>')
    .replace(/\n(?![^<]*<\/pre>)/g, '<br>');
  const clean = t => t.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trim();

  function addMsg(role, text) {
    const d = document.createElement('div');
    d.className = 'msg ' + role;
    d.innerHTML = md(text);
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function showHelp() {
    if (helpShown) return;
    helpShown = true;
    addMsg('assistant err', `I couldn't reach Ollama at ${base()}.\n\n1. Install Ollama from ollama.com and open it\n2. In Terminal run: \`ollama pull llama3.2\`\n3. Open Claude Blocks with **Start Claude Blocks.command** (opening the file directly can block the connection)\n\nThen click ↻.`);
  }

  async function loadModels() {
    loadedOnce = true;
    modelSel.innerHTML = '<option value="">Loading…</option>';
    try {
      const d = await (await fetch(base() + '/api/tags')).json();
      const names = (d.models || []).map(m => m.name).filter(n => !/embed/i.test(n));
      modelSel.innerHTML = '';
      if (!names.length) {
        modelSel.add(new Option('No models yet', ''));
        addMsg('assistant err', 'Ollama is running but has no models. In Terminal run: `ollama pull llama3.2`, then click ↻.');
        return;
      }
      for (const n of names) modelSel.add(new Option(n, n));
      if (!names.includes(rt.config.ai.model)) rt.config.ai.model = names.find(n => /^llama3\.2/.test(n)) || names[0];
      modelSel.value = rt.config.ai.model;
      CB.saveSettings();
      helpShown = false;
    } catch (e) {
      modelSel.innerHTML = '<option value="">Ollama not found</option>';
      showHelp();
    }
  }
  modelSel.onchange = () => { rt.config.ai.model = modelSel.value; CB.saveSettings(); };
  hostIn.onchange = () => { rt.config.ai.host = base(); CB.saveSettings(); loadModels(); };
  $('#aiRefresh').onclick = () => { helpShown = false; loadModels(); };
  $('#aiClear').onclick = () => { history = []; log.textContent = ''; greet(); };

  function greet() {
    addMsg('assistant', mode === 'build'
      ? "🪄 Build mode: tell me what to make — like “make Claude jump when I press space” or “a game where an apple falls and Claude catches it” — and I'll build the blocks for you.\n\nTip: bigger models build better — for example **qwen2.5-coder:7b** or **llama3.1:8b** (pick one in the menu above)."
      : "Hi! I'm your coding helper. Ask me how to make something, or why a script isn't working. Switch to 🪄 Build and I'll make the blocks for you! ✳️");
  }

  // ---------- talking to Ollama (streamed) ----------
  async function stream(messages, onText, options) {
    const model = modelSel.value || rt.config.ai.model;
    if (!model) { if (!loadedOnce) await loadModels(); if (!(modelSel.value || rt.config.ai.model)) { showHelp(); throw new Error('no model'); } }
    controller = new AbortController();
    sendBtn.textContent = 'Stop';
    let reply = '';
    try {
      const res = await fetch(base() + '/api/chat', {
        method: 'POST', signal: controller.signal,
        body: JSON.stringify({ model: modelSel.value || rt.config.ai.model, stream: true, messages, options }),
      });
      if (!res.ok) throw new Error((await res.text()) || 'HTTP ' + res.status);
      const reader = res.body.getReader(), dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim();
          buf = buf.slice(i + 1);
          if (!line) continue;
          const j = JSON.parse(line);
          if (j.error) throw new Error(j.error);
          if (j.message && j.message.content) { reply += j.message.content; onText(clean(reply)); }
        }
      }
      return clean(reply);
    } finally { controller = null; sendBtn.textContent = mode === 'build' ? 'Build' : 'Send'; }
  }
  function showError(out, e) {
    out.classList.add('err');
    const offline = /fetch|load failed|network/i.test(e.message);
    out.innerHTML = md(offline ? `Couldn't reach Ollama at ${base()}.` : e.message === 'no model' ? 'Pick an AI model first.' : 'Ollama error: ' + e.message);
    if (offline) { helpShown = false; showHelp(); }
  }

  // ---------- 💬 chat ----------
  async function chat(text, label = '') {
    addMsg('user', label + text);
    history.push({ role: 'user', content: text });
    const system = SYSTEM + (ctxBox.checked ? "\n\nThe user's current project:\n" + CB.describeForAI() : '');
    const out = addMsg('assistant', '…');
    let reply = '';
    try {
      reply = await stream([{ role: 'system', content: system }, ...history.slice(-12)], t => { out.innerHTML = md(t || '…'); log.scrollTop = log.scrollHeight; });
    } catch (e) { if (e.name !== 'AbortError') showError(out, e); }
    history.push({ role: 'assistant', content: reply });
    return reply;
  }

  // ---------- 🪄 build ----------
  async function build(text) {
    addMsg('user', '🪄 ' + text);
    const sprites = CB.spriteNames();
    const system = `You build programs for Claude Blocks, a Scratch-like block coding app.
${CB.BUILD_GUIDE}
The project's sprites are: ${sprites.join(', ')}. The selected sprite is "${CB.currentSpriteName()}"; scripts with no "sprite" line go to it.
Use only the blocks listed above. Reply with ONLY the program inside one code block — no explanation.`;
    const out = addMsg('assistant', '🪄 Building…');
    let reply;
    try {
      // Each build starts fresh: small models get confused by earlier builds and repeat them.
      reply = await stream([{ role: 'system', content: system }, { role: 'user', content: text }],
        t => { out.innerHTML = md('🪄 Building…\n```\n' + (t.match(/```[\w-]*\n?([\s\S]*?)(```|$)/) || [null, t])[1] + '\n```'); log.scrollTop = log.scrollHeight; },
        { temperature: 0.2 });
    } catch (e) { if (e.name !== 'AbortError') showError(out, e); return; }
    const code = (reply.match(/```[\w-]*\n?([\s\S]*?)```/) || [null, reply])[1].trim();
    const parsed = CB.parseScript(code, sprites);
    const count = parsed.sections.reduce((n, s) => n + s.scripts.length, 0);
    if (!count) {
      out.classList.add('err');
      out.innerHTML = md(`I couldn't turn that into blocks. Try saying it another way, or a smaller step.\n\`\`\`\n${code}\n\`\`\``);
      return;
    }
    const where = parsed.sections.map(s => `${s.scripts.length} script${s.scripts.length === 1 ? '' : 's'} for ${s.sprite || CB.currentSpriteName()}${s.sprite && !sprites.some(n => n.toLowerCase() === s.sprite.toLowerCase()) ? ' (new sprite)' : ''}`).join(', ');
    out.innerHTML = md(`🪄 Here's my plan — ${where}:\n\`\`\`\n${code}\n\`\`\`` + (parsed.warnings.length ? `\nI'll skip ${parsed.warnings.length} line${parsed.warnings.length === 1 ? '' : 's'} I don't know: ${parsed.warnings.map(w => '`' + w + '`').join(', ')}` : ''));
    const row = document.createElement('div');
    row.className = 'build-actions';
    const addBtn = document.createElement('button'); addBtn.className = 'small primary'; addBtn.textContent = '✅ Add to my project';
    const runBtn = document.createElement('button'); runBtn.className = 'small'; runBtn.textContent = '✅ Add & run ⚑';
    const againBtn = document.createElement('button'); againBtn.className = 'small'; againBtn.textContent = '↻ Try again';
    const apply = run => {
      const added = CB.applyBuild(parsed);
      row.innerHTML = `<small>Added ${added.join(', ')}. ${run ? 'Running it!' : 'Press ⚑ Go to try it.'} You can undo with ⌘Z.</small>`;
      if (run) $('#flagBtn').click();
    };
    addBtn.onclick = () => apply(false);
    runBtn.onclick = () => apply(true);
    againBtn.onclick = () => { row.remove(); build(text); };
    row.append(addBtn, runBtn, againBtn);
    out.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  // ---------- sending ----------
  function send() {
    if (controller) { controller.abort(); return; }
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    queue = queue.then(() => (mode === 'build' ? build(text) : chat(text))).catch(() => {});
  }
  $('#aiForm').onsubmit = e => { e.preventDefault(); send(); };
  input.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  document.querySelectorAll('.ai-mode').forEach(b => {
    b.onclick = () => {
      mode = b.dataset.mode;
      document.querySelectorAll('.ai-mode').forEach(x => x.classList.toggle('active', x === b));
      input.placeholder = mode === 'build' ? 'Describe what to build, e.g. “make Claude jump when I press space”' : 'Ask how to make something…';
      sendBtn.textContent = mode === 'build' ? 'Build' : 'Send';
      greet();
    };
  });

  // The "send … to AI chat" block posts here and waits for the answer.
  rt.aiChat = text => {
    const p = queue.then(async () => { if (!loadedOnce) await loadModels(); return chat(text, '🧩 '); });
    queue = p.catch(() => {});
    return p;
  };

  greet();
  CB.assistant = { onShow() { if (!loadedOnce) loadModels(); }, build: text => { queue = queue.then(() => build(text)); return queue; } };
})();
