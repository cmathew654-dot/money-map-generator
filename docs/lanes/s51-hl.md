# s51 T-HL — selection highlight + selected-count badge

## Problem

`[data-map-selected='true']` items carried only a faint `drop-shadow(0 0 5px)`
(app.css:2440), which is invisible against tinted account fills. Multi-select
had no count feedback at all.

## Change

- **`src/styles/selection.css`** (lane-owned). Out-specifies the frozen app.css
  rule via a `.map-page` ancestor qualifier. Four **zero-blur** directional
  `drop-shadow()`s chain into a solid ~2.5px flow-green outline around the
  item's silhouette, followed by a soft outer halo and a 3% brightness lift.
  Blurred shadows were tried first and rejected: they smudge, they never draw
  an edge. Applies to both `[data-account-id]` groups and `.map-note` groups.
  150ms ease-out filter transition, dropped under `prefers-reduced-motion`.
- **`src/ui/SelectionBadge.tsx`** (new). Pill chip anchored bottom-left of
  `.preview-pane`: `N selected`, plus a muted `— shift-click adds` hint at
  N=1. `role="status" aria-live="polite"`, `pointer-events: none`, hidden in
  print and at N=0.
- **`src/App.tsx`**: one import, one mount line. Count is
  `presentMode ? 0 : selectedMapTargetKeys.length` so the chip never appears
  on a client-facing screen. No state restructuring.

## Tokens

flow `#1e7a4a` ring; surface `#ffffff` chip, hairline `#dde1dc`, ink `#1c2422`,
muted `#47504d` hint (8.2:1), pill radius 999px, Public Sans 12px/600, and the
existing compact-map-control shadow `0 3px 10px rgb(28 36 34 / 16%)`.

## Verification

`tsc --noEmit` clean; `vitest run` 739/739; `s51-selection-visual.spec.ts`
green against a committed baseline that was eyeballed at 1440x900 — the ring
around Cash at Bank reads unmistakably against its unselected neighbours.

Note ring is covered by the same rule and the same DOM contract
(`MapSvg.tsx:3309`) but is **not** screenshot-verified: the Whitfield demo map
ships with zero notes, so there is nothing to select without authoring one.
