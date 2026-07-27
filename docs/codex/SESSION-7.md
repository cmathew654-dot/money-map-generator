# SESSION-7 — Owner dogfood round 2: identity coherence + plain language + truly blank start

Read `AGENTS.md` first. Four owner findings from live dogfood. Copy changes
below are exact — implement verbatim.

## P1 — Unlabeled account shows two different identities

Form summary says "Untitled account" while the drum shows its bucket tag
("SHORT-TERM BUCKET"). Unify: in the account `<summary>` (and anywhere else
an account with a blank label is named, e.g. wizard), show the bucket's
display name instead, muted/italic, suffixed `· unnamed`:
`Short-Term Bucket · unnamed`. Bucket display names: Short-Term Bucket /
After-Tax / Tax-Deferred / Tax-Preferred / Charitable / Cash / Note.
"Untitled account" as a string dies entirely.

## P2 — New clients start truly blank

`blankClient()` currently seeds three unlabeled skeleton accounts and a
blank income row. Owner: presets are weird — every situation is different.
Change `blankClient()` to: NO accounts, NO income sources, all money fields
null (title/year empty as today). Update its tests. Empty states, quiet
single lines in both form modes:
- Accounts area with zero accounts: `No accounts yet — tap a type above to
  add one.` (the preset chips must sit directly above this line; in the
  full form too).
- Income list with zero rows keeps the `+ Add income source` affordance;
  add the line `No income sources yet.` above it when empty.
The map with zero accounts renders just masthead + income panel + need card
+ footnotes — verify no arrow/layout crash (add a layout test:
`layoutMap(blankClient())` returns no accounts, no waterfall arrows, and
the income→need arrow still renders).

## P3 — "Post Note" is jargon

Exact copy changes (data model field names stay `variant`/`postNote` —
this is display copy only):
- Form label `VARIANT` → `MAP TYPE`; options render `Annual` and
  `Mid-year update`.
- The `POST NOTE LABEL` field → label `AS OF`, placeholder `April 2026`.
- Masthead for the update variant: `MONEY MAP — <AS-OF, UPPERCASED> UPDATE`
  (e.g. `MONEY MAP — APRIL 2026 UPDATE`); if the as-of is blank:
  `MONEY MAP — UPDATE`. Annual masthead unchanged.
- Update the Calloway sample nothing — its data stays; only rendering copy
  changes.

## P4 — "Monthly income as needed" vs "monthly income need"

Form-side clarity (map chip text unchanged — it is the advisor artifact
grammar):
- `MONTHLY INCOME NEED` keeps its label; add help text under it:
  `The red number — what the household must cover each month.`
- `MONTHLY INCOME AS NEEDED` field → label `DRAW FROM SHORT-TERM BUCKET`;
  help text: `Optional monthly draw — appears on the arrow from the
  short-term bucket.`
- In the wizard, the Need step's two fields carry the same labels/help.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Browser verification, describe: new client → truly blank map, no crash;
  add via chip → summary shows the typed label; clear the label → summary
  reads `Short-Term Bucket · unnamed`; switch map type to Mid-year update
  with as-of `April 2026` → masthead reads `MONEY MAP — APRIL 2026 UPDATE`.
- Commit in logical steps; `docs/codex/SESSION-7-REPORT.md`; budget
  ≈ 200–350 changed lines. DO NOT PUSH — orchestrator reviews, then pushes
  (push auto-deploys the live site).
