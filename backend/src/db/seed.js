/* ================================================================
   seed.js – Inserts sample portfolio data
   Run: npm run db:seed  (runs migrate first, then seeds)
   ================================================================ */
'use strict';
const pool = require('./db');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    /* ── Truncate existing data ──────────────────────────────── */
    await client.query(`
      TRUNCATE contact_messages, project_tags, projects,
               skills, skill_categories, profile_stats,
               profile RESTART IDENTITY CASCADE;
    `);

    /* ── Profile ─────────────────────────────────────────────── */
    const { rows: [prof] } = await client.query(`
      INSERT INTO profile (name, bio, avatar_url, resume_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `, [
      'Hakim Mudor',
      "Freelance Developer based in Nakhon Si Thammarat, Thailand 🇹🇭. I have experience as a System Analyst at Walailak University since 2020, and take on freelance projects nationwide. Born in Narathiwat (1989), B.Eng. Computer Engineering from Prince of Songkla University (2012). I live by one rule: Don't Repeat Yourself.",
      '/assets/img/avatar.jpg',
      '/assets/resume.pdf',
    ]);

    await client.query(`
      INSERT INTO profile_stats (profile_id, num, label, sort_order) VALUES
      ($1, '5+',   'Years at WU',        1),
      ($1, '10+',  'Projects Delivered', 2),
      ($1, '2012', 'B.Eng. PSU',         3);
    `, [prof.id]);

    /* ── Skills ──────────────────────────────────────────────── */
    const skillData = [
      { category: 'Frontend', icon: '🎨', order: 1, items: [
          { name: 'Next.js',          level: 'advanced'     },
          { name: 'TypeScript',       level: 'advanced'     },
          { name: 'Tailwind CSS',     level: 'advanced'     },
          { name: 'Bootstrap',        level: 'advanced'     },
          { name: 'React Native',     level: 'advanced'     },
          { name: 'Line OA / LIFF',   level: 'intermediate' },
      ]},
      { category: 'Backend', icon: '⚙️', order: 2, items: [
          { name: 'Node.js / Express', level: 'advanced'     },
          { name: 'Yii2',              level: 'advanced'     },
          { name: 'CodeIgniter',       level: 'advanced'     },
          { name: 'PHP / Laravel',     level: 'intermediate' },
          { name: 'Python',            level: 'intermediate' },
          { name: 'Go',                level: 'basic'        },
          { name: 'REST API',          level: 'advanced'     },
      ]},
      { category: 'Database', icon: '🗄️', order: 3, items: [
          { name: 'PostgreSQL', level: 'advanced'     },
          { name: 'MongoDB',    level: 'advanced'     },
          { name: 'MySQL',      level: 'advanced'     },
          { name: 'Oracle',     level: 'intermediate' },
          { name: 'Redis',      level: 'basic'        },
      ]},
      { category: 'Infrastructure', icon: '🚀', order: 4, items: [
          { name: 'Git / GitHub',     level: 'advanced'     },
          { name: 'Docker',           level: 'intermediate' },
          { name: 'Ubuntu Server',    level: 'intermediate' },
          { name: 'Nginx',            level: 'basic'        },
          { name: 'Apache',           level: 'basic'        },
          { name: 'Vercel / Railway', level: 'advanced'     },
      ]},
    ];

    for (const cat of skillData) {
      const { rows: [c] } = await client.query(`
        INSERT INTO skill_categories (category, icon, sort_order)
        VALUES ($1, $2, $3) RETURNING id;
      `, [cat.category, cat.icon, cat.order]);

      for (let i = 0; i < cat.items.length; i++) {
        await client.query(`
          INSERT INTO skills (category_id, name, level, sort_order)
          VALUES ($1, $2, $3, $4);
        `, [c.id, cat.items[i].name, cat.items[i].level, i + 1]);
      }
    }

    /* ── Projects ────────────────────────────────────────────── */
    const projects = [
      {
        title: 'Pharmacy WU Clerkship',
        desc: 'A platform for managing pharmacy clerkship programs at Walailak University. Handles scheduling, student progress tracking, and supervisor evaluations.',
        emoji: '�', category: 'web', featured: true, order: 1,
        demo: 'https://www.pharmwuclerkship.com/', repo: 'https://github.com/kimookpong',
        tags: ['React', 'PostgreSQL'],
      },
      {
        title: 'Farm-D Project',
        desc: 'A system for developing digital tools for agricultural personnel. Enables farmers to log crop data, receive line notifications, and manage farm operations online.',
        emoji: '🌾', category: 'web', featured: true, order: 2,
        demo: 'https://farmd.vercel.app/', repo: 'https://github.com/kimookpong',
        tags: ['Next.js', 'MongoDB', 'Line OA'],
      },
      {
        title: 'TCNAP – Thailand Community Network Assessment',
        desc: 'Thailand Community Network Assessment Project — a data collection and reporting platform for community health network assessments across Thailand.',
        emoji: '🏥', category: 'web', featured: true, order: 3,
        demo: '#', repo: 'https://github.com/kimookpong',
        tags: ['Next.js', 'PostgreSQL'],
      },
      {
        title: 'Wanderwoods POS',
        desc: 'Point of Sale (POS) system designed for a large restaurant. Features table management, real-time order tracking, kitchen display, and end-of-day sales reports.',
        emoji: '🍽️', category: 'web', featured: true, order: 4,
        demo: '#', repo: 'https://github.com/kimookpong',
        tags: ['React', 'Node.js', 'PostgreSQL'],
      },
      {
        title: 'Stock Management (QR)',
        desc: 'A stock management system utilising QR code scanning for real-time verification and monitoring of inventory across multiple locations.',
        emoji: '�', category: 'web', featured: false, order: 5,
        demo: '#', repo: 'https://github.com/kimookpong/stocklazer',
        tags: ['Next.js', 'PostgreSQL', 'QR Code'],
      },
      {
        title: 'Udon City Tourism',
        desc: 'A tourism platform showcasing attractions, accommodations, and local services in Udon City. Includes a map interface and attraction ratings.',
        emoji: '🗺️', category: 'web', featured: false, order: 6,
        demo: '#', repo: 'https://github.com/kimookpong',
        tags: ['Next.js', 'MongoDB'],
      },
      {
        title: 'Pharmacy WU Alumni',
        desc: 'A platform for managing pharmacy alumni relations at Walailak University. Tracks graduate careers, events, and alumni networking.',
        emoji: '🎓', category: 'web', featured: false, order: 7,
        demo: '#', repo: 'https://github.com/thasala-dev/alumni',
        tags: ['Next.js', 'PostgreSQL'],
      },
      {
        title: 'Gov Asset Information System',
        desc: 'A platform for managing government asset information and documentation — tracking procurement, depreciation, and physical location of assets.',
        emoji: '🏛️', category: 'web', featured: false, order: 8,
        demo: '#', repo: 'https://github.com/kimookpong',
        tags: ['React', 'PostgreSQL'],
      },
      {
        title: 'HRMS – Walailak University',
        desc: 'Human Resource Management System for Walailak University. Handles employee records, leave requests, payroll data, and org-chart management.',
        emoji: '👥', category: 'collaboration', featured: false, order: 9,
        demo: '#', repo: 'https://github.com/thasala-dev/wu-coop',
        tags: ['Next.js', 'PostgreSQL'],
      },
      {
        title: 'AB Game (Multi)',
        desc: 'A multiplayer version of the classic AB guessing game where players try to guess a 4-digit number with unique digits. Built with real-time WebSocket sync.',
        emoji: '🎮', category: 'hobby', featured: false, order: 10,
        demo: '#', repo: 'https://github.com/kimookpong/ab-game-multi',
        tags: ['TypeScript', 'Socket.io'],
      },
      {
        title: 'StockLazer',
        desc: 'Real-time stock management system that utilises QR code scanning for efficient inventory tracking. Supports multi-warehouse and live dashboard.',
        emoji: '🔦', category: 'hobby', featured: false, order: 11,
        demo: '#', repo: 'https://github.com/kimookpong/stocklazer',
        tags: ['TypeScript', 'Next.js', 'QR Code'],
      },
    ];

    for (const p of projects) {
      const { rows: [proj] } = await client.query(`
        INSERT INTO projects (title, description, emoji, demo_url, repo_url, category, featured, sort_order)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id;
      `, [p.title, p.desc, p.emoji, p.demo, p.repo, p.category, p.featured, p.order]);

      for (const tag of p.tags) {
        await client.query('INSERT INTO project_tags (project_id, tag) VALUES ($1,$2)', [proj.id, tag]);
      }
    }

    /* ── Experience ──────────────────────────────────────────── */
    const exp = [
      {
        date: '2020 – Present', role: 'System Analyst',
        company: 'Walailak University, Nakhon Si Thammarat', type: 'Full-time', order: 1,
        desc: 'Design and develop internal web systems for the university — including HRMS, alumni portals, clerkship management platforms, and asset tracking tools. Primary stack: Next.js, React, PostgreSQL, Node.js.',
      },
      {
        date: '2020 – Present', role: 'Freelance Developer',
        company: 'Self-employed, Thailand', type: 'Freelance', order: 2,
        desc: 'Building full-stack web applications for clients across Thailand: POS systems, tourism platforms, farming tools, and government asset management. Specialise in Next.js, MongoDB, PostgreSQL, and Line OA integrations.',
      },
      {
        date: '2012 – 2020', role: 'Software / Web Developer',
        company: 'Various Companies, Thailand', type: 'Full-time', order: 3,
        desc: 'Over 8 years of hands-on experience building web applications ranging from PHP/Laravel backends to modern React frontends, working with SQL and NoSQL databases.',
      },
      {
        date: '2008 – 2012', role: 'B.Eng. Computer Engineering',
        company: 'Prince of Songkla University (PSU)', type: 'Education', order: 4,
        desc: 'Bachelor degree in Computer Engineering. Graduated 2012. Foundation in algorithms, systems design, networking, and software engineering.',
      },
    ];

    for (const e of exp) {
      await client.query(`
        INSERT INTO experience (date_range, role, company, type, description, sort_order)
        VALUES ($1,$2,$3,$4,$5,$6);
      `, [e.date, e.role, e.company, e.type, e.desc, e.order]);
    }

    await client.query('COMMIT');
    console.log('✅  Seed complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
