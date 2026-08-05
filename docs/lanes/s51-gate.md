# s51 gate

`gate12.mjs` (root) — 45 checks, supersedes gate11. ~40s, exit 0 iff no FAIL.
Build to `gate-dist`, `vite preview` on 127.0.0.1:4298, `node gate12.mjs`.

- **Legacy (27)** — every gate11 check, in order.
- **Group A (6)** — state-context selection (L-PIN), also in
  `tests/e2e/s51-state-context.spec.ts`. A3 (Escape then shift = SINGLE) is
  intended, not a bug.
- **Group B (12)** — s51 features in flight, probe-guarded: PASS = s51
  signature, PENDING = pre-s51 baseline, FAIL = neither.

## @ 92e39be: 36 PASS / 1 FAIL / 8 PENDING

**A1b is a real red.** Data panel open => shift-click *replaces* instead of
extending. `handleMapElementClick`'s `editorPanel === 'data'` branch calls
`focusDataTarget`; the focused row fires Form's `onSelectAccount`, i.e. the
single-key `setSelectedMapTargetKey`. Spec marks it `test.fail()` — when fixed,
delete the annotation, not the test.

## Driver traps

- `g[aria-label="Accounts"]` = 2 nodes (live + print copy) — `.first()`.
- Selecting an account moves its `<g>` to the END of the group: `nth(1)`
  retargets a *different* account. Address by `[data-account-id]`.
- Account bboxes overlap; drive `.map-account-body-hit`, not coords.
- `DRAG_THRESHOLD_PX` is 4 (hypot) — a +3/+3 wobble is 4.24px and drags.
- Toolbar "+Add" is named `Add`; map-chrome "Add text note" only arms placement.
- Rotate transforms land on inner elements — scan `[transform]` DOM-wide.
- `getByRole` names match by substring: bare `Details` hits 4 nodes.
