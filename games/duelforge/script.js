(function () {
  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setupArcadePage() {
    var bgToggle = document.querySelector('[data-bg-toggle]');
    var bgTrack = document.querySelector('[data-bg-track]');
    var bgStatus = document.querySelector('[data-bg-status]');
    var gameButtons = document.querySelectorAll('.game-play');
    var resultCard = document.querySelector('[data-game-result]');

    if (!bgToggle || !bgTrack || !bgStatus || !resultCard) {
      return;
    }

    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    var audioContext = null;
    var bgTimer = null;
    var playingBg = false;
    var bgStep = 0;

    var backgroundTracks = {
      sunny: [523.25, 587.33, 659.25, 783.99, 698.46, 659.25, 587.33],
      ocean: [392.0, 440.0, 523.25, 493.88, 440.0, 392.0, 349.23],
      adventure: [329.63, 392.0, 440.0, 523.25, 493.88, 440.0, 392.0]
    };

    var gameThemes = {
      fishing: {
        notes: [392.0, 440.0, 523.25, 440.0],
        mission: 'Fishing Cove mission: Catch 5 shiny fish, find 1 cave chest, and upgrade your rod.'
      },
      volcano: {
        notes: [440.0, 523.25, 587.33, 659.25],
        mission: 'Volcano Dash mission: Cross 3 lava paths, decode 2 map clues, and escape in 90 seconds.'
      },
      survival: {
        notes: [329.63, 392.0, 349.23, 440.0],
        mission: 'Island Survival mission: Gather 8 food items, build 1 shelter, and light a night beacon.'
      },
      dance: {
        notes: [523.25, 659.25, 783.99, 659.25],
        mission: 'Beat Buddy Dance mission: Hit a 20-note combo, win 1 pair battle, and unlock a neon stage.'
      },
      creative: {
        notes: [587.33, 659.25, 698.46, 783.99],
        mission: 'Creative Sandbox mission: Build a tiny town, style your avatar, and publish a safe showcase.'
      },
      learning: {
        notes: [349.23, 392.0, 440.0, 523.25],
        mission: 'Learning Quest mission: Solve math for raft power, spelling for magic doors, and science for garden growth.'
      },
      snake: {
        notes: [261.63, 329.63, 392.0, 523.25],
        mission: 'Snake mission: Eat food, grow your tail, and survive as long as possible on the grid.'
      }
    };
    var playTargets = {
      fishing: 'kids-games.html#fishing-catch',
      volcano: 'all-ages-games.html#volcano-escape',
      survival: 'all-ages-games.html#survival-camp',
      dance: 'kids-games.html#beat-dance',
      creative: 'all-ages-games.html#creative-studio',
      learning: 'all-ages-games.html#learning-lab',
      snake: 'snake-game.html'
    };

    function ensureAudio() {
      if (!AudioContextCtor) {
        bgStatus.textContent = 'Music is unavailable in this browser.';
        return false;
      }

      if (!audioContext) {
        audioContext = new AudioContextCtor();
      }
      return true;
    }

    function playBeep(freq, duration, type, volume) {
      if (!audioContext) {
        return;
      }

      var now = audioContext.currentTime;
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();

      oscillator.type = type || 'triangle';
      oscillator.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume || 0.09, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    }

    function stopBackgroundMusic() {
      if (bgTimer) {
        clearInterval(bgTimer);
        bgTimer = null;
      }
      playingBg = false;
      bgToggle.textContent = 'Play Background Music';
      bgStatus.textContent = 'Background music is paused.';
    }

    function playBackgroundStep() {
      var seq = backgroundTracks[bgTrack.value] || backgroundTracks.sunny;
      var base = seq[bgStep % seq.length];
      playBeep(base, 0.18, 'triangle', 0.08);
      if (bgStep % 2 === 0) {
        playBeep(base * 0.5, 0.22, 'sine', 0.04);
      }
      bgStep += 1;
    }

    function startBackgroundMusic() {
      if (!ensureAudio()) {
        return;
      }

      audioContext.resume().then(function () {
        if (bgTimer) {
          clearInterval(bgTimer);
        }
        playingBg = true;
        bgStep = 0;
        playBackgroundStep();
        bgTimer = window.setInterval(playBackgroundStep, 250);
        bgToggle.textContent = 'Pause Background Music';
        bgStatus.textContent = 'Now playing: ' + bgTrack.options[bgTrack.selectedIndex].text + '.';
      }).catch(function () {
        bgStatus.textContent = 'Tap play again to start music.';
      });
    }

    function playGameTheme(gameKey) {
      var theme = gameThemes[gameKey];
      if (!theme || !ensureAudio()) {
        return;
      }

      audioContext.resume().then(function () {
        for (var i = 0; i < theme.notes.length; i += 1) {
          (function (index) {
            window.setTimeout(function () {
              playBeep(theme.notes[index], 0.16, 'square', 0.1);
            }, index * 170);
          })(i);
        }
      });
    }

    bgToggle.addEventListener('click', function () {
      if (playingBg) {
        stopBackgroundMusic();
        return;
      }
      startBackgroundMusic();
    });

    bgTrack.addEventListener('change', function () {
      if (!playingBg) {
        return;
      }
      bgStep = 0;
      bgStatus.textContent = 'Switched to: ' + bgTrack.options[bgTrack.selectedIndex].text + '.';
    });

    for (var i = 0; i < gameButtons.length; i += 1) {
      gameButtons[i].addEventListener('click', function () {
        var card = this.closest('.game-card');
        if (!card) {
          return;
        }

        var game = card.getAttribute('data-game') || '';
        var title = card.querySelector('h3');
        var gameName = title ? title.textContent : 'Game';
        var theme = gameThemes[game];

        playGameTheme(game);

        if (theme) {
          var target = playTargets[game] || 'kids-games.html';
          resultCard.innerHTML =
            '<strong>' + escapeHTML(gameName) + ' ready!</strong><br>' +
            escapeHTML(theme.mission) +
            '<br><a class="btn btn-soft" href="' + escapeHTML(target) + '">Open Playable Version</a>';
          window.setTimeout(function () {
            window.location.href = target;
          }, 280);
        } else {
          resultCard.textContent = gameName + ' is loading with a surprise challenge.';
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (bgTimer) {
        clearInterval(bgTimer);
      }
    });
  }

  if (document.body.getAttribute('data-app') === 'arcade') {
    setupArcadePage();
  }
})();
