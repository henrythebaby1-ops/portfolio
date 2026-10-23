import { AIR_HUBS, COUNTRIES, LAND, SEA_LANES } from "./world.js";

const UPGRADES = [
  { id: "air", name: "Airborne", desc: "Planes carry it between hubs", stat: "air", cost: 6, max: 3 },
  { id: "sea", name: "Waterborne", desc: "Ships and ports", stat: "sea", cost: 5, max: 3 },
  { id: "land", name: "Livestock & roads", desc: "Crosses land borders", stat: "land", cost: 4, max: 3 },
  { id: "hot", name: "Heat adapted", desc: "Spreads in hot climates", stat: "hotRes", cost: 5, max: 3 },
  { id: "cold", name: "Cold adapted", desc: "Spreads in cold climates", stat: "coldRes", cost: 5, max: 3 },
  { id: "hum", name: "Humidity adapted", desc: "Thrives in wet regions", stat: "humRes", cost: 5, max: 3 },
  { id: "inf", name: "Infectivity", desc: "Faster local outbreaks", stat: "infectivity", cost: 7, max: 5 },
  { id: "sev", name: "Severity", desc: "More DNA, more attention", stat: "severity", cost: 6, max: 5 },
  { id: "let", name: "Lethality", desc: "Kills hosts — slows the cure, can stall spread", stat: "lethality", cost: 8, max: 5 },
];

export function createGame(strain) {
  const bonus = {
    virus: { infectivity: 0.08, severity: 0.02, lethality: 0, cureResist: 0 },
    bacteria: { infectivity: 0.02, severity: 0.04, lethality: 0.01, cureResist: 0.25 },
    fungus: { infectivity: 0.01, severity: 0.03, lethality: 0, cureResist: 0.1 },
  }[strain];

  const regions = Object.fromEntries(
    COUNTRIES.map((c) => [
      c.id,
      { ...c, pop: c.pop * 1e6, infected: 0, dead: 0, closed: false },
    ])
  );

  return {
    strain,
    day: 0,
    dna: 0,
    started: false,
    over: null,
    news: "Click a country to release patient zero.",
    cure: 0,
    awareness: 0,
    stats: {
      infectivity: 0.22 + bonus.infectivity,
      severity: 0.04 + bonus.severity,
      lethality: 0.002 + bonus.lethality,
      air: 0.05,
      sea: 0.05,
      land: 0.2,
      hotRes: strain === "fungus" ? 0.35 : 0.1,
      coldRes: 0.1,
      humRes: strain === "fungus" ? 0.5 : 0.15,
      cureResist: bonus.cureResist,
    },
    levels: Object.fromEntries(UPGRADES.map((u) => [u.id, 0])),
    regions,
    lastNewCountry: null,
  };
}

export { UPGRADES };

export function seed(game, id) {
  const r = game.regions[id];
  r.infected = Math.min(r.pop, 500);
  game.started = true;
  game.dna = 8;
  game.news = `Patient zero confirmed in ${r.name}.`;
}

export function buy(game, upgrade) {
  const level = game.levels[upgrade.id];
  const cost = upgrade.cost + level * 4;
  if (level >= upgrade.max || game.dna < cost) return false;
  game.dna -= cost;
  game.levels[upgrade.id] += 1;
  if (upgrade.stat === "infectivity") game.stats.infectivity += 0.07;
  else if (upgrade.stat === "severity") game.stats.severity += 0.08;
  else if (upgrade.stat === "lethality") game.stats.lethality += 0.035;
  else game.stats[upgrade.stat] += 0.22;
  game.news = `Evolved ${upgrade.name}.`;
  return true;
}

function climateFit(game, r) {
  const s = game.stats;
  const hot = r.hot;
  const cold = 1 - r.hot;
  const heat = hot * s.hotRes + cold * s.coldRes + 0.45;
  const wet = r.humid * s.humRes + (1 - r.humid) * 0.4;
  return Math.min(1.4, heat * 0.65 + wet * 0.5);
}

function totals(game) {
  let infected = 0, dead = 0, pop = 0, countriesHit = 0;
  for (const r of Object.values(game.regions)) {
    pop += r.pop;
    infected += r.infected;
    dead += r.dead;
    if (r.infected + r.dead > 0) countriesHit += 1;
  }
  return { infected, dead, pop, healthy: pop - infected - dead, countriesHit };
}

function tryJump(game, from, toId, chance) {
  const to = game.regions[toId];
  if (!to || to.infected + to.dead >= to.pop) return;
  if (to.infected > 0) return;
  if (Math.random() < chance) {
    to.infected = Math.max(3, to.pop * 0.000002);
    game.dna += 4;
    game.lastNewCountry = to.name;
    game.news = `Outbreak detected in ${to.name}.`;
  }
}

export function tick(game) {
  if (!game.started || game.over) return totals(game);
  game.day += 1;
  const s = game.stats;

  for (const r of Object.values(game.regions)) {
    const alive = r.pop - r.dead;
    const healthy = Math.max(0, alive - r.infected);
    if (r.infected <= 0 || alive <= 0) continue;

    const local = s.infectivity * climateFit(game, r) * (0.55 + r.urban * 0.7);
    const growth = r.infected * local * (healthy / Math.max(1, alive));
    r.infected = Math.min(alive, r.infected + growth);

    const deaths = r.infected * s.lethality * 0.35;
    r.infected = Math.max(0, r.infected - deaths);
    r.dead = Math.min(r.pop, r.dead + deaths);

    const frac = (r.infected + r.dead) / r.pop;
    if (frac > 0.12 && s.severity > 0.2) r.closed = true;
  }

  for (const r of Object.values(game.regions)) {
    if (r.infected < 50) continue;
    const pressure = Math.min(1, r.infected / (r.pop * 0.08));
    const borderShut = r.closed ? 0.25 : 1;

    for (const n of LAND[r.id] || []) {
      tryJump(game, r, n, pressure * s.land * 0.08 * borderShut);
    }
    if (AIR_HUBS.includes(r.id)) {
      for (const hub of AIR_HUBS) {
        if (hub === r.id) continue;
        const dest = game.regions[hub];
        const shut = r.closed || dest.closed ? 0.15 : 1;
        tryJump(game, r, hub, pressure * s.air * r.air * dest.air * 0.035 * shut);
      }
    }
    for (const [a, b] of SEA_LANES) {
      const other = a === r.id ? b : b === r.id ? a : null;
      if (!other) continue;
      const dest = game.regions[other];
      const shut = r.closed || dest.closed ? 0.2 : 1;
      tryJump(game, r, other, pressure * s.sea * r.sea * dest.sea * 0.04 * shut);
    }
  }

  const t = totals(game);
  const worldFrac = (t.infected + t.dead) / t.pop;
  game.awareness = Math.min(1, game.awareness + s.severity * worldFrac * 0.08 + (t.dead / t.pop) * 0.15);

  if (game.awareness > 0.18) {
    const richHealthy = Object.values(game.regions).reduce((sum, r) => {
      const h = (r.pop - r.infected - r.dead) / r.pop;
      return sum + r.wealth * h;
    }, 0);
    const research = (richHealthy / 18) * (1 - s.lethality * 0.45) * (1 - game.stats.cureResist) * (0.4 + game.awareness);
    game.cure = Math.min(1, game.cure + research * 0.0045);
  }

  if (game.day % 6 === 0 && t.infected > 1000) {
    game.dna += 1 + Math.floor(s.severity * 8);
  }

  if (game.cure >= 1) {
    game.over = "lose";
    game.news = "A vaccine is deployed worldwide. The outbreak is contained.";
  } else if (t.healthy <= t.pop * 0.0005 && t.infected + t.dead > 0) {
    game.over = "win";
    game.news = "No uninfected population remains. The pathogen wins.";
  } else if (t.infected < 1 && t.dead > 0 && worldFrac < 0.02) {
    game.over = "lose";
    game.news = "The strain burned out before it could take the world.";
  }

  return t;
}

export function colorFor(r) {
  const inf = r.infected / r.pop;
  const dead = r.dead / r.pop;
  const healthy = 1 - inf - dead;
  const g = Math.round(40 + healthy * 70);
  const red = Math.round(40 + inf * 200 + dead * 40);
  const b = Math.round(55 + dead * 40);
  return `rgb(${red}, ${g}, ${Math.min(90, b)})`;
}
