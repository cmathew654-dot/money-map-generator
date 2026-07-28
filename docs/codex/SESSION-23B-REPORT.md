# SESSION-23B Report — As-needed chip clearance

## What was built

- Made the default as-needed chip placement obstacle-aware at its final
  position. Candidate chip centers must keep the 250×38 chip inside the
  existing override bounds and keep the existing padded label box clear of
  the income panel, need card, and every account.
- Preserved the existing preference order along the routed curve. When no
  sampled path point is clear, placement now checks progressively larger
  perpendicular offsets on both sides of the local curve tangent and uses the
  first clear candidate.
- Left as-needed path routing, arrow anchors, text metrics, and the
  `asNeededChip` override behavior unchanged. A user-dragged chip is still
  moved by its stored delta and clamped only to the existing bounds.
- Added the exact five-income-row `postNote` reproduction and clearance
  assertions for it and all three sample clients. The asserted 250×38 chip
  rectangle must not intersect the income panel, need card, or any account.

## File-by-file LOC

| File | Physical LOC | Change |
| --- | ---: | --- |
| `src/layout/layout.ts` | 1,512 | Added bounded, obstacle-aware default chip placement along or perpendicular to the existing routed curve. |
| `tests/layout.test.ts` | 853 | Added the shared chip-clearance assertion, three sample guards, and the five-row stress reproduction. |
| `docs/codex/SESSION-23B-REPORT.md` | 144 | Recorded implementation, verification, gates, and deviations. |

The implementation diff is 120 touched lines: 94 insertions and 26
deletions, at the top of the prompt's approximate 40–120 changed-line budget.

`layout.ts` and `layout.test.ts` remain above the repository's approximate
400-LOC reporting threshold. They were not split because Session 23B maps the
change to these existing files and explicitly limits the fix to label
placement.

No implementation file outside the Session 23B file map was changed. This
report is the prompt-required final documentation file.

## Tests added

- The Whitfield, Calloway, and Venkat default as-needed chip rectangles do not
  intersect their income panel, need card, or any account.
- A `postNote` client with five income rows at amounts
  `2400/1900/null/null/null`, Whitfield income/need values, and the requested
  short-term, cash, after-tax, and tax-deferred accounts keeps the default
  chip clear of every mapped shape.
- The existing override suite remains green, including the assertion that a
  chip delta is applied on top of the automatic position.

The new stress assertion failed before the implementation change with the
328px-tall income panel as the single intersecting obstacle, then passed after
the fix.

## Browser verification and screenshots

Method: served the final production build and drove a fresh-profile headless
Google Chrome at 1440×920, device scale factor 1. The browser was loaded with
the exact five-income-row stress client and switched to presentation mode.
Print emulation was then enabled and captured at the 1320×1020 artboard size.

- The screen render shows the chip fully below the tall income panel and
  visually attached to the dashed as-needed arrow.
- SVG geometry measured the income panel at
  `{ x: 48, y: 159, w: 280, h: 328 }` and the chip at
  `{ x: 122.41, y: 601.76, w: 250, h: 38 }`; their intersection result was
  false.
- The chip center was approximately 16.01 SVG units from the routed
  as-needed path.
- Print emulation kept the same clear chip placement and left the rest of the
  composition visually unchanged.

| State | Screenshot | SHA-256 |
| --- | --- | --- |
| Five-row client on screen | `C:\tmp\session23b-visuals\screen-five-income-rows.png` | `a5f274c5034ee9f0a2a37e6765e608a1370e88d63778cafa5ddf207d217e705` |
| Five-row client under print emulation | `C:\tmp\session23b-visuals\print-five-income-rows.png` | `3395460be2931cd9c9aa7dca40af1ad16b557b7147f113e381a05095f01a5f49` |

The screenshots, temporary browser driver, and isolated Chrome profile remain
outside the repository under `C:\tmp`. The local browser and server processes
were stopped.

## Gate outputs

The final gates were run against the implementation tree documented here.
The package scripts were invoked through the Windows `npm.cmd` shim because a
sandboxed targeted Vitest attempt could not load `vite.config.ts`.

### `npm run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 53 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-sPanjw7e.css                             17.84 kB │ gzip:  4.39 kB
dist/assets/index--iyaJgm2.js                             274.06 kB │ gzip: 86.29 kB
✓ built in 1.68s
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/textfit.test.ts (5 tests) 11ms
 ✓ tests/math.test.ts (16 tests) 62ms
 ✓ tests/format.test.ts (24 tests) 78ms
 ✓ tests/undo.test.ts (6 tests) 12ms
 ✓ tests/contrast.test.ts (10 tests) 6ms
 ✓ tests/filestore.test.ts (3 tests) 10ms
 ✓ tests/export.test.ts (3 tests) 6ms
 ✓ tests/book.test.ts (29 tests) 43ms
 ✓ tests/mapedit.test.ts (7 tests) 11ms
 ✓ tests/wizard.test.ts (6 tests) 13ms
 ✓ tests/overrides.test.ts (19 tests) 126ms
 ✓ tests/form.test.ts (4 tests) 39ms
 ✓ tests/layout.test.ts (44 tests) 281ms

 Test Files  13 passed (13)
      Tests  176 passed (176)
   Start at  20:27:36
   Duration  1.76s (transform 1.71s, setup 0ms, collect 4.85s, tests 697ms, environment 6ms, prepare 5.56s)
```

## Deviations and not done

- No Session 23B prompt deviations.
- No path routing, arrow anchor, text-metric, print-style, or user-override
  changes were made.
- No dependencies were added, no unrelated product work was performed, and
  no v2 candidates were identified.
- No push was performed.
