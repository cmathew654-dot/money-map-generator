# s51 O-DBL — double-click never opens the text editor on wrapped labels

## Root cause

`editableLineTextProps` — `src/render/MapSvg.tsx:315` (was `pointerEvents: 'none'`).

Every wrapped label paints its glyphs in `<tspan>` children, and that helper
hard-coded `pointer-events: none` on all of them. A `<text>` whose content
lives entirely in deaf tspans has no painted area of its own, so it never wins
a hit test. The double-click fell through to the block-level hit rect
underneath (`accountRows` / `accountSub`), whose `activate` dispatches a
**size-only** edit target — the size pill opens, the text editor never does.

Single-line values (`accountPositionValue`, `accountSubValue`) put their text
directly in `<text>` with no tspan, so they stayed hittable. Hence the reported
"titles fail, values work".

The reported top-level `accountLabel` case was **not** reproducible: it has a
dedicated `accountLabel` hit rect with `pointerEvents="all"` painted over it.
The suspected `accountTextHitRect` geometry (MapSvg.tsx:1153-1174) is correct —
measured in-browser, the rect is the topmost element at both lines of every
wrapped title. Actually broken: `accountSubLabel`, `accountSubCaption`,
`accountPositionLabel` — the 2-line "Short-Term / Funds" sub-account label in
the demo map is almost certainly what the video showed.

## Diff

- `src/render/MapSvg.tsx:315` — `pointerEvents: 'none'` -> `'inherit'` (+ comment).
  A line now takes its owner's semantics: click-through under a visual-only
  label (parent `<text>` is already `none`, its hit rect owns the gesture),
  clickable under a `role="button"` one.
- `tests/mapedit.test.ts:341` — the "clickable or click-through" assertion
  encoded the buggy state; it now also accepts `inherit`.

## Tests

- `tests/s51-dblclick-hitrect.test.tsx` (2) — no self-interactive `<text>` may
  contain a `pointer-events="none"` tspan; wrapped title hit rect is taller
  than a single-line one. RED before fix (9 deaf nodes).
- `tests/e2e/s51-dblclick-title.spec.ts` (9) — real `page.mouse.dblclick` at
  each rendered line box. RED 5/9 before fix, 9/9 after.

Verification: `tsc --noEmit` clean; `vitest run` 739/739; e2e 28/28 with
`canvas-editor.spec.ts`.

## Residual risk

Tspans in self-interactive text are now hit targets, so a pointer-down on a
wrapped label lands on the tspan instead of whatever sat beneath it. Handlers
live on the parent `<text>`, so events still bubble to the same place — but
drag-start on position rows and sub-account blocks is the place to watch.

Pre-existing, not this lane: `map-keyboard.spec.ts:77` and `:110` fail on
baseline `677d0db` too (selection lane, MapSvg 2284-2803).
