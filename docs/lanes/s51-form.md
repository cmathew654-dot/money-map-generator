# s51 T-FORM — Data panel ledger

The Data panel now reads as a ledger instead of a stack of open cards.

## What changed

- **Account rows.** `<details>/<summary>` became a `<div>` + `<button
  aria-expanded aria-controls>`; the body is a labelled `role="region"` that is
  only in the DOM when expanded. One line per account: category dot, name,
  right-aligned tabular value, chevron.
- **Expansion.** `isAccountExpanded(manualOpen, id, selectedAccountId)` —
  `manualOpen[id] ?? id === selectedAccountId`. Manual expands survive a
  selection change; the auto-expanded row follows the map selection. A fresh
  selection clears its own stale manual override (adjust-during-render), so
  clicking the account on the map always reopens it.
- **Focus/scroll.** The s49 `focusRequest` effect still owns scroll + field
  focus — no second mechanism. It now resolves the row element and queries
  `.account-body input`, with a rAF retry for when selection and focusRequest
  land in separate commits.
- **Selection follows focus** moved from the card to the body. On the card it
  fired on the row button's own mousedown, which expanded the row before its
  click toggled it straight back shut.
- **Shape control** moved into the expanded body footer beside Remove account.
- **Filter** is 14px, full width, inline SVG glyph, 3px green focus ring. The
  query echo moved out of the label onto the nav row so the tools bar keeps one
  height and the sticky section headers never shift.
- **Section headers** are sticky (top: 126px) tracked caps with counts. Every
  field label inside the panel dropped to sentence case so one level of
  uppercase marks hierarchy.
- **Close.** 32px X in the tools bar wired to `closeDataPanel`, the same path as
  the rail toggle and Escape.

## Deviations

- The mockup's "Tax treatment / Owner" map to the real fields **Account type**
  and **Supporting note**; the model has no owner field and adding one was out
  of scope.
- All new styling lives in `src/styles/form.css`, scoped under `.editor-panel`
  so the Wizard keeps its `app.css` look.
