# Worker task: fields.html

Build ONE self-contained HTML mockup implementing a frozen design contract. Another worker is building `shell.html` in parallel. Touch ONLY your own file. Make NO other change to the repo. Do NOT commit.

## Your only output file

`C:\Users\Cyril\Projects\money-map-generator\.planning\sketches\002-panel-overhaul\fields.html`

## Read first, it is the contract and it is frozen

`C:\Users\Cyril\Projects\money-map-generator\.planning\DESIGN-DIRECTION.md`

Read it completely before writing anything. Every rule in it was verified against source and survived two adversarial review rounds. Do not improve on it, do not reinterpret it, do not add moves it does not contain. Where it says a thing is rejected, that thing is rejected.

## Also read, for real values and real data (invent none of these)

- `src/form/Form.tsx` — the CURRENT field rendering. Look specifically at `label="Label"` on lines 703, 782, 1218 and `label="Value"` on lines 724, 814, 939. Four record types captioned with two generic words. This is the defect you are fixing.
- `src/form/Form.tsx` lines 703 to 823 — positions and sub accounts rendered as nearly identical two field cards. Also the defect.
- `src/model/samples.ts` — the Whitfield household. Use these exact labels and figures. The Managed After Tax Trust has real positions.
- `src/styles/form.css` — existing field, input and card styling. Note `.account-summary-value` at lines 233 to 241.
- `DESIGN.md` — inputs are 32px high with `5px 8px` padding, labels sit above fields, money inputs align right with tabular numerals.

## Your scope: MOVE 5 of the contract, the field level treatment

This is the answer to the user's complaint that "the fields/forms look second rate", so the craft here IS the deliverable.

- Every caption names its owner: "Account value", "Position value", "Sub account value", "Position label", "Sub account label", "Fine print label". Small muted Public Sans above the input, sentence case.
- Positions and sub accounts must STOP being near copies and become visibly different things:
  - A POSITION is a holding. Dense single row, label plus value, NO card chrome.
  - A SUB ACCOUNT is a carve out. Keeps its card, keeps its caption. It gets its own shape on the map.
- Display money (read only totals) in Literata tabular. Money INPUTS in Public Sans, tabular, right aligned. Literata must never appear inside an input.
- Apply Move 4 typography to labels and values.

Build this as a field treatment specimen page: show an account's full detail pane with its positions and sub accounts, plus a before and after comparison making the caption fix and the position versus sub account distinction obvious at a glance.

## Out of your scope

Do NOT build the master detail shell, the object list, the rail, or the bucket chips. That is the other worker's file.

## Hard constraints

- Plain HTML with inline CSS and JS in the one file. No build step, no npm, no framework, NO network requests of any kind, no CDN fonts.
- Every input must actually accept typing. No dead controls.
- Design inside a 380px wide panel. Show it at that width.
- Must be viewable by opening the file directly from disk.
- Never colour alone to carry meaning (`PRODUCT.md` line 39).

## Report when done

State in one paragraph: what you built, how a position now reads differently from a sub account, and anything in the contract you could not satisfy.
