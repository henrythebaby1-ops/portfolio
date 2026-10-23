import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

/* ------------------------------------------------------------------ */
/*  Renderer / Scene / Camera                                          */
/* ------------------------------------------------------------------ */

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x8a8353, 0.028);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 1.7, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ------------------------------------------------------------------ */
/*  Procedural liminal textures (no external assets needed)            */
/* ------------------------------------------------------------------ */

function makeCanvasTexture(draw, size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const wallTexture = makeCanvasTexture((ctx, s) => {
  ctx.fillStyle = '#b7a339';
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = 'rgba(90,80,20,0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i < s; i += 16) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, s);
    ctx.stroke();
  }
  // grime blotches
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(60,50,10,${Math.random() * 0.15})`;
    const r = Math.random() * 20 + 5;
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
    ctx.fill();
  }
});
wallTexture.repeat.set(4, 1.5);

const floorTexture = makeCanvasTexture((ctx, s) => {
  ctx.fillStyle = '#8f8442';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = `rgba(${60 + Math.random() * 40},${50 + Math.random() * 40},20,${
      Math.random() * 0.25
    })`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
  }
});
floorTexture.repeat.set(10, 20);

const ceilingTexture = makeCanvasTexture((ctx, s) => {
  ctx.fillStyle = '#cfcfc0';
  ctx.fillRect(0, 0, s, s);
  ctx.strokeStyle = 'rgba(120,120,110,0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, s - 8, s - 8);
});
ceilingTexture.repeat.set(4, 8);

/* ------------------------------------------------------------------ */
/*  Room geometry                                                      */
/* ------------------------------------------------------------------ */

const ROOM_WIDTH = 12;
const ROOM_LENGTH = 44;
const ROOM_HEIGHT = 4.5;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_LENGTH),
  new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.95 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(0, 0, -ROOM_LENGTH / 2 + 10);
floor.receiveShadow = true;
scene.add(floor);

const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_LENGTH),
  new THREE.MeshStandardMaterial({ map: ceilingTexture, roughness: 1 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, ROOM_HEIGHT, -ROOM_LENGTH / 2 + 10);
scene.add(ceiling);

const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.9 });

const colliders = []; // { minX, maxX, minZ, maxZ }

function addWall(x, z, w, d, h = ROOM_HEIGHT) {
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMaterial);
  wall.position.set(x, h / 2, z);
  wall.castShadow = wall.receiveShadow = true;
  scene.add(wall);
  colliders.push({
    minX: x - w / 2 - 0.3,
    maxX: x + w / 2 + 0.3,
    minZ: z - d / 2 - 0.3,
    maxZ: z + d / 2 + 0.3,
  });
}

// Long side walls of the main corridor-room
addWall(-ROOM_WIDTH / 2, -ROOM_LENGTH / 2 + 10, 0.4, ROOM_LENGTH);
addWall(ROOM_WIDTH / 2, -ROOM_LENGTH / 2 + 10, 0.4, ROOM_LENGTH);
// Back wall (start)
addWall(0, 10, ROOM_WIDTH, 0.4);
// Front wall with a locked doorway gap — represented by two wall segments
addWall(-ROOM_WIDTH / 2 + 1.7, -ROOM_LENGTH + 10, 3.4, 0.4);
addWall(ROOM_WIDTH / 2 - 1.7, -ROOM_LENGTH + 10, 3.4, 0.4);

/* ------------------------------------------------------------------ */
/*  Locked door                                                        */
/* ------------------------------------------------------------------ */

const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x3a3320, roughness: 0.7 });
const door = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.6, 0.3), doorMaterial);
door.position.set(0, 1.8, -ROOM_LENGTH + 10);
door.castShadow = true;
scene.add(door);
let doorOpen = false;
let doorAnim = 0;

/* ------------------------------------------------------------------ */
/*  Flickering fluorescent lights                                      */
/* ------------------------------------------------------------------ */

const ambient = new THREE.AmbientLight(0x554a20, 0.55);
scene.add(ambient);

const panelLights = [];
for (let i = 0; i < 6; i++) {
  const z = 8 - i * 8;
  const fixture = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.1, 3.5),
    new THREE.MeshStandardMaterial({
      color: 0xfff6d0,
      emissive: 0xfff6d0,
      emissiveIntensity: 1.2,
    })
  );
  fixture.position.set(0, ROOM_HEIGHT - 0.1, z);
  scene.add(fixture);

  const light = new THREE.PointLight(0xfff2c0, 1.1, 12, 2);
  light.position.set(0, ROOM_HEIGHT - 0.3, z);
  light.castShadow = i % 2 === 0;
  scene.add(light);
  panelLights.push(light);
}

/* ------------------------------------------------------------------ */
/*  Puzzle: three levers unlock the door                                */
/* ------------------------------------------------------------------ */

const leverGroup = new THREE.Group();
const leverBaseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6, roughness: 0.4 });
const leverArmMaterial = new THREE.MeshStandardMaterial({ color: 0xb33a3a, metalness: 0.3, roughness: 0.5 });

const levers = [];
const leverXPositions = [-4.5, 0, 4.5];
leverXPositions.forEach((x, i) => {
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.4), leverBaseMaterial);
  base.position.set(x, 0.5, -ROOM_LENGTH + 12.5);
  base.castShadow = true;
  scene.add(base);

  const pivot = new THREE.Group();
  pivot.position.set(x, 1.0, -ROOM_LENGTH + 12.5);
  scene.add(pivot);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 0.12), leverArmMaterial);
  arm.position.set(0, 0.45, 0);
  arm.castShadow = true;
  pivot.add(arm);
  pivot.rotation.z = THREE.MathUtils.degToRad(-35); // "off" position

  levers.push({ pivot, pulled: false, index: i });
});

let leversPulled = 0;

/* ------------------------------------------------------------------ */
/*  Controls & movement                                                 */
/* ------------------------------------------------------------------ */

const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());
controls.getObject().position.set(0, 1.7, 6);

const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => overlay.classList.add('hidden'));
controls.addEventListener('unlock', () => overlay.classList.remove('hidden'));

const move = { forward: false, back: false, left: false, right: false };
const velocity = new THREE.Vector3();
const PLAYER_RADIUS = 0.4;
const SPEED = 4.2;

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW': case 'ArrowUp': move.forward = true; break;
    case 'KeyS': case 'ArrowDown': move.back = true; break;
    case 'KeyA': case 'ArrowLeft': move.left = true; break;
    case 'KeyD': case 'ArrowRight': move.right = true; break;
    case 'KeyE': tryInteract(); break;
  }
});
document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW': case 'ArrowUp': move.forward = false; break;
    case 'KeyS': case 'ArrowDown': move.back = false; break;
    case 'KeyA': case 'ArrowLeft': move.left = false; break;
    case 'KeyD': case 'ArrowRight': move.right = false; break;
  }
});

function collides(x, z) {
  for (const c of colliders) {
    if (
      x + PLAYER_RADIUS > c.minX &&
      x - PLAYER_RADIUS < c.maxX &&
      z + PLAYER_RADIUS > c.minZ &&
      z - PLAYER_RADIUS < c.maxZ
    ) {
      return true;
    }
  }
  // locked door blocks passage until opened
  if (!doorOpen) {
    const d = door.position;
    if (
      x + PLAYER_RADIUS > d.x - 1.6 &&
      x - PLAYER_RADIUS < d.x + 1.6 &&
      z + PLAYER_RADIUS > d.z - 0.5 &&
      z - PLAYER_RADIUS < d.z + 0.5
    ) {
      return true;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Interaction (raycast from camera center)                            */
/* ------------------------------------------------------------------ */

const raycaster = new THREE.Raycaster();
const promptEl = document.getElementById('prompt');
let focusedLever = null;

function updateFocus() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const arms = levers.map((l) => l.pivot.children[0]);
  const hits = raycaster.intersectObjects(arms, false);
  focusedLever = null;
  if (hits.length && hits[0].distance < 3.2) {
    const lever = levers.find((l) => l.pivot.children[0] === hits[0].object);
    if (lever && !lever.pulled) focusedLever = lever;
  }

  if (focusedLever) {
    promptEl.textContent = 'Press E to pull the lever';
    promptEl.classList.add('visible');
  } else {
    promptEl.classList.remove('visible');
  }
}

function tryInteract() {
  if (!controls.isLocked || !focusedLever) return;
  focusedLever.pulled = true;
  leversPulled++;
  promptEl.classList.remove('visible');
  if (leversPulled === levers.length) {
    doorOpen = true;
  }
}

/* ------------------------------------------------------------------ */
/*  Win state                                                           */
/* ------------------------------------------------------------------ */

let hasWon = false;
function checkWin() {
  if (hasWon) return;
  const p = controls.getObject().position;
  if (doorOpen && p.z < -ROOM_LENGTH + 8) {
    hasWon = true;
    controls.unlock();
    overlay.classList.remove('hidden');
    overlay.querySelector('h1').textContent = 'YOU WOKE UP';
    overlay.querySelector('p').textContent =
      'The hum fades. For now. (Refresh to dream again.)';
  }
}

/* ------------------------------------------------------------------ */
/*  Main loop                                                           */
/* ------------------------------------------------------------------ */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const t = clock.getElapsedTime();

  // flicker
  panelLights.forEach((light, i) => {
    const flicker = 0.9 + 0.1 * Math.sin(t * 9 + i * 3) + (Math.random() < 0.01 ? -0.6 : 0);
    light.intensity = Math.max(0.15, flicker);
  });

  // lever animation
  levers.forEach((l) => {
    const target = l.pulled ? THREE.MathUtils.degToRad(35) : THREE.MathUtils.degToRad(-35);
    l.pivot.rotation.z += (target - l.pivot.rotation.z) * Math.min(1, dt * 6);
  });

  // door animation
  doorAnim += ((doorOpen ? 1 : 0) - doorAnim) * Math.min(1, dt * 2);
  door.position.y = 1.8 + doorAnim * 3.8;

  if (controls.isLocked) {
    const dir = new THREE.Vector3();
    const forward = Number(move.forward) - Number(move.back);
    const right = Number(move.right) - Number(move.left);

    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();
    const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0)).negate();

    dir.addScaledVector(camDir, forward);
    dir.addScaledVector(camRight, right);
    if (dir.lengthSq() > 0) dir.normalize();

    velocity.copy(dir).multiplyScalar(SPEED * dt);

    const obj = controls.getObject();
    const nextX = obj.position.x + velocity.x;
    const nextZ = obj.position.z + velocity.z;

    if (!collides(nextX, obj.position.z)) obj.position.x = nextX;
    if (!collides(obj.position.x, nextZ)) obj.position.z = nextZ;

    updateFocus();
    checkWin();
  }

  renderer.render(scene, camera);
}

animate();
