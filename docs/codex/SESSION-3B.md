# SESSION-3B — Print punch list (two items)

Read `AGENTS.md` first. Surgical fixes only; orchestrator screenshot review
of SESSION-3 found both. The PNG export path is CORRECT (arrowheads + fonts
verified) — do not touch `src/export/export.ts`.

## P1 — Arrowheads vanish in print (real defect)

Screen render shows all green arrowhead markers; the print rendering (print
media emulation AND `page.pdf`) shows none. Cause: `App.tsx` renders TWO
`MapSvg` instances (screen preview + print container). Both define the same
`<marker>` id; `marker-end="url(#…)"` resolves against the whole document to
the FIRST matching id — which sits inside the container that is
`display: none` under print media, and Chromium does not paint markers
referenced from a hidden subtree.

Fix: make marker ids unique per `MapSvg` instance — e.g. `React.useId()`
(sanitized for url() use) or an optional `idPrefix` prop, applied to every
`<marker>` definition and reference. This edit to `src/render/MapSvg.tsx` is
authorized (the SESSION-3 "do not touch" list is lifted for exactly this).

Verify: headless print-media emulation (or `--print-to-pdf`) of the built
app shows arrowheads on the income, as-needed, and both waterfall arrows.
State in the report exactly how you verified.

## P2 — As-needed chip grazes the note card (Calloway sample)

On `The Calloway Family`, the `Monthly Income as Needed` chip's lower-right
corner touches the `5-Year Installment Note` card's top-left corner. Fix in
`src/layout/layout.ts`: keep the chip seated on the line but ensure its box
clears every placed account box by ≥ 10px — nudge the label anchor along the
line toward its start (or raise it) until clear. Deterministic, no
randomness. Add a layout test: for SAMPLE_CALLOWAY, the as-needed `labelAt`
box (use the chip's approximate 260×34 extent) intersects no placed account.

## Gates & report

`npm run build` + `npm test` green, outputs quoted. Commit in logical steps.
Write `docs/codex/SESSION-3B-REPORT.md`. Budget ≈ 60–120 changed lines.
