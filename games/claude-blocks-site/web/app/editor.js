/* Claude Blocks code editor: CodeMirror for Python and HTML, plus converting blocks to HTML/CSS/JS. */
(() => {
  const CB = window.CB;
  const $ = s => document.querySelector(s);
  const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';

  const PY_SAMPLE = `# Python in Claude Blocks
# "Run in browser" runs it right here. "Run on Pi" sends it to your Raspberry Pi 5.

name = "New World"
for i in range(3):
    print(f"Hello, {name}! #{i + 1}")

# On the Raspberry Pi, try blinking an LED on GPIO 17:
# from gpiozero import LED
# from time import sleep
# led = LED(17)
# for _ in range(5):
#     led.on(); sleep(0.5)
#     led.off(); sleep(0.5)
`;
  const HTML_SAMPLE = `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; background: #faf9f5; text-align: center; padding: 40px; }
    h1 { color: #d97757; }
    button { font-size: 18px; padding: 8px 20px; border-radius: 999px; border: 0; background: #d97757; color: white; }
  </style>
</head>
<body>
  <h1>Hello, New World!</h1>
  <p>You clicked <b id="count">0</b> times.</p>
  <button onclick="count.textContent = +count.textContent + 1">Click me</button>
</body>
</html>
`;

  const PAGE_CSS = `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f3ee;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1f1e1d;
}
.player { width: min(96vw, 720px); padding: 16px; box-sizing: border-box; }
.player header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.player h1 { font-size: 18px; margin: 0 0 0 8px; }
.player button {
  font-size: 18px; width: 44px; height: 36px; border-radius: 10px;
  border: 1px solid #d6d3c9; background: #fff; cursor: pointer;
}
#flag { color: #4cbf56; }
#stop { color: #e5484d; }
#stage { box-shadow: 0 4px 18px rgba(0, 0, 0, .08); border: 1px solid #e5e3dc; }
#output {
  background: #1f1e1d; color: #f0eee6; padding: 10px; border-radius: 10px;
  font: 13px ui-monospace, Menlo, monospace; white-space: pre-wrap; max-height: 200px; overflow: auto;
}
`;

  let py, html, gen, inited = false, pending = { python: null, html: null }, genFiles = null, genTab = 'html', pyodide = null;
  const opts = mode => ({
    mode, lineNumbers: true, indentUnit: mode === 'python' ? 4 : 2, tabSize: 4, autoCloseBrackets: true, matchBrackets: true,
    autoCloseTags: mode === 'htmlmixed', extraKeys: { Tab: cm => (cm.somethingSelected() ? cm.indentSelection('add') : cm.replaceSelection(' '.repeat(cm.getOption('indentUnit')))) },
  });

  function init() {
    if (inited) return;
    inited = true;
    py = CodeMirror($('#cmPython'), { ...opts('python'), value: pending.python || PY_SAMPLE });
    html = CodeMirror($('#cmHtml'), { ...opts('htmlmixed'), value: pending.html || HTML_SAMPLE });
    gen = CodeMirror($('#cmGen'), { ...opts('htmlmixed'), readOnly: true });
    py.on('change', () => CB.scheduleSave());
    html.on('change', () => CB.scheduleSave());
  }

  let active = 'python';
  function show(tab) {
    init();
    active = tab;
    document.querySelectorAll('.ed-tab').forEach(t => t.classList.toggle('active', t.dataset.ed === tab));
    document.querySelectorAll('.ed-section').forEach(s => s.classList.toggle('active', s.id === 'ed-' + tab));
    if (tab === 'gen') refreshGenerated();
    if (tab === 'html' && !$('#htmlPreview').srcdoc) runHtml();
    [py, html, gen].forEach(cm => cm.refresh());
  }
  document.querySelectorAll('.ed-tab').forEach(t => { t.onclick = () => show(t.dataset.ed); });

  // ---------- Python ----------
  const pyOut = $('#pyOut');
  function write(target, text, cls) {
    const d = document.createElement('div');
    d.textContent = text;
    if (cls) d.className = cls;
    target.appendChild(d);
    target.scrollTop = target.scrollHeight;
    return d;
  }
  $('#pyRunBrowser').onclick = async () => {
    pyOut.textContent = '';
    try {
      if (!pyodide) {
        const note = write(pyOut, 'Loading Python… (the first run downloads about 10 MB)', 'muted');
        await CB.loadScript(PYODIDE);
        pyodide = await loadPyodide();
        note.remove();
      }
      pyodide.setStdout({ batched: t => write(pyOut, t) });
      pyodide.setStderr({ batched: t => write(pyOut, t, 'err') });
      await pyodide.runPythonAsync(py.getValue());
      write(pyOut, '— finished —', 'muted');
    } catch (e) { write(pyOut, String(e.message || e), 'err'); }
  };
  $('#pyRunPi').onclick = async () => {
    pyOut.textContent = '';
    write(pyOut, 'Running on the Raspberry Pi…', 'muted');
    try {
      const r = await CB.rt.piCall('/python', { code: py.getValue() });
      if (r.stdout) write(pyOut, r.stdout);
      if (r.stderr) write(pyOut, r.stderr, 'err');
      write(pyOut, `— exit code ${r.code} —`, 'muted');
    } catch (e) { write(pyOut, e.message, 'err'); }
  };

  // ---------- HTML ----------
  function runHtml() { $('#htmlPreview').srcdoc = html.getValue(); }
  $('#htmlRun').onclick = runHtml;
  $('#htmlDownload').onclick = () => CB.download('page.html', html.getValue(), 'text/html');

  // ---------- Blocks → HTML / CSS / JS ----------
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const indent = (code, pad) => code.split('\n').map(l => (l ? pad + l : l)).join('\n');

  function buildExport() {
    const p = CB.collectForExport();
    const extScripts = p.extensions.flatMap(id => CB.EXTENSIONS[id].scripts);
    const title = esc(p.name);
    const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
${extScripts.map(u => `  <script src="${u}"></script>\n`).join('')}</head>
<body>
  <main class="player">
    <header>
      <button id="flag" title="Start">⚑</button>
      <button id="stop" title="Stop">■</button>
      <h1>${title}</h1>
    </header>
    <div id="stage"></div>
    <pre id="output" hidden></pre>
  </main>
  <script src="script.js"></script>
</body>
</html>
`;
    const scripts = p.scripts.map(([n, code]) => `  ${JSON.stringify(n)}: function (api) {\n${indent(code.trim(), '    ')}\n  }`).join(',\n');
    const js = `// ${p.name} — made with Claude Blocks
// Click the green flag to start.

${CBRuntime.toString()}

// Sprites and costumes
const PROJECT = ${JSON.stringify({ stageColor: p.stageColor, stage: p.stage, sprites: p.sprites }, null, 2)};

// Your scripts, converted from blocks (one function per sprite)
const SCRIPTS = {
${scripts}
};

const rt = CBRuntime(document.getElementById('stage'), {
  pi: { mode: 'real', host: ${JSON.stringify(p.config.pi.host || '')}, token: '' }, // paste your pi-bridge token here
  ai: { host: ${JSON.stringify(p.config.ai.host || 'http://localhost:11434')}, model: ${JSON.stringify(p.config.ai.model || '')} },
});
rt.setStageColor(PROJECT.stageColor);
rt.setStage(PROJECT.stage);
rt.compile(rt.stage, SCRIPTS.__stage__);
for (const s of PROJECT.sprites) rt.compile(rt.addSprite(s), SCRIPTS[s.name]);
const out = document.getElementById('output');
rt.onPrint = text => { out.hidden = false; out.textContent += text + '\\n'; out.scrollTop = out.scrollHeight; };
rt.onError = message => { out.hidden = false; out.textContent += '⚠ ' + message + '\\n'; };
document.getElementById('flag').onclick = () => rt.greenFlag();
document.getElementById('stop').onclick = () => rt.stopAll();
`;
    const single = page
      .replace('<link rel="stylesheet" href="style.css">', () => `<style>\n${PAGE_CSS}</style>`)
      .replace('<script src="script.js"></script>', () => `<script>\n${js.replace(/<\/script/gi, '<\\/script')}</script>`);
    return { html: page, css: PAGE_CSS, js, single, name: p.name };
  }

  function setGen(tab) {
    genTab = tab;
    document.querySelectorAll('.gen-tab').forEach(t => t.classList.toggle('active', t.dataset.gen === tab));
    gen.setOption('mode', { html: 'htmlmixed', css: 'css', js: 'javascript' }[tab]);
    gen.setValue(genFiles[tab]);
  }
  function refreshGenerated() { genFiles = buildExport(); setGen(genTab); }
  document.querySelectorAll('.gen-tab').forEach(t => { t.onclick = () => setGen(t.dataset.gen); });
  $('#genRefresh').onclick = refreshGenerated;
  const fileBase = () => (genFiles.name || 'project').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'project';
  $('#genDownload3').onclick = () => {
    CB.download('index.html', genFiles.html, 'text/html');
    setTimeout(() => CB.download('style.css', genFiles.css, 'text/css'), 300);
    setTimeout(() => CB.download('script.js', genFiles.js, 'text/javascript'), 600);
  };
  $('#genDownload1').onclick = () => CB.download(fileBase() + '.html', genFiles.single, 'text/html');
  $('#genToHtml').onclick = () => { html.setValue(genFiles.single); show('html'); runHtml(); };

  CB.editor = {
    show,
    onShow() { show(active); },
    showGenerated() { CB.showView('editor'); show('gen'); },
    getPython: () => (py ? py.getValue() : pending.python),
    getHtml: () => (html ? html.getValue() : pending.html),
    load(python, page) {
      pending = { python, html: page };
      if (inited) { py.setValue(python || PY_SAMPLE); html.setValue(page || HTML_SAMPLE); runHtml(); }
    },
    setPython(code) { init(); py.setValue(code); },
    setHtml(code) { init(); html.setValue(code); },
  };
})();
