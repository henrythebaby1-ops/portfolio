/* Claude Blocks: the editor app — sprites, workspace, project files and panels. */
(() => {
  const CB = window.CB;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const store = (CB.store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (_) { return false; } },
  });

  // ---------- runtime ----------
  const settings = store.get('cb-settings', {});
  const rt = (CB.rt = CBRuntime($('#stage'), {
    draggable: true,
    pi: { host: settings.piHost || '', token: settings.piToken || '', mode: settings.piMode || 'emulator' },
    ai: { host: settings.aiHost || 'http://localhost:11434', model: settings.aiModel || '' },
  }));
  CB.saveSettings = () => store.set('cb-settings', {
    piHost: rt.config.pi.host, piToken: rt.config.pi.token, piMode: rt.config.pi.mode, aiHost: rt.config.ai.host, aiModel: rt.config.ai.model,
  });

  // Logo + favicon from the pixel mascot.
  const logo = rt.claudeCanvas('orange', 0, 2, false);
  $('#logo').replaceWith(Object.assign(logo, { id: 'logo', title: 'Claude Blocks' }));
  const fav = document.createElement('canvas'); fav.width = fav.height = 64;
  fav.getContext('2d').drawImage(rt.claudeCanvas('orange', 0, 3, false), -1, 17);
  $('#favicon').href = fav.toDataURL();

  // ---------- output ----------
  const outEl = $('#output');
  CB.log = (text, cls) => {
    const d = document.createElement('div');
    d.textContent = text;
    if (cls) d.className = cls;
    outEl.appendChild(d);
    outEl.scrollTop = outEl.scrollHeight;
    const tab = $('.ptab[data-p="output"]');
    if (!tab.classList.contains('active')) tab.classList.add('alert');
  };
  rt.onPrint = text => CB.log(text);
  rt.onError = (msg, s) => CB.log('⚠ ' + (s ? s.name + ': ' : '') + msg, 'err');
  $('#clearOutput').onclick = () => { outEl.textContent = ''; };

  // ---------- workspace ----------
  let exts = new Set(), current = null, dirty = true, loading = false, saveTimer = null;
  const ws = (CB.ws = Blockly.inject('blocklyDiv', {
    toolbox: CB.buildToolbox([]), theme: CB.theme, renderer: 'zelos', trashcan: true,
    zoom: { controls: true, wheel: true, startScale: 0.75 },
    grid: { spacing: 40, length: 2, colour: '#e5e3dc' },
  }));
  CB.spriteNames = () => rt.sprites.map(s => s.name);
  const isStage = () => current === rt.stage;
  const toolbox = () => CB.buildToolbox([...exts], { stage: isStage() });

  let loadFailed = false;
  function saveCurrent() { if (current && !loading && !loadFailed) current.blocks = Blockly.serialization.workspaces.save(ws); }
  function selectSprite(s) {
    if (!s || s === current) return;
    saveCurrent();
    const wasStage = isStage();
    current = s;
    if (wasStage !== isStage()) ws.updateToolbox(toolbox());   // the Stage has its own blocks (no Motion)
    loading = true;
    Blockly.Events.disable();
    let failed = false;
    try { ws.clear(); if (s.blocks) Blockly.serialization.workspaces.load(s.blocks, ws); }
    catch (e) { failed = true; CB.log(`⚠ Could not show ${s.name}'s blocks (they are kept safe): ${e.message}`, 'err'); }
    finally { Blockly.Events.enable(); loading = false; }
    // Never let a failed load overwrite the sprite's saved scripts with an empty workspace.
    loadFailed = failed;
    ws.clearUndo();
    renderSprites(); fillInfo(); renderCostumes(); syncTargetUI();
  }
  // The Sprites panel shows backdrop tools when the Stage is selected.
  function syncTargetUI() {
    const stage = isStage();
    $('#p-sprites').dataset.target = stage ? 'stage' : 'sprite';
    $('#paintBtn').textContent = stage ? '🎨 Paint backdrop' : '🎨 Paint';
    $('#addCostumeBtn').textContent = stage ? '⬆ Upload backdrop' : '⬆ Upload costume';
    $('#deleteSpriteBtn').textContent = stage ? '🗑 Delete backdrop' : '🗑 Delete sprite';
    $('#costumeLabel').textContent = stage ? 'Backdrops' : 'Costumes';
  }
  ws.addChangeListener(e => {
    if (e.type === Blockly.Events.CLICK && e.targetType === 'block' && e.blockId) {
      const b = ws.getBlockById(e.blockId);
      if (b && current) runStack(b.getRootBlock());
      return;
    }
    if (e.isUiEvent || loading) return;
    saveCurrent(); dirty = true; scheduleSave();
  });
  function runStack(root) {
    try { rt.runCode(current, CB.compileStack(ws, root), root.id); }
    catch (e) { CB.log('⚠ Could not run that: ' + e.message, 'err'); }
  }
  function compileAll() {
    saveCurrent();
    for (const s of [rt.stage, ...rt.sprites]) {
      let code = '';
      try { code = CB.compileSprite(s.blocks); } catch (e) { CB.log(`⚠ ${s.name}: could not convert blocks — ${e.message}`, 'err'); }
      s.code = code;
      rt.compile(s, code);
    }
    dirty = false;
  }
  rt.beforeDispatch = () => { if (dirty) compileAll(); };
  $('#flagBtn').onclick = () => { compileAll(); rt.greenFlag(); };
  $('#stopBtn').onclick = () => rt.stopAll();

  CB.openCategory = name => {
    showView('blocks');
    const tb = ws.getToolbox();
    const item = tb && tb.getToolboxItems().find(i => i.getName && i.getName() === name);
    if (item) tb.setSelectedItem(item);
  };

  // ---------- confirm box (browser confirm() popups are blocked in some browsers) ----------
  CB.confirm = (message, okLabel = 'OK') => new Promise(resolve => {
    const d = $('#confirmDialog');
    $('#confirmText').textContent = message;
    $('#confirmYes').textContent = okLabel;
    d.returnValue = '';
    d.addEventListener('close', () => resolve(d.returnValue === 'yes'), { once: true });
    d.showModal();
  });

  // ---------- sprites panel ----------
  const thumbs = new Map();
  function renderSprites() {
    const grid = $('#spriteGrid');
    grid.textContent = ''; thumbs.clear();
    const st = document.createElement('button');
    st.className = 'sprite-tile stage-tile' + (isStage() ? ' selected' : '');
    const scv = document.createElement('canvas'); scv.width = 112; scv.height = 84;
    drawBackdrop(rt.stage.backdrops[rt.stage.backdrop], scv); thumbs.set(rt.stage, scv);
    const sl = document.createElement('span'); sl.textContent = 'Stage';
    st.append(scv, sl); st.title = 'The Stage: backdrops and its own scripts';
    st.onclick = () => selectSprite(rt.stage);
    grid.appendChild(st);
    for (const s of rt.sprites) {
      const tile = document.createElement('button');
      tile.className = 'sprite-tile' + (s === current ? ' selected' : '');
      const cv = document.createElement('canvas'); cv.width = cv.height = 112;
      rt.drawThumb(s, cv); thumbs.set(s, cv);
      const label = document.createElement('span'); label.textContent = s.name;
      tile.append(cv, label);
      tile.onclick = () => selectSprite(s);
      const del = document.createElement('span');
      del.className = 'del'; del.textContent = '×'; del.title = 'Delete sprite';
      del.onclick = ev => { ev.stopPropagation(); askDelete(s); };
      tile.appendChild(del);
      grid.appendChild(tile);
    }
    const add = document.createElement('button');
    add.className = 'sprite-tile add';
    add.innerHTML = '<b>＋</b><span>Add sprite</span>';
    add.onclick = openSpriteDialog;
    grid.appendChild(add);
  }
  async function askDelete(s) {
    if (await CB.confirm(`Delete the sprite "${s.name}" and its scripts?`, 'Delete')) deleteSprite(s);
  }
  $('#deleteSpriteBtn').onclick = async () => {
    if (!current) return;
    if (!isStage()) return askDelete(current);
    if (rt.stage.backdrops.length < 2) { CB.log('The Stage needs at least one backdrop.', 'err'); showPanel('output'); return; }
    if (await CB.confirm('Delete this backdrop?', 'Delete')) { rt.removeBackdrop(rt.stage.backdrop); renderCostumes(); renderSprites(); scheduleSave(); }
  };
  function deleteSprite(s) {
    rt.removeSprite(s);
    if (current === s) { current = null; selectSprite(rt.sprites[0] || rt.stage); }
    dirty = true; renderSprites(); scheduleSave();
  }
  function addNewSprite(spec) {
    const s = rt.addSprite({ ...spec, x: Math.round(Math.random() * 240 - 120), y: Math.round(Math.random() * 160 - 80) });
    dirty = true; selectSprite(s); renderSprites(); scheduleSave();
    return s;
  }

  const info = { name: $('#spName'), x: $('#spX'), y: $('#spY'), size: $('#spSize'), dir: $('#spDir'), show: $('#spShow') };
  // ---------- costumes strip: click to switch, double-click to paint ----------
  function drawBackdrop(b, cv) {
    const x = cv.getContext('2d');
    x.fillStyle = (b && b.spec.type === 'color' ? b.spec.color : rt.stageColor) || '#fff'; x.fillRect(0, 0, cv.width, cv.height);
    if (b && b.img && b.img.naturalWidth) { const k = Math.max(cv.width / b.img.naturalWidth, cv.height / b.img.naturalHeight); x.drawImage(b.img, (cv.width - b.img.naturalWidth * k) / 2, (cv.height - b.img.naturalHeight * k) / 2, b.img.naturalWidth * k, b.img.naturalHeight * k); }
  }
  function renderCostumes() {
    const strip = $('#costumeStrip');
    strip.textContent = '';
    if (!current) return;
    if (isStage()) {
      rt.stage.backdrops.forEach((b, i) => {
        const chip = document.createElement('button');
        chip.className = 'costume-chip backdrop' + (i === rt.stage.backdrop ? ' current' : '');
        chip.title = `${b.spec.name || 'backdrop'} — click to show it, double-click to paint`;
        const cv = document.createElement('canvas'); cv.width = 64; cv.height = 48;
        drawBackdrop(b, cv); if (b.img && !b.img.complete) b.img.onload = () => drawBackdrop(b, cv);
        const n = document.createElement('span'); n.className = 'n'; n.textContent = i + 1;
        chip.append(cv, n);
        chip.onclick = () => { rt.selectBackdrop(i); $('#stageColor').value = rt.stageColor; renderCostumes(); renderSprites(); scheduleSave(); };
        chip.ondblclick = () => { rt.selectBackdrop(i); paintCurrent(); };
        strip.appendChild(chip);
      });
      const add = document.createElement('button');
      add.className = 'costume-chip add'; add.textContent = '＋'; add.title = 'Add a plain-colour backdrop (pick the colour below)';
      add.onclick = () => { rt.addBackdrop({ type: 'color', name: 'backdrop' + (rt.stage.backdrops.length + 1), color: $('#stageColor').value }); renderCostumes(); renderSprites(); scheduleSave(); };
      strip.appendChild(add);
      return;
    }
    current.costumes.forEach((c, i) => {
      const chip = document.createElement('button');
      chip.className = 'costume-chip' + (i === current.costume ? ' current' : '');
      chip.title = `${c.name} — click to wear it, double-click to paint`;
      const cv = document.createElement('canvas'); cv.width = cv.height = 72;
      const x = cv.getContext('2d'), k = c.w ? Math.min(72 / c.w, 72 / c.h) * 0.9 : 1;
      x.imageSmoothingEnabled = !c.pixel;
      if (c.w) x.drawImage(c.canvas, (72 - c.w * k) / 2, (72 - c.h * k) / 2, c.w * k, c.h * k);
      const n = document.createElement('span'); n.className = 'n'; n.textContent = i + 1;
      chip.append(cv, n);
      chip.onclick = () => { current.costume = i; renderCostumes(); fillInfo(); scheduleSave(); };
      chip.ondblclick = () => { current.costume = i; paintCurrent(); };
      strip.appendChild(chip);
    });
  }
  CB.renderCostumes = renderCostumes;
  function paintCurrent() {
    if (isStage()) {
      const i = rt.stage.backdrop, b = rt.stage.backdrops[i], cv = document.createElement('canvas');
      cv.width = 480; cv.height = 360; drawBackdrop(b, cv);
      CB.paint.open({
        source: cv, exact: true, name: b ? b.spec.name || 'backdrop' : 'backdrop', pixel: false,
        onSave(spec, mode) {
          if (mode === 'new') rt.addBackdrop(spec); else rt.setBackdrop(i, spec);
          setTimeout(() => { renderCostumes(); renderSprites(); }, 150);
          scheduleSave();
          CB.log(`🎨 ${mode === 'new' ? 'Added' : 'Saved'} backdrop “${spec.name}”.`, 'ok');
        },
      });
      return;
    }
    const s = current, c = s && s.costumes[s.costume];
    if (!c) return;
    CB.paint.open({
      source: c.w ? c.canvas : null, name: c.name, pixel: c.pixel, scale: c.scale,
      onSave(spec, mode) {
        if (mode === 'new') rt.addCostume(s, spec); else rt.setCostume(s, s.costume, spec);
        setTimeout(() => { renderCostumes(); renderSprites(); }, 100);
        dirty = true; scheduleSave();
        CB.log(`🎨 ${mode === 'new' ? 'Added' : 'Saved'} costume “${spec.name}” for ${s.name}.`, 'ok');
      },
    });
  }
  $('#paintBtn').onclick = paintCurrent;
  CB.openPaint = paintCurrent;
  $('#paintSpriteBtn').onclick = () => {
    $('#spriteDialog').close();
    CB.paint.open({ width: 128, height: 128, name: 'Drawing', newOnly: true, onSave: spec => { addNewSprite({ name: spec.name || 'Drawing', costumes: [spec] }); renderCostumes(); } });
  };

  // ---------- text boxes ----------
  let textTarget = null;
  const tb = { text: $('#tbText'), size: $('#tbSize'), color: $('#tbColor'), font: $('#tbFont'), box: $('#tbBox'), boxColor: $('#tbBoxColor') };
  const tbSpec = () => ({ type: 'text', name: 'text', text: tb.text.value, size: +tb.size.value || 32, color: tb.color.value, font: tb.font.value, box: tb.box.checked, boxColor: tb.boxColor.value });
  function tbPreview() {
    const src = rt.costumeCanvas(tbSpec()), cv = $('#tbPreview');
    cv.width = src.width; cv.height = src.height;
    cv.getContext('2d').drawImage(src, 0, 0);
  }
  Object.values(tb).forEach(e => { e.oninput = tbPreview; });
  function openTextDialog(spec) {
    textTarget = spec ? current : null;
    const d = spec || { text: 'Hello, New World!', size: 32, color: '#1f1e1d', font: 'sans', box: true, boxColor: '#ffffff' };
    tb.text.value = d.text; tb.size.value = d.size; tb.color.value = d.color; tb.font.value = d.font || 'sans'; tb.box.checked = !!d.box; tb.boxColor.value = d.boxColor || '#ffffff';
    $('#tbSave').textContent = spec ? 'Save text' : 'Add text box';
    tbPreview();
    $('#textDialog').showModal();
  }
  $('#textSpriteBtn').onclick = () => { $('#spriteDialog').close(); openTextDialog(null); };
  $('#editTextBtn').onclick = () => { const c = current && current.costumes[current.costume]; if (c && c.spec.type === 'text') openTextDialog(c.spec); };
  $('#tbSave').onclick = () => {
    const spec = tbSpec();
    $('#textDialog').close();
    if (textTarget) { rt.setCostume(textTarget, textTarget.costume, spec); renderCostumes(); renderSprites(); dirty = true; scheduleSave(); }
    else addNewSprite({ name: 'Text', rotationStyle: "don't rotate", costumes: [spec] });
  };

  function fillInfo() {
    if (!current || isStage()) return;
    const cc = current.costumes[current.costume];
    $('#editTextBtn').hidden = !(cc && cc.spec.type === 'text');
    const a = document.activeElement;
    if (a !== info.name) info.name.value = current.name;
    if (a !== info.x) info.x.value = Math.round(current.x);
    if (a !== info.y) info.y.value = Math.round(current.y);
    if (a !== info.size) info.size.value = Math.round(current.size);
    if (a !== info.dir) info.dir.value = Math.round(current.dir);
    info.show.checked = current.visible;
  }
  info.name.onchange = () => { rt.renameSprite(current, info.name.value.trim() || current.name); dirty = true; renderSprites(); scheduleSave(); };
  info.x.onchange = () => { current.x = +info.x.value || 0; scheduleSave(); };
  info.y.onchange = () => { current.y = +info.y.value || 0; scheduleSave(); };
  info.size.onchange = () => { current.size = Math.max(5, +info.size.value || 100); scheduleSave(); };
  info.dir.onchange = () => { current.dir = +info.dir.value || 90; scheduleSave(); };
  info.show.onchange = () => { current.visible = info.show.checked; scheduleSave(); };
  $('#stageColor').oninput = e => { rt.setStageColor(e.target.value); scheduleSave(); };
  rt.onSpriteDown = s => selectSprite(s);
  rt.onSpriteMoved = () => scheduleSave();

  setInterval(() => {
    fillInfo();
    $('#flagBtn').classList.toggle('running', rt.isRunning());
    for (const [s, cv] of thumbs) if (s === rt.stage) drawBackdrop(s.backdrops[s.backdrop], cv); else rt.drawThumb(s, cv);
    const strip = $('#costumeStrip');
    const items = current ? (isStage() ? current.backdrops.length + 1 : current.costumes.length) : 0, at = current ? (isStage() ? current.backdrop : current.costume) : -1;
    if (current && strip.children.length !== items) renderCostumes();
    else if (current) [...strip.children].forEach((chip, i) => chip.classList.toggle('current', i === at));
  }, 250);

  // ---------- add-sprite dialog ----------
  const LIBRARY = {
    Animals: 'Cat 🐱, Dog 🐶, Fox 🦊, Panda 🐼, Lion 🦁, Tiger 🐯, Frog 🐸, Monkey 🐵, Penguin 🐧, Owl 🦉, Bird 🐦, Duck 🦆, Unicorn 🦄, Horse 🐴, Pig 🐷, Cow 🐮, Rabbit 🐰, Mouse 🐭, Bear 🐻, Koala 🐨, Turtle 🐢, Snake 🐍, Octopus 🐙, Fish 🐟, Tropical fish 🐠, Shark 🦈, Whale 🐳, Dolphin 🐬, Crab 🦀, Butterfly 🦋, Bee 🐝, Ladybug 🐞, T-Rex 🦖, Dragon 🐉, Bat 🦇, Hedgehog 🦔',
    'People & fantasy': 'Robot 🤖, Alien 👽, Monster 👾, Ghost 👻, Wizard 🧙, Fairy 🧚, Superhero 🦸, Ninja 🥷, Astronaut 🧑‍🚀, Princess 👸, Zombie 🧟, Vampire 🧛, Clown 🤡, Smiley 😀, Cool 😎, Laughing 😂, Wow 😮, Angry 😠, Skull 💀, Poop 💩',
    Food: 'Apple 🍎, Banana 🍌, Pizza 🍕, Burger 🍔, Fries 🍟, Donut 🍩, Cookie 🍪, Cake 🎂, Ice cream 🍦, Watermelon 🍉, Strawberry 🍓, Cherries 🍒, Carrot 🥕, Taco 🌮, Popcorn 🍿, Candy 🍬',
    'Space & nature': 'Rocket 🚀, Planet 🪐, Star ⭐, Moon 🌙, Sun ☀️, Comet ☄️, UFO 🛸, Earth 🌍, Tree 🌳, Palm 🌴, Flower 🌸, Sunflower 🌻, Cactus 🌵, Mushroom 🍄, Cloud ☁️, Lightning ⚡, Rainbow 🌈, Snowflake ❄️, Fire 🔥, Volcano 🌋, Wave 🌊',
    'Sports & games': 'Soccer ball ⚽, Basketball 🏀, Football 🏈, Tennis ball 🎾, Baseball ⚾, Trophy 🏆, Medal 🥇, Dice 🎲, Target 🎯, Joystick 🕹️, Puzzle 🧩, Balloon 🎈, Gift 🎁, Bowling 🎳, Kite 🪁',
    Vehicles: 'Car 🚗, Race car 🏎️, Bus 🚌, Police car 🚓, Fire truck 🚒, Plane ✈️, Helicopter 🚁, Boat ⛵, Train 🚂, Bike 🚲, Tractor 🚜, Scooter 🛴, Ship 🚢',
    Objects: 'Heart ❤️, Diamond 💎, Coin 🪙, Key 🔑, Bomb 💣, Crown 👑, Magic wand 🪄, Music 🎵, Bell 🔔, Book 📖, Light bulb 💡, Clock ⏰, Money bag 💰, Gem 💍, Shield 🛡️, Sword ⚔️, Paint 🎨, Camera 📷, Laptop 💻, Pencil ✏️',
  };
  const LIB = Object.entries(LIBRARY).flatMap(([cat, list]) => list.split(', ').map(item => { const i = item.lastIndexOf(' '); return { cat, name: item.slice(0, i), char: item.slice(i + 1) }; }));
  let libCat = 'All';
  function renderLibrary() {
    const q = $('#spriteSearch').value.trim().toLowerCase(), pe = $('#pickEmoji'), cats = $('#pickCats');
    cats.textContent = '';
    for (const c of ['All', ...Object.keys(LIBRARY)]) {
      const chip = document.createElement('button'); chip.type = 'button'; chip.className = 'chip' + (c === libCat ? ' active' : ''); chip.textContent = c;
      chip.onclick = () => { libCat = c; renderLibrary(); };
      cats.appendChild(chip);
    }
    pe.textContent = '';
    const items = LIB.filter(x => (libCat === 'All' || x.cat === libCat) && (!q || x.name.toLowerCase().includes(q) || x.cat.toLowerCase().includes(q)));
    for (const { name, char } of items) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pick emoji'; b.title = name; b.textContent = char;
      b.onclick = () => { addNewSprite({ name, costumes: [{ type: 'emoji', char }] }); $('#spriteDialog').close(); };
      pe.appendChild(b);
    }
    if (!items.length) pe.textContent = 'No sprites match — try another word, or 🎨 paint your own!';
  }
  $('#spriteSearch').oninput = renderLibrary;
  function openSpriteDialog() {
    const pc = $('#pickClaude');
    pc.textContent = '';
    for (const color of rt.claudeColors) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'pick'; b.title = `${color} Claude`;
      b.append(rt.claudeCanvas(color, 0, 3, true));
      b.onclick = () => {
        addNewSprite({ name: 'Claude', rotationStyle: 'left-right', costumes: claudeCostumes(color) });
        $('#spriteDialog').close();
      };
      pc.appendChild(b);
    }
    $('#spriteSearch').value = ''; libCat = 'All';
    renderLibrary();
    $('#spriteDialog').showModal();
  }
  let uploadMode = 'sprite';
  $('#uploadSpriteBtn').onclick = () => { uploadMode = 'sprite'; $('#uploadFile').click(); };
  $('#addCostumeBtn').onclick = () => { uploadMode = isStage() ? 'backdrop' : 'costume'; $('#uploadFile').click(); };
  function shrinkImage(file, max) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        res(c.toDataURL('image/png'));
      };
      img.onerror = () => rej(new Error('Could not read that image.'));
      img.src = url;
    });
  }
  $('#uploadFile').onchange = async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const src = await shrinkImage(file, uploadMode === 'backdrop' ? 960 : 240);
      const name = file.name.replace(/\.[^.]+$/, '').slice(0, 20) || 'Image';
      if (uploadMode === 'backdrop') { rt.addBackdrop({ type: 'image', src, name }); setTimeout(() => { renderCostumes(); renderSprites(); }, 150); CB.log(`Added backdrop "${name}".`); }
      else if (uploadMode === 'costume' && current) { rt.addCostume(current, { type: 'image', src, name }); CB.log(`Added costume "${name}" to ${current.name}.`); }
      else addNewSprite({ name, costumes: [{ type: 'image', src, name }] });
      $('#spriteDialog').close();
      renderSprites(); scheduleSave();
    } catch (err) { CB.log('⚠ ' + err.message, 'err'); }
  };

  // ---------- extensions ----------
  CB.addExtension = async id => {
    if (exts.has(id)) { CB.openCategory(CB.EXTENSIONS[id].toolbox(CB.tb).name); return; }
    await CB.loadExtension(id);
    exts.add(id);
    ws.updateToolbox(toolbox());
    scheduleSave();
    CB.openCategory(CB.EXTENSIONS[id].toolbox(CB.tb).name);
  };
  function openExtDialog() {
    const list = $('#extList');
    list.textContent = '';
    for (const [id, x] of Object.entries(CB.EXTENSIONS)) {
      const card = document.createElement('div');
      card.className = 'ext-card';
      card.style.setProperty('--ext', x.color);
      card.innerHTML = `<div class="ext-icon">${x.icon}</div><h3>${x.name}</h3><p>${x.desc}</p>`;
      const btn = document.createElement('button');
      btn.textContent = exts.has(id) ? 'Added ✓' : 'Add';
      btn.disabled = exts.has(id);
      btn.onclick = async () => {
        btn.textContent = 'Loading…'; btn.disabled = true;
        try { await CB.addExtension(id); btn.textContent = 'Added ✓'; $('#extDialog').close(); }
        catch (e) { btn.textContent = 'Retry'; btn.disabled = false; CB.log('⚠ ' + e.message, 'err'); }
      };
      card.appendChild(btn);
      list.appendChild(card);
    }
    $('#extDialog').showModal();
  }
  $('#extBtn').onclick = openExtDialog;
  $('#exportBtn').onclick = () => CB.editor.showGenerated();

  // ---------- views & panels ----------
  function showView(v) {
    $$('.view-tab').forEach(t => t.classList.toggle('active', t.dataset.view === v));
    $$('.view').forEach(x => x.classList.toggle('active', x.id === 'view-' + v));
    if (v === 'blocks') Blockly.svgResize(ws);
    else if (v === 'terminal') CB.terminal.onShow();
    else CB.editor.onShow();
  }
  function showPanel(p) {
    showView('blocks');
    $$('.ptab').forEach(t => { const on = t.dataset.p === p; t.classList.toggle('active', on); if (on) t.classList.remove('alert'); });
    $$('.pbody').forEach(x => x.classList.toggle('active', x.id === 'p-' + p));
    if (p === 'ai') CB.assistant.onShow();
  }
  CB.showView = showView; CB.showPanel = showPanel;
  $$('.view-tab').forEach(t => { t.onclick = () => showView(t.dataset.view); });
  $$('.ptab').forEach(t => { t.onclick = () => showPanel(t.dataset.p); });

  // ---------- project files ----------
  const projectName = () => $('#projectName').value.trim() || 'My Project';
  function projectJSON() {
    saveCurrent();
    return {
      format: 'claudeblock', app: 'claude-blocks', version: 2, savedWith: window.CB_VERSION || 'dev', name: projectName(), stageColor: rt.stageColor, extensions: [...exts],
      current: isStage() ? 'stage' : Math.max(0, rt.sprites.indexOf(current)),
      stage: { ...rt.serializeStage(), blocks: rt.stage.blocks },
      sprites: rt.sprites.map(s => ({ ...rt.serializeSprite(s), blocks: s.blocks })),
      python: CB.editor.getPython(), html: CB.editor.getHtml(),
      piParts: CB.piEmu ? CB.piEmu.getParts() : CB.pendingPiParts,
    };
  }
  let warnedQuota = false;
  function saveNow() {
    clearTimeout(saveTimer);
    if (!store.set('cb-project', projectJSON()) && !warnedQuota) {
      warnedQuota = true;
      CB.log('⚠ Your project is too big to auto-save in the browser — use 💾 Save to keep it.', 'err');
    }
  }
  const scheduleSave = (CB.scheduleSave = () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 600); });
  window.addEventListener('beforeunload', saveNow);
  $('#projectName').onchange = scheduleSave;

  CB.download = (filename, text, type) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };
  const fileBase = () => projectName().replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'project';
  // Block projects are saved as .claudeblock files (Claude Blocks' own format: the project as JSON).
  $('#saveBtn').onclick = () => CB.download(fileBase() + '.claudeblock', JSON.stringify(projectJSON()), 'application/x-claudeblock');
  $('#openBtn').onclick = () => $('#openFile').click();
  CB.openProjectText = (text, fileName = 'project') => {
    try {
      const p = JSON.parse(text);
      if (!Array.isArray(p.sprites)) throw new Error('This is not a Claude Blocks project.');
      loadProject(p);
      saveNow();
      CB.showView('blocks');
      CB.log(`📂 Opened “${p.name || fileName}”.`, 'ok');
    } catch (err) { CB.log(`⚠ Could not open ${fileName}: ${err.message}`, 'err'); CB.showPanel('output'); }
  };
  $('#openFile').onchange = async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) CB.openProjectText(await file.text(), file.name);
  };
  // Desktop app: a .claudeblock file was double-clicked (or opened with Claude Blocks).
  if (window.cbDesktop && window.cbDesktop.onOpenProject) window.cbDesktop.onOpenProject(f => CB.openProjectText(f.text, f.name));
  $('#newBtn').onclick = async () => {
    if (await CB.confirm('Start a new project? Save first if you want to keep this one.', 'Start new')) { loadProject(defaultProject()); saveNow(); }
  };

  CB.loadProject = p => loadProject(p);
  function loadProject(p) {
    rt.clear();
    current = null;
    $('#projectName').value = p.name || 'My Project';
    rt.setStageColor(p.stageColor || (p.stage && p.stage.color) || '#ffffff');
    rt.setStage({ color: p.stageColor, ...(p.stage || {}) });
    exts = new Set((p.extensions || []).filter(id => CB.EXTENSIONS[id]));
    for (const id of exts) CB.loadExtension(id).catch(e => CB.log('⚠ ' + e.message, 'err'));
    for (const sp of p.sprites || []) rt.addSprite(sp);
    // A project can have no sprites at all — then the Stage is selected.
    selectSprite(p.current === 'stage' ? rt.stage : rt.sprites[p.current] || rt.sprites[0] || rt.stage);
    ws.updateToolbox(toolbox()); syncTargetUI();
    $('#stageColor').value = rt.stageColor;
    CB.editor.load(p.python, p.html);
    // The emulator script loads after this one, so it picks up pendingPiParts when it starts.
    CB.pendingPiParts = p.piParts || null;
    if (CB.piEmu) CB.piEmu.setParts(CB.pendingPiParts);
    dirty = true;
    renderSprites();
  }

  const claudeCostumes = color => [0, 1, 'blink', 'jump', 'wave', 'happy'].map(frame => ({ type: 'claude', color, frame }));
  function defaultProject() {
    const N = n => ({ shadow: { type: 'math_number', fields: { NUM: n } } });
    const T = t => ({ shadow: { type: 'text', fields: { TEXT: t } } });
    const chain = (...bs) => { for (let i = bs.length - 2; i >= 0; i--) bs[i].next = { block: bs[i + 1] }; return bs[0]; };
    const walk = chain(
      { type: 'cb_when_flag', x: 30, y: 30 },
      { type: 'cb_say_for', inputs: { T: T("Hi! I'm Claude 👋"), S: N(2) } },
      { type: 'cb_forever', inputs: { DO: { block: chain(
        { type: 'cb_move', inputs: { N: N(6) } },
        { type: 'cb_next_costume' },
        { type: 'cb_bounce' },
        { type: 'cb_wait', inputs: { N: N(0.08) } }) } } });
    const tickle = chain(
      { type: 'cb_when_clicked', x: 420, y: 30 },
      { type: 'cb_play_note', inputs: { N: N(72), S: N(0.2) } },
      { type: 'cb_say_for', inputs: { T: T('That tickles!'), S: N(1) } });
    return {
      name: 'My First Project', stageColor: '#ffffff', extensions: [], current: 0,
      sprites: [{
        name: 'Claude', x: 0, y: -40, dir: 90, size: 150, rotationStyle: 'left-right',
        costumes: claudeCostumes('orange'),
        blocks: { blocks: { languageVersion: 0, blocks: [walk, tickle] } },
      }],
      python: null, html: null,
    };
  }

  // ---------- helpers for export & the AI ----------
  CB.collectForExport = () => {
    compileAll();
    return {
      name: projectName(), stageColor: rt.stageColor, extensions: [...exts],
      sprites: rt.sprites.map(s => rt.serializeSprite(s)), stage: rt.serializeStage(),
      scripts: [['__stage__', rt.stage.code || ''], ...rt.sprites.map(s => [s.name, s.code || ''])],
      config: { pi: { host: rt.config.pi.host }, ai: { host: rt.config.ai.host, model: rt.config.ai.model } },
    };
  };
  CB.currentSpriteName = () => (current ? current.name : 'Claude');
  // Add the scripts the AI built (see ai-build.js) to the right sprites, creating sprites it asked for.
  CB.applyBuild = parsed => {
    saveCurrent();
    const added = [];
    let last = current;
    const find = name => (name.toLowerCase() === 'stage' ? rt.stage : rt.sprites.find(x => x.name.toLowerCase() === name.toLowerCase()));
    // Create new sprites first, so blocks like "touching Star?" can point at them.
    for (const sec of parsed.sections) {
      if (sec.sprite && !find(sec.sprite)) {
        const s = rt.addSprite({
          name: sec.sprite, x: Math.round(Math.random() * 240 - 120), y: Math.round(Math.random() * 160 - 80),
          costumes: sec.emoji ? [{ type: 'emoji', char: sec.emoji }] : claudeCostumes('orange'), rotationStyle: sec.emoji ? 'all around' : 'left-right',
        });
        added.push(`new sprite ${s.name}`);
      }
    }
    for (const sec of parsed.sections) {
      const s = sec.sprite ? find(sec.sprite) : current;
      if (!sec.scripts.length) continue;
      const put = (w, live) => {
        const ids = {};
        for (const name of parsed.vars) ids['v_' + name] = (w.getVariable(name) || w.createVariable(name, '', 'v_' + name)).getId();
        const fix = o => { if (o && typeof o === 'object') { if (o.VAR && o.VAR.id && ids[o.VAR.id]) o.VAR.id = ids[o.VAR.id]; Object.values(o).forEach(fix); } };
        let y = live && w.getTopBlocks(false).length ? w.getBlocksBoundingBox().bottom + 40 : 40 + w.getTopBlocks(false).length * 320;
        for (const script of sec.scripts) {
          const json = JSON.parse(JSON.stringify(script)); fix(json);
          const block = Blockly.serialization.blocks.append({ ...json, x: 30, y }, w);
          if (live) { y = block.getBoundingRectangle().bottom + 40; w.centerOnBlock(block.id); } else y += 320;
        }
      };
      if (s === current) { put(ws, true); saveCurrent(); }
      else s.blocks = CB.withHeadless(s.blocks, w => { put(w, false); return Blockly.serialization.workspaces.save(w); });
      added.push(`${sec.scripts.length} script${sec.scripts.length === 1 ? '' : 's'} for ${s.name}`);
      last = s;
    }
    dirty = true;
    if (last !== current) selectSprite(last);
    renderSprites(); scheduleSave();
    return added;
  };

  CB.describeForAI = () => {
    saveCurrent();
    const parts = [
      `Project "${projectName()}" has sprites: ${rt.sprites.map(s => s.name).join(', ')}.`,
      `Extensions added: ${[...exts].map(id => CB.EXTENSIONS[id].name).join(', ') || 'none'}.`,
      `The user is editing the sprite "${current ? current.name : '?'}".`,
    ];
    for (const s of [rt.stage, ...rt.sprites]) {
      const text = s === current ? CB.workspaceToText(ws) : CB.withHeadless(s.blocks, CB.workspaceToText);
      parts.push(`\nScripts of sprite "${s.name}":\n${text}`);
    }
    return parts.join('\n');
  };

  // ---------- start ----------
  try { loadProject(store.get('cb-project', null) || defaultProject()); }
  catch (e) { console.error(e); loadProject(defaultProject()); }
})();
