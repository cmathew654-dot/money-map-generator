# SESSION-33 — Note text size, larger defaults, editable masthead

Read `AGENTS.md` first. Dogfood round 5, owner rulings applied. The
"Monthly Income as Needed" chip is explicitly OUT of scope (owner:
keep as is). DO NOT PUSH.

## P1 — Note block font size

- `MapNote` gains `fs?: number`, rendered clamped 9–40 (absent =
  `TYPE.note` as today). book.ts validation: optional finite number.
  Duplicate-client spread preserves it (pin).
- The note in-place editor (noteText target) gains the same A−/A+
  stepper chrome as other map text; each press previews live and
  commits with the edit as one step. Steppers write `fs` on the note
  record (this is DATA, not a layout override — reset arrangement
  does NOT clear it).
- Layout wraps the note via `fitLines` at the note's effective fs
  (line advance scales proportionally); the solid-background card
  (S30) inflates around the resulting block as today.

## P2 — Modest global type bump (owner: default map text larger)

- tokens.ts TYPE, +1 on the content roles:
  accountTitle 18→19 · caption 13.5→14.5 · value 24→25 ·
  subValue 16→17 · row 13.5→14.5 · accountTag 11.5→12.5 ·
  needLabel 14→15 · needValue 30 (keep) · footnote 14→15 ·
  arrowLabel 13.5→14.5 · note (TYPE.note) +1 · income defaults used
  by S29 fixed roles: header 16.5→17.5, row 14→15, total 16→17 ·
  legend label 11→12. Masthead 30 and mastheadLabel stay.
- Grow-to-fit absorbs everything (S22 contract). Existing pinned
  metrics in tests update HONESTLY; the artboard-fit invariants for
  all three samples must still hold (`contentBounds` inside
  ARTBOARD) — if a sample would overflow, say so in the report
  rather than shrinking anything silently.
- S29 fallbacks (`fixedTextFs` defaults) must read the new TYPE
  values, not stale literals.

## P3 — Editable masthead label (owner ruling)

- `MoneyMapData.client` gains `mastheadLabel?: string`; absent =
  "Money Map" (legacy books unchanged). validateClient accepts an
  optional string.
- The masthead renders `<mastheadLabel> <year>` uppercase for annual
  and composes with the existing `mastheadPeriodLabel` behavior for
  mid-year updates ("<LABEL> — APRIL UPDATE").
- The masthead brand text becomes an in-place edit target on the map
  (full text edit, existing editor): commit trims; empty commit
  restores the default "Money Map". No form field in v1 (map-first;
  state as limitation).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — book: note `fs` validation + duplicate preservation;
  `mastheadLabel` optional round-trip. layout: note wraps at its fs
  and the block grows; samples' contentBounds within artboard at the
  new TYPE scale. mapedit/format: masthead target commit (custom
  label, empty → default), note stepper clamp 9/40, masthead
  composition for annual + mid-year with a custom label.
- Screenshots: (1) a note stepped to ~20 — wraps wider, solid-bg
  card grows, prints; (2) the Whitfield sample at the new default
  scale — visibly larger text, nothing clipped, one page in print
  emulation; (3) masthead edited to a custom name, uppercase on map
  and in print; empty edit restores MONEY MAP.
- Redirect all browser output to files under C:\tmp; any free
  preview port.
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/tokens.ts`,
  `src/render/MapSvg.tsx`, `src/ui/MapTextEditor.tsx`,
  `src/App.tsx` (only if editor wiring requires it — keep minimal),
  `tests/book.test.ts`, `tests/layout.test.ts`,
  `tests/mapedit.test.ts`, `tests/format.test.ts` (only if the
  masthead helper lives in format.ts). Budget ≈ 250–420 changed
  lines.
- Commit in logical steps; end with `docs/codex/SESSION-33-REPORT.md`.
