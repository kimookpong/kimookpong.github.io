# Portfolio – kimookpong.github.io

Modern personal portfolio with:
- **Three.js** WebGL particle background + rotating torus knot, ring, and icosahedron
- **Parallax** scrolling (CSS + JS)
- **Reveal on scroll** animations (IntersectionObserver)
- **Typing animation** for roles
- Mobile-first responsive design
- **Node.js + Express** REST API
- **PostgreSQL** database (schema + seed data included)

---

## Project Structure

```
kimookpong.github.io/
├── index.html
├── assets/
│   ├── css/style.css          # All styles
│   ├── js/
│   │   ├── three-bg.js        # Three.js background animation
│   │   └── main.js            # Portfolio logic (data, parallax, modal…)
│   └── img/avatar.jpg         # Your photo (add this file!)
└── backend/
    ├── package.json
    ├── .env.example            # Copy to .env and fill in your DB creds
    └── src/
        ├── server.js           # Express app
        └── db/
            ├── db.js           # pg Pool singleton
            ├── schema.sql      # Raw SQL schema
            ├── migrate.js      # node src/db/migrate.js
            └── seed.js         # node src/db/seed.js
```

---

## Quick Start

### 1 – Static (GitHub Pages, no backend needed)

Just push to GitHub. `main.js` falls back to inline data automatically
when `API_BASE` is empty.

```bash
git add .
git commit -m "feat: modern portfolio"
git push origin main
```

### 2 – With PostgreSQL backend

#### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14

#### Setup

```bash
# 1. Create a Postgres database
createdb portfolio

# 2. Configure environment
cd backend
cp .env.example .env
# Edit .env – set DB_PASSWORD, CORS_ORIGIN, etc.

# 3. Install dependencies
npm install

# 4. Run migrations + seed
npm run db:migrate
npm run db:seed

# 5. Start the API server
npm run dev          # dev (nodemon)
npm start            # production
```

The API will be available at `http://localhost:3000`.

#### 6. Point the frontend to the API

In `assets/js/main.js`, change:

```js
const API_BASE = '';   // ← change to 'http://localhost:3000'
```

---

## API Endpoints

| Method | Path              | Description                         |
|--------|-------------------|-------------------------------------|
| GET    | /api/health       | Health check (DB ping)              |
| GET    | /api/profile      | Bio, name, stats                    |
| GET    | /api/skills       | Skill categories + bar percentages  |
| GET    | /api/projects     | Projects list (optional ?category=) |
| GET    | /api/experience   | Career timeline                     |
| POST   | /api/contact      | Save contact form message           |

---

## Customisation Checklist

- [ ] Replace `assets/img/avatar.jpg` with your photo
- [ ] Update `assets/resume.pdf`
- [ ] Edit `FALLBACK` data inside `assets/js/main.js` (used for static hosting)
- [ ] Update seed data in `backend/src/db/seed.js`
- [ ] Update social links in `index.html` (`#contact` section)
- [ ] Set `API_BASE` in `assets/js/main.js` when backend is live

---

## Tech Stack

| Layer     | Tech                                    |
|-----------|-----------------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JS, Three.js r134  |
| Animation | Three.js WebGL, CSS keyframes, IntersectionObserver |
| Backend   | Node.js 18+, Express 4                 |
| Database  | PostgreSQL 14+, node-postgres (pg)      |
| Security  | Helmet, CORS, express-rate-limit        |
