# SESSION-1 Report

Date: 2026-07-26

## What was built

Session 1 now has the complete static render path:

- The supplied domain model and formatting helpers, including the intentional
  `null` → `~$ ______` behavior.
- The Whitfield sample client and the requested `blankClient()` factory.
- A deterministic, pure slot-based layout engine with content-aware account
  heights, dense-column compression, fixed panel slots, and complete SVG arrow
  path strings.
- A single SVG renderer for the masthead, income panel, need card, account
  cylinders, note cards, inset sub-accounts, refill arrows, as-needed label,
  and footnotes.
- A temporary static React shell that centers the sample map on a gray page.
- Four local variable-font faces for Literata and Public Sans.
- Format and layout tests, including a dense eight-account compression case.

The rendered sample was also reviewed from a headless-browser screenshot.
That review found and led to corrections for the after-tax position/total
spacing and the inset-cylinder cap/label spacing.

## File-by-file LOC

| File | LOC | Purpose |
| --- | ---: | --- |
| `src/main.tsx` | 10 | React mount |
| `src/App.tsx` | 12 | Temporary static sample shell |
| `src/model/types.ts` | 85 | Supplied domain model |
| `src/model/format.ts` | 37 | Supplied pure formatting helpers |
| `src/model/samples.ts` | 116 | Whitfield sample and blank factory |
| `src/layout/layout.ts` | 261 | Deterministic pure layout and arrow paths |
| `src/render/tokens.ts` | 54 | Supplied visual tokens |
| `src/render/MapSvg.tsx` | 743 | Complete SVG component tree |
| `src/styles/app.css` | 64 | Font faces, reset, and centered page shell |
| `tests/format.test.ts` | 45 | Formatting coverage |
| `tests/layout.test.ts` | 122 | Placement, waterfall, slot, and compression coverage |
| **Total** | **1,549** | Session implementation and tests |

## Required gates

### `npm run build`

Final run against commit `72b96b6`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 34 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.41 kB │ gzip:  0.27 kB
dist/assets/index-BzcFk3pb.css   0.89 kB │ gzip:  0.33 kB
dist/assets/index-CKJvybW0.js  206.34 kB │ gzip: 65.23 kB
✓ built in 581ms
```

Result: green.

### `npm test`

Final run against commit `72b96b6`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (7 tests) 14ms
 ✓ tests/layout.test.ts (7 tests) 9ms

 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  14:08:35
   Duration  622ms (transform 182ms, setup 0ms, collect 267ms, tests 23ms, environment 0ms, prepare 359ms)
```

Result: green.

### `npm run dev`

Final check used:

```text
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Vite output:

```text
> money-map-generator@0.1.0 dev
> vite --host 127.0.0.1 --port 4173 --strictPort

VITE v7.3.6 ready in 295 ms
Local: http://127.0.0.1:4173/
```

I requested the page over HTTP and loaded it in local headless Edge:

```text
http_status=200
edge_exit=0
svg_in_dom=True
runtime_error_count=0
```

Vite stderr was empty. The dev server was stopped after the check.

## Commits

```text
72b96b6 Handle blank account render keys
0c24c94 Refine account content spacing
726075d Test formatting and deterministic layout
d69dacc Mount the static sample map
6e6bedd Render the editorial money map SVG
b36fd0b Add deterministic money map layout
f933914 Add money map domain model
```

No remote was added and nothing was pushed.

## Deviations and environment notes

- The implementation/test total is 1,549 LOC, 249 lines above the approximate
  900–1,300 budget.
- `src/render/MapSvg.tsx` is 743 LOC, above the repo's ~400 LOC warning
  threshold. The session file map requires the full SVG component tree in this
  one file, so I did not create an unapproved renderer-helper file or compress
  the JSX at the expense of legibility.
- The first sandboxed build attempt, and one later sandboxed test attempt,
  could not load `vite.config.ts` because esbuild received `Access is denied`
  while reading `../..`. The same required commands were rerun outside that
  restricted filesystem sandbox and passed as quoted above.
- TypeScript's generated `tsconfig.tsbuildinfo` was removed after the final
  build because it is not part of the Session 1 file map.

## Noticed but not done

- No form, multi-client file management, canvas interaction, map editing, or
  export work was added; those are explicitly outside this session.
- No dependencies were added.
