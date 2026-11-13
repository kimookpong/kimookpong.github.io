(() => {
const D = window.PORTFOLIO;
const $ = id => document.getElementById(id);
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

/* ---------- icons ---------- */
const stroke = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC = {
  user: stroke('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'),
  grid: stroke('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
  layers: stroke('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>',
  clock: stroke('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  mail: stroke('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 7l8.5 6 8.5-6"/>'),
  monitor: stroke('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'),
  server: stroke('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
  db: stroke('<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  cloud: stroke('<path d="M7 18a4.5 4.5 0 01-.6-8.96A6 6 0 0118 8.5a4.5 4.5 0 01-.5 9.5z"/>'),
  star: stroke('<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1.1 6.1L12 17l-5.5 2.8 1.1-6.1-4.4-4.3 6.1-.8z"/>'),
  close: '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};
const GROUP_IC = { Frontend:['monitor','#2563eb'], Backend:['server','#7c3aed'], Database:['db','#0f8a6a'], Infrastructure:['cloud','#c2410c'] };
const LEVEL = { Advanced:3, Intermediate:2, Basic:1 };

/* =========================================================
   CARDS — l,t,w,h = position on the 736×1104 portrait poster
   X,T = desktop position: X = left edge measured from the screen
   centre (where the person sits), T = top; both in screen-height/1000,
   rt = card tilt, depth = parallax depth
   ========================================================= */
const CARDS = [
  /* slot: "Photoshop" (upper-left) */
  { id:'about', nav:'navAbout', icon:'avatar', ib:'#0b2340', color:'#3d9dff', pw:620,
    l:100, t:190, X:-390, T:150, w:168, h:226, rt:'rotateY(16deg) rotateZ(-2deg)', depth:1.2, bob:'6.5s', delay:'0s' },
  /* slot: "AI Models" (upper-right, list) */
  { id:'stack', nav:'navStack', icon:'layers', ib:'#121a3a', color:'#4fb3ff', pw:760,
    l:520, t:172, X:200, T:140, w:186, h:248, rt:'rotateY(-14deg) rotateZ(1deg)', depth:1.4, bob:'6s', delay:'-1s' },
  /* slot: "Illustrator" (lower-left, orange) */
  { id:'journey', nav:'navJourney', icon:'clock', ib:'#330f00', ic:'#ff9a3d', color:'#ff9433', pw:640,
    l:40, t:450, X:-420, T:470, w:172, h:236, rt:'rotateY(18deg) rotateZ(-3deg)', depth:1.8, bob:'6.8s', delay:'-3s' },
  /* slot: "CapCut" (lower-right, screen preview) */
  { id:'github', nav:'navGithub', icon:'github', ib:'#ffffff', ic:'#0d1117', color:'#8c7dff', pw:780,
    l:523, t:466, X:230, T:480, w:170, h:252, rt:'rotateY(-16deg) rotateZ(2deg)', depth:1.5, bob:'7.4s', delay:'-4s' }
];
/* one card per featured project (data.js → featured). They share the orbit with
   the section cards; l/t and X/T are only used when motion is reduced and the orbit is off. */
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
D.featured.forEach((f, i) => CARDS.push({ id:'p-' + slug(f.title), f, ring:1, color:f.color, ib:'#0b0e1a', pw:720,
  l:40 + (i % 4) * 172, t:770, X:[-600, -420, 250, 430][i % 4], T:650, w:150, h:196,
  rt:'rotateX(4deg)', depth:1.9, bob:`${(6 + i * .55).toFixed(2)}s`, delay:`${(-i * 1.3).toFixed(1)}s` }));
const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));
const kindOf = f => f.kind[lang] || f.kind.en;

let lang = 'en';
const t = k => D.T[lang][k] ?? D.T.en[k] ?? k;
const icon = (c, extra='') => c.f
  ? `<span class="ico ava shotico" style="--ib:${c.ib}" ${extra}><img src="${c.f.img}" alt="" width="64" height="64"></span>`
  : c.icon === 'avatar'
  ? `<span class="ico ava" style="--ib:${c.ib}" ${extra}><img src="assets/img/hakim-avatar.webp" alt="" width="64" height="64"></span>`
  : `<span class="ico" style="--ib:${c.ib};--ic:${c.ic||'#fff'}" ${extra}>${IC[c.icon]}</span>`;

/* GitHub data (live, cached 1h) */
const gh = { state:'loading', repos:[], all:[], stars:0, followers:null, following:null, langs:[] };

const SOCIAL = {
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 .9-1H17V2.2h-2.9C10.9 2.2 10.2 4.6 10.2 6.1v2.4H8v3.7h2.2V22H14v-9.8h2.8l.4-3.7z"/></svg>',
  in: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.5 3a2 2 0 110 4 2 2 0 010-4zM3 9h3v12H3zM9 9h2.9v1.7c.4-.8 1.4-1.9 3.4-1.9 3 0 3.7 2 3.7 4.6V21h-3v-6.6c0-1.3-.1-2.9-1.9-2.9s-2.1 1.4-2.1 2.8V21H9z"/></svg>'
};
function cardBody(c){
  const P = D.projects;
  if (c.f) return `<span class="panelette shot"><img src="${c.f.img}" alt="" loading="lazy" decoding="async"></span>
      <h3>${esc(c.f.title)}</h3><span class="meta">${esc(kindOf(c.f))}</span>`;
  switch(c.id){
    case 'about': return `${icon(c)}<h3>${t('navAbout')}</h3>
      <span class="panelette pv"><span class="pv-stats"><b>${D.stats.years}+<small>${lang==='th'?'ปี':'yrs'}</small></b><b>${D.stats.shipped}+<small>${lang==='th'?'งาน':'projects'}</small></b></span>
      <span class="pv-hello"><i class="dot"></i>${t('navContact')}<span class="soc">${SOCIAL.fb}${SOCIAL.in}</span></span></span>`;
    case 'stack': return `<h3>${t('navStack')}</h3><ul class="models">${D.stack.map(g=>{const [i,b]=GROUP_IC[g[0]];return `<li><i style="--b:${b}">${IC[i]}</i>${g[0]}</li>`}).join('')}</ul>`;
    case 'journey': return `${icon(c)}<h3>${t('navJourney')}</h3><span class="panelette ill"><svg class="mini-tl" viewBox="0 0 140 30" aria-hidden="true"><path d="M5 26 C 30 2, 90 -2, 135 14" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="5" cy="26" r="3.4" fill="#ffb648"/><rect x="66" y="3" width="6" height="6" fill="#fff"/><circle cx="135" cy="14" r="3.4" fill="#ffb648"/></svg><span class="ill-tiles"><span class="tile-sq"><b>2008</b><small>B.Eng.</small></span><span class="tile-sq"><b>Now</b><small>SA</small></span></span></span>`;
    case 'github': return `${icon(c)}<h3>GitHub</h3><span class="screen"><span class="scr-bar"><i></i><i></i><i></i><em>@${D.githubUser}</em></span><img class="heat" src="assets/img/github-chart.svg" alt="" width="663" height="104"><span class="scr-stats"><span><b>${gh.all.length||'—'}</b>repos</span><span><b>${gh.all.length?gh.stars:'—'}</b>stars</span></span><span class="scr-rows"><i style="width:82%"></i><i style="width:64%"></i><i style="width:46%"></i></span></span>`;
  }
}

/* ---------- panels ---------- */
function head(c, kicker, title){
  return `<div class="p-head">${icon(c)}<div><small>${kicker}</small><h2 id="pTitle">${title}</h2></div></div>`;
}
const level = l => `<span class="lvl">${l}<i>${[1,2,3].map(n=>`<u class="${n<=LEVEL[l]?'on':''}"></u>`).join('')}</i></span>`;

function renderPanel(c){
  const L = D.links;
  if (c.f) { const f = c.f;   // a featured project's own panel
    return `${head(c, kindOf(f), esc(f.title))}
      <a class="fshot" href="${f.url}" target="_blank" rel="noopener" aria-label="${esc(f.title)} — ${t('tryLive')}"><img src="${f.img}" alt="" decoding="async"></a>
      <p class="p-desc">${esc(f[lang] || f.en)}</p>
      <div class="sec"><h4>Stack</h4><div class="tags">${f.tags.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>
      <div class="btns"><a class="btn primary" href="${f.url}" target="_blank" rel="noopener">${t('tryLive')} ↗</a>${f.repo ? `<a class="btn" href="${f.repo}" target="_blank" rel="noopener">${t('source')} ↗</a>` : ''}</div>`;
  }
  switch(c.id){
    case 'about': return `${head(c, t('aboutKicker'), t('aboutTitle'))}
      <p class="p-desc">${t('heroLead')}</p>
      <div class="stats"><div class="stat"><b>${D.stats.years}+</b><span>${t('years')}</span></div><div class="stat"><b>${D.stats.shipped}+</b><span>${t('shipped')}</span></div><div class="stat"><b class="sm">${t('location')}</b><span>Thailand</span></div></div>
      <p class="p-desc">${t('aboutP1')}</p><p class="p-desc">${t('aboutP2')}</p>
      <div class="sec"><h4>Skills</h4><div class="tags">${D.quickSkills.map(s=>`<span>${esc(s)}</span>`).join('')}</div></div>
      <div class="sec contact-sec"><h4>${t('contactKicker')}</h4><h3>${t('contactTitle')}</h3><p class="p-desc">${t('contactText')}</p>
      <div class="btns"><a class="btn primary" href="${L.facebook}" target="_blank" rel="noopener">${t('message')} ↗</a><a class="btn" href="${L.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a><a class="btn" href="${L.github}" target="_blank" rel="noopener">GitHub ↗</a></div></div>`;
    case 'stack': return `${head(c, 'Skills', t('navStack'))}
      <p class="p-desc">${t('stackIntro')}</p>
      <div class="sgrid">${D.stack.map(g=>`<section class="sgroup"><h5>${g[0]}</h5>${g[1].map(s=>`<div class="srow"><span>${esc(s[0])}</span>${level(s[1])}</div>`).join('')}</section>`).join('')}</div>`;
    case 'github': return `${head(c, '@'+D.githubUser, t('githubKicker'))}
      <div class="stats five"><div class="stat"><b>${gh.all.length||'—'}</b><span>Public Repos</span></div><div class="stat"><b>${gh.all.length?gh.stars:'—'}</b><span>Total Stars</span></div><div class="stat"><b>${gh.followers??'—'}</b><span>Followers</span></div><div class="stat"><b>${gh.following??'—'}</b><span>Following</span></div><div class="stat"><b>${D.githubOrgs}</b><span>Organizations</span></div></div>
      <div class="sec"><h4>${t('languages')}</h4><div class="langs-list">${gh.langs.map(([l,n])=>`<span><i></i>${esc(l)} · ${n}</span>`).join('') || `<span class="muted">—</span>`}</div></div>
      <div class="sec"><h4>${t('heatmapTitle')}</h4><div class="heatbox"><img src="assets/img/github-chart.svg" alt="GitHub contribution heat map" width="663" height="104"></div><p class="note">${t('heatmapNote')}</p></div>
      <div class="sec"><h4>Public Repositories</h4>${
        gh.state==='loading' ? `<p class="muted">${t('repoLoading')}</p>` :
        gh.state==='error' ? `<p class="muted">${t('repoError')} <a href="${L.repos}" target="_blank" rel="noopener">GitHub ↗</a></p>` :
        `<div class="repos">${gh.repos.map(r=>`<article class="repo"><h5>${esc(r.name)}</h5><p>${esc(r.description||t('noDescription'))}</p><div class="rm">${r.language?`<span>${esc(r.language)}</span>`:''}<span>★ ${r.stargazers_count}</span></div><a href="${r.html_url}" target="_blank" rel="noopener" aria-label="${esc(r.name)} on GitHub"></a></article>`).join('')}</div>`}</div>
      <div class="btns"><a class="btn primary" href="${L.github}" target="_blank" rel="noopener">@${D.githubUser} ↗</a></div>`;
    case 'journey': return `${head(c, t('journeyKicker'), t('journeyTitle'))}
      <p class="p-desc">${t('journeyIntro')}</p>
      <ol class="tl">${D.careers.map(x=>`<li><time>${x[0]}</time><h5>${esc(x[1])}</h5><div class="where">${esc(x[2])}<span class="type">${esc(x[3])}</span></div><p>${esc(x[4])}</p></li>`).join('')}</ol>`;
  }
}

/* ---------- build cards ---------- */
const cardsEl = $('cards');
CARDS.forEach((c, i) => {
  const el = document.createElement('div');
  el.className = `card ${c.f ? 'proj-card' : c.id}`;
  el.dataset.id = c.id;
  el.ring = c.ring || 0;
  el.style.cssText = `--l:${c.l};--t:${c.t};--X:${c.X};--T:${c.T};--w:${c.w};--h:${c.h};--rt:${c.rt};--c:${c.color};--bob:${c.bob};--delay:${c.delay}`;
  el.innerHTML = `<div class="card-tilt"><button class="card-face${c.grad?' grad':''}" aria-haspopup="dialog"><span class="face-body"></span></button></div>`;
  el.face = el.querySelector('.card-face');
  el.body = el.querySelector('.face-body');
  window.LiquidGlass && LiquidGlass.attach(el.face, c.grad ? '#a98bff' : c.color);
  el.keyNo = i + 1;
  cardsEl.appendChild(el);
});
const cardEls = [...document.querySelectorAll('.card')];
function renderCards(){
  cardEls.forEach(el => {
    const c = BY_ID[el.dataset.id];
    el.body.innerHTML = `<span class="key" aria-hidden="true">${el.keyNo}</span>${cardBody(c)}`;
    el.face.setAttribute('aria-label', `${t('open')}: ${c.f ? c.f.title : t(c.nav)}`);
  });
}

/* ---------- language ---------- */
function setLang(l){
  lang = l === 'th' ? 'th' : 'en';
  document.documentElement.lang = lang;
  try { localStorage.setItem('portfolio-lang', lang); } catch {}
  document.title = t('title');
  document.querySelectorAll('[data-t]').forEach(e => { e.innerHTML = t(e.dataset.t); });
  document.querySelectorAll('[data-lang]').forEach(b => { const on = b.dataset.lang === lang; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
  $('person').alt = lang === 'th' ? 'ฮากิม มูดอ นั่งทำงานกับแล็ปท็อป' : 'Hakim Mudor sitting with a laptop';
  renderCards();
  if (openId) { inner.innerHTML = renderPanel(BY_ID[openId]); bindPanel(); }
}
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
$('year').textContent = new Date().getFullYear();

/* ---------- mouse parallax ---------- */
const bg=$('bg'), person=$('person'), ambient=$('ambient'), tilt=$('tilt'), spot=$('spot'),
      sBack=$('streaksBack'), sFront=$('streaksFront'), headline=$('headline'), scene=$('scene');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let tx=0, ty=0, cx=0, cy=0, lastMove=-1e9, px=innerWidth/2, py=innerHeight/2;
addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  tx=(e.clientX/innerWidth)*2-1; ty=(e.clientY/innerHeight)*2-1;
  px=e.clientX; py=e.clientY; lastMove=performance.now();
}, { passive:true });

/* ---------- 2.5D orbit: cards circle the person on a tilted ellipse ----------
   sin(angle) > 0 → the card is on the near side: drawn over the person, full size, sharp.
   sin(angle) < 0 → far side: behind the person, smaller, dimmer and slightly blurred.
   The near/far swap happens at the ellipse's left/right ends, beside the person,
   so a card never pops through the body. */
const orbitOn = !reduce;
/* one ring for every card. Project cards are interleaved between the section
   cards (about, project, work, project, …) so neither group bunches up. */
const RINGS = [{ period:60000, dir:1, ang:-Math.PI / 2, rx:1, ry:1, dy:0, scale:1 }];
{
  const sec = cardEls.filter(el => !el.ring), prj = cardEls.filter(el => el.ring), order = [];
  for (let i = 0; i < Math.max(sec.length, prj.length); i++) { if (sec[i]) order.push(sec[i]); if (prj[i]) order.push(prj[i]); }
  RINGS[0].cards = order;
}
let orbitSpeed = 1, orbitPrev = 0, hoverCount = 0, geo = null;
if (orbitOn) cardsEl.classList.add('orbit');
function measureOrbit(){
  const W = tilt.clientWidth, H = tilt.clientHeight, wide = W / H >= 1.25;
  const cw = Math.max(...cardEls.map(el => el.offsetWidth)), ch = Math.max(...cardEls.map(el => el.offsetHeight));
  // orbit centre: the person's head column, about a quarter of the way down the figure
  const ox = person.offsetLeft + person.offsetWidth * .57, oy = person.offsetTop + person.offsetHeight * .25;
  const room = Math.min(ox, W - ox) - cw * .5 - (wide ? 24 : 6);
  geo = { ox, oy, H, rx: Math.max(40, Math.min(room, wide ? H * .58 : W)), ry: H * (wide ? .12 : .16) };
  cardEls.forEach(el => { el.cw = el.offsetWidth; el.ch = el.offsetHeight; });
}
addEventListener('resize', () => { geo = null; });
cardEls.forEach(el => {
  el.addEventListener('pointerenter', () => hoverCount++);
  el.addEventListener('pointerleave', () => { hoverCount = Math.max(0, hoverCount - 1); });
});
function orbit(now, s){
  if (!geo) measureOrbit();
  const dt = Math.min(now - (orbitPrev || now), 64); orbitPrev = now;
  const target = openId ? 0 : hoverCount ? .08 : 1;     // slow right down under the pointer, freeze while a panel is open
  orbitSpeed = openId ? 0 : orbitSpeed + (target - orbitSpeed) * .06;
  RINGS.forEach(R => {
    R.ang += R.dir * dt / R.period * Math.PI * 2 * orbitSpeed;
    const ry = geo.ry * R.ry * (1 - cy * .35);          // mouse tips the orbit plane toward / away from you
    R.cards.forEach((el, i) => {
    const a = R.ang + i * Math.PI * 2 / R.cards.length;
    const sn = Math.sin(a), cs = Math.cos(a), near = (sn + 1) / 2;
    const sc = R.scale * (.74 + .26 * near);
    const x = geo.ox + cs * geo.rx * R.rx - el.cw / 2 + cx * 4 * s * (1 + near);
    const y = geo.oy + geo.H * R.dy + sn * ry - el.ch / 2 + cy * 3 * s * (1 + near);
    el.style.transform = `translate3d(${x}px,${y}px,0) scale(${sc})`;
    // depth order: far side 2–6 (in front of the projector at z 1, behind the person at z 10), near side 15–19
    el.style.zIndex = sn > 0 ? 11 + Math.round(near * 8) : 2 + Math.round(near * 8);
    el.face.lgFront = sn > 0;          // liquid glass then shows the person through this card
    el.style.opacity = (.62 + .38 * near).toFixed(3);
    el.style.filter = near < .45 ? `blur(${((.45 - near) * 3.2).toFixed(2)}px)` : '';
    el.style.setProperty('--rt', `rotateY(${(-cs * 24).toFixed(2)}deg) rotateZ(${(cs * -2).toFixed(2)}deg)`);
    });
  });
}

function frame(now){
  if (now-lastMove > 2500) { tx=Math.sin(now/3200)*.3; ty=Math.cos(now/4200)*.2; }  // idle drift (touch / no mouse)
  const k = reduce ? 1 : .045, m = reduce ? 0 : 1;
  cx += (tx-cx)*k; cy += (ty-cy)*k;
  const s = scene.offsetHeight/1104;
  tilt.style.transform = `rotateY(${cx*1.2*m}deg) rotateX(${-cy*.8*m}deg)`;
  bg.style.transform = `translate3d(${-cx*5*s*m}px,${-cy*3*s*m}px,0)`;
  const pj = document.getElementById('projector');   // projector screen hangs on the back wall
  if (pj) pj.style.transform = bg.style.transform;
  sBack.style.transform = `translate3d(${-cx*3*s*m}px,${-cy*2*s*m}px,0)`;
  person.style.transform = `translate3d(${cx*10*s*m}px,${cy*5*s*m}px,0)`;
  sFront.style.transform = `translate3d(${cx*7*s*m}px,${cy*4*s*m}px,0)`;
  headline.style.transform = `translate3d(${cx*5*s*m}px,${cy*3*s*m}px,0)`;
  ambient.style.transform = `scale(1.15) translate3d(${-cx*8*m}px,${-cy*5*m}px,0)`;
  if (orbitOn) orbit(now, s);
  else cardEls.forEach(el => { const d = BY_ID[el.dataset.id].depth;
    el.style.transform = `translate3d(${cx*4*d*s*m}px,${cy*3*d*s*m}px,0)`; });
  const r = scene.getBoundingClientRect();
  spot.style.setProperty('--sx', ((px-r.left)/r.width*100)+'%');
  spot.style.setProperty('--sy', ((py-r.top)/r.height*100)+'%');
  if (!openId && window.LiquidGlass) LiquidGlass.render(bg, person);   // liquid glass follows the parallax
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

cardEls.forEach(el => {
  const tl = el.querySelector('.card-tilt'), f = el.face;
  el.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r=f.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    tl.style.transform = `perspective(900px) var(--rt) rotateY(${(x-.5)*6}deg) rotateX(${(.5-y)*6}deg) scale(1.03)`;
    f.style.setProperty('--hx',x*100+'%'); f.style.setProperty('--hy',y*100+'%');
  });
  el.addEventListener('pointerleave', () => { tl.style.transform=''; });
  f.addEventListener('click', () => openPanel(el.dataset.id));
});

/* ---------- pop-out detail panel (FLIP from card → center) ---------- */
const overlay=$('overlay'), panel=$('panel'), inner=$('panelInner');
let origin=null, openId=null, busy=false;
function bindPanel(){
  const fs = inner.querySelectorAll('.filters button');
  fs.forEach(b => b.addEventListener('click', () => {
    fs.forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
    inner.querySelectorAll('.proj').forEach(p => { p.hidden = b.dataset.cat !== 'all' && p.dataset.cat !== b.dataset.cat; });
  }));
}
function flipFrom(rect){
  const p = panel.getBoundingClientRect();
  return `translate(${rect.left-p.left}px,${rect.top-p.top}px) scale(${rect.width/p.width},${rect.height/p.height})`;
}
function openPanel(id){
  if (busy || !BY_ID[id]) return;
  if (openId) { if (openId !== id) swapPanel(id); return; }
  busy = true;
  const c = BY_ID[id]; openId = id; origin = cardEls.find(e => e.dataset.id === id).face;
  panel.style.setProperty('--c', c.color); panel.style.setProperty('--pw', c.pw+'px');
  inner.innerHTML = renderPanel(c); bindPanel(); panel.scrollTop = 0;
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');
  panel.style.transition='none'; panel.style.transform=flipFrom(origin.getBoundingClientRect()); panel.style.opacity='.4';
  origin.style.visibility='hidden';
  panel.offsetWidth;
  history.replaceState(null, '', '#'+id);
  requestAnimationFrame(() => {
    overlay.classList.add('show');
    panel.style.transition='transform .65s cubic-bezier(.18,1.15,.32,1), opacity .25s';
    panel.style.transform='none'; panel.style.opacity='1';
    setTimeout(() => { panel.querySelector('.close').focus({preventScroll:true}); busy=false; }, 420);
  });
}
function swapPanel(id){   // keyboard shortcut while a panel is open
  const c = BY_ID[id];
  origin.style.visibility='';
  openId = id; origin = cardEls.find(e => e.dataset.id === id).face; origin.style.visibility='hidden';
  panel.style.setProperty('--c', c.color); panel.style.setProperty('--pw', c.pw+'px');
  inner.innerHTML = renderPanel(c); bindPanel(); panel.scrollTop = 0;
  history.replaceState(null, '', '#'+id);
}
function closePanel(){
  if (busy || !openId) return; busy = true;
  overlay.classList.remove('show');
  panel.style.transition='transform .42s cubic-bezier(.5,0,.75,0), opacity .42s ease-in';
  panel.style.transform=flipFrom(origin.getBoundingClientRect()); panel.style.opacity='.3';
  history.replaceState(null, '', location.pathname + location.search);
  setTimeout(() => { overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
    panel.style.transition='none'; panel.style.transform='none'; panel.style.opacity='1';
    origin.style.visibility=''; origin.focus({preventScroll:true}); openId=null; busy=false; }, 430);
}
overlay.addEventListener('click', e => { if (e.target.closest('[data-close]')) closePanel(); });
addEventListener('keydown', e => {
  if (e.key === 'Escape') return closePanel();
  if (/^[1-9]$/.test(e.key) && CARDS[+e.key-1] && !e.metaKey && !e.ctrlKey && !e.altKey) openPanel(CARDS[+e.key-1].id);
  if (e.key === 'Tab' && openId) {   // keep focus inside the dialog
    const f = [...panel.querySelectorAll('button,a[href]')].filter(x => x.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length-1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length-1]) { e.preventDefault(); f[0].focus(); }
  }
});

/* ---------- GitHub (cached 1 hour) ---------- */
function applyGh(data){
  const all = data.repos.filter(r => !r.fork && !r.archived);
  gh.all = all;
  gh.repos = [...all].sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 9);
  gh.stars = all.reduce((n,r) => n + r.stargazers_count, 0);
  const counts = {}; all.forEach(r => { if (r.language) counts[r.language] = (counts[r.language]||0) + 1; });
  gh.langs = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 8);
  gh.followers = data.profile?.followers ?? null; gh.following = data.profile?.following ?? null;
  gh.state = 'ok';
}
async function loadGithub(){
  const KEY = 'portfolio-gh-v2';
  try {
    const cached = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (cached && Date.now() - cached.at < 36e5) { applyGh(cached); return; }
  } catch {}
  try {
    const H = { headers:{ Accept:'application/vnd.github+json' } };
    const [rr, pr] = await Promise.all([
      fetch(`https://api.github.com/users/${D.githubUser}/repos?per_page=100&sort=updated`, H),
      fetch(`https://api.github.com/users/${D.githubUser}`, H)
    ]);
    if (!rr.ok) throw new Error('GitHub API unavailable');
    const repos = (await rr.json()).map(r => ({ name:r.name, description:r.description, language:r.language, stargazers_count:r.stargazers_count, html_url:r.html_url, pushed_at:r.pushed_at, fork:r.fork, archived:r.archived }));
    const p = pr.ok ? await pr.json() : null;
    const data = { at:Date.now(), repos, profile: p && { followers:p.followers, following:p.following } };
    applyGh(data);
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  } catch { gh.state = 'error'; }
}

/* ---------- init ---------- */
if (window.LiquidGlass) LiquidGlass.init(bg.currentSrc || bg.src, person.currentSrc || person.src).then(on => document.documentElement.classList.toggle('lg', on));
let initial = 'en';
try { initial = localStorage.getItem('portfolio-lang') || 'en'; } catch {}
const q = new URLSearchParams(location.search).get('lang');
setLang(q === 'th' || q === 'en' ? q : initial);
loadGithub().then(() => { renderCards(); if (openId === 'github') { inner.innerHTML = renderPanel(BY_ID.github); bindPanel(); } });
const start = location.hash.slice(1) === 'contact' ? 'about' : location.hash.slice(1);
if (BY_ID[start]) setTimeout(() => openPanel(start), 500);
})();
