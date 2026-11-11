(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const NAMES = ['home', 'about', 'work', 'github', 'journey', 'contact'];
  const views = $$('.view'), navs = $$('.nv[data-go]');
  let cur = -1;

  function go(name, push = true) {
    const i = NAMES.indexOf(name); if (i < 0 || i === cur) return;
    const prev = cur; cur = i;
    views.forEach(v => v.classList.toggle('active', v.dataset.view === name));
    navs.forEach(n => n.classList.toggle('on', n.dataset.go === name));
    const v = views[i]; v.scrollTop = 0;
    v.dataset.dir = i >= prev ? 'next' : 'prev';
    $$('.card,.project,.stack-card,.repo-card,li,.skill,.vhead>*', v).forEach((el, k) => el.style.setProperty('--n', Math.min(k, 14)));
    if (name === 'home') { window.countUp && window.countUp(); drawChart(); }
    if (push) history.replaceState(null, '', '#' + name);
    dispatchEvent(new CustomEvent('dash:view', { detail: i / (NAMES.length - 1) }));
    const dash = $('#dash'); dash.classList.remove('flip'); void dash.offsetWidth; dash.classList.add('flip');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    e.preventDefault(); go(b.dataset.go);
  });
  addEventListener('keydown', e => {
    if (/input|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') go(NAMES[Math.min(cur + 1, 5)]);
    else if (e.key === 'ArrowLeft') go(NAMES[Math.max(cur - 1, 0)]);
    else if (/^[1-6]$/.test(e.key)) go(NAMES[+e.key - 1]);
  });
  addEventListener('hashchange', () => go(location.hash.slice(1), false));

  /* career chart with hover tooltip */
  const pts = [[2008, 'B.Eng. Computer Engineering'], [2013, 'Developer'], [2014, 'Lead Developer'], [2016, 'Co‑Founder · Manufacturing'], [2017, 'Freelance Developer'], [2019, 'Co‑Founder'], [2020, 'System Analyst'], [2026, 'Today']];
  const X0 = 2008, X1 = 2026;
  const P = pts.map(([y], i) => [(y - X0) / (X1 - X0) * 400, 88 - i * 10.5]);
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i], m = (x0 + x1) / 2; d += ` C${m} ${y0} ${m} ${y1} ${x1} ${y1}`; }
  $('#cLine').setAttribute('d', d); $('#cArea').setAttribute('d', d + ' V100 H0Z');
  function drawChart() { const l = $('#cLine'); l.style.animation = 'none'; void l.getBoundingClientRect(); l.style.animation = ''; }
  const chart = $('#chart'), dot = $('#cDot'), tip = $('#cTip');
  const place = i => {
    const [x, y] = P[i];
    dot.style.left = tip.style.left = x / 400 * 100 + '%';
    dot.style.top = tip.style.top = y + '%';
    tip.textContent = pts[i][0] + ' · ' + pts[i][1];
  };
  place(pts.length - 2);
  chart.addEventListener('pointermove', e => {
    const r = chart.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 400;
    let best = 0; P.forEach((p, i) => { if (Math.abs(p[0] - x) < Math.abs(P[best][0] - x)) best = i; });
    place(best);
  });
  chart.addEventListener('pointerleave', () => place(pts.length - 2));

  /* skill donut + legend, derived from the rendered tech stack */
  const cards = $$('#techStackGrid .stack-card');
  const all = $$('#techStackGrid .level'), adv = all.filter(l => l.classList.contains('level-advanced')).length;
  const pct = all.length ? Math.round(adv / all.length * 100) : 0;
  $('#dPct').textContent = pct + '%';
  setTimeout(() => $('#dArc').setAttribute('stroke-dasharray', `${pct} 100`), 600);
  const cols = ['#8f7bff', '#4aa8ff', '#ff6f9f', '#ffa24d'];
  $('#legend').innerHTML = cards.map((c, i) => {
    const lv = $$('.level', c), a = lv.filter(l => l.classList.contains('level-advanced')).length;
    return `<li><i style="background:${cols[i]}"></i><span>${c.querySelector('h3').textContent}</span><b>${Math.round(a / lv.length * 100)}%</b></li>`;
  }).join('');

  /* bars: years per role */
  const bars = [['PSU', 4, '#8f7bff'], ['Dev', 1, '#4aa8ff'], ['Lead', 2, '#6a8cff'], ['Mfg', 4, '#ff6f9f'], ['Free', 9, '#c96bff'], ['Co‑F', 7, '#ffa24d'], ['WU', 6, '#ff7aa8']];
  const max = Math.max(...bars.map(b => b[1]));
  $('#bars').innerHTML = bars.map(([n, v, c], i) => `<div class="bar" style="--h:${v / max * 100}%;--c:${c};--i:${i}" title="${n}: ${v} yrs"><i></i><span>${n}</span></div>`).join('');

  go(NAMES.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home', false);
  window.countUp && window.countUp();
})();
