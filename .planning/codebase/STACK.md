# Technology Stack

**Analysis Date:** 2026-08-08

## Languages

**Primary:**
- TypeScript ~5.8.3 - All source code, strict mode enabled
- JavaScript (ES2022) - Runtime target via Vite build

**Secondary:**
- JSX/TSX - React component markup in `src/`
- CSS - Style definitions in `src/styles/`

## Runtime

**Environment:**
- Node.js (ESM) - Development and build only (app is fully client-side)
- Browser (modern, ES2022 capable) - Production runtime

**Package Manager:**
- npm - Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.1.0 - UI component library and rendering
- React DOM 19.1.0 - DOM mounting and hydration

**Build/Dev:**
- Vite 7.0.0 - Fast dev server and optimized production bundler
  - Config: `vite.config.ts` — React plugin, base: './'
- @vitejs/plugin-react 4.6.0 - Fast refresh and JSX transformation

**Testing:**
- Vitest 3.2.4 - Unit test runner (excludes e2e)
  - Config: inferred in `vite.config.ts` (configDefaults.exclude)
- Playwright 1.62.0 - E2E browser automation
  - Config: `playwright.config.ts`
  - Axe-core 4.12.1 - Accessibility testing plugin

## Key Dependencies

**Critical:**
- react 19.1.0 - Component-based UI with concurrent rendering
- react-dom 19.1.0 - Browser rendering target

**Runtime none:** App runs entirely client-side; no backend SDKs (stripe, supabase, aws, etc.) detected

**Build/Compiler:**
- typescript 5.8.3 - Type checking, compilation to JavaScript
- @types/react 19.1.8 - Type definitions for React
- @types/react-dom 19.1.6 - Type definitions for React DOM

## Configuration

**Environment:**
- `import.meta.env` used for build-time configuration
- `VITE_DATA_MODE` env var — controls 'demo' vs 'real' mode (set in index.html)
- `.env` and `.env.demo` files for mode-specific config (contents not readable — permission restricted)

**Build:**
- TypeScript config: `tsconfig.json`
  - Target: ES2022
  - Lib: ES2022, DOM, DOM.Iterable
  - JSX: react-jsx (automatic)
  - Strict mode enabled
  - Module resolution: bundler
  - No unused locals/parameters allowed

- Vite config: `vite.config.ts`
  - Base path: './' (relative imports)
  - React plugin for JSX
  - Test exclusion: e2e tests run separately

## Assets

**Fonts:**
- Literata (normal + italic) — WOFF2 files in `src/fonts/`
- Public Sans (normal + italic) — WOFF2 files in `src/fonts/`
- Embedded as data URLs during PDF/PNG export

**Styles:**
- CSS-in-file structure; no CSS-in-JS framework detected
- Processed by Vite's native CSS loader

## Platform Requirements

**Development:**
- Node.js (ESM-capable)
- npm for dependency management
- Modern terminal (PowerShell, bash, zsh)

**Production:**
- Modern browser (ES2022, Canvas, DOM.Iterable, localStorage, URL.createObjectURL support)
- **No server required** — fully static deployment (CDN, GitHub Pages, file:// protocol supported)
- ~400KB estimated bundle size (Vite optimized)

## Output Artifacts

**Dist:**
- `dist/` — Production build output from `vite build`
- `demo-dist/` — Demo build output from `vite build --mode demo`

---

*Stack analysis: 2026-08-08*
