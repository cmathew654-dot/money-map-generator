# SESSION-36 Report

## Built

- Replaced the header `Export PNG` button with a `Save ▾` menu using the
  existing `Menu` component.
- Added the three requested actions: `PNG image`, `PDF document`, and
  `SVG image`.
- Added a muted, noninteractive book auto-save line below the actions. It
  reports either the connected filename with a checkmark or the browser-only
  state with directions to `Book ▾`.
- Kept PNG export on `exportPng` and `mapFileName`, while sharing its existing
  font embedding and 2× canvas render with the new formats.
- Added SVG download from the same offscreen, noninteractive map SVG. The
  serialized file has explicit artboard dimensions and the four embedded
  WOFF2 data URLs.
- Added a pure handwritten PDF builder. It writes one 792×612 pt landscape
  page containing the 2640×2040 canvas JPEG at quality 0.92 as a `/DCTDecode`
  image XObject, with computed object offsets, xref table, and trailer.
- Strengthened README positioning around one locally auto-saved book holding
  the whole practice, optional disk/OneDrive connection, and data never
  leaving the machine.

## Files

Current file LOC (`Get-Content <file> | Measure-Object -Line`) and Session 36
implementation changes:

| File | LOC | Session 36 change |
| --- | ---: | ---: |
| `README.md` | 88 | +8 / -7 |
| `src/App.tsx` | 1352 | +43 / -13 |
| `src/export/export.ts` | 251 | +79 / -20 |
| `src/export/pdf.ts` | 123 | new |
| `src/styles/app.css` | 1789 | +15 / -0 |
| `tests/export.test.ts` | 97 | +73 / -2 |
| `tests/pdf.test.ts` | 50 | new |
| `docs/codex/SESSION-36-REPORT.md` | 166 | new |

Implementation changes total 433 changed lines (+391 / -42), before this
required report, within the approximate 300–450-line budget.

`src/App.tsx` and `src/styles/app.css` remain above approximately 400 LOC.
They were not split because Session 36 explicitly calls for minimal touches
to those existing files and does not authorize new architecture files.

## Tests

- `tests/pdf.test.ts` verifies `%PDF-1.4`, one page, the 792×612 media box,
  `/DCTDecode`, the exact JPEG stream length, `/Size 6`, every computed object
  offset, and `startxref`.
- `tests/export.test.ts` verifies `.png`, `.pdf`, and `.svg` filenames and
  exercises SVG serialization with embedded font data, complete `<svg`
  markup, fixed artboard dimensions, and no editor chrome classes.
- Inspection of the real downloaded SVG confirmed:

```text
starts_with_svg=True
embedded_font=True
has_editor_chrome=False
```

## Browser verification

Method: built the production bundle, served it with Vite Preview at
`http://127.0.0.1:4173`, and drove fresh-profile headless Chrome and Edge at
1440×1000 through the Chrome DevTools Protocol. Browser profiles, standard
output, logs, downloads, automation, and screenshots were kept under
`C:\tmp`.

- `C:\tmp\money-map-session36\save-menu-browser-only.png` shows the open
  `Save ▾` menu with all three actions, a separator, and
  `Book auto-saves in this browser — connect a file from Book ▾`.
- `C:\tmp\money-map-session36\save-menu-connected.png` shows the same three
  actions and
  `Book auto-saves — connected to advisor-practice.json ✓`.
  The connected state used a headless-browser File System Access handle
  because an operating-system save picker is unavailable in headless mode;
  App's normal connection state and rendering path were exercised.
- Chrome downloaded all three current-build files:

```text
Jordan & Dana Whitfield — Money Map 2026.png  602513 bytes
Jordan & Dana Whitfield — Money Map 2026.pdf  414484 bytes
Jordan & Dana Whitfield — Money Map 2026.svg  231491 bytes
```

- `C:\tmp\money-map-session36\pdf-chrome.png` shows the generated PDF open in
  Chrome: page 1 of 1, US-letter landscape, with the full map visible.
- `C:\tmp\money-map-session36\pdf-edge.png` shows the same generated PDF open
  in Edge: page 1 of 1, landscape, with the full map visible. The PDF fallback
  was therefore not used.
- The README feature section was reviewed as plain text and leads with the
  requested one-book framing.

## Gates

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 56 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-CQAGhsz4.css                             26.07 kB │ gzip:  5.76 kB
dist/assets/index-BH-TZpXQ.js                             311.82 kB │ gzip: 97.80 kB
✓ built in 914ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/pdf.test.ts (2 tests) 6ms
 ✓ tests/textfit.test.ts (5 tests) 10ms
 ✓ tests/format.test.ts (33 tests) 18ms
 ✓ tests/contrast.test.ts (24 tests) 7ms
 ✓ tests/math.test.ts (16 tests) 27ms
 ✓ tests/vocab.test.ts (7 tests) 17ms
 ✓ tests/filestore.test.ts (3 tests) 4ms
 ✓ tests/undo.test.ts (6 tests) 7ms
 ✓ tests/export.test.ts (5 tests) 8ms
 ✓ tests/book.test.ts (78 tests) 48ms
 ✓ tests/overrides.test.ts (22 tests) 107ms
 ✓ tests/wizard.test.ts (6 tests) 8ms
 ✓ tests/layout.test.ts (63 tests) 169ms
 ✓ tests/form.test.ts (12 tests) 24ms
 ✓ tests/mapedit.test.ts (46 tests) 151ms

 Test Files  15 passed (15)
      Tests  328 passed (328)
   Start at  18:02:39
   Duration  1.47s (transform 3.94s, setup 0ms, collect 6.75s, tests 611ms, environment 3ms, prepare 2.11s)
```

The first sandboxed build attempt could not read Vite's config through the
restricted parent-directory view. The build was rerun with the approved build
permission, and the final green run is quoted above.

## Commits

- `5636d7b Add SVG and PDF map exports`
- `2d67d02 Replace export button with Save menu`

## Deviations and observations

- No functional deviation from the spec.
- No PDF fallback, dependency, `filestore.ts` change, v2 note, or out-of-scope
  implementation file was needed.
- Chrome's stderr contained a Google messaging deprecated-endpoint warning,
  and Edge's stderr contained a renderer task-provider warning. Neither came
  from the page; the CDP page logs contained no application exception.
- Nothing was pushed and no remote was added.
