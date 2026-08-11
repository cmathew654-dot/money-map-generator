# Worker task: shell.html

Build ONE self-contained HTML mockup implementing a frozen design contract. Another worker is building `fields.html` in parallel. Touch ONLY your own file. Make NO other change to the repo. Do NOT commit.

## Your only output file

`C:\Users\Cyril\Projects\money-map-generator\.planning\sketches\002-panel-overhaul\shell.html`

## Read first, it is the contract and it is frozen

`C:\Users\Cyril\Projects\money-map-generator\.planning\DESIGN-DIRECTION.md`

Read it completely before writing anything. Every rule in it was verified against source and survived two adversarial review rounds. Do not improve on it, do not reinterpret it, do not add moves it does not contain. Where it says a thing is rejected, that thing is rejected.

## Also read, for real values and real data (invent none of these)

- `src/render/tokens.ts` — the `BUCKETS` map. Use `tagColor`, NEVER `stroke`, for chip text. This is contract completeness item 4.
- `src/model/samples.ts` — the Whitfield household. Use these exact labels and figures.
- `src/ui/EditorPanels.tsx` — `contentItems()` line 65, `contentGroups()`/`GROUP_ORDER` lines 47 to 59. Your groups are Income, Needs, Accounts, Flows, Notes, in that order.
- `src/styles/app.css` and `src/styles/form.css` — existing tokens and existing patterns.
- `DESIGN.md` — the design system.

## Your scope: the SHELL only. Moves 1, 2, 3, 4 of the contract

- Stacked master detail. List region on top with its own `overflow-y: auto`, detail region below with its own. Selecting a row must NEVER change the list's geometry.
- The list height is a CLAMPED RANGE (min about 2 rows, max about 40% of available height). NEVER a hardcoded px value. When space is tight the list yields before detail does. This is the 200% zoom requirement and it is the single most likely thing to get wrong.
- No expand caret anywhere. No left edge stripe on rows: that inset shadow already means "selected" and selection keeps sole ownership of it.
- Bucket chips carry the bucket's tag WORD rendered in its `tagColor`. Never a bare dot.
- Notes, footnotes and Flows get NO colour. Ink only.
- Typography per Move 4. Literata for group headers and DISPLAY money (tabular). Public Sans for object names, field labels, and money INPUTS (tabular, right aligned). Literata must not appear inside an input.
- Include the detail pane empty state (contract completeness item 1).

## Out of your scope

Do NOT build the field level treatment (Move 5: captions naming their owner, positions versus sub accounts). That is the other worker's file. Show the detail pane with plausible fields, but the field level spec is not yours.

## Hard constraints

- Plain HTML with inline CSS and JS in the one file. No build step, no npm, no framework, NO network requests of any kind, no CDN fonts.
- Every interactive element must actually work. Selecting rows must switch the detail pane for real. No dead buttons.
- Panel is capped at 380px wide. Design inside that. Show it at realistic scale with the map as a placeholder beside it.
- Show 6 or more accounts, including the two named `Managed IRA` and `Roth IRA` in `samples.ts`, so scale is visible.
- Must be viewable by opening the file directly from disk.

## Caption

Add a visible caption stating the click path and step count for: "mark the Roth's value as an estimate".

## Report when done

State in one paragraph: what you built, how the list clamp works, and anything in the contract you could not satisfy.
