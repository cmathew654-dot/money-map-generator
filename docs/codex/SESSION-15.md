# SESSION-15 — Account shapes: smart default, frictionless override

Read `AGENTS.md` first. Owner-approved: accounts may render as one of four
shapes while the creation flow stays zero-decision. Shape is a PROPERTY
with a smart default, never a question. DO NOT PUSH.

## The palette (exactly four — no more)

- `drum` — the existing cylinder (pooled/liquid money). Default for every
  bucket except `note`.
- `card` — the existing rounded note-card look, generalized so ANY account
  can use it with its bucket's stroke/tint/tag colors. Default for the
  `note` bucket.
- `rect` — sharp-cornered rectangle (radius 0–2), same 2.5px line weight,
  bucket tint fill, tag/title/value/caption hierarchy as the card.
- `pill` — stadium shape (fully rounded short ends), same hierarchy.

## Model

- `src/model/types.ts`: `shape?: 'drum' | 'card' | 'rect' | 'pill'` on
  `Account`. Absent = derived default (bucket `note` → card, else drum) —
  old books and all existing samples render EXACTLY as today.
- `src/model/book.ts`: validate the enum when present; legacy books
  without it stay valid.

## Render + layout

- `src/render/MapSvg.tsx`: generalize Cylinder/NoteCard into a shape-aware
  account renderer. All four shapes keep: tag in the top zone, title,
  dominant value, roman caption, position rows, in-place editing targets,
  drag, resize handle, hover halo, focus ring. Sub-account inset rendering
  stays as it is today regardless of parent shape (state this in the
  report; do not invent per-shape insets).
- `src/layout/layout.ts`: placement boxes are shape-independent (same
  x/y/w/h math). The SESSION-13 outline parameterization gains per-shape
  outlines (rect/card/pill edges and corners) so arrows anchor on the
  facing boundary of whatever shape the account wears. capRy only applies
  to drums.

## The two override surfaces (no new steps, no modals)

- Form (wizard Accounts step + full form, shared sections): each account
  card gets a compact icon-only segmented control — four small shape
  glyphs (inline SVG, no new deps), current shape selected,
  `aria-label`s naming each shape. One optional click; ignorable.
- Map: the hover/focus chrome gains a small shape-flip button beside the
  resize handle (screen-only, never print/PNG). Clicking cycles
  drum → card → rect → pill → drum and commits through the normal
  `onChange` path.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Tests: default derivation per bucket; book round-trip with shapes +
  legacy book; arrow anchoring lands on the facing boundary for each
  shape (reuse the cardinal-placement test pattern); shape-cycle helper
  is pure and tested.
- Screenshot verification at default zoom: (1) generated samples pixel-
  faithful to today (no shape set anywhere); (2) one account flipped to
  each of card/rect/pill — hierarchy legible, arrows attached on the new
  outline, teal/contrast unaffected; (3) the segmented control in the
  Accounts step; (4) print emulation of a flipped state — shapes render,
  zero chrome.
- File map: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`, `src/form/Form.tsx`,
  `src/styles/app.css`, `tests/book.test.ts`, `tests/layout.test.ts`,
  `tests/overrides.test.ts` (only if arrow-anchor tests live there),
  `tests/shapes.test.ts` (new, optional — prefer existing files if
  natural).
- Commit in logical steps; end with `docs/codex/SESSION-15-REPORT.md`;
  budget ≈ 350–550 changed lines.
