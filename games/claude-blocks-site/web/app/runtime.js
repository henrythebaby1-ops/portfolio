/* Claude Blocks runtime: the stage, sprites, events and extension APIs.
   Everything lives inside this one function so "Export HTML" can copy it into a standalone page. */
function CBRuntime(root, config) {
  'use strict';
  const W = 480, H = 360, RES = 2;
  const STOP = { cbStop: true };
  config = config || {};
  config.pi = config.pi || { host: '', token: '' };
  config.ai = config.ai || { host: 'http://localhost:11434', model: '' };

  // ---------- state ----------
  const sprites = [];
  // The Stage: like a sprite that can't move — it has its own scripts and backdrops.
  let stage = null;
  const keys = new Set(), mouse = { x: 0, y: 0, down: false }, snippets = new Map();
  let stageColor = '#ffffff', gen = 0, frameWaiters = [], timerStart = performance.now(), answer = '';
  // Like Scratch: loops only wait for the next screen refresh when something visible changed (or the frame's time is up),
  // so maths-only loops run fast while animations stay smooth.
  let redraw = false, frameStart = performance.now();
  let asking = false, askPending = null, audio = null, volume = 100, drag = null;
  let three = null, reactRoot = null, reactBuilder = null, reactForce = null;

  const CSS = `
.cb-stage{position:relative;width:100%;aspect-ratio:4/3;overflow:hidden;border-radius:10px;background:#fff;user-select:none;-webkit-user-select:none;touch-action:none}
.cb-layer{position:absolute;inset:0;width:100%;height:100%}
.cb-3d canvas{width:100%!important;height:100%!important;display:block}
.cb-ui{pointer-events:none}
.cb-react{position:absolute;inset:0;padding:12px;display:flex;flex-direction:column;align-items:flex-start;gap:8px;overflow:auto;font:15px system-ui,-apple-system,sans-serif;color:#1f1e1d}
.cb-react *{pointer-events:auto}
.cb-react h1,.cb-react h2,.cb-react h3,.cb-react p{margin:0}
.cb-react button{font:inherit;padding:6px 14px;border-radius:999px;border:0;background:#149eca;color:#fff;cursor:pointer}
.cb-react button:active{transform:scale(.97)}
.cb-react input{font:inherit;padding:6px 10px;border:1px solid #c9c6bc;border-radius:8px;background:#fff}
.cb-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.cb-col{display:flex;flex-direction:column;gap:8px}
.cb-card{display:flex;flex-direction:column;gap:8px;background:#fff;border:1px solid #e5e3dc;border-radius:12px;padding:12px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.cb-react-error{background:#fde8e8;color:#b42318;padding:6px 10px;border-radius:8px}
.cb-ask{position:absolute;left:10px;right:10px;bottom:10px;display:none;flex-direction:column;gap:6px;background:#fff;border:2px solid #d97757;border-radius:12px;padding:8px}
.cb-ask.show{display:flex}
.cb-ask .cb-q{font:14px system-ui,-apple-system,sans-serif;color:#1f1e1d}
.cb-ask form{display:flex;gap:6px;margin:0}
.cb-ask input{flex:1;font:14px system-ui,-apple-system,sans-serif;padding:6px 12px;border:1px solid #c9c6bc;border-radius:999px}
.cb-ask button{border:0;background:#d97757;color:#fff;border-radius:999px;width:34px;cursor:pointer;font-size:15px}
`;
  if (!document.getElementById('cb-runtime-css')) {
    const st = document.createElement('style'); st.id = 'cb-runtime-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  // ---------- DOM ----------
  const el = (tag, cls) => { const e = document.createElement(tag); e.className = cls; return e; };
  root.classList.add('cb-stage');
  root.textContent = '';
  const layer3d = el('div', 'cb-layer cb-3d');
  const canvas = el('canvas', 'cb-layer cb-2d');
  canvas.width = W * RES; canvas.height = H * RES;
  const uiLayer = el('div', 'cb-layer cb-ui');
  const askBox = el('div', 'cb-ask');
  askBox.innerHTML = '<div class="cb-q"></div><form><input type="text" autocomplete="off" aria-label="Your answer"><button type="submit" aria-label="Submit answer">✓</button></form>';
  root.append(layer3d, canvas, uiLayer, askBox);
  const ctx = canvas.getContext('2d');
  const askQ = askBox.querySelector('.cb-q'), askInput = askBox.querySelector('input');
  askBox.querySelector('form').addEventListener('submit', e => { e.preventDefault(); if (askPending) askPending.res(askInput.value); });

  // ---------- helpers ----------
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const num = v => Number(v) || 0;
  const round = v => Math.round(v * 100) / 100;
  const rad = d => num(d) * Math.PI / 180;
  const fmt = v => typeof v === 'number' && !Number.isInteger(v) ? String(Math.round(v * 1000) / 1000) : String(v == null ? '' : v);
  const normDir = d => { d = ((num(d) + 180) % 360 + 360) % 360 - 180; return d === -180 ? 180 : d; };

  // ---------- the Claude pixel mascot ----------
  // B body, D shade, E eye, S stick. Drawn facing left; sprites mirror it to face right.
  const CLAUDE = [
    '.........BBBBBBBBBDDD.',
    '.........BBBBBBBBBDDD.',
    '.........EEBBBBEEBDDD.',
    '.........EEBBBBEEBDDD.',
    '.......BBBBBBBBBBBDDD.',
    'S.....BBBBBBBBBBBBDDD.',
    '.S....BBBBBBBBBBBBDDD.',
    '..S...BBBBBBBBBBBBDDD.',
    '...SSSSS.B..B...B...D.',
    '.........B..B...B...D.',
  ];
  const CLAUDE_COLORS = {
    orange: ['#c96f4e', '#a95a3e'], blue: ['#4c8fd6', '#3a70ab'], green: ['#4caf6a', '#3a8a53'],
    purple: ['#8e6bd8', '#7053b0'], pink: ['#e07aa5', '#bd5f86'], gold: ['#e0a93b', '#b8862a'],
  };
  function claudeCanvas(color, frame, px, faceRight) {
    const [body, shade] = CLAUDE_COLORS[color] || CLAUDE_COLORS.orange;
    const pal = { B: body, D: shade, E: '#141414', S: '#8f8f8f' };
    const rows = CLAUDE.map(r => r.split(''));
    const put = (r, c, ch) => { rows[r][c] = ch; };
    const eyesOff = () => [2, 3].forEach(r => [9, 10, 15, 16].forEach(c => put(r, c, 'B')));
    if (frame === 1) { rows[8] = '...SSSSS..B..B...B..D.'.split(''); rows[9] = '..........B..B...B..D.'.split(''); }
    else if (frame === 'blink') { eyesOff(); [9, 10, 15, 16].forEach(c => put(3, c, 'E')); }
    else if (frame === 'happy') { eyesOff(); [[2, 10], [3, 9], [3, 11], [2, 16], [3, 15], [3, 17]].forEach(([r, c]) => put(r, c, 'E')); }
    else if (frame === 'jump') { rows[9] = '......................'.split(''); }
    else if (frame === 'wave') {
      rows.forEach(row => row.forEach((ch, c) => { if (ch === 'S') row[c] = '.'; }));
      [[4, 6], [3, 5], [2, 4], [1, 3], [0, 2]].forEach(([r, c]) => put(r, c, 'S'));
    }
    const c = document.createElement('canvas');
    c.width = 22 * px; c.height = 10 * px;
    const x = c.getContext('2d');
    rows.forEach((row, r) => {
      for (let i = 0; i < row.length; i++) {
        if (!pal[row[i]]) continue;
        x.fillStyle = pal[row[i]];
        x.fillRect((faceRight ? 21 - i : i) * px, r * px, px, px);
      }
    });
    return c;
  }

  // ---------- costumes & sprites ----------
  function buildCostume(spec) {
    const c = { spec, name: spec.name || '', canvas: null, w: 0, h: 0, scale: 1, pixel: false, alpha: null };
    if (spec.type === 'claude') {
      c.canvas = claudeCanvas(spec.color, spec.frame || 0, 3, true);
      c.pixel = true; c.name = c.name || (typeof spec.frame === 'string' ? spec.frame : 'walk ' + ((spec.frame || 0) + 1));
    } else if (spec.type === 'emoji') {
      c.canvas = document.createElement('canvas'); c.canvas.width = c.canvas.height = 96;
      const x = c.canvas.getContext('2d');
      x.font = '76px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(spec.char, 48, 54);
      c.scale = 0.6; c.name = c.name || spec.char;
    } else if (spec.type === 'text') {
      c.canvas = textCanvas(spec); c.name = c.name || 'text';
    } else {
      c.canvas = document.createElement('canvas'); c.name = c.name || 'costume';
      const img = new Image();
      img.onload = () => {
        c.canvas.width = img.naturalWidth; c.canvas.height = img.naturalHeight;
        c.canvas.getContext('2d').drawImage(img, 0, 0);
        c.w = c.canvas.width; c.h = c.canvas.height; c.alpha = null;
        c.scale = Number(spec.scale) || Math.min(1, 120 / Math.max(c.w, c.h));
        c.pixel = !!spec.pixel;
      };
      img.src = spec.src;
      return c;
    }
    c.w = c.canvas.width; c.h = c.canvas.height;
    return c;
  }

  // A text box: words drawn onto a costume, optionally on a rounded "card".
  function textCanvas(spec) {
    const size = Math.max(8, Math.min(120, Number(spec.size) || 28)), lines = String(spec.text == null ? '' : spec.text).split('\n');
    const font = `${spec.bold === false ? '' : '700 '}${size}px ${spec.font === 'mono' ? 'ui-monospace, Menlo, monospace' : spec.font === 'serif' ? 'Georgia, serif' : spec.font === 'hand' ? '"Comic Sans MS", "Chalkboard SE", cursive' : 'system-ui, -apple-system, sans-serif'}`;
    const m = document.createElement('canvas').getContext('2d'); m.font = font;
    const pad = spec.box ? Math.round(size * 0.5) : 4, lh = Math.round(size * 1.25);
    const w = Math.ceil(Math.max(1, ...lines.map(l => m.measureText(l).width))) + pad * 2, h = lines.length * lh + pad * 2;
    const c = document.createElement('canvas'); c.width = Math.max(2, w); c.height = Math.max(2, h);
    const x = c.getContext('2d');
    if (spec.box) {
      x.fillStyle = spec.boxColor || '#ffffff'; x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2;
      const r = Math.min(16, h / 2); x.beginPath(); x.moveTo(r, 1); x.arcTo(w - 1, 1, w - 1, h - 1, r); x.arcTo(w - 1, h - 1, 1, h - 1, r); x.arcTo(1, h - 1, 1, 1, r); x.arcTo(1, 1, w - 1, 1, r); x.closePath(); x.fill(); x.stroke();
    }
    x.font = font; x.fillStyle = spec.color || '#1f1e1d'; x.textBaseline = 'middle'; x.textAlign = 'center';
    lines.forEach((l, i) => x.fillText(l, w / 2, pad + lh * i + lh / 2));
    return c;
  }

  function uniqueName(n) { let name = n, i = 2; while (sprites.some(s => s.name === name)) name = n + i++; return name; }

  function addSprite(spec) {
    spec = spec || {};
    const s = {
      id: spec.id || 's' + Math.random().toString(36).slice(2, 10),
      name: uniqueName(spec.name || 'Sprite'),
      x: num(spec.x), y: num(spec.y), dir: spec.dir == null ? 90 : num(spec.dir), size: spec.size == null ? 100 : num(spec.size),
      visible: spec.visible !== false, rotationStyle: spec.rotationStyle || 'all around',
      costumes: (spec.costumes || []).map(buildCostume), costume: num(spec.costume),
      effects: { color: 0, ghost: 0 }, bubble: null, handlers: {}, blocks: spec.blocks || null, anim: null, autoBlink: true, animSound: true,
    };
    s.api = makeApi(s);
    sprites.push(s);
    return s;
  }

  function serializeSprite(s) {
    return { id: s.id, name: s.name, x: Math.round(s.x), y: Math.round(s.y), dir: round(s.dir), size: round(s.size),
      visible: s.visible, rotationStyle: s.rotationStyle, costume: s.costume, costumes: s.costumes.map(c => c.spec) };
  }

  // ---------- drawing ----------
  function drawSprite(s) {
    const base = s.costumes[s.costume];
    if (!s.visible || !base || !base.w) return;
    const fx = (s.anim && s.anim.fx) || {};
    let c = (s.anim && s.anim.costume) || base;
    // Claude sprites blink on their own every few seconds while idle.
    const now = performance.now();
    if (!s.anim && s.autoBlink && base.spec.type === 'claude') {
      if (!s.nextBlink) s.nextBlink = now + 2000 + Math.random() * 3000;
      if (now > s.nextBlink + 150) s.nextBlink = now + 2500 + Math.random() * 3500;
      else if (now > s.nextBlink) c = claudeFrame(s, 'blink') || base;
    }
    const k = s.size / 100 * c.scale * (fx.scale || 1);
    ctx.save();
    ctx.translate(W / 2 + s.x + (fx.dx || 0), H / 2 - s.y - (fx.dy || 0));
    if (s.rotationStyle === 'all around') ctx.rotate((s.dir - 90) * Math.PI / 180);
    else if (s.rotationStyle === 'left-right' && s.dir < 0) ctx.scale(-1, 1);
    if (fx.rot) ctx.rotate(fx.rot * Math.PI / 180);
    ctx.scale(k, k);
    ctx.globalAlpha = 1 - clamp(s.effects.ghost, 0, 100) / 100;
    if (s.effects.color) ctx.filter = `hue-rotate(${s.effects.color * 1.8}deg)`;
    ctx.imageSmoothingEnabled = !c.pixel;
    ctx.drawImage(c.canvas, -c.w / 2, -c.h / 2);
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function wrap(text, maxW) {
    const out = []; let line = '';
    for (const word of String(text).split(/\s+/)) {
      const test = line ? line + ' ' + word : word;
      if (!line || ctx.measureText(test).width <= maxW) line = test; else { out.push(line); line = word; }
    }
    if (line) out.push(line);
    return out.slice(0, 8);
  }

  function drawBubble(s) {
    const b = bounds(s);
    ctx.save();
    ctx.font = '13px system-ui, -apple-system, "Segoe UI", sans-serif';
    const lines = wrap(s.bubble.text, 160), lh = 16;
    const w = Math.max(36, ...lines.map(l => ctx.measureText(l).width)) + 20, h = lines.length * lh + 12;
    const left = b.right > W / 2 - w;
    let x = left ? W / 2 + b.left - w + 8 : W / 2 + b.right - 8;
    let y = H / 2 - b.top - h - 12;
    x = clamp(x, 4, W - w - 4); y = clamp(y, 4, H - h - 4);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#bdb9ae'; ctx.lineWidth = 1.5;
    roundRect(x, y, w, h, 12); ctx.fill(); ctx.stroke();
    const tx = left ? x + w - 22 : x + 22;
    if (s.bubble.think) {
      for (const [dx, dy, r] of [[0, 8, 4], [left ? 6 : -6, 16, 2.5]]) { ctx.beginPath(); ctx.arc(tx + dx, y + h + dy, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    } else {
      ctx.beginPath(); ctx.moveTo(tx - 7, y + h - 1); ctx.lineTo(tx + (left ? 8 : -8), y + h + 10); ctx.lineTo(tx + 7, y + h - 1);
      ctx.fill(); ctx.stroke(); ctx.fillRect(tx - 6, y + h - 3, 12, 3);
    }
    ctx.fillStyle = '#1f1e1d';
    lines.forEach((l, i) => ctx.fillText(l, x + 10, y + 3 + lh * (i + 1)));
    ctx.restore();
  }

  function render() {
    ctx.setTransform(RES, 0, 0, RES, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (!three) {
      ctx.fillStyle = stageColor; ctx.fillRect(0, 0, W, H);
      const bd = stage && stage.backdrops[stage.backdrop];
      if (bd && bd.img && bd.img.complete && bd.img.naturalWidth) {   // image backdrops fill the stage
        const k = Math.max(W / bd.img.naturalWidth, H / bd.img.naturalHeight), w = bd.img.naturalWidth * k, h = bd.img.naturalHeight * k;
        ctx.drawImage(bd.img, (W - w) / 2, (H - h) / 2, w, h);
      }
    }
    for (const s of sprites) drawSprite(s);
    for (const s of sprites) if (s.bubble && s.visible) drawBubble(s);
    if (three) three.renderer.render(three.scene, three.camera);
  }

  function drawThumb(s, cv) {
    const c = s.costumes[s.costume] || s.costumes[0];
    const x = cv.getContext('2d');
    x.clearRect(0, 0, cv.width, cv.height);
    if (!c || !c.w) return;
    const k = Math.min(cv.width / c.w, cv.height / c.h) * 0.85;
    x.imageSmoothingEnabled = !c.pixel;
    x.drawImage(c.canvas, (cv.width - c.w * k) / 2, (cv.height - c.h * k) / 2, c.w * k, c.h * k);
  }

  // ---------- frames & threads ----------
  const nextFrame = () => new Promise(r => frameWaiters.push(r));
  async function tick() {
    const g = gen;
    if (!redraw && performance.now() - frameStart < 12) { await null; if (g !== gen) throw STOP; return; }
    await nextFrame();
    if (g !== gen) throw STOP;
  }
  async function wait(secs) {
    const g = gen, end = performance.now() + Math.max(0, num(secs)) * 1000;
    do { await nextFrame(); if (g !== gen) throw STOP; } while (performance.now() < end);
  }
  async function guard(p) { const g = gen; const r = await p; if (g !== gen) throw STOP; return r; }
  function loop() {
    const ws = frameWaiters; frameWaiters = [];
    redraw = false; frameStart = performance.now();
    for (const r of ws) r();
    try { render(); } catch (e) { console.error(e); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function friendly(e) {
    const m = (e && e.message) || String(e);
    if (/__c is not defined|Can't find variable: __c/.test(m)) return 'React element blocks must go inside a "React app" block.';
    if (/await/.test(m) && /async|valid/.test(m)) return 'A waiting block (wait, glide, ask, Pi, AI…) can’t go inside a React element — put it in a script or a button’s "when clicked".';
    return m;
  }
  function report(e, s) {
    const msg = friendly(e);
    if (rt.onError) rt.onError(msg, s); else console.error((s ? s.name + ': ' : '') + msg);
  }

  function startThread(s, h) {
    if (h.thread) return h.thread.promise;
    const t = {};
    h.thread = t;
    t.promise = (async () => {
      try { await h.fn(); } catch (e) { if (e !== STOP) report(e, s); } finally { if (h.thread === t) h.thread = null; }
    })();
    return t.promise;
  }
  function dispatch(evt) {
    if (rt.beforeDispatch) rt.beforeDispatch();
    const ps = [];
    for (const s of [stage, ...sprites]) for (const h of s.handlers[evt] || []) ps.push(startThread(s, h));
    return ps;
  }
  function dispatchTo(s, evt) {
    if (rt.beforeDispatch) rt.beforeDispatch();
    for (const h of s.handlers[evt] || []) startThread(s, h);
  }
  function compile(s, code) {
    s.handlers = {};
    if (!code) return s;
    let fn = code;
    if (typeof code === 'string') { try { fn = new Function('api', code); } catch (e) { report(e, s); return s; } }
    try { fn(s.api); } catch (e) { report(e, s); }
    return s;
  }
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  function runCode(s, code, key) {
    if (key && snippets.has(key)) return;
    let fn;
    try { fn = new AsyncFunction('api', code); } catch (e) { report(e, s); return; }
    const th = {};
    if (key) snippets.set(key, th);
    th.promise = (async () => {
      try { await fn(s.api); } catch (e) { if (e !== STOP) report(e, s); } finally { if (key && snippets.get(key) === th) snippets.delete(key); }
    })();
    return th.promise;
  }
  // Each run starts from a clean white-backed stage: old 3D scenes and React screens are removed.
  function greenFlag() { stopAll(); threeApi.close(); reactApi.clear(); timerStart = performance.now(); return dispatch('flag'); }
  function stopAll() {
    gen++;
    for (const s of [stage, ...sprites]) { s.bubble = null; s.anim = null; s.animToken = null; for (const k in s.handlers) for (const h of s.handlers[k]) h.thread = null; }
    snippets.clear();
    if (askPending) askPending.rej(STOP);
    askBox.classList.remove('show');
  }
  function isRunning() {
    if (snippets.size) return true;
    for (const s of [stage, ...sprites]) for (const k in s.handlers) for (const h of s.handlers[k]) if (h.thread) return true;
    return false;
  }

  // ---------- geometry & sensing ----------
  function bounds(s) {
    const c = s.costumes[s.costume];
    if (!c || !c.w) return { left: s.x, right: s.x, top: s.y, bottom: s.y };
    const k = s.size / 100 * c.scale;
    let w = c.w * k, h = c.h * k;
    if (s.rotationStyle === 'all around') {
      const a = (s.dir - 90) * Math.PI / 180, co = Math.abs(Math.cos(a)), si = Math.abs(Math.sin(a));
      [w, h] = [w * co + h * si, w * si + h * co];
    }
    return { left: s.x - w / 2, right: s.x + w / 2, top: s.y + h / 2, bottom: s.y - h / 2 };
  }
  function hit(s, x, y) {
    const c = s.costumes[s.costume];
    if (!s.visible || !c || !c.w) return false;
    const k = s.size / 100 * c.scale;
    let dx = x - s.x, dy = s.y - y;
    if (s.rotationStyle === 'all around') {
      const a = -(s.dir - 90) * Math.PI / 180;
      [dx, dy] = [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)];
    } else if (s.rotationStyle === 'left-right' && s.dir < 0) dx = -dx;
    const u = Math.floor(dx / k + c.w / 2), v = Math.floor(dy / k + c.h / 2);
    if (u < 0 || v < 0 || u >= c.w || v >= c.h) return false;
    if (!c.alpha) c.alpha = c.canvas.getContext('2d').getImageData(0, 0, c.w, c.h).data;
    return c.alpha[(v * c.w + u) * 4 + 3] > 10;
  }
  const byName = n => sprites.find(s => s.name === String(n));
  function topSpriteAt(x, y) { for (let i = sprites.length - 1; i >= 0; i--) if (hit(sprites[i], x, y)) return sprites[i]; return null; }
  function touching(s, target) {
    if (!s.visible) return false;
    if (target === '_mouse_') return hit(s, mouse.x, mouse.y);
    const b = bounds(s);
    if (target === '_edge_') return b.left < -W / 2 || b.right > W / 2 || b.bottom < -H / 2 || b.top > H / 2;
    const o = byName(target);
    if (!o || o === s || !o.visible) return false;
    const c = bounds(o);
    if (b.right < c.left || b.left > c.right || b.top < c.bottom || b.bottom > c.top) return false;
    const x0 = Math.max(b.left, c.left), x1 = Math.min(b.right, c.right), y0 = Math.max(b.bottom, c.bottom), y1 = Math.min(b.top, c.top);
    const step = Math.max(1, Math.min(x1 - x0, y1 - y0) / 12);
    for (let x = x0; x <= x1; x += step) for (let y = y0; y <= y1; y += step) if (hit(s, x, y) && hit(o, x, y)) return true;
    return false;
  }
  function targetPos(t) {
    if (t === '_mouse_') return { x: mouse.x, y: mouse.y };
    if (t === '_random_') return { x: Math.round(Math.random() * W - W / 2), y: Math.round(Math.random() * H - H / 2) };
    const o = byName(t);
    return o ? { x: o.x, y: o.y } : null;
  }

  // ---------- input ----------
  function stagePoint(e) {
    const r = canvas.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) / r.width * W - W / 2, -W / 2, W / 2), y: clamp(H / 2 - (e.clientY - r.top) / r.height * H, -H / 2, H / 2) };
  }
  canvas.addEventListener('pointerdown', e => {
    mouse.down = true;
    const p = stagePoint(e); mouse.x = p.x; mouse.y = p.y;
    const s = topSpriteAt(p.x, p.y);
    if (!s) { dispatchTo(stage, 'click'); return; }        // clicking empty space clicks the Stage
    if (rt.onSpriteDown) rt.onSpriteDown(s);
    dispatchTo(s, 'click');
    if (config.draggable) { drag = { s, dx: s.x - p.x, dy: s.y - p.y }; try { canvas.setPointerCapture(e.pointerId); } catch (_) {} }
  });
  window.addEventListener('pointermove', e => {
    const p = stagePoint(e); mouse.x = p.x; mouse.y = p.y;
    if (drag) { drag.s.x = Math.round(p.x + drag.dx); drag.s.y = Math.round(p.y + drag.dy); drag.moved = true; }
  });
  window.addEventListener('pointerup', () => {
    mouse.down = false;
    if (drag && drag.moved && rt.onSpriteMoved) rt.onSpriteMoved(drag.s);
    drag = null;
  });
  const KEYMAP = { ' ': 'space', ArrowUp: 'up arrow', ArrowDown: 'down arrow', ArrowLeft: 'left arrow', ArrowRight: 'right arrow', Enter: 'enter' };
  const keyName = e => KEYMAP[e.key] || (e.key && e.key.length === 1 ? e.key.toLowerCase() : null);
  const typing = t => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || (t.closest && t.closest('.CodeMirror, .blocklyWidgetDiv, dialog')));
  window.addEventListener('keydown', e => {
    if (typing(e.target) || e.metaKey || e.ctrlKey) return;
    const k = keyName(e);
    if (!k) return;
    keys.add(k);
    const hasHandlers = sprites.some(s => s.handlers['key:' + k] || s.handlers['key:any']);
    dispatch('key:' + k); dispatch('key:any');
    if (hasHandlers && (k === 'space' || k.endsWith('arrow'))) e.preventDefault();
  });
  window.addEventListener('keyup', e => { const k = keyName(e); if (k) keys.delete(k); });
  window.addEventListener('blur', () => keys.clear());

  // ---------- Raspberry Pi bridge ----------
  async function piRequest(path, body) {
    const host = String(config.pi.host || '').trim();
    if (!host) throw new Error('No Raspberry Pi connected — in the 🍓 Pi 5 tab, connect your Pi or switch to the Emulator.');
    const base = (/^https?:\/\//.test(host) ? host : 'http://' + host).replace(/\/+$/, '');
    let res;
    try {
      res = await fetch(base + path, {
        method: body ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json', 'X-CB-Token': config.pi.token || '' },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) { throw new Error(`Can't reach the Pi at ${base} — is pi-bridge.py running?`); }
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('The Pi bridge token is wrong — use the token printed by pi-bridge.py.');
    if (!res.ok) throw new Error(data.error || `Pi bridge error ${res.status}`);
    return data;
  }
  // Pi blocks go to the built-in emulator unless the Pi 5 tab is set to a real Raspberry Pi.
  async function piCall(path, body) {
    if (config.pi.mode !== 'real' && rt.piEmulator) return rt.piEmulator.handle(path, body || null);
    return piRequest(path, body);
  }
  const hw = (body) => guard(piCall('/hw', body));
  const hexToRgb = c => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c)); const n = m ? parseInt(m[1], 16) : 0; return { r: (n >> 16 & 255) / 255, g: (n >> 8 & 255) / 255, b: (n & 255) / 255 }; };
  const piApi = {
    async write(pin, on) { await guard(piCall('/gpio', { action: 'write', pin: num(pin), value: !!on })); },
    async read(pin) { return (await guard(piCall('/gpio', { action: 'read', pin: num(pin) }))).value; },
    async pressed(pin) { return (await guard(piCall('/gpio', { action: 'pressed', pin: num(pin) }))).value; },
    async pwm(pin, duty) { await guard(piCall('/gpio', { action: 'pwm', pin: num(pin), value: num(duty) })); },
    async run(cmd) { const r = await guard(piCall('/exec', { cmd: String(cmd) })); return ((r.stdout || '') + (r.stderr || '')).trim(); },
    async temp() { return (await guard(piCall('/info'))).temp; },
    async servo(pin, angle) { await hw({ device: 'servo', pin: num(pin), angle: num(angle) }); },
    async lcd(line, text) { await hw({ device: 'lcd', action: 'text', line: num(line), text: fmt(text) }); },
    async lcdClear() { await hw({ device: 'lcd', action: 'clear' }); },
    async lcdBacklight(on) { await hw({ device: 'lcd', action: 'backlight', on: !!on }); },
    async fan(mode) { await hw({ device: 'fan', mode: String(mode) }); },
    async fanSpeed() { return (await hw({ device: 'read', sensor: 'fan' })).value; },
    async buzz(pin, note, secs) { await hw({ device: 'buzzer', pin: num(pin), note: num(note), secs: num(secs) }); await wait(secs); },
    async rgb(color) { await hw({ device: 'rgb', ...hexToRgb(color) }); },
    async pot() { return (await hw({ device: 'read', sensor: 'pot' })).value; },
    async distance() { return (await hw({ device: 'read', sensor: 'distance' })).value; },
    async motion() { return (await hw({ device: 'read', sensor: 'motion' })).value; },
    async sensor(name) { return (await hw({ device: 'read', sensor: String(name) })).value; },
    async traffic(light) { await hw({ device: 'traffic', light: String(light) }); },
    async bargraph(value) { await hw({ device: 'bargraph', value: num(value) }); },
    async motor(dir, speed) { await hw({ device: 'motor', dir: String(dir), speed: num(speed) }); },
    async neoSet(index, color) { await hw({ device: 'neopixel', action: 'set', index: num(index), ...hexToRgb(color) }); },
    async neoFill(color) { await hw({ device: 'neopixel', action: 'fill', ...hexToRgb(color) }); },
    async neoClear() { await hw({ device: 'neopixel', action: 'clear' }); },
    async segment(text) { await hw({ device: 'segment', text: fmt(text) }); },
    async oled(line, text) { await hw({ device: 'oled', action: 'text', line: num(line), text: fmt(text) }); },
    async oledClear() { await hw({ device: 'oled', action: 'clear' }); },
  };

  // ---------- AI (Ollama) ----------
  async function fetchJSON(url, body) {
    let res;
    try { res = await fetch(url, body ? { method: 'POST', body: JSON.stringify(body) } : undefined); }
    catch (e) { throw new Error('Could not reach Ollama at ' + url.replace(/\/api\/.*$/, '') + ' — is it running?'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error('Ollama: ' + (data.error || res.status));
    return data;
  }
  const aiApi = {
    lastReply: '',
    setModel(m) { config.ai.model = String(m).trim(); },
    reply() { return aiApi.lastReply; },
    async chat(text) {
      aiApi.lastReply = rt.aiChat ? String(await guard(rt.aiChat(fmt(text)))) : await aiApi.ask(text);
      return aiApi.lastReply;
    },
    async ask(prompt) {
      const host = (config.ai.host || 'http://localhost:11434').replace(/\/+$/, '');
      if (!config.ai.model) {
        const tags = await guard(fetchJSON(host + '/api/tags'));
        config.ai.model = (tags.models && tags.models[0] && tags.models[0].name) || '';
        if (!config.ai.model) throw new Error('Ollama has no models yet. In Terminal run: ollama pull llama3.2');
      }
      const r = await guard(fetchJSON(host + '/api/generate', { model: config.ai.model, prompt: String(prompt), stream: false }));
      return (aiApi.lastReply = String(r.response || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim());
    },
  };

  // ---------- Three.js ----------
  function ensureThree() {
    if (!window.THREE) throw new Error('Add the Three.js extension first (it loads the 3D library).');
    if (three) return three;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(RES); renderer.setSize(W, H, false);
    layer3d.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#87ceeb');
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 2, 6); camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 0.9); sun.position.set(3, 6, 4); scene.add(sun);
    three = { renderer, scene, camera, objects: {} };
    return three;
  }
  function claudeVoxels(color) {
    const group = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color }), shade = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.8) });
    const mats = { B: body, D: shade, E: new THREE.MeshStandardMaterial({ color: '#141414' }), S: new THREE.MeshStandardMaterial({ color: '#8f8f8f' }) };
    const cube = new THREE.BoxGeometry(0.1, 0.1, 0.6), thin = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    CLAUDE.forEach((row, r) => {
      for (let i = 0; i < row.length; i++) {
        const m = mats[row[i]];
        if (!m) continue;
        const mesh = new THREE.Mesh(row[i] === 'S' ? thin : cube, m);
        mesh.position.set((10.5 - i) * 0.1, (4.5 - r) * 0.1, 0);
        group.add(mesh);
      }
    });
    group.userData.body = body; group.userData.shade = shade;
    return group;
  }
  function makeShape(shape, color) {
    const mat = () => new THREE.MeshStandardMaterial({ color });
    switch (shape) {
      case 'sphere': return new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16), mat());
      case 'cone': return new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 32), mat());
      case 'cylinder': return new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 32), mat());
      case 'torus': return new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 16, 48), mat());
      case 'plane': {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }));
        m.rotation.x = -Math.PI / 2; return m;
      }
      case 'claude': return claudeVoxels(color);
      default: return model(shape, color) || new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat());
    }
  }

  // Bigger models, built from simple parts. The "color" is used for each model's main part,
  // which is stored in userData.body so "set … color" can change it later.
  function model(shape, color) {
    const T = THREE, std = c => new T.MeshStandardMaterial({ color: c }), main = std(color), shade = std(new T.Color(color).multiplyScalar(0.8));
    const g = new T.Group();
    g.userData.body = main; g.userData.shade = shade;
    const add = (geo, m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); g.add(o); return o; };
    const extrude = (shapeFn, depth = 0.3) => {
      const s = new T.Shape(); shapeFn(s);
      const geo = new T.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 });
      geo.center(); return geo;
    };
    switch (shape) {
      case 'pyramid': add(new T.ConeGeometry(0.75, 1.1, 4), main, 0, 0, 0, 0, Math.PI / 4); break;
      case 'gem': add(new T.IcosahedronGeometry(0.65, 0), new T.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.15, flatShading: true })); g.userData.body = g.children[0].material; break;
      case 'ring': add(new T.TorusGeometry(0.55, 0.08, 16, 64), new T.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.25 })); add(new T.OctahedronGeometry(0.16, 0), std('#9fe8ff'), 0, 0.65, 0); g.userData.body = g.children[0].material; break;
      case 'knot': add(new T.TorusKnotGeometry(0.42, 0.14, 128, 16), main); break;
      case 'star': add(extrude(s => { for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.3 : 0.7, a = i / 10 * Math.PI * 2 + Math.PI / 2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r); } }), main); break;
      case 'heart': add(extrude(s => { s.moveTo(0, -0.6); s.bezierCurveTo(-0.9, -0.1, -0.7, 0.6, 0, 0.25); s.bezierCurveTo(0.7, 0.6, 0.9, -0.1, 0, -0.6); }), main); break;
      case 'coin': add(new T.CylinderGeometry(0.5, 0.5, 0.1, 40), new T.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.3 }), 0, 0, 0, Math.PI / 2); add(new T.TorusGeometry(0.38, 0.03, 8, 40), shade, 0, 0, 0.05); g.userData.body = g.children[0].material; break;
      case 'tree':
        add(new T.CylinderGeometry(0.12, 0.16, 0.6, 12), std('#8b5a2b'), 0, -0.4, 0);
        add(new T.ConeGeometry(0.6, 0.8, 16), main, 0, 0.15, 0); add(new T.ConeGeometry(0.45, 0.65, 16), shade, 0, 0.55, 0); break;
      case 'house':
        add(new T.BoxGeometry(1.1, 0.8, 0.9), main, 0, -0.1, 0);
        add(new T.ConeGeometry(0.85, 0.6, 4), std('#b5523b'), 0, 0.6, 0, 0, Math.PI / 4);
        add(new T.BoxGeometry(0.25, 0.4, 0.05), std('#6b4226'), 0, -0.3, 0.46);
        add(new T.BoxGeometry(0.22, 0.2, 0.05), std('#bfe6ff'), 0.32, 0.05, 0.46); add(new T.BoxGeometry(0.22, 0.2, 0.05), std('#bfe6ff'), -0.32, 0.05, 0.46); break;
      case 'car':
        add(new T.BoxGeometry(1.4, 0.35, 0.7), main, 0, -0.05, 0);
        add(new T.BoxGeometry(0.75, 0.3, 0.62), shade, -0.05, 0.27, 0);
        add(new T.BoxGeometry(0.7, 0.22, 0.64), std('#bfe6ff'), -0.05, 0.27, 0);
        for (const [x, z] of [[-0.45, 0.36], [0.45, 0.36], [-0.45, -0.36], [0.45, -0.36]]) add(new T.CylinderGeometry(0.18, 0.18, 0.12, 20), std('#222'), x, -0.25, z, Math.PI / 2); break;
      case 'rocket':
        add(new T.CylinderGeometry(0.3, 0.3, 1.1, 24), std('#f2f2f2'), 0, 0, 0);
        add(new T.ConeGeometry(0.3, 0.5, 24), main, 0, 0.8, 0);
        add(new T.SphereGeometry(0.12, 16, 12), std('#7fd8ff'), 0, 0.2, 0.27);
        for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; add(new T.BoxGeometry(0.06, 0.4, 0.3), main, Math.cos(a) * 0.32, -0.4, Math.sin(a) * 0.32, 0, -a); }
        add(new T.ConeGeometry(0.2, 0.35, 16), std('#ff9f0a'), 0, -0.72, 0, Math.PI); break;
      case 'snowman': {
        const snow = std('#ffffff');
        add(new T.SphereGeometry(0.5, 24, 16), snow, 0, -0.45, 0); add(new T.SphereGeometry(0.36, 24, 16), snow, 0, 0.22, 0); add(new T.SphereGeometry(0.26, 24, 16), snow, 0, 0.72, 0);
        add(new T.ConeGeometry(0.05, 0.25, 12), std('#ff8c1a'), 0, 0.72, 0.32, Math.PI / 2);
        add(new T.TorusGeometry(0.27, 0.06, 8, 24), main, 0, 0.5, 0, Math.PI / 2);
        add(new T.CylinderGeometry(0.2, 0.2, 0.3, 20), std('#222'), 0, 1.05, 0); add(new T.CylinderGeometry(0.3, 0.3, 0.04, 20), std('#222'), 0, 0.9, 0);
        for (const x of [-0.09, 0.09]) add(new T.SphereGeometry(0.03, 8, 8), std('#111'), x, 0.78, 0.24);
        break;
      }
      case 'robot':
        add(new T.BoxGeometry(0.8, 0.9, 0.5), main, 0, -0.2, 0);
        add(new T.BoxGeometry(0.6, 0.45, 0.45), shade, 0, 0.5, 0);
        for (const x of [-0.14, 0.14]) add(new T.SphereGeometry(0.07, 12, 8), std('#7fffd4'), x, 0.53, 0.23);
        add(new T.CylinderGeometry(0.02, 0.02, 0.25, 8), std('#999'), 0, 0.85, 0); add(new T.SphereGeometry(0.06, 12, 8), std('#ff3b30'), 0, 0.99, 0);
        for (const x of [-0.52, 0.52]) add(new T.BoxGeometry(0.18, 0.7, 0.18), std('#9aa0a6'), x, -0.2, 0);
        for (const x of [-0.2, 0.2]) add(new T.BoxGeometry(0.2, 0.5, 0.2), std('#9aa0a6'), x, -0.9, 0); break;
      case 'apple':
        add(new T.SphereGeometry(0.5, 32, 24), main, 0, 0, 0).scale.set(1, 0.9, 1);
        add(new T.CylinderGeometry(0.03, 0.04, 0.25, 8), std('#6b4226'), 0, 0.5, 0);
        add(new T.SphereGeometry(0.14, 16, 8), std('#4caf50'), 0.14, 0.52, 0).scale.set(1.4, 0.5, 0.8); break;
      case 'cloud':
        for (const [x, y, r] of [[0, 0, 0.45], [-0.45, -0.1, 0.33], [0.45, -0.1, 0.35], [0.2, 0.25, 0.32], [-0.25, 0.2, 0.3]]) add(new T.SphereGeometry(r, 24, 16), main, x, y, 0); break;
      default: return null;
    }
    return g;
  }
  function obj3d(name) {
    const t = ensureThree(), o = t.objects[String(name)];
    if (!o) throw new Error(`There's no 3D object named "${name}" — add it first.`);
    return o;
  }
  const threeApi = {
    start(bg) {
      const t = ensureThree();
      for (const n of Object.keys(t.objects)) threeApi.remove(n);
      t.scene.background = new THREE.Color(bg || '#87ceeb');
      t.camera.position.set(0, 2, 6); t.camera.lookAt(0, 0, 0);
    },
    add(shape, name, color, x, y, z) {
      const t = ensureThree(); name = String(name);
      if (t.objects[name]) threeApi.remove(name);
      const o = makeShape(shape, color);
      o.position.set(num(x), num(y), num(z));
      t.scene.add(o); t.objects[name] = o;
    },
    set(name, prop, x, y, z) {
      const o = obj3d(name);
      if (prop === 'rotation') o.rotation.set(rad(x), rad(y), rad(z)); else o[prop].set(num(x), num(y), num(z));
    },
    change(name, prop, x, y, z) {
      const o = obj3d(name), conv = prop === 'rotation' ? rad : num;
      o[prop].x += conv(x); o[prop].y += conv(y); o[prop].z += conv(z);
    },
    color(name, c) {
      const o = obj3d(name);
      if (o.userData.body) { o.userData.body.color.set(c); o.userData.shade.color.set(c).multiplyScalar(0.8); } else o.material.color.set(c);
    },
    get(name, which) {
      const o = obj3d(name), [axis, kind] = String(which).split(' ');
      return round(kind === 'rotation' ? o.rotation[axis] * 180 / Math.PI : o.position[axis]);
    },
    camera(x, y, z) { const t = ensureThree(); t.camera.position.set(num(x), num(y), num(z)); t.camera.lookAt(0, 0, 0); },
    remove(name) {
      if (!three) return;
      const o = three.objects[String(name)];
      if (!o) return;
      three.scene.remove(o);
      o.traverse(m => { if (m.geometry) m.geometry.dispose(); });
      delete three.objects[String(name)];
    },
    close() { if (!three) return; three.renderer.dispose(); three.renderer.domElement.remove(); three = null; },
  };

  const REDRAWN_THREE = Object.fromEntries(Object.entries(threeApi).map(([k, f]) => [k, (...a) => { if (k !== 'get') redraw = true; return f(...a); }]));

  // ---------- React ----------
  function ReactApp() {
    const R = window.React;
    const [, force] = R.useReducer(n => n + 1, 0);
    reactForce = force;
    R.useEffect(() => { const id = setInterval(force, 100); return () => clearInterval(id); }, []);
    let kids;
    try { kids = reactBuilder ? reactBuilder() : []; }
    catch (e) { kids = [R.createElement('div', { className: 'cb-react-error' }, friendly(e))]; }
    return R.createElement('div', { className: 'cb-react' }, ...kids);
  }
  const reactApi = {
    h: (...a) => window.React.createElement(...a),
    render(builder) {
      if (!window.React || !window.ReactDOM) throw new Error('Add the React extension first (it loads the React library).');
      reactBuilder = builder;
      if (!reactRoot) reactRoot = window.ReactDOM.createRoot(uiLayer);
      reactRoot.render(window.React.createElement(ReactApp));
    },
    handle(fn) {
      (async () => { try { await fn(); } catch (e) { if (e !== STOP) report(e, null); } finally { reactApi.refresh(); } })();
    },
    refresh() { if (reactForce) reactForce(); },
    clear() { reactBuilder = null; if (reactRoot) { reactRoot.unmount(); reactRoot = null; reactForce = null; } },
  };

  // ---------- animations ----------
  // Each animation is a timeline over t = 0..1: which Claude frame to show and how to offset the sprite.
  const ANIMS = {
    walk: { dur: 0.3, frame: t => (t < 0.5 ? 0 : 1) },
    blink: { dur: 0.2, frame: () => 'blink' },
    jump: { dur: 0.6, frame: t => (t > 0.1 && t < 0.9 ? 'jump' : 0), fx: t => ({ dy: Math.sin(t * Math.PI) * 45 }) },
    wave: { dur: 0.8, frame: t => (Math.floor(t * 4) % 2 ? 0 : 'wave') },
    happy: { dur: 0.8, frame: () => 'happy', fx: t => ({ dy: Math.abs(Math.sin(t * Math.PI * 2)) * 10 }) },
    dance: { dur: 1.2, frame: t => ['wave', 1, 'happy', 0][Math.floor(t * 8) % 4], fx: t => ({ rot: Math.sin(t * Math.PI * 4) * 12, dy: Math.abs(Math.sin(t * Math.PI * 4)) * 12 }) },
    spin: { dur: 0.6, fx: t => ({ rot: t * 360 }) },
    shake: { dur: 0.5, fx: t => ({ dx: Math.sin(t * Math.PI * 8) * 8 }) },
    pulse: { dur: 0.5, fx: t => ({ scale: 1 + Math.sin(t * Math.PI) * 0.3 }) },
  };
  function claudeFrame(s, frame) {
    if (frame == null) return null;
    const spec = s.costumes[s.costume] && s.costumes[s.costume].spec;
    if (!spec || spec.type !== 'claude') return null;
    s.frameCache = s.frameCache || {};
    const key = spec.color + ':' + frame;
    return s.frameCache[key] || (s.frameCache[key] = buildCostume({ type: 'claude', color: spec.color, frame }));
  }
  // Little synthesized sound effects, one per animation (no audio files needed).
  function sfx(name) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audio.currentTime, out = audio.createGain();
      out.gain.value = 0.25 * volume / 100;
      out.connect(audio.destination);
      const tone = (f1, f2, dur, type = 'square', at = 0, level = 1) => {
        const o = audio.createOscillator(), g = audio.createGain(), t = t0 + at;
        o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(level, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
      };
      const noise = (dur, at = 0, level = 0.6) => {
        const len = Math.floor(audio.sampleRate * dur), buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = audio.createBufferSource(), g = audio.createGain();
        src.buffer = buf; g.gain.value = level; src.connect(g).connect(out); src.start(t0 + at);
      };
      switch (name) {
        case 'walk': noise(0.04, 0, 0.5); noise(0.04, 0.15, 0.4); break;
        case 'blink': tone(1800, 1200, 0.04, 'sine', 0, 0.5); break;
        case 'jump': tone(220, 880, 0.25, 'square', 0, 0.6); break;
        case 'wave': tone(900, 1300, 0.08, 'sine'); tone(900, 1500, 0.08, 'sine', 0.2); break;
        case 'happy': [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.12, 'triangle', i * 0.09)); break;
        case 'dance': [392, 523, 440, 587, 523, 659].forEach((f, i) => tone(f, f, 0.15, 'square', i * 0.2, 0.5)); break;
        case 'spin': tone(300, 1500, 0.5, 'sawtooth', 0, 0.35); break;
        case 'shake': for (let i = 0; i < 6; i++) noise(0.03, i * 0.08, 0.5); break;
        case 'pulse': tone(160, 90, 0.35, 'sine', 0, 0.9); break;
      }
    } catch (_) { /* audio not available */ }
  }

  async function playAnim(s, name, times, isCurrent) {
    const a = ANIMS[name];
    if (!a) return;
    const g = gen;
    try {
      for (let i = 0; i < times && isCurrent(); i++) {
        const t0 = performance.now();
        if (s.animSound) sfx(name);
        for (;;) {
          const t = Math.min(1, (performance.now() - t0) / (a.dur * 1000));
          s.anim = { costume: a.frame ? claudeFrame(s, a.frame(t)) : null, fx: a.fx ? a.fx(t) : null };
          await nextFrame();
          if (g !== gen) throw STOP;
          if (t >= 1 || !isCurrent()) break;
        }
      }
    } finally { if (isCurrent()) s.anim = null; }
  }

  // ---------- per-sprite API used by generated code ----------
  function makeApi(s) {
    const api = {
      on(evt, fn) { (s.handlers[evt] = s.handlers[evt] || []).push({ fn, thread: null }); },
      tick, wait, STOP, pi: piApi, ai: aiApi, three: threeApi, react: reactApi,
      // motion
      move(n) { const d = s.dir * Math.PI / 180; s.x += num(n) * Math.sin(d); s.y += num(n) * Math.cos(d); },
      turn(d) { s.dir = normDir(s.dir + num(d)); },
      goTo(x, y) { s.x = num(x); s.y = num(y); },
      goToTarget(t) { const p = targetPos(t); if (p) { s.x = p.x; s.y = p.y; } },
      async glide(secs, x, y) {
        const g = gen, x0 = s.x, y0 = s.y, x1 = num(x), y1 = num(y), dur = num(secs) * 1000, t0 = performance.now();
        for (;;) {
          await nextFrame();
          if (g !== gen) throw STOP;
          const t = dur > 0 ? Math.min(1, (performance.now() - t0) / dur) : 1;
          s.x = x0 + (x1 - x0) * t; s.y = y0 + (y1 - y0) * t;
          if (t >= 1) break;
        }
      },
      point(d) { s.dir = normDir(d); },
      pointTowards(t) {
        const p = targetPos(t);
        if (p && (p.x !== s.x || p.y !== s.y)) s.dir = normDir(Math.atan2(p.x - s.x, p.y - s.y) * 180 / Math.PI);
      },
      changeX(n) { s.x += num(n); }, setX(n) { s.x = num(n); },
      changeY(n) { s.y += num(n); }, setY(n) { s.y = num(n); },
      bounce() {
        const b = bounds(s), d = s.dir * Math.PI / 180;
        let vx = Math.sin(d), vy = Math.cos(d), hitEdge = false;
        if (b.left < -W / 2) { vx = Math.abs(vx); s.x += -W / 2 - b.left; hitEdge = true; }
        if (b.right > W / 2) { vx = -Math.abs(vx); s.x -= b.right - W / 2; hitEdge = true; }
        if (b.bottom < -H / 2) { vy = Math.abs(vy); s.y += -H / 2 - b.bottom; hitEdge = true; }
        if (b.top > H / 2) { vy = -Math.abs(vy); s.y -= b.top - H / 2; hitEdge = true; }
        if (hitEdge) s.dir = normDir(Math.atan2(vx, vy) * 180 / Math.PI);
      },
      setRotationStyle(r) { s.rotationStyle = r; },
      xPos: () => round(s.x), yPos: () => round(s.y), direction: () => round(s.dir),
      // looks
      say(t) { s.bubble = t === '' || t == null ? null : { text: fmt(t), think: false }; },
      think(t) { s.bubble = t === '' || t == null ? null : { text: fmt(t), think: true }; },
      async sayFor(t, secs) { api.say(t); const b = s.bubble; await wait(secs); if (s.bubble === b) s.bubble = null; },
      async thinkFor(t, secs) { api.think(t); const b = s.bubble; await wait(secs); if (s.bubble === b) s.bubble = null; },
      switchCostume(v) {
        const n = s.costumes.length;
        if (!n) return;
        const i = s.costumes.findIndex(c => c.name === String(v));
        if (i >= 0) s.costume = i;
        else if (!isNaN(Number(v))) s.costume = ((Math.round(Number(v)) - 1) % n + n) % n;
      },
      nextCostume() { if (s.costumes.length) s.costume = (s.costume + 1) % s.costumes.length; },
      costumeNumber: () => s.costume + 1,
      changeSize(n) { s.size = clamp(s.size + num(n), 5, 500); }, setSize(n) { s.size = clamp(num(n), 5, 500); },
      size: () => round(s.size),
      changeEffect(e, n) { s.effects[e] = (s.effects[e] || 0) + num(n); }, setEffect(e, n) { s.effects[e] = num(n); },
      clearEffects() { s.effects = { color: 0, ghost: 0 }; },
      show() { s.visible = true; }, hide() { s.visible = false; },
      // Text boxes: change the words or colour of the current text costume.
      setText(t) { const c = s.costumes[s.costume]; if (c && c.spec.type === 'text') s.costumes[s.costume] = buildCostume({ ...c.spec, text: fmt(t) }); },
      setTextColor(col) { const c = s.costumes[s.costume]; if (c && c.spec.type === 'text') s.costumes[s.costume] = buildCostume({ ...c.spec, color: String(col) }); },
      textOf: () => { const c = s.costumes[s.costume]; return c && c.spec.type === 'text' ? c.spec.text : ''; },
      async playAnimation(name, times) {
        const token = s.animToken = {};
        await playAnim(s, String(name), Math.max(1, Math.round(num(times) || 1)), () => s.animToken === token);
      },
      startAnimation(name) {
        const token = s.animToken = {};
        playAnim(s, String(name), Infinity, () => s.animToken === token).catch(() => {});
      },
      stopAnimation() { s.animToken = null; s.anim = null; },
      setAutoBlink(on) { s.autoBlink = !!on; },
      setAnimSound(on) { s.animSound = !!on; },
      goFront() { const i = sprites.indexOf(s); if (i >= 0) { sprites.splice(i, 1); sprites.push(s); } },
      setStageColor(c) { stageColor = c; },
      switchBackdrop(v) {
        const n = stage.backdrops.length;
        if (!n) return;
        const i = stage.backdrops.findIndex(b => b.spec.name === String(v));
        stage.backdrop = i >= 0 ? i : !isNaN(Number(v)) ? ((Math.round(Number(v)) - 1) % n + n) % n : stage.backdrop;
        showBackdrop();
      },
      nextBackdrop() { if (stage.backdrops.length) { stage.backdrop = (stage.backdrop + 1) % stage.backdrops.length; showBackdrop(); } },
      backdropNumber: () => stage.backdrop + 1,
      print(v) { if (rt.onPrint) rt.onPrint(fmt(v), s); else console.log(fmt(v)); },
      // sound
      async playNote(note, secs) {
        try {
          audio = audio || new (window.AudioContext || window.webkitAudioContext)();
          const o = audio.createOscillator(), gn = audio.createGain(), t = audio.currentTime, len = Math.max(0.05, num(secs));
          o.type = 'triangle'; o.frequency.value = 440 * Math.pow(2, (num(note) - 69) / 12);
          gn.gain.setValueAtTime(0.0001, t);
          gn.gain.exponentialRampToValueAtTime(0.3 * volume / 100 + 0.0001, t + 0.02);
          gn.gain.exponentialRampToValueAtTime(0.0001, t + len);
          o.connect(gn).connect(audio.destination); o.start(t); o.stop(t + len + 0.05);
        } catch (_) { /* audio not available */ }
        await wait(secs);
      },
      setVolume(n) { volume = clamp(num(n), 0, 100); }, changeVolume(n) { volume = clamp(volume + num(n), 0, 100); },
      volume: () => volume,
      // events
      broadcast(m) { dispatch('msg:' + m); },
      async broadcastAndWait(m) { await guard(Promise.all(dispatch('msg:' + m))); },
      // control
      stopAll() { stopAll(); },
      // sensing
      touching(t) { return touching(s, t); },
      keyPressed(k) { return k === 'any' ? keys.size > 0 : keys.has(k); },
      mouseX: () => Math.round(mouse.x), mouseY: () => Math.round(mouse.y), mouseDown: () => mouse.down,
      async ask(q) {
        while (asking) await tick();
        asking = true;
        const bubble = s.visible ? { text: fmt(q), think: false } : null;
        if (bubble) s.bubble = bubble;
        askQ.textContent = bubble ? '' : fmt(q);
        askQ.style.display = bubble ? 'none' : '';
        askInput.value = ''; askBox.classList.add('show');
        setTimeout(() => askInput.focus(), 0);
        try { answer = await new Promise((res, rej) => { askPending = { res, rej }; }); }
        finally { asking = false; askPending = null; askBox.classList.remove('show'); if (bubble && s.bubble === bubble) s.bubble = null; }
      },
      answer: () => answer,
      timer: () => round((performance.now() - timerStart) / 1000),
      resetTimer() { timerStart = performance.now(); },
      distanceTo(t) { const p = targetPos(t); return p ? round(Math.hypot(p.x - s.x, p.y - s.y)) : 0; },
    };
    // Anything that changes what's on screen asks for a redraw (see tick()).
    for (const name of ['move', 'turn', 'goTo', 'goToTarget', 'point', 'pointTowards', 'changeX', 'setX', 'changeY', 'setY', 'bounce', 'setRotationStyle',
      'say', 'think', 'switchCostume', 'nextCostume', 'changeSize', 'setSize', 'changeEffect', 'setEffect', 'clearEffects', 'show', 'hide', 'goFront',
      'setStageColor', 'switchBackdrop', 'nextBackdrop', 'setText', 'setTextColor', 'print']) {
      const f = api[name];
      api[name] = (...a) => { redraw = true; return f(...a); };
    }
    api.three = REDRAWN_THREE;
    return api;
  }

  // ---------- the Stage ----------
  function buildBackdrop(spec) {
    const b = { spec, img: null };
    if (spec.type === 'image') { b.img = new Image(); b.img.src = spec.src; }
    return b;
  }
  function showBackdrop() { const b = stage.backdrops[stage.backdrop]; if (b && b.spec.type === 'color') stageColor = b.spec.color; }
  function setStage(spec) {
    spec = spec || {};
    stage.handlers = {}; stage.blocks = spec.blocks || null;
    stage.backdrops = (spec.backdrops && spec.backdrops.length ? spec.backdrops : [{ type: 'color', name: 'backdrop1', color: spec.color || stageColor }]).map(buildBackdrop);
    stage.backdrop = Math.min(Number(spec.backdrop) || 0, stage.backdrops.length - 1);
    showBackdrop();
  }
  const serializeStage = () => ({ backdrops: stage.backdrops.map(b => b.spec), backdrop: stage.backdrop, color: stageColor });

  const rt = {
    config, sprites, STOP,
    get stageColor() { return stageColor; },
    setStageColor(c) { stageColor = c; const b = stage.backdrops[stage.backdrop]; if (b && b.spec.type === 'color') b.spec = { ...b.spec, color: c }; },
    get stage() { return stage; },
    setStage, serializeStage,
    addBackdrop(spec) { stage.backdrops.push(buildBackdrop(spec)); stage.backdrop = stage.backdrops.length - 1; showBackdrop(); },
    setBackdrop(i, spec) { stage.backdrops[i] = buildBackdrop(spec); showBackdrop(); },
    removeBackdrop(i) { if (stage.backdrops.length > 1) { stage.backdrops.splice(i, 1); stage.backdrop = Math.min(stage.backdrop, stage.backdrops.length - 1); showBackdrop(); } },
    selectBackdrop(i) { stage.backdrop = i; showBackdrop(); },
    addSprite, serializeSprite, compile, runCode, greenFlag, stopAll, dispatch, isRunning, piRequest, piCall, piEmulator: null,
    claudeCanvas, claudeColors: Object.keys(CLAUDE_COLORS), animations: Object.keys(ANIMS), drawThumb,
    removeSprite(s) { const i = sprites.indexOf(s); if (i >= 0) sprites.splice(i, 1); },
    renameSprite(s, name) { if (name === s.name) return; s.name = ''; s.name = uniqueName(name); },
    addCostume(s, spec) { s.costumes.push(buildCostume(spec)); s.costume = s.costumes.length - 1; },
    costumeCanvas: spec => buildCostume(spec).canvas,
    setCostume(s, index, spec) { s.costumes[index] = buildCostume(spec); s.frameCache = null; },
    clear() { stopAll(); sprites.length = 0; stageColor = '#ffffff'; setStage(null); threeApi.close(); reactApi.clear(); },
    aiChat: null, onError: null, onPrint: null, onSpriteDown: null, onSpriteMoved: null, beforeDispatch: null,
  };
  stage = { id: 'stage', name: 'Stage', isStage: true, x: 0, y: 0, dir: 90, size: 100, visible: false, rotationStyle: "don't rotate",
    costumes: [], costume: 0, effects: { color: 0, ghost: 0 }, bubble: null, handlers: {}, blocks: null, backdrops: [], backdrop: 0 };
  stage.api = makeApi(stage);
  setStage(null);
  return rt;
}
