# SESSION-5B — Arc cap + subpath-deploy readiness (pre-ship)

Read `AGENTS.md` first. Two small items; the second is a ship blocker for
GitHub Pages (site will live under `/money-map-generator/`).

## P1 — Cap the waterfall arc (owner call)

In `src/layout/layout.ts`: waterfall arcs must hug the drums. Clamp every
waterfall control point so the arc apex rises AT MOST 24 units above the
higher of the two connected drum tops (keep the existing absolute
y ≥ 128 floor and all clearance rules). Test: for each waterfall arrow in
every sample, min path y ≥ min(srcTop, dstTop) − 26 AND ≥ 128.

## P2 — Kill absolute /fonts/ paths (breaks under a subpath deploy)

`src/styles/app.css` (@font-face) and `src/export/export.ts` (PNG font
embedding) reference `/fonts/*.woff2` absolutely. Under
`https://<user>.github.io/money-map-generator/` those 404: screen falls
back to system fonts and PNG export embeds nothing.

Fix the Vite-idiomatic way:
- Move the four woff2 files from `public/fonts/` to `src/fonts/` (git mv;
  delete `public/fonts/`).
- `app.css`: `src: url('../fonts/<file>.woff2') format('woff2')` — Vite
  fingerprints and rewrites them base-relative.
- `export.ts`: replace the string constants with module imports
  (`import literataNormal from '../fonts/literata-latin-wght-normal.woff2'`)
  and use those URLs for the fetch+base64 embedding. Add a
  `src/vite-env.d.ts` (or extend existing env types) declaring
  `*.woff2` modules if TypeScript complains.
- Verify: `npm run build`, then grep `dist/` — the built CSS/JS must
  contain NO occurrence of `url(/fonts/` or `'/fonts/`; the woff2 files
  must exist under `dist/assets/` (hashed). Confirm the app still renders
  serif figures via the dev server and that Export PNG still produces a
  font-embedded file (byte size well above 500 KB is an acceptable proxy;
  describe your check).

## Gates & report

`npm run build` + `npm test` green (quote outputs). Commit in logical
steps; `docs/codex/SESSION-5B-REPORT.md`. Budget ≈ 60–140 changed lines.
