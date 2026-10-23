/* Claude Blocks "AI builds for you": turns a script written in plain block words into real blocks.
   The AI is asked to answer in this simple format, e.g.
     sprite Apple 🍎
     when flag clicked
       forever
         move 10 steps
         if touching edge? then
           turn right 180 degrees                                                                */
(() => {
  const CB = window.CB;

  const N = n => ({ shadow: { type: 'math_number', fields: { NUM: n } } });
  const T = t => ({ shadow: { type: 'text', fields: { TEXT: t } } });
  const B = (type, inputs = {}, fields = {}) => ({ type, inputs, fields });
  const KEYS = ['space', 'up arrow', 'down arrow', 'left arrow', 'right arrow', 'any', 'enter'];
  const ANIMS = ['walk', 'blink', 'jump', 'wave', 'happy', 'dance', 'spin', 'shake', 'pulse'];
  const REPORTERS = {
    'answer': 'cb_answer', 'x position': 'cb_xpos', 'y position': 'cb_ypos', 'direction': 'cb_direction', 'timer': 'cb_timer',
    'mouse x': 'cb_mouse_x', 'mouse y': 'cb_mouse_y', 'size': 'cb_size', 'costume number': 'cb_costume_number', 'volume': 'cb_volume',
    'ai reply': 'ai_reply', 'text': 'cb_text',
  };

  const EMOJI = { apple: '🍎', star: '⭐', ball: '⚽', cat: '🐱', dog: '🐶', rocket: '🚀', ghost: '👻', fish: '🐟', heart: '❤️', alien: '👾', tree: '🌳', car: '🚗',
    pizza: '🍕', coin: '🪙', cookie: '🍪', dragon: '🐉', robot: '🤖', butterfly: '🦋', banana: '🍌', bird: '🐦', bug: '🐞', rock: '🪨', bomb: '💣', cake: '🎂', diamond: '💎', monster: '👾', mouse: '🐭', bee: '🐝', frog: '🐸', flower: '🌸', sun: '☀️', moon: '🌙', cloud: '☁️', fire: '🔥', key: '🔑', gift: '🎁', enemy: '👾', player: '🙂' };
  const unquote = s => s.trim().replace(/^["“'‘](.*)["”'’]$/s, '$1');
  const strip = s => s.trim().replace(/^\((.*)\)$/s, '$1').trim();
  const keyName = k => {
    k = unquote(k).toLowerCase().replace(/^the\s+/, '').replace(/\s*key$/, '').trim();
    if (/^(up|down|left|right)$/.test(k)) k += ' arrow';
    if (k === 'spacebar') k = 'space';
    return KEYS.includes(k) || /^[a-z0-9]$/.test(k) ? k : null;
  };

  function makeParser(knownSprites) {
    const vars = new Set(), warnings = [], referenced = new Set();
    const sprites = () => knownSprites;

    function value(raw) {
      const s = strip(String(raw));
      if (/^-?\d+(\.\d+)?$/.test(s)) return N(Number(s));
      if (/^["“'‘].*["”'’]$/s.test(s)) return T(unquote(s));
      const lower = s.toLowerCase();
      if (REPORTERS[lower]) return { block: B(REPORTERS[lower]) };
      let m;
      if ((m = s.match(/^(?:a )?random number (?:from |between )?\(?\s*(-?[\d.]+)\s*(?:,|and|to)\s*(-?[\d.]+)\s*\)?$/i))) return { block: B('math_random_int', { FROM: value(m[1]), TO: value(m[2]) }) };
      if ((m = s.match(/^(?:pick )?random (.+?) to (.+)$/i))) return { block: B('math_random_int', { FROM: value(m[1]), TO: value(m[2]) }) };
      if ((m = s.match(/^ask ai (.+)$/i))) return { block: B('ai_ask', { P: value(m[1]) }) };
      if ((m = s.match(/^join (["“'‘].*?["”'’]|\S+) (?:and |with )?(.+)$/i))) return { block: { type: 'text_join', extraState: { itemCount: 2 }, inputs: { ADD0: value(m[1]), ADD1: value(m[2]) } } };
      if ((m = s.match(/^(["“'‘].*?["”'’]|.+?) \+ (.+)$/s)) && (/^["“'‘]/.test(m[1].trim()) || /^["“'‘]/.test(m[2].trim()))) {
        return { block: { type: 'text_join', extraState: { itemCount: 2 }, inputs: { ADD0: value(m[1]), ADD1: value(m[2]) } } };
      }
      if ((m = s.match(/^(.+?) ([+\-*/×÷]) (.+)$/))) {
        const op = { '+': 'ADD', '-': 'MINUS', '*': 'MULTIPLY', '×': 'MULTIPLY', '/': 'DIVIDE', '÷': 'DIVIDE' }[m[2]];
        return { block: B('math_arithmetic', { A: value(m[1]), B: value(m[3]) }, { OP: op }) };
      }
      if (vars.has(lower)) return { block: { type: 'variables_get', fields: { VAR: { id: 'v_' + lower } } } };
      return T(s);
    }

    function target(raw) {
      const t = unquote(raw).toLowerCase().replace(/^the\s+/, '');
      if (/mouse/.test(t)) return '_mouse_';
      if (/edge/.test(t)) return '_edge_';
      if (/random/.test(t)) return '_random_';
      const known = sprites().find(n => n.toLowerCase() === t);
      if (known) return known;
      const name = unquote(raw).trim().replace(/^\w/, c => c.toUpperCase());
      referenced.add(name);
      return name;
    }

    function condition(raw) {
      let s = strip(String(raw)).replace(/\?$/, '').trim(), m;
      if ((m = s.match(/^not (.+)$/i))) return { block: B('logic_negate', { BOOL: condition(m[1]) }) };
      if ((m = s.match(/^(.+?) (and|or) (.+)$/i))) return { block: B('logic_operation', { A: condition(m[1]), B: condition(m[3]) }, { OP: m[2].toUpperCase() }) };
      if ((m = s.match(/^touching (.+)$/i))) return { block: B('cb_touching', {}, { T: target(m[1]) }) };
      if ((m = s.match(/^key (.+?) (?:is )?pressed$/i)) && keyName(m[1])) return { block: B('cb_key_pressed', {}, { KEY: keyName(m[1]) }) };
      if ((m = s.match(/^(?:the )?(.+?) key (?:is )?(?:pressed|down)$/i)) && keyName(m[1])) return { block: B('cb_key_pressed', {}, { KEY: keyName(m[1]) }) };
      if (/^mouse (?:is )?down$/i.test(s)) return { block: B('cb_mouse_down') };
      if ((m = s.match(/^(.+?)\s*(<=|>=|!=|≠|==|=|<|>)\s*(.+)$/))) {
        const op = { '<': 'LT', '>': 'GT', '=': 'EQ', '==': 'EQ', '!=': 'NEQ', '≠': 'NEQ', '<=': 'LTE', '>=': 'GTE' }[m[2]];
        return { block: B('logic_compare', { A: value(m[1]), B: value(m[3]) }, { OP: op }) };
      }
      return null;
    }

    const secs = '(?:secs?|seconds?)';
    // [pattern, build(match) → { json, kind }]   kind: 'hat' | 'stmt' | 'c' (has a DO body) | 'if' | 'else'
    const RULES = [
      [/^(?:turn|point|face) (?:to|towards|toward) (.+)$/i, m => ({ json: B('cb_point_towards', {}, { T: target(m[1]) }) })],
      [/^move (.+?) steps? (?:to|towards|toward) (.+)$/i, m => ({ multi: [B('cb_point_towards', {}, { T: target(m[2]) }), B('cb_move', { N: value(m[1]) })] })],
      [/^change (x|y) to (.+)$/i, m => ({ json: B('cb_set_' + m[1].toLowerCase(), { N: value(m[2]) }) })],
      [/^(?:go to|jump to|move to) (?:a )?random (?:place|position|spot)$/i, () => ({ json: B('cb_goto', {}, { T: '_random_' }) })],
      [/^(?:follow|go to) (?:the )?mouse(?:[- ]pointer)?$/i, () => ({ json: B('cb_goto', {}, { T: '_mouse_' }) })],
      [/^bounce(?: off (?:the )?edges?)?$/i, () => ({ json: B('cb_bounce') })],
      [/^jump$/i, () => ({ json: B('cb_play_anim', { N: N(1) }, { A: 'jump' }) })],
      [/^spin(?: around)?$/i, () => ({ json: B('cb_play_anim', { N: N(1) }, { A: 'spin' }) })],
      [/^fade (in|out)(?: (?:over |for |in )?[\d.]+ ?(?:secs?|seconds?))?$/i, m => ({ json: B('cb_repeat', { N: N(10), DO: { block: B('cb_change_effect', { N: N(m[1].toLowerCase() === 'out' ? 10 : -10) }, { E: 'ghost' }) } }) })],
      [/^when (?:the )?(?:green )?flag (?:is )?clicked$/i, () => ({ kind: 'hat', json: B('cb_when_flag') })],
      [/^when (.+?) (?:key )?(?:is )?pressed$/i, m => keyName(m[1]) && ({ kind: 'hat', json: B('cb_when_key', {}, { KEY: keyName(m[1]) }) })],
      [/^when (?:this )?sprite (?:is )?clicked$/i, () => ({ kind: 'hat', json: B('cb_when_clicked') })],
      [/^when (?:the )?stage (?:is )?clicked$/i, () => ({ kind: 'hat', json: B('cb_when_stage_clicked') })],
      [/^when i receive (.+)$/i, m => ({ kind: 'hat', json: B('cb_when_receive', {}, { MSG: unquote(m[1]) }) })],
      [/^move (.+?)(?: steps?)?$/i, m => ({ json: B('cb_move', { N: value(m[1]) }) })],
      [/^turn (?:right|↻|clockwise) (.+?)(?: degrees)?$/i, m => ({ json: B('cb_turn_right', { N: value(m[1]) }) })],
      [/^turn (?:left|↺|anti-?clockwise|counter-?clockwise) (.+?)(?: degrees)?$/i, m => ({ json: B('cb_turn_left', { N: value(m[1]) }) })],
      [/^turn (.+?) degrees$/i, m => ({ json: B('cb_turn_right', { N: value(m[1]) }) })],
      [/^go to x:? (.+?),? y:? (.+)$/i, m => ({ json: B('cb_goto_xy', { X: value(m[1]), Y: value(m[2]) }) })],
      [/^go to (.+)$/i, m => ({ json: B('cb_goto', {}, { T: target(m[1]) }) })],
      [new RegExp(`^glide (.+?) ${secs} to x:? (.+?),? y:? (.+)$`, 'i'), m => ({ json: B('cb_glide_xy', { S: value(m[1]), X: value(m[2]), Y: value(m[3]) }) })],
      [/^point in direction (.+)$/i, m => ({ json: B('cb_point', { N: value(m[1]) }) })],
      [/^point towards (.+)$/i, m => ({ json: B('cb_point_towards', {}, { T: target(m[1]) }) })],
      [/^change x by (.+)$/i, m => ({ json: B('cb_change_x', { N: value(m[1]) }) })],
      [/^set x to (.+)$/i, m => ({ json: B('cb_set_x', { N: value(m[1]) }) })],
      [/^change y by (.+)$/i, m => ({ json: B('cb_change_y', { N: value(m[1]) }) })],
      [/^set y to (.+)$/i, m => ({ json: B('cb_set_y', { N: value(m[1]) }) })],
      [/^if on edge,? bounce$/i, () => ({ json: B('cb_bounce') })],
      [new RegExp(`^say (.+) for (.+?) ${secs}$`, 'i'), m => ({ json: B('cb_say_for', { T: value(m[1]), S: value(m[2]) }) })],
      [/^say (.+)$/i, m => ({ json: B('cb_say', { T: value(m[1]) }) })],
      [new RegExp(`^think (.+) for (.+?) ${secs}$`, 'i'), m => ({ json: B('cb_think_for', { T: value(m[1]), S: value(m[2]) }) })],
      [/^think (.+)$/i, m => ({ json: B('cb_think', { T: value(m[1]) }) })],
      [/^switch costume to (.+)$/i, m => ({ json: B('cb_switch_costume', { C: value(m[1]) }) })],
      [/^next costume$/i, () => ({ json: B('cb_next_costume') })],
      [/^change size by (.+)$/i, m => ({ json: B('cb_change_size', { N: value(m[1]) }) })],
      [/^set size to (.+?)\s*%?$/i, m => ({ json: B('cb_set_size', { N: value(m[1]) }) })],
      [/^(show|hide)$/i, m => ({ json: B('cb_' + m[1].toLowerCase()) })],
      [/^go to front(?: layer)?$/i, () => ({ json: B('cb_front') })],
      [/^set stage colou?r to (#[0-9a-f]{6})$/i, m => ({ json: B('cb_stage_color', { C: { shadow: { type: 'colour_picker', fields: { COLOUR: m[1].toLowerCase() } } } }) })],
      [/^set text to (.+)$/i, m => ({ json: B('cb_set_text', { T: value(m[1]) }) })],
      [/^print (.+)$/i, m => ({ json: B('cb_print', { T: value(m[1]) }) })],
      [/^(change|set) (colou?r|ghost) effect (?:by|to) (.+)$/i, m => ({ json: B(m[1].toLowerCase() === 'set' ? 'cb_set_effect' : 'cb_change_effect', { N: value(m[3]) }, { E: m[2].startsWith('g') ? 'ghost' : 'color' }) })],
      [/^clear graphic effects$/i, () => ({ json: B('cb_clear_effects') })],
      [/^play animation (\w+)(?: (.+?) times?)?$/i, m => ANIMS.includes(m[1].toLowerCase()) && ({ json: B('cb_play_anim', { N: value(m[2] || '1') }, { A: m[1].toLowerCase() }) })],
      [/^start animation (\w+)$/i, m => ANIMS.includes(m[1].toLowerCase()) && ({ json: B('cb_start_anim', {}, { A: m[1].toLowerCase() }) })],
      [/^stop animation$/i, () => ({ json: B('cb_stop_anim') })],
      [new RegExp(`^play note (.+?) for (.+?) ${secs}$`, 'i'), m => ({ json: B('cb_play_note', { N: value(m[1]), S: value(m[2]) }) })],
      [/^set volume to (.+?)\s*%?$/i, m => ({ json: B('cb_set_volume', { N: value(m[1]) }) })],
      [/^broadcast (.+?) and wait$/i, m => ({ json: B('cb_broadcast_wait', {}, { MSG: unquote(m[1]) }) })],
      [/^broadcast (.+)$/i, m => ({ json: B('cb_broadcast', {}, { MSG: unquote(m[1]) }) })],
      [/^wait until (.+)$/i, m => condition(m[1]) && ({ json: B('cb_wait_until', { COND: condition(m[1]) }) })],
      [new RegExp(`^wait (.+?)(?: ${secs})?$`, 'i'), m => ({ json: B('cb_wait', { N: value(m[1]) }) })],
      [/^forever$/i, () => ({ kind: 'c', json: B('cb_forever') })],
      [/^repeat until (.+)$/i, m => condition(m[1]) && ({ kind: 'c', json: B('cb_repeat_until', { COND: condition(m[1]) }) })],
      [/^repeat (.+?)(?: times)?$/i, m => ({ kind: 'c', json: B('cb_repeat', { N: value(m[1]) }) })],
      [/^if (.+?)(?: then)?$/i, m => condition(m[1]) && ({ kind: 'if', json: B('cb_if', { COND: condition(m[1]) }) })],
      [/^else$/i, () => ({ kind: 'else' })],
      [/^stop all$/i, () => ({ json: B('cb_stop', {}, { WHAT: 'all' }) })],
      [/^stop this script$/i, () => ({ json: B('cb_stop', {}, { WHAT: 'this' }) })],
      [/^ask (.+?) and wait$/i, m => ({ json: B('cb_ask', { Q: value(m[1]) }) })],
      [/^reset timer$/i, () => ({ json: B('cb_reset_timer') })],
      [/^send (.+?) to (?:the )?ai(?: chat)?$/i, m => ({ json: B('ai_send', { P: value(m[1]) }) })],
      [/^set (.+?) to (.+)$/i, m => { const n = unquote(m[1]).toLowerCase(); vars.add(n); return { json: { type: 'variables_set', inputs: { VALUE: value(m[2]) }, fields: { VAR: { id: 'v_' + n } } } }; }],
      [/^change (.+?) by (.+)$/i, m => { const n = unquote(m[1]).toLowerCase(); vars.add(n); return { json: { type: 'math_change', inputs: { DELTA: value(m[2]) }, fields: { VAR: { id: 'v_' + n } } } }; }],
    ];

    function statement(text) {
      for (const [re, build] of RULES) { const m = text.match(re); if (m) { const r = build(m); if (r) return { kind: 'stmt', ...r }; } }
      return null;
    }
    return { statement, vars, warnings, referenced };
  }

  /** Parse the AI's script. Returns { sections: [{ sprite, emoji, scripts: [hatJson] }], vars, warnings }. */
  CB.parseScript = function (text, knownSprites = []) {
    const p = makeParser(knownSprites);
    const sections = [];
    let section = null, stack = null;
    const newSection = (sprite, emoji) => { section = { sprite, emoji, scripts: [] }; sections.push(section); stack = null; };
    // Collect variable names first so later lines can read them.
    for (const raw of text.split('\n')) { const m = raw.trim().match(/^(?:set|change) (.+?) (?:to|by) /i); if (m && !/^(x|y|size|volume|text|stage|rotation|pen|colou?r|ghost)\b/i.test(m[1])) p.vars.add(m[1].replace(/["“”']/g, '').toLowerCase()); }

    for (const raw of text.split('\n')) {
      if (/^\s*```/.test(raw) || !raw.trim() || /^\s*(#|\/\/)/.test(raw)) continue;
      const indent = raw.replace(/\t/g, '    ').match(/^ */)[0].length;
      const line = raw.trim().replace(/^([-*•]|\d+[.)])\s+/, '').replace(/[.;]$/, '').replace(/:$/, '').trim();
      let m;
      if ((m = line.match(/^sprite[: ]+(.+?)(?:\s+(\p{Extended_Pictographic}[\p{Extended_Pictographic}‍️]*))?$/u))) { newSection(m[1].trim(), m[2] || null); continue; }
      const st = p.statement(line);
      if (!st) { p.warnings.push(line); continue; }
      if (st.kind === 'hat') {
        if (!section) newSection(null, null);
        const root = { json: st.json, body: [] };
        section.scripts.push(root);
        stack = [{ indent: -1, list: root.body }];
        continue;
      }
      if (!stack) { p.warnings.push(line + '  (not inside a “when …” block)'); continue; }
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
      const list = stack[stack.length - 1].list;
      if (st.kind === 'else') {
        const prev = list[list.length - 1];
        if (!prev || prev.json.type !== 'cb_if') { p.warnings.push('else (no “if” before it)'); continue; }
        prev.json.type = 'cb_if_else'; prev.elseBody = [];
        stack.push({ indent, list: prev.elseBody });
        continue;
      }
      if (st.multi) { st.multi.forEach(json => list.push({ json, body: [] })); continue; }
      const node = { json: st.json, body: [] };
      list.push(node);
      if (st.kind === 'c' || st.kind === 'if') stack.push({ indent, list: node.body });
    }

    // Turn the nested lists into Blockly's "next" chains.
    const chain = nodes => {
      const blocks = nodes.map(n => {
        if (n.body.length) n.json.inputs.DO = { block: chain(n.body) };
        if (n.elseBody && n.elseBody.length) n.json.inputs.ELSE = { block: chain(n.elseBody) };
        return n.json;
      });
      for (let i = blocks.length - 2; i >= 0; i--) blocks[i].next = { block: blocks[i + 1] };
      return blocks[0];
    };
    for (const s of sections) s.scripts = s.scripts.map(r => { if (r.body.length) r.json.next = { block: chain(r.body) }; return r.json; });
    // New sprites without an emoji get one that matches their name (a "Ghost" becomes 👻).
    for (const s of sections) if (s.sprite && !s.emoji && !knownSprites.some(n => n.toLowerCase() === s.sprite.toLowerCase())) s.emoji = EMOJI[s.sprite.toLowerCase().replace(/s$/, '')] || '⭐';
    const defined = new Set(sections.map(s => (s.sprite || '').toLowerCase()));
    for (const name of p.referenced) if (!defined.has(name.toLowerCase())) sections.push({ sprite: name, emoji: EMOJI[name.toLowerCase().replace(/s$/, '')] || '⭐', scripts: [] });
    return { sections: sections.filter(s => s.scripts.length || s.emoji), vars: [...p.vars], warnings: p.warnings };
  };

  /** Words the AI is allowed to use (sent as part of its instructions). */
  CB.BUILD_GUIDE = `Write the program as plain block words, one block per line. Indent with 2 spaces to put blocks inside "forever", "repeat", "if" and "else".
Every script starts with a hat line: when flag clicked | when space key pressed | when this sprite clicked | when I receive go
Blocks you can use:
move 10 steps | turn right 15 degrees | turn left 15 degrees | go to x: 0 y: 0 | go to random position | go to mouse-pointer | glide 1 secs to x: 0 y: 0
point in direction 90 | change x by 10 | set x to 0 | change y by 10 | set y to 0 | if on edge, bounce
say "Hello!" for 2 seconds | say "Hi" | think "Hmm" | next costume | change size by 10 | set size to 100% | show | hide
set stage color to #bde0fe | set text to "Score: 0" | play animation jump 1 times (animations: walk blink jump wave happy dance spin shake pulse)
play note 60 for 0.5 seconds | broadcast go | wait 1 seconds | wait until touching edge?
forever | repeat 10 | repeat until touching edge? | if touching mouse-pointer? then | else | stop all
ask "What's your name?" and wait | set score to 0 | change score by 1 | send "hello" to AI chat | reset timer
Values can be numbers, "quoted text", a variable name, answer, x position, y position, timer, mouse x, mouse y, pick random 1 to 10, join "Score: " score, score + 1.
Conditions: touching edge? | touching mouse-pointer? | touching Apple? | key space pressed? | mouse down? | score > 5 | answer = "yes" | not ... | ... and ...
To give scripts to another sprite, put "sprite NAME EMOJI" on its own line first (it is created if it doesn't exist), for example: sprite Apple 🍎
Example:
\`\`\`
sprite Claude
when flag clicked
  say "Let's go!" for 2 seconds
  forever
    move 10 steps
    if on edge, bounce
when space key pressed
  play animation jump 1 times
when right arrow key pressed
  change x by 10
when left arrow key pressed
  change x by -10
\`\`\`
To move: right = change x by 10, left = change x by -10, up = change y by 10, down = change y by -10. "turn" only rotates.
Another example (a catch game with a new sprite):
\`\`\`
sprite Claude
when flag clicked
  set score to 0
  forever
    go to mouse-pointer
    if touching Apple? then
      change score by 1
      say join "Score: " score
      broadcast caught
sprite Apple 🍎
when flag clicked
  go to random position
when I receive caught
  go to random position
\`\`\`
Only use lines exactly like the ones above (change the numbers, text and names). Never invent new kinds of blocks.`;
})();
