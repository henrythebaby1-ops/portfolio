// Small vanilla versions of React Bits effects: Click Spark, Rotating Text, Decrypted Text,
// Spotlight Card, Magnet, Dock and Count Up.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Click Spark: little lines burst out wherever you click ----
  const cv = document.createElement('canvas');
  cv.className = 'sparks';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let sparks = [];
  const size = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  size(); addEventListener('resize', size);
  addEventListener('click', e => {
    if (reduce) return;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7ee787';
    for (let i = 0; i < 8; i++) sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / 8, t: performance.now(), color });
    if (sparks.length === 8) requestAnimationFrame(drawSparks);
  });
  function drawSparks(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(s => now - s.t < 400);
    for (const s of sparks) {
      const k = (now - s.t) / 400, ease = k * (2 - k), d = ease * 26, len = 10 * (1 - ease);
      ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(s.x + d * Math.cos(s.a), s.y + d * Math.sin(s.a));
      ctx.lineTo(s.x + (d + len) * Math.cos(s.a), s.y + (d + len) * Math.sin(s.a));
      ctx.stroke();
    }
    if (sparks.length) requestAnimationFrame(drawSparks); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  // ---- Rotating Text: the hero word swaps letter by letter ----
  const rot = document.getElementById('rotate');
  if (rot) {
    const words = rot.dataset.words.split('|');
    let w = 0;
    const show = word => {
      rot.innerHTML = '';
      [...word].forEach((ch, i) => {
        const s = document.createElement('span');
        s.textContent = ch === ' ' ? ' ' : ch;
        s.style.animationDelay = i * 0.025 + 's';
        rot.appendChild(s);
      });
    };
    show(words[0]);
    if (!reduce) setInterval(() => {
      rot.classList.add('out');
      setTimeout(() => { rot.classList.remove('out'); show(words[w = (w + 1) % words.length]); }, 320);
    }, 2400);
  }

  // ---- Decrypted Text: headings scramble into place when they scroll in ----
  const glyphs = '!<>-_\\/[]{}—=+*^?#01';
  const decrypt = el => {
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    let frame = 0;
    const id = setInterval(() => {
      el.textContent = [...final].map((c, i) => (c === ' ' || i < frame / 2 ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join('');
      if (++frame / 2 > final.length) { clearInterval(id); el.textContent = final; }
    }, 28);
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); if (!reduce) decrypt(e.target); } }), { threshold: 0.6 });
  document.querySelectorAll('h2').forEach(h => io.observe(h));

  // ---- Spotlight Card: a soft glow follows the pointer over each card ----
  document.addEventListener('pointermove', e => {
    const card = e.target.closest && e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--sx', e.clientX - r.left + 'px');
    card.style.setProperty('--sy', e.clientY - r.top + 'px');
  });

  // ---- Magnet: buttons lean toward the pointer ----
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', e => {
      document.querySelectorAll('[data-magnet]').forEach(el => {
        const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy, near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9 + 30;
        el.style.transform = near ? `translate(${dx * 0.25}px, ${dy * 0.35}px)` : '';
      });
    });
  }

  // ---- Dock: macOS-style bar that magnifies under the pointer ----
  const dock = document.getElementById('dock');
  if (dock) {
    const items = [...dock.querySelectorAll('a')];
    dock.addEventListener('pointermove', e => {
      items.forEach(a => {
        const r = a.getBoundingClientRect(), d = Math.abs(e.clientX - (r.left + r.width / 2));
        a.style.setProperty('--m', 1 + Math.max(0, 1 - d / 120) * 0.6);
      });
    });
    dock.addEventListener('pointerleave', () => items.forEach(a => a.style.setProperty('--m', 1)));
  }

  // ---- Count Up: numbers count up when the stats row appears ----
  const countIo = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    countIo.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, suffix = el.dataset.suffix || '', start = performance.now(), dur = reduce ? 0 : 1400;
    const step = now => {
      const k = dur ? Math.min(1, (now - start) / dur) : 1, v = Math.round(to * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString() + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.5 });
  document.querySelectorAll('[data-to]').forEach(el => countIo.observe(el));
})();
