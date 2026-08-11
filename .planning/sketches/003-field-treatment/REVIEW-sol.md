# Sketch 003 — adversarial review and adjudication

**Reviewer:** co-orchestrator (`gpt-5.6-sol`, high effort, read-only sandbox), 2026-08-09.
**Standard:** `.planning/DESIGN-DIRECTION.md` at `c332304`.
**Adjudication:** design lead. Every finding below is marked with what was done about it, and the
three that changed the contract were independently re-verified against the tree before acting.

## Findings, adjudicated

| # | Sev | Finding | Adjudication |
|-|-|-|-|
| 1 | blocker | money-axis: 24 inputs carry visual `<span>` captions with no `<label>` / `aria-label` / `aria-labelledby`; axe reports 24 critical accessible-name failures (`money-axis.html:160-192,213-240`). | **Split.** In the sketch markup this is a mockup artifact. In the *design* it is real and specific: the money axis deletes the visible per-row captions in Positions, so the real implementation must supply a programmatic name per input — a visible column header is not an accessible name. **Binding requirement on the money axis if it is chosen.** |
| 2 | blocker | A is dead: its `#dde1dc` input boundary is **1.2875:1** against paper, failing SC 1.4.11, and it restores the boxes Amendment 3 argues against (`index.html:188-206`). | **Accepted.** A is eliminated. It was the rejected baseline anyway; it is now eliminated on evidence rather than on taste. |
| 3 | major | Every treatment breaks Move 4: object names are set in Literata, the contract says Public Sans semibold. | **Inverted — the contract was wrong.** Verified in code: the map draws account titles in `FONT_SERIF`, weight 600, `TYPE.accountTitle` 19 (`MapSvg.tsx:1429`, `tokens.ts:97`). The thesis makes the map the authority. **Move 4 amended (Amendment 4); the sketches were right.** |
| 4 | major | Amendment 2's justification is false: `DESIGN.md:94` *and* `:114` specify uppercase labels above fields; the amendment claimed :94 described only the section tier. | **Accepted, and it is the most serious finding here.** Verified: `DESIGN.md:114` reads *"Labels sit above fields in small uppercase text."* **Amendment 2 withdrawn.** This is a genuine spec-vs-code divergence and it is Cyril's ruling, which the original amendment wrongly declared unnecessary. |
| 5 | major | C changes exactly Move 5's placement clause; it does **not** collide with Amendment 2 (captions stay sentence case, 12px/600, `.02em`). | **Accepted.** Sharpens what C costs: one clause, not two. |
| 6 | major | money-axis breaks Move 5 further, and its `HOLDING / VALUE` headers add a second `.08em` uppercase tier without providing accessible ownership. | **Accepted.** Note the irony: that second caps tier is the exact harm Amendment 2's own reasoning invoked. Recorded against the money axis. |
| 7 | major | Move 1's 200%-zoom rationale is false at HEAD — later `max-width:900px` rules set `.workspace` to `height:auto`, so the described starvation cannot occur as stated (`app.css:2123-2126,2236-2275`). | **Recorded, not yet acted on.** Re-verify before Move 1 is built. The *contract* (clamped list range, list yields before detail) is sound design either way; only the stated rationale is in question, and a worker must not be handed a false premise. |
| 8 | major | money-axis arithmetic: `$2,450,000` measures **70.5px**, not 78px (82.5px with input padding); the carve description track is **~212px real**, not 163px. 116px column confirmed genuinely fixed. | **Accepted.** Corrections run *in the money axis's favour* — there is more headroom than the sketch claimed, not less. |
| 9 | major | The original width proof subtracts layers that do not exist. Real content width at the cap is `380 − 1 − 28 = **351px**`; B/C's carve field is **338px**, not 300px. All variants fit regardless. | **Accepted.** The conclusion held; the derivation did not. |
| 10 | major | The framing stacks the result (A "already rejected", B "recommended", C paired with a known cost). The missing fourth quadrant is **boxed + inline**, already shipped for Need fields with a 132px value column (`form.css:402-431`). | **Accepted — highest-value finding.** Verified. **Amendment 5 added.** This changes the ruling: a fixed value column is a shipped pattern, so the money axis generalises the app rather than importing an idea, and Amendment 3's "inconsistent by construction" is withdrawn as too strong. |
| 11 | major | Real-data stress: bundled maxima fit even C. The adversarial e2e fixture (multilingual prefix + 180 `W`s) truncates every single-line input, **C first** (~210px/197px), then money-axis position rows, then A/B. | **Accepted, low weight.** Bundled data is the real bar; the 180-`W` fixture is adversarial by construction. Recorded as C's cost, not as a disqualifier. |
| 12 | minor | Two citations overstate the tree: the selection shadow is `form.css:190`, not `:189`; "zero `<rect>` across the whole `AccountContent` render" is false — hit rectangles begin at `MapSvg.tsx:1450`. | **Accepted.** The tag *glyph* still has no container, which is what Amendment 1 rules on. The overstatement is corrected here rather than by weakening Amendment 1. |
| 13 | minor | Participant counts, quotations, the Baymard interpretation, and an asserted "6px AAA requirement" in `index.html:691-692,711-722` have no receipt in the tree: **unverifiable**. | **Accepted, and flagged to Cyril.** Those lines must not carry weight in the ruling. A sketch that cites research it cannot produce is arguing from authority it does not have. |

## Verdict per option

| Option | Standing after review |
|-|-|
| **A** — boxed, stacked caption | **Eliminated.** SC 1.4.11 contrast failure plus the treatment already rejected. |
| **B** — ledger, stacked caption | Clears Amendment 1, Move 5, focus visibility, money typography, and the 380px cap. |
| **C** — ledger, inline caption | Same, minus Move 5's placement clause. Truncates first under adversarial strings. |
| **money-axis** (on top of B) | Fits 380px with more headroom than claimed. Costs a Move 5 change, a second uppercase tier, and a per-input accessible-name requirement. |
| **boxed + inline** (fourth quadrant) | Not in the comparison. **Already shipped** in the Need section, `form.css:402-431`. |

## Strongest evidenced argument against B

B makes editable controls and ledger separators into two competing 1px horizontal-rule systems in
the same dense column — field rules sit directly among holding separators (`index.html:214-250`).
The sketch's own cited study says users confuse underline fields with dividers; that citation is
one of the unverifiable ones (finding 13), so the *evidence* is weak, but the *mechanism* is
visible in the sketch without needing the study.
