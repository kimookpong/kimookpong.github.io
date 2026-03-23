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
          { name: 'Next.js / React', level: 'advanced'     },
          { name: 'TypeScript',      level: 'advanced'     },
          { name: 'Tailwind CSS',    level: 'advanced'     },
          { name: 'Line OA / LIFF',  level: 'intermediate' },
        ],
      },
      {
        category: 'Backend', icon: '⚙️',
        items: [
          { name: 'Node.js / Express', level: 'advanced'     },
          { name: 'Python',            level: 'intermediate' },
          { name: 'REST API',          level: 'advanced'     },
          { name: 'PHP / Laravel',     level: 'intermediate' },
        ],
      },
      {
        category: 'Database', icon: '🗄️',
        items: [
          { name: 'PostgreSQL', level: 'advanced'     },
          { name: 'MongoDB',    level: 'advanced'     },
          { name: 'MySQL',      level: 'intermediate' },
          { name: 'Redis',      level: 'basic'        },
        ],
      },
      {
        category: 'Tools & DevOps', icon: '🚀',
        items: [
          { name: 'Git / GitHub',     level: 'advanced'     },
          { name: 'Docker',           level: 'intermediate' },
          { name: 'Vercel / Railway', level: 'advanced'     },
          { name: 'Linux / Bash',     level: 'intermediate' },
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
        emoji: '�',
        demo: 'https://www.pharmwuclerkship.com/',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 2,
        title: 'Farm-D Project',
        desc: 'A system for developing digital tools for agricultural personnel. Enables farmers to log crop data, receive line notifications, and manage farm operations online.',
        tags: ['Next.js', 'MongoDB', 'Line OA'],
        category: 'web',
        emoji: '🌾',
        demo: 'https://farmd.vercel.app/',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 3,
        title: 'TCNAP – Thailand Community Network Assessment',
        desc: 'Thailand Community Network Assessment Project — a data collection and reporting platform for community health network assessments across Thailand.',
        tags: ['Next.js', 'PostgreSQL'],
        category: 'web',
        emoji: '🏥',
        demo: '#',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 4,
        title: 'Wanderwoods POS',
        desc: 'Point of Sale (POS) system designed for a large restaurant. Features table management, real-time order tracking, kitchen display, and end-of-day sales reports.',
        tags: ['React', 'Node.js', 'PostgreSQL'],
        category: 'web',
        emoji: '🍽️',
        demo: '#',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 5,
        title: 'Stock Management (QR)',
        desc: 'A stock management system utilising QR code scanning for real-time verification and monitoring of inventory across multiple locations.',
        tags: ['Next.js', 'PostgreSQL', 'QR Code'],
        category: 'web',
        emoji: '📦',
        demo: '#',
        repo: 'https://github.com/kimookpong/stocklazer',
      },
      {
        id: 6,
        title: 'Udon City Tourism',
        desc: 'A tourism platform showcasing attractions, accommodations, and local services in Udon City. Includes a map interface and attraction ratings.',
        tags: ['Next.js', 'MongoDB'],
        category: 'web',
        emoji: '🗺️',
        demo: '#',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 7,
        title: 'Pharmacy WU Alumni',
        desc: 'A platform for managing pharmacy alumni relations at Walailak University. Tracks graduate careers, events, and alumni networking.',
        tags: ['Next.js', 'PostgreSQL'],
        category: 'web',
        emoji: '🎓',
        demo: '#',
        repo: 'https://github.com/thasala-dev/alumni',
      },
      {
        id: 8,
        title: 'Gov Asset Information System',
        desc: 'A platform for managing government asset information and documentation — tracking procurement, depreciation, and physical location of assets.',
        tags: ['React', 'PostgreSQL'],
        category: 'web',
        emoji: '🏛️',
        demo: '#',
        repo: 'https://github.com/kimookpong',
      },
      {
        id: 9,
        title: 'HRMS – Walailak University',
        desc: 'Human Resource Management System for Walailak University. Handles employee records, leave requests, payroll data, and org-chart management.',
        tags: ['Next.js', 'PostgreSQL'],
        category: 'collaboration',
        emoji: '👥',
        demo: '#',
        repo: 'https://github.com/thasala-dev/wu-coop',
      },
      {
        id: 10,
        title: 'AB Game (Multi)',
        desc: 'A multiplayer version of the classic AB guessing game where players try to guess a 4-digit number with unique digits. Built with real-time WebSocket sync.',
        tags: ['TypeScript', 'Socket.io'],
        category: 'hobby',
        emoji: '🎮',
        demo: '#',
        repo: 'https://github.com/kimookpong/ab-game-multi',
      },
      {
        id: 11,
        title: 'StockLazer',
        desc: 'Real-time stock management system that utilises QR code scanning for efficient inventory tracking. Supports multi-warehouse and live dashboard.',
        tags: ['TypeScript', 'Next.js', 'QR Code'],
        category: 'hobby',
        emoji: '🔦',
        demo: '#',
        repo: 'https://github.com/kimookpong/stocklazer',
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

    // render cards
    grid.innerHTML = projects.map(p => `
      <div class="project-card" data-id="${p.id}" data-category="${p.category}" role="button" tabindex="0">
        <div class="project-thumb-fallback">${p.emoji || '💻'}</div>
        <div class="project-body">
          <div class="project-tags">
            ${(p.tags || []).slice(0, 3).map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
          <div class="project-arrow">View Details <span>→</span></div>
        </div>
      </div>
    `).join('');

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
    if (p.image) {
      imgEl.src = p.image;
      imgEl.style.display = '';
    } else {
      imgEl.style.display = 'none';
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
  }

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ── Contact form ─────────────────────────────────────────────── */
  const form       = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmit = document.getElementById('formSubmit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    formSubmit.disabled = true;
    formSubmit.textContent = 'Sending…';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      if (API_BASE) {
        const res = await fetch(API_BASE + '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('server');
      } else {
        // Static mode: simulate success
        await new Promise(r => setTimeout(r, 800));
      }
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      formStatus.className = 'form-status ok';
      form.reset();
    } catch {
      formStatus.textContent = '✗ Something went wrong. Please email me directly.';
      formStatus.className = 'form-status err';
    } finally {
      formSubmit.disabled = false;
      formSubmit.textContent = 'Send Message';
    }
  });

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

    // reveal about section
    $$('#about h2, #about p, #about .btn-outline, .about-stats').forEach((el, i) => addReveal(el, i * 80));
    $$('#skills .section-label, #skills .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#projects .section-label, #projects .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#experience .section-label, #experience .section-title').forEach((el, i) => addReveal(el, i * 60));
    $$('#contact .contact-heading, #contact .contact-sub, #contact .contact-form, #contact .social-links').forEach((el, i) => addReveal(el, i * 80));
  }

  init();

})();
