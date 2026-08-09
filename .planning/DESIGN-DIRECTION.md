# Design Direction — Editor Panel Overhaul

**Status:** FROZEN CONTRACT. Accepted 2026-08-09 after two adversarial review rounds.
**Owner:** design direction set by lead; attacked and refined by co-orchestrator; every load-bearing claim verified against source before acceptance.
**Applies to:** the editor panel and rail. Not the map.

---

## Thesis

**The panel is an index of the map, so it speaks the map's visual language and never invents its own — and where the map is silent, the panel is silent too.**

The second clause is not decoration. A fifth of the object model (text notes, footnotes, auto-generated flows) has no map colour. Any design that assigns them one has violated the thesis to satisfy its own symmetry.

---

## Frozen constraints — violating any of these is dead on arrival

| Constraint | Source |
|-|-|
| Map double-click-to-edit is untouchable | User ruling 2026-08-09. Works, e2e-proven. |
| Exported SVG/PDF/PNG output must not change | Client-facing deliverable |
| Persisted book format unchanged without migration | Stored `'afterTax'` lives in saved client books |
| Fully client-side, no new runtime dependency, no network | Milestone constraint |
| WCAG 2.2 AA, usable at 200% zoom, **never colour alone** | `PRODUCT.md:39` |
| Panel is capped at **380px** | `app.css:2484` → `72px minmax(0, 380px) minmax(0, 1fr)` |

> The 420px / `minmax(520px, 1fr)` grid is `.workspace.is-guided-setup`, a different mode. Do not design against it.

---

## Move 1 — Stacked master-detail, one layout everywhere

The object list holds still. Selecting an object never changes the list's geometry.

- **List region on top**, own `overflow-y: auto`.
- **Detail region below**, own `overflow-y: auto`.
- Selecting a row swaps detail content. Nothing reflows, nothing pushes siblings down, nothing collapses.

**No dual layout, no responsive fold.** With a 380px hard cap, side-by-side master-detail never renders at any viewport, so there is no wide state to fold from. Build one layout.

**200% zoom (mandated, and the way this fails):** `.workspace` is `height: calc(100vh - 52px)` (`app.css:559`). At 200% zoom the CSS-px viewport roughly halves, but a literal `height: 280px` list region does not shrink with it and starves detail toward zero.

> **Contract:** the list gets a *clamped range* — min ≈ 2 rows, max ≈ 40% of available height — never a hardcoded px. **When space is tight the list yields before detail does**, because detail is the live task. Both regions keep independent `overflow-y: auto`. WCAG's bar is reachable-via-scroll, not scroll-free.

## Move 2 — The caret dies

In master-detail there is nothing to disclose, so the expand chevron has no job. Remove it rather than restyling it.

**The left edge is already taken.** `form.css:189` uses `box-shadow: inset 3px 0 0 var(--fm-flow)` to mean *selected*. Do not extend a left-edge rule to every row — it would destroy the selection signal. Selection keeps sole ownership of that affordance.

## Move 3 — Colour tags, text always carries identity

Colour differentiates the five groups and the account buckets. It never carries meaning alone (`PRODUCT.md:39`).

| Object | Treatment |
|-|-|
| Income rows | `--fm-flow` `#1e7a4a` accent |
| The need | `--fm-need` `#c03a2d` accent |
| Account rows | Bucket chip: the bucket's **tag word** rendered in its **`tagColor`** |
| Notes, footnotes | **Ink only. No colour.** The map draws them as plain ink. |
| Flows | **Ink only. No colour.** Auto-generated arrows carry no bucket. |

> **Read `tagColor`, never `stroke`, from `BUCKETS` in `src/render/tokens.ts`.** `stroke` fails text contrast for `afterTax` (`#b98a1e`) and `taxPreferred` (`#2e8577`); `tagColor` exists as the separately-darkened value (`#836313`, `#23695e`) for exactly this reason.

**Never a bare dot. Never a stripe.** The chip carries the word.

Colour tags groups, not rows within a group: four IRAs are all `taxDeferred` blue. Row identity is the label's job, always.

## Move 4 — Typography encodes hierarchy

Three steps with real contrast, not five that blur.

| Element | Treatment |
|-|-|
| Group headers (Income, Needs, Accounts, Flows, Notes) | **Literata** — landmarks, not form labels |
| Object names | Public Sans semibold |
| **Display money** (read-only row totals, e.g. `.account-summary-value`) | **Literata, tabular** — `DESIGN.md:80` gives Literata financial values, and it matches the map |
| **Editable money inputs** | **Public Sans**, tabular, right-aligned — `DESIGN.md:114` |
| Field labels | Small, muted Public Sans, clearly subordinate |

> Display money and money inputs are different objects. Inputs are *controls*, and every other control in this app (name, caption, note) is Public Sans; Literata inside an input breaks control-vocabulary consistency. **Literata does not cross an input's border.**

## Move 5 — Fields name their owner

This is the answer to "the fields/forms look second rate." The shell was never the main defect.

`Form.tsx` captions **four record types with two generic words**:

- `label="Label"` — `Form.tsx:703` (position), `:782` (sub-account), `:1218` (footnote)
- `label="Value"` — `Form.tsx:724` (position), `:814` (sub-account), `:939` (account)

**Contract:** every caption names its owner — "Account value", "Position value", "Sub-account value", "Position label", "Sub-account label", "Fine print label". Small muted Public Sans above the input, sentence case, current position retained.

**Positions and sub-accounts stop being near-copies.** `Form.tsx:703-823` renders them as nearly identical two-field cards. They are different things:

- **A position is a holding.** Dense single row, label + value, no card chrome.
- **A sub-account is a carve-out.** Keeps the card, keeps its caption — it gets its own shape on the map.

Make the structural difference visible instead of typographically identical.

---

## Contract completeness — specified so workers cannot invent

1. **Detail pane empty state.** Required on first load and after deleting the selected item. The accordion never needed one ("nothing expanded" was already legible); master-detail does.
2. **Deleting the selected item** reverts detail to the empty state. It does **not** auto-advance to a neighbour — silent selection movement after a destructive action is its own defect.
3. **Flows get no colour** (see Move 3). Stated explicitly so a worker does not invent one.
4. **Bucket chip reads `tagColor`** (see Move 3). Stated explicitly because `stroke` is the obvious wrong choice.

## Out of scope

- Anything on the map. Editing behaviour is frozen.
- Screenshot baseline regeneration — deferred to the verification phase, since visual craft invalidates the same PNGs again.
- The Add panel's `chipLabel: 'Trust'` vs Data's `'Taxable'` collision (`book.ts:88`). Real, tracked, not this contract's job.

## Rejected, with reasons

| Proposal | Why rejected |
|-|-|
| Side-by-side master-detail | Panel capped at 380px. Two panes leave ~150-180px each; ~80px at 200% zoom. |
| Responsive fold (wide → accordion) | No wide state exists to fold from. Dual-layout maintenance for a layout that never renders. |
| Left-edge colour rule per row | `form.css:189` already uses it for selection. |
| Bucket colour as a bare dot | `PRODUCT.md:39` forbids colour alone. |
| Inventing colour for notes/footnotes/flows | Violates the thesis. The map is silent there. |
| Literata in money inputs | Breaks control-vocabulary consistency. |
