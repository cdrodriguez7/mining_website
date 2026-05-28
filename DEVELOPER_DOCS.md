# Documentación Técnica — PLANPROMIN S.A. Web

> Para nuevos desarrolladores. Cubre stack, versiones, arquitectura de carpetas, flujos de datos y variables de entorno. No cubre diseño ni contenido de pantallas.

---

## 1. Stack y Versiones Exactas

| Tecnología | Versión | Rol |
|---|---|---|
| **Node.js** | ≥ 20.x (recomendado LTS) | Runtime local y serverless |
| **Angular CLI** | 17.3.10 | Scaffolding y build |
| **Angular** | 17.3.12 | Framework frontend (todos los `@angular/*`) |
| **TypeScript** | 5.4.5 | Lenguaje — frontend y API |
| **RxJS** | 7.8.x | Programación reactiva |
| **Zone.js** | 0.14.10 | Change detection de Angular |
| **Tailwind CSS** | 3.4.19 | Utilidades CSS (JIT) |
| **Chart.js** | 4.5.1 | Gráficos de líneas (precios de metales) |
| **Cloudinary SDK** | 2.5.1 | SDK server-side (Admin API) |
| **@cloudinary/ng** | 1.7.0 | SDK client Angular |
| **@cloudinary/url-gen** | 1.20.0 | Generación de URLs con transformaciones |
| **googleapis** | 171.4.0 | Google Sheets API (formulario de contacto) |
| **nodemailer** | 8.0.4 | (dependencia presente, actualmente sin uso activo) |
| **@vercel/node** | 3.0.21 | Tipos para funciones serverless |
| **tslib** | 2.6.3 | Helpers TypeScript en runtime |

---

## 2. Herramientas de Desarrollo

```
npm start          → Angular DevServer en :4200 + proxy a :3001 (leer §3.2)
npm run start:api  → Vercel Dev en :3001 (funciones de api/)
npm run build      → Build de producción → dist/galery-web-front/browser/
npm run watch      → Build dev con hot-reload (sin servidor)
npm test           → Karma + Jasmine (unit tests)
ng test --include='src/app/.../component.spec.ts'  → test individual
```

**Regla de desarrollo local**: siempre deben correr dos terminales en paralelo:
- Terminal 1: `npm start` (frontend en :4200)
- Terminal 2: `npm run start:api` (serverless en :3001)

Si solo corre Terminal 1, las llamadas a `/api/*` fallarán (el proxy no tiene backend).

---

## 3. Arquitectura General

```
raíz/
├── src/                    → Aplicación Angular
│   ├── app/
│   │   ├── app.component   → Shell vacío: solo <router-outlet>
│   │   ├── app.config.ts   → Providers globales (Router + HttpClient)
│   │   ├── app.routes.ts   → Tabla de rutas lazy-loaded
│   │   ├── core/           → Servicios, modelos e interfaces globales
│   │   ├── features/       → Páginas por dominio de negocio
│   │   └── shared/         → Componentes reutilizables (navbar, footer, lightbox)
│   ├── environments/       → Variables de entorno por configuración
│   ├── assets/             → Archivos estáticos (logo, imágenes locales)
│   └── styles.scss         → Tailwind directives + variables SCSS globales
├── api/                    → Funciones serverless Vercel (TypeScript)
├── public/                 → Assets servidos en raíz del deploy (robots.txt, etc.)
├── tailwind.config.js      → Configuración Tailwind (colores, breakpoints, fuentes)
├── vercel.json             → Config de deploy: rewrites SPA, CORS, timeouts de funciones
├── proxy.conf.json         → Proxy de desarrollo: /api → :3001
├── tsconfig.json           → Base TypeScript
├── tsconfig.app.json       → Compilación del frontend (extiende base)
├── tsconfig.api.json       → Compilación de api/ (CommonJS, ES2020, moduleResolution node)
└── angular.json            → Configuración del proyecto Angular (budgets, assets, styles)
```

---

## 4. Módulo Frontend (`src/app/`)

### 4.1 Patrón de componentes

- **Todos los componentes son standalone** (`standalone: true`). No existen NgModules.
- El router usa `loadComponent()` para lazy-loading de cada ruta. Esto genera un chunk JS por componente/página y reduce el bundle inicial.
- La DI en **componentes** usa `inject()` a nivel de campo (`private svc = inject(MyService)`). Los **servicios** pueden usar inyección por constructor. No mezclar patrones.
- Estilos de componente: SCSS (configurado en `angular.json` → `inlineStyleLanguage: "scss"`).

### 4.2 `app.config.ts`

Registra los dos únicos providers globales:
- `provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }))` — el `scrollPositionRestoration: 'top'` hace que cada navegación entre rutas vuelva al inicio de la página.
- `provideHttpClient()` — habilita `HttpClient` para inyección en todos los servicios.

### 4.3 `app.routes.ts` — Estructura de rutas

| Prefijo | Descripción |
|---|---|
| `/` | HomeComponent |
| `/empresa/*` | Empresa: acerca-de, gerencia, directorio, gobierno-corporativo (con hijos), informacion-corporativa |
| `/inversores/*` | Inversores: overview, precio-accion, presentaciones, eventos, estados-financieros, cobertura-analistas, forma-informacion-anual, materiales-junta, dividendos, informacion-adicional/{eeuu,suecia} |
| `/operaciones/*` | Operaciones: ponce-enriquez/{overview,historia,geologia,operativo,proyecciones}, exploracion, guia-perspectivas, reservas-recursos, reporte-tecnico |
| `/mineria-responsable/*` | Sostenibilidad: overview, politica, salud-seguridad, medio-ambiente, cambio-climatico, comunidades, gobernanza, estrategia-5-anos, reportes-sostenibilidad, reporte-esclavitud-moderna, otros-reportes/{estma,impacto-ambiental,arqueologia}, compromisos-membresias |
| `/noticias` y `/noticias/:ano` | Noticias del sector (RSS) |
| `/carreras/*` | Carreras: vacantes, preguntas-frecuentes, por-que-trabajar, alerta-fraude |
| `/contacto` | Formulario de contacto → Google Sheets |
| `/galeria` y `/galeria/subir` | Galería dinámica Cloudinary + upload |
| `/**` | Redirige a `/` (catch-all 404) |

---

## 5. Servicios Core (`src/app/core/services/`)

Todos son `providedIn: 'root'` (singleton).

### `api.service.ts`
Wrapper HTTP genérico. Llama a `environment.baseUrl` + endpoint. Usado por componentes que no necesitan Cloudinary ni metales.
```typescript
get<T>(endpoint: string): Observable<T>
post<T>(endpoint: string, data: any): Observable<T>
```

### `cloudinary-backend.service.ts`
Llama a `GET /api/images?folder=<path>`. Añade `cache-busting` con timestamp para forzar datos frescos. Retorna `CloudinaryImage[]` mapeado desde la respuesta de la API.

### `cloudinary.services.ts`
Genera URLs de Cloudinary con transformaciones predefinidas usando `@cloudinary/url-gen`:
- **hero** → 16:9, 1920px ancho
- **card** → 4:3, 800px ancho
- **thumbnail** → 1:1, 400px ancho
También expone el método de upload firmado con el upload preset `PLANPROMINV1`.

### `gallery.service.ts`
Capa de cache sobre `cloudinary-backend.service.ts`. Dos modos de operación:
- `initialize()` → carga TODAS las imágenes bajo `mineria/` (para la galería pública).
- `initializeForSection(folder, minCount, useFallback)` → carga imágenes de una carpeta específica. Si devuelve < `minCount` imágenes y `useFallback=true`, mezcla con `mineria/` como fallback.

**Clave de caché**: `planpromin_gallery_v1_{folder}` en `sessionStorage`. Se invalida al cerrar la pestaña o hacer F5.

### `image-selector.service.ts`
Filtra `CloudinaryImage[]` por relación de aspecto (`landscape/portrait/square/ultrawide/any`), dimensiones mínimas, carpeta o tags. Devuelve una imagen aleatoria del conjunto filtrado. Usado para seleccionar imágenes hero y de sección de forma dinámica.

### `news.service.ts`
Llama a `GET /api/news`. Almacena el resultado en `localStorage` con TTL de 7 días (`planpromin_news_v2`). Si la API falla, sirve el cache caducado como fallback (stale). Retorna máximo 20 artículos.

### `metal.service.ts`
Llama a `GET /api/metalprice` (prod) o directamente a MetalpriceAPI (dev, ver §7). Cache de 24 horas en `localStorage` (`planpromin_metals_v1`). Si la API falla, retorna valores hardcoded de respaldo para no romper la UI.

### `metal-history.service.ts`
Registra el precio diario de cada metal en `localStorage` (`planpromin_metals_history_v1`). Mantiene un rolling log de máximo 30 días. Usado por Chart.js en el home para pintar los sparklines de histórico.

### `contact.service.ts`
Realiza `POST /api/contact` con el payload del formulario. No tiene cache. Retorna `{success, error?}`.

---

## 6. Modelos Core (`src/app/core/models/`)

### `gallery.model.ts`
- `CloudinaryImage` — interfaz para una imagen de Cloudinary: `publicId, title, description, folder, assetFolder, tags, width, height, format, createdAt, secureUrl`.
- `GalleryFolder` — definición de carpeta visible en la galería: `id, name, displayName, description, path`.
- `SECTION_FOLDERS` — const object con todos los paths de carpetas de Cloudinary. Usar siempre estas constantes, nunca strings literales.
- `GALLERY_FOLDERS` — array de `GalleryFolder` con las 10 carpetas visibles en la UI de galería.

### `phase.model.ts`
Interfaz `Phase` para fases de operación minera: `_id, phaseNumber, title, slug, description, icon, color, order, estimatedDuration, createdAt, updatedAt`. Usada en el dominio `operaciones/`.

---

## 7. Entornos (`src/environments/`)

| Variable | `environment.ts` (producción) | `environment.development.ts` (local) |
|---|---|---|
| `production` | `true` | `false` |
| `metalpriceUrl` | `/api/metalprice` (serverless proxy) | URL directa a MetalpriceAPI con API key embebida |
| `baseUrl` | `/api` | `http://localhost:3000/api` ⚠️ |
| `cloudinary.cloudName` | `dlumbzsnd` | `dlumbzsnd` |
| `cloudinary.uploadPreset` | `PLANPROMINV1` | `PLANPROMINV1` |

> ⚠️ **Bug conocido**: `baseUrl` en dev apunta a `:3000` pero el servidor de API corre en `:3001`. En la práctica esto no rompe nada porque el proxy Angular (`proxy.conf.json`) intercepta todas las llamadas a `/api/*` y las redirige a `:3001` automáticamente. `baseUrl` solo afectaría si un componente construyera una URL absoluta con `http://localhost:3000`, lo que no ocurre en el código actual.

---

## 8. API Serverless (`api/`)

Compiladas con `tsconfig.api.json` (CommonJS, ES2020). Desplegadas como Vercel Serverless Functions.

### Convención de respuesta
Todas las funciones retornan:
```json
{ "success": true|false, "data": ..., "error"?: "...", "timestamp"?: "...", "cached"?: true }
```

Todas manejan preflight `OPTIONS` y setean headers CORS globales.

### `api/images.ts` — `GET /api/images?folder=<path>`
Usa Cloudinary Admin API (`cloudinary.api.resources_by_asset_folder`). Estrategia de tres capas:
1. `resources_by_asset_folder(folder)` — búsqueda por Location (Dynamic Folders).
2. Si el folder tiene subcarpetas, las recorre recursivamente con `api.sub_folders()`.
3. Si los pasos anteriores retornan 0 imágenes, hace fallback a `api.resources({ prefix: folder })` (Fixed Folders / public_id-based).

Paginación: cursor-based, máximo 500 resultados por página, itera hasta agotar `next_cursor`. Mapea los recursos al interfaz `CloudinaryImage` del frontend.

### `api/news.ts` — `GET /api/news`
Parsea 3 feeds RSS del sector minero ecuatoriano. Para cada artículo, hace scraping del `og:image` de la página fuente. Retorna máximo 20 artículos ordenados por fecha. Timeout de función en Vercel: 30 segundos.

### `api/metalprice.ts` — `GET /api/metalprice`
Proxy a `https://api.metalpriceapi.com/v1/latest?api_key=...&base=USD&currencies=XAU,XAG`. Lee la API key de `process.env.METALPRICE_API_KEY`. Setea `Cache-Control: s-maxage=300` para cachear 5 minutos en el Edge de Vercel (ahorra cuota del plan gratuito de MetalpriceAPI).

### `api/contact.ts` — `POST /api/contact`
Escribe en Google Sheets via `googleapis` v4 con autenticación OAuth2. Usa refresh token (no Service Account JWT, a pesar de lo que dice CLAUDE.md). Escribe en el rango `Contacto!A:I` del spreadsheet. Campos: fecha, hora, tipo de solicitud, nombre, empresa, email, teléfono, asunto, mensaje. Timeout de función en Vercel: 15 segundos.

### `api/api-news.ts`
Duplicado legacy de `api/news.ts`. Mantenido por compatibilidad con URLs antiguas.

---

## 9. Variables de Entorno

### Vercel Dashboard (producción)
```
CLOUDINARY_CLOUD_NAME      → nombre del cloud (dlumbzsnd)
CLOUDINARY_API_KEY         → API Key de Cloudinary (Admin API)
CLOUDINARY_API_SECRET      → API Secret de Cloudinary (Admin API)

GOOGLE_CLIENT_ID           → OAuth2 client ID de Google Cloud Console
GOOGLE_CLIENT_SECRET       → OAuth2 client secret
GOOGLE_REDIRECT_URI        → https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN       → Refresh token obtenido desde OAuth Playground
GOOGLE_SPREADSHEET_ID      → ID del spreadsheet de Google Sheets (de la URL)

METALPRICE_API_KEY         → API key de metalpriceapi.com (plan gratuito)
```

### Archivo `.env.local` (desarrollo local — nunca commitear)
```
CLOUDINARY_CLOUD_NAME=dlumbzsnd
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=...
GOOGLE_SPREADSHEET_ID=...
```

> El archivo `.env.local` lo lee automáticamente `vercel dev` (Terminal 2). El frontend Angular **no** tiene acceso a estas variables; solo las leen las funciones de `api/`.

---

## 10. Build y Deploy

### Build de producción
```bash
npm run build
# Salida: dist/galery-web-front/browser/
```

Budgets configurados en `angular.json`:
- Warning en bundle inicial > 500 KB
- Error si bundle inicial > 1 MB
- Warning en estilo de componente > 6 KB / Error > 10 KB

### Deploy en Vercel
- Trigger: `git push` a la rama conectada en el dashboard de Vercel.
- Build command: `npm run build` (también existe `vercel-build` como alias).
- Output directory: `dist/galery-web-front/browser/`.
- Framework detection: `angular` (en `vercel.json`).

### Rewrites SPA (`vercel.json`)
```
/api/(.*)  →  /api/$1   (funciones serverless, tiene precedencia)
/(.*)      →  /index.html  (fallback SPA para rutas de Angular)
```

---

## 11. Proxy de Desarrollo (`proxy.conf.json`)

```json
"/api"       → http://localhost:3001   (funciones serverless locales)
"/metalprice" → https://api.metalpriceapi.com  (con path rewrite que elimina /metalprice)
```

El proxy actúa solo cuando corre `npm start`. El Angular DevServer intercepta cualquier request a `/api/*` antes de enviarlo al navegador y lo redirige al servidor de Vercel Dev.

---

## 12. Chart.js — Uso y Restricciones

Solo se importan los módulos necesarios (tree-shaking manual). En `HomeComponent` se registran:

```typescript
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);
```

**Importante**: si se añaden nuevos tipos de gráficos en otro componente (barras, dona, etc.), se deben registrar explícitamente sus módulos en ese componente. No usar `Chart.register(...registerables)` porque infla el bundle innecesariamente.

---

## 13. Cloudinary — Configuración

| Parámetro | Valor |
|---|---|
| Cloud name | `dlumbzsnd` |
| Upload preset (unsigned) | `PLANPROMINV1` |
| Folder raíz | `mineria/` |
| Modo de folders | Dynamic Folders (Location-based) |

**Dynamic Folders vs Fixed Folders**: el Admin API usa `resources_by_asset_folder` (Location) como estrategia principal. Si el Media Library de Cloudinary está configurado en modo "Fixed Folders" (más antiguo), el `asset_folder` no existe y la API cae al fallback de prefix-based. Esto es transparente para el frontend.

Para subir imágenes desde código o el dashboard de Cloudinary y que aparezcan en el sitio, la imagen debe estar en la carpeta correcta bajo `mineria/`. La nueva imagen aparece en el sitio al recargar la pestaña (el sessionStorage se invalida por tab).

---

## 14. Tailwind CSS — Configuración Relevante

```javascript
// tailwind.config.js
screens: {
  'xs': '390px',   // iPhone 16 Pro — custom
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
colors: {
  accent: { 500: '#FF5722' }  // naranja corporativo Tailwind
}
fontFamily: {
  display: ['Outfit', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
}
```

Los colores corporativos reales (`$primary-blue: #15A5DF`, `$primary-orange: #E9951D`, etc.) están definidos como variables SCSS en `src/styles.scss` y se usan en los componentes `.scss`. El naranja de la UI (`orange-600` de Tailwind = `#ea580c`) no coincide con el naranja corporativo SCSS; son dos sistemas coexistiendo.

---

## 15. Caché — Resumen de Todas las Claves

| Clave | Storage | TTL | Contenido |
|---|---|---|---|
| `planpromin_gallery_v1_{folder}` | sessionStorage | Hasta cerrar tab / F5 | Array de `CloudinaryImage[]` |
| `planpromin_news_v2` | localStorage | 7 días | Array de artículos RSS |
| `planpromin_metals_v1` | localStorage | 24 horas | Objeto con precios Au/Ag/Cu |
| `planpromin_metals_history_v1` | localStorage | Rolling 30 días | Array de registros diarios |

Para forzar un refresh en desarrollo, abrir DevTools → Application → Storage y limpiar la clave correspondiente.

---

## 16. Testing

Framework: **Karma + Jasmine** (configurado en `angular.json`).

Los specs de Chart.js requieren que `chart.umd.js` esté en el array `scripts` de la configuración de test en `angular.json` (ya está configurado). Sin esto, los tests que usan `HomeComponent` fallan porque Chart.js no encuentra su UMD global.

```bash
npm test                          # todos los specs
ng test --include='src/app/features/home/home.component.spec.ts'  # uno solo
```

---

## 17. Carpetas de Features — Lógica Interna

Cada carpeta bajo `src/app/features/` agrupa las páginas de un dominio. La convención es:

```
features/
├── <dominio>/
│   ├── <pagina>/
│   │   ├── <pagina>.component.ts    → lógica: OnInit + inject() de servicios
│   │   ├── <pagina>.component.html  → template
│   │   └── <pagina>.component.scss  → estilos específicos
```

Los componentes de cada página siguen este patrón de ciclo de vida:
1. `ngOnInit()` → llama a `GalleryService.initializeForSection()` para cargar imágenes de Cloudinary, luego llama a otros servicios (noticias, metales).
2. Los métodos `getXxxUrl()` → usan `CloudinaryService` para generar la URL con transformaciones correctas a partir del `publicId` almacenado en el `CloudinaryImage`.
3. El lightbox (`app-image-preview`) se controla con tres variables: `previewVisible`, `previewUrl`, `previewTitle` y el método `openPreview()` / `closePreview()`.

El dominio **`gallery/`** es especial: tiene un componente de galería completa (`gallery.component`) que usa `GalleryService.initialize()` (todas las imágenes) y un componente de upload (`upload.component`) que usa el upload preset unsigned de Cloudinary.

El dominio **`noticias/`** tiene dos componentes:
- `noticias-main` → lista general de artículos desde RSS cache.
- `noticias-ano` → ruta paramétrica `/noticias/:ano` para filtrar por año.

---

*Última actualización: 2026-05-25*
