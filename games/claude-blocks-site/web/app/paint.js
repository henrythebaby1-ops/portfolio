/* Claude Blocks paint editor: draw or edit sprite costumes inside the app. */
(() => {
  const CB = window.CB;
  const $ = s => document.querySelector(s);
  const dlg = $('#paintDialog'), cv = $('#paintCanvas'), ctx = cv.getContext('2d', { willReadFrequently: true });
  const colorIn = $('#paintColor'), sizeIn = $('#paintSize'), sizeVal = $('#paintSizeVal'), textIn = $('#paintText'), filledIn = $('#paintFilled'), nameIn = $('#paintName');
  let tool = 'pen', drawing = false, last = null, start = null, snapshot = null, undo = [], opts = null;

  // ---------- tools ----------
  document.querySelectorAll('.paint-tool').forEach(b => {
    b.onclick = () => {
      tool = b.dataset.tool;
      document.querySelectorAll('.paint-tool').forEach(x => x.classList.toggle('active', x === b));
      $('#paintTextWrap').hidden = tool !== 'text';
      $('#paintFilledWrap').hidden = !['rect', 'circle'].includes(tool);
    };
  });
  sizeIn.oninput = () => { sizeVal.textContent = sizeIn.value; };

  const point = e => {
    const r = cv.getBoundingClientRect();
    return [Math.floor((e.clientX - r.left) / r.width * cv.width), Math.floor((e.clientY - r.top) / r.height * cv.height)];
  };
  const size = () => Number(sizeIn.value);
  function stamp(x, y, erase) {
    const s = size();
    ctx.save();
    if (erase) ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = colorIn.value;
    if (s <= 2) ctx.fillRect(x - Math.floor(s / 2), y - Math.floor(s / 2), s, s);   // crisp pixels for pixel art
    else { ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, s / 2, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  function line(a, b, erase) {
    const steps = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), 1);
    for (let i = 0; i <= steps; i++) stamp(Math.round(a[0] + (b[0] - a[0]) * i / steps), Math.round(a[1] + (b[1] - a[1]) * i / steps), erase);
  }
  function shape(a, b) {
    ctx.putImageData(snapshot, 0, 0);
    ctx.save();
    ctx.strokeStyle = ctx.fillStyle = colorIn.value; ctx.lineWidth = size(); ctx.lineCap = 'round';
    ctx.beginPath();
    if (tool === 'line') { ctx.moveTo(a[0] + 0.5, a[1] + 0.5); ctx.lineTo(b[0] + 0.5, b[1] + 0.5); ctx.stroke(); }
    else if (tool === 'rect') { ctx.rect(Math.min(a[0], b[0]) + 0.5, Math.min(a[1], b[1]) + 0.5, Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); filledIn.checked ? ctx.fill() : ctx.stroke(); }
    else { ctx.ellipse((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.abs(b[0] - a[0]) / 2 + 0.5, Math.abs(b[1] - a[1]) / 2 + 0.5, 0, 0, Math.PI * 2); filledIn.checked ? ctx.fill() : ctx.stroke(); }
    ctx.restore();
  }
  function fill(x, y) {
    const img = ctx.getImageData(0, 0, cv.width, cv.height), d = img.data, w = cv.width, h = cv.height;
    const at = (x + y * w) * 4, target = [d[at], d[at + 1], d[at + 2], d[at + 3]];
    const n = parseInt(colorIn.value.slice(1), 16), col = [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
    if (target.every((v, i) => v === col[i])) return;
    const same = i => d[i] === target[0] && d[i + 1] === target[1] && d[i + 2] === target[2] && d[i + 3] === target[3];
    const stack = [[x, y]];
    while (stack.length) {
      const [px, py] = stack.pop();
      if (px < 0 || py < 0 || px >= w || py >= h) continue;
      const i = (px + py * w) * 4;
      if (!same(i)) continue;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    ctx.putImageData(img, 0, 0);
  }
  const save = () => { undo.push(ctx.getImageData(0, 0, cv.width, cv.height)); if (undo.length > 40) undo.shift(); };

  cv.addEventListener('pointerdown', e => {
    e.preventDefault();
    cv.setPointerCapture(e.pointerId);
    const p = point(e);
    if (tool === 'picker') {
      const [r, g, b, a] = ctx.getImageData(p[0], p[1], 1, 1).data;
      if (a) colorIn.value = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
      return;
    }
    save();
    if (tool === 'fill') { fill(p[0], p[1]); return; }
    if (tool === 'text') {
      ctx.save(); ctx.fillStyle = colorIn.value; ctx.font = `700 ${Math.max(6, size() * 3)}px system-ui, sans-serif`; ctx.textBaseline = 'middle';
      ctx.fillText(textIn.value || 'Text', p[0], p[1]); ctx.restore();
      return;
    }
    drawing = true; last = start = p;
    snapshot = ctx.getImageData(0, 0, cv.width, cv.height);
    if (tool === 'pen' || tool === 'eraser') stamp(p[0], p[1], tool === 'eraser');
  });
  cv.addEventListener('pointermove', e => {
    if (!drawing) return;
    const p = point(e);
    if (tool === 'pen' || tool === 'eraser') { line(last, p, tool === 'eraser'); last = p; }
    else shape(start, p);
  });
  const stop = () => { drawing = false; };
  cv.addEventListener('pointerup', stop);
  cv.addEventListener('pointercancel', stop);

  $('#paintUndo').onclick = () => { const img = undo.pop(); if (img) ctx.putImageData(img, 0, 0); };
  $('#paintClear').onclick = () => { save(); ctx.clearRect(0, 0, cv.width, cv.height); };
  $('#paintFlip').onclick = () => {
    save();
    const tmp = document.createElement('canvas'); tmp.width = cv.width; tmp.height = cv.height;
    tmp.getContext('2d').drawImage(cv, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height); ctx.save(); ctx.scale(-1, 1); ctx.drawImage(tmp, -cv.width, 0); ctx.restore();
  };
  window.addEventListener('keydown', e => {
    if (dlg.open && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && e.target !== textIn && e.target !== nameIn) { e.preventDefault(); $('#paintUndo').click(); }
  });

  // Show the canvas as big as fits, using whole-number zoom so pixel art stays crisp.
  function layout() {
    const zoom = Math.max(1, Math.floor(Math.min(560 / cv.width, 380 / cv.height)));
    cv.style.width = cv.width * zoom + 'px'; cv.style.height = cv.height * zoom + 'px';
    $('#paintZoom').textContent = `${cv.width}×${cv.height} px · ${zoom}× zoom`;
  }

  function finish(mode) {
    if (opts.exact) {
      const spec = { type: 'image', src: cv.toDataURL('image/png'), name: nameIn.value.trim() || 'backdrop' };
      dlg.close(); opts.onSave(spec, mode); return;
    }
    // Trim empty space around the drawing so the sprite's centre is the drawing's centre.
    const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let x0 = cv.width, y0 = cv.height, x1 = -1, y1 = -1;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (img[(x + y * cv.width) * 4 + 3] > 0) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    if (x1 < 0) { CB.log('⚠ The drawing is empty — draw something first!', 'err'); return; }
    const out = document.createElement('canvas'); out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
    out.getContext('2d').drawImage(cv, -x0, -y0);
    const spec = { type: 'image', src: out.toDataURL('image/png'), name: nameIn.value.trim() || 'costume', pixel: opts.pixel, scale: opts.scale };
    dlg.close();
    opts.onSave(spec, mode);
  }
  $('#paintSave').onclick = () => finish('replace');
  $('#paintSaveNew').onclick = () => finish('new');

  CB.paint = {
    /** source: a canvas to edit (or null for a blank one). onSave(spec, 'replace' | 'new') */
    open({ source = null, width = 128, height = 128, name = 'costume', pixel, scale, onSave, newOnly = false, exact = false }) {
      const pad = source && !exact ? 8 : 0;
      cv.width = source ? source.width + pad * 2 : width;
      cv.height = source ? source.height + pad * 2 : height;
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (source) ctx.drawImage(source, pad, pad);
      opts = { onSave, pixel: pixel ?? cv.width <= 100, scale, exact };
      undo = [];
      nameIn.value = name;
      sizeIn.value = cv.width <= 100 ? 1 : 6; sizeVal.textContent = sizeIn.value;
      $('#paintSave').textContent = newOnly ? 'Create sprite' : exact ? 'Save backdrop' : 'Save costume';
      $('#paintSaveNew').textContent = exact ? 'Save as new backdrop' : 'Save as new costume';
      $('#paintSaveNew').hidden = newOnly;
      layout();
      dlg.showModal();
    },
  };
})();
