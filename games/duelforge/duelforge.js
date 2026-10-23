(() => {
  const createBtn = document.getElementById('createBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const spinBtn = document.getElementById('spinBtn');
  const fighterSelect = document.getElementById('fighterSelect');
  const result = document.getElementById('result');
  const cooldown = document.getElementById('cooldown');
  const fighterDump = document.getElementById('fighterDump');

  const nameInput = document.getElementById('name');
  const elementInput = document.getElementById('element');
  const weaponTypeInput = document.getElementById('weaponType');
  const styleInput = document.getElementById('style');

  let timerId = null;

  async function api(url, method = 'GET', payload) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      const message = data.error || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;
  }

  function setResult(message, isWarn = false) {
    result.textContent = message;
    result.classList.toggle('warn', isWarn);
    result.classList.toggle('ok', !isWarn);
  }

  function selectedFighterId() {
    return fighterSelect.value || '';
  }

  async function loadFighters(keepSelection = true) {
    const previous = keepSelection ? selectedFighterId() : '';
    const data = await api('/api/duelforge/fighters');
    fighterSelect.innerHTML = '';
    for (const fighter of data.fighters) {
      const option = document.createElement('option');
      option.value = fighter.id;
      option.textContent = `${fighter.name} (${fighter.element})`;
      fighterSelect.appendChild(option);
    }

    if (previous && [...fighterSelect.options].some((o) => o.value === previous)) {
      fighterSelect.value = previous;
    }
  }

  function startCountdown(seconds) {
    clearInterval(timerId);
    if (seconds <= 0) {
      cooldown.textContent = 'Spin ready now.';
      return;
    }

    let remaining = seconds;
    const render = () => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      cooldown.textContent = `Next spin available in ${m}m ${s}s`;
      remaining -= 1;
      if (remaining < 0) {
        clearInterval(timerId);
        cooldown.textContent = 'Spin ready now.';
      }
    };

    render();
    timerId = setInterval(render, 1000);
  }

  async function refreshStatus() {
    const fighterId = selectedFighterId();
    if (!fighterId) {
      fighterDump.textContent = 'No fighter selected.';
      cooldown.textContent = '';
      return;
    }

    const data = await api(`/api/duelforge/spin-status?fighterId=${encodeURIComponent(fighterId)}`);
    fighterDump.textContent = JSON.stringify(data.fighter, null, 2);
    startCountdown(data.nextSpinInSeconds);
  }

  async function createFighter() {
    const payload = {
      name: nameInput.value.trim(),
      element: elementInput.value,
      weaponType: weaponTypeInput.value,
      style: styleInput.value,
    };
    const data = await api('/api/duelforge/fighters', 'POST', payload);
    await loadFighters(false);
    fighterSelect.value = data.fighter.id;
    fighterDump.textContent = JSON.stringify(data.fighter, null, 2);
    setResult(`🔥 ${data.fighter.name} enters DuelForge. Ability: ${data.fighter.specialAbility}`);
    startCountdown(0);
  }

  async function spinWheel() {
    const fighterId = selectedFighterId();
    if (!fighterId) {
      setResult('Create or select a fighter first.', true);
      return;
    }

    setResult('🎡 Spinning...');
    try {
      const data = await api('/api/duelforge/spin', 'POST', { fighterId });
      setResult(data.spin.message);
      fighterDump.textContent = JSON.stringify(data.fighter, null, 2);
      startCountdown(600);
    } catch (error) {
      setResult(error.message, true);
      await refreshStatus();
    }
  }

  createBtn.addEventListener('click', () => createFighter().catch((e) => setResult(e.message, true)));
  refreshBtn.addEventListener('click', () => refreshStatus().catch((e) => setResult(e.message, true)));
  spinBtn.addEventListener('click', () => spinWheel().catch((e) => setResult(e.message, true)));
  fighterSelect.addEventListener('change', () => refreshStatus().catch((e) => setResult(e.message, true)));

  loadFighters(false)
    .then(refreshStatus)
    .catch(() => {
      fighterDump.textContent = 'No fighters yet. Create one to begin.';
    });
})();
