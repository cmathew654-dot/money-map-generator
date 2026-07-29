# SESSION-37 — Seamless in-place editing + the after-tax line fixed

Read `AGENTS.md` first. Owner found real defects and the editor
overlay is off current design practice (references: the in-place
editor pattern — edited text looks IDENTICAL to displayed text;
Figma-style compact floating toolbar near the text, never covering
it). DO NOT PUSH.

## P1 — The After-Tax line (and every line like it)

- BUG: the "After-Tax Income" label renders at fixed
  `TYPE.incomeTotalLabel` (MapSvg ~:491) — the `income:total` size
  role scales only the amount, so A+ visibly does nothing to the
  words. FIX: the label scales proportionally with the total role
  (label = totalFs × its current default ratio), like income rows
  already do. Audit the other composite lines for the same miss
  (need label/value are separate roles — fine; income header, rows
  — verify).
- BUG: label texts without handlers SWALLOW clicks, so only the gap
  between words and amount reaches the S34 full-line hit rect. FIX:
  sweep EVERY editable line (income header/rows/total, need
  label/value, fine print, masthead, notes): any text element on
  the line either carries the same editableTextProps as its target
  or gets `pointerEvents: none` so the hit rect wins. Clicking
  ANYWHERE on the line — words, number, or gap — opens the editor.
- The A+ disabled state must only occur at the true 40 clamp (with
  the label now scaling, hitting max is visible and sensible).

## P2 — Seamless editor (visual continuity)

- The in-place input renders with the SAME font family, size,
  weight, color, and alignment as the SVG text it edits, positioned
  exactly over it (account for current zoom scale — the existing
  rect math already does). Transparent background, NO border box;
  the only chrome is the caret, a subtle 1px underline or faint
  focus ring (existing green, hairline weight), and selection
  highlight. The underlying SVG text hides while its editor is open
  (no double image).
- The A−/A+ controls move OUT of the input into a compact floating
  PILL (rounded, paper background, hairline border, subtle shadow)
  positioned just ABOVE the text being edited, horizontally
  centered; flip BELOW when within ~48px of the map top. The pill
  never overlaps the text being edited. Size-only targets show the
  pill alone (no input). Pointer-down on the pill must not blur the
  input (existing preventDefault pattern).
- Interaction semantics unchanged: Enter commits, Escape reverts
  (noteText Escape-commits stays), blur commits, one undo step,
  live preview.
- Hover affordance, consistently: every editable map text shows
  `cursor: text` and a subtle hover underline (or the existing
  halo) so editability is discoverable without instruction.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — mapedit: the after-tax label ratio follows the total fs
  (pin at default and at 30); every editable-line text node either
  has a click handler or pointerEvents none (walk the noninteractive
  vs interactive render trees); pill-position helper (above vs
  flipped below at top edge) pure and pinned; editor style parity
  helper (font/size/weight for each target kind) pure and pinned.
- Screenshot verification: (1) click directly on the WORDS
  "After-Tax Income" — editor opens; A+ twice — words AND amount
  visibly larger; (2) editing an account title — the editing text
  looks identical to the rendered title (side-by-side before/during
  crops), no box, pill floating above; (3) a target near the map
  top — pill flips below; (4) hover an editable line — underline +
  text cursor; (5) print emulation — zero chrome, no hidden-text
  artifacts.
- Redirect all browser output to files under C:\tmp; any free port.
- File map — touch: `src/render/MapSvg.tsx`,
  `src/ui/MapTextEditor.tsx`, `src/styles/app.css`,
  `src/App.tsx` (only if editor wiring shifts, minimal),
  `tests/mapedit.test.ts`. Budget ≈ 300–450 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-37-REPORT.md`.
