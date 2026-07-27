# SESSION-9 — Design-crit P1/P2: the artifact — composition, drums, color, legend

Read `AGENTS.md` first. Second crit-remediation session. This one touches
the map itself — the highest-stakes surface. DO NOT PUSH.

## P1 — Map-first layout

The artifact is the hero but gets ~half the viewport. In `App.tsx` /
`app.css`: form pane narrows to 420px fixed (both modes must remain
comfortable — verify the wizard and the account cards at 420); the map pane
takes everything else. No other structural changes.

## P2 — Composition centering (deterministic)

Sparse maps pool right/top and leave a dead bottom third. In
`src/layout/layout.ts`, add a final pure pass: compute the bounding box of
all placed content (accounts, income, need, arrows' extremes, as-needed
chip), then translate EVERYTHING uniformly so the content mass is centered
horizontally between the page margins (48) and vertically between the
masthead rule (y=118) and the footnote baseline area (footnotes keep their
fixed slot; treat y≈900 as the lower bound when footnotes exist, 950
otherwise). Clamp so nothing crosses the masthead rule or margins. All
existing clearance/cap/obstacle tests must still pass — update only
coordinate-pinning assertions, never rule assertions. Add a test: for
blankClient() and SAMPLE_VENKAT, the content bbox's left/right margins are
equal within 24 units, and vertical centering within 40.

## P3 — Footnote anchoring

Footnotes currently float in whitespace. Render a short centered hairline
rule (~220 units wide, HAIRLINE) 18 above the first footnote line, and
center the footnote block under the CONTENT bbox (post-centering), not the
raw artboard. Skip entirely when there are no footnotes.

## P4 — Flow legend on the artifact

Bottom-LEFT corner of the map (inside the page frame, aligned with the
left margin, same baseline zone as footnotes): a quiet single-line legend
showing the three stroke samples with 11px Public Sans labels in MUTED:
`●●●▸ Refills   ——▸ Income   – –▸ Draw as needed`
(render actual 24-unit SVG line samples with the real dash patterns and a
small arrowhead, NOT unicode). Only show entries for arrow kinds present on
the map. Print and PNG include it — it is part of the document.

## P5 — Income arrow becomes solid

To make the legend honest, the income arrow (income panel → need card)
changes from dashed to SOLID 2px FLOW_GREEN with the standard arrowhead.
The asNeeded arrow stays dashed `7 6`. Waterfall stays dotted beads. Update
any test pinning the income dash.

## P6 — The drums commit to flat

Kill the pseudo-3D ambiguity without losing the bucket silhouette:
- Cap ellipse: keep the geometry (silhouette is the grammar) but the cap
  tint FLATTENS to the body tint (one fill per drum). The cap's lower arc
  remains as an interior line — the drum reads as a drawn diagram glyph,
  one flat fill + consistent 2.5px line work.
- The tag stays inside the cap zone, in the bucket's tagColor (contrast
  contract now checks tag on TINT — update `tests/contrast.test.ts` to
  assert tag-on-tint only, since capTint dies; remove capTint from tokens
  and all uses).
- In-drum hierarchy pass: VALUE becomes the dominant element — Literata 600
  size 24 (up from 21), INK. Title stays 16. Caption: 12.5 Public Sans
  ROMAN (italic dies) in MUTED. Tag: 10.5 → stays, but tracked slightly
  tighter. Sub-account inset drums get the same flattening.
- Position rows unchanged.

## P7 — Tax-Preferred leaves the blue family → teal

In `tokens.ts`: taxPreferred becomes a teal family (stroke ≈ `#2e8577`,
tint a pale teal ≈ `#eef7f5`, tagColor deep enough to pass the 4.5:1
contract — pick exact values and PROVE them via the contrast test). Roth /
CVLI drums must remain clearly distinct from taxDeferred blue in grayscale
too (teal vs blue differ in darkness — verify visually in a grayscale
screenshot and say so).

## Gates & report

- `npm run build` + `npm test` green (quote outputs; contrast test must
  cover the new teal + tag-on-tint).
- Screenshot verification at default zoom, ALL FOUR book clients + blank +
  print media + one grayscale capture (CSS filter or devtools emulation):
  centering visibly improved on sparse maps, footnote anchored, legend
  present and correct per map, drums flat with dominant values, teal
  distinct. Describe each.
- Commit in logical steps; `docs/codex/SESSION-9-REPORT.md`; budget
  ≈ 400–650 changed lines.
