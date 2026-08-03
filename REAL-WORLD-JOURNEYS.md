# Real-World Money Map Journeys

Purpose: E2E and dogfood routes follow what an advisor is trying to accomplish, not implementation details. Each route starts from a realistic state and ends with a verifiable outcome.

## Route 0: First landing and orientation

- Open the app in a clean browser.
- Identify the current client, map, Add, Data, Contents, Present, Print, and Export.
- Confirm the map is viewable without editing.
- Confirm the first obvious creation action is discoverable.
- Press Escape, Tab through the header, and reopen the primary panels.

Pass: an advisor can answer “what am I looking at?” and “where do I create one?” without guessing.

## Route 1: Create a client in any order

Run three variants: account-first, income-first, need-first.

- Create a new client.
- Add the first item.
- Confirm it is selected and its Data fields receive focus.
- Enter real values plus null/blank values.
- Add remaining essentials in a different order.
- Confirm automatic flows and persistence.

Pass: no forced order, no lost selection, no blank-to-zero coercion.

## Route 2: Edit a prepared client

- Open an existing client.
- Edit title, income, account, need, positions, sub-accounts, notes, and fine print.
- Use punctuation, whitespace, long labels, approximate values, and multiline text.
- Switch panels during editing.
- Escape, reload, and return.

Pass: values remain exact, edits do not jump targets, and the map stays legible.

## Route 3: Directly manipulate the map

For income, need, account, note, and fine print:

- Click visible text.
- Click blank body space.
- Drag body and title.
- Resize and rotate.
- Select through Contents.
- Delete, duplicate, undo, and redo.

Pass: hit regions are intuitive, selection is stable, handles appear only when useful, and no object is accidentally edited.

## Route 4: Build relationships

- Add income-to-need, account-to-need, and account-to-account flows.
- Attempt invalid source/target combinations.
- Move flow labels.
- Hide and restore automatic flows.
- Delete an endpoint and inspect remaining arrows.
- Undo/redo every relationship change.

Pass: no duplicate, orphaned, reversed, or silently disappearing flows.

## Route 5: Annotate and explain

- Add notes over shapes and in blank space.
- Edit note text, font, size, background, and width.
- Add fine print.
- Use punctuation such as `~`, `$`, `%`, `&`, and em dashes.
- Escape while editing and reload.

Pass: notes remain tight, readable, selectable, and do not disturb underlying objects.

## Route 6: Arrange and review

- Drag several objects off-grid.
- Run Tidy.
- Confirm only positions change.
- Undo once and verify exact restoration.
- Run Tidy on an already aligned map.
- Try rapid Tidy/edit/undo sequences.

Pass: Tidy is secondary, truthful, and reversible.

## Route 7: Prepare and present

- Enter Present mode.
- Exit with Escape.
- Print.
- Export PNG, PDF, and SVG.
- Export with blank values and long labels.
- Confirm exported output matches the visible map.

Pass: no editing chrome leaks into presentation/output and export failures are actionable.

## Route 8: Return later and switch context

- Reload after edits.
- Switch clients and return.
- Open two tabs.
- Hide the writer tab.
- Return to it.
- Close/crash a tab and recover in another.
- Edit while a handoff is occurring.

Pass: the active advisor can edit; no stale writer lease strands the UI; no data is lost.

## Route 9: Recovery and hostile storage

- Load malformed saved JSON.
- Download recovery copy.
- Start fresh.
- Block storage/file access where possible.
- Cancel file selection.
- Open valid and invalid backups.

Pass: recovery is explicit, safe, and never claims a save that did not happen.

## Route 10: Zoom, viewport, and keyboard

Run at browser zoom 80%, 100%, 125%, 150%, and 200%, plus 1280x720, 1024x768, 900x700, and 640x360.

- Tab through every control.
- Open menus with keyboard.
- Use arrows, Enter, Space, Escape, undo, redo, and delete.
- Inspect popover clipping, panel overlap, canvas panning, and text clipping.

Pass: every core route remains usable, focus remains visible, and no control becomes unreachable.

## Issue record

For every failure record:

- Journey and exact step
- Severity: blocker / high / medium / polish
- Environment and browser zoom
- Expected result
- Actual result
- Reproduction rate
- Screenshot/video
- Whether data changed or was lost
- Likely overlapping systems: state, persistence, layout, focus, rendering, or copy

## Coverage rule

A release candidate is not dogfood-complete until every blocker/high route passes, stale tests target the current UI, and at least one run has exercised browser lifecycle events (background, reload, close, and multi-tab handoff).
