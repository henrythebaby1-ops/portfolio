/* Claude Blocks "Learn": step-by-step coding lessons shown in a floating guide card. */
(() => {
  const CB = window.CB;
  const $ = s => document.querySelector(s);
  // Step helpers: `cat` opens a block category, `ext` adds an extension, `go` runs any setup.
  const cat = name => ({ label: `Open ${name} blocks`, run: () => CB.openCategory(name) });
  const ext = id => ({ label: `Add ${CB.EXTENSIONS[id].name}`, run: () => CB.addExtension(id) });
  const go = (label, run) => ({ label, run });
  const b = t => `<span class="blk">${t}</span>`;

  const LESSONS = [
    {
      title: 'Hello, Claude!', level: 'Start here', icon: '👋',
      steps: [
        { text: 'Welcome! Code here is made of <b>blocks</b> that snap together like puzzle pieces. The orange creature on the stage is your sprite, <b>Claude</b>.' },
        { text: `Open <b>Events</b> and drag ${b('when ⚑ clicked')} into the big workspace. Scripts always start with a hat block like this.`, action: cat('Events') },
        { text: `Open <b>Looks</b> and snap ${b('say Hello! for 2 seconds')} under the hat block. Click the white text to change what Claude says.`, action: cat('Looks') },
        { text: 'Click the green <b>⚑ Go</b> button at the top. Claude talks! 🎉 Tip: you can also click any script to run it.' },
      ],
    },
    {
      title: 'Move & animate', level: 'Beginner', icon: '🏃',
      steps: [
        { text: `Start a new script with ${b('when ⚑ clicked')}.`, action: cat('Events') },
        { text: `From <b>Control</b>, add a ${b('forever')} loop. Everything inside repeats again and again.`, action: cat('Control') },
        { text: `Inside the loop, add ${b('move 10 steps')} and ${b('if on edge, bounce')} from <b>Motion</b>.`, action: cat('Motion') },
        { text: `Add ${b('next costume')} from <b>Looks</b> and ${b('wait 0.1 seconds')} from Control. Claude has two costumes, so switching makes his legs walk!` },
        { text: 'Press <b>⚑ Go</b>. Press <b>⏹</b> to stop. Try changing the numbers to make Claude faster or slower.' },
      ],
    },
    {
      title: 'Animate Claude', level: 'Beginner', icon: '💃',
      steps: [
        { text: `Claude knows moves! Open <b>Looks</b> and drag ${b('play animation walk 1 times')} under a ${b('when ⚑ clicked')} block.`, action: cat('Looks') },
        { text: 'Click the dropdown and try <b>jump</b>, <b>wave</b>, <b>happy</b>, <b>dance</b> or <b>spin</b>. Change 1 to 3 to repeat it.' },
        { text: `${b('start animation dance')} keeps dancing while other blocks run. Use ${b('stop animation')} to stop.` },
        { text: 'Watch closely: Claude blinks on his own when he is resting. Turn it off with <b>turn auto-blink off</b>.' },
      ],
    },
    {
      title: 'Keyboard control', level: 'Beginner', icon: '⌨️',
      steps: [
        { text: `Drag ${b('when space key pressed')} from <b>Events</b> and change the dropdown to <b>right arrow</b>.`, action: cat('Events') },
        { text: `Under it, add ${b('point in direction 90')} and ${b('move 10 steps')}.`, action: cat('Motion') },
        { text: `Make another script for <b>left arrow</b> with ${b('point in direction -90')} and ${b('move 10 steps')}.` },
        { text: 'Click the stage, then press the arrow keys. Claude walks both ways! Add up/down arrows with <b>change y by</b> 10 and -10.' },
      ],
    },
    {
      title: 'Talk & remember', level: 'Beginner', icon: '💬',
      steps: [
        { text: `Open <b>Sensing</b> and use ${b("ask What's your name? and wait")} after a ${b('when ⚑ clicked')} block.`, action: cat('Sensing') },
        { text: `Add ${b('say … for 2 seconds')}, then put ${b('join apple banana')} from <b>Operators</b> inside it. Make the first part "Hi " and drop ${b('answer')} into the second.`, action: cat('Operators') },
        { text: `<b>Variables</b> remember things. Open Variables, click <b>Create variable</b> and call it <code>name</code>. Use ${b('set name to answer')} to save the answer.`, action: cat('Variables') },
        { text: 'Run it! Type your name into the box on the stage and press Enter.' },
      ],
    },
    {
      title: 'Make a catch game', level: 'Intermediate', icon: '🍎',
      steps: [
        { text: 'Go to the <b>Sprites</b> tab and click <b>＋ Add sprite</b>. Pick the 🍎 Apple.', action: go('Open Sprites tab', () => CB.showPanel('sprites')) },
        { text: `With the Apple selected: ${b('when ⚑ clicked')} → ${b('forever')} → ${b('go to random position')} → ${b('wait 2 seconds')}. The apple jumps around.` },
        { text: `Select Claude. Make a variable <code>score</code>. Add ${b('when ⚑ clicked')} → ${b('set score to 0')} → ${b('forever')} with ${b('go to mouse-pointer')} inside.`, action: cat('Variables') },
        { text: `Inside the forever, add ${b('if touching Apple? then')} → ${b('change score by 1')} → ${b('play note 72')} → ${b('say score')} → ${b('wait 0.5 seconds')}.`, action: cat('Sensing') },
        { text: 'Play! Move your mouse to catch the apple. Can you add a timer and stop the game after 30 seconds?' },
      ],
    },
    {
      title: 'Messages between sprites', level: 'Intermediate', icon: '📣',
      steps: [
        { text: `Sprites can talk with <b>broadcasts</b>. In Claude, add ${b('when ⚑ clicked')} → ${b('say Ready? for 1 seconds')} → ${b('broadcast message1')}.`, action: cat('Events') },
        { text: `Add a second sprite (like ⭐ Star). Give it ${b('when I receive message1')} → ${b('repeat 10')} with ${b('turn ↻ 36 degrees')} and ${b('change size by 5')} inside.` },
        { text: 'Press Go. When Claude broadcasts, the Star hears it and spins. Rename the message to something like <code>party</code> in both blocks!' },
      ],
    },
    {
      title: 'Make your own blocks', level: 'Intermediate', icon: '🧱',
      steps: [
        { text: 'Open <b>My Blocks</b> and drag out <b>to do something</b>. Rename it to <code>draw square</code>. This is a <b>function</b> — a block you invent!', action: cat('My Blocks') },
        { text: `Inside it, put ${b('repeat 4')} with ${b('move 60 steps')}, ${b('turn ↻ 90 degrees')} and ${b('wait 0.2 seconds')}.` },
        { text: `Now <b>My Blocks</b> has a new ${b('draw square')} block. Use it in a ${b('when ⚑ clicked')} script, as many times as you like.` },
      ],
    },
    {
      title: '3D worlds with Three.js', level: 'Extension', icon: '🧊',
      steps: [
        { text: 'Three.js draws real 3D graphics. First, add the extension.', action: ext('three') },
        { text: `Use ${b('when ⚑ clicked')} → ${b('start 3D scene with sky')} → ${b('add 3D cube named box…')}. Try the <b>Claude</b> shape from the dropdown for a 3D Claude!`, action: cat('Three.js 3D') },
        { text: `Add a ${b('forever')} loop with ${b('change box rotation by x 0 y 2 z 0')} inside. Press Go — it spins in 3D!` },
        { text: `Add ${b('add 3D floor')} at y -1 and try ${b('move camera to')} to look from different places.` },
      ],
    },
    {
      title: 'Build an app with React', level: 'Extension', icon: '⚛️',
      steps: [
        { text: 'React is how many real websites build their screens. Add the extension.', action: ext('react') },
        { text: `Drag out ${b('React app')} (it already has a heading inside) under a ${b('when ⚑ clicked')} block.`, action: cat('React UI') },
        { text: `Make a variable <code>clicks</code>. Inside React app add ${b('text')} showing <code>clicks</code>, then a ${b('button Click me')} whose <b>when clicked</b> part has ${b('change clicks by 1')}.` },
        { text: `Try ${b('text box … saves to typed')} and a ${b('card')} to group things. Your app appears on top of the stage!` },
      ],
    },
    {
      title: 'Raspberry Pi: LEDs, servo & LCD', level: 'Extension', icon: '🍓',
      steps: [
        { text: 'No Raspberry Pi? No problem! The <b>🍓 Pi 5</b> tab has a built-in <b>Emulator</b> with LEDs, a button, a servo, an LCD screen, a fan and sensors.', action: go('Open the Pi emulator', () => { CB.showPanel('pi'); document.querySelector('.seg-btn[data-mode="emulator"]').click(); }) },
        { text: 'Add the Raspberry Pi extension to get the Pi blocks.', action: ext('pi') },
        { text: `Blink! ${b('when ⚑ clicked')} → ${b('repeat 10')} → ${b('set GPIO pin 17 to high')} → ${b('wait 0.5')} → ${b('set GPIO pin 17 to low')} → ${b('wait 0.5')}. Watch the red LED. 💡`, action: cat('Raspberry Pi') },
        { text: `Try ${b('LCD show Hello, Pi! on line 1')} and ${b('set servo on pin 18 to 180 degrees')}. Drag the <b>CPU load</b> slider up and watch the active cooler spin faster.` },
        { text: `Sensors: ${b('if button on pin 16 pressed? then')} → ${b('play buzzer…')}. Hold the red button in the emulator to test it.` },
        { text: 'Got a real Raspberry Pi 5? Run <code>python3 pi-bridge.py</code> on it, switch the tab to <b>🍓 Real Pi</b> and connect. The same blocks control real parts!' },
      ],
    },
    {
      title: 'Ask the AI', level: 'Extension', icon: '✳️',
      steps: [
        { text: 'Install <b>Ollama</b> from ollama.com, then in Terminal run <code>ollama pull llama3.2</code> to download a free local AI model.' },
        { text: 'Open the <b>AI Assistant</b> tab and ask it anything about your project — it can see your blocks.', action: go('Open AI Assistant', () => CB.showPanel('ai')) },
        { text: 'Add the AI extension so your sprites can use AI too.', action: ext('ai') },
        { text: `Try ${b('ask What is your name? and wait')} → ${b('say (ask AI (join "Write a short poem about " answer))')}.`, action: cat('AI') },
      ],
    },
    {
      title: 'Python basics', level: 'Text code', icon: '🐍',
      steps: [
        { text: 'Python is a text programming language. Open the Python editor.', action: go('Open Python editor', () => { CB.showView('editor'); CB.editor.show('python'); }) },
        { text: '<code>print("Hi")</code> shows text. <code>x = 5</code> makes a variable. <code>for i in range(3):</code> repeats — just like the <b>repeat</b> block! Indented lines are inside the loop.' },
        { text: 'Click <b>Run in browser</b>. Change the code and run it again. With a Pi connected, <b>Run on Pi</b> can control real GPIO pins with <code>gpiozero</code>.' },
      ],
    },
    {
      title: 'HTML & CSS web pages', level: 'Text code', icon: '🌐',
      steps: [
        { text: 'Every website is made of HTML (the content) and CSS (the style). Open the HTML editor.', action: go('Open HTML editor', () => { CB.showView('editor'); CB.editor.show('html'); }) },
        { text: 'Tags like <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> are the content. The <code>&lt;style&gt;</code> part is CSS. Change the color of <code>h1</code>, then click <b>▶ Run</b>.' },
        { text: 'Add your own <code>&lt;p&gt;</code> paragraph or an <code>&lt;img src="…"&gt;</code>. Click <b>Download</b> to save your page.' },
      ],
    },
    {
      title: 'Turn blocks into a website', level: 'Text code', icon: '🚀',
      steps: [
        { text: 'Claude Blocks can convert your whole project into real <b>HTML, CSS and JavaScript</b>.', action: go('Convert my blocks', () => CB.editor.showGenerated()) },
        { text: 'Look at the <b>JS</b> tab: your scripts are near the bottom. Each block became a line like <code>api.move(10);</code>.' },
        { text: 'Click <b>Download single .html</b> — you get one file that runs your project in any browser. Share it with friends!' },
      ],
    },
  ];

  const card = $('#learnCard');
  let lesson = null, step = 0;
  const done = new Set(CB.store.get('cb-learn-done', []));

  function openPicker() {
    const list = $('#lessonList');
    list.textContent = '';
    LESSONS.filter(l => !(window.CB_EDITION === 'web' && l.title === 'Turn blocks into a website')).forEach((l, i) => {
      const btn = document.createElement('button');
      btn.className = 'lesson' + (done.has(l.title) ? ' done' : '');
      btn.innerHTML = `<span class="lesson-icon">${l.icon}</span><span class="lesson-text"><b>${i + 1}. ${l.title}</b><small>${l.level} · ${l.steps.length} steps${done.has(l.title) ? ' · ✓ done' : ''}</small></span>`;
      btn.onclick = () => { $('#learnDialog').close(); start(LESSONS.indexOf(l)); };
      list.appendChild(btn);
    });
    $('#learnDialog').showModal();
  }

  function start(i) { lesson = LESSONS[i]; step = 0; CB.showView('blocks'); render(); card.hidden = false; }
  function render() {
    const s = lesson.steps[step];
    $('#learnTitle').textContent = `${lesson.icon} ${lesson.title}`;
    $('#learnStep').textContent = `Step ${step + 1} of ${lesson.steps.length}`;
    $('#learnText').innerHTML = s.text;
    $('#learnProgress').style.width = ((step + 1) / lesson.steps.length) * 100 + '%';
    const act = $('#learnAction');
    act.hidden = !s.action;
    if (s.action) { act.textContent = s.action.label; act.onclick = s.action.run; }
    $('#learnBack').disabled = step === 0;
    $('#learnNext').textContent = step === lesson.steps.length - 1 ? 'Finish ✓' : 'Next →';
  }
  $('#learnBack').onclick = () => { if (step > 0) { step--; render(); } };
  $('#learnNext').onclick = () => {
    if (step < lesson.steps.length - 1) { step++; render(); return; }
    done.add(lesson.title); CB.store.set('cb-learn-done', [...done]);
    card.hidden = true;
    CB.log(`🎓 You finished "${lesson.title}"! Click Learn for the next lesson.`, 'ok');
  };
  $('#learnClose').onclick = () => { card.hidden = true; };
  $('#learnAll').onclick = openPicker;
  $('#learnBtn').onclick = openPicker;
})();
