(function () {
  function setupSnakeGame() {
    if (!window.SnakeCore) {
      return;
    }

    var board = document.querySelector('[data-snake-board]');
    var scoreEl = document.querySelector('[data-snake-score]');
    var bestEl = document.querySelector('[data-snake-best]');
    var statusEl = document.querySelector('[data-snake-status]');
    var restartBtn = document.querySelector('[data-snake-restart]');
    var pauseBtn = document.querySelector('[data-snake-pause]');
    var controlButtons = document.querySelectorAll('[data-snake-dir]');
    if (!board || !scoreEl || !bestEl || !statusEl || !restartBtn || !pauseBtn) {
      return;
    }

    var GRID = 16;
    var TICK_MS = 140;
    var timer = null;
    var best = Number(localStorage.getItem('snake-best-score') || '0');
    var state = window.SnakeCore.createInitialState({ width: GRID, height: GRID });
    var cells = [];
    var directions = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };

    function cellIndex(x, y) {
      return y * GRID + x;
    }

    function buildBoard() {
      board.innerHTML = '';
      board.style.setProperty('--snake-grid-size', String(GRID));
      cells = [];
      for (var i = 0; i < GRID * GRID; i += 1) {
        var cell = document.createElement('span');
        cell.className = 'snake-cell';
        board.appendChild(cell);
        cells.push(cell);
      }
    }

    function render() {
      for (var i = 0; i < cells.length; i += 1) {
        cells[i].className = 'snake-cell';
      }

      if (state.food) {
        cells[cellIndex(state.food.x, state.food.y)].classList.add('food');
      }

      for (var s = 0; s < state.snake.length; s += 1) {
        var part = state.snake[s];
        var index = cellIndex(part.x, part.y);
        cells[index].classList.add(s === 0 ? 'snake-head' : 'snake-body');
      }

      scoreEl.textContent = String(state.score);
      bestEl.textContent = String(best);
      if (state.isGameOver) {
        statusEl.textContent = 'Game over. Press Restart.';
      } else if (state.isPaused) {
        statusEl.textContent = 'Paused.';
      } else {
        statusEl.textContent = 'Running.';
      }
      pauseBtn.textContent = state.isPaused ? 'Resume' : 'Pause';
    }

    function endRoundIfNeeded() {
      if (!state.isGameOver) {
        return;
      }

      if (state.score > best) {
        best = state.score;
        localStorage.setItem('snake-best-score', String(best));
      }
    }

    function tick() {
      state = window.SnakeCore.stepState(state);
      endRoundIfNeeded();
      render();
    }

    function startLoop() {
      if (timer) {
        clearInterval(timer);
      }
      timer = window.setInterval(tick, TICK_MS);
    }

    function setDir(direction) {
      state = window.SnakeCore.setDirection(state, direction);
      render();
    }

    function restart() {
      state = window.SnakeCore.createInitialState({ width: GRID, height: GRID });
      render();
    }

    function handleKeydown(event) {
      var key = event.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') setDir(directions.up);
      if (key === 'arrowdown' || key === 's') setDir(directions.down);
      if (key === 'arrowleft' || key === 'a') setDir(directions.left);
      if (key === 'arrowright' || key === 'd') setDir(directions.right);
      if (key === ' ') {
        event.preventDefault();
        state = window.SnakeCore.togglePause(state);
        render();
      }
      if (key === 'r') {
        restart();
      }
    }

    restartBtn.addEventListener('click', restart);
    pauseBtn.addEventListener('click', function () {
      state = window.SnakeCore.togglePause(state);
      render();
    });

    for (var i = 0; i < controlButtons.length; i += 1) {
      controlButtons[i].addEventListener('click', function () {
        var key = this.getAttribute('data-snake-dir');
        if (key && directions[key]) {
          setDir(directions[key]);
        }
      });
    }

    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('beforeunload', function () {
      if (timer) {
        clearInterval(timer);
      }
    });

    buildBoard();
    render();
    startLoop();
  }

  if (document.body.getAttribute('data-app') === 'snake-game') {
    setupSnakeGame();
  }
})();
