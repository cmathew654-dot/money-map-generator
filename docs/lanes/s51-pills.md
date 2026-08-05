# s51 T-PILLS — docked action bench

Four floating map-chrome pills became one docked group, bottom-right.

## Shape

`.map-chrome > .action-bench` (`role="group"`, "Map actions") holds:
`[Tidy map + broom glyph] | [+ Text note] [+ Flow] | [+ Account]`, with two
1px/18px hairline dividers. Surface `#ffffff`, 1px `#dde1dc`, 10px radius,
4px padding. Secondary buttons: transparent, `#1c2422`, 12px/600 Public Sans,
30px tall, 6px radius, `#f4f6f2` hover. `+ Account` is the single primary:
filled `#1e7a4a`, white text (5.3:1), `brightness(.92)` hover.

## How the old pill look loses

`app.css` is frozen. Its pill rules (`.map-chrome > button`,
`.shape-quick-add > button`, 0,1,1) are outranked by `pills.css`
(`.map-chrome .action-bench > button`, 0,2,1) — no app.css edit needed. The
new `.action-bench` wrapper also stops `.map-chrome > button` matching the
first three buttons at all.

`.map-chrome` itself keeps its class, position and media query, so
`chrome-layout.spec.ts` (`.map-chrome button`) and `reflow.spec.ts` still hold.

## Contract preserved

Every label, `aria-label`, `aria-pressed`, `title`, `disabled` and `onClick`
is byte-identical to 677d0db. The broom is an `aria-hidden`, `focusable=false`
inline SVG, so accessible names are unchanged (gate11 references intact).

## Verification

- `tsc --noEmit` clean; vitest 737/737.
- `tests/e2e/s51-pills-visual.spec.ts` 3/3 (chromium-1440x900), baseline
  `pills-bench-chromium-1440x900-win32.png` committed.
- Standalone probe: all 4 bench buttons + 3 zoom buttons within viewport and
  hit-testable at centre; bench fits 390px (351px wide, 16px gutters).

## Known follow-up

`visual.spec.ts` full-page baselines still show the old pills and must be
re-blessed by whoever owns that file — out of this lane's frozen scope.
