# SESSION-28 — Flows are modular: kill the refill chain

Read `AGENTS.md` first. Owner decision, first principles, verbatim
intent: "we have no idea what shape a client's money map takes — could
be all sorts of flows, not many at all, some might be to refill, some
might be to fund a kid's 529… I don't like the idea whatsoever of
refill chain. Think how modular everything else is — arrows and flows
should be the same way, modular, frictionless." This session removes
the auto-waterfall CONCEPT and makes every arrow a first-class,
deletable, meaningful object. Also: scroll-to-zoom. DO NOT PUSH.

## P1 — The refill chain dies

- Remove the "In refill chain" checkbox and its help text from the
  account card (Form.tsx). Remove the WATERFALL_ORDER auto-chain from
  layout (`waterfallArrows`, kind `'waterfall'` generation). The
  `inWaterfall` field remains ACCEPTED by validation (legacy books
  load) but is ignored, no longer written to new accounts, and dropped
  from `blankAccountFor`/presets.
- Existing S13 waterfall test pins are updated honestly: the
  cap-to-cap "generated waterfall character" contract now applies to
  MIGRATED flow arrows (below), not to auto-generation.

## P2 — Migration: today's maps keep their look

- One-shot, deterministic, at client load (a pure `migrateClient(data)`
  applied after validation in `parseBook` AND to the localStorage boot
  path): if any account has `inWaterfall === true`, compute the arrows
  the old chain would have drawn (same fixed order, same sort) and
  materialize each as a flow record (P3) with style `'dotted'`, no
  label, preserving any existing `arrow:waterfall:<sourceId>` override
  under the new record's key; then set every `inWaterfall` to false.
  Running migration twice is a no-op. Sample clients are updated in
  source to carry explicit flow records instead of inWaterfall flags.

## P3 — Flow records: style + label ("custom arrows" grow up)

- `CustomArrow` gains `style: 'dotted' | 'dashed' | 'solid'` (default
  `'dotted'` on creation) and `label?: string` (free text — amounts
  like "$2,000/mo" welcome). Validation accepts absent style on legacy
  S24 records (treat as `'solid'`, their shipped look).
- Render: dotted/dashed reuse the existing dash grammars; solid as
  today. A label renders along the arrow midpoint in the arrowLabel
  style (like the as-needed label text, no chip box), moves with the
  arrow, prints/PNGs.
- Frictionless editing on hover of a flow arrow: the existing three
  geometry handles and × chip, PLUS a small style-cycle button
  (dot→dash→solid) and a label affordance — clicking the label (or an
  "aa" chip when unlabeled) opens the in-place text editor on it.
  Every mutation is one undoable commit.
- Creation UX unchanged (S24 connect handle), but new arrows default
  to `'dotted'` and can be immediately restyled/labeled in place.

## P4 — Auto arrows become deletable (max freedom)

- `MoneyMapData` gains `hiddenArrows?: ('income' | 'asNeeded')[]`.
  The income→need and draw-as-needed arrows still auto-generate
  (they carry the map's income/need arithmetic) but now show the ×
  chip on hover like flow arrows; deleting adds their key to
  `hiddenArrows` (one commit, undoable). A hidden auto arrow's chip/
  label disappears with it. Legacy books: absent field = both shown.
- Re-enabling: undo, or Reset ▾ gains a "Restore generated arrows"
  item visible ONLY when `hiddenArrows` is non-empty (clears the
  field; one commit).

## P5 — Legend tells the truth

- The legend derives from what is VISIBLE on the page: "Income" and
  "Draw as needed" entries only when those auto arrows are shown;
  the "Refills" entry is GONE (the concept no longer exists). Flow
  arrows get no legend entries — their labels are their explanation.
  A map with no visible arrows renders no legend.

## P6 — Scroll to zoom

- Ctrl/Cmd + wheel (and trackpad pinch, which browsers deliver as
  ctrl+wheel) zooms the map in the S25 range/steps, CENTERED ON THE
  CURSOR position (adjust scroll offsets so the point under the
  pointer stays put). Plain wheel keeps scrolling/panning. The zoom
  cluster readout stays in sync. Screen-only, as before.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — book: migration determinism (twice = once), chain→records
  correctness for a 3-account inWaterfall fixture incl. override key
  transfer, legacy style-absent → 'solid', hiddenArrows validation;
  layout: no 'waterfall' kind generated from inWaterfall flags,
  migrated dotted flows keep cap-to-cap anchors (updated S13 pins),
  hidden income/asNeeded arrows absent from output, legend inputs
  reflect visibility; mapedit: style cycle pure helper, label
  edit commit, auto-arrow delete → hiddenArrows, restore clears.
- Screenshot verification: (1) legacy book with inWaterfall flags
  loads — map looks IDENTICAL (dotted arcs preserved), checkbox gone
  from the form; (2) a flow arrow restyled to solid and labeled
  "$2,000/mo — funds 529" — label rides the arrow, prints; (3) income
  arrow deleted — gone incl. legend entry; Restore generated arrows
  brings it back; (4) ctrl+wheel zoom at a drum — that drum stays
  under the cursor; (5) print emulation — flows + labels, zero chrome,
  truthful legend.
- Browser verification MUST redirect all browser stdout/stderr to
  files under C:\tmp — nothing prints to the console.
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/model/samples.ts`, `src/layout/layout.ts`,
  `src/render/MapSvg.tsx`, `src/render/mapInteraction.ts`,
  `src/ui/MapTextEditor.tsx` (label target), `src/form/Form.tsx`,
  `src/App.tsx` (wheel zoom + restore item, minimal),
  `src/styles/app.css`, `tests/book.test.ts`, `tests/layout.test.ts`,
  `tests/mapedit.test.ts`, `tests/overrides.test.ts`. Budget ≈
  550–750 changed lines; split a 28B if the interaction polish runs
  long.
- Commit in logical steps; end with `docs/codex/SESSION-28-REPORT.md`.
