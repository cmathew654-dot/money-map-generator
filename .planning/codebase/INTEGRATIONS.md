# External Integrations

**Analysis Date:** 2026-08-08

## APIs & External Services

**None detected.**

Money Map is a fully offline, client-side application with no external API dependencies. All computation, rendering, and persistence occur in the browser.

## Data Storage

**Databases:**
- Not applicable — no backend database

**Local Persistence:**
- Browser localStorage (native Web Storage API)
  - Key: `money-map-generator:book` — current MoneyMapFile as JSON
  - Key: `money-map-generator:writer` — writer lease (multi-tab coordination)
  - Key: `money-map-generator:writer-takeover-request` — tab takeover signal
  - Legacy key: `money-map-book:v1` — auto-migrated on load
  - Implementation: `src/model/browserStore.ts`

**File Storage:**
- Local filesystem only via browser download
  - User exports as JSON, PNG, SVG, or PDF
  - No cloud sync or remote backup
  - No streaming or server-side storage

**Caching:**
- Browser HTTP cache for fonts and static assets
- No runtime memory caching layer (data fits in single JSON object)

## Authentication & Identity

**Auth Provider:**
- None — application is single-user, no login required
- No user accounts or multi-user sync
- Multi-tab coordination via localStorage lease system (same-origin only)

## Monitoring & Observability

**Error Tracking:**
- None — errors logged to browser console only

**Logs:**
- Browser console (dev tools only, no remote logging)

## CI/CD & Deployment

**Hosting:**
- Static site deployment (Netlify, Vercel, GitHub Pages, S3, or file://)
- No server-side runtime required
- Works offline after first load (if bundled assets cached)

**CI Pipeline:**
- GitHub Actions (`.github/` directory present)
- Build: `npm run build` (TypeScript check + Vite bundle)
- Test: `npm run test` (Vitest unit tests)
- E2E: `npm run test:e2e` (Playwright headless browser)
- Demo build: `npm run build:demo` (separate VITE_DATA_MODE=demo build)

## Environment Configuration

**Build-time env vars:**
- `VITE_DATA_MODE` — 'demo' or 'real' (defaults to 'real')
  - Read at runtime via `import.meta.env.VITE_DATA_MODE`
  - Example: `.env.demo` sets demo mode for demo-dist build

**Runtime detection:**
- `resolveDataMode()` in `src/model/browserStore.ts` — resolves final mode

**No secrets required** — application is fully open-source safe

## Webhooks & Callbacks

**Incoming:** None

**Outgoing:** None

## Export Pipeline

**Formats supported:**
- **JSON** — Native MoneyMapFile format
  - Filename: `money-map-book.json`
  - Save via `saveBookToFile()` in `src/export/export.ts`
  - Load via `loadBookFromFile()` (File picker)

- **PDF** — Custom PDF builder (no external library)
  - Resolution: 1320×1020px rendered, exported as JPEG in PDF
  - Metadata: title, language (en-US), alt-text for accessibility
  - Builder: `buildPdf()` in `src/export/pdf.ts` — hand-coded PDF 1.4 structure
  - Fonts: Literata & Public Sans embedded as base64 in output

- **PNG** — 2× oversample via HTML5 Canvas
  - Resolution: 2640×2040px (exported at native density, downsampled for display)
  - SVG→Canvas rendering with embedded fonts
  - Export via `exportPng()` in `src/export/export.ts`

- **SVG** — Direct serialization
  - Resolution: 1320×1020px
  - Fonts embedded as base64 data URLs
  - Export via `exportSvg()` in `src/export/export.ts`

**Font loading:**
- WOFF2 files fetched from `src/fonts/` at build time
- Converted to base64 data URLs for embedding in export
- Fonts: Literata (serif) + Public Sans (sans-serif)

**Alt-text generation:**
- `moneyMapAlternativeText()` in `src/export/export.ts` — generates plain-text description of map for PDF accessibility

---

*Integration audit: 2026-08-08*
