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

  function readJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function audioEngine() {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = null;
    function ensure() { if (!AC) return false; if (!ctx) ctx = new AC(); return true; }
    function beep(f, d, t, v) {
      if (!ctx) return;
      var n = ctx.currentTime;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = t || 'triangle';
      o.frequency.setValueAtTime(f, n);
      g.gain.setValueAtTime(0.0001, n);
      g.gain.exponentialRampToValueAtTime(v || 0.08, n + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, n + d);
      o.connect(g); g.connect(ctx.destination); o.start(n); o.stop(n + d + 0.02);
    }
    function resume() { return ctx ? ctx.resume() : Promise.resolve(); }
    return { ensure: ensure, beep: beep, resume: resume };
  }

  function setupMusic(audio) {
    var btn = document.querySelector('[data-music-toggle]');
    var status = document.querySelector('[data-music-status]');
    if (!btn || !status) return;
    var on = false;
    var timer = null;
    var i = 0;
    var seq = [392, 523.25, 659.25, 523.25, 440, 523.25, 659.25, 783.99];

    btn.addEventListener('click', function () {
      if (on) {
        on = false;
        if (timer) clearInterval(timer);
        timer = null;
        btn.textContent = 'Play Hub Music';
        status.textContent = 'Hub music is paused.';
        return;
      }
      if (!audio.ensure()) { status.textContent = 'Audio not supported.'; return; }
      audio.resume().then(function () {
        on = true;
        i = 0;
        btn.textContent = 'Pause Hub Music';
        status.textContent = 'Hub music is playing.';
        if (timer) clearInterval(timer);
        timer = window.setInterval(function () {
          var f = seq[i % seq.length];
          audio.beep(f, 0.18, 'triangle', 0.07);
          if (i % 2 === 0) audio.beep(f * 0.5, 0.22, 'sine', 0.03);
          i += 1;
        }, 290);
      });
    });
  }

  function setupVolcano(audio, rewards) {
    var start = document.querySelector('[data-volcano-start]');
    var jump = document.querySelector('[data-volcano-jump]');
    var scoreEl = document.querySelector('[data-volcano-score]');
    var livesEl = document.querySelector('[data-volcano-lives]');
    var timeEl = document.querySelector('[data-volcano-time]');
    var pulse = document.querySelector('[data-volcano-pulse]');
    var safe = document.querySelector('[data-volcano-safe]');
    var status = document.querySelector('[data-volcano-status]');
    if (!start || !jump || !scoreEl || !livesEl || !timeEl || !pulse || !safe || !status) return;

    var move = null;
    var count = null;
    var x = 0;
    var dir = 1;
    var score = 0;
    var time = 25;
    var lives = 3;
    var safeLeft = 35;
    var safeWidth = 22;
    var on = false;

    function newSafeLane() {
      safeLeft = r(8, 70);
      safeWidth = r(16, 26);
      safe.style.left = safeLeft + '%';
      safe.style.width = safeWidth + '%';
    }

    function loseLife(reason) {
      lives -= 1;
      livesEl.textContent = 'Lives: ' + lives;
      status.textContent = reason;
      if (audio.ensure()) audio.beep(180, 0.16, 'sawtooth', 0.07);
      if (lives <= 0) {
        stop();
        status.textContent = 'Lava got you. Final escapes: ' + score;
      }
    }

    function stop() {
      on = false;
      if (move) clearInterval(move);
      if (count) clearInterval(count);
      move = null;
      count = null;
      start.textContent = 'Start';
    }

    start.addEventListener('click', function () {
      stop();
      on = true;
      x = 0;
      dir = 1;
      score = 0;
      lives = 3;
      time = 25;
      scoreEl.textContent = 'Escapes: 0';
      livesEl.textContent = 'Lives: 3';
      timeEl.textContent = 'Time: 25';
      status.textContent = 'Jump only when marker is safely inside green lane.';
      start.textContent = 'Restart';
      newSafeLane();

      move = window.setInterval(function () {
        x += dir * 3;
        if (x >= 100) { x = 100; dir = -1; }
        if (x <= 0) { x = 0; dir = 1; }
        pulse.style.left = x + '%';
      }, 50);

      count = window.setInterval(function () {
        time -= 1;
        timeEl.textContent = 'Time: ' + time;
        if (time <= 0) {
          stop();
          timeEl.textContent = 'Time: 0';
          status.textContent = 'Round done. Escapes: ' + score;
          rewards.addCoins(10 + (score * 2), 'Volcano round complete');
        }
      }, 1000);
    });

    jump.addEventListener('click', function () {
      if (!on) return;
      var safeStart = safeLeft;
      var safeEnd = safeLeft + safeWidth;
      var innerStart = safeStart + 2.5;
      var innerEnd = safeEnd - 2.5;
      var nearStart = safeStart - 3;
      var nearEnd = safeEnd + 3;

      if (x >= innerStart && x <= innerEnd) {
        score += 1;
        scoreEl.textContent = 'Escapes: ' + score;
        status.textContent = 'Safe jump! +5 coins';
        rewards.addCoins(5, 'Volcano safe jump');
        if (audio.ensure()) audio.beep(760, 0.1, 'triangle', 0.08);
        newSafeLane();
      } else if (x >= nearStart && x <= nearEnd) {
        loseLife('Too close to lava edge. You lose a life.');
      } else {
        loseLife('Lava hit! Jump inside the green lane.');
      }
    });
  }

  function setupCamp(audio, rewards) {
    var start = document.querySelector('[data-camp-start]');
    var viewBtn = document.querySelector('[data-camp-view]');
    var panel = document.querySelector('[data-camp-screen-panel]');
    var dayEl = document.querySelector('[data-camp-day]');
    var foodEl = document.querySelector('[data-camp-food]');
    var toolsEl = document.querySelector('[data-camp-tools]');
    var energyEl = document.querySelector('[data-camp-energy]');
    var screenFood = document.querySelector('[data-camp-screen-food]');
    var screenTools = document.querySelector('[data-camp-screen-tools]');
    var screenEnergy = document.querySelector('[data-camp-screen-energy]');
    var screenShelter = document.querySelector('[data-camp-screen-shelter]');
    var meterFood = document.querySelector('[data-camp-meter-food]');
    var meterTools = document.querySelector('[data-camp-meter-tools]');
    var meterEnergy = document.querySelector('[data-camp-meter-energy]');
    var meterShelter = document.querySelector('[data-camp-meter-shelter]');
    var logEl = document.querySelector('[data-camp-log]');
    var actions = document.querySelectorAll('[data-camp-action]');
    if (!start || !viewBtn || !panel || !dayEl || !foodEl || !toolsEl || !energyEl || !screenFood || !screenTools || !screenEnergy || !screenShelter || !meterFood || !meterTools || !meterEnergy || !meterShelter || !logEl || !actions.length) return;

    var s = { day: 1, food: 4, tools: 1, energy: 5, shelter: 0, on: false };
    function render() {
      dayEl.textContent = 'Day: ' + s.day;
      foodEl.textContent = 'Food: ' + s.food;
      toolsEl.textContent = 'Tools: ' + s.tools;
      energyEl.textContent = 'Energy: ' + s.energy;
      screenFood.textContent = String(s.food);
      screenTools.textContent = String(s.tools);
      screenEnergy.textContent = String(s.energy);
      screenShelter.textContent = String(s.shelter);
      meterFood.style.width = Math.min(100, s.food * 10) + '%';
      meterTools.style.width = Math.min(100, s.tools * 10) + '%';
      meterEnergy.style.width = Math.min(100, s.energy * 16) + '%';
      meterShelter.style.width = Math.min(100, s.shelter * 15) + '%';
    }
    function end(msg) { s.on = false; logEl.textContent = msg; }
    function passDay() {
      s.day += 1;
      s.food -= 1;
      if (s.food < 0 || s.energy <= 0) { end('Camp failed. Restart and plan better.'); return; }
      if (s.day > 8) {
        end('You completed 8 days!');
        if (audio.ensure()) audio.beep(780, 0.1, 'triangle', 0.08);
        rewards.addCoins(35 + (s.shelter * 5), 'Survival camp complete');
      }
    }
    start.addEventListener('click', function () {
      s = { day: 1, food: 4, tools: 1, energy: 5, shelter: 0, on: true };
      logEl.textContent = 'Camp started.';
      panel.classList.add('is-open');
      render();
    });
    viewBtn.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      viewBtn.textContent = panel.classList.contains('is-open') ? 'Hide Resources' : 'View Resources';
    });
    for (var i = 0; i < actions.length; i += 1) {
      actions[i].addEventListener('click', function () {
        if (!s.on) return;
        var a = this.getAttribute('data-camp-action');
        if (a === 'hunt') { s.food += r(1, 3); s.energy -= 1; logEl.textContent = 'You found food.'; }
        if (a === 'craft') {
          if (s.tools >= 3) {
            s.tools -= 2;
            s.shelter += 1;
            s.energy -= 1;
            logEl.textContent = 'You reinforced shelter walls.';
          } else {
            s.tools += 1;
            s.energy -= 1;
            logEl.textContent = 'You crafted a new tool.';
          }
        }
        if (a === 'rest') { s.energy = Math.min(6, s.energy + 2); logEl.textContent = 'You rested.'; }
        if (audio.ensure()) audio.beep(560, 0.08, 'triangle', 0.05);
        passDay();
        render();
      });
    }
    render();
  }

  function setupScene(audio, rewards) {
    var theme = document.querySelector('[data-scene-theme]');
    var style = document.querySelector('[data-scene-style]');
    var focus = document.querySelector('[data-scene-focus]');
    var missionBtn = document.querySelector('[data-scene-mission]');
    var build = document.querySelector('[data-scene-build]');
    var scoreEl = document.querySelector('[data-scene-score]');
    var targetEl = document.querySelector('[data-scene-target]');
    var output = document.querySelector('[data-scene-output]');
    if (!theme || !style || !focus || !missionBtn || !build || !scoreEl || !targetEl || !output) return;

    var score = 0;
    var target = { theme: 'beach', style: 'low-poly', focus: 'adventure' };
    var themes = ['beach', 'space', 'forest'];
    var styles = ['low-poly', 'cartoon', 'neon'];
    var focuses = ['teamwork', 'adventure', 'learning'];

    function newMission() {
      target.theme = themes[r(0, themes.length - 1)];
      target.style = styles[r(0, styles.length - 1)];
      target.focus = focuses[r(0, focuses.length - 1)];
      targetEl.textContent = 'Mission: Theme ' + target.theme + ', Style ' + target.style + ', Focus ' + target.focus + '.';
    }

    missionBtn.addEventListener('click', newMission);

    build.addEventListener('click', function () {
      var matchCount = 0;
      if (theme.value === target.theme) matchCount += 1;
      if (style.value === target.style) matchCount += 1;
      if (focus.value === target.focus) matchCount += 1;

      if (matchCount === 3) {
        score += 20;
        output.textContent = 'Perfect build! You matched all mission settings and unlocked a bonus scene.';
        if (audio.ensure()) { audio.beep(620, 0.08, 'triangle', 0.06); audio.beep(740, 0.08, 'triangle', 0.06); audio.beep(860, 0.1, 'triangle', 0.06); }
        rewards.addCoins(12, 'Studio perfect build');
        newMission();
      } else {
        score += (matchCount * 5);
        output.textContent = 'Scene created: a ' + style.value + ' ' + theme.value + ' world focused on ' + focus.value + '. Match count: ' + matchCount + '/3.';
        if (audio.ensure()) { audio.beep(540, 0.08, 'triangle', 0.05); }
      }
      scoreEl.textContent = 'Studio Score: ' + score;
    });

    newMission();
  }

  function setupQuiz(audio, rewards) {
    var start = document.querySelector('[data-quiz-start]');
    var scoreEl = document.querySelector('[data-quiz-score]');
    var qEl = document.querySelector('[data-quiz-question]');
    var opts = document.querySelector('[data-quiz-options]');
    if (!start || !scoreEl || !qEl || !opts) return;
    var bank = [
      { q: 'Math: 7 + 5 = ?', a: '12', w: ['11', '13'] },
      { q: 'Spelling: correct word?', a: 'adventure', w: ['advanture', 'advencher'] },
      { q: 'Science: plants need?', a: 'sunlight', w: ['plastic', 'metal'] },
      { q: 'Logic: next 2,4,6,?', a: '8', w: ['7', '10'] }
    ];
    var score = 0;
    function round() {
      var item = bank[r(0, bank.length - 1)];
      qEl.textContent = item.q;
      var ch = sh([item.a, item.w[0], item.w[1]]);
      opts.innerHTML = '';
      for (var i = 0; i < ch.length; i += 1) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = ch[i];
        b.addEventListener('click', function () {
          if (this.textContent === item.a) {
            score += 10;
            rewards.addCoins(2, 'Quiz correct answer');
            if (audio.ensure()) audio.beep(730, 0.1, 'triangle', 0.07);
          } else {
            if (audio.ensure()) audio.beep(220, 0.15, 'sawtooth', 0.06);
          }
          scoreEl.textContent = 'Score: ' + score;
          round();
        });
        opts.appendChild(b);
      }
    }
    start.addEventListener('click', function () { score = 0; scoreEl.textContent = 'Score: 0'; round(); });
  }

  function setupTyping(audio, rewards) {
    var start = document.querySelector('[data-type-start]');
    var timeEl = document.querySelector('[data-type-time]');
    var scoreEl = document.querySelector('[data-type-score]');
    var wordEl = document.querySelector('[data-type-word]');
    var input = document.querySelector('[data-type-input]');
    if (!start || !timeEl || !scoreEl || !wordEl || !input) return;
    var words = ['volcano', 'survival', 'fishing', 'strategy', 'rhythm', 'creative', 'science', 'grammar'];
    var time = 30;
    var score = 0;
    var timer = null;
    var current = '';
    var on = false;
    function nextWord() {
      current = words[r(0, words.length - 1)];
      wordEl.textContent = 'Type: ' + current;
      input.value = '';
      input.focus();
    }
    start.addEventListener('click', function () {
      on = true;
      time = 30;
      score = 0;
      timeEl.textContent = 'Time: 30';
      scoreEl.textContent = 'Words: 0';
      nextWord();
      if (timer) clearInterval(timer);
      timer = window.setInterval(function () {
        time -= 1;
        timeEl.textContent = 'Time: ' + time;
        if (time <= 0) {
          on = false;
          clearInterval(timer);
          wordEl.textContent = 'Done. Words completed: ' + score;
        }
      }, 1000);
    });
    input.addEventListener('input', function () {
      if (!on) return;
      if (input.value.trim().toLowerCase() === current) {
        score += 1;
        scoreEl.textContent = 'Words: ' + score;
        rewards.addCoins(1, 'Typing word complete');
        if (audio.ensure()) audio.beep(670, 0.08, 'triangle', 0.06);
        nextWord();
      }
    });
  }

  function setupLogic(audio, rewards) {
    var start = document.querySelector('[data-logic-start]');
    var movesEl = document.querySelector('[data-logic-moves]');
    var targetEl = document.querySelector('[data-logic-target]');
    var grid = document.querySelector('[data-logic-grid]');
    if (!start || !movesEl || !targetEl || !grid) return;
    var target = [];
    var state = [];
    var moves = 0;

    function render() {
      grid.innerHTML = '';
      for (var i = 0; i < state.length; i += 1) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'logic-cell ' + (state[i] ? 'logic-on' : 'logic-off');
        b.textContent = state[i] ? '1' : '0';
        b.setAttribute('data-i', String(i));
        b.addEventListener('click', function () {
          var idx = Number(this.getAttribute('data-i'));
          state[idx] = state[idx] ? 0 : 1;
          moves += 1;
          movesEl.textContent = 'Moves: ' + moves;
          if (audio.ensure()) audio.beep(500 + (idx * 40), 0.07, 'square', 0.05);
          render();
          if (state.join('') === target.join('')) {
            targetEl.textContent = 'Target matched in ' + moves + ' moves!';
            rewards.addCoins(15, 'Logic lock solved');
            if (audio.ensure()) audio.beep(780, 0.1, 'triangle', 0.07);
          }
        });
        grid.appendChild(b);
      }
    }

    function newPuzzle() {
      target = [];
      state = [];
      moves = 0;
      for (var i = 0; i < 5; i += 1) {
        target.push(r(0, 1));
        state.push(r(0, 1));
      }
      targetEl.textContent = 'Target: ' + target.join('');
      movesEl.textContent = 'Moves: 0';
      render();
    }

    start.addEventListener('click', newPuzzle);
    newPuzzle();
  }

  function setupDuel(audio, rewards) {
    var reset = document.querySelector('[data-duel-reset]');
    var status = document.querySelector('[data-duel-status]');
    var grid = document.querySelector('[data-duel-grid]');
    if (!reset || !status || !grid) return;
    var board = ['','','','','','','','',''];
    var on = true;

    function winner(c) {
      var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (var i = 0; i < lines.length; i += 1) {
        var a = lines[i][0], b = lines[i][1], d = lines[i][2];
        if (c[a] && c[a] === c[b] && c[a] === c[d]) return c[a];
      }
      return '';
    }

    function render() {
      grid.innerHTML = '';
      for (var i = 0; i < 9; i += 1) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'duel-cell';
        b.setAttribute('data-i', String(i));
        b.textContent = board[i];
        b.addEventListener('click', function () {
          if (!on) return;
          var idx = Number(this.getAttribute('data-i'));
          if (board[idx]) return;
          board[idx] = 'X';
          if (audio.ensure()) audio.beep(620, 0.08, 'triangle', 0.06);
          var w = winner(board);
          if (w) { status.textContent = 'You win!'; on = false; rewards.addCoins(12, 'Duel win'); render(); return; }
          var empty = [];
          for (var p = 0; p < board.length; p += 1) if (!board[p]) empty.push(p);
          if (!empty.length) { status.textContent = 'Draw game.'; on = false; render(); return; }
          var ai = empty[r(0, empty.length - 1)];
          board[ai] = 'O';
          var w2 = winner(board);
          if (w2) { status.textContent = 'Bot wins.'; on = false; render(); return; }
          status.textContent = 'Your turn (X)';
          if (audio.ensure()) audio.beep(300, 0.08, 'square', 0.05);
          render();
        });
        grid.appendChild(b);
      }
    }

    reset.addEventListener('click', function () {
      board = ['','','','','','','','',''];
      on = true;
      status.textContent = 'Your turn (X)';
      render();
    });

    render();
  }

  if (document.body.getAttribute('data-app') === 'all-ages') {
    var audio = audioEngine();
    var coinBalanceEl = document.querySelector('[data-coin-balance]');
    var coinLogEl = document.querySelector('[data-coin-log]');
    var shopStatusEl = document.querySelector('[data-shop-status]');
    var garageCar = document.querySelector('[data-garage-car]');
    var themePreview = document.querySelector('[data-theme-preview]');
    var buyButtons = document.querySelectorAll('[data-shop-buy]');

    var store = readJSON('arcade-store', {
      coins: 0,
      owned: {
        car_default: true,
        theme_default: true
      },
      equipped: {
        car: 'car_default',
        theme: 'theme_default'
      }
    });

    var catalog = {
      car_red: { cost: 60, type: 'car', skin: 'skin-red' },
      car_neon: { cost: 120, type: 'car', skin: 'skin-neon' },
      theme_sunset: { cost: 80, type: 'theme', theme: 'sunset' },
      theme_forest: { cost: 90, type: 'theme', theme: 'forest' },
      theme_ocean: { cost: 100, type: 'theme', theme: 'ocean' },
      boost_double: { cost: 140, type: 'extra', boost: 'double' },
      pulse_sparkle: { cost: 70, type: 'extra', boost: 'sparkle' }
    };

    function coinMultiplier() {
      return store.owned.boost_double ? 2 : 1;
    }

    function syncTheme() {
      var theme = store.equipped.theme;
      if (theme === 'theme_sunset') document.body.setAttribute('data-theme', 'sunset');
      else if (theme === 'theme_forest') document.body.setAttribute('data-theme', 'forest');
      else if (theme === 'theme_ocean') document.body.setAttribute('data-theme', 'ocean');
      else document.body.removeAttribute('data-theme');
      if (themePreview) {
        themePreview.style.background = getComputedStyle(document.body).backgroundImage;
      }
    }

    function syncCarPreview() {
      if (!garageCar) return;
      garageCar.classList.remove('skin-red', 'skin-neon');
      if (store.equipped.car === 'car_red') garageCar.classList.add('skin-red');
      if (store.equipped.car === 'car_neon') garageCar.classList.add('skin-neon');
      localStorage.setItem('arcade-car-skin', store.equipped.car);
    }

    function renderCoins() {
      if (coinBalanceEl) coinBalanceEl.textContent = String(store.coins);
    }

    function saveStore() {
      writeJSON('arcade-store', store);
      renderCoins();
      syncTheme();
      syncCarPreview();
    }

    function addCoins(amount, reason) {
      var gain = Math.max(0, Math.floor(amount * coinMultiplier()));
      store.coins += gain;
      if (coinLogEl) coinLogEl.textContent = '+' + gain + ' coins: ' + reason + '.';
      saveStore();
    }

    function equipItem(itemKey) {
      var item = catalog[itemKey];
      if (!item) return;
      if (item.type === 'car') store.equipped.car = itemKey;
      if (item.type === 'theme') store.equipped.theme = itemKey;
      if (shopStatusEl) shopStatusEl.textContent = 'Equipped ' + itemKey.replace('_', ' ') + '.';
      saveStore();
    }

    for (var i = 0; i < buyButtons.length; i += 1) {
      buyButtons[i].addEventListener('click', function () {
        var key = this.getAttribute('data-shop-buy');
        var item = catalog[key];
        if (!item) return;

        if (store.owned[key]) {
          equipItem(key);
          return;
        }

        if (store.coins < item.cost) {
          if (shopStatusEl) shopStatusEl.textContent = 'Not enough coins for ' + key.replace('_', ' ') + '.';
          return;
        }

        store.coins -= item.cost;
        store.owned[key] = true;
        if (shopStatusEl) shopStatusEl.textContent = 'Bought ' + key.replace('_', ' ') + ' for ' + item.cost + ' coins.';
        equipItem(key);
      });
    }

    saveStore();

    var rewards = { addCoins: addCoins };
    setupMusic(audio);
    setupVolcano(audio, rewards);
    setupCamp(audio, rewards);
    setupScene(audio, rewards);
    setupQuiz(audio, rewards);
    setupTyping(audio, rewards);
    setupLogic(audio, rewards);
    setupDuel(audio, rewards);
  }
})();
