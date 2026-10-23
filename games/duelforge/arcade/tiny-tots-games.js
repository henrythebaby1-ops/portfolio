(function () {
  function r(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function sh(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function audioEngine() {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = null;
    function ensure() {
      if (!AC) { return false; }
      if (!ctx) { ctx = new AC(); }
      return true;
    }
    function beep(freq, dur, type, vol) {
      if (!ctx) { return; }
      var n = ctx.currentTime;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'triangle';
      o.frequency.setValueAtTime(freq, n);
      g.gain.setValueAtTime(0.0001, n);
      g.gain.exponentialRampToValueAtTime(vol || 0.07, n + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, n + dur);
      o.connect(g); g.connect(ctx.destination); o.start(n); o.stop(n + dur + 0.02);
    }
    function resume() { return ctx ? ctx.resume() : Promise.resolve(); }
    return { ensure: ensure, beep: beep, resume: resume };
  }

  function setupMusic(audio) {
    var btn = document.querySelector('[data-music-toggle]');
    var status = document.querySelector('[data-music-status]');
    if (!btn || !status) { return; }
    var on = false;
    var timer = null;
    var idx = 0;
    var seq = [523.25, 659.25, 783.99, 659.25, 587.33, 523.25];

    btn.addEventListener('click', function () {
      if (on) {
        on = false;
        if (timer) { clearInterval(timer); timer = null; }
        btn.textContent = 'Play Music';
        status.textContent = 'Music is paused.';
        return;
      }
      if (!audio.ensure()) { status.textContent = 'Audio not supported.'; return; }
      audio.resume().then(function () {
        on = true;
        idx = 0;
        btn.textContent = 'Pause Music';
        status.textContent = 'Playing gentle kid music.';
        if (timer) { clearInterval(timer); }
        timer = window.setInterval(function () {
          var f = seq[idx % seq.length];
          audio.beep(f, 0.18, 'triangle', 0.06);
          if (idx % 2 === 0) { audio.beep(f * 0.5, 0.22, 'sine', 0.03); }
          idx += 1;
        }, 280);
      });
    });
  }

  function setupColorTap(audio) {
    var start = document.querySelector('[data-color-start]');
    var targetEl = document.querySelector('[data-color-target]');
    var scoreEl = document.querySelector('[data-color-score]');
    var grid = document.querySelector('[data-color-grid]');
    if (!start || !targetEl || !scoreEl || !grid) { return; }

    var colors = [
      { name: 'Pink', value: '#ff9fd1' },
      { name: 'Blue', value: '#84d7ff' },
      { name: 'Yellow', value: '#ffd872' },
      { name: 'Green', value: '#9ef0b0' }
    ];
    var target = colors[0];
    var score = 0;

    function round() {
      target = colors[r(0, colors.length - 1)];
      targetEl.textContent = 'Target: ' + target.name;
      var picks = [target].concat(sh(colors).slice(0, 5));
      picks = sh(picks);
      grid.innerHTML = '';
      for (var i = 0; i < picks.length; i += 1) {
        var t = document.createElement('button');
        t.type = 'button';
        t.className = 'tile';
        t.style.background = picks[i].value;
        t.setAttribute('data-color-name', picks[i].name);
        t.addEventListener('click', function () {
          if (this.getAttribute('data-color-name') === target.name) {
            score += 1;
            scoreEl.textContent = 'Score: ' + score;
            if (audio.ensure()) { audio.beep(700, 0.1, 'square', 0.07); }
          } else {
            score = Math.max(0, score - 1);
            scoreEl.textContent = 'Score: ' + score;
            if (audio.ensure()) { audio.beep(220, 0.15, 'sawtooth', 0.06); }
          }
          round();
        });
        grid.appendChild(t);
      }
    }

    start.addEventListener('click', function () { score = 0; scoreEl.textContent = 'Score: 0'; round(); });
  }

  function setupBubbleCount(audio) {
    var start = document.querySelector('[data-bubble-start]');
    var scoreEl = document.querySelector('[data-bubble-score]');
    var view = document.querySelector('[data-bubble-view]');
    var options = document.querySelector('[data-bubble-options]');
    if (!start || !scoreEl || !view || !options) { return; }
    var score = 0;

    function round() {
      var count = r(1, 6);
      view.innerHTML = '';
      for (var i = 0; i < count; i += 1) {
        var b = document.createElement('span');
        b.className = 'bubble';
        view.appendChild(b);
      }

      var choices = sh([count, Math.max(1, count - 1), Math.min(8, count + 1)]);
      options.innerHTML = '';
      for (var j = 0; j < choices.length; j += 1) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn soft';
        btn.textContent = String(choices[j]);
        btn.addEventListener('click', function () {
          if (Number(this.textContent) === count) {
            score += 1;
            if (audio.ensure()) { audio.beep(660, 0.1, 'triangle', 0.07); }
          } else {
            if (audio.ensure()) { audio.beep(220, 0.14, 'sawtooth', 0.06); }
          }
          scoreEl.textContent = 'Correct: ' + score;
          round();
        });
        options.appendChild(btn);
      }
    }

    start.addEventListener('click', function () { score = 0; scoreEl.textContent = 'Correct: 0'; round(); });
  }

  function setupPiano(audio) {
    var keys = document.querySelectorAll('[data-note]');
    for (var i = 0; i < keys.length; i += 1) {
      keys[i].addEventListener('click', function () {
        if (!audio.ensure()) { return; }
        audio.resume().then(function () {});
        audio.beep(Number(this.getAttribute('data-note')), 0.24, 'triangle', 0.08);
      });
    }
  }

  function setupEmoji(audio) {
    var start = document.querySelector('[data-emoji-start]');
    var targetEl = document.querySelector('[data-emoji-target]');
    var scoreEl = document.querySelector('[data-emoji-score]');
    var grid = document.querySelector('[data-emoji-grid]');
    if (!start || !targetEl || !scoreEl || !grid) { return; }

    var list = [
      { id: 'sun', label: 'Sun', art: 'icon-sun' },
      { id: 'pup', label: 'Pup', art: 'icon-pup' },
      { id: 'cat', label: 'Cat', art: 'icon-cat' },
      { id: 'car', label: 'Car', art: 'icon-car' },
      { id: 'star', label: 'Star', art: 'icon-star' },
      { id: 'berry', label: 'Berry', art: 'icon-berry' }
    ];
    var target = list[0];
    var streak = 0;

    function round() {
      target = list[r(0, list.length - 1)];
      targetEl.textContent = 'Find: ' + target.label;
      var choices = sh(list).slice(0, 5);
      var hasTarget = false;
      for (var t = 0; t < choices.length; t += 1) {
        if (choices[t].id === target.id) {
          hasTarget = true;
        }
      }
      if (!hasTarget) { choices[0] = target; }
      choices = sh(choices);
      grid.innerHTML = '';
      for (var i = 0; i < choices.length; i += 1) {
        var item = choices[i];
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'tile';
        b.setAttribute('data-icon-id', item.id);
        b.innerHTML = '<span class="icon-art ' + item.art + '"></span>';
        b.addEventListener('click', function () {
          if (this.getAttribute('data-icon-id') === target.id) {
            streak += 1;
            if (audio.ensure()) { audio.beep(760, 0.1, 'square', 0.07); }
          } else {
            streak = 0;
            if (audio.ensure()) { audio.beep(220, 0.14, 'sawtooth', 0.06); }
          }
          scoreEl.textContent = 'Streak: ' + streak;
          round();
        });
        grid.appendChild(b);
      }
    }

    start.addEventListener('click', function () { streak = 0; scoreEl.textContent = 'Streak: 0'; round(); });
  }

  function setupPond(audio) {
    var start = document.querySelector('[data-pond-start]');
    var scoreEl = document.querySelector('[data-pond-score]');
    var timeEl = document.querySelector('[data-pond-time]');
    var pond = document.querySelector('[data-pond]');
    var swim = document.querySelector('[data-pond-swim]');
    if (!start || !scoreEl || !timeEl || !pond || !swim) { return; }

    var moveTimer = null;
    var countTimer = null;
    var x = 8;
    var y = 60;
    var dir = 1;
    var speed = 3;
    var score = 0;
    var time = 20;
    var on = false;

    function respawn() {
      dir = Math.random() > 0.5 ? 1 : -1;
      speed = r(2, 4);
      x = dir === 1 ? -34 : pond.clientWidth + 6;
      y = r(15, Math.max(20, pond.clientHeight - 58));
      swim.style.left = x + 'px';
      swim.style.top = y + 'px';
      swim.classList.remove('swim-fish', 'swim-duck');
      swim.classList.add(Math.random() > 0.5 ? 'swim-fish' : 'swim-duck');
      swim.style.transform = dir === 1 ? 'scaleX(1)' : 'scaleX(-1)';
    }

    function stop() {
      on = false;
      if (moveTimer) { clearInterval(moveTimer); moveTimer = null; }
      if (countTimer) { clearInterval(countTimer); countTimer = null; }
      start.textContent = 'Start Pond Game';
    }

    start.addEventListener('click', function () {
      stop();
      on = true;
      score = 0;
      time = 20;
      scoreEl.textContent = 'Caught: 0';
      timeEl.textContent = 'Time: 20';
      start.textContent = 'Restart Pond Game';
      respawn();

      moveTimer = window.setInterval(function () {
        x += speed * dir;
        swim.style.left = x + 'px';
        if ((dir === 1 && x > pond.clientWidth + 10) || (dir === -1 && x < -42)) {
          respawn();
        }
      }, 35);

      countTimer = window.setInterval(function () {
        time -= 1;
        timeEl.textContent = 'Time: ' + time;
        if (time <= 0) {
          stop();
          timeEl.textContent = 'Time: 0';
          scoreEl.textContent = 'Caught: ' + score + ' (Yay!)';
        }
      }, 1000);
    });

    swim.addEventListener('click', function () {
      if (!on) { return; }
      score += 1;
      scoreEl.textContent = 'Caught: ' + score;
      if (audio.ensure()) { audio.beep(620, 0.1, 'triangle', 0.07); }
      respawn();
    });
  }

  if (document.body.getAttribute('data-app') === 'tiny-tots') {
    var audio = audioEngine();
    setupMusic(audio);
    setupColorTap(audio);
    setupBubbleCount(audio);
    setupPiano(audio);
    setupEmoji(audio);
    setupPond(audio);
  }
})();
