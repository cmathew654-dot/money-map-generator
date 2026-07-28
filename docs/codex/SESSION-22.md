# SESSION-22 — Map text integrity: nothing clips, everything readable

Read `AGENTS.md` first. Dogfood round 3, first outside user. Their words:
"the circle cuts off the text" · "the text is too close together on the
map vertically" · "make text easier to read on money map (bigger
font??)" · "the font on the shapes should be more readable" · "text
should stay completely inside the shapes and either drop down or the
shape gets bigger." One session, one guarantee: **map text never
escapes or touches its shape — it wraps, and the shape grows.**
DO NOT PUSH.

## Root causes (verified in code — fix all three)

1. `wrap(text, max)` (`format.ts`) counts CHARACTERS, blind to glyph
   width. Literata caps/wide glyphs overflow a 24-char budget at 260px.
   A single overlong word is kept on one line (`|| !line`) — guaranteed
   overflow.
2. Layout and render disagree: `accountHeight` (`layout.ts`) wraps at
   fixed budgets (24/30) from BASE column width, while `wrapLengths`
   (`MapSvg.tsx`) scales budgets by `placed.w`. A user-narrowed drum
   wraps to MORE lines than the height was computed for → bottom clip.
3. Type scale is small for a presented page (accountTitle 16, caption
   12.5, rows 12.5 on a 1320-wide artboard) with tight leading (title
   20/16 ≈ 1.25, caption 15/12.5 = 1.2).

## P1 — Width-true text fitting, one source of truth

- New pure module `src/layout/textfit.ts`:
  - `textWidth(text: string, size: number): number` — approximate but
    CONSERVATIVE width via a per-character class table for Literata
    (narrow `iljtf.,'| `, wide `MWm@`, caps, digits, default; digits
    render tabular), scaled by `size`, times a safety factor ≥ 1.06.
    Overestimating slightly is correct; underestimating is the bug.
  - `fitLines(text: string, maxWidth: number, size: number): string[]`
    — greedy word wrap by MEASURED width; a single word wider than
    `maxWidth` is hard-broken mid-word (never overflows).
  - Pure, no DOM, unit-tested.
- `wrap()` in `format.ts` stays for any non-map callers but the MAP
  path (layout + render) must use `fitLines` exclusively. Delete
  `wrapLengths` from `MapSvg.tsx`.
- CONTRACT: `layoutMap` computes each account's line breaks with
  `fitLines` at the account's EFFECTIVE width (base or override `w` —
  the same width the renderer draws at) and exposes them on
  `PlacedAccount` (e.g. `titleLines: string[]`, `captionLines:
  string[]`). `MapSvg` renders exactly those lines — it never re-wraps.
  One computation, two consumers, no drift.
- Usable text width per shape = effective width minus shape-aware
  insets: drum side padding as today; hexagon minus its `hexagonInset`
  taper at text rows; pill minus end radii. Value/money lines never
  wrap (they fit today's widths; keep them single-line).
- Vertical guarantee: `accountHeight` derives from the SAME line
  arrays + new leading tokens (below), and bottom clearance respects
  the cap curve: last content baseline sits ≥ `capRy + 8` above the
  drum bottom (analogous clearance for card/hexagon/pill). Sub-account
  inset drums obey the same rules via the same functions.
- Rotation (S19) composes: fitting happens in local space pre-rotation;
  nothing special.

## P2 — Type scale + leading (tokens only)

- All map text sizes come from `TYPE` in `src/render/tokens.ts` — fold
  the stray numeric `fontSize={...}` literals in `MapSvg.tsx` (13, 14,
  12, 16, 12.5, 11.5, 11, 10.5) into named TYPE entries; `tokens.ts`
  stays the designer swap point.
- New scale (screen + print, same artboard):
  masthead 30 (keep) · mastheadLabel 13→14 · panelHeader 15→16.5 ·
  accountTitle 16→18 · accountTag 10.5→11.5 · caption 12.5→13.5 ·
  value 24 (keep) · subValue 15→16 · row 12.5→13.5 · needLabel 13→14 ·
  needValue 30 (keep) · footnote 13→14 · arrowLabel 12.5→13.5.
- New `LEADING` tokens beside `TYPE` (line height per text role), used
  by BOTH `accountHeight` and the renderer — the current magic 20/15
  line-steps die. Title ≥ 1.3 × size, caption/rows ≥ 1.35 × size, and
  ≥ 6px air between adjacent roles (tag→title, title→caption,
  caption→value, row→row). "Too close together vertically" must be
  visibly fixed on all three samples.
- Fixed artboard absorbs growth: shapes get taller, columns stack as
  they already do. Verify the three sample clients still fit the page;
  `contentBounds` stays inside `ARTBOARD` for all samples (test).

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- New `tests/textfit.test.ts`: textWidth monotone in length and size;
  caps wider than lowercase; fitLines respects maxWidth for every
  produced line (property-style over a word list); overlong single
  word hard-broken, every fragment ≤ maxWidth; empty/blank input → [].
- `tests/layout.test.ts` additions: for each sample client AND stress
  fixtures (a 60-char all-caps label, a 90-char caption, an account
  with override `w` at MIN width + long label), every line's
  `textWidth` ≤ its usable width; first baseline clears `capRy * 2 +
  CAP_CONTENT_GAP`; last baseline clears the bottom cap; account
  bottoms never exceed shape bounds; samples' `contentBounds` within
  artboard.
- Screenshot verification: (1) all three samples before/after at fit
  width — bigger, airier text, zero clipping; (2) the stress client —
  long label wraps INSIDE the drum, shape visibly taller; (3) a drum
  resized to MIN width with a long label — wraps, grows, no clip;
  (4) print emulation — one page, nothing cut.
- File map — create: `src/layout/textfit.ts`, `tests/textfit.test.ts`.
  Touch: `src/render/tokens.ts`, `src/layout/layout.ts`,
  `src/render/MapSvg.tsx`, `src/model/format.ts` (only if wrap()
  callers change), `tests/layout.test.ts`. Budget ≈ 350–550 changed
  lines. Existing pinned layout tests MAY need updating for the new
  heights — update them honestly, do not weaken invariants.
- Commit in logical steps; end with `docs/codex/SESSION-22-REPORT.md`.
