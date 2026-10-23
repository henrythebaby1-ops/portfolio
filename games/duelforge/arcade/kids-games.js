(function () {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function setupAudioEngine() {
    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    var context = null;

    function ensureAudio() {
      if (!AudioContextCtor) {
        return false;
      }
      if (!context) {
        context = new AudioContextCtor();
      }
      return true;
    }

    function beep(freq, duration, type, volume) {
      if (!context) {
        return;
      }
      var now = context.currentTime;
      var osc = context.createOscillator();
      var gain = context.createGain();
      osc.type = type || 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume || 0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }

    function resume() {
      if (!context) {
        return Promise.resolve();
      }
      return context.resume();
    }

    return {
      ensureAudio: ensureAudio,
      beep: beep,
      resume: resume
    };
  }

  function setupMusic(audio) {
    var toggle = document.querySelector('[data-music-toggle]');
    var status = document.querySelector('[data-music-status]');
    if (!toggle || !status) {
      return;
    }

    var timer = null;
    var step = 0;
    var on = false;
    var melody = [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 698.46, 783.99];

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      on = false;
      toggle.textContent = 'Play Game Music';
      status.textContent = 'Game music is paused.';
    }

    function playStep() {
      var base = melody[step % melody.length];
      audio.beep(base, 0.2, 'triangle', 0.07);
      if (step % 2 === 0) {
        audio.beep(base * 0.5, 0.24, 'sine', 0.03);
      }
      step += 1;
    }

    toggle.addEventListener('click', function () {
      if (on) {
        stop();
        return;
      }

      if (!audio.ensureAudio()) {
        status.textContent = 'Audio is not supported in this browser.';
        return;
      }

      audio.resume().then(function () {
        if (timer) {
          clearInterval(timer);
        }
        on = true;
        step = 0;
        playStep();
        timer = window.setInterval(playStep, 280);
        toggle.textContent = 'Pause Game Music';
        status.textContent = 'Now playing cheerful game music.';
      });
    });

    window.addEventListener('beforeunload', function () {
      if (timer) {
        clearInterval(timer);
      }
    });
  }

  function setupBalloonGame(audio) {
    var startBtn = document.querySelector('[data-balloon-start]');
    var area = document.querySelector('[data-balloon-area]');
    var scoreEl = document.querySelector('[data-balloon-score]');
    var timeEl = document.querySelector('[data-balloon-time]');
    if (!startBtn || !area || !scoreEl || !timeEl) {
      return;
    }

    var spawnTimer = null;
    var countdownTimer = null;
    var score = 0;
    var timeLeft = 30;
    var running = false;
    var colors = ['#ff87c2', '#7fd3ff', '#ffc977', '#9af0ad', '#b6b8ff'];

    function clearBalloons() {
      var balloons = area.querySelectorAll('.balloon');
      for (var i = 0; i < balloons.length; i += 1) {
        balloons[i].remove();
      }
    }

    function stopGame() {
      running = false;
      if (spawnTimer) {
        clearInterval(spawnTimer);
        spawnTimer = null;
      }
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
      clearBalloons();
      startBtn.textContent = 'Start Balloon Pop';
    }

    function spawnBalloon() {
      if (!running) {
        return;
      }

      var balloon = document.createElement('button');
      var size = randomInt(46, 86);
      balloon.type = 'button';
      balloon.className = 'balloon';
      balloon.style.width = size + 'px';
      balloon.style.height = Math.round(size * 1.1) + 'px';
      balloon.style.left = randomInt(2, Math.max(4, area.clientWidth - size - 8)) + 'px';
      balloon.style.top = randomInt(2, Math.max(4, area.clientHeight - Math.round(size * 1.1) - 8)) + 'px';
      balloon.style.background = colors[randomInt(0, colors.length - 1)];
      area.appendChild(balloon);

      balloon.addEventListener('click', function () {
        score += 1;
        scoreEl.textContent = 'Score: ' + score;
        if (audio.ensureAudio()) {
          audio.beep(740, 0.1, 'square', 0.09);
        }
        balloon.remove();
      });

      window.setTimeout(function () {
        if (balloon.parentNode) {
          balloon.remove();
        }
      }, 2200);
    }

    startBtn.addEventListener('click', function () {
      stopGame();
      running = true;
      score = 0;
      timeLeft = 30;
      scoreEl.textContent = 'Score: 0';
      timeEl.textContent = 'Time: 30';
      startBtn.textContent = 'Restart Balloon Pop';
      spawnBalloon();

      spawnTimer = window.setInterval(spawnBalloon, 550);
      countdownTimer = window.setInterval(function () {
        timeLeft -= 1;
        timeEl.textContent = 'Time: ' + timeLeft;
        if (timeLeft <= 0) {
          stopGame();
          timeEl.textContent = 'Time: 0';
          scoreEl.textContent = 'Score: ' + score + ' (Great!)';
        }
      }, 1000);
    });
  }

  function setupShapeGame(audio) {
    var startBtn = document.querySelector('[data-shape-start]');
    var scoreEl = document.querySelector('[data-shape-score]');
    var promptEl = document.querySelector('[data-shape-prompt]');
    var optionsEl = document.querySelector('[data-shape-options]');
    if (!startBtn || !scoreEl || !promptEl || !optionsEl) {
      return;
    }

    var shapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
    var score = 0;
    var current = '';

    function renderRound() {
      current = shapes[randomInt(0, shapes.length - 1)];
      promptEl.textContent = 'Tap the ' + current + '.';

      var picks = [current];
      while (picks.length < 3) {
        var next = shapes[randomInt(0, shapes.length - 1)];
        if (picks.indexOf(next) === -1) {
          picks.push(next);
        }
      }

      picks = shuffle(picks);
      optionsEl.innerHTML = '';

      for (var i = 0; i < picks.length; i += 1) {
        var shape = picks[i];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'shape-btn';
        btn.setAttribute('data-shape', shape);
        btn.innerHTML = '<span class="shape-icon shape-' + shape + '"></span>' + shape;
        btn.addEventListener('click', function () {
          var chosen = this.getAttribute('data-shape');
          if (chosen === current) {
            score += 1;
            scoreEl.textContent = 'Correct: ' + score;
            promptEl.textContent = 'Nice!';
            if (audio.ensureAudio()) {
              audio.beep(690, 0.12, 'triangle', 0.09);
            }
          } else {
            promptEl.textContent = 'Try again!';
            if (audio.ensureAudio()) {
              audio.beep(230, 0.18, 'sawtooth', 0.07);
            }
          }
          window.setTimeout(renderRound, 420);
        });
        optionsEl.appendChild(btn);
      }
    }

    startBtn.addEventListener('click', function () {
      score = 0;
      scoreEl.textContent = 'Correct: 0';
      renderRound();
    });
  }

  function setupAnimalGame(audio) {
    var playBtn = document.querySelector('[data-animal-play]');
    var scoreEl = document.querySelector('[data-animal-score]');
    var promptEl = document.querySelector('[data-animal-prompt]');
    var grid = document.querySelector('[data-animal-grid]');
    if (!playBtn || !scoreEl || !promptEl || !grid) {
      return;
    }

    var animals = [
      { id: 'cow', art: 'cow', sound: 'moo moo' },
      { id: 'duck', art: 'duck', sound: 'quack quack' },
      { id: 'cat', art: 'cat', sound: 'meow meow' },
      { id: 'dog', art: 'dog', sound: 'woof woof' }
    ];
    var current = animals[0];
    var streak = 0;

    function speak(text) {
      if (!window.speechSynthesis) {
        return;
      }
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      utter.pitch = 1.2;
      window.speechSynthesis.speak(utter);
    }

    function chooseNext() {
      current = animals[randomInt(0, animals.length - 1)];
      promptEl.textContent = 'Find the animal that says: "' + current.sound + '"';
    }

    for (var i = 0; i < animals.length; i += 1) {
      var item = animals[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'animal-btn';
      btn.setAttribute('data-animal', item.id);
      btn.innerHTML = '<span class="animal-art animal-' + item.art + '"></span>' + item.id;
      btn.addEventListener('click', function () {
        var picked = this.getAttribute('data-animal');
        if (picked === current.id) {
          streak += 1;
          scoreEl.textContent = 'Streak: ' + streak;
          promptEl.textContent = 'Great job!';
          if (audio.ensureAudio()) {
            audio.beep(760, 0.12, 'square', 0.08);
          }
        } else {
          streak = 0;
          scoreEl.textContent = 'Streak: 0';
          promptEl.textContent = 'Oops, try again.';
          if (audio.ensureAudio()) {
            audio.beep(210, 0.2, 'sawtooth', 0.07);
          }
        }
        window.setTimeout(chooseNext, 400);
      });
      grid.appendChild(btn);
    }

    playBtn.addEventListener('click', function () {
      chooseNext();
      speak(current.sound);
      if (audio.ensureAudio()) {
        audio.beep(540, 0.09, 'triangle', 0.05);
      }
    });

    chooseNext();
  }

  function setupStoryBuilder(audio) {
    var hero = document.querySelector('[data-story-hero]');
    var place = document.querySelector('[data-story-place]');
    var item = document.querySelector('[data-story-item]');
    var buildBtn = document.querySelector('[data-story-build]');
    var output = document.querySelector('[data-story-output]');
    if (!hero || !place || !item || !buildBtn || !output) {
      return;
    }

    buildBtn.addEventListener('click', function () {
      var line = 'Today, ' + hero.value + ' explored ' + place.value + ' and found ' + item.value + '. Then everyone celebrated with a happy dance!';
      output.textContent = line;

      if (audio.ensureAudio()) {
        audio.beep(620, 0.09, 'triangle', 0.06);
        audio.beep(740, 0.09, 'triangle', 0.06);
      }

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(line);
        utter.rate = 0.92;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
      }
    });
  }

  function setupMemoryGame(audio) {
    var startBtn = document.querySelector('[data-memory-start]');
    var movesEl = document.querySelector('[data-memory-moves]');
    var foundEl = document.querySelector('[data-memory-found]');
    var grid = document.querySelector('[data-memory-grid]');
    if (!startBtn || !movesEl || !foundEl || !grid) {
      return;
    }

    var first = null;
    var second = null;
    var lock = false;
    var moves = 0;
    var pairs = 0;

    function newBoard() {
      var icons = shuffle(['apple', 'star', 'car', 'fish', 'rainbow', 'berry', 'apple', 'star', 'car', 'fish', 'rainbow', 'berry']);
      first = null;
      second = null;
      lock = false;
      moves = 0;
      pairs = 0;
      movesEl.textContent = 'Moves: 0';
      foundEl.textContent = 'Pairs: 0 / 6';
      grid.innerHTML = '';

      for (var i = 0; i < icons.length; i += 1) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'memory-tile is-hidden';
        btn.setAttribute('data-icon', icons[i]);
        btn.textContent = icons[i];
        btn.innerHTML = '<span class="memory-icon memory-' + icons[i] + '"></span>';
        btn.addEventListener('click', function () {
          if (lock || this === first || !this.classList.contains('is-hidden')) {
            return;
          }

          this.classList.remove('is-hidden');
          if (!first) {
            first = this;
            return;
          }

          second = this;
          moves += 1;
          movesEl.textContent = 'Moves: ' + moves;

          if (first.getAttribute('data-icon') === second.getAttribute('data-icon')) {
            pairs += 1;
            foundEl.textContent = 'Pairs: ' + pairs + ' / 6';
            if (audio.ensureAudio()) {
              audio.beep(680, 0.11, 'triangle', 0.08);
            }
            first = null;
            second = null;
            if (pairs === 6) {
              foundEl.textContent = 'Pairs: 6 / 6 (You Win!)';
            }
            return;
          }

          lock = true;
          if (audio.ensureAudio()) {
            audio.beep(220, 0.17, 'sawtooth', 0.07);
          }
          window.setTimeout(function () {
            first.classList.add('is-hidden');
            second.classList.add('is-hidden');
            first = null;
            second = null;
            lock = false;
          }, 620);
        });
        grid.appendChild(btn);
      }
    }

    startBtn.addEventListener('click', newBoard);
    newBoard();
  }

  function setupFishingGame(audio) {
    var startBtn = document.querySelector('[data-fishing-start]');
    var area = document.querySelector('[data-fishing-area]');
    var fish = document.querySelector('[data-fish]');
    var net = document.querySelector('[data-fishing-net]');
    var scoreEl = document.querySelector('[data-fishing-score]');
    var timeEl = document.querySelector('[data-fishing-time]');
    if (!startBtn || !area || !fish || !net || !scoreEl || !timeEl) {
      return;
    }

    var animTimer = null;
    var countTimer = null;
    var x = -60;
    var y = 70;
    var speed = 3;
    var catches = 0;
    var timeLeft = 30;
    var running = false;

    function placeNet(clientX, clientY) {
      var rect = area.getBoundingClientRect();
      var xPos = Math.max(0, Math.min(rect.width, clientX - rect.left));
      var yPos = Math.max(0, Math.min(rect.height, clientY - rect.top));
      net.style.left = xPos + 'px';
      net.style.top = yPos + 'px';
    }

    function swingNet() {
      net.classList.remove('is-swing');
      window.setTimeout(function () {
        net.classList.add('is-swing');
      }, 5);
      window.setTimeout(function () {
        net.classList.remove('is-swing');
      }, 170);
    }

    function intersects(a, b) {
      return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    }

    function catchFishIfHit() {
      if (!running) {
        return false;
      }
      var netRect = net.getBoundingClientRect();
      var fishRect = fish.getBoundingClientRect();
      if (intersects(netRect, fishRect)) {
        catches += 1;
        scoreEl.textContent = 'Catches: ' + catches;
        if (audio.ensureAudio()) {
          audio.beep(620, 0.1, 'square', 0.08);
        }
        resetFish();
        return true;
      }
      return false;
    }

    function resetFish() {
      y = randomInt(15, Math.max(20, area.clientHeight - 65));
      speed = randomInt(2, 4);
      x = -70;
      fish.style.top = y + 'px';
      fish.classList.remove('fish-a', 'fish-b');
      fish.classList.add(Math.random() > 0.5 ? 'fish-a' : 'fish-b');
      fish.style.transform = 'none';
    }

    function stopGame() {
      running = false;
      if (animTimer) {
        clearInterval(animTimer);
        animTimer = null;
      }
      if (countTimer) {
        clearInterval(countTimer);
        countTimer = null;
      }
      startBtn.textContent = 'Start Fishing';
    }

    startBtn.addEventListener('click', function () {
      stopGame();
      running = true;
      catches = 0;
      timeLeft = 30;
      scoreEl.textContent = 'Catches: 0';
      timeEl.textContent = 'Time: 30';
      startBtn.textContent = 'Restart Fishing';
      net.style.left = '50%';
      net.style.top = '50%';
      resetFish();

      animTimer = window.setInterval(function () {
        x += speed;
        fish.style.left = x + 'px';
        if (x > area.clientWidth + 14) {
          resetFish();
        }
      }, 32);

      countTimer = window.setInterval(function () {
        timeLeft -= 1;
        timeEl.textContent = 'Time: ' + timeLeft;
        if (timeLeft <= 0) {
          stopGame();
          timeEl.textContent = 'Time: 0';
          scoreEl.textContent = 'Catches: ' + catches + ' (Great fishing!)';
        }
      }, 1000);
    });

    area.addEventListener('mousemove', function (event) {
      placeNet(event.clientX, event.clientY);
    });

    area.addEventListener('click', function (event) {
      placeNet(event.clientX, event.clientY);
      swingNet();
      catchFishIfHit();
    });

    area.addEventListener('touchmove', function (event) {
      if (!event.touches || !event.touches.length) {
        return;
      }
      placeNet(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });

    area.addEventListener('touchstart', function (event) {
      if (!event.touches || !event.touches.length) {
        return;
      }
      placeNet(event.touches[0].clientX, event.touches[0].clientY);
      swingNet();
      catchFishIfHit();
    }, { passive: true });

    fish.addEventListener('click', function (event) {
      event.stopPropagation();
      swingNet();
      catchFishIfHit();
    });
  }

  function setupDanceGame(audio) {
    var startBtn = document.querySelector('[data-dance-start]');
    var hitBtn = document.querySelector('[data-dance-hit]');
    var scoreEl = document.querySelector('[data-dance-score]');
    var timeEl = document.querySelector('[data-dance-time]');
    var marker = document.querySelector('[data-dance-marker]');
    var status = document.querySelector('[data-dance-status]');
    if (!startBtn || !hitBtn || !scoreEl || !timeEl || !marker || !status) {
      return;
    }

    var timer = null;
    var countdown = null;
    var pos = 0;
    var dir = 1;
    var score = 0;
    var timeLeft = 30;
    var running = false;

    function stopRound() {
      running = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (countdown) {
        clearInterval(countdown);
        countdown = null;
      }
      startBtn.textContent = 'Start Dance Round';
    }

    startBtn.addEventListener('click', function () {
      stopRound();
      running = true;
      score = 0;
      timeLeft = 30;
      pos = 0;
      dir = 1;
      scoreEl.textContent = 'Score: 0';
      timeEl.textContent = 'Time: 30';
      status.textContent = 'Tap Beat when marker is in the green zone.';
      startBtn.textContent = 'Restart Dance Round';

      timer = window.setInterval(function () {
        pos += dir * 2;
        if (pos >= 100) {
          pos = 100;
          dir = -1;
        }
        if (pos <= 0) {
          pos = 0;
          dir = 1;
        }
        marker.style.left = pos + '%';
      }, 60);

      countdown = window.setInterval(function () {
        timeLeft -= 1;
        timeEl.textContent = 'Time: ' + timeLeft;
        if (timeLeft <= 0) {
          stopRound();
          timeEl.textContent = 'Time: 0';
          status.textContent = 'Round over! Final dance score: ' + score;
        }
      }, 1000);
    });

    hitBtn.addEventListener('click', function () {
      if (!running) {
        return;
      }

      if (pos >= 45 && pos <= 61) {
        score += 3;
        status.textContent = 'Perfect beat!';
        if (audio.ensureAudio()) {
          audio.beep(780, 0.09, 'square', 0.08);
        }
      } else if (pos >= 38 && pos <= 68) {
        score += 1;
        status.textContent = 'Good timing!';
        if (audio.ensureAudio()) {
          audio.beep(560, 0.08, 'triangle', 0.06);
        }
      } else {
        score = Math.max(0, score - 1);
        status.textContent = 'Missed the beat. Try again!';
        if (audio.ensureAudio()) {
          audio.beep(220, 0.14, 'sawtooth', 0.06);
        }
      }

      scoreEl.textContent = 'Score: ' + score;
    });
  }

  function setupMathGame(audio) {
    var startBtn = document.querySelector('[data-math-start]');
    var scoreEl = document.querySelector('[data-math-score]');
    var livesEl = document.querySelector('[data-math-lives]');
    var questionEl = document.querySelector('[data-math-question]');
    var optionsEl = document.querySelector('[data-math-options]');
    if (!startBtn || !scoreEl || !livesEl || !questionEl || !optionsEl) {
      return;
    }

    var score = 0;
    var lives = 3;
    var activeAnswer = null;
    var playing = false;

    function nextQuestion() {
      if (!playing) {
        return;
      }

      var a = randomInt(1, 20);
      var b = randomInt(1, 20);
      var add = Math.random() > 0.35;
      if (!add && b > a) {
        var swap = a;
        a = b;
        b = swap;
      }

      activeAnswer = add ? (a + b) : (a - b);
      questionEl.textContent = 'Jump question: ' + a + (add ? ' + ' : ' - ') + b + ' = ?';

      var options = [activeAnswer];
      while (options.length < 3) {
        var value = activeAnswer + randomInt(-6, 6);
        if (value >= 0 && options.indexOf(value) === -1) {
          options.push(value);
        }
      }

      options = shuffle(options);
      optionsEl.innerHTML = '';
      for (var i = 0; i < options.length; i += 1) {
        var choice = options[i];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'math-btn';
        btn.textContent = String(choice);
        btn.addEventListener('click', function () {
          if (!playing) {
            return;
          }

          var picked = Number(this.textContent);
          if (picked === activeAnswer) {
            score += 10;
            scoreEl.textContent = 'Score: ' + score;
            questionEl.textContent = 'Great jump!';
            if (audio.ensureAudio()) {
              audio.beep(710, 0.11, 'triangle', 0.08);
            }
            window.setTimeout(nextQuestion, 320);
          } else {
            lives -= 1;
            livesEl.textContent = 'Lives: ' + lives;
            if (audio.ensureAudio()) {
              audio.beep(205, 0.2, 'sawtooth', 0.07);
            }
            if (lives <= 0) {
              playing = false;
              questionEl.textContent = 'Lava got close. Final score: ' + score + '.';
              return;
            }
            questionEl.textContent = 'Oops, try next jump.';
            window.setTimeout(nextQuestion, 450);
          }
        });
        optionsEl.appendChild(btn);
      }
    }

    startBtn.addEventListener('click', function () {
      playing = true;
      score = 0;
      lives = 3;
      scoreEl.textContent = 'Score: 0';
      livesEl.textContent = 'Lives: 3';
      nextQuestion();
    });
  }

  function setupSurvivalGame(audio) {
    var startBtn = document.querySelector('[data-survival-start]');
    var viewBtn = document.querySelector('[data-survival-view]');
    var panel = document.querySelector('[data-survival-screen-panel]');
    var dayEl = document.querySelector('[data-survival-day]');
    var foodEl = document.querySelector('[data-survival-food]');
    var woodEl = document.querySelector('[data-survival-wood]');
    var energyEl = document.querySelector('[data-survival-energy]');
    var screenFood = document.querySelector('[data-survival-screen-food]');
    var screenWood = document.querySelector('[data-survival-screen-wood]');
    var screenEnergy = document.querySelector('[data-survival-screen-energy]');
    var screenShelter = document.querySelector('[data-survival-screen-shelter]');
    var meterFood = document.querySelector('[data-survival-meter-food]');
    var meterWood = document.querySelector('[data-survival-meter-wood]');
    var meterEnergy = document.querySelector('[data-survival-meter-energy]');
    var meterShelter = document.querySelector('[data-survival-meter-shelter]');
    var logEl = document.querySelector('[data-survival-log]');
    var actionButtons = document.querySelectorAll('[data-survival-action]');

    if (!startBtn || !viewBtn || !panel || !dayEl || !foodEl || !woodEl || !energyEl || !screenFood || !screenWood || !screenEnergy || !screenShelter || !meterFood || !meterWood || !meterEnergy || !meterShelter || !logEl || !actionButtons.length) {
      return;
    }

    var state = {
      day: 1,
      food: 3,
      wood: 3,
      energy: 5,
      shelter: 0,
      active: false
    };

    function render() {
      dayEl.textContent = 'Day: ' + state.day;
      foodEl.textContent = 'Food: ' + state.food;
      woodEl.textContent = 'Wood: ' + state.wood;
      energyEl.textContent = 'Energy: ' + state.energy;
      screenFood.textContent = String(state.food);
      screenWood.textContent = String(state.wood);
      screenEnergy.textContent = String(state.energy);
      screenShelter.textContent = String(state.shelter);
      meterFood.style.width = Math.min(100, state.food * 10) + '%';
      meterWood.style.width = Math.min(100, state.wood * 10) + '%';
      meterEnergy.style.width = Math.min(100, state.energy * 16) + '%';
      meterShelter.style.width = Math.min(100, state.shelter * 15) + '%';
    }

    function endGame(message) {
      state.active = false;
      logEl.textContent = message;
    }

    function nextDay() {
      state.day += 1;
      state.food -= 1;
      state.energy = Math.max(0, state.energy - 1);

      if (state.food < 0 || state.energy <= 0) {
        endGame('Your team got too tired. Press start and try a new survival plan.');
        return;
      }

      if (state.day > 7) {
        endGame('You survived 7 days! Shelter level: ' + state.shelter + '. Amazing planning!');
        if (audio.ensureAudio()) {
          audio.beep(700, 0.1, 'triangle', 0.08);
          audio.beep(820, 0.12, 'triangle', 0.08);
        }
      }
    }

    startBtn.addEventListener('click', function () {
      state.day = 1;
      state.food = 3;
      state.wood = 3;
      state.energy = 5;
      state.shelter = 0;
      state.active = true;
      panel.classList.add('is-open');
      logEl.textContent = 'Survival started. Choose actions each day.';
      render();
    });
    viewBtn.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      viewBtn.textContent = panel.classList.contains('is-open') ? 'Hide Resources' : 'View Resources';
    });

    for (var i = 0; i < actionButtons.length; i += 1) {
      actionButtons[i].addEventListener('click', function () {
        if (!state.active) {
          return;
        }

        var action = this.getAttribute('data-survival-action');
        if (action === 'food') {
          state.food += randomInt(1, 3);
          state.energy = Math.max(0, state.energy - 1);
          logEl.textContent = 'You found berries and coconuts.';
        } else if (action === 'wood') {
          state.wood += randomInt(1, 3);
          state.energy = Math.max(0, state.energy - 1);
          logEl.textContent = 'You collected wood from the forest edge.';
        } else if (action === 'build') {
          if (state.wood >= 2) {
            state.wood -= 2;
            state.shelter += 1;
            state.energy = Math.max(0, state.energy - 1);
            logEl.textContent = 'Shelter improved. Rain safety increased!';
          } else {
            logEl.textContent = 'Need at least 2 wood to build.';
            return;
          }
        } else if (action === 'rest') {
          state.energy = Math.min(6, state.energy + 2);
          logEl.textContent = 'You rested and recovered energy.';
        }

        if (audio.ensureAudio()) {
          audio.beep(560, 0.08, 'triangle', 0.05);
        }

        nextDay();
        render();
      });
    }

    render();
  }

  function setupRacingGame(audio) {
    var startBtn = document.querySelector('[data-race-start]');
    var leftBtn = document.querySelector('[data-race-left]');
    var rightBtn = document.querySelector('[data-race-right]');
    var scoreEl = document.querySelector('[data-race-score]');
    var livesEl = document.querySelector('[data-race-lives]');
    var area = document.querySelector('[data-race-area]');
    var car = document.querySelector('[data-race-car]');
    var status = document.querySelector('[data-race-status]');

    if (!startBtn || !leftBtn || !rightBtn || !scoreEl || !livesEl || !area || !car || !status) {
      return;
    }

    var laneLeft = [16, 49, 82];
    var laneIndex = 1;
    var obstacles = [];
    var anim = null;
    var spawn = null;
    var score = 0;
    var lives = 3;
    var active = false;
    var purchasedSkin = localStorage.getItem('arcade-car-skin') || 'car_default';

    function placeCar() {
      car.style.left = laneLeft[laneIndex] + '%';
    }

    function applyCarSkin() {
      car.classList.remove('skin-red', 'skin-neon');
      if (purchasedSkin === 'car_red') {
        car.classList.add('skin-red');
      } else if (purchasedSkin === 'car_neon') {
        car.classList.add('skin-neon');
      }
    }

    function clearObstacles() {
      for (var i = 0; i < obstacles.length; i += 1) {
        obstacles[i].el.remove();
      }
      obstacles = [];
    }

    function stopRace(message) {
      active = false;
      if (anim) {
        clearInterval(anim);
        anim = null;
      }
      if (spawn) {
        clearInterval(spawn);
        spawn = null;
      }
      status.textContent = message;
      startBtn.textContent = 'Start Race';
    }

    function spawnObstacle() {
      var lane = randomInt(0, 2);
      var el = document.createElement('span');
      el.className = 'obstacle ' + (Math.random() > 0.5 ? 'obstacle-rock' : 'obstacle-cone');
      el.style.left = laneLeft[lane] + '%';
      area.appendChild(el);
      obstacles.push({ el: el, lane: lane, top: -24 });
    }

    function moveCar(delta) {
      if (!active) {
        return;
      }
      laneIndex = Math.max(0, Math.min(2, laneIndex + delta));
      placeCar();
      if (audio.ensureAudio()) {
        audio.beep(500, 0.05, 'square', 0.04);
      }
    }

    leftBtn.addEventListener('click', function () {
      moveCar(-1);
    });
    rightBtn.addEventListener('click', function () {
      moveCar(1);
    });

    startBtn.addEventListener('click', function () {
      stopRace('Race restarted.');
      clearObstacles();
      laneIndex = 1;
      score = 0;
      lives = 3;
      active = true;
      placeCar();
      scoreEl.textContent = 'Distance: 0';
      livesEl.textContent = 'Lives: 3';
      status.textContent = 'Dodge obstacles!';
      startBtn.textContent = 'Restart Race';

      spawnObstacle();

      spawn = window.setInterval(spawnObstacle, 850);
      anim = window.setInterval(function () {
        score += 1;
        scoreEl.textContent = 'Distance: ' + score;

        var keep = [];
        for (var i = 0; i < obstacles.length; i += 1) {
          var obs = obstacles[i];
          obs.top += 6;
          obs.el.style.top = obs.top + 'px';

          if (obs.top > area.clientHeight - 55 && obs.top < area.clientHeight - 25 && obs.lane === laneIndex) {
            lives -= 1;
            livesEl.textContent = 'Lives: ' + lives;
            obs.el.remove();
            if (audio.ensureAudio()) {
              audio.beep(190, 0.15, 'sawtooth', 0.07);
            }
            if (lives <= 0) {
              stopRace('Crash! Final distance: ' + score + '.');
              clearObstacles();
              return;
            }
            continue;
          }

          if (obs.top > area.clientHeight + 20) {
            obs.el.remove();
            continue;
          }
          keep.push(obs);
        }
        obstacles = keep;
      }, 85);
    });

    window.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        moveCar(-1);
      } else if (event.key === 'ArrowRight') {
        moveCar(1);
      }
    });

    placeCar();
    applyCarSkin();
  }

  function setupSoccerGame(audio) {
    var startBtn = document.querySelector('[data-soccer-start]');
    var powerInput = document.querySelector('[data-soccer-power]');
    var kickBtn = document.querySelector('[data-soccer-kick]');
    var goalArea = document.querySelector('[data-soccer-goal]');
    var goalie = document.querySelector('[data-soccer-goalie]');
    var ball = document.querySelector('[data-soccer-ball]');
    var scoreEl = document.querySelector('[data-soccer-score]');
    var shotsEl = document.querySelector('[data-soccer-shots]');
    var statusEl = document.querySelector('[data-soccer-status]');
    if (!startBtn || !powerInput || !kickBtn || !goalArea || !goalie || !ball || !scoreEl || !shotsEl || !statusEl) {
      return;
    }

    var goalieTimer = null;
    var goalieX = 45;
    var goalieDir = 1;
    var goals = 0;
    var shots = 0;
    var active = false;

    function resetBall() {
      ball.style.left = '50%';
      ball.style.bottom = '10px';
      ball.style.transform = 'translateX(-50%) scale(1)';
    }

    function animateKick(targetX, isGoal) {
      ball.style.left = targetX + '%';
      ball.style.bottom = '84px';
      ball.style.transform = 'translateX(-50%) scale(' + (isGoal ? '1.15' : '0.95') + ')';
      window.setTimeout(resetBall, 280);
    }

    function stop() {
      active = false;
      if (goalieTimer) {
        clearInterval(goalieTimer);
        goalieTimer = null;
      }
      resetBall();
      startBtn.textContent = 'Start Soccer';
    }

    function start() {
      stop();
      active = true;
      goals = 0;
      shots = 0;
      goalieX = 45;
      goalieDir = 1;
      scoreEl.textContent = 'Goals: 0';
      shotsEl.textContent = 'Shots: 0';
      statusEl.textContent = 'Kick when goalie is away from your shot lane.';
      startBtn.textContent = 'Restart Soccer';
      resetBall();

      goalieTimer = window.setInterval(function () {
        goalieX += goalieDir * 2.4;
        if (goalieX > 80) {
          goalieX = 80;
          goalieDir = -1;
        }
        if (goalieX < 8) {
          goalieX = 8;
          goalieDir = 1;
        }
        goalie.style.left = goalieX + '%';
      }, 80);
    }

    startBtn.addEventListener('click', start);

    kickBtn.addEventListener('click', function () {
      if (!active) {
        return;
      }

      shots += 1;
      shotsEl.textContent = 'Shots: ' + shots;

      var power = Number(powerInput.value);
      var targetX = randomInt(10, 90);
      var goalieDistance = Math.abs(goalieX - targetX);
      var powerBonus = Math.max(0, 100 - Math.abs(70 - power));
      var goalChance = Math.min(92, Math.round((goalieDistance * 1.2) + (powerBonus * 0.4)));
      var roll = randomInt(1, 100);
      animateKick(targetX, roll <= goalChance);

      if (roll <= goalChance) {
        goals += 1;
        scoreEl.textContent = 'Goals: ' + goals;
        statusEl.textContent = 'Goal! Great kick to lane ' + targetX + '.';
        if (audio.ensureAudio()) {
          audio.beep(760, 0.1, 'triangle', 0.08);
          audio.beep(860, 0.1, 'triangle', 0.08);
        }
      } else {
        statusEl.textContent = 'Saved by goalie. Try a different power.';
        if (audio.ensureAudio()) {
          audio.beep(220, 0.16, 'sawtooth', 0.07);
        }
      }
    });
  }

  function setupSpellingGame(audio) {
    var startBtn = document.querySelector('[data-spell-start]');
    var scoreEl = document.querySelector('[data-spell-score]');
    var promptEl = document.querySelector('[data-spell-prompt]');
    var optionsEl = document.querySelector('[data-spell-options]');
    if (!startBtn || !scoreEl || !promptEl || !optionsEl) {
      return;
    }

    var bank = [
      { clue: 'A place with many books', answer: 'library', wrong: ['libary', 'librery'] },
      { clue: 'A giant mountain with lava', answer: 'volcano', wrong: ['volkano', 'volcanno'] },
      { clue: 'A sea animal with fins', answer: 'dolphin', wrong: ['dolfin', 'dolphine'] },
      { clue: 'A fast vehicle for roads', answer: 'racing', wrong: ['raecing', 'rasing'] },
      { clue: 'A friend who helps your team', answer: 'partner', wrong: ['partnar', 'parter'] }
    ];

    var score = 0;

    function nextRound() {
      var word = bank[randomInt(0, bank.length - 1)];
      promptEl.textContent = 'Door clue: ' + word.clue;

      var choices = shuffle([word.answer, word.wrong[0], word.wrong[1]]);
      optionsEl.innerHTML = '';
      for (var i = 0; i < choices.length; i += 1) {
        var option = choices[i];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'math-btn';
        btn.textContent = option;
        btn.addEventListener('click', function () {
          if (this.textContent === word.answer) {
            score += 1;
            scoreEl.textContent = 'Doors Opened: ' + score;
            promptEl.textContent = 'Door unlocked!';
            if (audio.ensureAudio()) {
              audio.beep(720, 0.1, 'triangle', 0.08);
            }
          } else {
            promptEl.textContent = 'Wrong key. Correct spelling was "' + word.answer + '".';
            if (audio.ensureAudio()) {
              audio.beep(220, 0.16, 'sawtooth', 0.07);
            }
          }
          window.setTimeout(nextRound, 600);
        });
        optionsEl.appendChild(btn);
      }
    }

    startBtn.addEventListener('click', function () {
      score = 0;
      scoreEl.textContent = 'Doors Opened: 0';
      nextRound();
    });
  }

  function init() {
    var audio = setupAudioEngine();
    setupMusic(audio);
    setupBalloonGame(audio);
    setupShapeGame(audio);
    setupAnimalGame(audio);
    setupStoryBuilder(audio);
    setupMemoryGame(audio);
    setupFishingGame(audio);
    setupDanceGame(audio);
    setupMathGame(audio);
    setupSurvivalGame(audio);
    setupRacingGame(audio);
    setupSoccerGame(audio);
    setupSpellingGame(audio);
  }

  if (document.body.getAttribute('data-app') === 'kids-games') {
    init();
  }
})();
