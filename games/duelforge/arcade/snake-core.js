(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.SnakeCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function pointKey(p) {
    return p.x + ',' + p.y;
  }

  function equalPoint(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function isOpposite(a, b) {
    return (a.x === -b.x && a.y === -b.y);
  }

  function randomFood(width, height, snake, rng) {
    var occupied = {};
    var i;
    for (i = 0; i < snake.length; i += 1) {
      occupied[pointKey(snake[i])] = true;
    }

    var available = [];
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        if (!occupied[x + ',' + y]) {
          available.push({ x: x, y: y });
        }
      }
    }

    if (!available.length) {
      return null;
    }

    var randomValue = typeof rng === 'function' ? rng() : Math.random();
    var index = Math.floor(Math.max(0, Math.min(0.999999, randomValue)) * available.length);
    return available[index];
  }

  function createInitialState(options) {
    var cfg = options || {};
    var width = cfg.width || 16;
    var height = cfg.height || 16;
    var centerX = Math.floor(width / 2);
    var centerY = Math.floor(height / 2);
    var snake = [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY }
    ];
    var direction = { x: 1, y: 0 };
    return {
      width: width,
      height: height,
      snake: snake,
      direction: direction,
      pendingDirection: direction,
      food: randomFood(width, height, snake, cfg.rng),
      score: 0,
      isGameOver: false,
      isPaused: false,
      rng: cfg.rng || Math.random
    };
  }

  function setDirection(state, nextDirection) {
    if (!state || state.isGameOver || !nextDirection) {
      return state;
    }

    if (isOpposite(state.direction, nextDirection)) {
      return state;
    }

    return {
      width: state.width,
      height: state.height,
      snake: state.snake.slice(),
      direction: state.direction,
      pendingDirection: { x: nextDirection.x, y: nextDirection.y },
      food: state.food ? { x: state.food.x, y: state.food.y } : null,
      score: state.score,
      isGameOver: state.isGameOver,
      isPaused: state.isPaused,
      rng: state.rng
    };
  }

  function togglePause(state) {
    if (!state || state.isGameOver) {
      return state;
    }

    return {
      width: state.width,
      height: state.height,
      snake: state.snake.slice(),
      direction: state.direction,
      pendingDirection: state.pendingDirection,
      food: state.food ? { x: state.food.x, y: state.food.y } : null,
      score: state.score,
      isGameOver: state.isGameOver,
      isPaused: !state.isPaused,
      rng: state.rng
    };
  }

  function stepState(state) {
    if (!state || state.isGameOver || state.isPaused) {
      return state;
    }

    var direction = state.pendingDirection || state.direction;
    var head = state.snake[0];
    var nextHead = {
      x: head.x + direction.x,
      y: head.y + direction.y
    };

    if (nextHead.x < 0 || nextHead.x >= state.width || nextHead.y < 0 || nextHead.y >= state.height) {
      return {
        width: state.width,
        height: state.height,
        snake: state.snake.slice(),
        direction: direction,
        pendingDirection: direction,
        food: state.food ? { x: state.food.x, y: state.food.y } : null,
        score: state.score,
        isGameOver: true,
        isPaused: false,
        rng: state.rng
      };
    }

    var grows = state.food && equalPoint(nextHead, state.food);
    var bodyToCheck = grows ? state.snake : state.snake.slice(0, state.snake.length - 1);
    for (var i = 0; i < bodyToCheck.length; i += 1) {
      if (equalPoint(bodyToCheck[i], nextHead)) {
        return {
          width: state.width,
          height: state.height,
          snake: state.snake.slice(),
          direction: direction,
          pendingDirection: direction,
          food: state.food ? { x: state.food.x, y: state.food.y } : null,
          score: state.score,
          isGameOver: true,
          isPaused: false,
          rng: state.rng
        };
      }
    }

    var newSnake = [nextHead];
    if (grows) {
      newSnake = newSnake.concat(state.snake);
    } else {
      newSnake = newSnake.concat(state.snake.slice(0, state.snake.length - 1));
    }

    var food = grows ? randomFood(state.width, state.height, newSnake, state.rng) : state.food;
    var score = grows ? state.score + 1 : state.score;

    return {
      width: state.width,
      height: state.height,
      snake: newSnake,
      direction: direction,
      pendingDirection: direction,
      food: food,
      score: score,
      isGameOver: false,
      isPaused: false,
      rng: state.rng
    };
  }

  return {
    createInitialState: createInitialState,
    setDirection: setDirection,
    stepState: stepState,
    togglePause: togglePause,
    randomFood: randomFood
  };
});
