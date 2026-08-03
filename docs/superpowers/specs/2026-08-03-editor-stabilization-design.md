# Editor Stabilization Design

**Date:** 2026-08-03  
**Status:** Approved direction; implementation pending

## Goal

Make the advisor canvas predictable in live meetings without redesigning the
data model or editor. The work is a focused stabilization pass: reliable
selection, dragging, resizing, notes, tidy behavior, and a quieter left panel.

## Interaction behavior

### Selection, editing, and dragging

- A selected map item keeps its inspector visible while inline text editing is
  active. Voice input or focus changes must not make the inspector appear or
  disappear.
- Clicking rendered text opens its inline editor.
- Dragging more than the existing movement threshold from text or blank shape
  space moves the owning item. A short click must not move it.
- Transparent text hit areas must fit the rendered text instead of spanning a
  large percentage of the parent shape.
- The selected account, income box, need box, or note shows one direct resize
  handle. Resize handles are absent from Present mode and exports.
- Cursor state follows the active target: text over actual text, grab over a
  movable body, and resize over the handle.

### Notes

- Armed note placement accepts any point on the map, including points over an
  existing shape. Placement takes priority over selecting or moving the shape
  beneath that click.
- A newly committed note is selected immediately.
- Notes retain the existing size, width, and background controls and add one
  optional `font` value: `serif` or `sans`. Existing notes default to serif.
- Notes remain independent overlays; placing one over a shape does not make it
  account data or change the shape's layout.

### Amount notes and warnings

- Existing income qualifiers, account value tags, and the monthly-need tag
  remain in saved JSON for compatibility.
- Those amount-note fields are hidden from the editor and their text is not
  rendered on the canvas. No migration deletes existing values.
- All warning UI is hidden: the global "Map needs attention" banner, Contents
  warnings, targeted warning badges, and wizard warning state.
- Existing layout diagnostics may remain internal for tests and debugging; they
  do not decide whether an advisor can continue.

## Tidy map

`Tidy map` becomes a conservative snap operation rather than a reset.

- Snap the current `x` and `y` anchors of income, need, accounts, notes, and the
  as-needed chip to the nearest 12 map units.
- Preserve sizes, rotations, text offsets, connector labels, and the advisor's
  overall composition.
- Re-route generated connectors from the snapped positions using the existing
  layout path.
- Record the entire tidy operation as one undo step.
- If every eligible anchor is already snapped, make no history entry and leave
  the command disabled.
- Keep `Reset arrangement` as the separate command that restores generated
  semantic layout.
- Success feedback reads `Map aligned to grid.`

## Left editor polish

Keep the existing 420 px panel, tabs, state ownership, and workflows. Use CSS
and existing markup wherever possible:

- reduce uppercase micro-labels and heavy boxed-section styling;
- tighten vertical rhythm and field/control height;
- make the selected row clearer without adding decoration;
- make Details, Duplicate, shape selectors, and inspector controls smaller and
  visually secondary to the map;
- retain Public Sans for controls and Literata for map values.

This is not a navigation rewrite and adds no new component system.

## Explicitly out of scope

- Removing after-tax/gross/account-type data from the model.
- Changing income calculations or sample client names.
- Automatic collision avoidance or semantic re-layout during Tidy.
- Rich-text notes, arbitrary colors, bold/italic controls, or note nesting.
- New dependencies, state owners, context providers, or data migrations.

## Regression coverage

Add the smallest tests that guard the escaped failures:

- dragging from rendered account text moves the account while a click edits it;
- the inspector stays visible during inline editing;
- a selected item exposes pointer resize and resizing changes its dimensions;
- note placement works over a shape and the committed note is selected;
- amount-note text and every warning surface are absent;
- note font choice round-trips through parsing and rendering;
- Tidy snaps eligible anchors, preserves other overrides, is idempotent, and
  creates one undo entry;
- a compact visual snapshot covers the left panel and selected inspector.

## Dogfooding routes

### Required release route (about 12 minutes)

1. Start a blank/custom map; add one income source, account, and note.
2. Select the account from its edge, blank center, title, and value; click to
   edit, drag from text/body, rotate, resize, and change shape.
3. Confirm the inspector remains present throughout selection and text edits.
4. Add notes on the background and over the account; change font, size, width,
   and background.
5. Free-place the items, run Tidy, undo once, and confirm the prior composition
   returns.
6. Reload, enter Present mode, and do one export smoke check.

### Rotating deep routes (one per release, about 30 minutes)

- **Dense content:** long names, null values, nested accounts, every shape, `~`
  text, crowded layouts, resize/rotate cycles.
- **History and persistence:** duplicate, delete, undo/redo, reset, Tidy,
  save/reload, import/export JSON, and another browser tab.
- **Canvas mechanics:** connectors, labels, multi-select, keyboard movement,
  clipboard actions, zoom, and repeated note placement.
- **Output:** supported viewport sizes, 200% browser zoom, Present mode, print,
  PNG, PDF, and SVG smoke checks.

Every escaped production bug adds one focused automated regression to the
required route's test coverage; the whole deep matrix does not run every time.

## Completion gates

- `npm test`
- `npm run build`
- focused Chromium interaction tests run sequentially
- the required 12-minute dogfood route
- no new dependencies and no push
