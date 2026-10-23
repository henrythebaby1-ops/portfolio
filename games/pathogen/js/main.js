import { COUNTRIES } from "./world.js";
import { UPGRADES, buy, colorFor, createGame, seed, tick } from "./sim.js";

const svg = document.getElementById("countries");
const tooltip = document.getElementById("tooltip");
const boot = document.getElementById("boot");
const end = document.getElementById("end");

let game = createGame("virus");
let selected = null;
let running = false;
let speed = 1;

function fmt(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Math.floor(n).toString();
}

function drawMap() {
  svg.innerHTML = "";
  for (const c of COUNTRIES) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", c.d);
    path.setAttribute("class", "country");
    path.setAttribute("aria-label", c.name);
    path.setAttribute("tabindex", "0");
    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = c.name;
    path.appendChild(title);
    path.dataset.id = c.id;
    path.addEventListener("click", () => onCountry(c.id));
    path.addEventListener("mousemove", (e) => showTip(e, c.id));
    path.addEventListener("mouseleave", () => tooltip.classList.add("hidden"));
    svg.appendChild(path);
  }
}

function showTip(e, id) {
  const r = game.regions[id];
  const wrap = document.querySelector(".map-wrap").getBoundingClientRect();
  tooltip.classList.remove("hidden");
  tooltip.style.left = `${e.clientX - wrap.left}px`;
  tooltip.style.top = `${e.clientY - wrap.top}px`;
  tooltip.innerHTML = `<strong>${r.name}</strong><br>${fmt(r.infected)} infected · ${fmt(r.dead)} dead`;
}

function onCountry(id) {
  selected = id;
  if (!game.started) {
    const name = document.getElementById("virus-name").value.trim() || "NEO-X";
    const strain = document.querySelector("input[name=strain]:checked").value;
    game = createGame(strain);
    game.name = name;
    seed(game, id);
    document.getElementById("name-display").textContent = name;
    boot.classList.add("hidden");
    running = true;
    document.getElementById("pause").disabled = false;
    document.querySelectorAll(".speed").forEach((b) => (b.disabled = false));
    paint();
    renderUpgrades();
  }
  paintFocus();
}

function paintFocus() {
  document.querySelectorAll(".country").forEach((el) => {
    el.classList.toggle("selected", el.dataset.id === selected);
  });
  if (!selected) return;
  const r = game.regions[selected];
  document.getElementById("focus-name").textContent = r.name;
  document.getElementById("focus-meta").textContent =
    `${(r.pop / 1e6).toFixed(0)}M people · ${r.hot > 0.6 ? "hot" : "cool"} · ${r.humid > 0.6 ? "humid" : "dry"} · ${r.closed ? "borders closing" : "open"}`;
  const infP = r.infected / r.pop;
  const deadP = r.dead / r.pop;
  document.getElementById("focus-inf").textContent = fmt(r.infected);
  document.getElementById("focus-dead").textContent = fmt(r.dead);
  document.getElementById("focus-bar-inf").style.width = `${Math.min(100, infP * 100)}%`;
  document.getElementById("focus-bar-dead").style.width = `${Math.min(100, deadP * 100)}%`;
}

let upgradeKey = "";

function renderUpgrades() {
  const key = `${game.dna}:${Object.values(game.levels).join(",")}:${game.started}:${game.over || ""}`;
  if (key === upgradeKey) return;
  upgradeKey = key;
  const box = document.getElementById("upgrades");
  box.innerHTML = "";
  for (const u of UPGRADES) {
    const level = game.levels[u.id];
    const cost = u.cost + level * 4;
    const btn = document.createElement("button");
    btn.className = `upgrade${level >= u.max ? " max" : ""}`;
    btn.innerHTML = `<span>${u.name} <small>${u.desc} · ${level}/${u.max}</small></span><span class="cost">${level >= u.max ? "MAX" : cost + " DNA"}</span>`;
    btn.disabled = !game.started || level >= u.max || game.dna < cost || Boolean(game.over);
    btn.addEventListener("click", () => {
      if (buy(game, u)) {
        renderUpgrades();
        document.getElementById("dna").textContent = game.dna;
        document.getElementById("news").textContent = game.news;
      }
    });
    box.appendChild(btn);
  }
}

function paint() {
  for (const el of svg.querySelectorAll(".country")) {
    const r = game.regions[el.dataset.id];
    el.style.fill = colorFor(r);
  }
  const t = {
    infected: 0,
    dead: 0,
    pop: 0,
  };
  for (const r of Object.values(game.regions)) {
    t.infected += r.infected;
    t.dead += r.dead;
    t.pop += r.pop;
  }
  const healthy = t.pop - t.infected - t.dead;
  document.getElementById("stat-infected").textContent = fmt(t.infected);
  document.getElementById("stat-dead").textContent = fmt(t.dead);
  document.getElementById("stat-healthy").textContent = fmt(healthy);
  document.getElementById("stat-cure").textContent = `${Math.round(game.cure * 100)}%`;
  document.getElementById("bar-inf").style.width = `${((t.infected + t.dead) / t.pop) * 100}%`;
  document.getElementById("bar-cure").style.width = `${game.cure * 100}%`;
  document.getElementById("dna").textContent = game.dna;
  document.getElementById("day-display").textContent = `Day ${game.day}`;
  document.getElementById("news").textContent = game.news;
  paintFocus();

  if (game.over && end.classList.contains("hidden")) {
    running = false;
    document.getElementById("end-title").textContent = game.over === "win" ? "Pandemic complete" : "Contained";
    document.getElementById("end-body").textContent = game.news;
    end.classList.remove("hidden");
  }
}

function loop() {
  if (running && game.started && !game.over) {
    const steps = speed;
    for (let i = 0; i < steps; i++) tick(game);
    paint();
    renderUpgrades();
  }
}

document.getElementById("pause").addEventListener("click", () => {
  running = !running;
  document.getElementById("pause").textContent = running ? "Pause" : "Resume";
});

document.querySelectorAll(".speed").forEach((btn) => {
  btn.addEventListener("click", () => {
    speed = Number(btn.dataset.speed);
    document.querySelectorAll(".speed").forEach((b) => b.classList.toggle("on", b === btn));
  });
});

document.getElementById("replay").addEventListener("click", () => {
  location.reload();
});

document.getElementById("place").addEventListener("click", () => {
  const name = document.getElementById("virus-name").value.trim() || "NEO-X";
  document.getElementById("name-display").textContent = name;
  boot.classList.add("hidden");
  game.news = "Click a country to release patient zero.";
  document.getElementById("news").textContent = game.news;
});

drawMap();
renderUpgrades();
paint();
setInterval(loop, 280);
