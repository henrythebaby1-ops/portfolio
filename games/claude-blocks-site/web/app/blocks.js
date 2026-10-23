/* Claude Blocks: Scratch-style block definitions, the JavaScript generator and the toolbox. */
(() => {
  const CB = (window.CB = window.CB || {});
  const JS = javascript.javascriptGenerator;
  const g = JS.forBlock;
  const ATOMIC = 0, NONE = 99;
  const NT = Blockly.Names.NameType;

  const COL = (CB.COLORS = {
    motion: '#4C97FF', looks: '#9966FF', sound: '#CF63CF', events: '#FFBF00', control: '#FFAB19',
    sensing: '#5CB1D6', operators: '#59C059', variables: '#FF8C1A', myblocks: '#FF6680',
  });
  CB.FLAG_SVG = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 3v18" stroke="#45993d" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M6 4c4-2 7 2 12 0v9c-5 2-8-2-12 0z" fill="#4cbf56" stroke="#45993d" stroke-width="1.5" stroke-linejoin="round"/></svg>');

  // ---------- JSON helpers (shared with extensions.js) ----------
  const I = name => ({ type: 'input_value', name });
  const B = name => ({ type: 'input_value', name, check: 'Boolean' });
  const S = name => ({ type: 'input_statement', name });
  const DD = (name, opts) => ({ type: 'field_dropdown', name, options: opts.map(o => (Array.isArray(o) ? o : [o, o])) });
  const TX = (name, text) => ({ type: 'field_input', name, text });
  const stack = (type, colour, msg, args = []) => ({ type, colour, message0: msg, args0: args, previousStatement: null, nextStatement: null, inputsInline: true });
  const cap = (type, colour, msg, args = []) => ({ type, colour, message0: msg, args0: args, previousStatement: null, inputsInline: true });
  const reporter = (type, colour, msg, args = [], check = null) => ({ type, colour, message0: msg, args0: args, output: check, inputsInline: true });
  const bool = (type, colour, msg, args = []) => reporter(type, colour, msg, args, 'Boolean');
  const hat = (type, colour, msg, args = []) => ({ type, colour, message0: msg, args0: args, nextStatement: null });
  const cblock = (type, colour, msg, args = [], label = '%1', end = false) => ({
    type, colour, message0: msg, args0: args, message1: label, args1: [S('DO')],
    previousStatement: null, nextStatement: end ? undefined : null, inputsInline: true,
  });
  CB.defs = { I, B, S, DD, TX, stack, cap, reporter, bool, hat, cblock };

  const KEYS = ['space', 'up arrow', 'down arrow', 'left arrow', 'right arrow', 'any', ...'abcdefghijklmnopqrstuvwxyz', ...'0123456789'];

  Blockly.defineBlocksWithJsonArray([
    // Motion
    stack('cb_move', COL.motion, 'move %1 steps', [I('N')]),
    stack('cb_turn_right', COL.motion, 'turn ↻ %1 degrees', [I('N')]),
    stack('cb_turn_left', COL.motion, 'turn ↺ %1 degrees', [I('N')]),
    stack('cb_goto_xy', COL.motion, 'go to x: %1 y: %2', [I('X'), I('Y')]),
    stack('cb_glide_xy', COL.motion, 'glide %1 secs to x: %2 y: %3', [I('S'), I('X'), I('Y')]),
    stack('cb_point', COL.motion, 'point in direction %1', [I('N')]),
    stack('cb_change_x', COL.motion, 'change x by %1', [I('N')]),
    stack('cb_set_x', COL.motion, 'set x to %1', [I('N')]),
    stack('cb_change_y', COL.motion, 'change y by %1', [I('N')]),
    stack('cb_set_y', COL.motion, 'set y to %1', [I('N')]),
    stack('cb_bounce', COL.motion, 'if on edge, bounce'),
    stack('cb_rotation_style', COL.motion, 'set rotation style %1', [DD('R', ['left-right', "don't rotate", 'all around'])]),
    reporter('cb_xpos', COL.motion, 'x position'),
    reporter('cb_ypos', COL.motion, 'y position'),
    reporter('cb_direction', COL.motion, 'direction'),
    // Looks
    stack('cb_say_for', COL.looks, 'say %1 for %2 seconds', [I('T'), I('S')]),
    stack('cb_say', COL.looks, 'say %1', [I('T')]),
    stack('cb_think_for', COL.looks, 'think %1 for %2 seconds', [I('T'), I('S')]),
    stack('cb_think', COL.looks, 'think %1', [I('T')]),
    stack('cb_switch_costume', COL.looks, 'switch costume to %1', [I('C')]),
    stack('cb_next_costume', COL.looks, 'next costume'),
    stack('cb_change_size', COL.looks, 'change size by %1', [I('N')]),
    stack('cb_set_size', COL.looks, 'set size to %1 %%', [I('N')]),
    stack('cb_change_effect', COL.looks, 'change %1 effect by %2', [DD('E', ['color', 'ghost']), I('N')]),
    stack('cb_set_effect', COL.looks, 'set %1 effect to %2', [DD('E', ['color', 'ghost']), I('N')]),
    stack('cb_clear_effects', COL.looks, 'clear graphic effects'),
    stack('cb_play_anim', COL.looks, 'play animation %1 %2 times', [DD('A', ['walk', 'blink', 'jump', 'wave', 'happy', 'dance', 'spin', 'shake', 'pulse']), I('N')]),
    stack('cb_start_anim', COL.looks, 'start animation %1', [DD('A', ['walk', 'blink', 'jump', 'wave', 'happy', 'dance', 'spin', 'shake', 'pulse'])]),
    stack('cb_stop_anim', COL.looks, 'stop animation'),
    stack('cb_auto_blink', COL.looks, 'turn auto-blink %1', [DD('ON', [['on', 'true'], ['off', 'false']])]),
    stack('cb_anim_sound', COL.sound, 'turn animation sounds %1', [DD('ON', [['on', 'true'], ['off', 'false']])]),
    stack('cb_set_text', COL.looks, 'set text to %1', [I('T')]),
    stack('cb_text_color', COL.looks, 'set text colour to %1', [I('C')]),
    reporter('cb_text', COL.looks, 'text'),
    stack('cb_show', COL.looks, 'show'),
    stack('cb_hide', COL.looks, 'hide'),
    stack('cb_front', COL.looks, 'go to front layer'),
    stack('cb_stage_color', COL.looks, 'set stage color to %1', [I('C')]),
    stack('cb_switch_backdrop', COL.looks, 'switch backdrop to %1', [I('B')]),
    stack('cb_next_backdrop', COL.looks, 'next backdrop'),
    reporter('cb_backdrop_number', COL.looks, 'backdrop number'),
    stack('cb_print', COL.looks, 'print %1 to output', [I('T')]),
    reporter('cb_costume_number', COL.looks, 'costume number'),
    reporter('cb_size', COL.looks, 'size'),
    // Sound
    stack('cb_play_note', COL.sound, 'play note %1 for %2 seconds', [I('N'), I('S')]),
    stack('cb_set_volume', COL.sound, 'set volume to %1 %%', [I('N')]),
    stack('cb_change_volume', COL.sound, 'change volume by %1', [I('N')]),
    reporter('cb_volume', COL.sound, 'volume'),
    // Events
    hat('cb_when_flag', COL.events, 'when %1 clicked', [{ type: 'field_image', src: CB.FLAG_SVG, width: 22, height: 22, alt: 'green flag' }]),
    hat('cb_when_key', COL.events, 'when %1 key pressed', [DD('KEY', KEYS)]),
    hat('cb_when_clicked', COL.events, 'when this sprite clicked'),
    hat('cb_when_stage_clicked', COL.events, 'when stage clicked'),
    hat('cb_when_receive', COL.events, 'when I receive %1', [TX('MSG', 'message1')]),
    stack('cb_broadcast', COL.events, 'broadcast %1', [TX('MSG', 'message1')]),
    stack('cb_broadcast_wait', COL.events, 'broadcast %1 and wait', [TX('MSG', 'message1')]),
    // Control
    stack('cb_wait', COL.control, 'wait %1 seconds', [I('N')]),
    cblock('cb_repeat', COL.control, 'repeat %1', [I('N')]),
    cblock('cb_forever', COL.control, 'forever', [], '%1', true),
    cblock('cb_if', COL.control, 'if %1 then', [B('COND')]),
    {
      type: 'cb_if_else', colour: COL.control, inputsInline: true, previousStatement: null, nextStatement: null,
      message0: 'if %1 then', args0: [B('COND')], message1: '%1', args1: [S('DO')], message2: 'else', message3: '%1', args3: [S('ELSE')],
    },
    stack('cb_wait_until', COL.control, 'wait until %1', [B('COND')]),
    cblock('cb_repeat_until', COL.control, 'repeat until %1', [B('COND')]),
    cap('cb_stop', COL.control, 'stop %1', [DD('WHAT', [['all', 'all'], ['this script', 'this']])]),
    // Sensing
    bool('cb_key_pressed', COL.sensing, 'key %1 pressed?', [DD('KEY', KEYS)]),
    bool('cb_mouse_down', COL.sensing, 'mouse down?'),
    reporter('cb_mouse_x', COL.sensing, 'mouse x'),
    reporter('cb_mouse_y', COL.sensing, 'mouse y'),
    stack('cb_ask', COL.sensing, 'ask %1 and wait', [I('Q')]),
    reporter('cb_answer', COL.sensing, 'answer'),
    reporter('cb_timer', COL.sensing, 'timer'),
    stack('cb_reset_timer', COL.sensing, 'reset timer'),
    // Operators (extra)
    bool('cb_contains', COL.operators, '%1 contains %2 ?', [I('A'), I('B')]),
  ]);

  // Blocks whose dropdown lists the project's sprites.
  const targetMenu = (...extra) => function () {
    const names = CB.spriteNames ? CB.spriteNames() : [];
    return [...extra, ...names.map(n => [n, n])];
  };
  function dynBlock(type, colour, before, menu, after, shape) {
    Blockly.Blocks[type] = {
      init() {
        const inp = this.appendDummyInput();
        if (before) inp.appendField(before);
        inp.appendField(new Blockly.FieldDropdown(menu), 'T');
        if (after) inp.appendField(after);
        this.setColour(colour);
        if (shape === 'stack') { this.setPreviousStatement(true); this.setNextStatement(true); }
        else this.setOutput(true, shape === 'bool' ? 'Boolean' : null);
      },
    };
  }
  dynBlock('cb_goto', COL.motion, 'go to', targetMenu(['random position', '_random_'], ['mouse-pointer', '_mouse_']), null, 'stack');
  dynBlock('cb_point_towards', COL.motion, 'point towards', targetMenu(['mouse-pointer', '_mouse_']), null, 'stack');
  dynBlock('cb_touching', COL.sensing, 'touching', targetMenu(['mouse-pointer', '_mouse_'], ['edge', '_edge_']), '?', 'bool');
  dynBlock('cb_distance_to', COL.sensing, 'distance to', targetMenu(['mouse-pointer', '_mouse_']), null, 'value');

  // ---------- theme ----------
  const op = { colourPrimary: COL.operators };
  CB.theme = Blockly.Theme.defineTheme('claude-blocks', {
    base: Blockly.Themes.Classic,
    startHats: true,
    blockStyles: {
      logic_blocks: op, math_blocks: op, text_blocks: op,
      variable_blocks: { colourPrimary: COL.variables }, variable_dynamic_blocks: { colourPrimary: COL.variables },
      procedure_blocks: { colourPrimary: COL.myblocks }, list_blocks: { colourPrimary: '#FF661A' }, colour_blocks: { colourPrimary: '#0FBD8C' },
    },
    categoryStyles: { list_category: { colour: '#FF661A' }, variable_category: { colour: COL.variables }, procedure_category: { colour: COL.myblocks } },
    componentStyles: {
      workspaceBackgroundColour: '#F9F9F7', toolboxBackgroundColour: '#FFFFFF', toolboxForegroundColour: '#575E75',
      flyoutBackgroundColour: '#F2F1EC', flyoutOpacity: 1, scrollbarColour: '#CECDC7',
    },
    fontStyle: { family: '"Helvetica Neue", Helvetica, Arial, sans-serif', weight: '500', size: 12 },
  });

  // ---------- generator ----------
  const v = (b, n, d = '0') => JS.valueToCode(b, n, NONE) || d;
  const q = JSON.stringify;
  const f = (b, n) => b.getFieldValue(n);
  const body = (b, n = 'DO') => JS.statementToCode(b, n);
  CB.gen = { v, q, f, body, ATOMIC, NONE };

  JS.addReservedWords('api,__c');
  JS.INFINITE_LOOP_TRAP = 'await api.tick();\n';

  const HATS = (CB.HATS = new Set(['cb_when_flag', 'cb_when_key', 'cb_when_clicked', 'cb_when_stage_clicked', 'cb_when_receive']));
  const hatGen = evt => b => {
    const next = b.getNextBlock();
    const code = next ? JS.prefixLines(JS.blockToCode(next), JS.INDENT) : '';
    return `api.on(${q(evt(b))}, async () => {\n${code}});\n`;
  };
  g.cb_when_flag = hatGen(() => 'flag');
  g.cb_when_key = hatGen(b => 'key:' + f(b, 'KEY'));
  g.cb_when_clicked = hatGen(() => 'click');
  g.cb_when_stage_clicked = hatGen(() => 'click');
  g.cb_when_receive = hatGen(b => 'msg:' + f(b, 'MSG'));
  // A hat generates its own stack, so the generator must not append the next block again.
  const origScrub = JS.scrub_;
  JS.scrub_ = function (block, code, thisOnly) {
    return HATS.has(block.type) ? code : origScrub.call(this, block, code, thisOnly);
  };

  const T = b => v(b, 'T', "''");
  const STATEMENTS = {
    cb_move: b => `api.move(${v(b, 'N')});`,
    cb_turn_right: b => `api.turn(${v(b, 'N')});`,
    cb_turn_left: b => `api.turn(-(${v(b, 'N')}));`,
    cb_goto_xy: b => `api.goTo(${v(b, 'X')}, ${v(b, 'Y')});`,
    cb_goto: b => `api.goToTarget(${q(f(b, 'T'))});`,
    cb_glide_xy: b => `await api.glide(${v(b, 'S', '1')}, ${v(b, 'X')}, ${v(b, 'Y')});`,
    cb_point: b => `api.point(${v(b, 'N', '90')});`,
    cb_point_towards: b => `api.pointTowards(${q(f(b, 'T'))});`,
    cb_change_x: b => `api.changeX(${v(b, 'N')});`,
    cb_set_x: b => `api.setX(${v(b, 'N')});`,
    cb_change_y: b => `api.changeY(${v(b, 'N')});`,
    cb_set_y: b => `api.setY(${v(b, 'N')});`,
    cb_bounce: () => 'api.bounce();',
    cb_rotation_style: b => `api.setRotationStyle(${q(f(b, 'R'))});`,
    cb_say_for: b => `await api.sayFor(${T(b)}, ${v(b, 'S', '2')});`,
    cb_say: b => `api.say(${T(b)});`,
    cb_think_for: b => `await api.thinkFor(${T(b)}, ${v(b, 'S', '2')});`,
    cb_think: b => `api.think(${T(b)});`,
    cb_switch_costume: b => `api.switchCostume(${v(b, 'C', '1')});`,
    cb_next_costume: () => 'api.nextCostume();',
    cb_change_size: b => `api.changeSize(${v(b, 'N')});`,
    cb_set_size: b => `api.setSize(${v(b, 'N', '100')});`,
    cb_change_effect: b => `api.changeEffect(${q(f(b, 'E'))}, ${v(b, 'N')});`,
    cb_set_effect: b => `api.setEffect(${q(f(b, 'E'))}, ${v(b, 'N')});`,
    cb_clear_effects: () => 'api.clearEffects();',
    cb_play_anim: b => `await api.playAnimation(${q(f(b, 'A'))}, ${v(b, 'N', '1')});`,
    cb_start_anim: b => `api.startAnimation(${q(f(b, 'A'))});`,
    cb_stop_anim: () => 'api.stopAnimation();',
    cb_auto_blink: b => `api.setAutoBlink(${f(b, 'ON')});`,
    cb_anim_sound: b => `api.setAnimSound(${f(b, 'ON')});`,
    cb_set_text: b => `api.setText(${v(b, 'T', "''")});`,
    cb_text_color: b => `api.setTextColor(${v(b, 'C', "'#1f1e1d'")});`,
    cb_show: () => 'api.show();',
    cb_hide: () => 'api.hide();',
    cb_front: () => 'api.goFront();',
    cb_stage_color: b => `api.setStageColor(${v(b, 'C', "'#ffffff'")});`,
    cb_switch_backdrop: b => `api.switchBackdrop(${v(b, 'B', '1')});`,
    cb_next_backdrop: () => 'api.nextBackdrop();',
    cb_print: b => `api.print(${T(b)});`,
    cb_play_note: b => `await api.playNote(${v(b, 'N', '60')}, ${v(b, 'S', '0.5')});`,
    cb_set_volume: b => `api.setVolume(${v(b, 'N', '100')});`,
    cb_change_volume: b => `api.changeVolume(${v(b, 'N')});`,
    cb_broadcast: b => `api.broadcast(${q(f(b, 'MSG'))});`,
    cb_broadcast_wait: b => `await api.broadcastAndWait(${q(f(b, 'MSG'))});`,
    cb_wait: b => `await api.wait(${v(b, 'N', '1')});`,
    cb_repeat: b => {
      const i = JS.nameDB_.getDistinctName('count', NT.VARIABLE);
      return `for (let ${i} = Math.round(${v(b, 'N', '10')}); ${i} > 0; ${i}--) {\n${body(b)}  await api.tick();\n}`;
    },
    cb_forever: b => `while (true) {\n${body(b)}  await api.tick();\n}`,
    cb_if: b => `if (${v(b, 'COND', 'false')}) {\n${body(b)}}`,
    cb_if_else: b => `if (${v(b, 'COND', 'false')}) {\n${body(b)}} else {\n${body(b, 'ELSE')}}`,
    cb_wait_until: b => `while (!(${v(b, 'COND', 'false')})) await api.tick();`,
    cb_repeat_until: b => `while (!(${v(b, 'COND', 'false')})) {\n${body(b)}  await api.tick();\n}`,
    cb_stop: b => (f(b, 'WHAT') === 'all' ? 'api.stopAll();\nreturn;' : 'return;'),
    cb_ask: b => `await api.ask(${v(b, 'Q', "''")});`,
    cb_reset_timer: () => 'api.resetTimer();',
  };
  for (const [k, fn] of Object.entries(STATEMENTS)) g[k] = b => fn(b) + '\n';

  const REPORTERS = {
    cb_xpos: () => 'api.xPos()', cb_ypos: () => 'api.yPos()', cb_direction: () => 'api.direction()',
    cb_costume_number: () => 'api.costumeNumber()', cb_text: () => 'api.textOf()', cb_backdrop_number: () => 'api.backdropNumber()', cb_size: () => 'api.size()', cb_volume: () => 'api.volume()',
    cb_touching: b => `api.touching(${q(f(b, 'T'))})`,
    cb_distance_to: b => `api.distanceTo(${q(f(b, 'T'))})`,
    cb_key_pressed: b => `api.keyPressed(${q(f(b, 'KEY'))})`,
    cb_mouse_down: () => 'api.mouseDown()', cb_mouse_x: () => 'api.mouseX()', cb_mouse_y: () => 'api.mouseY()',
    cb_answer: () => 'api.answer()', cb_timer: () => 'api.timer()',
    cb_contains: b => `String(${v(b, 'A', "''")}).toLowerCase().includes(String(${v(b, 'B', "''")}).toLowerCase())`,
  };
  for (const [k, fn] of Object.entries(REPORTERS)) g[k] = b => [fn(b), ATOMIC];

  // My Blocks become async functions so they can wait, glide and loop.
  for (const t of ['procedures_defreturn', 'procedures_defnoreturn']) {
    const orig = g[t];
    g[t] = function (b, gen) {
      const r = orig.call(this, b, gen);
      for (const k of Object.keys(gen.definitions_)) {
        if (k[0] === '%') gen.definitions_[k] = gen.definitions_[k].replace(/(^|\n)function /, '$1async function ');
      }
      return r;
    };
  }
  const origCall = g.procedures_callreturn;
  g.procedures_callreturn = function (b, gen) { const [code] = origCall.call(this, b, gen); return [`(await ${code})`, ATOMIC]; };
  g.procedures_callnoreturn = function (b, gen) { const [code] = origCall.call(this, b, gen); return `await ${code};\n`; };

  // ---------- compiling ----------
  const isDef = b => b.type.startsWith('procedures_def');
  CB.compileWorkspace = function (ws) {
    JS.init(ws);
    let code = '';
    for (const b of ws.getTopBlocks(true)) {
      if (!b.isEnabled()) continue;
      if (HATS.has(b.type)) code += JS.blockToCode(b);
      else if (isDef(b)) JS.blockToCode(b);
    }
    return JS.finish(code);
  };
  CB.withHeadless = function (json, fn) {
    const ws = new Blockly.Workspace();
    try { if (json) Blockly.serialization.workspaces.load(json, ws); return fn(ws); } finally { ws.dispose(); }
  };
  CB.compileSprite = json => CB.withHeadless(json, CB.compileWorkspace);
  // Code for a single clicked stack (Scratch runs a stack when you click it).
  CB.compileStack = function (ws, root) {
    JS.init(ws);
    for (const b of ws.getTopBlocks(false)) if (isDef(b)) JS.blockToCode(b);
    let code = '';
    if (root.outputConnection) { const r = JS.blockToCode(root); code = `api.print(${Array.isArray(r) ? r[0] : r});\n`; }
    else if (HATS.has(root.type)) { const n = root.getNextBlock(); code = n ? JS.blockToCode(n) : ''; }
    else if (!isDef(root)) code = JS.blockToCode(root);
    return JS.finish(code);
  };

  // Readable text version of a workspace (used by the AI assistant).
  CB.workspaceToText = function (ws) {
    const line = b => {
      const parts = [];
      for (const input of b.inputList) {
        if (input.type === 3) break;  // statement inputs (and labels after them, like "else") are written on their own lines
        for (const fld of input.fieldRow) { const t = fld.getText ? fld.getText() : ''; if (t && t.trim()) parts.push(t.trim()); }
        if (input.type === 1 && input.connection) { const c = input.connection.targetBlock(); parts.push(c ? '(' + line(c) + ')' : '( )'); }
      }
      return parts.join(' ');
    };
    const tree = (b, ind) => {
      let out = '';
      for (; b; b = b.getNextBlock()) {
        out += ind + line(b) + '\n';
        let branches = 0;
        b.inputList.forEach((input, i) => {
          if (input.type !== 3 || !input.connection) return;
          if (branches++ === 0) { out += tree(input.connection.targetBlock(), ind + '  '); return; }
          const label = input.fieldRow.map(f => (f.getText ? f.getText() : '')).join(' ').trim() || (b.inputList[i - 1] && b.inputList[i - 1].type === 5 ? b.inputList[i - 1].fieldRow.map(f => f.getText()).join(' ').trim() : '');
          if (label) out += ind + label + '\n';
          out += tree(input.connection.targetBlock(), ind + '  ');
        });
      }
      return out;
    };
    return ws.getTopBlocks(true).map(b => tree(b, '')).join('\n') || '(no blocks yet)';
  };

  // ---------- toolbox ----------
  const N = n => ({ shadow: { type: 'math_number', fields: { NUM: n } } });
  const TXT = t => ({ shadow: { type: 'text', fields: { TEXT: t } } });
  const C = c => ({ shadow: { type: 'colour_picker', fields: { COLOUR: c } } });
  const blk = (type, inputs, extra) => Object.assign({ kind: 'block', type }, inputs ? { inputs } : {}, extra || {});
  const cat = (name, colour, contents) => ({ kind: 'category', name, colour, contents });
  CB.tb = { N, T: TXT, C, blk, cat };

  CB.buildToolbox = function (exts, { stage = false } = {}) {
    const contents = [
      cat('Motion', COL.motion, [
        blk('cb_move', { N: N(10) }), blk('cb_turn_right', { N: N(15) }), blk('cb_turn_left', { N: N(15) }),
        blk('cb_goto'), blk('cb_goto_xy', { X: N(0), Y: N(0) }), blk('cb_glide_xy', { S: N(1), X: N(0), Y: N(0) }),
        blk('cb_point', { N: N(90) }), blk('cb_point_towards'),
        blk('cb_change_x', { N: N(10) }), blk('cb_set_x', { N: N(0) }), blk('cb_change_y', { N: N(10) }), blk('cb_set_y', { N: N(0) }),
        blk('cb_bounce'), blk('cb_rotation_style'), blk('cb_xpos'), blk('cb_ypos'), blk('cb_direction'),
      ]),
      cat('Looks', COL.looks, [
        blk('cb_say_for', { T: TXT('Hello!'), S: N(2) }), blk('cb_say', { T: TXT('Hello!') }),
        blk('cb_think_for', { T: TXT('Hmm...'), S: N(2) }), blk('cb_think', { T: TXT('Hmm...') }),
        blk('cb_switch_costume', { C: N(1) }), blk('cb_next_costume'),
        blk('cb_change_size', { N: N(10) }), blk('cb_set_size', { N: N(100) }),
        blk('cb_change_effect', { N: N(25) }), blk('cb_set_effect', { N: N(0) }), blk('cb_clear_effects'),
        blk('cb_play_anim', { N: N(1) }), blk('cb_start_anim'), blk('cb_stop_anim'), blk('cb_auto_blink'),
        { kind: 'label', text: 'Text boxes' }, blk('cb_set_text', { T: TXT('Score: 0') }), blk('cb_text_color', { C: C('#d97757') }), blk('cb_text'),
        blk('cb_show'), blk('cb_hide'), blk('cb_front'), blk('cb_stage_color', { C: C('#bde0fe') }),
        blk('cb_switch_backdrop', { B: N(1) }), blk('cb_next_backdrop'), blk('cb_backdrop_number'),
        blk('cb_print', { T: TXT('Hello, New World!') }), blk('cb_costume_number'), blk('cb_size'),
      ]),
      cat('Sound', COL.sound, [
        blk('cb_play_note', { N: N(60), S: N(0.5) }), blk('cb_set_volume', { N: N(100) }), blk('cb_change_volume', { N: N(-10) }), blk('cb_volume'), blk('cb_anim_sound'),
      ]),
      cat('Events', COL.events, [
        blk('cb_when_flag'), blk('cb_when_key'), blk('cb_when_clicked'), blk('cb_when_receive'), blk('cb_broadcast'), blk('cb_broadcast_wait'),
      ]),
      cat('Control', COL.control, [
        blk('cb_wait', { N: N(1) }), blk('cb_repeat', { N: N(10) }), blk('cb_forever'), blk('cb_if'), blk('cb_if_else'),
        blk('cb_wait_until'), blk('cb_repeat_until'), blk('cb_stop'),
      ]),
      cat('Sensing', COL.sensing, [
        blk('cb_touching'), blk('cb_distance_to'), blk('cb_ask', { Q: TXT("What's your name?") }), blk('cb_answer'),
        blk('cb_key_pressed'), blk('cb_mouse_down'), blk('cb_mouse_x'), blk('cb_mouse_y'), blk('cb_timer'), blk('cb_reset_timer'),
      ]),
      cat('Operators', COL.operators, [
        blk('math_arithmetic', { A: N(1), B: N(1) }), blk('math_random_int', { FROM: N(1), TO: N(10) }),
        blk('logic_compare', { A: N(0), B: N(50) }), blk('logic_operation'), blk('logic_negate'), blk('logic_boolean'),
        blk('text_join', { ADD0: TXT('apple '), ADD1: TXT('banana') }), blk('text_length', { VALUE: TXT('apple') }),
        blk('cb_contains', { A: TXT('apple'), B: TXT('a') }),
        blk('math_modulo', { DIVIDEND: N(10), DIVISOR: N(3) }), blk('math_round', { NUM: N(3.7) }), blk('math_single', { NUM: N(9) }),
      ]),
      { kind: 'category', name: 'Variables', categorystyle: 'variable_category', custom: 'VARIABLE' },
      cat('Lists', '#FF661A', [
        { kind: 'block', type: 'lists_create_with', extraState: { itemCount: 0 } },
        { kind: 'block', type: 'lists_create_with', extraState: { itemCount: 3 }, inputs: { ADD0: N(1), ADD1: N(2), ADD2: N(3) } },
        blk('lists_repeat', { ITEM: TXT('hi'), NUM: N(5) }),
        { kind: 'block', type: 'lists_setIndex', fields: { MODE: 'INSERT', WHERE: 'LAST' }, inputs: { TO: TXT('thing') } },
        { kind: 'block', type: 'lists_getIndex', fields: { MODE: 'GET', WHERE: 'FROM_START' }, inputs: { AT: N(1) } },
        { kind: 'block', type: 'lists_setIndex', fields: { MODE: 'SET', WHERE: 'FROM_START' }, inputs: { AT: N(1), TO: TXT('new') } },
        { kind: 'block', type: 'lists_getIndex', fields: { MODE: 'REMOVE', WHERE: 'FROM_START' }, inputs: { AT: N(1) } },
        blk('lists_length'), blk('lists_isEmpty'), { kind: 'block', type: 'lists_indexOf', fields: { END: 'FIRST' } },
        { kind: 'block', type: 'lists_split', fields: { MODE: 'JOIN' }, inputs: { DELIM: TXT(', ') } },
        { kind: 'block', type: 'lists_split', fields: { MODE: 'SPLIT' }, inputs: { INPUT: TXT('a,b,c'), DELIM: TXT(',') } },
        { kind: 'block', type: 'lists_sort', fields: { TYPE: 'NUMERIC', DIRECTION: '1' } }, blk('lists_reverse'),
      ]),
      { kind: 'category', name: 'My Blocks', categorystyle: 'procedure_category', custom: 'PROCEDURE' },
    ];
    if (stage) {
      contents.shift();   // the Stage can't move
      const events = contents.find(c => c.name === 'Events');
      events.contents = events.contents.map(b => (b.type === 'cb_when_clicked' ? blk('cb_when_stage_clicked') : b));
      contents[0] = cat('Looks', COL.looks, [
        blk('cb_switch_backdrop', { B: N(1) }), blk('cb_next_backdrop'), blk('cb_backdrop_number'), blk('cb_stage_color', { C: C('#bde0fe') }),
        blk('cb_change_effect', { N: N(25) }), blk('cb_set_effect', { N: N(0) }), blk('cb_clear_effects'), blk('cb_print', { T: TXT('Hello from the Stage!') }),
      ]);
    }
    for (const id of exts) {
      const ext = CB.EXTENSIONS && CB.EXTENSIONS[id];
      if (ext) contents.push(ext.toolbox(CB.tb));
    }
    return { kind: 'categoryToolbox', contents };
  };
})();
