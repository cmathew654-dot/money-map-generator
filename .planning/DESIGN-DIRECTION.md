# Design Direction — Editor Panel Overhaul

**Status:** FROZEN CONTRACT. Accepted 2026-08-09 after two adversarial review rounds.
Amended 2026-08-09 after Cyril's review of sketch 002 (flow approved; pills and forms rejected).

| # | Amendment | Where | State |
|-|-|-|-|
| 1 | The bucket tag is text, never a capsule. `border-radius` on a tag is forbidden. | Move 3 | **Binding** — user-directed |
| 2 | The Move 5 "sentence case vs `DESIGN.md:94`" conflict is not a conflict; two tiers. | Move 5 | **Binding** — evidence confirms the original spec |
| 3 | The forms read generic because they contradict the already-shipped ledger list. | Move 5 | **Binding** — evidence, `form.css:171-183` |
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
| Account rows | Bucket tag: the bucket's **tag word** rendered in its **`tagColor`**, as bare text |
| Notes, footnotes | **Ink only. No colour.** The map draws them as plain ink. |
| Flows | **Ink only. No colour.** Auto-generated arrows carry no bucket. |

> **Read `tagColor`, never `stroke`, from `BUCKETS` in `src/render/tokens.ts`.** `stroke` fails text contrast for `afterTax` (`#b98a1e`) and `taxPreferred` (`#2e8577`); `tagColor` exists as the separately-darkened value (`#836313`, `#23695e`) for exactly this reason.

**Never a bare dot. Never a stripe.** The tag carries the word.

### The tag is text. It is never a capsule. (Amendment 1, 2026-08-09)

**`border-radius` on a bucket tag is forbidden. So is a border, a background fill, and padding
that implies a container.** No pill, no capsule, no badge, no chip. The tag is *set*, not
*contained*.

The map settles this, and the map is the authority the thesis points to. `MapSvg.tsx:1411-1423`
draws the tag as bare `<text>`:

| Property | Map value |
|-|-|
| Family | `FONT_SANS` — Public Sans (`tokens.ts:86`) |
| Size | `TYPE.accountTag` = 12.5 (`tokens.ts:98`) |
| Weight | 700 |
| Tracking | `letterSpacing={1.2}` — 1.2 user units at 12.5px ≈ **0.096em** |
| Case | `{style.tag.toUpperCase()}` — forced in JS; the source string is Title Case |
| Fill | `style.tagColor` |
| Container | **None. Zero `<rect>`.** Verified across the whole `AccountContent` render. |

The panel reproduces that treatment scaled to panel context. It does not add a container the
map does not have.

> **Why this had to be written down.** The word *chip* is a container word, and the first
> worker built the container the word implied: `.tag{padding:3px 6px;border:1px solid
> currentColor;border-radius:999px;font-size:10px}` (`sketches/002-panel-overhaul/shell.html:2`).
> The vocabulary caused the defect. This contract now says **tag**, never *chip*, everywhere.
> `pills.css` is unrelated — it styles the map-chrome action bench, not bucket tags. There is
> no bucket pill anywhere in the shipped app. The capsule was invented by the sketch.

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

### The case question was not a conflict (Amendment 2, 2026-08-09 — BINDING)

The handoff flagged "sentence case" here as conflicting with `DESIGN.md:94`:

> "Interface labels are 12px, semibold, uppercase, and tracked at `0.08em`; section headings
> increase tracking to `0.14em`."

**It is not a conflict. They describe two different tiers, and the codebase already ruled on it
deliberately** in `9ab66cf feat(form): rebuild the Data panel as an account ledger`:

```
/* One level of uppercase only. Tracked caps mark section headers; every field
   label inside the panel drops to quiet sentence case. */
```
— `form.css:157-158`

| Tier | Who is in it | Shipped treatment |
|-|-|-|
| **Tracked caps** | Section headers; bucket tags | `form.css:141-148` — 12px / 700 / `0.12em` / uppercase |
| **Quiet** | Field captions | `form.css:159-169` — 12px / 600 / `0.02em` / `text-transform: none` |

`DESIGN.md:94` describes the **tracked-caps** tier. Move 5's captions are the **quiet** tier.
Both hold at once, and the shipped panel already implements both.

**Ruling: Move 5's sentence case stands, unchanged.** This needed no decision from Cyril, because
the evidence confirms the spec he already wrote rather than opposing it. Sentence case is not the generic
thing about these forms — it is a deliberate, shipped, reasoned decision, and reversing it would
put a second level of uppercase in a 380px panel that already spends caps on section headers.

**Cost of the alternative, stated so the ruling is informed.** Uppercase plus `0.08em` on
"SUB-ACCOUNT VALUE" runs roughly 18–20% wider than sentence case at the same size. In a 380px
panel it is the difference between a caption that fits its column and one that wraps.

> **Doc drift, noted not fixed:** `DESIGN.md:94` says section headings track `0.14em`; `form.css:146`
> ships `0.12em`. Real, small, and not this contract's job.

### The forms are generic because they contradict the list above them (Amendment 3, 2026-08-09)

This is the root cause of "the actual FORMs are so GENERIC", and it is a **consistency** defect,
not a taste defect.

**The shipped account list is already a ledger.** `form.css:171` opens a section literally headed
`/* ---- ledger rows */`, from commit `9ab66cf feat(form): rebuild the Data panel as an account
ledger`. The list rows abolished container chrome on purpose:

```css
.editor-panel .account-card {
  border: 0;
  border-bottom: 1px solid var(--fm-hairline);
  border-radius: 0;
}
```
— `form.css:177-183`

**The fields never got that pass, and sketch 002 put the chrome back.** `fields.html` reintroduces
exactly what the list removed: `border-radius: 10px` on `.comparison` and `.detail`, `8px` on
`.legacy-card` / `.subaccount-card` / `.fine-print-card`, and `border: 1px solid + border-radius:
4px` on every `input`.

So in one 380px column the list speaks ledger and the fields speak web form. That is what reads
as generic. It also explains the earlier verdict on the accordion — *"nothing stands out or is
different than anything else"* (`01-05-SUMMARY.md:161-167`). Both complaints are the same
complaint: **insufficient differentiation between record types.**

**Contract:** field treatment must be evaluated against the shipped list's vocabulary, not
freehand. A field treatment that reintroduces radii and boxes the list already abolished is
inconsistent by construction and does not need a taste argument to reject.

> This shifts the burden of proof onto boxes; it does not decide the question. The comparison
> still gets built and Cyril still rules. But "ledger" is the direction the app already shipped,
> not a new idea being proposed to it.

**Positions and sub-accounts stop being near-copies.** `Form.tsx:703-823` renders them as nearly identical two-field cards. They are different things:

- **A position is a holding.** Dense single row, label + value, no card chrome.
- **A sub-account is a carve-out.** Keeps the card, keeps its caption — it gets its own shape on the map.

Make the structural difference visible instead of typographically identical.

---

## Contract completeness — specified so workers cannot invent

1. **Detail pane empty state.** Required on first load and after deleting the selected item. The accordion never needed one ("nothing expanded" was already legible); master-detail does.
2. **Deleting the selected item** reverts detail to the empty state. It does **not** auto-advance to a neighbour — silent selection movement after a destructive action is its own defect.
3. **Flows get no colour** (see Move 3). Stated explicitly so a worker does not invent one.
4. **Bucket tag reads `tagColor`** (see Move 3). Stated explicitly because `stroke` is the obvious wrong choice.
5. **The bucket tag has no container** (see Move 3, Amendment 1). Stated explicitly because a worker already invented one.

## Out of scope

- Anything on the map. Editing behaviour is frozen.
- Screenshot baseline regeneration — deferred to the verification phase, since visual craft invalidates the same PNGs again.
- ~~The Add panel's `chipLabel: 'Trust'` vs Data's `'Taxable'` collision (`book.ts:88`). Real, tracked, not this contract's job.~~
  **Moved in scope 2026-08-09 (user direction: "fold in, do not give their own passes").** Confirmed
  live: `tokens.ts:47-52` gives `afterTax` the tag word **`Taxable`**, which is what the map and the
  Data panel render; `book.ts:88` `ACCOUNT_PRESETS` still says **`Trust`**. One object, two names.
  Folds into Phase 2 as a fix, not as its own pass.
- `Account.valueTag` has no canvas edit target. **Also folded into Phase 2** by the same direction.
  Not a licence to touch double-click-to-edit, which stays frozen — this is about the target
  existing at all.

## Rejected, with reasons

| Proposal | Why rejected |
|-|-|
| Side-by-side master-detail | Panel capped at 380px. Two panes leave ~150-180px each; ~80px at 200% zoom. |
| Responsive fold (wide → accordion) | No wide state exists to fold from. Dual-layout maintenance for a layout that never renders. |
| Left-edge colour rule per row | `form.css:189` already uses it for selection. |
| Bucket colour as a bare dot | `PRODUCT.md:39` forbids colour alone. |
| Inventing colour for notes/footnotes/flows | Violates the thesis. The map is silent there. |
| Literata in money inputs | Breaks control-vocabulary consistency. |
