/* Claude Blocks templates: ready-made starter projects, opened from 📋 Templates (or New). */
(() => {
  const CB = window.CB;
  const $ = s => document.querySelector(s);

  // ---------- tiny helpers for writing Blockly JSON ----------
  const N = n => ({ shadow: { type: 'math_number', fields: { NUM: n } } });
  const T = t => ({ shadow: { type: 'text', fields: { TEXT: t } } });
  const C = c => ({ shadow: { type: 'colour_picker', fields: { COLOUR: c } } });
  const R = block => ({ block });                                  // plug a reporter block into an input
  const b = (type, inputs = {}, fields = {}) => ({ type, inputs, fields });
  const chain = (...bs) => { for (let i = bs.length - 2; i >= 0; i--) bs[i].next = { block: bs[i + 1] }; return bs[0]; };
  const DO = (...bs) => ({ block: chain(...bs) });
  const at = (x, y, ...bs) => Object.assign(chain(...bs), { x, y });
  const v = id => ({ type: 'variables_get', fields: { VAR: { id } } });
  const setVar = (id, value) => b('variables_set', { VALUE: value }, { VAR: { id } });
  const changeVar = (id, n) => b('math_change', { DELTA: N(n) }, { VAR: { id } });
  const join = (a, c) => ({ type: 'text_join', extraState: { itemCount: 2 }, inputs: { ADD0: a, ADD1: c } });
  const cmp = (op, a, c) => b('logic_compare', { A: a, B: c }, { OP: op });
  const math = (op, a, c) => b('math_arithmetic', { A: a, B: c }, { OP: op });
  const ws = (vars, ...scripts) => ({ variables: vars.map(id => ({ name: id, id })), blocks: { languageVersion: 0, blocks: scripts } });

  const flag = () => b('cb_when_flag');
  const key = k => b('cb_when_key', {}, { KEY: k });
  const say = (t, s) => (s == null ? b('cb_say', { T: t }) : b('cb_say_for', { T: t, S: N(s) }));
  const claude = (color = 'orange', extra = {}) => ({
    name: 'Claude', x: 0, y: -40, size: 150, rotationStyle: 'left-right',
    costumes: [0, 1, 'blink', 'jump', 'wave', 'happy'].map(frame => ({ type: 'claude', color, frame })), ...extra,
  });
  const emoji = (name, char, extra = {}) => ({ name, costumes: [{ type: 'emoji', char }], ...extra });
  const rnd = (a, c) => b('math_random_int', { FROM: N(a), TO: N(c) });
  const key$ = k => b('cb_key_pressed', {}, { KEY: k });
  // A plain coloured rectangle costume (for paddles and the like).
  const rect = (name, w, h, color) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'); x.fillStyle = color; x.beginPath(); x.roundRect(0, 0, w, h, h / 2); x.fill();
    return { type: 'image', src: c.toDataURL(), name };
  };
  const textBox = (name, text, style = {}, extra = {}) => ({
    name, rotationStyle: "don't rotate", ...extra,
    costumes: [{ type: 'text', name: 'text', text, size: 34, color: '#1f1e1d', font: 'sans', box: true, boxColor: '#ffffff', ...style }],
  });
  const trig = (op, n) => b('math_trig', { NUM: n }, { OP: op });
  const add3d = (shape, name, color, x, y, z) => b('three_add', { NAME: T(name), COLOR: C(color), X: N(x), Y: N(y), Z: N(z) }, { SHAPE: shape });
  const set3d = (name, prop, x, y, z) => b('three_set', { NAME: T(name), X: x, Y: y, Z: z }, { PROP: prop });
  const change3d = (name, prop, x, y, z) => b('three_change', { NAME: T(name), X: N(x), Y: N(y), Z: N(z) }, { PROP: prop });
  const get3d = (name, which) => R(b('three_get', { NAME: T(name) }, { WHICH: which }));
  // Lists and My Blocks (functions) for the advanced templates.
  const L = {
    make: items => ({ type: 'lists_create_with', extraState: { itemCount: items.length }, inputs: Object.fromEntries(items.map((it, i) => ['ADD' + i, it])) }),
    length: list => R(b('lists_length', { VALUE: list })),
    get: (list, at) => R(b('lists_getIndex', { VALUE: list, AT: at }, { MODE: 'GET', WHERE: 'FROM_START' })),
    set: (list, at, to) => b('lists_setIndex', { LIST: list, AT: at, TO: to }, { MODE: 'SET', WHERE: 'FROM_START' }),
    push: (list, item) => b('lists_setIndex', { LIST: list, TO: item }, { MODE: 'INSERT', WHERE: 'LAST' }),
    join: (list, delim) => R(b('lists_split', { INPUT: list, DELIM: T(delim) }, { MODE: 'JOIN' })),
  };
  const fn = (name, params, body, ret) => ({ type: 'procedures_defreturn', extraState: { params: params.map(p => ({ name: p, id: p })) }, fields: { NAME: name },
    inputs: { ...(body ? { STACK: { block: body } } : {}), RETURN: ret } });
  const call = (name, params, args) => R({ type: 'procedures_callreturn', extraState: { name, params }, inputs: Object.fromEntries(args.map((a, i) => ['ARG' + i, a])) });
  const vr = id => R(v(id));
  const kit = (...more) => [...(CB.piEmu ? CB.piEmu.defaultKit() : []), ...more];

  // ---------- the templates ----------
  const TEMPLATES = [
    {
      id: 'blank', icon: '🌱', title: 'Blank project', tag: 'Start', desc: 'Just Claude and an empty workspace.',
      build: () => ({ sprites: [claude('orange', { blocks: null })] }),
    },
    {
      id: 'walk', icon: '🚶', title: 'Walking Claude', tag: 'Animation', desc: 'Claude says hi and walks back and forth. Click him to tickle!',
      build: () => ({
        sprites: [claude('orange', { blocks: ws([],
          at(30, 30, flag(), say(T("Hi! I'm Claude 👋"), 2), b('cb_forever', { DO: DO(b('cb_move', { N: N(6) }), b('cb_next_costume'), b('cb_bounce'), b('cb_wait', { N: N(0.08) })) })),
          at(420, 30, b('cb_when_clicked'), b('cb_play_anim', { N: N(1) }, { A: 'happy' }), say(T('That tickles!'), 1))) })],
      }),
    },
    {
      id: 'catch', icon: '🍎', title: 'Catch the Apple', tag: 'Games', desc: 'Move the mouse to catch apples. How many can you get in 30 seconds?',
      build: () => ({
        sprites: [
          claude('orange', { blocks: ws(['score'],
            at(20, 20, flag(), setVar('score', N(0)), b('cb_reset_timer'), say(T('Catch the apples!'), 1.5),
              b('cb_forever', { DO: DO(
                b('cb_goto', {}, { T: '_mouse_' }),
                b('cb_if', { COND: R(b('cb_touching', {}, { T: 'Apple' })), DO: DO(
                  changeVar('score', 1), b('cb_broadcast', {}, { MSG: 'caught' }), say(R(join(T('Score: '), R(v('score'))))),
                  b('cb_play_note', { N: N(76), S: N(0.1) })) })) })),
            at(470, 20, flag(), b('cb_wait_until', { COND: R(cmp('GT', R(b('cb_timer')), N(30))) }),
              b('cb_play_anim', { N: N(2) }, { A: 'dance' }), say(R(join(T("Time's up! Score: "), R(v('score')))), 3), b('cb_stop', {}, { WHAT: 'all' }))) }),
          emoji('Apple', '🍎', { x: 120, y: 80, blocks: ws([],
            at(20, 20, flag(), b('cb_goto', {}, { T: '_random_' })),
            at(20, 140, b('cb_when_receive', {}, { MSG: 'caught' }), b('cb_goto', {}, { T: '_random_' }))) }),
        ],
      }),
    },
    {
      id: 'arrows', icon: '⌨️', title: 'Arrow-key explorer', tag: 'Games', desc: 'Walk Claude around with the arrow keys. Space makes him jump!',
      build: () => {
        const walk = (k, x, y, ...moves) => at(x, y, key(k), ...moves, b('cb_next_costume'));
        return {
          stageColor: '#e8f4ea',
          sprites: [claude('green', { blocks: ws([],
            walk('right arrow', 20, 20, b('cb_point', { N: N(90) }), b('cb_move', { N: N(10) })),
            walk('left arrow', 320, 20, b('cb_point', { N: N(-90) }), b('cb_move', { N: N(10) })),
            walk('up arrow', 20, 200, b('cb_change_y', { N: N(10) })),
            walk('down arrow', 320, 200, b('cb_change_y', { N: N(-10) })),
            at(20, 360, key('space'), b('cb_play_anim', { N: N(1) }, { A: 'jump' })),
            at(320, 360, flag(), b('cb_goto_xy', { X: N(0), Y: N(0) }), say(T('Use the arrow keys! Space = jump'), 3))) })],
        };
      },
    },
    {
      id: 'dance', icon: '💃', title: 'Dance party', tag: 'Animation', desc: 'Claude dances to a little tune while the stage flashes colours.',
      build: () => ({
        sprites: [
          claude('purple', { blocks: ws([],
            at(20, 20, flag(), b('cb_forever', { DO: DO(b('cb_play_anim', { N: N(1) }, { A: 'dance' }), b('cb_stage_color', { C: R(b('colour_random')) })) })),
            at(20, 220, flag(), b('cb_forever', { DO: DO(...[60, 64, 67, 72, 67, 64].map(n => b('cb_play_note', { N: N(n), S: N(0.2) }))) }))) }),
          emoji('Star', '⭐', { x: -150, y: 100, blocks: ws([], at(20, 20, flag(), b('cb_forever', { DO: DO(b('cb_turn_right', { N: N(6) }), b('cb_change_effect', { N: N(5) }, { E: 'color' })) }))) }),
        ],
      }),
    },
    {
      id: 'quiz', icon: '🧠', title: 'Quiz game', tag: 'Games', desc: 'Claude asks questions and keeps score. Change them to your own!',
      build: () => {
        const q = (question, ans) => [
          b('cb_ask', { Q: T(question) }),
          b('cb_if_else', { COND: R(cmp('EQ', R(b('cb_answer')), T(ans))),
            DO: DO(changeVar('score', 1), b('cb_play_anim', { N: N(1) }, { A: 'happy' }), say(T('Correct! 🎉'), 1)),
            ELSE: DO(say(R(join(T('Oops! The answer is '), T(ans))), 2)) }),
        ];
        return {
          sprites: [claude('blue', { blocks: ws(['score'],
            at(20, 20, flag(), setVar('score', N(0)), say(T("Let's play a quiz!"), 2),
              ...q('What is 3 + 4?', '7'), ...q('What colour do you get from blue + yellow?', 'green'), ...q('How many legs does a spider have?', '8'),
              say(R(join(T('You scored '), R(join(R(v('score')), T(' out of 3!'))))), 4))) })],
        };
      },
    },
    {
      id: 'music', icon: '🎵', title: 'Music maker', tag: 'Animation', desc: 'Press keys A to G to play notes. Claude bounces to your music!',
      build: () => ({
        stageColor: '#fff6e8',
        sprites: [claude('gold', { blocks: ws([],
          ...[['a', 69], ['b', 71], ['c', 60], ['d', 62], ['e', 64], ['f', 65], ['g', 67]].map(([k, n], i) =>
            at(20 + (i % 3) * 260, 20 + Math.floor(i / 3) * 150, key(k), b('cb_play_note', { N: N(n), S: N(0.3) }), b('cb_play_anim', { N: N(1) }, { A: 'pulse' }))),
          at(20, 470, flag(), say(T('Press A B C D E F G to play music!'), 3))) })],
      }),
    },
    {
      id: 'chatbot', icon: '✳️', title: 'AI chatbot', tag: 'AI', desc: 'Talk to Claude! He answers using a local AI model (needs Ollama).', extensions: ['ai'],
      build: () => ({
        sprites: [claude('orange', { blocks: ws([],
          at(20, 20, flag(), say(T("Hi! Ask me anything. I'm powered by AI ✳️"), 2),
            b('cb_forever', { DO: DO(
              b('cb_ask', { Q: T('What do you want to ask?') }),
              b('cb_think', { T: T('Thinking…') }),
              b('cb_start_anim', {}, { A: 'blink' }),
              say(R(b('ai_ask', { P: R(join(T('Answer in one short, friendly sentence for a kid: '), R(b('cb_answer')))) }))),
              b('cb_stop_anim'), b('cb_wait', { N: N(3) })) }))) })],
      }),
    },
    {
      id: 'three', icon: '🧊', title: '3D spinning world', tag: '3D & apps', desc: 'A 3D Claude, a donut and a cube spinning on a floor (Three.js).', extensions: ['three'],
      build: () => {
        const add = (shape, name, color, x, y, z) => b('three_add', { NAME: T(name), COLOR: C(color), X: N(x), Y: N(y), Z: N(z) }, { SHAPE: shape });
        const spin = (name, x, y) => b('three_change', { NAME: T(name), X: N(x), Y: N(y), Z: N(0) }, { PROP: 'rotation' });
        return {
          sprites: [claude('orange', { visible: false, blocks: ws([],
            at(20, 20, flag(), b('three_start', { COLOR: C('#9fd3ff') }), add('plane', 'floor', '#7bc96f', 0, -1, 0), add('claude', 'claude', '#c96f4e', 0, 0, 0),
              add('torus', 'donut', '#ff7ab6', -2.2, 0.2, 0), add('cube', 'box', '#ffd166', 2.2, 0, 0),
              b('cb_forever', { DO: DO(spin('claude', 0, 2), spin('donut', 3, 1), spin('box', 1, 2)) }))) })],
        };
      },
    },
    {
      id: 'react', icon: '⚛️', title: 'React counter app', tag: '3D & apps', desc: 'A real app screen with buttons that count your clicks (React).', extensions: ['react'],
      build: () => ({
        sprites: [claude('orange', { x: 150, y: -120, size: 100, blocks: ws(['clicks'],
          at(20, 20, flag(), setVar('clicks', N(0)),
            b('react_app', { DO: DO(
              b('react_card', { DO: DO(
                b('react_heading', { TEXT: T('Click Counter') }, { LEVEL: 'h2' }),
                b('react_text', { TEXT: R(join(T('You clicked '), R(join(R(v('clicks')), T(' times'))))) }),
                b('react_row', { DO: DO(
                  b('react_button', { LABEL: T('➕ Add one'), DO: DO(changeVar('clicks', 1), b('cb_play_anim', { N: N(1) }, { A: 'jump' })) }),
                  b('react_button', { LABEL: T('Reset'), DO: DO(setVar('clicks', N(0))) })) })) })) }))) })],
      }),
    },
    {
      id: 'pi-traffic', icon: '🚦', title: 'Pi: traffic light', tag: 'Raspberry Pi', desc: 'A real traffic light sequence with the LCD saying STOP and GO.', extensions: ['pi'],
      build: () => {
        const step = (light, text, secs) => [b('pi_traffic', {}, { L: light }), b('pi_lcd', { TEXT: T(text) }, { LINE: '1' }), b('cb_wait', { N: N(secs) })];
        return {
          piParts: kit({ type: 'traffic' }),
          sprites: [claude('green', { blocks: ws([],
            at(20, 20, flag(), b('pi_lcd_clear'), b('cb_forever', { DO: DO(...step('red', 'STOP', 3), ...step('amber', 'GET READY', 1), ...step('green', 'GO!', 3), ...step('amber', 'SLOW DOWN', 1)) }))) })],
        };
      },
    },
    {
      id: 'pi-thermo', icon: '🌡️', title: 'Pi: thermostat', tag: 'Raspberry Pi', desc: 'Shows the CPU temperature on the LCD and turns the fan on when it gets hot. Drag the CPU load slider!', extensions: ['pi'],
      build: () => ({
        piParts: kit(),
        sprites: [claude('blue', { blocks: ws([],
          at(20, 20, flag(), b('cb_forever', { DO: DO(
            b('pi_lcd', { TEXT: R(join(T('CPU '), R(join(R(b('pi_temp')), T(' C'))))) }, { LINE: '1' }),
            b('cb_if_else', { COND: R(cmp('GT', R(b('pi_temp')), N(55))),
              DO: DO(b('pi_fan', {}, { MODE: 'full' }), b('pi_gpio_write', { PIN: N(17) }, { STATE: 'true' }), b('pi_gpio_write', { PIN: N(27) }, { STATE: 'false' }), b('pi_lcd', { TEXT: T('Too hot! Fan ON') }, { LINE: '2' })),
              ELSE: DO(b('pi_fan', {}, { MODE: 'off' }), b('pi_gpio_write', { PIN: N(17) }, { STATE: 'false' }), b('pi_gpio_write', { PIN: N(27) }, { STATE: 'true' }), b('pi_lcd', { TEXT: T('All cool :)') }, { LINE: '2' })) }),
            b('cb_wait', { N: N(0.5) })) }))) })],
      }),
    },
    {
      id: 'pi-servo', icon: '🎛️', title: 'Pi: servo dial', tag: 'Raspberry Pi', desc: 'Turn the potentiometer and the servo follows. The LCD shows the angle.', extensions: ['pi'],
      build: () => {
        const angle = () => R(b('math_round', { NUM: R(math('MULTIPLY', R(b('pi_pot')), N(1.8))) }, { OP: 'ROUND' }));
        return {
          piParts: kit(),
          sprites: [claude('gold', { blocks: ws([],
            at(20, 20, flag(), b('pi_lcd', { TEXT: T('Turn the knob!') }, { LINE: '1' }),
              b('cb_forever', { DO: DO(b('pi_servo', { PIN: N(18), ANGLE: angle() }), b('pi_lcd', { TEXT: R(join(T('Angle: '), angle())) }, { LINE: '2' }), b('cb_wait', { N: N(0.1) })) }))) })],
        };
      },
    },
    {
      id: 'pi-night', icon: '🌙', title: 'Pi: night light', tag: 'Raspberry Pi', desc: 'When the light sensor says it is dark, the NeoPixels glow. Slide the light level down!', extensions: ['pi'],
      build: () => ({
        piParts: kit({ type: 'light' }, { type: 'neopixel' }),
        sprites: [claude('purple', { blocks: ws([],
          at(20, 20, flag(), b('cb_forever', { DO: DO(
            b('cb_if_else', { COND: R(cmp('LT', R(b('pi_sensor', {}, { S: 'light' })), N(30))),
              DO: DO(b('pi_neo_fill', { COLOR: C('#ffb347') }), say(T('Good night 🌙'))),
              ELSE: DO(b('pi_neo_clear'), say(T('It is bright ☀️'))) }),
            b('cb_wait', { N: N(0.2) })) }))) })],
      }),
    },
    {
      id: 'pong', icon: '🏓', title: 'Pong', tag: 'Games', desc: 'Keep the ball bouncing with a paddle that follows your mouse.',
      build: () => ({
        stageColor: '#eef4ff',
        sprites: [
          { name: 'Paddle', y: -150, costumes: [rect('paddle', 110, 16, '#2b5bd7')], blocks: ws([],
            at(20, 20, flag(), b('cb_forever', { DO: DO(b('cb_set_x', { N: R(b('cb_mouse_x')) })) }))) },
          emoji('Ball', '⚽', { size: 70, blocks: ws(['score'],
            at(20, 20, flag(), setVar('score', N(0)), b('cb_goto_xy', { X: N(0), Y: N(100) }), b('cb_point', { N: R(rnd(135, 160)) }), say(T('Ready…'), 1),
              b('cb_forever', { DO: DO(
                b('cb_move', { N: N(7) }), b('cb_bounce'),
                b('cb_if', { COND: R(b('cb_touching', {}, { T: 'Paddle' })), DO: DO(
                  b('cb_point', { N: R(math('MINUS', N(180), R(b('cb_direction')))) }), b('cb_move', { N: N(12) }),
                  changeVar('score', 1), say(R(v('score'))), b('cb_play_note', { N: N(72), S: N(0.05) })) }),
                b('cb_if', { COND: R(cmp('LT', R(b('cb_ypos')), N(-165))), DO: DO(
                  say(R(join(T('Game over! Score: '), R(v('score')))), 3), b('cb_stop', {}, { WHAT: 'all' })) })) }))) }),
        ],
      }),
    },
    {
      id: 'dodge', icon: '👾', title: 'Space dodge', tag: 'Games', desc: 'Steer the rocket with ← → and dodge the falling aliens. They get faster!',
      build: () => ({
        stageColor: '#14142b',
        sprites: [
          emoji('Rocket', '🚀', { y: -140, size: 80, blocks: ws([],
            at(20, 20, flag(), b('cb_goto_xy', { X: N(0), Y: N(-140) }), b('cb_forever', { DO: DO(
              b('cb_if', { COND: R(key$('left arrow')), DO: DO(b('cb_change_x', { N: N(-8) })) }),
              b('cb_if', { COND: R(key$('right arrow')), DO: DO(b('cb_change_x', { N: N(8) })) })) }))) }),
          emoji('Alien', '👾', { y: 180, size: 80, blocks: ws(['score'],
            at(20, 20, flag(), setVar('score', N(0)), b('cb_forever', { DO: DO(
              b('cb_goto_xy', { X: R(rnd(-220, 220)), Y: N(180) }),
              b('cb_repeat_until', { COND: R(cmp('LT', R(b('cb_ypos')), N(-175))), DO: DO(
                b('cb_change_y', { N: R(math('MINUS', N(-5), R(math('MULTIPLY', R(v('score')), N(0.5))))) }),
                b('cb_if', { COND: R(b('cb_touching', {}, { T: 'Rocket' })), DO: DO(
                  b('cb_play_note', { N: N(40), S: N(0.4) }), say(R(join(T('Got you! Score: '), R(v('score')))), 3), b('cb_stop', {}, { WHAT: 'all' })) })) }),
              changeVar('score', 1)) }))) }),
        ],
      }),
    },
    {
      id: 'cookie', icon: '🍪', title: 'Cookie clicker', tag: 'Games', desc: 'Click the giant cookie as fast as you can. Every click counts!',
      build: () => ({
        stageColor: '#fff3e0',
        sprites: [
          emoji('Cookie', '🍪', { size: 220, blocks: ws(['cookies'],
            at(20, 20, flag(), setVar('cookies', N(0)), say(T('Click me!'))),
            at(20, 160, b('cb_when_clicked'), changeVar('cookies', 1), say(R(join(R(v('cookies')), T(' cookies')))),
              b('cb_play_note', { N: R(rnd(65, 80)), S: N(0.05) }), b('cb_play_anim', { N: N(1) }, { A: 'pulse' }))) }),
          claude('orange', { x: -170, y: -120, size: 100, blocks: ws([],
            at(20, 20, flag(), b('cb_forever', { DO: DO(b('cb_wait', { N: N(5) }), b('cb_play_anim', { N: N(1) }, { A: 'happy' }), say(T('Keep clicking!'), 1.5)) }))) }),
        ],
      }),
    },
    {
      id: 'reaction', icon: '⏱️', title: 'Reaction timer', tag: 'Games', desc: 'Wait for the stage to turn green, then press SPACE as fast as you can.',
      build: () => ({
        sprites: [claude('blue', { blocks: ws(['time'],
          at(20, 20, flag(), b('cb_stage_color', { C: C('#ffffff') }), say(T('When the stage turns green, press SPACE!'), 3), say(T('Get ready…')),
            b('cb_wait', { N: R(rnd(1, 4)) }), b('cb_stage_color', { C: C('#4cbf56') }), say(T('NOW!')), b('cb_reset_timer'),
            b('cb_wait_until', { COND: R(key$('space')) }), setVar('time', R(b('cb_timer'))), b('cb_stage_color', { C: C('#ffffff') }),
            b('cb_play_anim', { N: N(1) }, { A: 'jump' }), say(R(join(T('Your time: '), R(join(R(v('time')), T(' seconds'))))), 4))) })],
      }),
    },
    {
      id: 'story', icon: '🗣️', title: 'Two-sprite story', tag: 'Animation', desc: 'Claude and Cat have a conversation using broadcasts. Write your own story!',
      build: () => ({
        stageColor: '#f3ecff',
        sprites: [
          claude('orange', { x: -130, y: -40, blocks: ws([],
            at(20, 20, flag(), say(T('Hi Cat! What are you doing?'), 2), b('cb_broadcast_wait', {}, { MSG: 'cat1' }),
              say(T('Do you want to learn to code?'), 2), b('cb_broadcast_wait', {}, { MSG: 'cat2' }),
              b('cb_play_anim', { N: N(2) }, { A: 'dance' }), say(T("Let's go! 🎉"), 2))) }),
          emoji('Cat', '🐱', { x: 140, y: -40, size: 120, blocks: ws([],
            at(20, 20, b('cb_when_receive', {}, { MSG: 'cat1' }), say(T('Just chasing my tail!'), 2)),
            at(20, 140, b('cb_when_receive', {}, { MSG: 'cat2' }), say(T('Yes please!'), 1.5), b('cb_play_anim', { N: N(1) }, { A: 'spin' }))) }),
        ],
      }),
    },
    {
      id: 'ai-story', icon: '📖', title: 'AI story maker', tag: 'AI', desc: 'Tell Claude a topic and the AI writes a tiny story about it (needs Ollama).', extensions: ['ai'],
      build: () => ({
        sprites: [claude('purple', { blocks: ws(['story'],
          at(20, 20, flag(), b('cb_ask', { Q: T('What should my story be about?') }), b('cb_think', { T: T('Writing a story…') }),
            setVar('story', R(b('ai_ask', { P: R(join(T('Write a 2-sentence story for kids about '), R(b('cb_answer')))) }))),
            b('cb_play_anim', { N: N(1) }, { A: 'wave' }), say(R(v('story')), 12))) })],
      }),
    },
    {
      id: 'pi-rainbow', icon: '🎆', title: 'Pi: NeoPixel light show', tag: 'Raspberry Pi', desc: 'A colourful chase of lights running along a NeoPixel strip.', extensions: ['pi'],
      build: () => ({
        piParts: kit({ type: 'neopixel' }),
        sprites: [claude('pink', { blocks: ws(['i'],
          at(20, 20, flag(), b('pi_lcd', { TEXT: T('Light show!') }, { LINE: '1' }), b('cb_forever', { DO: DO(
            setVar('i', N(1)),
            b('cb_repeat', { N: N(8), DO: DO(b('pi_neo_clear'), b('pi_neo_set', { N: R(v('i')), COLOR: R(b('colour_random')) }), changeVar('i', 1), b('cb_wait', { N: N(0.08) })) }),
            b('pi_neo_fill', { COLOR: R(b('colour_random')) }), b('cb_wait', { N: N(0.3) })) }))) })],
      }),
    },
    {
      id: 'pi-doorbell', icon: '🔔', title: 'Pi: smart doorbell', tag: 'Raspberry Pi', desc: 'Press the button for a ding-dong. The motion sensor warns when someone is near.', extensions: ['pi'],
      build: () => ({
        piParts: kit(),
        sprites: [claude('gold', { blocks: ws([],
          at(20, 20, flag(), b('pi_lcd', { TEXT: T('Doorbell ready') }, { LINE: '1' }), b('cb_forever', { DO: DO(
            b('cb_if', { COND: R(b('pi_button', { PIN: N(16) })), DO: DO(
              b('pi_lcd', { TEXT: T('Ding dong!') }, { LINE: '1' }), b('pi_gpio_write', { PIN: N(17) }, { STATE: 'true' }),
              b('pi_buzzer', { PIN: N(22), NOTE: N(76), SECS: N(0.3) }), b('pi_buzzer', { PIN: N(22), NOTE: N(72), SECS: N(0.5) }),
              b('pi_gpio_write', { PIN: N(17) }, { STATE: 'false' }), b('pi_lcd', { TEXT: T('Doorbell ready') }, { LINE: '1' })) }),
            b('cb_if_else', { COND: R(b('pi_motion')), DO: DO(b('pi_lcd', { TEXT: T('Someone is here') }, { LINE: '2' })), ELSE: DO(b('pi_lcd', { TEXT: T('') }, { LINE: '2' })) }),
            b('cb_wait', { N: N(0.05) })) }))) })],
      }),
    },
    {
      id: 'pi-car', icon: '🚗', title: 'Pi: robot car', tag: 'Raspberry Pi', desc: 'Drive a motor with the joystick: up for forward, down for backward.', extensions: ['pi'],
      build: () => {
        const joyY = () => R(b('pi_sensor', {}, { S: 'joyy' }));
        return {
          piParts: kit({ type: 'joystick' }, { type: 'motor' }),
          sprites: [claude('green', { blocks: ws([],
            at(20, 20, flag(), b('cb_forever', { DO: DO(
              b('cb_if_else', { COND: R(cmp('GT', joyY(), N(15))),
                DO: DO(b('pi_motor', { SPEED: joyY() }, { DIR: 'forward' }), b('cb_start_anim', {}, { A: 'walk' })),
                ELSE: DO(b('cb_if_else', { COND: R(cmp('LT', joyY(), N(-15))),
                  DO: DO(b('pi_motor', { SPEED: R(math('MINUS', N(0), joyY())) }, { DIR: 'backward' }), b('cb_start_anim', {}, { A: 'walk' })),
                  ELSE: DO(b('pi_motor', { SPEED: N(0) }, { DIR: 'stop' }), b('cb_stop_anim')) })) }),
              b('pi_lcd', { TEXT: R(join(T('Speed: '), joyY())) }, { LINE: '1' }), b('cb_wait', { N: N(0.1) })) }))) })],
        };
      },
    },
    {
      id: 'countdown', icon: '⏰', title: 'New Year countdown', tag: 'Animation', desc: 'A big text box counts down from 10, then everyone celebrates.',
      build: () => ({
        stageColor: '#1d1b3a',
        sprites: [
          textBox('Countdown', '10', { size: 90, color: '#ffd60a', box: false, font: 'mono' }, { y: 40, blocks: ws(['count'],
            at(20, 20, flag(), b('cb_stage_color', { C: C('#1d1b3a') }), setVar('count', N(10)),
              b('cb_repeat', { N: N(10), DO: DO(b('cb_set_text', { T: R(v('count')) }), b('cb_play_note', { N: N(72), S: N(0.1) }), b('cb_play_anim', { N: N(1) }, { A: 'pulse' }), b('cb_wait', { N: N(0.4) }), changeVar('count', -1)) }),
              b('cb_set_text', { T: T('🎉 Happy New Year!') }), b('cb_text_color', { C: C('#ff7ab6') }), b('cb_stage_color', { C: C('#3a1d5c') }), b('cb_broadcast', {}, { MSG: 'party' }))) }),
          claude('gold', { y: -110, blocks: ws([], at(20, 20, b('cb_when_receive', {}, { MSG: 'party' }), b('cb_play_anim', { N: N(3) }, { A: 'dance' }), say(T('Woohoo! 🎆'), 2))) }),
        ],
      }),
    },
    {
      id: 'dice', icon: '🎲', title: 'Dice roller', tag: 'Games', desc: 'Click the text box to roll a dice. Claude cheers when you roll a 6!',
      build: () => ({
        stageColor: '#e8f4ea',
        sprites: [
          textBox('Dice', '🎲 Click to roll!', { size: 40 }, { y: 50, blocks: ws(['roll'],
            at(20, 20, flag(), b('cb_set_text', { T: T('🎲 Click to roll!') })),
            at(20, 140, b('cb_when_clicked'), b('cb_play_anim', { N: N(1) }, { A: 'spin' }), setVar('roll', R(rnd(1, 6))),
              b('cb_set_text', { T: R(join(T('🎲 You rolled '), R(v('roll')))) }), b('cb_play_note', { N: R(math('ADD', N(60), R(v('roll')))), S: N(0.2) }),
              b('cb_if', { COND: R(cmp('EQ', R(v('roll')), N(6))), DO: DO(b('cb_broadcast', {}, { MSG: 'six' })) }))) }),
          claude('green', { y: -100, blocks: ws([], at(20, 20, b('cb_when_receive', {}, { MSG: 'six' }), b('cb_play_anim', { N: N(1) }, { A: 'jump' }), say(T('A SIX! 🎉'), 1.5))) }),
        ],
      }),
    },
    {
      id: 'mathquiz', icon: '🧮', title: 'Math quiz', tag: 'Games', desc: 'Claude asks 5 random addition questions and counts your score.',
      build: () => ({
        sprites: [claude('blue', { blocks: ws(['score', 'a', 'b'],
          at(20, 20, flag(), setVar('score', N(0)), say(T("Let's do some maths!"), 2),
            b('cb_repeat', { N: N(5), DO: DO(
              setVar('a', R(rnd(1, 10))), setVar('b', R(rnd(1, 10))),
              b('cb_ask', { Q: R(join(R(v('a')), R(join(T(' + '), R(join(R(v('b')), T(' = ?'))))))) }),
              b('cb_if_else', { COND: R(cmp('EQ', R(b('cb_answer')), R(math('ADD', R(v('a')), R(v('b')))))),
                DO: DO(changeVar('score', 1), b('cb_play_anim', { N: N(1) }, { A: 'happy' }), say(T('Correct!'), 1)),
                ELSE: DO(say(R(join(T('It was '), R(math('ADD', R(v('a')), R(v('b')))))), 2)) })) }),
            say(R(join(T('You got '), R(join(R(v('score')), T(' out of 5!'))))), 4))) })],
      }),
    },
    {
      id: 'aquarium', icon: '🐠', title: 'Aquarium', tag: 'Animation', desc: 'Fish swim around a blue tank while bubbles float up.',
      build: () => {
        const fish = (name, char, speed, y) => emoji(name, char, { y, rotationStyle: 'left-right', blocks: ws([],
          at(20, 20, flag(), b('cb_point', { N: R(rnd(-180, 180)) }), b('cb_forever', { DO: DO(b('cb_move', { N: N(speed) }), b('cb_bounce'),
            b('cb_if', { COND: R(cmp('EQ', R(rnd(1, 60)), N(1))), DO: DO(b('cb_turn_right', { N: R(rnd(-60, 60)) })) })) }))) });
        return {
          stageColor: '#5bb8e8',
          sprites: [
            fish('Fish', '🐟', 2, 60), fish('Tropical', '🐠', 3, -20), fish('Puffer', '🐡', 1, -100),
            emoji('Bubble', '🫧', { size: 50, blocks: ws([], at(20, 20, flag(), b('cb_forever', { DO: DO(
              b('cb_goto_xy', { X: R(rnd(-220, 220)), Y: N(-170) }),
              b('cb_repeat_until', { COND: R(cmp('GT', R(b('cb_ypos')), N(170))), DO: DO(b('cb_change_y', { N: N(3) }), b('cb_change_x', { N: R(rnd(-2, 2)) })) })) }))) }),
          ],
        };
      },
    },
    {
      id: 'paint-hero', icon: '🎨', title: 'Draw your own hero', tag: 'Start', desc: 'Opens the paint editor so you can draw your own character, then move it with the arrow keys.',
      after: () => setTimeout(() => CB.openPaint && CB.openPaint(), 300),
      build: () => ({
        stageColor: '#fff6e8',
        sprites: [
          { name: 'Hero', size: 100, costumes: [rect('hero', 70, 70, '#d97757')], blocks: ws([],
            at(20, 20, key('right arrow'), b('cb_change_x', { N: N(10) })), at(260, 20, key('left arrow'), b('cb_change_x', { N: N(-10) })),
            at(20, 140, key('up arrow'), b('cb_change_y', { N: N(10) })), at(260, 140, key('down arrow'), b('cb_change_y', { N: N(-10) })),
            at(20, 260, b('cb_when_clicked'), b('cb_play_anim', { N: N(1) }, { A: 'jump' }))) },
          textBox('Tip', 'Draw your hero with 🎨 Paint,\nthen use the arrow keys!', { size: 20 }, { y: 130 }),
        ],
      }),
    },
    {
      id: 'ai-buddy', icon: '💬', title: 'AI chat buddy', tag: 'AI', desc: 'Type to Claude and your message goes to the AI chat. Claude says the answer (needs Ollama).', extensions: ['ai'],
      build: () => ({
        sprites: [claude('orange', { blocks: ws([],
          at(20, 20, flag(), say(T("Let's chat! Your messages also show in the AI Assistant tab."), 3), b('cb_forever', { DO: DO(
            b('cb_ask', { Q: T('Say something to the AI:') }), b('cb_think', { T: T('…') }),
            b('ai_send', { P: R(b('cb_answer')) }), b('cb_play_anim', { N: N(1) }, { A: 'wave' }), say(R(b('ai_reply')), 6)) }))) })],
      }),
    },
    {
      id: '3d-race', icon: '🏎️', title: '3D race track', tag: '3D & apps', desc: 'A 3D car drives round and round a track, with trees and clouds.', extensions: ['three'],
      build: () => ({
        sprites: [claude('orange', { visible: false, blocks: ws(['angle'],
          at(20, 20, flag(), b('three_start', { COLOR: C('#9fd3ff') }), b('three_camera', { X: N(0), Y: N(6), Z: N(9) }),
            add3d('plane', 'grass', '#6cc24a', 0, -0.6, 0), add3d('torus', 'track', '#555555', 0, -0.5, 0), set3d('track', 'scale', N(5), N(5), N(1)), set3d('track', 'rotation', N(90), N(0), N(0)),
            add3d('tree', 'tree1', '#3fa34d', 0, 0, 0), add3d('tree', 'tree2', '#3fa34d', 4.6, 0, -3), add3d('house', 'house', '#f4e1c1', -4.4, 0, -3), add3d('cloud', 'cloud', '#ffffff', -2, 3, -4),
            add3d('car', 'car', '#e5484d', 0, -0.2, 2.5), setVar('angle', N(0)),
            b('cb_forever', { DO: DO(changeVar('angle', 2),
              set3d('car', 'position', R(math('MULTIPLY', N(2.5), R(trig('SIN', R(v('angle')))))), N(-0.2), R(math('MULTIPLY', N(2.5), R(trig('COS', R(v('angle'))))))),
              set3d('car', 'rotation', N(0), R(v('angle')), N(0)), change3d('cloud', 'position', 0.01, 0, 0)) }))) })],
      }),
    },
    {
      id: '3d-winter', icon: '⛄', title: '3D winter village', tag: '3D & apps', desc: 'A snowman, trees and houses in the snow while the camera slowly circles around.', extensions: ['three'],
      build: () => ({
        sprites: [claude('blue', { visible: false, blocks: ws(['angle'],
          at(20, 20, flag(), b('three_start', { COLOR: C('#cde7ff') }), add3d('plane', 'snow', '#ffffff', 0, -0.95, 0),
            add3d('snowman', 'snowman', '#e5484d', 0, 0, 0), add3d('tree', 'tree1', '#2e7d32', -2.2, 0, -1), add3d('tree', 'tree2', '#2e7d32', 2.3, 0, -1.4),
            add3d('house', 'house', '#c96f4e', 0, 0, -2.6), add3d('cloud', 'cloud', '#ffffff', 2, 2.6, -2), add3d('star', 'star', '#ffd60a', 0, 2.2, -2.6), setVar('angle', N(0)),
            b('cb_forever', { DO: DO(changeVar('angle', 0.5), change3d('star', 'rotation', 0, 3, 0),
              b('three_camera', { X: R(math('MULTIPLY', N(7), R(trig('SIN', R(v('angle')))))), Y: N(2.5), Z: R(math('MULTIPLY', N(7), R(trig('COS', R(v('angle')))))) })) }))) })],
      }),
    },
    {
      id: '3d-rocket', icon: '🚀', title: '3D rocket launch', tag: '3D & apps', desc: 'Count down, then a 3D rocket blasts off and the camera follows it up.', extensions: ['three'],
      build: () => ({
        sprites: [claude('purple', { y: -120, size: 100, blocks: ws([],
          at(20, 20, flag(), b('three_start', { COLOR: C('#0b1d3a') }), b('three_camera', { X: N(0), Y: N(1), Z: N(6) }),
            add3d('plane', 'pad', '#666666', 0, -1, 0), add3d('rocket', 'rocket', '#e5484d', 0, -0.1, 0), add3d('star', 'star1', '#ffd60a', -3, 3, -5), add3d('star', 'star2', '#ffd60a', 3, 5, -6),
            say(T('3…'), 1), say(T('2…'), 1), say(T('1…'), 1), say(T('Blast off! 🚀')), b('cb_play_note', { N: N(48), S: N(0.6) }),
            b('cb_repeat', { N: N(150), DO: DO(change3d('rocket', 'position', 0, 0.06, 0), change3d('rocket', 'rotation', 0, 4, 0),
              b('three_camera', { X: N(0), Y: R(math('ADD', get3d('rocket', 'y position'), N(1))), Z: N(6) })) }),
            say(T('To the stars! ✨'), 3))) })],
      }),
    },
    {
      id: 'pi-weather', icon: '🌦️', title: 'Pi: weather station', tag: 'Raspberry Pi', desc: 'Shows temperature, humidity and light on an OLED screen. The RGB light turns red when it is hot.', extensions: ['pi'],
      build: () => ({
        piParts: kit({ type: 'dht' }, { type: 'light' }, { type: 'oled' }),
        sprites: [claude('blue', { blocks: ws([],
          at(20, 20, flag(), b('pi_oled', { TEXT: T('Weather station') }, { LINE: '1' }), b('cb_forever', { DO: DO(
            b('pi_oled', { TEXT: R(join(T('Temp: '), R(join(R(b('pi_sensor', {}, { S: 'temperature' })), T(' C'))))) }, { LINE: '2' }),
            b('pi_oled', { TEXT: R(join(T('Humidity: '), R(join(R(b('pi_sensor', {}, { S: 'humidity' })), T('%'))))) }, { LINE: '3' }),
            b('pi_oled', { TEXT: R(join(T('Light: '), R(b('pi_sensor', {}, { S: 'light' })))) }, { LINE: '4' }),
            b('cb_if_else', { COND: R(cmp('GT', R(b('pi_sensor', {}, { S: 'temperature' })), N(25))),
              DO: DO(b('pi_rgb', { COLOR: C('#ff3b30') })), ELSE: DO(b('pi_rgb', { COLOR: C('#0a84ff') })) }),
            b('cb_wait', { N: N(0.5) })) }))) })],
      }),
    },
    {
      id: 'pi-theremin', icon: '🎶', title: 'Pi: theremin', tag: 'Raspberry Pi', desc: 'Move your hand (the distance slider) to play music — closer means higher notes.', extensions: ['pi'],
      build: () => ({
        piParts: kit(),
        sprites: [claude('pink', { blocks: ws([],
          at(20, 20, flag(), b('pi_lcd', { TEXT: T('Theremin!') }, { LINE: '1' }), b('cb_forever', { DO: DO(
            b('cb_if_else', { COND: R(cmp('LT', R(b('pi_distance')), N(100))),
              DO: DO(b('pi_lcd', { TEXT: R(join(T('Note '), R(b('math_round', { NUM: R(math('MINUS', N(90), R(math('DIVIDE', R(b('pi_distance')), N(2))))) }, { OP: 'ROUND' })))) }, { LINE: '2' }),
                b('pi_buzzer', { PIN: N(22), NOTE: R(math('MINUS', N(90), R(math('DIVIDE', R(b('pi_distance')), N(2))))), SECS: N(0.15) })),
              ELSE: DO(b('pi_lcd', { TEXT: T('Move closer...') }, { LINE: '2' }), b('cb_wait', { N: N(0.15) })) })) }))) })],
      }),
    },
    {
      id: 'bubble-sort', icon: '🫧', title: 'Bubble sort', tag: 'Advanced', desc: 'Sorts a list of random numbers step by step with nested loops — watch the numbers swap places.',
      build: () => ({
        sprites: [claude('blue', { blocks: ws(['nums', 'i', 'temp'],
          at(20, 20, flag(), setVar('nums', R(L.make(Array.from({ length: 8 }, () => R(rnd(1, 99)))))),
            say(R(join(T('Messy: '), L.join(vr('nums'), ', '))), 2),
            b('cb_repeat', { N: R(math('MINUS', L.length(vr('nums')), N(1))), DO: DO(
              setVar('i', N(1)),
              b('cb_repeat', { N: R(math('MINUS', L.length(vr('nums')), N(1))), DO: DO(
                b('cb_if', { COND: R(cmp('GT', L.get(vr('nums'), vr('i')), L.get(vr('nums'), R(math('ADD', vr('i'), N(1)))))), DO: DO(
                  setVar('temp', L.get(vr('nums'), vr('i'))),
                  L.set(vr('nums'), vr('i'), L.get(vr('nums'), R(math('ADD', vr('i'), N(1))))),
                  L.set(vr('nums'), R(math('ADD', vr('i'), N(1))), vr('temp')),
                  say(L.join(vr('nums'), ', ')), b('cb_play_note', { N: R(math('ADD', N(50), L.get(vr('nums'), vr('i')))), S: N(0.08) })) }),
                changeVar('i', 1)) })) }),
            b('cb_play_anim', { N: N(1) }, { A: 'happy' }), say(R(join(T('Sorted! '), L.join(vr('nums'), ', '))), 4))) })],
      }),
    },
    {
      id: 'recursion', icon: '🔁', title: 'Recursion: factorials', tag: 'Advanced', desc: 'A “factorial” My Block that calls itself. Prints 1! to 10! in the Output tab.',
      build: () => ({
        sprites: [claude('purple', { blocks: ws(['n', 'result', 'k'],
          fn('factorial', ['n'],
            b('cb_if_else', { COND: R(cmp('LTE', vr('n'), N(1))), DO: DO(setVar('result', N(1))),
              ELSE: DO(setVar('result', R(math('MULTIPLY', vr('n'), call('factorial', ['n'], [R(math('MINUS', vr('n'), N(1)))]))))) }),
            vr('result')),
          at(20, 260, flag(), setVar('k', N(1)), say(T('Factorials! Look in the Output tab.'), 2),
            b('cb_repeat', { N: N(10), DO: DO(
              b('cb_print', { T: R(join(vr('k'), R(join(T('! = '), call('factorial', ['n'], [vr('k')]))))) }),
              changeVar('k', 1)) }),
            say(R(join(T('10! = '), call('factorial', ['n'], [N(10)]))), 4))) })],
      }),
    },
    {
      id: 'primes', icon: '🔢', title: 'Prime finder', tag: 'Advanced', desc: 'An “is prime?” My Block with a loop inside, used to collect every prime number up to 100 in a list.',
      build: () => ({
        sprites: [claude('green', { blocks: ws(['n', 'd', 'prime', 'x', 'primes'],
          fn('is prime', ['n'], chain(
            setVar('prime', R(cmp('GT', vr('n'), N(1)))), setVar('d', N(2)),
            b('cb_repeat_until', { COND: R(b('logic_operation', { A: R(cmp('GT', R(math('MULTIPLY', vr('d'), vr('d'))), vr('n'))), B: R(b('logic_negate', { BOOL: vr('prime') })) }, { OP: 'OR' })), DO: DO(
              b('cb_if', { COND: R(cmp('EQ', R(b('math_modulo', { DIVIDEND: vr('n'), DIVISOR: vr('d') })), N(0))), DO: DO(setVar('prime', R(b('logic_boolean', {}, { BOOL: 'FALSE' })))) }),
              changeVar('d', 1)) })), vr('prime')),
          at(20, 300, flag(), setVar('primes', R(L.make([]))), setVar('x', N(1)), say(T('Hunting for primes…')),
            b('cb_repeat', { N: N(100), DO: DO(
              b('cb_if', { COND: call('is prime', ['n'], [vr('x')]), DO: DO(L.push(vr('primes'), vr('x'))) }),
              changeVar('x', 1)) }),
            b('cb_print', { T: R(join(T('Primes: '), L.join(vr('primes'), ', '))) }),
            say(R(join(T('I found '), R(join(L.length(vr('primes')), T(' primes up to 100! (see Output)'))))), 4))) })],
      }),
    },
    {
      id: 'platformer', icon: '🦘', title: 'Platformer physics', tag: 'Advanced', desc: 'Gravity and velocity: ← → to run, SPACE to jump. The y speed changes every frame, just like real games.',
      build: () => ({
        stageColor: '#bfe3ff',
        sprites: [
          { name: 'Ground', y: -160, costumes: [rect('ground', 480, 40, '#5aa84f')] },
          claude('orange', { y: 0, blocks: ws(['vy', 'ground'],
            at(20, 20, flag(), b('cb_goto_xy', { X: N(0), Y: N(60) }), setVar('vy', N(0)), setVar('ground', N(-118)),
              say(T('← → to run, SPACE to jump!'), 2),
              b('cb_forever', { DO: DO(
                changeVar('vy', -1),
                b('cb_change_y', { N: vr('vy') }),
                b('cb_if', { COND: R(cmp('LT', R(b('cb_ypos')), vr('ground'))), DO: DO(b('cb_set_y', { N: vr('ground') }), setVar('vy', N(0))) }),
                b('cb_if', { COND: R(b('logic_operation', { A: R(key$('space')), B: R(cmp('EQ', R(b('cb_ypos')), vr('ground'))) }, { OP: 'AND' })), DO: DO(setVar('vy', N(16)), b('cb_play_note', { N: N(76), S: N(0.05) })) }),
                b('cb_if', { COND: R(key$('right arrow')), DO: DO(b('cb_point', { N: N(90) }), b('cb_move', { N: N(5) }), b('cb_next_costume')) }),
                b('cb_if', { COND: R(key$('left arrow')), DO: DO(b('cb_point', { N: N(-90) }), b('cb_move', { N: N(5) }), b('cb_next_costume')) }),
                b('cb_bounce')) }))) }),
        ],
      }),
    },
    {
      id: 'cipher', icon: '🔐', title: 'Secret code (Caesar cipher)', tag: 'Advanced', desc: 'Type a message and Claude shifts every letter 3 places — a real encryption trick, letter by letter.',
      build: () => {
        const abc = () => T('abcdefghijklmnopqrstuvwxyz');
        return {
          sprites: [claude('gold', { blocks: ws(['msg', 'secret', 'i', 'letter', 'pos'],
            at(20, 20, flag(), b('cb_ask', { Q: T('Type a secret message:') }),
              setVar('msg', R(b('text_changeCase', { TEXT: R(b('cb_answer')) }, { CASE: 'LOWERCASE' }))), setVar('secret', T('')), setVar('i', N(1)),
              b('cb_repeat', { N: R(b('text_length', { VALUE: vr('msg') })), DO: DO(
                setVar('letter', R(b('text_charAt', { VALUE: vr('msg'), AT: vr('i') }, { WHERE: 'FROM_START' }))),
                setVar('pos', R(b('text_indexOf', { VALUE: abc(), FIND: vr('letter') }, { END: 'FIRST' }))),
                b('cb_if_else', { COND: R(cmp('EQ', vr('pos'), N(0))),
                  DO: DO(setVar('secret', R(join(vr('secret'), vr('letter'))))),
                  ELSE: DO(setVar('secret', R(join(vr('secret'), R(b('text_charAt', { VALUE: abc(), AT: R(math('ADD', R(b('math_modulo', { DIVIDEND: R(math('ADD', vr('pos'), N(2))), DIVISOR: N(26) })), N(1))) }, { WHERE: 'FROM_START' })))))) }),
                changeVar('i', 1)) }),
              b('cb_think', { T: T('Encrypting…') }), b('cb_wait', { N: N(1) }),
              say(R(join(T('Secret code: '), vr('secret'))), 6))) })],
        };
      },
    },
    {
      id: 'memory', icon: '🧠', title: 'Memory game', tag: 'Advanced', desc: 'Like Simon: remember a growing list of numbers and notes. Each level adds one more — how far can you go?',
      build: () => ({
        sprites: [claude('pink', { blocks: ws(['sequence', 'level', 'i', 'playing'],
          at(20, 20, flag(), setVar('sequence', R(L.make([]))), setVar('level', N(1)), setVar('playing', R(b('logic_boolean', {}, { BOOL: 'TRUE' }))),
            say(T('Watch, listen and remember!'), 2),
            b('cb_repeat_until', { COND: R(b('logic_negate', { BOOL: vr('playing') })), DO: DO(
              L.push(vr('sequence'), R(rnd(1, 4))), setVar('i', N(1)),
              b('cb_repeat', { N: L.length(vr('sequence')), DO: DO(
                say(L.get(vr('sequence'), vr('i'))), b('cb_play_note', { N: R(math('ADD', N(58), R(math('MULTIPLY', L.get(vr('sequence'), vr('i')), N(3))))), S: N(0.5) }),
                say(T('')), b('cb_wait', { N: N(0.15) }), changeVar('i', 1)) }),
              b('cb_ask', { Q: R(join(T('Level '), R(join(vr('level'), T(': type the numbers (like 1324)'))))) }),
              b('cb_if_else', { COND: R(cmp('EQ', R(b('cb_answer')), L.join(vr('sequence'), ''))),
                DO: DO(b('cb_play_anim', { N: N(1) }, { A: 'happy' }), changeVar('level', 1)),
                ELSE: DO(setVar('playing', R(b('logic_boolean', {}, { BOOL: 'FALSE' })))) })) }),
            b('cb_play_anim', { N: N(1) }, { A: 'shake' }),
            say(R(join(T('Game over! It was '), R(join(L.join(vr('sequence'), ''), R(join(T(' — you reached level '), vr('level'))))))), 5))) })],
      }),
    },
    {
      id: 'grades', icon: '📊', title: 'Grade calculator', tag: 'Advanced', desc: 'Enter 5 scores into a list, then a loop works out the total, average and best score.',
      build: () => ({
        sprites: [claude('blue', { blocks: ws(['scores', 'total', 'best', 'i'],
          at(20, 20, flag(), setVar('scores', R(L.make([]))),
            b('cb_repeat', { N: N(5), DO: DO(b('cb_ask', { Q: R(join(T('Score #'), R(math('ADD', L.length(vr('scores')), N(1))))) }), L.push(vr('scores'), R(math('MULTIPLY', R(b('cb_answer')), N(1))))) }),   // × 1 turns the typed text into a number
            setVar('total', N(0)), setVar('best', N(0)), setVar('i', N(1)),
            b('cb_repeat', { N: L.length(vr('scores')), DO: DO(
              setVar('total', R(math('ADD', vr('total'), L.get(vr('scores'), vr('i'))))),
              b('cb_if', { COND: R(cmp('GT', L.get(vr('scores'), vr('i')), vr('best'))), DO: DO(setVar('best', L.get(vr('scores'), vr('i')))) }),
              changeVar('i', 1)) }),
            b('cb_print', { T: R(join(T('Scores: '), L.join(vr('scores'), ', '))) }),
            say(R(join(T('Total '), R(join(vr('total'), R(join(T(', average '), R(join(R(b('math_round', { NUM: R(math('DIVIDE', vr('total'), L.length(vr('scores')))) }, { OP: 'ROUND' })), R(join(T(', best '), vr('best'))))))))))), 6))) })],
      }),
    },
    {
      id: 'python-tables', icon: '✖️', title: 'Python: times tables', tag: 'Code', desc: 'Print a times table and a quiz in Python. Opens the Python editor.', view: ['editor', 'python'],
      build: () => ({
        sprites: [claude('blue', { blocks: null })],
        python: `# Times tables!  Click "▶ Run in browser".
number = 7

for i in range(1, 11):
    print(f"{i:2} x {number} = {i * number}")

# Change "number" above, or turn this into a quiz:
answer = int(input(f"What is 6 x {number}? "))
print("Correct! 🎉" if answer == 6 * number else f"Not quite — it's {6 * number}.")
`,
      }),
    },
    {
      id: 'python', icon: '🐍', title: 'Python: guess the number', tag: 'Code', desc: 'A text-code game in Python. Opens the Python editor.', view: ['editor', 'python'],
      build: () => ({
        sprites: [claude('green', { blocks: null })],
        python: `# Guess the number!  Click "▶ Run in browser".
import random

secret = random.randint(1, 20)
print("I'm thinking of a number from 1 to 20...")

for turn in range(1, 6):
    guess = int(input(f"Guess #{turn}: "))
    if guess == secret:
        print(f"🎉 Yes! It was {secret}. You got it in {turn} tries!")
        break
    elif guess < secret:
        print("Too low!")
    else:
        print("Too high!")
else:
    print(f"Out of tries — the number was {secret}.")
`,
      }),
    },
    {
      id: 'html', icon: '🌐', title: 'HTML: my web page', tag: 'Code', desc: 'A personal web page with HTML, CSS and a button. Opens the HTML editor.', view: ['editor', 'html'],
      build: () => ({
        sprites: [claude('pink', { blocks: null })],
        html: `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; background: linear-gradient(#fdf3ef, #f4f3ee); text-align: center; padding: 40px; color: #1f1e1d; }
    .card { background: white; max-width: 420px; margin: auto; padding: 24px; border-radius: 18px; box-shadow: 0 6px 24px rgba(0,0,0,.08); }
    h1 { color: #d97757; margin-top: 0; }
    button { font-size: 18px; padding: 8px 20px; border-radius: 999px; border: 0; background: #d97757; color: white; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hi, I'm ____! 👋</h1>
    <p>I like coding, drawing and <b>Raspberry Pi</b>.</p>
    <p>My favourite colour is <span id="fav">orange</span>.</p>
    <button onclick="changeColour()">Surprise me!</button>
  </div>
  <script>
    const colours = ['red', 'blue', 'green', 'purple', 'gold', 'orange'];
    function changeColour() {
      const c = colours[Math.floor(Math.random() * colours.length)];
      document.getElementById('fav').textContent = c;
      document.querySelector('h1').style.color = c;
    }
  </script>
</body>
</html>
`,
      }),
    },
  ];

  // ---------- gallery ----------
  const TAGS = ['All', 'Start', 'Games', 'Animation', 'Advanced', 'AI', '3D & apps', 'Raspberry Pi', 'Code'];
  let filter = 'All';
  function render() {
    const tags = $('#tplTags'), grid = $('#tplList');
    tags.textContent = '';
    for (const t of TAGS) {
      const chip = document.createElement('button');
      chip.type = 'button'; chip.className = 'chip' + (t === filter ? ' active' : ''); chip.textContent = t;
      chip.onclick = () => { filter = t; render(); };
      tags.appendChild(chip);
    }
    grid.textContent = '';
    for (const tpl of TEMPLATES.filter(t => filter === 'All' || t.tag === filter)) {
      const card = document.createElement('button');
      card.type = 'button'; card.className = 'tpl-card';
      const icon = document.createElement('span'); icon.className = 'tpl-icon'; icon.textContent = tpl.icon;
      const title = document.createElement('b'); title.textContent = tpl.title;
      const desc = document.createElement('small'); desc.textContent = tpl.desc;
      const tag = document.createElement('span'); tag.className = 'tpl-tag'; tag.textContent = tpl.tag;
      card.append(icon, title, desc, tag);
      card.onclick = () => use(tpl);
      grid.appendChild(card);
    }
  }
  async function use(tpl) {
    $('#tplDialog').close();
    if (!(await CB.confirm(`Open the “${tpl.title}” template? It replaces your current project — 💾 Save first if you want to keep it.`, 'Open template'))) return;
    const built = tpl.build();
    CB.loadProject({
      name: tpl.id === 'blank' ? 'My Project' : tpl.title, stageColor: '#ffffff', current: 0, python: null, html: null, piParts: null,
      extensions: tpl.extensions || [], ...built,
    });
    CB.scheduleSave();
    if (tpl.view) { CB.showView(tpl.view[0]); CB.editor.show(tpl.view[1]); }
    else if ((tpl.extensions || []).includes('pi')) CB.showPanel('pi');
    else CB.showView('blocks');
    if (tpl.after) tpl.after();
    CB.log(`📋 Opened the “${tpl.title}” template. Press ⚑ Go to try it!`, 'ok');
  }
  function open() { render(); $('#tplDialog').showModal(); }
  $('#templatesBtn').onclick = open;
  $('#newBtn').onclick = open;

  CB.templates = { open, list: TEMPLATES };
})();
