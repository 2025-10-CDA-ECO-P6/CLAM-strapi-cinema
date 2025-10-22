# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cineverse** is a full-stack cinema application with:
- **Backend**: Strapi 5.27.0 headless CMS (Node.js, SQLite)
- **Frontend**: Express.js server with static HTML/CSS/JS (Alpine.js, Materialize CSS)
- **External API**: TMDb (The Movie Database) integration for movie data

This is a monorepo with separate `backend/` and `frontend/` directories, each with independent dependencies.

## Development Commands

### Backend (Strapi)
```bash
cd backend
npm run develop      # Start with auto-reload (dev mode)
npm run build        # Build admin panel for production
npm run start        # Start without auto-reload (production)
npm run import:tmdb  # Manual TMDb data import
npm run lint         # Run ESLint
```

**Node.js Requirements**: Node.js >=18.0.0 <=22.x.x, npm >=6.0.0

### Frontend
```bash
cd frontend
npm start           # Start Express server on port 3001
```

### Access Points
- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:1337/api`
- Admin Panel: `http://localhost:1337/admin`

## Architecture

### Backend Structure
Strapi follows a factory pattern for all API collections:

```
backend/src/api/{collection}/
├── controllers/{collection}.js  # Uses createCoreController()
├── services/{collection}.js     # Uses createCoreService()
├── routes/{collection}.js       # Uses createCoreRouter()
└── content-types/{collection}/schema.json
```

**Collections**: `movie`, `actor`, `director`, `genre`, `favorite`

### Content Type Relations
- **Movie**: Many-to-many with Actor, Director, Genre; many-to-one with Favorite
- All entities (except favorite) have `db_id` field (biginteger, unique) storing TMDb external ID
- All relations are bidirectional (e.g., movies ↔ actors)

### API Patterns
- REST endpoints: `/api/movies`, `/api/actors`, `/api/directors`, `/api/genres`
- Use `?populate=*` to include all relations in response
- Pagination: default 25, max 100 (configured in `config/api.js`)
- Standard Strapi response format: `{ data: [...], meta: {...} }`

### Frontend Architecture
- Alpine.js for reactive components (loaded from CDN)
- Axios API client with JWT interceptor ([frontend/src/js/api.js](frontend/src/js/api.js))
- JWT stored in localStorage, automatically attached to requests
- No build step - static files served directly from Express
- HTML pages in `frontend/src/`, JavaScript modules in `frontend/src/js/`
- Pages: index (homepage), movies, actors, directors, details, movie-details, search-results

### TMDb Integration
**Import Script**: [backend/scripts/import.js](backend/scripts/import.js)
- Fetches 1 page of popular movies by default (configurable via `PAGES_TO_FETCH` on line 53)
- Rate limiting: 550ms delay between requests (TMDb API requirement)
- Checks for duplicates using `db_id` before creating records
- Import order: genres → actors/directors → movies
- Scheduled daily at 17:30 Europe/Paris (configured in [backend/config/cronjob.js](backend/config/cronjob.js))
- Language: French (`fr-FR` for content, `fr` for genres)
- Maximum: 500 pages (TMDb API limit)

## Environment Configuration

Required environment variables in `backend/.env`:
```bash
TMDB_API_KEY=your_api_key_here  # Required for TMDb API
HOST=0.0.0.0
PORT=1337
APP_KEYS="key1,key2"
API_TOKEN_SALT=secret
ADMIN_JWT_SECRET=secret
JWT_SECRET=secret
ENCRYPTION_KEY=secret
DATABASE_FILENAME=.tmp/data.db
```

Use `backend/.env.example` as template.

## Database

**Default**: SQLite at `backend/.tmp/data.db`
- File-based, zero configuration
- Persistent across restarts

**Switching Database**: Edit [backend/config/database.js](backend/config/database.js)
- Supports SQLite (default), MySQL, PostgreSQL
- Set `DATABASE_CLIENT` environment variable to `mysql` or `postgres`
- Configure connection details in `.env` (host, port, username, password, database name)
- MySQL/PostgreSQL require connection pooling (min: 2, max: 10 by default)

## Key Files and Conventions

### Backend Configuration
- [backend/config/server.js](backend/config/server.js) - Server settings and cron jobs
- [backend/config/database.js](backend/config/database.js) - Database connections
- [backend/config/api.js](backend/config/api.js) - REST API settings (pagination)
- [backend/config/cronjob.js](backend/config/cronjob.js) - Scheduled tasks

### Frontend Key Files
- [frontend/src/js/api.js](frontend/src/js/api.js) - Axios instance with JWT interceptor
- [frontend/src/js/authentication.js](frontend/src/js/authentication.js) - Auth functions (login, register, logout)
- [frontend/src/js/index.js](frontend/src/js/index.js) - Alpine.js data components for homepage
- [frontend/server.js](frontend/server.js) - Express static file server (port 3001)
- [frontend/styles.css](frontend/styles.css) - Global styles (Materialize CSS framework)

### Naming Conventions
- Collections: singular (movie, actor, director)
- API paths: plural RESTful (`/api/movies`)
- External IDs: stored in `db_id` field
- Alpine.js components: lowercase names

## Authentication

JWT-based authentication via Strapi Users & Permissions plugin:
- `POST /api/auth/local/register` - Register new user
- `POST /api/auth/local` - Login (returns JWT)
- `GET /api/users/me` - Get current user
- JWT automatically attached to requests via interceptor

## Strapi Admin Panel

Access at `http://localhost:1337/admin`
- First run requires creating admin account
- Use Content Manager to manually add/edit movies, actors, directors, genres
- Content-Type Builder allows schema modifications (reflects to code)
- Users & Permissions plugin manages roles and API access
- Settings → Roles → Public controls unauthenticated API access

## Important Notes

### Modifying Content Types
When changing Strapi schema files:
1. Edit schema in `backend/src/api/{collection}/content-types/{collection}/schema.json`
2. Restart Strapi to apply changes
3. Check admin panel to verify schema updates

### Adding New API Endpoints
Strapi uses factories for basic CRUD. To customize:
```javascript
// In controllers/{collection}.js
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::movie.movie', ({ strapi }) => ({
  async customEndpoint(ctx) {
    // Custom logic here
  }
}));
```

### TMDb Import Modifications
To change import scope, edit `PAGES_TO_FETCH` in [backend/scripts/import.js](backend/scripts/import.js):53
- Default: 1 page (~20 movies)
- Maximum: 500 pages (TMDb API limit)
- Must respect 550ms delay to avoid rate limiting

### Frontend API URL
Hardcoded in [frontend/src/js/api.js](frontend/src/js/api.js):4 as `http://localhost:1337/api`
- Change if deploying or using different backend URL

## Git Workflow

- Main branch: `main`
- Project uses feature branches (pattern: `feature/{ticket}_description`)
- Example: `feature/us-17_authentication`, `feature/us-17_frontend`

## Code Quality

### Backend Linting
- ESLint configured via `eslint.config.mjs`
- Rules: 2-space indentation, Unix line breaks, semicolons required
- Unused vars allowed if prefixed with underscore
- Run with: `npm run lint` (from backend directory)

## Known Gaps

- No testing framework configured (Jest/Mocha recommended)
- No Prettier setup for code formatting
- GitHub Actions CI/CD mentioned in README but not implemented
- Frontend has no linting configured
