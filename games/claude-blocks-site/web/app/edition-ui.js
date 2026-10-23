/* Claude Blocks: turn features on or off for the current edition (see edition.js). */
(() => {
  const CB = window.CB, edition = window.CB_EDITION || 'full';
  const $ = s => document.querySelector(s);
  const hide = (...sels) => sels.forEach(sel => document.querySelectorAll(sel).forEach(e => { e.hidden = true; e.style.display = 'none'; }));
  document.documentElement.dataset.edition = edition;

  if (edition === 'web' || edition === 'android') {
    // No local Claude Blocks server here, so no computer terminal or network scan.
    hide('.view-tab[data-view="terminal"]', '#devAll');
  }
  if (edition === 'web') {
    // The web version is for coding only: no converting blocks into HTML/CSS/JS, and only the Pi emulator.
    hide('#exportBtn', '.ed-tab[data-ed="gen"]', '.seg-btn[data-mode="real"]', '#piDevices');
    if (CB.rt.config.pi.mode === 'real') $('.seg-btn[data-mode="emulator"]').click();
    CB.editor.showGenerated = () => CB.log('Converting blocks to HTML/CSS/JS is in the full Claude Blocks app — download it for Mac, Windows, Linux or Android.', 'err');
    const tag = document.createElement('a');
    tag.className = 'edition-tag'; tag.textContent = 'Web version · Get the full app';
    tag.href = '../'; tag.target = '_blank'; tag.rel = 'noopener';
    $('.brand').appendChild(tag);
  }
  if (edition === 'android' && window.Capacitor && window.Capacitor.Plugins) {
    // Android's web view can't download files, so save them and open the share sheet instead.
    const { Filesystem, Share } = window.Capacitor.Plugins;
    CB.download = async (filename, text) => {
      try {
        await Filesystem.writeFile({ path: filename, data: text, directory: 'CACHE', encoding: 'utf8' });
        const { uri } = await Filesystem.getUri({ path: filename, directory: 'CACHE' });
        await Share.share({ title: filename, url: uri, dialogTitle: 'Save or send ' + filename });
      } catch (e) { CB.log('⚠ Could not save ' + filename + ': ' + e.message, 'err'); }
    };
  }
  CB.edition = edition;
})();
