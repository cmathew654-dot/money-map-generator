# SESSION-35 Report

## Built

- Changed the form pane and sticky form chrome from paper off-white to true
  white.
- Changed stacked form rows and account cards to true white while retaining
  the `#f4f6f2` section-card layer and the `#e4e8e1` app background.
- Changed income and account preset chips to true white and strengthened their
  border from `#dde1dc` to the existing input-border color `#c9cfc9`.
- Changed the `+ Add ...` form buttons to true white. Their hover state now
  uses the existing `#f1f3f0` hover gray; text-only buttons retain their
  transparent hover treatment.
- Changed the wizard footer to true white.
- Left all map, present, print, token, model, and end-of-file regions
  untouched. Existing selectors were sufficient, so `src/form/Form.tsx`
  required no class hook.

## Files

Current file LOC (`Get-Content | Measure-Object -Line`) and Session 35 changes:

| File | LOC | Session 35 change |
| --- | ---: | ---: |
| `src/styles/app.css` | 1750 | +14 / -9 |
| `docs/codex/SESSION-35-REPORT.md` | 140 | new |

Implementation changes total 23 changed lines (+14 / -9), before this required
report. This is below the approximate 40–120-line budget because the existing
shared `.stacked-row`, `.account-preset-button`, and `.add-button` selectors
covered every requested form surface without JSX hooks or duplicated rules.

`src/styles/app.css` is above approximately 400 LOC. It was not split because
Session 35 explicitly restricts the implementation to its form/wizard regions
and forbids unrelated architecture work.

## Browser verification

Method: built the production bundle, served it with Vite Preview at
`http://127.0.0.1:4351`, and drove a fresh-profile headless Google Chrome at
1440×1000 with device scale factor 1 through the Chrome DevTools Protocol.
All browser scripts, profiles, logs, diagnostics, and screenshots were kept
under `C:\tmp`.

- Income step:
  `C:\tmp\session-35-income.png`
  shows white income-row cards, white inputs, and white Add chips on the
  `#f4f6f2` Income section card.
- Accounts step:
  `C:\tmp\session-35-accounts.png`
  shows white preset chips and white account cards on the section card.
- Hover:
  `C:\tmp\session-35-chip-hover.png`
  is a close-up showing the hovered Short-Term chip in gray beside the
  remaining white preset chips.
- Full form:
  `C:\tmp\session-35-full-form-overview.png`
  shows the white form pane, white row cards, white controls and chips, and
  distinct pale-green section cards in Full form mode.

Computed-style diagnostics confirmed:

```text
app: rgb(228, 232, 225)
pane: rgb(255, 255, 255)
section: rgb(244, 246, 242)
row: rgb(255, 255, 255)
input: rgb(255, 255, 255)
chip: rgb(255, 255, 255)
hovered chip: rgb(241, 243, 240)
```

All four screenshots were manually inspected. The surface ladder remains
distinct, preset borders remain legible, and the hover state is visibly
different.

## Gates

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 55 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.49 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BJPvBl25.css                             25.51 kB │ gzip:  5.65 kB
dist/assets/index-CuPiLTtE.js                             306.59 kB │ gzip: 96.08 kB
✓ built in 1.61s
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/mm-wt-s35

 ✓ tests/contrast.test.ts (17 tests) 3ms
 ✓ tests/textfit.test.ts (5 tests) 7ms
 ✓ tests/format.test.ts (33 tests) 16ms
 ✓ tests/math.test.ts (16 tests) 14ms
 ✓ tests/vocab.test.ts (7 tests) 11ms
 ✓ tests/undo.test.ts (6 tests) 4ms
 ✓ tests/filestore.test.ts (3 tests) 3ms
 ✓ tests/book.test.ts (76 tests) 37ms
 ✓ tests/overrides.test.ts (20 tests) 66ms
 ✓ tests/export.test.ts (3 tests) 3ms
 ✓ tests/wizard.test.ts (6 tests) 6ms
 ✓ tests/layout.test.ts (60 tests) 126ms
 ✓ tests/form.test.ts (12 tests) 19ms
 ✓ tests/mapedit.test.ts (43 tests) 119ms

 Test Files  14 passed (14)
      Tests  307 passed (307)
   Start at  16:56:13
   Duration  3.03s (transform 1.28s, setup 0ms, collect 5.07s, tests 434ms, environment 2ms, prepare 17.65s)
```

The first sandboxed build attempt could not read Vite's config through the
restricted parent-directory view. The same build was rerun with the approved
build permission and produced the green output quoted above.

## Deviations and observations

- No functional deviation from the spec.
- The implementation is smaller than the approximate changed-line budget for
  the reason recorded in the Files section.
- No new dependency, form class hook, v2 note, or out-of-scope file was
  needed.
- Nothing was pushed and no remote was added.
