---
sketch: 001
name: panel-retrieval
question: "What replaces Add + Data + Contents, so a control is reachable from an intent rather than a section name?"
winner: null
tags: [ia, navigation, retrieval, shell]
---

# Sketch 001: Panel Retrieval

## Design Question

Phase 1 fixed field *taxonomy*: every field has exactly one nameable section, and nothing prints on the exported map without a control. Dogfooding then failed anyway. The unfixed half is *retrieval*: given an intent ("mark the Roth's value as an estimate"), find the control.

This sketch asks what replaces the Add / Data / Contents split so that reaching a control never requires knowing the app's internal structure.

## How to View

```
start C:\Users\Cyril\Projects\money-map-generator\.planning\sketches\001-panel-retrieval\index.html
```

Switch variants with the tabs or the `1` / `2` keys.

## Variants

- **A: Retrieval-first** — one search front door indexing objects *and* fields; typing a thing lands you on its control, focused. Deletes the Data/Contents split, the duplicate filter box, and two of four rail icons.
- **B: Single object tree** — one surface grouped by object (Income, Needs, Accounts, Flows, Notes), inline `+` on each group header, items expand in place into their fields. Deletes the Add panel, the Contents panel, Data's internal nav strip, and the 4-button rail.

Both hold palette and typeface fixed so the comparison is structural. Both show the real Whitfield household at realistic scale. Both treat the map as frozen: double-click-to-edit on the canvas already works and is unchanged by user ruling.

## The Shared Test

Both are captioned with the same task, **"mark the Roth's value as an estimate."**

| Variant | Reported steps | Lands on |
|-|-|-|
| A | 3 (`Ctrl+K`, type "roth", click result) | `Value` input, with Caption below |
| B | 2 (click the Roth row, click its Value tag field) | `Value tag` |

## Finding: A failed its own test

`valueTag` is the field that means "estimate" — it renders `est.` beside the value on the exported map, and its help text says so verbatim. Variant A's index never surfaces it; the string "Value tag" does not appear anywhere in variant A. For this intent it ranks `Roth IRA → Value`, which is the wrong control.

This is A's self-declared weakness reproducing empirically rather than theoretically: matching is plain substring, so the design only retrieves vocabulary the advisor already guessed. "estimate" does not substring-match "Value tag".

That does not settle the question in B's favour. It means **A is only viable with an intent/synonym layer** mapping advisor language to field names, and that layer is a second hand-maintained taxonomy, arriving immediately after the phase that fixed the first one.

## What to Look For

1. **Retrieval without vocabulary.** Try a word neither design was tuned for. Where does each leave you?
2. **B's admitted sprawl.** Expand `Managed After-Tax Trust` and `Managed IRA — Jordan` together. B runs 400–600px per expanded account; opening two means scrolling past one to read the other. Does its single-open-per-group mitigation hold?
3. **Does anything stand out?** The original complaint was "nothing stands out or is different than anything else." Judge hierarchy, not paint.
4. **What each deletes.** Both list it in-mockup. A design that only adds has made the panel worse.

## Open

- Variant B introduced two bucket accent colours (cash, short-term) absent from the sampled `DESIGN.md` palette, added low-chroma to match the existing accent family because the Whitfield data needs them. Unresolved pending review.
- Neither variant addresses the Add panel showing the `afterTax` bucket as **Trust** (`src/model/book.ts:88`) while Data and the map now show **Taxable**.
