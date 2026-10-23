/* Claude Blocks extensions: Raspberry Pi 5, Three.js, React and AI (Ollama). */
(() => {
  const CB = window.CB;
  const { I, DD, TX, S, stack, reporter, bool, cblock } = CB.defs;
  const { v, q, f, body, ATOMIC } = CB.gen;
  const g = javascript.javascriptGenerator.forBlock;

  const loaded = {};
  CB.loadScript = url => loaded[url] || (loaded[url] = new Promise((res, rej) => {
    const el = document.createElement('script');
    el.src = window.CB_ASSET ? window.CB_ASSET(url) : url; el.onload = res;
    el.onerror = () => { delete loaded[url]; el.remove(); rej(new Error('Could not load ' + url + ' — are you online?')); };
    document.head.appendChild(el);
  }));
  CB.loadExtension = async id => { for (const u of CB.EXTENSIONS[id].scripts) await CB.loadScript(u); };

  const PI = '#C51A4A', THREE_C = '#1E88E5', REACT = '#149ECA', AI = '#D97757';

  Blockly.defineBlocksWithJsonArray([
    // Raspberry Pi
    stack('pi_gpio_write', PI, 'set GPIO pin %1 to %2', [I('PIN'), DD('STATE', [['high (on)', 'true'], ['low (off)', 'false']])]),
    bool('pi_gpio_read', PI, 'GPIO pin %1 is high?', [I('PIN')]),
    bool('pi_button', PI, 'button on pin %1 pressed?', [I('PIN')]),
    stack('pi_pwm', PI, 'set PWM pin %1 to %2 %%', [I('PIN'), I('DUTY')]),
    stack('pi_run', PI, 'run %1 on Pi', [I('CMD')]),
    reporter('pi_output', PI, 'output of %1 on Pi', [I('CMD')]),
    reporter('pi_temp', PI, 'Pi CPU temperature °C'),
    stack('pi_servo', PI, 'set servo on pin %1 to %2 degrees', [I('PIN'), I('ANGLE')]),
    stack('pi_lcd', PI, 'LCD show %1 on line %2', [I('TEXT'), DD('LINE', ['1', '2'])]),
    stack('pi_lcd_clear', PI, 'LCD clear'),
    stack('pi_lcd_light', PI, 'LCD backlight %1', [DD('ON', [['on', 'true'], ['off', 'false']])]),
    stack('pi_fan', PI, 'set active cooler fan to %1', [DD('MODE', ['auto', 'off', 'low', 'medium', 'high', 'full'])]),
    reporter('pi_fan_speed', PI, 'fan speed %%'),
    stack('pi_buzzer', PI, 'play buzzer on pin %1 note %2 for %3 seconds', [I('PIN'), I('NOTE'), I('SECS')]),
    stack('pi_rgb', PI, 'set RGB LED to %1', [I('COLOR')]),
    reporter('pi_pot', PI, 'potentiometer value'),
    reporter('pi_distance', PI, 'distance sensor (cm)'),
    bool('pi_motion', PI, 'motion detected?'),
    reporter('pi_sensor', PI, '%1', [DD('S', [['room temperature °C', 'temperature'], ['humidity %', 'humidity'], ['light level', 'light'], ['joystick x', 'joyx'], ['joystick y', 'joyy']])]),
    stack('pi_traffic', PI, 'set traffic light to %1', [DD('L', [['red', 'red'], ['amber', 'amber'], ['green', 'green'], ['all on', 'all'], ['off', 'off']])]),
    stack('pi_bargraph', PI, 'set LED bar graph to %1 %%', [I('V')]),
    stack('pi_motor', PI, 'motor %1 at %2 %% speed', [DD('DIR', ['forward', 'backward', 'stop']), I('SPEED')]),
    stack('pi_neo_set', PI, 'set NeoPixel %1 to %2', [I('N'), I('COLOR')]),
    stack('pi_neo_fill', PI, 'fill NeoPixels with %1', [I('COLOR')]),
    stack('pi_neo_clear', PI, 'clear NeoPixels'),
    stack('pi_segment', PI, 'show %1 on 4-digit display', [I('TEXT')]),
    stack('pi_oled', PI, 'OLED show %1 on line %2', [I('TEXT'), DD('LINE', ['1', '2', '3', '4'])]),
    stack('pi_oled_clear', PI, 'OLED clear'),
    // Three.js
    stack('three_start', THREE_C, 'start 3D scene with sky %1', [I('COLOR')]),
    stack('three_add', THREE_C, 'add 3D %1 named %2 color %3 at x %4 y %5 z %6', [
      DD('SHAPE', [['cube', 'cube'], ['sphere', 'sphere'], ['cone', 'cone'], ['cylinder', 'cylinder'], ['donut', 'torus'], ['pyramid', 'pyramid'], ['gem', 'gem'], ['twisty knot', 'knot'],
        ['star', 'star'], ['heart', 'heart'], ['coin', 'coin'], ['ring', 'ring'], ['floor', 'plane'], ['Claude', 'claude'], ['tree', 'tree'], ['house', 'house'], ['car', 'car'],
        ['rocket', 'rocket'], ['snowman', 'snowman'], ['robot', 'robot'], ['apple', 'apple'], ['cloud', 'cloud']]),
      I('NAME'), I('COLOR'), I('X'), I('Y'), I('Z')]),
    stack('three_set', THREE_C, 'set %1 %2 to x %3 y %4 z %5', [I('NAME'), DD('PROP', ['position', 'rotation', 'scale']), I('X'), I('Y'), I('Z')]),
    stack('three_change', THREE_C, 'change %1 %2 by x %3 y %4 z %5', [I('NAME'), DD('PROP', ['rotation', 'position', 'scale']), I('X'), I('Y'), I('Z')]),
    stack('three_color', THREE_C, 'set %1 color to %2', [I('NAME'), I('COLOR')]),
    stack('three_camera', THREE_C, 'move camera to x %1 y %2 z %3', [I('X'), I('Y'), I('Z')]),
    reporter('three_get', THREE_C, '%1 of %2', [DD('WHICH', ['x position', 'y position', 'z position', 'x rotation', 'y rotation', 'z rotation']), I('NAME')]),
    stack('three_remove', THREE_C, 'remove 3D object %1', [I('NAME')]),
    stack('three_close', THREE_C, 'close 3D scene'),
    // React
    cblock('react_app', REACT, 'React app', [], '%1'),
    stack('react_heading', REACT, '%1 %2', [DD('LEVEL', [['big heading', 'h1'], ['heading', 'h2'], ['small heading', 'h3']]), I('TEXT')]),
    stack('react_text', REACT, 'text %1', [I('TEXT')]),
    {
      type: 'react_button', colour: REACT, inputsInline: true, previousStatement: null, nextStatement: null,
      message0: 'button %1', args0: [I('LABEL')], message1: 'when clicked %1', args1: [S('DO')],
    },
    stack('react_input', REACT, 'text box %1 saves to %2', [I('PLACEHOLDER'), { type: 'field_variable', name: 'VAR', variable: 'typed' }]),
    stack('react_image', REACT, 'image %1 width %2', [I('URL'), I('W')]),
    cblock('react_row', REACT, 'row (side by side)', [], '%1'),
    cblock('react_column', REACT, 'column (stacked)', [], '%1'),
    cblock('react_card', REACT, 'card', [], '%1'),
    stack('react_clear', REACT, 'clear React UI'),
    // AI
    reporter('ai_ask', AI, 'ask AI %1', [I('P')]),
    stack('ai_send', AI, 'send %1 to AI chat', [I('P')]),
    reporter('ai_reply', AI, 'AI reply'),
    stack('ai_model', AI, 'use AI model %1', [TX('MODEL', 'llama3.2')]),
  ]);

  const st = (type, fn) => { g[type] = b => fn(b) + '\n'; };
  const rp = (type, fn) => { g[type] = b => [fn(b), ATOMIC]; };
  const xyz = b => `${v(b, 'X')}, ${v(b, 'Y')}, ${v(b, 'Z')}`;
  const name = b => v(b, 'NAME', "'box'");

  st('pi_gpio_write', b => `await api.pi.write(${v(b, 'PIN', '17')}, ${f(b, 'STATE')});`);
  rp('pi_gpio_read', b => `(await api.pi.read(${v(b, 'PIN', '17')}))`);
  rp('pi_button', b => `(await api.pi.pressed(${v(b, 'PIN', '16')}))`);
  st('pi_pwm', b => `await api.pi.pwm(${v(b, 'PIN', '18')}, ${v(b, 'DUTY', '50')});`);
  st('pi_run', b => `await api.pi.run(${v(b, 'CMD', "''")});`);
  rp('pi_output', b => `(await api.pi.run(${v(b, 'CMD', "''")}))`);
  rp('pi_temp', () => '(await api.pi.temp())');
  st('pi_servo', b => `await api.pi.servo(${v(b, 'PIN', '18')}, ${v(b, 'ANGLE', '90')});`);
  st('pi_lcd', b => `await api.pi.lcd(${f(b, 'LINE')}, ${v(b, 'TEXT', "''")});`);
  st('pi_lcd_clear', () => 'await api.pi.lcdClear();');
  st('pi_lcd_light', b => `await api.pi.lcdBacklight(${f(b, 'ON')});`);
  st('pi_fan', b => `await api.pi.fan(${q(f(b, 'MODE'))});`);
  rp('pi_fan_speed', () => '(await api.pi.fanSpeed())');
  st('pi_buzzer', b => `await api.pi.buzz(${v(b, 'PIN', '22')}, ${v(b, 'NOTE', '60')}, ${v(b, 'SECS', '0.5')});`);
  st('pi_rgb', b => `await api.pi.rgb(${v(b, 'COLOR', "'#ff0000'")});`);
  rp('pi_pot', () => '(await api.pi.pot())');
  rp('pi_distance', () => '(await api.pi.distance())');
  rp('pi_motion', () => '(await api.pi.motion())');
  rp('pi_sensor', b => `(await api.pi.sensor(${q(f(b, 'S'))}))`);
  st('pi_traffic', b => `await api.pi.traffic(${q(f(b, 'L'))});`);
  st('pi_bargraph', b => `await api.pi.bargraph(${v(b, 'V', '50')});`);
  st('pi_motor', b => `await api.pi.motor(${q(f(b, 'DIR'))}, ${v(b, 'SPEED', '50')});`);
  st('pi_neo_set', b => `await api.pi.neoSet(${v(b, 'N', '1')}, ${v(b, 'COLOR', "'#ff0000'")});`);
  st('pi_neo_fill', b => `await api.pi.neoFill(${v(b, 'COLOR', "'#ff0000'")});`);
  st('pi_neo_clear', () => 'await api.pi.neoClear();');
  st('pi_segment', b => `await api.pi.segment(${v(b, 'TEXT', "''")});`);
  st('pi_oled', b => `await api.pi.oled(${f(b, 'LINE')}, ${v(b, 'TEXT', "''")});`);
  st('pi_oled_clear', () => 'await api.pi.oledClear();');

  st('three_start', b => `api.three.start(${v(b, 'COLOR', "'#87ceeb'")});`);
  st('three_add', b => `api.three.add(${q(f(b, 'SHAPE'))}, ${name(b)}, ${v(b, 'COLOR', "'#ff7a59'")}, ${xyz(b)});`);
  st('three_set', b => `api.three.set(${name(b)}, ${q(f(b, 'PROP'))}, ${xyz(b)});`);
  st('three_change', b => `api.three.change(${name(b)}, ${q(f(b, 'PROP'))}, ${xyz(b)});`);
  st('three_color', b => `api.three.color(${name(b)}, ${v(b, 'COLOR', "'#ff7a59'")});`);
  st('three_camera', b => `api.three.camera(${xyz(b)});`);
  rp('three_get', b => `api.three.get(${name(b)}, ${q(f(b, 'WHICH'))})`);
  st('three_remove', b => `api.three.remove(${name(b)});`);
  st('three_close', () => 'api.three.close();');

  // React elements are collected into `__c` while the app renders; loop yields are removed
  // because rendering must finish in one go.
  const strip = code => code.replace(/^[ \t]*await api\.tick\(\);\n/gm, '');
  const kids = b => `...(() => {\n  const __c = [];\n${strip(body(b))}  return __c;\n})()`;
  const h = (...a) => `__c.push(api.react.h(${a.join(', ')}));`;
  st('react_app', b => `api.react.render(() => {\n  const __c = [];\n${strip(body(b))}  return __c;\n});`);
  st('react_heading', b => h(q(f(b, 'LEVEL')), 'null', `String(${v(b, 'TEXT', "''")})`));
  st('react_text', b => h("'p'", 'null', `String(${v(b, 'TEXT', "''")})`));
  st('react_button', b => h("'button'", `{ onClick: () => api.react.handle(async () => {\n${body(b)}}) }`, `String(${v(b, 'LABEL', "'Click me'")})`));
  st('react_input', b => {
    const name = javascript.javascriptGenerator.nameDB_.getName(f(b, 'VAR'), Blockly.Names.NameType.VARIABLE);
    return h("'input'", `{ value: ${name} == null ? '' : String(${name}), placeholder: String(${v(b, 'PLACEHOLDER', "''")}), onChange: e => { ${name} = e.target.value; api.react.refresh(); } }`);
  });
  st('react_image', b => h("'img'", `{ src: ${v(b, 'URL', "''")}, width: ${v(b, 'W', '120')}, alt: '' }`));
  st('react_row', b => h("'div'", "{ className: 'cb-row' }", kids(b)));
  st('react_column', b => h("'div'", "{ className: 'cb-col' }", kids(b)));
  st('react_card', b => h("'div'", "{ className: 'cb-card' }", kids(b)));
  st('react_clear', () => 'api.react.clear();');

  rp('ai_ask', b => `(await api.ai.ask(${v(b, 'P', "''")}))`);
  st('ai_send', b => `await api.ai.chat(${v(b, 'P', "''")});`);
  rp('ai_reply', () => 'api.ai.reply()');
  st('ai_model', b => `api.ai.setModel(${q(f(b, 'MODEL'))});`);

  CB.EXTENSIONS = {
    pi: {
      name: 'Raspberry Pi 5', icon: '🍓', color: PI, scripts: [],
      desc: 'LEDs, buttons, servos, an LCD screen, the active cooler, sensors and more. Works with the built-in Pi 5 emulator — no hardware needed — or your real Raspberry Pi.',
      toolbox: ({ N, T, C, blk, cat }) => {
        const label = text => ({ kind: 'label', text });
        return cat('Raspberry Pi', PI, [
          label('GPIO pins'),
          blk('pi_gpio_write', { PIN: N(17) }), blk('pi_gpio_read', { PIN: N(17) }), blk('pi_button', { PIN: N(16) }), blk('pi_pwm', { PIN: N(17), DUTY: N(50) }),
          label('Parts'),
          blk('pi_servo', { PIN: N(18), ANGLE: N(90) }), blk('pi_rgb', { COLOR: C('#ff7a59') }),
          blk('pi_buzzer', { PIN: N(22), NOTE: N(72), SECS: N(0.3) }),
          blk('pi_traffic'), blk('pi_bargraph', { V: N(75) }), blk('pi_motor', { SPEED: N(60) }),
          label('Screens & lights'),
          blk('pi_lcd', { TEXT: T('Hello, Pi!') }), blk('pi_lcd_clear'), blk('pi_lcd_light'),
          blk('pi_oled', { TEXT: T('Hi from OLED') }), blk('pi_oled_clear'),
          blk('pi_segment', { TEXT: T('1234') }),
          blk('pi_neo_set', { N: N(1), COLOR: C('#ff00ff') }), blk('pi_neo_fill', { COLOR: C('#00c8ff') }), blk('pi_neo_clear'),
          label('Sensors'),
          blk('pi_pot'), blk('pi_distance'), blk('pi_motion'), blk('pi_sensor'),
          label('Active cooler & system'),
          blk('pi_fan'), blk('pi_fan_speed'), blk('pi_temp'),
          blk('pi_run', { CMD: T('echo Hello from Claude Blocks') }), blk('pi_output', { CMD: T('hostname') }),
        ]);
      },
    },
    three: {
      name: 'Three.js 3D', icon: '🧊', color: THREE_C, scripts: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'],
      desc: 'Build 3D worlds with cubes, spheres, donuts and a 3D Claude. The 3D scene appears behind your sprites.',
      toolbox: ({ N, T, C, blk, cat }) => cat('Three.js 3D', THREE_C, [
        blk('three_start', { COLOR: C('#87ceeb') }),
        blk('three_add', { NAME: T('box'), COLOR: C('#ff7a59'), X: N(0), Y: N(0), Z: N(0) }),
        blk('three_change', { NAME: T('box'), X: N(0), Y: N(2), Z: N(0) }),
        blk('three_set', { NAME: T('box'), X: N(0), Y: N(1), Z: N(0) }),
        blk('three_color', { NAME: T('box'), COLOR: C('#4c97ff') }),
        blk('three_camera', { X: N(0), Y: N(2), Z: N(6) }),
        blk('three_get', { NAME: T('box') }), blk('three_remove', { NAME: T('box') }), blk('three_close'),
      ]),
    },
    react: {
      name: 'React UI', icon: '⚛️', color: REACT,
      scripts: ['https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'],
      desc: 'Make real app screens with React — headings, buttons, text boxes and cards — all from blocks.',
      toolbox: ({ N, T, blk, cat }) => cat('React UI', REACT, [
        blk('react_app', { DO: { block: { type: 'react_heading', inputs: { TEXT: T('Hello React!') } } } }),
        blk('react_heading', { TEXT: T('Hello!') }), blk('react_text', { TEXT: T('Some text') }),
        blk('react_button', { LABEL: T('Click me') }), blk('react_input', { PLACEHOLDER: T('Type here…') }),
        blk('react_image', { URL: T('https://picsum.photos/200'), W: N(120) }),
        blk('react_row'), blk('react_column'), blk('react_card'), blk('react_clear'),
      ]),
    },
    ai: {
      name: 'AI (Ollama)', icon: '✳️', color: AI, scripts: [],
      desc: 'Ask a local AI model questions from your scripts. Runs on your own computer with Ollama.',
      toolbox: ({ T, blk, cat }) => cat('AI', AI, [
        blk('ai_ask', { P: T('Tell me a fun fact about space in one sentence') }),
        blk('ai_send', { P: T('Give me an idea for a game') }), blk('ai_reply'),
        blk('cb_say', { T: { block: { type: 'ai_ask', inputs: { P: T('Say hi in five words') } } } }),
        blk('ai_model'),
      ]),
    },
  };
})();
