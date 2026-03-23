/* ================================================================
   migrate.js – Creates all tables if they don't exist
   Run: npm run db:migrate
   ================================================================ */
'use strict';
const pool = require('./db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(120) NOT NULL,
        bio         TEXT         NOT NULL,
        avatar_url  TEXT,
        resume_url  TEXT,
        updated_at  TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS profile_stats (
        id         SERIAL PRIMARY KEY,
        profile_id INTEGER REFERENCES profile(id) ON DELETE CASCADE,
        num        VARCHAR(20) NOT NULL,
        label      VARCHAR(80) NOT NULL,
        sort_order INTEGER DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS skill_categories (
        id         SERIAL PRIMARY KEY,
        category   VARCHAR(80)  NOT NULL,
        icon       VARCHAR(10)  NOT NULL DEFAULT '🔧',
        sort_order INTEGER      DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id          SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
        name        VARCHAR(80) NOT NULL,
        level       VARCHAR(20) NOT NULL DEFAULT 'intermediate'
                    CHECK (level IN ('basic','intermediate','advanced')),
        sort_order  INTEGER     DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id          SERIAL  PRIMARY KEY,
        title       VARCHAR(160) NOT NULL,
        description TEXT         NOT NULL,
        emoji       VARCHAR(10)  DEFAULT '💻',
        image_url   TEXT,
        demo_url    TEXT,
        repo_url    TEXT,
        category    VARCHAR(60)  NOT NULL DEFAULT 'fullstack',
        featured    BOOLEAN      DEFAULT FALSE,
        sort_order  INTEGER      DEFAULT 0,
        created_at  TIMESTAMPTZ  DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS project_tags (
        id         SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        tag        VARCHAR(60) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id          SERIAL PRIMARY KEY,
        date_range  VARCHAR(40)  NOT NULL,
        role        VARCHAR(120) NOT NULL,
        company     VARCHAR(120) NOT NULL,
        type        VARCHAR(40)  DEFAULT 'Full-time',
        description TEXT,
        sort_order  INTEGER      DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(120) NOT NULL,
        email      VARCHAR(200) NOT NULL,
        message    TEXT         NOT NULL,
        ip         VARCHAR(60),
        created_at TIMESTAMPTZ  DEFAULT NOW(),
        read       BOOLEAN      DEFAULT FALSE
      );
    `);

    await client.query('COMMIT');
    console.log('✅  Migration complete');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
