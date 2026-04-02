# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on port 4200 (with proxy to localhost:3001)
npm run start:api  # Vercel serverless dev on port 3001 (required for /api/* routes)
npm run build      # Production build → dist/galery-web-front/browser/
npm run watch      # Dev build with watch mode
npm test           # Run unit tests via Karma
```

For local development, run both `npm start` and `npm run start:api` in separate terminals so Angular can proxy `/api/*` calls to the serverless functions.

## Architecture

**Stack**: Angular 17 (standalone components) + Tailwind CSS + Vercel serverless + Cloudinary

### Frontend (`src/app/`)

- **Feature-based lazy loading**: Each domain area lives under `features/[domain]/` and is loaded via `loadComponent()` in `app.routes.ts`. No NgModules.
- **Core services** (`core/services/`): Shared business logic — Cloudinary image fetching, news caching, gallery management.
- **Core models** (`core/models/`): TypeScript interfaces (`CloudinaryImage`, `GalleryFolder`, etc.)
- **Shared components** (`shared/components/`): Reusable UI pieces.

Feature domains:
- `empresa/` — Corporate governance, management, about
- `inversores/` — Stock, presentations, financials, dividends
- `operaciones/` — Mine operations (Ponce Enríquez), geology, history
- `mineria-responsable/` — Sustainability, environment, community
- `carreras/` — Jobs, benefits, FAQ
- `noticias/` — News (with 24h localStorage caching)
- `gallery/` — Dynamic Cloudinary image gallery
- `home/`, `contact/`

### Backend (`api/`)

Vercel serverless functions (Node.js):
- `api/images.ts` — Queries Cloudinary Admin API by folder, returns image metadata
- `api/api-news.ts` — Mining sector news endpoint

Dev proxy (`proxy.conf.json`): `/api` → `localhost:3001`, `/metalprice` → external metal price API.

### Key config files

| File | Purpose |
|------|---------|
| `vercel.json` | SPA fallback rewrites + CORS headers for API |
| `proxy.conf.json` | Dev proxy configuration |
| `tailwind.config.js` | Tailwind CSS setup |
| `.env.local` | Cloudinary API keys (never commit to production) |
| `angular.json` | Build budgets: 500kb initial warning, 1mb error |

### Cloudinary integration

Images are stored in Cloudinary and fetched server-side via `api/images.ts` using the Cloudinary Admin API (credentials in env vars). The Angular frontend uses `@cloudinary/ng` and `@cloudinary/url-gen` for rendering. Cloudinary credentials must be in `.env.local` for local dev.

### Deployment

Deployed to Vercel. Push to trigger build. Environment variables (Cloudinary keys, etc.) are managed in the Vercel dashboard for Preview/Production environments.
