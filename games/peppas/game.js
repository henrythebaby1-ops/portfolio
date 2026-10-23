const ASSETS = {
  sprites: {
    peppa: { primary: 'assets/imported/sprites/peppa.png', fallback: 'assets/sprites/peppa.svg' },
    george: { primary: 'assets/imported/sprites/george.png', fallback: 'assets/sprites/george.svg' },
    mummy: { primary: 'assets/imported/sprites/mummy.png', fallback: 'assets/sprites/mummy.svg' },
    daddy: { primary: 'assets/imported/sprites/daddy.png', fallback: 'assets/sprites/daddy.svg' },
    zombie: { primary: 'assets/imported/sprites/zombie-peppa.png', fallback: 'assets/sprites/zombie-peppa.svg' }
  },
  rooms: {
    lounge: { primary: 'assets/imported/rooms/lounge.png', fallback: 'assets/rooms/lounge.svg' },
    bath: { primary: 'assets/imported/rooms/bath.png', fallback: 'assets/rooms/bath.svg' },
    kitchen: { primary: 'assets/imported/rooms/kitchen.png', fallback: 'assets/rooms/kitchen.svg' },
    bedroom: { primary: 'assets/imported/rooms/bedroom.png', fallback: 'assets/rooms/bedroom.svg' },
    computer: { primary: 'assets/imported/rooms/computer.png', fallback: 'assets/rooms/computer.svg' }
  }
};

const state = {
  hour: 12,
  power: 100,
  running: true,
  camerasOpen: false,
  leftDoorClosed: false,
  rightDoorClosed: false,
  leftLightOn: false,
  rightLightOn: false,
  activeCamera: 'bath',
  enemies: {
    peppa: { room: 'bath', sprite: ASSETS.sprites.peppa },
    george: { room: 'bedroom', sprite: ASSETS.sprites.george },
    mummy: { room: 'kitchen', sprite: ASSETS.sprites.mummy },
    daddy: { room: 'computer', sprite: ASSETS.sprites.daddy }
  }
};

const roomOrder = ['bath', 'kitchen', 'bedroom', 'computer', 'leftDoor', 'rightDoor'];

const clockEl = document.getElementById('clock');
const powerEl = document.getElementById('power');
const statusEl = document.getElementById('status');
const cameraPanel = document.getElementById('cameraPanel');
const cameraBg = document.getElementById('cameraBg');
const roomBg = document.getElementById('roomBg');
const jumpscareImg = document.getElementById('jumpscareImg');
const cameraSprites = document.getElementById('cameraSprites');
const cameraSelect = document.getElementById('cameraSelect');
const jumpscare = document.getElementById('jumpscare');
const leftDoor = document.getElementById('leftDoor');
const rightDoor = document.getElementById('rightDoor');
const leftLight = document.getElementById('leftLight');
const rightLight = document.getElementById('rightLight');

function bindFallback(imgEl, asset) {
  imgEl.onerror = () => {
    if (imgEl.src.endsWith(asset.fallback)) return;
    imgEl.src = asset.fallback;
  };
  imgEl.src = asset.primary;
}

function updateHud() {
  clockEl.textContent = `${state.hour} AM`;
  powerEl.textContent = `Power ${Math.max(0, Math.floor(state.power))}%`;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function renderDoors() {
  leftDoor.classList.toggle('closed', state.leftDoorClosed);
  rightDoor.classList.toggle('closed', state.rightDoorClosed);
  leftLight.classList.toggle('on', state.leftLightOn);
  rightLight.classList.toggle('on', state.rightLightOn);
}

function setRoomImage(roomKey) {
  const asset = ASSETS.rooms[roomKey];
  bindFallback(cameraBg, asset);
}

function renderCamera() {
  setRoomImage(state.activeCamera);
  cameraSprites.innerHTML = '';
  const visible = Object.entries(state.enemies).filter(([, e]) => e.room === state.activeCamera);
  visible.forEach(([name, enemy], i) => {
    const img = document.createElement('img');
    img.className = 'sprite';
    img.alt = name;
    img.style.left = `${12 + i * 22}%`;
    img.style.top = `${30 + (i % 2) * 10}%`;
    img.onerror = () => {
      if (img.src.endsWith(enemy.sprite.fallback)) return;
      img.src = enemy.sprite.fallback;
    };
    img.src = enemy.sprite.primary;
    cameraSprites.appendChild(img);
  });
}

function randomStep(enemy) {
  const idx = roomOrder.indexOf(enemy.room);
  const roll = Math.random();
  if (roll < 0.55 && idx < roomOrder.length - 1) {
    enemy.room = roomOrder[idx + 1];
  } else if (roll > 0.9 && idx > 0) {
    enemy.room = roomOrder[idx - 1];
  }
}

function checkDanger() {
  const leftThreat = Object.values(state.enemies).some((e) => e.room === 'leftDoor');
  const rightThreat = Object.values(state.enemies).some((e) => e.room === 'rightDoor');

  if (leftThreat && !state.leftDoorClosed) return gameOver('Left door breached.');
  if (rightThreat && !state.rightDoorClosed) return gameOver('Right door breached.');

  if (leftThreat && state.leftLightOn) setStatus('Movement at LEFT door!');
  else if (rightThreat && state.rightLightOn) setStatus('Movement at RIGHT door!');
}

function drainPower() {
  let drain = 0.18;
  if (state.camerasOpen) drain += 0.2;
  if (state.leftDoorClosed) drain += 0.3;
  if (state.rightDoorClosed) drain += 0.3;
  if (state.leftLightOn) drain += 0.18;
  if (state.rightLightOn) drain += 0.18;
  state.power -= drain;
  if (state.power <= 0) {
    state.power = 0;
    state.leftDoorClosed = false;
    state.rightDoorClosed = false;
    state.leftLightOn = false;
    state.rightLightOn = false;
    renderDoors();
    gameOver('Power out. They found you in the dark.');
  }
}

function tick() {
  if (!state.running) return;
  Object.values(state.enemies).forEach(randomStep);
  drainPower();
  checkDanger();
  renderCamera();
  updateHud();
}

function hourTick() {
  if (!state.running) return;
  state.hour += 1;
  if (state.hour === 6) {
    setStatus('6 AM! You survived Night 1.');
    state.running = false;
    return;
  }
  setStatus(`It is now ${state.hour} AM. Stay sharp.`);
  updateHud();
}

function gameOver(message) {
  state.running = false;
  setStatus(message);
  jumpscare.classList.remove('hidden');
}

function restart() {
  state.hour = 12;
  state.power = 100;
  state.running = true;
  state.camerasOpen = false;
  state.leftDoorClosed = false;
  state.rightDoorClosed = false;
  state.leftLightOn = false;
  state.rightLightOn = false;
  state.activeCamera = 'bath';
  state.enemies.peppa.room = 'bath';
  state.enemies.george.room = 'bedroom';
  state.enemies.mummy.room = 'kitchen';
  state.enemies.daddy.room = 'computer';
  cameraPanel.classList.add('hidden');
  cameraSelect.value = 'bath';
  jumpscare.classList.add('hidden');
  setStatus('Keep the doors shut only when needed.');
  renderDoors();
  bindFallback(roomBg, ASSETS.rooms.lounge);
  bindFallback(jumpscareImg, ASSETS.sprites.zombie);
  renderCamera();
  updateHud();
}

document.getElementById('toggleCam').addEventListener('click', () => {
  if (!state.running) return;
  state.camerasOpen = !state.camerasOpen;
  cameraPanel.classList.toggle('hidden', !state.camerasOpen);
  setStatus(state.camerasOpen ? 'Cameras online.' : 'Back to office view.');
});

document.getElementById('toggleLeftDoor').addEventListener('click', () => {
  if (!state.running) return;
  state.leftDoorClosed = !state.leftDoorClosed;
  renderDoors();
});

document.getElementById('toggleRightDoor').addEventListener('click', () => {
  if (!state.running) return;
  state.rightDoorClosed = !state.rightDoorClosed;
  renderDoors();
});

document.getElementById('flashLeft').addEventListener('click', () => {
  if (!state.running) return;
  state.leftLightOn = true;
  renderDoors();
  setTimeout(() => {
    state.leftLightOn = false;
    renderDoors();
  }, 1000);
});

document.getElementById('flashRight').addEventListener('click', () => {
  if (!state.running) return;
  state.rightLightOn = true;
  renderDoors();
  setTimeout(() => {
    state.rightLightOn = false;
    renderDoors();
  }, 1000);
});

cameraSelect.addEventListener('change', (e) => {
  state.activeCamera = e.target.value;
  renderCamera();
});

document.getElementById('restart').addEventListener('click', restart);

restart();
setInterval(tick, 1500);
setInterval(hourTick, 18000);
