# SESSION-8 — Design-crit P0: accessibility failures + chrome credibility

Read `AGENTS.md` first. First of three crit-remediation sessions. DO NOT
PUSH — orchestrator reviews then deploys.

## P1 — Contrast failures, fixed by CONTRACT

Measured WCAG failures: afterTax tag `#b98a1e` on `#f7ecd2` = 2.66:1;
taxPreferred tag `#6fa7d4` on `#e9f2fa` = 2.27:1 (requirement 4.5:1).

- Adjust ONLY the failing foregrounds in `src/render/tokens.ts` (deepen the
  hue family — gold moves toward `#8a6a15`-ish, light blue toward
  `#3d7fae`-ish; exact values yours, hue family preserved, and the bucket
  STROKE colors may stay as-is unless they also fail as tag foregrounds —
  tags render in the `stroke` color today, so if you change tag color,
  introduce a separate `tagColor` field per bucket rather than mutating
  stroke).
- Add `tests/contrast.test.ts`: implement the WCAG relative-luminance ratio
  in the test (pure math), assert ≥ 4.5:1 for EVERY bucket's tag color on
  its capTint AND on its tint, plus MUTED on PAPER, FLOW_GREEN on PAPER,
  NEED_RED on `#faeae7`. This contract must protect all future palettes.

## P2 — Kill window.confirm / window.alert

New `src/ui/Dialog.tsx` (one file, native `<dialog>` element, styled to the
identity: paper, hairline border, Literata title, quiet/primary button
pair). Used for: Delete client ("Delete <name>? This cannot be undone." —
confirm button is the ONLY red-text button in the app) and Load-book errors
(single OK). New `src/ui/Toast.tsx`: bottom-right quiet toast strip,
`aria-live="polite"`, auto-dismiss ~3.5s, used for "Book saved", "PNG
exported", "Book loaded". No libraries; App owns a small toast state array.
Add both files to the file map (report the LOC).

## P3 — A mark: favicon + wordmark

- `public/favicon.svg`: a minimal ink drum silhouette (ellipse-capped
  cylinder, 2px-equivalent stroke) with a single FLOW_GREEN dotted arc
  entering from the upper right ending in a small filled triangle. Must
  read at 16px. Reference it from `index.html` (`<link rel="icon">`).
- Header wordmark becomes glyph + text: the same drum glyph at ~18px
  (inline SVG component `src/ui/Mark.tsx`, reused by favicon design — the
  favicon file itself stays a standalone static SVG) beside `Money Map` in
  Literata 600.

## P4 — Visible keyboard focus on map targets

Interactive SVG groups (`[role="button"]`) get a clearly visible
`:focus-visible` treatment: a 2px FLOW_GREEN outline ring offset ~3px
(SVG `outline` works in modern Chromium/Firefox/Safari — if unreliable in
your check, render an explicit focus rect in `MapSvg` when the group has
focus, driven by `onFocus/onBlur`). Tab must walk the drums in document
order with the ring plainly visible; describe your verification.

## P5 — Header information architecture

Restructure the header into grouped zones with hierarchy (styles in
`app.css`, structure in `App.tsx`):

```
[glyph Money Map]  [client select] [New] [Duplicate] [Delete]   …spacer…   [Save book] [Load book] │ [Print] [Export PNG]
```

- Left zone: wordmark, then client cluster; New/Duplicate quiet buttons;
  Delete becomes quiet RED-TEXT (no fill) and opens the new Dialog.
- Right zone: Save/Load stay quiet; a hairline vertical divider; then
  Print and Export PNG as the ONLY primary-treatment buttons (ink fill,
  paper text — the payoff actions).
- One primary treatment class, reused by the wizard's existing Next button
  so the app has exactly one primary-button style.

## Gates & report

- `npm run build` + `npm test` green (quote; contrast test must be in the
  run). Browser verification, describe: delete flow uses the styled dialog;
  save/export/load raise toasts; favicon renders in the tab; Tab shows
  focus rings on drums; header reads as three groups with Print/Export
  primary.
- Commit in logical steps; `docs/codex/SESSION-8-REPORT.md`; budget
  ≈ 300–480 changed lines. Do not touch layout.ts or the artifact rendering
  beyond the tag-color token wiring.
