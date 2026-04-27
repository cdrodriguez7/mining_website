# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on port 4200 (with proxy to localhost:3001)
npm run start:api  # Vercel serverless dev on port 3001 (required for /api/* routes)
npm run build      # Production build → dist/galery-web-front/browser/
npm run watch      # Dev build with watch mode
npm test           # Run unit tests via Karma (all specs)
ng test --include='src/app/path/to/component.spec.ts'  # Run a single spec file
```

For local development, run both `npm start` and `npm run start:api` in separate terminals so Angular can proxy `/api/*` calls to the serverless functions.

## Architecture

**Stack**: Angular 17 (standalone components) + Tailwind CSS + Vercel serverless + Cloudinary

### Frontend (`src/app/`)

All components are standalone (`standalone: true`) — no NgModules anywhere. Routes use `loadComponent()` for lazy loading in `app.routes.ts`. Providers are registered in `app.config.ts` via `provideRouter()` and `provideHttpClient()`.

**Feature domains** under `features/`:
- `empresa/` — Corporate governance, management, about
- `inversores/` — Stock prices, presentations, financials, dividends
- `operaciones/` — Mine operations (FDN/Ponce Enríquez), geology, projections
- `mineria-responsable/` — Sustainability, environment, community, climate
- `carreras/` — Jobs, benefits, FAQ, fraud alerts
- `noticias/` — News feed with lazy-loaded yearly routes (`/noticias/:ano`)
- `gallery/` — Dynamic Cloudinary image gallery with upload
- `home/`, `contact/`

**Core services** (`core/services/`):

| Service | Responsibility |
|---------|---------------|
| `api.service.ts` | Generic HTTP wrapper (`get`/`post`) using `environment.baseUrl`; used by components that don't call Cloudinary or metals |
| `gallery.service.ts` | Fetches and caches images per section via sessionStorage |
| `cloudinary.services.ts` | URL generation (hero 16:9, card 4:3, thumbnail 1:1) + upload |
| `cloudinary-backend.service.ts` | Calls `/api/images` endpoint with cache-busting |
| `image-selector.service.ts` | Filters `CloudinaryImage[]` by aspect ratio (`landscape/portrait/square/ultrawide/any`), min dimensions, folder, or tags; returns random matching image |
| `news.service.ts` | RSS news with 7-day localStorage cache + stale fallback |
| `metal.service.ts` | Gold/silver/copper prices with 24h localStorage cache + hardcoded fallback |
| `metal-history.service.ts` | Records daily metal prices (up to 30 days) in localStorage for Chart.js sparklines |
| `contact.service.ts` | Posts contact form data to `/api/contact` (Google Sheets backend) |

**Caching keys** (important for cache invalidation):
- Gallery: `planpromin_gallery_v1_{folder}` — sessionStorage, cleared on tab close
- News: `planpromin_news_v2` — localStorage, 7-day TTL
- Metals: `planpromin_metals_v1` — localStorage, 24h TTL
- Metal history: `planpromin_metals_history_v1` — localStorage, rolling 30-day log

**Core models**:
- `core/models/gallery.model.ts` — `CloudinaryImage`, `GalleryFolder`, `SECTION_FOLDERS` constants, and `GALLERY_FOLDERS` array with 10 predefined Cloudinary folder paths.
- `core/models/phase.model.ts` — `Phase` interface for mine operation phases (used by `operaciones/` domain).

**Shared components** (`shared/components/`): `navbar/`, `footer/`, `image-preview/` (lightbox).

**DI convention**: All *components* use `inject()` at field level instead of constructor injection — `private svc = inject(MyService)`. Services themselves may use constructor injection. Do not use constructor parameter injection when adding new services to existing components.

**Chart.js**: Only specific Chart.js modules are imported (tree-shaken). `HomeComponent` registers `LineController`, `LineElement`, `PointElement`, `LinearScale`, `CategoryScale`, `Filler`, `Tooltip`. When adding new chart types elsewhere, register the required modules explicitly before use.

### Backend (`api/`)

Vercel serverless functions compiled via `tsconfig.api.json`:
- `api/images.ts` — Cloudinary Admin API by folder; supports prefix-based fallback; cursor pagination (max 500/page)
- `api/news.ts` — Parses 3 RSS feeds, scrapes `og:image`, returns max 20 articles
- `api/metalprice.ts` — Proxies MetalpriceAPI; 5-min server-side cache
- `api/contact.ts` — Saves contact form submissions to Google Sheets via Service Account JWT auth
- `api/api-news.ts` — Legacy duplicate of `news.ts`, kept for compatibility

All API functions set CORS headers and handle OPTIONS preflight. All return `{ success, data, error?, timestamp?, cached? }`.

Dev proxy (`proxy.conf.json`): `/api` → `localhost:3001`, `/metalprice` → external MetalpriceAPI with path rewrite.

### Cloudinary folder structure

```
mineria/
├── home/           → Homepage hero images
├── empresa/        → Corporate/management photos
├── operaciones/    → Mining operations
├── geologia/       → Geology samples
├── seguridad/      → Safety/PPE
├── medio-ambiente/ → Environmental
├── comunidades/    → Community projects
├── noticias/       → News reference images
└── galeria/        → Curated gallery highlights
```

`gallery.service.ts` falls back to `mineria/` if a section folder returns fewer than 3 images. Upload preset is `PLANPROMINV1` (unsigned).

### Environments

`src/environments/environment.ts` (production): `/api/metalprice` (serverless proxy), cloudinary cloud `dlumbzsnd`  
`src/environments/environment.development.ts`: direct MetalpriceAPI call (bypasses proxy), `baseUrl: 'http://localhost:3000/api'`

> **Note**: `baseUrl` in dev points to port 3000, but `npm run start:api` (Vercel dev) runs on port **3001**. Angular's dev proxy rewrites `/api/*` to 3001 automatically, so most API calls work via the proxy path regardless of `baseUrl`.

### Key config files

| File | Purpose |
|------|---------|
| `vercel.json` | SPA fallback rewrites + CORS headers for `/api/*` |
| `proxy.conf.json` | Dev proxy: `/api` → 3001, `/metalprice` → external |
| `tailwind.config.js` | Custom colors (primary blues, accent orange #FF5722), fonts Outfit/Inter |
| `.env.local` | Cloudinary credentials for local dev (never commit) |
| `angular.json` | Build output `dist/galery-web-front/browser/`; budgets 500kb warn / 1mb error |
| `tsconfig.api.json` | Separate TypeScript config for serverless functions |

### Deployment

Deployed to Vercel via `git push`. Build command: `npm run build`. Environment variables set in the Vercel dashboard:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — image management
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID` — contact form → Google Sheets
