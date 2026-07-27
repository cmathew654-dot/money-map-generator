# SESSION-11 — In-place map editing + as-needed arrow re-anchor

Read `AGENTS.md` first. Owner-approved scope from live dogfooding. Two
workstreams. DO NOT PUSH.

## P1 — The as-needed arrow visibly leaves the bucket

Owner finding: the draw line starts at the short-term drum's bottom-LEFT
bbox corner at a glancing angle, so it reads as hanging off the chip, not
drawn from the bucket. In `src/layout/layout.ts`:

- The path must START on the drum's lower silhouette (the bottom arc of the
  cylinder body), left of center — between roughly 25% and 45% of the drum
  width — with its initial direction pointing away from the drum (down and
  toward the need card), not grazing along the edge.
- The Cash drum usually sits directly below with only a 16–28 unit gap.
  The current clearance test checks the straight chord start→end but the
  DRAWN path is a quadratic bulging 40 below the chord — a latent mismatch.
  Fix the class: test obstacle clearance by sampling the actual quadratic
  (e.g. 32 samples), not the chord. Choose control point / start so the
  sampled curve clears all obstacles (income panel, need card, every other
  account, chip box logic unchanged).
- The chip must sit at least 60 path-units from the start so an unbroken
  run of dashes visibly connects drum to line before the chip interrupts.
- Tests (`tests/layout.test.ts`): start point lies on the drum's bottom
  arc in the 25–45% width band for all samples that have the arrow;
  sampled quadratic intersects no placed obstacle; chip distance ≥ 60.
  Update any coordinate-pinning assertions; never weaken rule assertions.

## P2 — Click a number on the map, edit it in place

The everyday fix: an advisor spots a wrong number ON THE MAP and corrects
it there, no form round-trip.

- Editable in place: account VALUE, account LABEL, each income source
  amount, the monthly need amount, the as-needed draw amount. Nothing else
  yet (captions, tags, footnotes stay form-only).
- `src/render/MapSvg.tsx`: extend the existing `MapElementTarget` /
  `onElementClick` wiring with edit targets for those texts. Clicking one
  of those texts requests an EDIT; clicking anywhere else on a drum/panel
  keeps the existing navigate behavior. Screen-only affordance on hover
  (e.g. faint underline + text cursor) — print/PNG contain none of it.
- New file `src/ui/MapTextEditor.tsx`: an absolutely-positioned HTML input
  overlaid on the preview pane, placed over the clicked SVG text via its
  screen rect, pre-filled with the raw value. Enter or blur commits,
  Escape cancels. Money fields go through the SAME parse path as the form
  (`parseMoneyInput`, so `85k` works); empty commits to null and renders
  `~$ ______` — never 0. Label edits commit trimmed strings; empty label
  falls back to the existing "unnamed" rendering.
- `src/App.tsx` stays the single state owner: it holds the active edit
  target state and routes commits through the exact same data-update
  paths the form uses (one model, form and map stay in sync for free).
- The overlay lives OUTSIDE the `<svg>` — the artifact stays a still
  document; print and PNG export are pixel-unaffected by edit mode.
- Tests: new `tests/mapedit.test.ts` for the commit logic (money parse →
  value, empty → null, label trim/fallback, cancel leaves model
  untouched); keep them model-level pure functions — extract the commit
  logic so it is testable without DOM.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Screenshot verification at default zoom: (1) Whitfield, Calloway,
  Venkat — the draw line now visibly leaves the bucket's underside and
  clears the Cash drum; (2) an active in-place edit over the Whitfield
  IRA value showing the overlay input; (3) commit `85k` → map shows
  $85,000 live; (4) print emulation — artifact identical, no editor
  artifacts.
- File map: `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/App.tsx`, `src/ui/MapTextEditor.tsx` (new), `src/styles/app.css`,
  `tests/layout.test.ts`, `tests/mapedit.test.ts` (new).
- Commit in logical steps; end with `docs/codex/SESSION-11-REPORT.md`;
  budget ≈ 300–480 changed lines.
