/* ================================================================
   MAIN.JS – Portfolio logic
   • Fetches data from /api/* (falls back to inline data if server
     is not running – for GitHub Pages static hosting)
   • Typing animation, parallax, reveal-on-scroll, navbar, modal,
     filter, contact form
   ================================================================ */
(function () {
  'use strict';

  /* ── API base ─────────────────────────────────────────────────
     If you run the Node backend locally or on a server,
     set API_BASE to its URL, e.g. 'http://localhost:3000'.
     For static GitHub Pages, set to '' (uses fallback data).
  ─────────────────────────────────────────────────────────────── */
  const API_BASE = '';   // ← change to your backend URL when deployed

  /* ──────────────────────────────────────────────────────────────
     FALLBACK DATA – sourced from kimookpong.vercel.app
  ─────────────────────────────────────────────────────────────── */
  const FALLBACK = {
    profile: {
      name: 'Hakim Mudor',
      bio: "Freelance Developer based in Nakhon Si Thammarat, Thailand 🇹🇭. I have experience as a System Analyst at Walailak University since 2020, and take on freelance projects nationwide. Born in Narathiwat (1989), B.Eng. Computer Engineering from Prince of Songkla University (2012). I live by one rule: Don't Repeat Yourself.",
      stats: [
        { num: '5+',  label: 'Years at WU' },
        { num: '10+', label: 'Projects Delivered' },
        { num: '2012', label: 'B.Eng. PSU' },
      ],
    },
    skills: [
      {
        category: 'Frontend', icon: '🎨',
        items: [
          { name: 'Next.js',         level: 'advanced'     },
          { name: 'TypeScript',      level: 'advanced'     },
          { name: 'Tailwind CSS',    level: 'advanced'     },
          { name: 'Bootstrap',       level: 'advanced'     },
          { name: 'React Native',    level: 'advanced'     },
          { name: 'Line OA / LIFF',  level: 'intermediate' },
        ],
      },
      {
        category: 'Backend', icon: '⚙️',
        items: [
          { name: 'Node.js / Express', level: 'advanced'     },
          { name: 'Yii2',              level: 'advanced'     },
          { name: 'CodeIgniter',       level: 'advanced'     },
          { name: 'PHP / Laravel',     level: 'intermediate' },
          { name: 'Python',            level: 'intermediate' },
          { name: 'Go',                level: 'basic'        },
          { name: 'REST API',          level: 'advanced'     },
        ],
      },
      {
        category: 'Database', icon: '🗄️',
        items: [
          { name: 'PostgreSQL', level: 'advanced'     },
          { name: 'MongoDB',    level: 'advanced'     },
          { name: 'MySQL',      level: 'advanced'     },
          { name: 'Oracle',     level: 'intermediate' },
          { name: 'Redis',      level: 'basic'        },
        ],
      },
      {
        category: 'Infrastructure', icon: '🚀',
        items: [
          { name: 'Git / GitHub',     level: 'advanced'     },
          { name: 'Docker',           level: 'intermediate' },
          { name: 'Ubuntu Server',    level: 'intermediate' },
          { name: 'Nginx',            level: 'basic'        },
          { name: 'Apache',           level: 'basic'        },
          { name: 'Vercel / Railway', level: 'advanced'     },
        ],
      },
    ],
    projects: [
      {
        id: 1,
        title: 'Pharmacy WU Clerkship',
        desc: 'A platform for managing pharmacy clerkship programs at Walailak University. Handles scheduling, student progress tracking, and supervisor evaluations.',
        tags: ['React', 'PostgreSQL'],
        category: 'web',
        emoji: '💊',
        demo: 'https://www.pharmwuclerkship.com/',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 2,
        title: 'TCNAP – Thailand Community Network Assessment',
        desc: 'Thailand Community Network Assessment Project — a data collection and reporting platform for community health network assessments across Thailand.',
        tags: ['Next.js', 'PostgreSQL'],
        category: 'web',
        emoji: '🏥',
        demo: 'https://tcnap.org/',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 3,
        title: 'Pharmacy WU Alumni',
        desc: 'A platform for managing pharmacy alumni relations at Walailak University. Tracks graduate careers, events, and alumni networking.',
        tags: ['Next.js', 'PostgreSQL'],
        category: 'web',
        emoji: '🎓',
        demo: 'https://www.pharmwualumni.com/',
        repo: 'https://github.com/thasala-dev/alumni',
      },
      {
        id: 4,
        title: 'HRMS – Walailak University',
        desc: 'Human Resource Management System for Walailak University. Handles employee records, leave requests, payroll data, and org-chart management.',
        tags: ['Next.js', 'PostgreSQL'],
        category: 'web',
        emoji: '👥',
        demo: 'https://hrms.wu.ac.th/',
        repo: 'https://github.com/thasala-dev/wu-coop',
      },
      {
        id: 5,
        title: 'StockLazer',
        desc: 'Real-time stock management system that utilises QR code scanning for efficient inventory tracking. Supports multi-warehouse and live dashboard.',
        tags: ['TypeScript', 'Next.js', 'QR Code'],
        category: 'web',
        emoji: '🔦',
        demo: 'https://stocklazer.vercel.app/',
        repo: 'https://github.com/kimookpong/stocklazer',
      },
      {
        id: 6,
        title: 'Farm-D Project',
        desc: 'A system for developing digital tools for agricultural personnel. Enables farmers to log crop data, receive line notifications, and manage farm operations online.',
        tags: ['Next.js', 'MongoDB', 'Line OA'],
        category: 'web',
        emoji: '🌾',
        private: true,
        demo: null,
        repo: null,
      },
      {
        id: 7,
        title: 'Wanderwoods POS',
        desc: 'Point of Sale (POS) system designed for a large restaurant. Features table management, real-time order tracking, kitchen display, and end-of-day sales reports.',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        category: 'web',
        emoji: '🍽️',
        private: true,
        demo: null,
        repo: null,
      },
      {
        id: 8,
        title: 'Stock Management (QR)',
        desc: 'A stock management system utilising QR code scanning for real-time verification and monitoring of inventory across multiple locations.',
        tags: ['Next.js', 'PostgreSQL', 'QR Code'],
        category: 'web',
        emoji: '📦',
        private: true,
        demo: null,
        repo: null,
      },
      {
        id: 9,
        title: 'Udon City Tourism',
        desc: 'A tourism platform showcasing attractions, accommodations, and local services in Udon City. Includes a map interface and attraction ratings.',
        tags: ['Next.js', 'MongoDB'],
        category: 'web',
        emoji: '🗺️',
        private: true,
        demo: null,
        repo: null,
      },
      {
        id: 10,
        title: 'Gov Asset Information System',
        desc: 'A platform for managing government asset information and documentation — tracking procurement, depreciation, and physical location of assets.',
        tags: ['React', 'PostgreSQL'],
        category: 'web',
        emoji: '🏛️',
        private: true,
        demo: null,
        repo: null,
      },
      {
        id: 11,
        title: 'AB Game (Multi)',
        desc: 'A multiplayer version of the classic AB guessing game where players try to guess a 4-digit number with unique digits. Built with real-time WebSocket sync.',
        tags: ['TypeScript', 'Socket.io'],
        category: 'hobby',
        emoji: '🎮',
        private: true,
        demo: null,
        repo: 'https://github.com/kimookpong/ab-game-multi',
      },
      {
        id: 12,
        title: 'Timere',
        desc: 'A clean and minimal time tracking app. Built as a personal hobby project to explore modern frontend tooling with Vite.',
        tags: ['Vite'],
        category: 'hobby',
        emoji: '⏱️',
        demo: 'https://timere.vercel.app/',
        repo: 'https://github.com/kimookpong',
      },
    ],
    experience: [
      {
        date: '2020 – Present',
        role: 'System Analyst',
        company: 'Walailak University, Nakhon Si Thammarat',
        type: 'Full-time',
        desc: 'Design and develop internal web systems for the university — including HRMS, alumni portals, clerkship management platforms, and asset tracking tools. Primary stack: Next.js, React, PostgreSQL, Node.js.',
      },
      {
        date: '2020 – Present',
        role: 'Freelance Developer',
        company: 'Self-employed, Thailand',
        type: 'Freelance',
        desc: 'Building full-stack web applications for clients across Thailand: POS systems, tourism platforms, farming tools, and government asset management. Specialise in Next.js, MongoDB, PostgreSQL, and Line OA integrations.',
      },
      {
        date: '2012 – 2020',
        role: 'Software / Web Developer',
        company: 'Various Companies, Thailand',
        type: 'Full-time',
        desc: 'Over 8 years of hands-on experience building web applications ranging from PHP/Laravel backends to modern React frontends, working with SQL and NoSQL databases.',
      },
      {
        date: '2008 – 2012',
        role: 'B.Eng. Computer Engineering',
        company: 'Prince of Songkla University (PSU)',
        type: 'Education',
        desc: 'Bachelor degree in Computer Engineering. Graduated 2012. Foundation in algorithms, systems design, networking, and software engineering.',
      },
    ],
  };

  /* ── Helpers ──────────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  async function apiFetch(path) {
    if (!API_BASE) throw new Error('no api');
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error(res.status);
    return res.json();
  }

  /* ── Loader ───────────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    document.getElementById('loader').classList.add('hidden');
  });
  // failsafe
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2000);

  /* ── Year ─────────────────────────────────────────────────────── */
  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ── Navbar scroll ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Burger menu ──────────────────────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ── Typing animation ─────────────────────────────────────────── */
  const titles = ['Full-Stack Developer', 'System Analyst', 'Freelance Developer', 'Next.js · PostgreSQL · TypeScript'];
  let tIdx = 0, cIdx = 0, deleting = false;
  const typingEl = document.getElementById('typingText');

  function typeStep() {
    if (!typingEl) return;
    const current = titles[tIdx];
    if (!deleting) {
      typingEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) { deleting = true; setTimeout(typeStep, 1800); return; }
    } else {
      typingEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; setTimeout(typeStep, 400); return; }
    }
    setTimeout(typeStep, deleting ? 45 : 80);
  }
  setTimeout(typeStep, 1200);

  /* ── Parallax on scroll ───────────────────────────────────────── */
  const parallaxEls = $$('[data-parallax]');
  function updateParallax() {
    const sy = window.scrollY;
    parallaxEls.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.2;
      const rect   = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + sy) - window.innerHeight * 0.5;
      el.style.transform = `translateY(${offset * speed * -0.5}px)`;
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  /* ── Reveal on scroll (IntersectionObserver) ──────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  function addReveal(el, delay = 0) {
    el.classList.add('reveal');
    if (delay) el.style.transitionDelay = delay + 'ms';
    revealObs.observe(el);
  }

  /* ── Skill level helpers ──────────────────────────────────────── */
  const LEVELS = ['basic', 'intermediate', 'advanced'];
  const LEVEL_LABEL = { basic: 'Basic', intermediate: 'Intermediate', advanced: 'Advanced' };

  /* ── Render skills ────────────────────────────────────────────── */
  function renderSkills(skills) {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;

    grid.innerHTML = skills.map((cat) => `
      <div class="skill-card">
        <div class="skill-card-header">
          <div class="skill-icon">${cat.icon}</div>
          <div class="skill-category">${cat.category}</div>
        </div>
        <div class="skill-list">
          ${cat.items.map(it => `
            <div class="skill-row">
              <span class="skill-name">${it.name}</span>
              <span class="skill-level skill-level--${it.level}">${LEVEL_LABEL[it.level] || it.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    $$('.skill-card', grid).forEach((card, i) => {
      addReveal(card, i * 80);
    });
  }

  /* ── Render profile ───────────────────────────────────────────── */
  function renderProfile(p) {
    const bioEl = document.getElementById('aboutBio');
    if (bioEl) bioEl.textContent = p.bio;

    const statsEl = document.getElementById('aboutStats');
    if (statsEl && p.stats) {
      statsEl.innerHTML = p.stats.map(s =>
        `<div class="stat">
           <div class="stat-num">${s.num}</div>
           <div class="stat-label">${s.label}</div>
         </div>`
      ).join('');
    }
  }

  /* ── Render projects ──────────────────────────────────────────── */
  let allProjects = [];

  function renderProjects(projects) {
    allProjects = projects;
    const grid = document.getElementById('projectsGrid');
    const filterBar = document.getElementById('filterBar');
    if (!grid) return;

    // build filters
    const cats = ['all', ...new Set(projects.map(p => p.category))];
    filterBar.innerHTML = cats.map(c =>
      `<button class="filter-btn${c === 'all' ? ' active' : ''}" data-filter="${c}">
         ${c.charAt(0).toUpperCase() + c.slice(1)}
       </button>`
    ).join('');

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', filterBar).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });

    const THUMB_SVC = 'https://image.thum.io/get/width/1200/crop/900/noanimate/';

    // render cards
    grid.innerHTML = projects.map(p => {
      const hasDemo = p.demo && p.demo !== '#';
      const screenshotUrl = hasDemo ? `${THUMB_SVC}${p.demo}` : null;
      const thumb = hasDemo
        ? `<div class="proj-preview">
             <img class="proj-screenshot"
               src="${screenshotUrl}"
               alt="${p.title} screenshot"
               loading="lazy"
               onerror="this.parentElement.classList.add('proj-preview--error');this.style.display='none'">
             <div class="proj-preview-emoji">${p.emoji || '💻'}</div>
           </div>`
        : `<div class="project-thumb-fallback">
             ${p.private
               ? `<div class="proj-private-badge"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M5.25 10.5h13.5A1.75 1.75 0 0120.5 12.25v7A1.75 1.75 0 0118.75 21H5.25A1.75 1.75 0 013.5 19.25v-7A1.75 1.75 0 015.25 10.5z"/></svg><span>Private</span></div>`
               : p.emoji || '💻'}
           </div>`;
      return `
      <div class="project-card" data-id="${p.id}" data-category="${p.category}" role="button" tabindex="0">
        ${thumb}
        <div class="project-body">
          <div class="project-tags">
            ${(p.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
          <div class="project-arrow">View Details <span>→</span></div>
        </div>
      </div>`;
    }).join('');

    $$('.project-card', grid).forEach((card, i) => {
      addReveal(card, i * 70);
      card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(parseInt(card.dataset.id)); });
    });
  }

  function applyFilter(filter) {
    $$('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  }

  /* ── Render experience ────────────────────────────────────────── */
  function renderExperience(exp) {
    const tl = document.getElementById('timeline');
    if (!tl) return;
    tl.innerHTML = exp.map(e => `
      <div class="timeline-item">
        <div class="timeline-date">${e.date}</div>
        <div class="timeline-role">${e.role}</div>
        <div class="timeline-company">
          ${e.company}
          <span class="badge">${e.type}</span>
        </div>
        <div class="timeline-desc">${e.desc}</div>
      </div>
    `).join('');

    $$('.timeline-item', tl).forEach((item, i) => addReveal(item, i * 100));
  }

  /* ── Modal ────────────────────────────────────────────────────── */
  const overlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function openModal(id) {
    const p = allProjects.find(x => x.id === id);
    if (!p) return;

    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalDesc').textContent  = p.desc;

    const tagsEl = document.getElementById('modalTags');
    tagsEl.innerHTML = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

    const imgEl = document.getElementById('modalImg');
    const modalPreview = document.getElementById('modalPreview');

    if (modalPreview) modalPreview.innerHTML = '';
    if (imgEl) imgEl.style.display = 'none';

    if (p.demo && p.demo !== '#' && modalPreview) {
      const ss = `https://image.thum.io/get/width/1200/crop/675/noanimate/${p.demo}`;
      modalPreview.innerHTML = `
        <div class="modal-iframe-wrap">
          <img class="modal-screenshot" src="${ss}" alt="${p.title} preview" loading="lazy"
            onerror="this.parentElement.classList.add('modal-ss--error')">
        </div>`;
      modalPreview.style.display = '';
    } else if (modalPreview) {
      modalPreview.innerHTML = `<div class="modal-preview-fallback">
        ${p.private
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V7a4.5 4.5 0 00-9 0v3.5M5.25 10.5h13.5A1.75 1.75 0 0120.5 12.25v7A1.75 1.75 0 0118.75 21H5.25A1.75 1.75 0 013.5 19.25v-7A1.75 1.75 0 015.25 10.5z"/></svg><p>Private Repository</p>`
          : `<span style="font-size:3rem">${p.emoji || '💻'}</span>`}
      </div>`;
      modalPreview.style.display = '';
    }

    const demoEl = document.getElementById('modalDemo');
    const repoEl = document.getElementById('modalRepo');
    demoEl.href = p.demo || '#';
    repoEl.href = p.repo || '#';
    demoEl.style.display = p.demo ? '' : 'none';
    repoEl.style.display = p.repo ? '' : 'none';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // clear iframe to stop any background loading
    const mp = document.getElementById('modalPreview');
    if (mp) mp.innerHTML = '';
  }

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ── Init – fetch or use fallback ──────────────────────────────── */
  async function init() {
    let profile, skills, projects, experience;

    try {
      [profile, skills, projects, experience] = await Promise.all([
        apiFetch('/api/profile'),
        apiFetch('/api/skills'),
        apiFetch('/api/projects'),
        apiFetch('/api/experience'),
      ]);
    } catch {
      ({ profile, skills, projects, experience } = FALLBACK);
    }

    renderProfile(profile);
    renderSkills(skills);
    renderProjects(projects);
    renderExperience(experience);
    loadGitHubData();

    // reveal about section
    $$('#about h2, #about p, #about .btn-outline, .about-stats').forEach((el, i) => addReveal(el, i * 80));
    $$('#github-activity .section-label, #github-activity .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#github-activity .gh-profile-stats, #github-activity .gh-contrib-wrap, #github-activity .gh-repos-header').forEach((el, i) => addReveal(el, i * 80));
    $$('#skills .section-label, #skills .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#projects .section-label, #projects .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#experience .section-label, #experience .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#contact .contact-heading, #contact .contact-sub, #contact .contact-form, #contact .social-links').forEach((el, i) => addReveal(el, i * 80));
  }

  /* ── GitHub live data ─────────────────────────────────────────── */
  const LANG_COLOR = {
    JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
    PHP: '#777bb4', HTML: '#e34c26', CSS: '#563d7c', Vue: '#42b883',
    Svelte: '#ff3e00', Dart: '#00b4ab', Shell: '#89e051',
  };

  function loadGitHubData() {
    const GH   = 'https://api.github.com';
    const USER = 'kimookpong';
    const CACHE_KEY = 'gh_cache_v1';
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour
    const GH_HEADERS = { headers: { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } };

    function ghFetch(url) {
      return fetch(url, GH_HEADERS).then(r => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        return r.json();
      });
    }

    function loadFromCache() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts > CACHE_TTL) return null;
        return data;
      } catch { return null; }
    }

    function saveToCache(data) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
    }

    function applyGitHubData({ user, repos }) {
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
      set('ghRepos',     user.public_repos);
      set('ghFollowers', user.followers);
      set('ghFollowing', user.following);

      const ownRepos = repos.filter(r => !r.fork);
      const stars = ownRepos.reduce((acc, r) => acc + r.stargazers_count, 0);
      set('ghStars', stars);

      const langCount = {};
      ownRepos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
      renderLangStats(langCount);

      renderRepos(ownRepos.sort((a, b) =>
        new Date(b.updated_at) - new Date(a.updated_at)
      ).slice(0, 12));
    }

    // Try cache first
    const cached = loadFromCache();
    if (cached) {
      applyGitHubData(cached);
      return;
    }

    // Fetch fresh data
    ghFetch(`${GH}/users/${USER}`)
      .then(user =>
        ghFetch(`${GH}/users/${USER}/repos?per_page=100&sort=updated`)
          .then(repos => {
            const payload = { user, repos };
            saveToCache(payload);
            applyGitHubData(payload);
          })
      )
      .catch(err => {
        console.warn('GitHub API failed:', err.message);
      });
  }

  function renderLangStats(langCount) {
    const el = document.getElementById('ghLangStats');
    if (!el) return;

    const sorted = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const total = sorted.reduce((s, [, v]) => s + v, 0);

    // Stacked bar
    const barSegs = sorted.map(([lang, count]) => {
      const pct = (count / total * 100).toFixed(1);
      const color = LANG_COLOR[lang] || '#22c55e';
      return `<span class="lang-bar-seg" style="width:${pct}%;background:${color}" title="${lang} ${pct}%"></span>`;
    }).join('');

    // Legend rows
    const legend = sorted.map(([lang, count]) => {
      const pct = (count / total * 100).toFixed(1);
      const color = LANG_COLOR[lang] || '#22c55e';
      return `
        <div class="lang-row">
          <span class="lang-dot" style="background:${color}"></span>
          <span class="lang-name">${lang}</span>
          <div class="lang-track"><div class="lang-fill" style="width:${pct}%;background:${color}"></div></div>
          <span class="lang-pct">${pct}%</span>
          <span class="lang-count">${count} repo${count > 1 ? 's' : ''}</span>
        </div>`;
    }).join('');

    el.innerHTML = `<div class="lang-bar">${barSegs}</div><div class="lang-legend">${legend}</div>`;
  }

  function renderRepos(repos) {
    const grid = document.getElementById('ghReposGrid');
    if (!grid) return;
    grid.innerHTML = repos.map(r => {
      const lang = r.language || '';
      const dot  = LANG_COLOR[lang]
        ? `<span class="repo-lang-dot" style="background:${LANG_COLOR[lang]}"></span>`
        : '';
      const desc = r.description ? `<p class="repo-desc">${r.description}</p>` : '';
      const updated = new Date(r.updated_at).toLocaleDateString('en-GB', { year:'numeric', month:'short' });
      return `
        <a class="repo-card reveal" href="${r.html_url}" target="_blank" rel="noopener">
          <div class="repo-top">
            <svg class="repo-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v10.5a.5.5 0 0 1-.777.416L8 10.101l-5.223 3.315A.5.5 0 0 1 2 13V2.5z"/>
            </svg>
            <span class="repo-name">${r.name}</span>
          </div>
          ${desc}
          <div class="repo-meta">
            <span class="repo-lang">${dot}${lang}</span>
            <span class="repo-updated">${updated}</span>
            ${r.stargazers_count > 0 ? `<span class="repo-stars">★ ${r.stargazers_count}</span>` : ''}
          </div>
        </a>`;
    }).join('');

    // observe each card for reveal animation
    $$('.repo-card', grid).forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      revealObs.observe(el);
    });
  }

  init();

})();
