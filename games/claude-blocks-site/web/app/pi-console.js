/* Claude Blocks: Raspberry Pi 5 console — the built-in emulator, or a real Pi via raspberry-pi/pi-bridge.py. */
(() => {
  const CB = window.CB, rt = CB.rt;
  const $ = s => document.querySelector(s);
  const host = $('#piHost'), token = $('#piToken'), term = $('#piTerm'), cmd = $('#piCmd'), promptEl = $('#piPrompt'), status = $('#piStatus'), info = $('#piInfo');
  host.value = rt.config.pi.host || '';
  token.value = rt.config.pi.token || '';
  let user = 'pi', hostname = 'raspberrypi', cwd = '~', home = '', history = [], hi = 0;

  function print(text, cls) {
    const d = document.createElement('div');
    d.textContent = String(text).replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\n$/, '');
    if (cls) d.className = cls;
    term.appendChild(d);
    term.scrollTop = term.scrollHeight;
  }
  function setPrompt() {
    const short = home && cwd.startsWith(home) ? '~' + cwd.slice(home.length) : cwd;
    promptEl.textContent = `${user}@${hostname}:${short}$`;
  }
  function saveConfig() {
    rt.config.pi.host = host.value.trim();
    rt.config.pi.token = token.value.trim();
    CB.saveSettings();
  }

  async function connect() {
    saveConfig();
    status.className = 'dot busy';
    try {
      const i = await rt.piRequest('/info');
      ({ user, hostname, cwd, home } = i);
      status.className = 'dot ok';
      info.textContent = `${i.model} · ${i.hostname}${i.temp != null ? ` · ${i.temp}°C` : ''}${i.gpio ? '' : ' · GPIO not available (practice mode)'}`;
      print(`Connected to ${i.model}. Type a command, e.g. ls or vcgencmd measure_temp`, 'ok');
      setPrompt();
      cmd.focus();
    } catch (e) {
      status.className = 'dot err';
      info.textContent = 'Not connected';
      print(e.message, 'err');
    }
  }
  $('#piConnect').onclick = connect;
  token.onkeydown = e => { if (e.key === 'Enter') connect(); };

  $('#piForm').onsubmit = async e => {
    e.preventDefault();
    const c = cmd.value;
    if (!c.trim()) return;
    history.push(c); hi = history.length;
    cmd.value = '';
    print(`${promptEl.textContent} ${c}`, 'cmd');
    if (c.trim() === 'clear') { term.textContent = ''; return; }
    cmd.disabled = true;
    try {
      const r = await rt.piCall('/exec', { cmd: c });
      if (r.stdout) print(r.stdout);
      if (r.stderr) print(r.stderr, 'err');
      if (r.cwd) cwd = r.cwd;
      setPrompt();
    } catch (err) { print(err.message, 'err'); }
    finally { cmd.disabled = false; cmd.focus(); }
  };
  cmd.onkeydown = e => {
    if (e.key === 'ArrowUp' && hi > 0) { hi--; cmd.value = history[hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hi = Math.min(history.length, hi + 1); cmd.value = history[hi] || ''; e.preventDefault(); }
  };
  // ---------- Emulator / Real Pi switch ----------
  function setMode(mode) {
    rt.config.pi.mode = mode;
    CB.saveSettings();
    $('#p-pi').dataset.mode = mode;
    document.querySelectorAll('#p-pi .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    term.textContent = '';
    if (mode === 'emulator') {
      ({ user, hostname, cwd, home } = rt.piEmulator.handle('/info'));
      print('Raspberry Pi 5 emulator — your Pi blocks control the parts above. Type help for commands.', 'ok');
    } else {
      user = 'pi'; hostname = 'raspberrypi'; cwd = '~'; home = '';
      print('Real Pi mode: run pi-bridge.py on your Raspberry Pi, then Connect (or 🔍 View devices to find it).', 'muted');
    }
    setPrompt();
  }
  document.querySelectorAll('#p-pi .seg-btn').forEach(b => { b.onclick = () => setMode(b.dataset.mode); });
  setMode(rt.config.pi.mode === 'real' ? 'real' : 'emulator');

  // ---------- View devices: find Pi bridges on this computer and the local network ----------
  const devList = $('#devList'), devStatus = $('#devStatus');
  const PORT = 8765;
  let scanning = null;

  async function probe(addr, ms = 1500) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const res = await fetch(`http://${addr}/ping`, { signal: ctl.signal });
      const data = await res.json().catch(() => ({}));
      if (data.app === 'claude-blocks-pi-bridge') return data;
      if (data.error === 'wrong token') return { hostname: addr, model: 'Claude Blocks Pi bridge (older version)' };
      return null;
    } catch (_) { return null; } finally { clearTimeout(timer); }
  }

  const found = new Map();
  function showDevice(addr, d) {
    if (found.has(addr)) return;
    found.set(addr, d);
    if (devList.querySelector('.none')) devList.textContent = '';
    const row = document.createElement('div');
    row.className = 'dev found';
    const local = /^(localhost|127\.0\.0\.1)(:|$)/.test(addr);
    const txt = document.createElement('div');
    txt.className = 'dev-text';
    const b = document.createElement('b'); b.textContent = `${/raspberry/i.test(d.model || '') ? '🍓' : '💻'} ${addr}`;
    const sm = document.createElement('small'); sm.textContent = `${d.model || 'Pi bridge'} · ${d.hostname || ''}${local ? ' · this computer' : ''}`;
    txt.append(b, sm);
    const use = document.createElement('button');
    use.type = 'button'; use.className = 'primary small'; use.textContent = addr === host.value.trim() ? 'In use ✓' : 'Use';
    use.onclick = () => { host.value = addr; saveConfig(); $('#devicesDialog').close(); (token.value ? connect() : token.focus()); };
    row.append(txt, use);
    devList.appendChild(row);
  }
  function showEmpty(msg) { devList.innerHTML = ''; const d = document.createElement('div'); d.className = 'dev none'; d.textContent = msg; devList.appendChild(d); }

  async function runScan(addrs, label) {
    const job = scanning = {};
    found.clear();
    showEmpty('Searching…');
    let done = 0;
    const queue = addrs.slice();
    const worker = async () => {
      while (queue.length && scanning === job) {
        const addr = queue.shift();
        const d = await probe(addr);
        if (scanning !== job) return;
        if (d) showDevice(addr, d);
        devStatus.textContent = `${label}: checked ${++done} of ${addrs.length}${found.size ? ` · found ${found.size}` : ''}`;
      }
    };
    await Promise.all(Array.from({ length: 48 }, worker));
    if (scanning !== job) return;
    scanning = null;
    if (!found.size) showEmpty('No Pi bridges found. Make sure pi-bridge.py is running on the Pi and that it is on the same Wi-Fi.');
    devStatus.textContent = `${label}: done — found ${found.size} device${found.size === 1 ? '' : 's'}.`;
  }

  function quickAddresses() {
    const names = ['localhost', '127.0.0.1', 'raspberrypi.local', 'raspberrypi5.local', 'pi.local', 'pi5.local', 'raspberry.local'];
    const saved = (rt.config.pi.host || '').replace(/^https?:\/\//, '');
    const list = names.map(n => `${n}:${PORT}`);
    if (saved && !list.includes(saved)) list.unshift(saved);
    return list;
  }
  $('#devQuick').onclick = () => runScan(quickAddresses(), 'Common addresses');
  $('#devScan').onclick = () => {
    const net = $('#devSubnet').value.trim().replace(/\.$/, '');
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(net)) { devStatus.textContent = 'Type the first three parts of your network address, like 192.168.1'; return; }
    const addrs = [];
    for (let i = 1; i <= 254; i++) addrs.push(`${net}.${i}:${PORT}`);
    runScan(addrs, `Network ${net}.x`);
  };
  $('#piDevices').onclick = () => {
    const m = (rt.config.pi.host || '').match(/^(?:https?:\/\/)?(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}/);
    if (m) $('#devSubnet').value = m[1];
    devStatus.textContent = '';
    $('#devicesDialog').showModal();
    runScan(quickAddresses(), 'Common addresses');
  };
  $('#devicesDialog').addEventListener('close', () => { scanning = null; });

  // ---------- View all devices: every device on the network + services on this computer ----------
  // The list comes from Claude Blocks' own server (server.py), since a web page can't see the network itself.
  function row({ icon, title, sub, tags = [], actions = [] }) {
    const r = document.createElement('div');
    r.className = 'dev';
    const ic = document.createElement('span'); ic.className = 'dev-icon'; ic.textContent = icon;
    const txt = document.createElement('div'); txt.className = 'dev-text';
    const b = document.createElement('b'); b.textContent = title;
    const sm = document.createElement('small'); sm.textContent = sub;
    txt.append(b, sm);
    r.append(ic, txt);
    for (const [label, good] of tags) { const t = document.createElement('span'); t.className = 'tag' + (good ? ' good' : ''); t.textContent = label; r.appendChild(t); }
    for (const [label, fn, primary] of actions) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'small' + (primary ? ' primary' : ''); btn.textContent = label; btn.onclick = fn;
      r.appendChild(btn);
    }
    return r;
  }
  const group = text => { const g = document.createElement('div'); g.className = 'dev-group'; g.textContent = text; return g; };
  const useHost = addr => { host.value = addr; saveConfig(); $('#devicesDialog').close(); (token.value ? connect() : token.focus()); };

  async function viewAll() {
    const job = scanning = {};
    showEmpty('Looking at your network… (about 10 seconds)');
    devStatus.textContent = 'Waking up devices on your network…';
    let data;
    try {
      const res = await fetch('/api/devices?scan=1');
      if (!res.ok) throw new Error();
      data = await res.json();
    } catch (_) {
      if (scanning !== job) return;
      scanning = null;
      showEmpty('“View all devices” needs Claude Blocks’ own server. Open it at http://localhost:8642 (Start Claude Blocks.command) and try again.');
      devStatus.textContent = '';
      return;
    }
    if (scanning !== job) return;
    devList.textContent = '';
    devList.appendChild(group(`This computer — localhost (${data.services.length} services)`));
    for (const s of data.services) {
      const isBridge = s.port === PORT;
      devList.appendChild(row({
        icon: isBridge ? '🍓' : s.port === 11434 ? '✳️' : s.port === 8642 ? '🧩' : '🔌',
        title: `localhost:${s.port}`,
        sub: `${s.label ? s.label + ' · ' : ''}${s.process}${s.localOnly ? ' · only this computer' : ' · visible on network'}`,
        actions: [isBridge ? ['Use', () => useHost(`localhost:${s.port}`), true] : ['Open', () => window.open(`http://localhost:${s.port}`, '_blank')]],
      }));
    }
    devList.appendChild(group(`Your network (${data.devices.length} devices)`));
    const rows = data.devices.map(d => {
      const kind = d.thisComputer ? ['💻', 'This computer'] : d.raspberryPi ? ['🍓', 'Raspberry Pi'] : d.privateMac ? ['📱', 'Phone, tablet or laptop (private address)'] : d.ip.endsWith('.1') || d.ip.endsWith('.254') ? ['📡', 'Probably your router'] : ['🖥️', 'Device'];
      const r = row({ icon: kind[0], title: d.name ? `${d.name} (${d.ip})` : d.ip, sub: `${kind[1]}${d.mac ? ' · ' + d.mac : ''}`, tags: d.raspberryPi ? [['Raspberry Pi', true]] : [] });
      devList.appendChild(r);
      return [d, r];
    });
    // Check which devices are running the Pi bridge, so they can be picked with one click.
    devStatus.textContent = 'Checking which devices run the Pi bridge…';
    let bridges = 0;
    await Promise.all(rows.map(async ([d, r]) => {
      const info = await probe(`${d.ip}:${PORT}`, 2000);
      if (scanning !== job) return;
      if (info) {
        bridges++;
        r.classList.add('found');
        if (info.model) r.querySelector('small').textContent = info.model + ' · ' + r.querySelector('small').textContent;
        const tag = document.createElement('span'); tag.className = 'tag good'; tag.textContent = 'Pi bridge running';
        const use = document.createElement('button'); use.type = 'button'; use.className = 'small primary'; use.textContent = 'Use';
        use.onclick = () => useHost(`${d.ip}:${PORT}`);
        r.append(tag, use);
      } else if (d.raspberryPi) {
        const t = document.createElement('span'); t.className = 'tag'; t.textContent = 'start pi-bridge.py on it';
        r.appendChild(t);
      }
    }));
    if (scanning !== job) return;
    scanning = null;
    devStatus.textContent = `Found ${data.devices.length} devices on your network (${data.myIp ? data.myIp.replace(/\.\d+$/, '.x') : '?'}) · ${bridges} running the Pi bridge · ${data.services.length} services on this computer.`;
  }
  $('#devAll').onclick = viewAll;
})();
