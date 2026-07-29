# SESSION-38 — Vertical rhythm: proportional leading and role gaps

Read `AGENTS.md` first. Owner: default map text is vertically
condensed; applied typographic rules (researched): small text
line-height 1.4–1.6; heading ~1.2 is fine; spacing between distinct
text blocks proportional (~line-height ÷ 1.5), never a fixed pixel
gap. DO NOT PUSH.

## P1 — Leading and gaps go proportional (tokens + layout + render)

- LEADING tokens: caption, row, sub-text → 1.45 × their font size
  (title stays ~1.3; values single-line unchanged). All consumers
  (accountHeight, baselines, render) read the token — no magic
  numbers.
- ROLE_GAP: the fixed 6-unit inter-role gap is replaced by a
  proportional rule: gap between adjacent roles = the larger
  neighbor's line height ÷ 1.5, floored at 8. Applies between
  tag→title, title→caption, caption→rows, rows→value, value→sub
  inset — in accounts AND sub-account insets. Cap→content and
  content→bottom clearances gain the same floor.
- Everything flows through the S22 grow-to-fit contract: shapes get
  taller, columns stack, samples' contentBounds stay inside the
  artboard (pin; report honestly if a sample would overflow).

## P2 — Position rows measured and padded

- Rows currently touch the drum edges at larger sizes. Side padding
  ≥ 20 each side; the row measures label + 16 gap + value at the
  EFFECTIVE row fs (shared measurement helper, same doctrine as
  S37B); when the pair exceeds inner width the LABEL wraps via
  fitLines (value never wraps) and the row advance grows.
- Layout owns the wrapped row lines (PlacedAccount data), render
  draws exactly them — no re-wrapping (S22 contract).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — layout: leading/gap table pins (caption leading = 1.45 ×
  fs; gap = max(8, lineHeight/1.5)) at default and enlarged sizes;
  row label wraps when label+gap+value exceeds inner width, value
  intact; row side padding respected at every fs; samples fit the
  artboard; sub-account inset obeys the same gap rule. Update prior
  spacing pins honestly.
- Screenshots: (1) the owner's exact case — Managed After-Tax Trust
  drum at defaults: title/caption/rows/value visibly separated,
  nothing touching edges; (2) same drum with rows at fs 18 — wraps
  instead of touching, drum grows; (3) all three samples at Fit —
  airier but one page in print emulation.
- Redirect all browser output to files under C:\tmp; any free port.
- File map — touch: `src/render/tokens.ts`, `src/layout/layout.ts`,
  `src/render/MapSvg.tsx`, `tests/layout.test.ts`,
  `tests/textfit.test.ts` (only if the shared helper lands there).
  Budget ≈ 250–400 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-38-REPORT.md`.
