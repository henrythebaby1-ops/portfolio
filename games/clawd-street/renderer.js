const worldEl = document.getElementById('world');
const houseEl = document.getElementById('house');
const clawdLayerEl = document.getElementById('clawd-layer');
const crabLayerEl = document.getElementById('crab-layer');
const potionLayerEl = document.getElementById('potion-layer');
const towelLayerEl = document.getElementById('towel-layer');
const weatherCanvas = document.getElementById('weather-canvas');
const statusLineEl = document.getElementById('status-line');
const weatherLineEl = document.getElementById('weather-line');
const addClawdButton = document.getElementById('add-clawd-button');
const feedCrabButton = document.getElementById('feed-crab-button');
const dropTowelButton = document.getElementById('drop-towel-button');
const dropClimbPotionButton = document.getElementById('drop-climb-potion-button');
const dropFlyPotionButton = document.getElementById('drop-fly-potion-button');
const clearWorldButton = document.getElementById('clear-world-button');
const dayButton = document.getElementById('day-button');
const nightButton = document.getElementById('night-button');
const weatherSelect = document.getElementById('weather-select');

const weatherCtx = weatherCanvas.getContext('2d');

const PIXEL = 8;
const CLAWD_WIDTH = 15 * PIXEL;
const CLAWD_HEIGHT = 12 * PIXEL;
const CRAB_WIDTH = 9 * PIXEL;
const CRAB_HEIGHT = 6 * PIXEL;
const POTION_WIDTH = 7 * PIXEL;
const POTION_HEIGHT = 8 * PIXEL;
const TOWEL_WIDTH = 10 * PIXEL;
const TOWEL_HEIGHT = 6 * PIXEL;
const GROUND_OFFSET = 106;
const STACK_MARGIN = 6;

const state = {
  worldWidth: 0,
  worldHeight: 0,
  timeOfDay: 'day',
  weather: 'clear',
  houseVisible: true,
  lastFrame: performance.now(),
  particles: [],
  clawds: [],
  crabs: [],
  potions: [],
  towels: [],
  nextClawdId: 1,
  nextCrabId: 1,
  nextPotionId: 1,
  nextTowelId: 1,
  drag: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function groundY() {
  return state.worldHeight - GROUND_OFFSET;
}

function baseFloorY() {
  return groundY() - CLAWD_HEIGHT;
}

function houseX() {
  return Math.round(state.worldWidth * 0.64);
}

function houseSleepSpot(index) {
  const offsets = [28, -38, 82, -88, 0];
  const offset = offsets[index % offsets.length];
  return clamp(houseX() + 52 + offset, 24, state.worldWidth - CLAWD_WIDTH - 24);
}

function chooseDayTarget() {
  const leftBound = 40;
  const rightBound = Math.max(leftBound + 80, houseX() - CLAWD_WIDTH - 26);
  return randomBetween(leftBound, rightBound);
}

function updateHouseVisibility() {
  houseEl.classList.toggle('is-hidden', !state.houseVisible);
}

function resizeWorld() {
  state.worldWidth = worldEl.clientWidth;
  state.worldHeight = worldEl.clientHeight;
  weatherCanvas.width = state.worldWidth;
  weatherCanvas.height = state.worldHeight;

  for (const [index, clawd] of state.clawds.entries()) {
    clawd.x = clamp(clawd.x, 16, state.worldWidth - CLAWD_WIDTH - 16);
    clawd.y = clamp(clawd.y, 18, baseFloorY());
    if (state.timeOfDay === 'night') {
      clawd.targetX = houseSleepSpot(index);
    } else if (!clawd.foodTargetId && !clawd.potionTargetId) {
      clawd.targetX = chooseDayTarget();
    }
    updateClawdPosition(clawd);
  }

  for (const crab of state.crabs) {
    crab.x = clamp(crab.x, 18, state.worldWidth - CRAB_WIDTH - 18);
    crab.y = groundY() - CRAB_HEIGHT + 4;
    updateCrabPosition(crab);
  }

  for (const potion of state.potions) {
    potion.x = clamp(potion.x, 18, state.worldWidth - POTION_WIDTH - 18);
    potion.y = groundY() - POTION_HEIGHT + 2;
    updatePotionPosition(potion);
  }

  for (const towel of state.towels) {
    towel.x = clamp(towel.x, 18, state.worldWidth - TOWEL_WIDTH - 18);
    towel.y = groundY() - TOWEL_HEIGHT + 4;
    updateTowelPosition(towel);
  }
}

function setTimeOfDay(mode) {
  state.timeOfDay = mode;
  worldEl.classList.toggle('is-night', mode === 'night');
  worldEl.classList.toggle('is-day', mode === 'day');

  for (const [index, clawd] of state.clawds.entries()) {
    clawd.waitTimer = 0;
    clawd.foodTargetId = null;
    clawd.eatTimer = 0;
    clawd.targetX = mode === 'night' ? houseSleepSpot(index) : chooseDayTarget();
  }

  updateStatus();
}

function setWeather(mode) {
  state.weather = mode;
  if (mode === 'clear') {
    state.particles = [];
  }
  updateStatus();
}

function createClawd(x = null) {
  const element = document.createElement('div');
  element.className = 'clawd';
  element.dataset.id = String(state.nextClawdId);

  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  element.appendChild(canvas);
  clawdLayerEl.appendChild(element);

  const clawd = {
    id: state.nextClawdId++,
    element,
    canvas,
    ctx: canvas.getContext('2d'),
    x: x ?? randomBetween(40, Math.max(60, houseX() - CLAWD_WIDTH - 40)),
    y: baseFloorY(),
    vx: Math.random() > 0.5 ? 1 : -1,
    vy: 0,
    facing: Math.random() > 0.5 ? 1 : -1,
    mood: 'idle',
    blinkTimer: randomBetween(1.8, 4.6),
    blinkLeft: 0,
    walkCycle: randomBetween(0, Math.PI * 2),
    waitTimer: randomBetween(0.2, 1.1),
    targetX: chooseDayTarget(),
    dragging: false,
    wetness: 0,
    foodTargetId: null,
    potionTargetId: null,
    towelTargetId: null,
    eatTimer: 0,
    potionType: null,
    potionTimer: 0,
    climbDirection: -1,
    flyPhase: randomBetween(0, Math.PI * 2),
    stackCarrierId: null
  };

  element.addEventListener('pointerdown', (event) => {
    beginDrag(event, clawd);
  });

  state.clawds.push(clawd);
  updateClawdPosition(clawd);
  drawClawd(clawd);
}

function createCrab(x = null) {
  const element = document.createElement('div');
  element.className = 'crab';
  element.dataset.id = String(state.nextCrabId);

  const canvas = document.createElement('canvas');
  canvas.width = 72;
  canvas.height = 48;
  element.appendChild(canvas);
  crabLayerEl.appendChild(element);

  const crab = {
    id: state.nextCrabId++,
    element,
    canvas,
    ctx: canvas.getContext('2d'),
    x: x ?? randomBetween(40, state.worldWidth - CRAB_WIDTH - 40),
    y: groundY() - CRAB_HEIGHT + 4
  };

  state.crabs.push(crab);
  updateCrabPosition(crab);
  drawCrab(crab);
}

function createPotion(type, x = null) {
  const element = document.createElement('div');
  element.className = 'potion';
  element.dataset.id = String(state.nextPotionId);

  const canvas = document.createElement('canvas');
  canvas.width = 56;
  canvas.height = 64;
  element.appendChild(canvas);
  potionLayerEl.appendChild(element);

  const potion = {
    id: state.nextPotionId++,
    type,
    element,
    canvas,
    ctx: canvas.getContext('2d'),
    x: x ?? randomBetween(40, state.worldWidth - POTION_WIDTH - 40),
    y: groundY() - POTION_HEIGHT + 2
  };

  state.potions.push(potion);
  updatePotionPosition(potion);
  drawPotion(potion);
}

function createTowel(x = null) {
  const element = document.createElement('div');
  element.className = 'towel';
  element.dataset.id = String(state.nextTowelId);

  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 48;
  element.appendChild(canvas);
  towelLayerEl.appendChild(element);

  const towel = {
    id: state.nextTowelId++,
    element,
    canvas,
    ctx: canvas.getContext('2d'),
    x: x ?? randomBetween(40, state.worldWidth - TOWEL_WIDTH - 40),
    y: groundY() - TOWEL_HEIGHT + 4
  };

  state.towels.push(towel);
  updateTowelPosition(towel);
  drawTowel(towel);
}

function removeAllClawds() {
  for (const clawd of state.clawds) {
    clawd.element.remove();
  }
  state.clawds = [];
  state.drag = null;
}

function removeAllCrabs() {
  for (const crab of state.crabs) {
    crab.element.remove();
  }
  state.crabs = [];
  for (const clawd of state.clawds) {
    clawd.foodTargetId = null;
  }
}

function removeAllPotions() {
  for (const potion of state.potions) {
    potion.element.remove();
  }
  state.potions = [];
  for (const clawd of state.clawds) {
    clawd.potionTargetId = null;
  }
}

function removeAllTowels() {
  for (const towel of state.towels) {
    towel.element.remove();
  }
  state.towels = [];
  for (const clawd of state.clawds) {
    clawd.towelTargetId = null;
  }
}

function getClawdById(id) {
  return state.clawds.find((clawd) => clawd.id === id) ?? null;
}

function getCrabById(id) {
  return state.crabs.find((crab) => crab.id === id) ?? null;
}

function getPotionById(id) {
  return state.potions.find((potion) => potion.id === id) ?? null;
}

function getTowelById(id) {
  return state.towels.find((towel) => towel.id === id) ?? null;
}

function removeCrabById(id) {
  const index = state.crabs.findIndex((crab) => crab.id === id);
  if (index === -1) {
    return;
  }

  const [crab] = state.crabs.splice(index, 1);
  crab.element.remove();
  for (const clawd of state.clawds) {
    if (clawd.foodTargetId === id) {
      clawd.foodTargetId = null;
      clawd.eatTimer = 0;
    }
  }
}

function removePotionById(id) {
  const index = state.potions.findIndex((potion) => potion.id === id);
  if (index === -1) {
    return;
  }

  const [potion] = state.potions.splice(index, 1);
  potion.element.remove();
  for (const clawd of state.clawds) {
    if (clawd.potionTargetId === id) {
      clawd.potionTargetId = null;
    }
  }
}

function removeTowelById(id) {
  const index = state.towels.findIndex((towel) => towel.id === id);
  if (index === -1) {
    return;
  }

  const [towel] = state.towels.splice(index, 1);
  towel.element.remove();
  for (const clawd of state.clawds) {
    if (clawd.towelTargetId === id) {
      clawd.towelTargetId = null;
    }
  }
}

function updateClawdPosition(clawd) {
  clawd.element.style.transform = `translate(${Math.round(clawd.x)}px, ${Math.round(clawd.y)}px)`;
}

function updateCrabPosition(crab) {
  crab.element.style.transform = `translate(${Math.round(crab.x)}px, ${Math.round(crab.y)}px)`;
}

function updatePotionPosition(potion) {
  potion.element.style.transform = `translate(${Math.round(potion.x)}px, ${Math.round(potion.y)}px)`;
}

function updateTowelPosition(towel) {
  towel.element.style.transform = `translate(${Math.round(towel.x)}px, ${Math.round(towel.y)}px)`;
}

function drawPixel(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * PIXEL, y * PIXEL, width * PIXEL, height * PIXEL);
}

function drawClawd(clawd) {
  const ctx = clawd.ctx;
  const sleeping = clawd.mood === 'sleeping';
  const walking = clawd.mood === 'walking';
  const dragged = clawd.dragging;
  const climbing = clawd.potionType === 'climb';
  const flying = clawd.potionType === 'fly';
  const frame = walking && Math.sin(clawd.walkCycle) > 0 ? 1 : 0;
  const wet = clawd.wetness > 12;

  ctx.clearRect(0, 0, clawd.canvas.width, clawd.canvas.height);
  ctx.save();
  ctx.translate(20, 24);

  if (clawd.facing < 0 && !sleeping) {
    ctx.translate(CLAWD_WIDTH, 0);
    ctx.scale(-1, 1);
  }

  const body = sleeping ? '#d69382' : wet ? '#cf8f83' : dragged ? '#e79a86' : '#e28a73';
  const shadow = sleeping ? '#c27966' : wet ? '#a86d65' : dragged ? '#cf7b67' : '#c96f59';
  const eye = '#141414';
  const blush = sleeping ? '#e6a497' : '#f0ad9f';

  drawPixel(ctx, 0, 11, 15, 1, 'rgba(0, 0, 0, 0.12)');

  if (sleeping) {
    drawPixel(ctx, 2, 5, 12, 4, body);
    drawPixel(ctx, 4, 3, 8, 2, body);
    drawPixel(ctx, 1, 6, 2, 2, body);
    drawPixel(ctx, 13, 6, 2, 2, body);
    drawPixel(ctx, 3, 9, 2, 2, body);
    drawPixel(ctx, 10, 9, 2, 2, body);
    drawPixel(ctx, 4, 6, 2, 1, eye);
    drawPixel(ctx, 10, 6, 2, 1, eye);
    drawPixel(ctx, 3, 7, 1, 1, blush);
    drawPixel(ctx, 11, 7, 1, 1, blush);
  } else {
    drawPixel(ctx, 4, 0, 8, 2, body);
    drawPixel(ctx, 2, 2, 12, 5, body);
    drawPixel(ctx, 0, 3, 2, 2, body);
    drawPixel(ctx, 13, 3, 2, 2, body);
    drawPixel(ctx, 11, 1, 1, 1, shadow);
    drawPixel(ctx, 13, 4, 1, 3, shadow);
    drawPixel(ctx, 4, 6, 10, 1, shadow);

    drawPixel(ctx, 2, 7 + frame, 1, 4 - frame, body);
    drawPixel(ctx, 5, 7, 1, 4, body);
    drawPixel(ctx, 8, 8 - frame, 1, 3 + frame, body);
    drawPixel(ctx, 11, 7, 1, 4, body);

    if (dragged) {
      drawPixel(ctx, 4, 3, 1, 1, eye);
      drawPixel(ctx, 5, 4, 1, 1, eye);
      drawPixel(ctx, 10, 4, 1, 1, eye);
      drawPixel(ctx, 11, 3, 1, 1, eye);
      drawPixel(ctx, 7, 5, 1, 1, shadow);
      drawPixel(ctx, 8, 5, 1, 1, shadow);
    } else if (clawd.blinkLeft > 0) {
      drawPixel(ctx, 4, 3, 2, 1, eye);
      drawPixel(ctx, 10, 3, 2, 1, eye);
    } else {
      drawPixel(ctx, 4, 3, 2, 2, eye);
      drawPixel(ctx, 10, 3, 2, 2, eye);
    }
  }

  ctx.restore();

  if (wet) {
    ctx.fillStyle = 'rgba(132, 198, 255, 0.7)';
    ctx.fillRect(54, 30, 10, 10);
    ctx.fillRect(80, 18, 10, 10);
    ctx.fillRect(96, 38, 8, 8);
  }

  if (sleeping) {
    ctx.fillStyle = '#c7d9ff';
    ctx.fillRect(122, 28, 10, 10);
    ctx.fillRect(130, 20, 10, 10);
    ctx.fillRect(138, 12, 10, 10);
  }

  if (climbing) {
    ctx.fillStyle = '#89ff8a';
    ctx.fillRect(124, 18, 10, 10);
    ctx.fillRect(132, 10, 10, 10);
  }

  if (flying) {
    ctx.fillStyle = '#9fd2ff';
    ctx.fillRect(18, 26, 8, 8);
    ctx.fillRect(130, 24, 8, 8);
  }
}

function drawCrab(crab) {
  const ctx = crab.ctx;
  ctx.clearRect(0, 0, crab.canvas.width, crab.canvas.height);
  drawPixel(ctx, 1, 4, 7, 2, '#ff8f5f');
  drawPixel(ctx, 2, 3, 5, 1, '#ff9f73');
  drawPixel(ctx, 0, 3, 1, 1, '#ff8f5f');
  drawPixel(ctx, 8, 3, 1, 1, '#ff8f5f');
  drawPixel(ctx, 1, 2, 1, 1, '#141414');
  drawPixel(ctx, 7, 2, 1, 1, '#141414');
  drawPixel(ctx, 0, 1, 2, 1, '#ff8f5f');
  drawPixel(ctx, 7, 1, 2, 1, '#ff8f5f');
  drawPixel(ctx, 2, 5, 1, 1, '#db7048');
  drawPixel(ctx, 6, 5, 1, 1, '#db7048');
}

function drawPotion(potion) {
  const ctx = potion.ctx;
  const glass = potion.type === 'climb' ? '#b4ffb9' : '#b7e0ff';
  const liquid = potion.type === 'climb' ? '#4ad75e' : '#63a9ff';
  ctx.clearRect(0, 0, potion.canvas.width, potion.canvas.height);
  drawPixel(ctx, 2, 0, 3, 1, '#f5e0a6');
  drawPixel(ctx, 2, 1, 3, 1, '#c89c5a');
  drawPixel(ctx, 1, 2, 5, 1, glass);
  drawPixel(ctx, 1, 3, 5, 4, liquid);
  drawPixel(ctx, 0, 4, 1, 2, glass);
  drawPixel(ctx, 6, 4, 1, 2, glass);
  drawPixel(ctx, 2, 7, 3, 1, glass);
}

function drawTowel(towel) {
  const ctx = towel.ctx;
  ctx.clearRect(0, 0, towel.canvas.width, towel.canvas.height);
  drawPixel(ctx, 0, 3, 10, 3, '#f9f4ff');
  drawPixel(ctx, 1, 2, 8, 1, '#d7ccff');
  drawPixel(ctx, 1, 6, 8, 1, '#d7ccff');
  drawPixel(ctx, 2, 4, 1, 1, '#bfaef2');
  drawPixel(ctx, 4, 4, 1, 1, '#bfaef2');
  drawPixel(ctx, 6, 4, 1, 1, '#bfaef2');
 }

function getStackSupport(clawd) {
  let supportY = baseFloorY();
  let supportId = null;

  for (const other of state.clawds) {
    if (other.id === clawd.id || other.dragging || other.potionType === 'fly') {
      continue;
    }

    const horizontalOverlap = clawd.x + CLAWD_WIDTH - STACK_MARGIN > other.x &&
      clawd.x + STACK_MARGIN < other.x + CLAWD_WIDTH;
    if (!horizontalOverlap) {
      continue;
    }

    const otherTop = other.y - CLAWD_HEIGHT + 10;
    if (clawd.y <= otherTop + 36 && otherTop < supportY) {
      supportY = otherTop;
      supportId = other.id;
    }
  }

  return { y: supportY, id: supportId };
}

function assignNearbyCrab(clawd) {
  if (state.crabs.length === 0 || state.timeOfDay === 'night') {
    return;
  }

  const nearest = state.crabs.reduce((best, crab) => {
    const distance = Math.abs(crab.x - clawd.x);
    if (!best || distance < best.distance) {
      return { id: crab.id, distance };
    }
    return best;
  }, null);

  if (nearest && nearest.distance < 320) {
    clawd.foodTargetId = nearest.id;
    const crab = getCrabById(nearest.id);
    if (crab) {
      clawd.targetX = crab.x;
    }
  }
}

function assignNearbyPotion(clawd) {
  if (state.potions.length === 0 || state.timeOfDay === 'night') {
    return;
  }

  const nearest = state.potions.reduce((best, potion) => {
    const distance = Math.abs(potion.x - clawd.x);
    if (!best || distance < best.distance) {
      return { id: potion.id, distance };
    }
    return best;
  }, null);

  if (nearest && nearest.distance < 360) {
    clawd.potionTargetId = nearest.id;
    const potion = getPotionById(nearest.id);
    if (potion) {
      clawd.targetX = potion.x;
    }
  }
}

function assignNearbyTowel(clawd) {
  if (state.towels.length === 0 || clawd.wetness <= 18 || state.timeOfDay === 'night') {
    return;
  }

  const nearest = state.towels.reduce((best, towel) => {
    const distance = Math.abs(towel.x - clawd.x);
    if (!best || distance < best.distance) {
      return { id: towel.id, distance };
    }
    return best;
  }, null);

  if (nearest && nearest.distance < 360) {
    clawd.towelTargetId = nearest.id;
    const towel = getTowelById(nearest.id);
    if (towel) {
      clawd.targetX = towel.x;
    }
  }
}

function beginDrag(event, clawd) {
  event.preventDefault();
  state.drag = {
    clawd,
    pointerId: event.pointerId,
    offsetX: event.clientX - clawd.x,
    offsetY: event.clientY - clawd.y
  };
  clawd.dragging = true;
  clawd.vx = 0;
  clawd.vy = 0;
  clawd.waitTimer = 0;
  clawd.stackCarrierId = null;
  clawd.element.classList.add('is-dragging');
  clawd.element.setPointerCapture(event.pointerId);
}

function updateDrag(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) {
    return;
  }

  const { clawd, offsetX, offsetY } = state.drag;
  clawd.x = clamp(event.clientX - offsetX, 18, state.worldWidth - CLAWD_WIDTH - 18);
  clawd.y = clamp(event.clientY - offsetY, 18, groundY() - CLAWD_HEIGHT);
  clawd.targetX = clawd.x;
  clawd.mood = 'idle';
  updateClawdPosition(clawd);
  drawClawd(clawd);
}

function endDrag(event) {
  if (!state.drag || event.pointerId !== state.drag.pointerId) {
    return;
  }

  const { clawd } = state.drag;
  clawd.dragging = false;
  clawd.element.classList.remove('is-dragging');
  if (clawd.element.hasPointerCapture(event.pointerId)) {
    clawd.element.releasePointerCapture(event.pointerId);
  }
  const support = getStackSupport(clawd);
  clawd.stackCarrierId = support.id;
  clawd.waitTimer = 0.4;
  state.drag = null;
}

function updateStatus() {
  const count = state.clawds.length;
  const crabCount = state.crabs.length;
  const potionCount = state.potions.length;
  const stacking = state.clawds.filter((clawd) => clawd.stackCarrierId).length;

  if (count === 0) {
    statusLineEl.textContent = 'Everything disappeared. Add a Clawd to bring the street back.';
  } else if (state.timeOfDay === 'night') {
    statusLineEl.textContent = `${count} Clawd${count > 1 ? 's are' : ' is'} sleeping by the house.`;
  } else if (state.towels.length > 0) {
    statusLineEl.textContent = `${count} Clawd${count > 1 ? 's are' : ' is'} looking for a towel.`;
  } else if (potionCount > 0) {
    statusLineEl.textContent = `${count} Clawd${count > 1 ? 's are' : ' is'} chasing ${potionCount} potion${potionCount > 1 ? 's' : ''}.`;
  } else if (crabCount > 0) {
    statusLineEl.textContent = `${count} Clawd${count > 1 ? 's are' : ' is'} chasing ${crabCount} crab${crabCount > 1 ? 's' : ''}.`;
  } else if (stacking > 0) {
    statusLineEl.textContent = `${stacking} Clawd${stacking > 1 ? 's are' : ' is'} stacked on a friend.`;
  } else {
    statusLineEl.textContent = `${count} Clawd${count > 1 ? 's are' : ' is'} patrolling the street.`;
  }

  const weatherText = {
    clear: state.timeOfDay === 'night' ? 'The night air is calm and quiet.' : 'The city is bright and still.',
    rain: state.timeOfDay === 'night' ? 'Soft rain falls over the sleepy city.' : 'A cozy rain drifts across the city street.',
    snow: 'Gentle snowflakes drift down in chunky pixels.',
    wind: 'A playful wind pushes through the skyline.',
    fog: 'A pale fog settles low across the street.'
  };
  weatherLineEl.textContent = weatherText[state.weather];
}

function applyPotion(clawd, type) {
  clawd.potionType = type;
  clawd.potionTimer = 12;
  clawd.potionTargetId = null;
  clawd.foodTargetId = null;
  clawd.eatTimer = 0;
  clawd.waitTimer = 0.3;
}

function updatePotionState(clawd, delta) {
  if (!clawd.potionType) {
    return false;
  }

  clawd.potionTimer = Math.max(0, clawd.potionTimer - delta);
  if (clawd.potionTimer <= 0) {
    clawd.potionType = null;
    clawd.vy = 0;
    return false;
  }

  if (clawd.potionType === 'climb') {
    const wallX = clawd.facing > 0 ? state.worldWidth - CLAWD_WIDTH - 12 : 12;
    if (Math.abs(clawd.x - wallX) > 4) {
      clawd.x += Math.sign(wallX - clawd.x) * 1.8;
      clawd.y = clamp(clawd.y, 18, baseFloorY());
      clawd.mood = 'walking';
      clawd.walkCycle += delta * 12;
    } else {
      clawd.x = wallX;
      clawd.y += clawd.climbDirection * 95 * delta;
      if (clawd.y <= 18) {
        clawd.climbDirection = 1;
        clawd.facing *= -1;
      }
      if (clawd.y >= baseFloorY()) {
        clawd.y = baseFloorY();
        clawd.climbDirection = -1;
        clawd.facing *= -1;
      }
      clawd.mood = 'walking';
      clawd.walkCycle += delta * 10;
    }
    updateClawdPosition(clawd);
    drawClawd(clawd);
    return true;
  }

  if (clawd.potionType === 'fly') {
    clawd.flyPhase += delta * 4;
    if (clawd.waitTimer <= 0) {
      clawd.targetX = clamp(clawd.targetX + randomBetween(-180, 180), 40, state.worldWidth - CLAWD_WIDTH - 40);
      clawd.waitTimer = randomBetween(1.2, 2.4);
    } else {
      clawd.waitTimer -= delta;
    }
    clawd.x += Math.sign(clawd.targetX - clawd.x) * 1.6;
    clawd.y = clamp(baseFloorY() - 110 + Math.sin(clawd.flyPhase) * 60, 20, baseFloorY() - 16);
    clawd.facing = clawd.targetX >= clawd.x ? 1 : -1;
    clawd.mood = 'walking';
    clawd.walkCycle += delta * 12;
    updateClawdPosition(clawd);
    drawClawd(clawd);
    return true;
  }

  return false;
}

function updateClawd(clawd, index, delta) {
  if (clawd.dragging) {
    clawd.wetness = Math.min(100, clawd.wetness + (state.weather === 'rain' ? 22 : -14) * delta);
    drawClawd(clawd);
    return;
  }

  clawd.wetness = clamp(
    clawd.wetness + (state.weather === 'rain' ? 16 : -10) * delta,
    0,
    100
  );

  clawd.blinkTimer -= delta;
  if (clawd.blinkTimer <= 0) {
    clawd.blinkLeft = 0.14;
    clawd.blinkTimer = randomBetween(1.8, 4.6);
  }
  clawd.blinkLeft = Math.max(0, clawd.blinkLeft - delta);

  if (updatePotionState(clawd, delta)) {
    return;
  }

  if (state.timeOfDay === 'day' && !clawd.potionTargetId) {
    assignNearbyPotion(clawd);
  }
  if (state.timeOfDay === 'day' && !clawd.towelTargetId && !clawd.potionTargetId) {
    assignNearbyTowel(clawd);
  }
  if (state.timeOfDay === 'day' && !clawd.foodTargetId && !clawd.potionTargetId) {
    assignNearbyCrab(clawd);
  }

  const support = getStackSupport(clawd);
  if (clawd.y < support.y) {
    clawd.vy += 520 * delta;
    clawd.y = Math.min(support.y, clawd.y + clawd.vy * delta);
    if (clawd.y >= support.y) {
      clawd.vy = 0;
      clawd.stackCarrierId = support.id;
    }
    clawd.mood = 'idle';
    updateClawdPosition(clawd);
    drawClawd(clawd);
    return;
  }

  clawd.y = support.y;
  clawd.stackCarrierId = support.id;
  clawd.vy = 0;

  if (state.timeOfDay === 'night') {
    clawd.foodTargetId = null;
    clawd.potionTargetId = null;
    clawd.towelTargetId = null;
    clawd.eatTimer = 0;
    const target = houseSleepSpot(index);
    const distance = target - clawd.x;
    if (Math.abs(distance) > 3) {
      clawd.vx = Math.sign(distance) * 1.05;
      clawd.facing = clawd.vx > 0 ? 1 : -1;
      clawd.x += clawd.vx;
      clawd.mood = 'walking';
      clawd.walkCycle += delta * 10;
    } else {
      clawd.x = target;
      clawd.vx = 0;
      clawd.mood = 'sleeping';
    }
  } else if (clawd.towelTargetId) {
    const towel = getTowelById(clawd.towelTargetId);
    if (!towel) {
      clawd.towelTargetId = null;
    } else if (Math.abs(towel.x - clawd.x) < 10) {
      clawd.wetness = 0;
      clawd.towelTargetId = null;
      clawd.waitTimer = 0.8;
      removeTowelById(towel.id);
      drawClawd(clawd);
      return;
    } else {
      clawd.targetX = towel.x;
      clawd.vx = Math.sign(towel.x - clawd.x) * 1.1;
      clawd.facing = clawd.vx > 0 ? 1 : -1;
      clawd.x += clawd.vx;
      clawd.mood = 'walking';
      clawd.walkCycle += delta * 10;
    }
  } else if (clawd.potionTargetId) {
    const potion = getPotionById(clawd.potionTargetId);
    if (!potion) {
      clawd.potionTargetId = null;
    } else if (Math.abs(potion.x - clawd.x) < 10) {
      applyPotion(clawd, potion.type);
      removePotionById(potion.id);
      drawClawd(clawd);
      return;
    } else {
      clawd.targetX = potion.x;
      clawd.vx = Math.sign(potion.x - clawd.x) * 1.2;
      clawd.facing = clawd.vx > 0 ? 1 : -1;
      clawd.x += clawd.vx;
      clawd.mood = 'walking';
      clawd.walkCycle += delta * 11;
    }
  } else if (clawd.waitTimer > 0) {
    clawd.waitTimer -= delta;
    clawd.vx = 0;
    clawd.mood = 'idle';
    if (clawd.waitTimer <= 0) {
      clawd.targetX = chooseDayTarget();
    }
  } else {
    const foodTarget = clawd.foodTargetId ? getCrabById(clawd.foodTargetId) : null;
    if (foodTarget) {
      clawd.targetX = foodTarget.x;
      const eatDistance = Math.abs(foodTarget.x - clawd.x);
      if (eatDistance < 10) {
        clawd.vx = 0;
        clawd.mood = 'idle';
        clawd.eatTimer += delta;
        if (clawd.eatTimer >= 0.45) {
          removeCrabById(foodTarget.id);
          clawd.foodTargetId = null;
          clawd.eatTimer = 0;
          clawd.waitTimer = 0.8;
        }
        updateClawdPosition(clawd);
        drawClawd(clawd);
        return;
      }
      clawd.eatTimer = 0;
    } else {
      clawd.foodTargetId = null;
      clawd.eatTimer = 0;
    }

    const distance = clawd.targetX - clawd.x;
    if (Math.abs(distance) < 3) {
      clawd.x = clawd.targetX;
      clawd.vx = 0;
      clawd.mood = 'idle';
      clawd.waitTimer = randomBetween(0.8, 1.8);
    } else {
      const speedMap = {
        clear: 1.15,
        rain: 0.82,
        snow: 0.72,
        wind: 1.35,
        fog: 0.65
      };
      clawd.vx = Math.sign(distance) * speedMap[state.weather];
      if (state.weather === 'wind') {
        clawd.vx += 0.25 * Math.sin(performance.now() / 180 + index);
      }
      clawd.facing = clawd.vx > 0 ? 1 : -1;
      clawd.x += clawd.vx;
      clawd.mood = 'walking';
      clawd.walkCycle += delta * (state.weather === 'snow' ? 7 : 11);
    }
  }

  clawd.x = clamp(clawd.x, 18, state.worldWidth - CLAWD_WIDTH - 18);
  updateClawdPosition(clawd);
  drawClawd(clawd);
}

function spawnParticles(delta) {
  if (state.weather === 'clear') {
    state.particles = [];
    return;
  }

  const spawnCount = Math.max(2, Math.floor(state.worldWidth / 180));
  for (let index = 0; index < spawnCount; index += 1) {
    if (state.weather === 'rain') {
      state.particles.push({
        type: 'rain',
        x: Math.random() * state.worldWidth,
        y: -20 - Math.random() * 120,
        speed: 220 + Math.random() * 120,
        length: 10 + Math.random() * 10
      });
    } else if (state.weather === 'snow') {
      state.particles.push({
        type: 'snow',
        x: Math.random() * state.worldWidth,
        y: -10 - Math.random() * 80,
        drift: -12 + Math.random() * 24,
        speed: 30 + Math.random() * 40,
        size: 4 + Math.random() * 5
      });
    } else if (state.weather === 'wind') {
      state.particles.push({
        type: 'wind',
        x: -30,
        y: 40 + Math.random() * (groundY() - 80),
        speed: 180 + Math.random() * 120,
        length: 24 + Math.random() * 20
      });
    } else if (state.weather === 'fog') {
      if (state.particles.length < 18) {
        state.particles.push({
          type: 'fog',
          x: Math.random() * state.worldWidth,
          y: 90 + Math.random() * (groundY() - 140),
          width: 120 + Math.random() * 140,
          height: 24 + Math.random() * 22,
          speed: 12 + Math.random() * 12,
          alpha: 0.08 + Math.random() * 0.08
        });
      }
    }
  }

  for (const particle of state.particles) {
    if (particle.type === 'rain') {
      particle.y += particle.speed * delta;
      particle.x -= 18 * delta;
    } else if (particle.type === 'snow') {
      particle.y += particle.speed * delta;
      particle.x += particle.drift * delta;
    } else if (particle.type === 'wind') {
      particle.x += particle.speed * delta;
    } else if (particle.type === 'fog') {
      particle.x += particle.speed * delta;
      if (particle.x > state.worldWidth + particle.width) {
        particle.x = -particle.width;
      }
    }
  }

  state.particles = state.particles.filter((particle) => {
    if (particle.type === 'rain' || particle.type === 'snow') {
      return particle.y < groundY() + 30;
    }
    if (particle.type === 'wind') {
      return particle.x < state.worldWidth + 40;
    }
    return true;
  });
}

function drawWeather() {
  weatherCtx.clearRect(0, 0, state.worldWidth, state.worldHeight);
  if (state.weather === 'clear') {
    return;
  }

  if (state.weather === 'rain') {
    weatherCtx.fillStyle = 'rgba(180, 214, 255, 0.08)';
    weatherCtx.fillRect(0, 0, state.worldWidth, state.worldHeight);
    weatherCtx.strokeStyle = 'rgba(185, 222, 255, 0.72)';
    weatherCtx.lineWidth = 2;
    weatherCtx.beginPath();
    for (const particle of state.particles) {
      if (particle.type !== 'rain') {
        continue;
      }
      weatherCtx.moveTo(particle.x, particle.y);
      weatherCtx.lineTo(particle.x + 4, particle.y + particle.length);
    }
    weatherCtx.stroke();
    return;
  }

  if (state.weather === 'snow') {
    weatherCtx.fillStyle = 'rgba(240, 247, 255, 0.16)';
    weatherCtx.fillRect(0, 0, state.worldWidth, state.worldHeight);
    weatherCtx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    for (const particle of state.particles) {
      if (particle.type !== 'snow') {
        continue;
      }
      weatherCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    return;
  }

  if (state.weather === 'wind') {
    weatherCtx.strokeStyle = 'rgba(205, 227, 255, 0.45)';
    weatherCtx.lineWidth = 3;
    weatherCtx.beginPath();
    for (const particle of state.particles) {
      if (particle.type !== 'wind') {
        continue;
      }
      weatherCtx.moveTo(particle.x, particle.y);
      weatherCtx.lineTo(particle.x + particle.length, particle.y);
    }
    weatherCtx.stroke();
    return;
  }

  if (state.weather === 'fog') {
    for (const particle of state.particles) {
      if (particle.type !== 'fog') {
        continue;
      }
      weatherCtx.fillStyle = `rgba(222, 232, 255, ${particle.alpha})`;
      weatherCtx.fillRect(particle.x, particle.y, particle.width, particle.height);
    }
  }
}

function animate(now) {
  const delta = Math.min((now - state.lastFrame) / 1000, 0.033);
  state.lastFrame = now;

  for (const [index, clawd] of state.clawds.entries()) {
    updateClawd(clawd, index, delta);
  }

  spawnParticles(delta);
  drawWeather();
  updateStatus();
  requestAnimationFrame(animate);
}

addClawdButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  createClawd();
  updateStatus();
});

feedCrabButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  createCrab();
  updateStatus();
});

dropClimbPotionButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  createPotion('climb');
  updateStatus();
});

dropTowelButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  createTowel();
  updateStatus();
});

dropFlyPotionButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  createPotion('fly');
  updateStatus();
});

clearWorldButton.addEventListener('click', () => {
  state.houseVisible = false;
  updateHouseVisibility();
  setWeather('clear');
  weatherSelect.value = 'clear';
  removeAllPotions();
  removeAllTowels();
  removeAllCrabs();
  removeAllClawds();
  updateStatus();
});

dayButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  setTimeOfDay('day');
});

nightButton.addEventListener('click', () => {
  if (!state.houseVisible) {
    state.houseVisible = true;
    updateHouseVisibility();
  }
  setTimeOfDay('night');
});

weatherSelect.addEventListener('change', () => {
  setWeather(weatherSelect.value);
});

window.addEventListener('resize', resizeWorld);
window.addEventListener('pointermove', updateDrag);
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

function init() {
  resizeWorld();
  updateHouseVisibility();
  createClawd(120);
  setTimeOfDay('day');
  setWeather('clear');
  requestAnimationFrame(animate);
}

init();
