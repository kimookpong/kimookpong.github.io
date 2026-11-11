(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);

  /* pointer -> smoothed --mx/--my (-1..1) drives the whole 3D rig */
  let px = innerWidth / 2, py = innerHeight / 2, tx = 0, ty = 0, cx = 0, cy = 0;
  const glow = $('.cursor-glow');
  addEventListener('pointermove', e => {
    px = e.clientX; py = e.clientY;
    tx = px / innerWidth * 2 - 1; ty = py / innerHeight * 2 - 1;
    document.body.classList.add('moved');
    if (glow) glow.style.transform = `translate(${px}px,${py}px)`;
  }, { passive: true });
  addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  });
  (function smooth() {
    cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
    root.style.setProperty('--mx', cx.toFixed(4)); root.style.setProperty('--my', cy.toFixed(4));
    requestAnimationFrame(smooth);
  })();

  /* per-card 3D tilt + spotlight */
  const TILT = '.card,.project,.stack-card,.repo-card,.journey li,.skill';
  let active = null;
  const reset = el => { el.style.transform = ''; el.classList.remove('hot'); };
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest(TILT);
    if (active && active !== el) reset(active);
    active = el;
    if (!el || !fine || reduce) return;
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.classList.add('hot');
    el.style.setProperty('--gx', x * 100 + '%'); el.style.setProperty('--gy', y * 100 + '%');
    el.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 9}deg) rotateY(${(x - 0.5) * 11}deg) translateY(-3px)`;
  }, { passive: true });

  /* magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });

  /* typing roles in the search bar */
  const typed = $('#typed');
  const roles = () => root.lang === 'th'
    ? ['Full‑Stack Developer', 'System Analyst', 'นักแก้โจทย์ยากๆ', 'คนรักกาแฟ']
    : ['Full‑Stack Developer', 'System Analyst', 'Problem Solver', 'Coffee Enthusiast'];
  if (typed) {
    let i = 0, j = 0, del = false;
    (function tick() {
      const word = roles()[i % 4];
      if (reduce) { typed.textContent = word; return; }
      j += del ? -1 : 1; typed.textContent = word.slice(0, j);
      let wait = del ? 35 : 80;
      if (!del && j >= word.length) { del = true; wait = 1400; } else if (del && j <= 0) { del = false; i++; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  /* count-up */
  window.countUp = () => document.querySelectorAll('.count').forEach(el => {
    const to = +el.dataset.to; if (reduce) return;
    const t0 = performance.now();
    (function step(t) {
      const k = Math.min((t - t0) / 1200, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });

  /* click sparkles */
  if (!reduce) addEventListener('pointerdown', e => {
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      const a = Math.random() * 6.283, d = 30 + Math.random() * 50;
      s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;background:hsl(${240 + Math.random() * 120},90%,70%)`;
      document.body.append(s); setTimeout(() => s.remove(), 800);
    }
  });

  /* Konami -> rainbow aurora */
  const code = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba'; let buf = '';
  addEventListener('keydown', e => {
    buf = (buf + e.key).slice(-code.length);
    if (buf === code) { $('.aurora').style.animation = 'hue 4s linear infinite'; document.head.insertAdjacentHTML('beforeend', '<style>@keyframes hue{to{filter:hue-rotate(360deg)}}</style>'); }
  });
})();
