/* Claude Blocks automatic updates.
   Desktop apps: the app (main.js) downloads updates itself and tells us when they're ready.
   Android and web: we check version.json on the download website and offer the new version. */
(() => {
  const CB = window.CB;
  const current = window.CB_VERSION || 'dev', edition = window.CB_EDITION || 'full', site = (window.CB_SITE || '').replace(/\/+$/, '');
  const newer = (a, b) => {
    const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
    for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
    return false;
  };
  const pill = document.createElement('button');
  pill.className = 'update-pill'; pill.hidden = true;
  document.querySelector('.topbar .runbar').after(pill);
  document.querySelector('.brand').title = `Claude Blocks ${current}`;
  const show = (text, onclick) => { pill.hidden = false; pill.textContent = text; pill.onclick = onclick; pill.disabled = !onclick; };

  // Desktop app: updates arrive from the main process.
  if (window.cbDesktop) {
    window.cbDesktop.onUpdate(u => {
      if (u.state === 'available') show(`⬇ Downloading update ${u.version}…`, null);
      if (u.state === 'progress') show(`⬇ Updating… ${u.percent}%`, null);
      if (u.state === 'ready') { show(`⟳ Restart to update to ${u.version}`, () => window.cbDesktop.restart()); CB.log(`⬆ Claude Blocks ${u.version} is ready — restart the app to use it (it also installs when you quit).`, 'ok'); }
      if (u.state === 'manual') { show(`⬆ Get version ${u.version}`, () => window.cbDesktop.openDownloads()); CB.log(`⬆ Claude Blocks ${u.version} is available. Click “Get version ${u.version}” at the top to download it.`, 'ok'); }
    });
  }

  async function check() {
    if (current === 'dev' || window.cbDesktop) return;                  // running from source, or the desktop app handles it
    const url = edition === 'web' ? '../version.json' : site ? site + '/version.json' : '';
    if (!url) return;
    try {
      const v = await (await fetch(url + '?t=' + Date.now(), { cache: 'no-store' })).json();
      if (!newer(v.version, current)) return;
      if (edition === 'web') show(`⬆ Version ${v.version} is here — reload`, () => location.reload());
      else show(`⬆ Get version ${v.version}`, () => window.open(v.files && v.files.android ? `${site}/${v.files.android}` : `${site}/#download`, '_blank'));
      CB.log(`⬆ Claude Blocks ${v.version} is available${v.notes ? ' — ' + v.notes : ''}`, 'ok');
    } catch (_) { /* offline or no website yet */ }
  }
  setTimeout(check, 4000);
  setInterval(check, 6 * 3600 * 1000);
  CB.updates = { check, version: current };
})();
