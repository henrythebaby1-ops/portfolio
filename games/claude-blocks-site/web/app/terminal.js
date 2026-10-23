/* Claude Blocks terminal: a real shell on this computer (via server.py), drawn with xterm.js. */
(() => {
  const CB = window.CB;
  const $ = s => document.querySelector(s);
  const XTERM = 'https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.min.js';
  const FIT = 'https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.min.js';
  const CSS = 'https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.min.css';

  let term = null, fit = null, token = '', id = null, starting = null, sending = Promise.resolve(), resizeTimer = null;
  const shellPick = $('#termShell');
  shellPick.value = CB.store.get('cb-shell', 'zsh');
  const status = (msg, err) => { const el = $('#termStatus'); el.textContent = msg; el.classList.toggle('err', !!err); };

  async function api(path, opts = {}) {
    const res = await fetch(path, { ...opts, headers: { 'X-CB-Token': token, ...(opts.headers || {}) } });
    if (!res.ok) throw new Error(res.status === 404 ? 'session ended' : 'HTTP ' + res.status);
    return res;
  }

  async function init() {
    status('Starting terminal…');
    try {
      const t = await fetch('/api/term/token');
      if (!t.ok) throw new Error();
      token = (await t.json()).token;
      // Offer the shells this computer actually has (zsh/bash, or PowerShell/cmd on Windows).
      const shells = await fetch('/api/term/shells').then(r => r.json()).catch(() => null);
      if (Array.isArray(shells) && shells.length) {
        const saved = shellPick.value;
        shellPick.textContent = '';
        for (const s of shells) shellPick.add(new Option(s, s));
        shellPick.value = shells.includes(saved) ? saved : shells[0];
      }
    } catch (_) {
      status('The terminal needs Claude Blocks’ own server — open Claude Blocks at http://localhost:8642 (Start Claude Blocks.command).', true);
      starting = null;
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = window.CB_ASSET(CSS);
    document.head.appendChild(link);
    await CB.loadScript(XTERM);
    await CB.loadScript(FIT);
    term = new Terminal({
      cursorBlink: true, fontSize: 13, fontFamily: 'ui-monospace, Menlo, monospace', scrollback: 5000,
      theme: { background: '#1f1e1d', foreground: '#f0eee6', cursor: '#d97757', selectionBackground: '#6b5248' },
    });
    fit = new FitAddon.FitAddon();
    term.loadAddon(fit);
    term.open($('#termHost'));
    term.onData(d => {
      if (!id) return;
      const sid = id;
      sending = sending.then(() => api('/api/term/input?id=' + sid, { method: 'POST', body: d })).catch(() => {});
    });
    new ResizeObserver(resize).observe($('#termHost'));
    await openSession();
  }

  async function openSession() {
    fit.fit();
    try {
      const r = await api('/api/term/open', { method: 'POST', body: JSON.stringify({ cols: term.cols, rows: term.rows, shell: shellPick.value }) });
      id = (await r.json()).id;
      status('');
      term.focus();
      pump(id);
    } catch (e) { status('Could not start a shell: ' + e.message, true); }
  }

  // Long-poll the server for new output and draw it.
  async function pump(myId) {
    while (id === myId) {
      let res;
      try { res = await api('/api/term/output?id=' + myId); }
      catch (_) {
        if (id === myId) { id = null; term.write('\r\n\x1b[31m[terminal disconnected — click ↻ New terminal]\x1b[0m\r\n'); }
        return;
      }
      const data = new Uint8Array(await res.arrayBuffer());
      if (data.length && id === myId) term.write(data);
      if (res.headers.get('X-Alive') === '0') {
        if (id === myId) { id = null; term.write('\r\n\x1b[90m[shell exited — click ↻ New terminal]\x1b[0m\r\n'); }
        return;
      }
    }
  }

  function resize() {
    if (!fit || !$('#view-terminal').classList.contains('active')) return;
    fit.fit();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (id) api('/api/term/resize', { method: 'POST', body: JSON.stringify({ id, cols: term.cols, rows: term.rows }) }).catch(() => {});
    }, 100);
  }

  function closeSession(keepalive) {
    if (!id) return;
    const old = id;
    id = null;
    fetch('/api/term/close', { method: 'POST', keepalive, headers: { 'X-CB-Token': token }, body: JSON.stringify({ id: old }) }).catch(() => {});
  }

  async function restart() {
    if (!term) { CB.terminal.onShow(); return; }
    closeSession(false);
    term.reset();
    await openSession();
  }
  $('#termNew').onclick = restart;
  // Switching shells starts a fresh terminal in the chosen shell.
  shellPick.onchange = () => { CB.store.set('cb-shell', shellPick.value); restart(); };
  $('#termClear').onclick = () => { if (term) { term.clear(); term.focus(); } };
  for (const btn of document.querySelectorAll('[data-cmd]')) {
    btn.onclick = () => {
      if (!id) return;
      const sid = id;
      sending = sending.then(() => api('/api/term/input?id=' + sid, { method: 'POST', body: btn.dataset.cmd + '\r' })).catch(() => {});
      term.focus();
    };
  }
  window.addEventListener('pagehide', () => closeSession(true));

  CB.terminal = {
    async onShow() {
      if (!term) { starting = starting || init(); await starting; }
      resize();
      if (term) term.focus();
    },
  };
})();
