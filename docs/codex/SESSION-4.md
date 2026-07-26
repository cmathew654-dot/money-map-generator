# SESSION-4 — Owner dogfood round 1: form overhaul, cap-text discipline, arrows in bounds

Read `AGENTS.md` first. The owner reviewed the working app and found three
problems. All three are in scope; nothing else is. Protected files from
earlier sessions may be edited where this spec requires it.

## P1 — The form is cramped and overwhelming (biggest item)

Today: a ~400px pane with four-column rows. Inputs visibly truncate
("Jordan & Dana Whitfi…", "Social Secu…"), and every field of every account
is always expanded — a wall of controls.

Restructure `src/form/Form.tsx` + `src/styles/app.css`:

- Form pane width → 480px. Every input gets `min-width: 0` and fills its
  grid cell; input font-size 14px. Nothing may visibly truncate at typical
  content lengths (a 28-char label must be fully readable).
- **Row shapes become stacked, not four-across:**
  - Client: title input full-width on its own row; year + variant share the
    next row; post-note label full-width when visible.
  - Income source: row 1 = label input (full width) + remove ×; row 2 =
    amount (1fr) · period (fixed ~72px) · qualifier (1fr).
  - Footnote: row 1 = label + remove ×; row 2 = gross · net.
  - Positions / sub-accounts inside an account: same two-line pattern.
- **Accounts collapse.** Each account card becomes a `<details>` with a
  `<summary>` showing: a small square swatch in the bucket's stroke color,
  the account label (or "Untitled account"), and the formatted value
  right-aligned (blank shows `~$ ______`). Default: collapsed. A newly added
  account mounts expanded (set `open` imperatively once on first mount via a
  ref — do NOT pass `open` as a controlled prop that fights user toggles).
  The remove-account button lives inside the expanded body.
  Inside the body, fields stack: bucket select full row → label full row →
  value full row → caption full row → In refill chain → positions list →
  sub-accounts list.
- Keep the styling language: hairline borders, uppercase tracked section
  labels, the bucket-color left edge on the account card. The summary row
  must be keyboard-accessible (native details/summary is fine).

## P2 — Text overlaps the cylinder caps

On shorter drums (Roth IRA, Donor-Advised Fund, Cash-Value Life Insurance,
Trust Account) the title — and for two-line titles the first line — grazes
or crosses the cap ellipse stroke.

Rule, enforced in `src/render/MapSvg.tsx` AND mirrored in
`src/layout/layout.ts` height math: only the bucket TAG renders inside the
cap ellipse (vertically centered on the cap center). ALL other content
(title, caption, position rows, value, sub-accounts) begins below the cap:
first title baseline ≥ drumTop + 2·capRy + 14. Account height calculations
must include that offset so drums grow instead of squeezing content up.
Verify by screenshot at default zoom for every sample client: no glyph may
touch the cap ellipse stroke on any drum, including inset sub-account drums.

## P3 — Waterfall arcs escape the page / masthead band

Root-cause fix in `src/layout/layout.ts`:

- **Center column order changes to: shortTerm accounts first (top, y=150),
  then cash accounts, then note cards.** With short-term on top, every
  waterfall hop (taxDeferred top → afterTax top → shortTerm top) connects
  adjacent columns with no drum in between.
- Arc apex (all bezier control/end points): clamp so no point of any arrow
  path has y < 128 — i.e. everything stays below the masthead rule at
  y=118 with margin. Clearance above the connected drum tops: ~30.
- Arrowheads still land ON the target cap's clear left shoulder
  (`x + w·0.35, y − 4`) as established in SESSION-1B/3B.
- The asNeeded arrow now originates from the short-term drum at its new top
  position — re-verify it clears the cash drum below it and its chip clears
  all accounts (the SESSION-3B clearance test must still pass; update the
  chip anchor if the new geometry moves it).

Tests to add/update in `tests/layout.test.ts`:
- Center-column ordering: for a client with both, shortTerm.y < cash.y.
- Parse every arrow `d` string's coordinate pairs: min y ≥ 128 for
  waterfall arrows (and no NaN).
- Existing overlap/clearance/waterfall-order tests keep passing (update
  coordinates they pin only where this spec moves them).

## Gates & report

- `npm run build` + `npm test` green, outputs quoted.
- Screenshot-verify at default zoom: all four book clients + one print-media
  capture. Confirm each P explicitly against its rule. Describe method.
- Commit in logical steps (layout → render → form → styles → tests).
- Write `docs/codex/SESSION-4-REPORT.md`. Budget ≈ 400–650 changed lines
  (the form restructure dominates). Overrun = disclose, don't compress.
