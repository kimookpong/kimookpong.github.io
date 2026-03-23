/* ================================================================
   server.js – Express API for portfolio
   ================================================================ */
'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const pool       = require('./db/db');

const app  = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

/* ── Security ──────────────────────────────────────────────────── */
app.use(helmet());
app.use(express.json({ limit: '16kb' }));

/* ── CORS ──────────────────────────────────────────────────────── */
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST'],
  optionsSuccessStatus: 200,
}));

/* ── Rate limiting ─────────────────────────────────────────────── */
const limiter = rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true, legacyHeaders: false });
app.use('/api', limiter);

const contactLimiter = rateLimit({ windowMs: 60_000 * 10, max: 5, message: { error: 'Too many messages. Try later.' } });

/* ──────────────────────────────────────────────────────────────────
   ROUTES
   ────────────────────────────────────────────────────────────────── */

/* GET /api/profile ─────────────────────────────────────────────── */
app.get('/api/profile', async (_req, res, next) => {
  try {
    const { rows: [profile] } = await pool.query(
      'SELECT id, name, bio, avatar_url, resume_url FROM profile LIMIT 1'
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const { rows: stats } = await pool.query(
      'SELECT num, label FROM profile_stats WHERE profile_id=$1 ORDER BY sort_order',
      [profile.id]
    );

    res.json({ ...profile, stats });
  } catch (err) { next(err); }
});

/* GET /api/skills ──────────────────────────────────────────────── */
app.get('/api/skills', async (_req, res, next) => {
  try {
    const { rows: cats } = await pool.query(
      'SELECT id, category, icon FROM skill_categories ORDER BY sort_order'
    );
    const { rows: items } = await pool.query(
      'SELECT category_id, name, level FROM skills ORDER BY sort_order'
    );

    const skills = cats.map(c => ({
      category: c.category,
      icon:     c.icon,
      items:    items.filter(i => i.category_id === c.id).map(i => ({ name: i.name, level: i.level })),
    }));

    res.json(skills);
  } catch (err) { next(err); }
});

/* GET /api/projects ─────────────────────────────────────────────── */
app.get('/api/projects', async (req, res, next) => {
  try {
    const cat = req.query.category;
    let qText = 'SELECT id, title, description AS desc, emoji, image_url AS image, demo_url AS demo, repo_url AS repo, category FROM projects';
    const params = [];
    if (cat && cat !== 'all') {
      qText += ' WHERE category = $1';
      params.push(cat);
    }
    qText += ' ORDER BY sort_order';

    const { rows: projects } = await pool.query(qText, params);
    const { rows: tagRows }  = await pool.query('SELECT project_id, tag FROM project_tags');

    const result = projects.map(p => ({
      ...p,
      tags: tagRows.filter(t => t.project_id === p.id).map(t => t.tag),
    }));

    res.json(result);
  } catch (err) { next(err); }
});

/* GET /api/experience ───────────────────────────────────────────── */
app.get('/api/experience', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT date_range AS date, role, company, type, description AS desc
       FROM experience ORDER BY sort_order`
    );
    res.json(rows);
  } catch (err) { next(err); }
});

/* POST /api/contact ─────────────────────────────────────────────── */
app.post('/api/contact', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    await pool.query(
      'INSERT INTO contact_messages (name, email, message, ip) VALUES ($1,$2,$3,$4)',
      [name.trim(), email.trim(), message.trim(), ip]
    );

    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
});

/* ── Health check ──────────────────────────────────────────────── */
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', ts: new Date().toISOString() });
  } catch {
    res.status(500).json({ status: 'db_error' });
  }
});

/* ── Error handler ─────────────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

/* ── Start ─────────────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`🚀  Portfolio API running at http://localhost:${PORT}`);
});
