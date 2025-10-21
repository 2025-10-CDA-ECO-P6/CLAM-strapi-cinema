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
```

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

**Collections**: `movie`, `actor`, `director`, `genre`

### Content Type Relations
- **Movie**: Many-to-many with Actor, Director, Genre
- All entities have `db_id` field (biginteger, unique) storing TMDb external ID
- All relations are bidirectional (e.g., movies ↔ actors)

### API Patterns
- REST endpoints: `/api/movies`, `/api/actors`, `/api/directors`, `/api/genres`
- Use `?populate=*` to include all relations in response
- Pagination: default 25, max 100 (configured in `config/api.js`)
- Standard Strapi response format: `{ data: [...], meta: {...} }`

### Frontend Architecture
- Alpine.js for reactive components (loaded from CDN)
- Axios API client with JWT interceptor ([frontend/src/api.js](frontend/src/api.js))
- JWT stored in localStorage, automatically attached to requests
- No build step - static files served directly

### TMDb Integration
**Import Script**: [backend/scripts/import.js](backend/scripts/import.js)
- Fetches 5 pages of popular movies by default (configurable via `PAGES_TO_FETCH`)
- Rate limiting: 550ms delay between requests
- Checks for duplicates using `db_id` before creating records
- Import order: genres → actors/directors → movies
- Scheduled daily at 17:30 Europe/Paris (configured in [backend/config/cronjob.js](backend/config/cronjob.js))
- Language: French (`fr-FR` for content, `fr` for genres)

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
- Can be switched to MySQL/PostgreSQL via `backend/config/database.js`

## Key Files and Conventions

### Backend Configuration
- [backend/config/server.js](backend/config/server.js) - Server settings and cron jobs
- [backend/config/database.js](backend/config/database.js) - Database connections
- [backend/config/api.js](backend/config/api.js) - REST API settings (pagination)
- [backend/config/cronjob.js](backend/config/cronjob.js) - Scheduled tasks

### Frontend Key Files
- [frontend/src/api.js](frontend/src/api.js) - Axios instance with JWT interceptor
- [frontend/src/authentication.js](frontend/src/authentication.js) - Auth functions (login, register, logout)
- [frontend/src/index.js](frontend/src/index.js) - Alpine.js data components
- [frontend/server.js](frontend/server.js) - Express static file server

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
- Maximum: 500 pages (TMDb API limit)
- Respect 550ms delay to avoid rate limiting

### Frontend API URL
Hardcoded in [frontend/src/api.js](frontend/src/api.js):4 as `http://localhost:1337/api`
- Change if deploying or using different backend URL

## Git Workflow

- Main branch: `main`
- Current development: `feature/us-17_frontend`
- Project uses feature branches (pattern: `feature/{ticket}_description`)

## Known Gaps

- No testing framework configured (Jest/Mocha recommended)
- No ESLint/Prettier setup
- GitHub Actions CI/CD mentioned in README but not implemented
- Frontend pages partially complete (homepage done, other pages in progress)
