# Editor Tidy Design

## Goal

Make map cleanup predictable and the editor easier to scan without changing financial meaning or user-authored content.

## Approved scope

### Tidy map

- Add one map-level **Tidy map** action.
- Produce the same layout from the same map state, and make repeated runs stable.
- Preserve semantic anchors: account identity and category, flow endpoints, calculated relationships, labels, values, notes, and all other content.
- Record the complete tidy operation as one undoable history entry.

### Inspector alignment

- Rename the inspector action from **Tidy** to **Snap to alignment**.
- Keep this as a local alignment operation for the selected item; it is distinct from map-level **Tidy map**.

### Left editor

- Refresh the left editor's visual hierarchy and controls so primary actions, sections, and field groups are easier to distinguish.
- Add a clear **+ Text note** affordance for user-authored map notes.
- Use semantic account colors consistently, and expose semantic color choices for custom arrows.

### Calculated text

- Auto-fit calculated runway and gap text when it can remain legible.
- Suppress calculated runway or gap text when it cannot fit without harming the map.
- Never apply this suppression behavior to user-authored notes.

## Boundaries

- Tidy changes layout, not financial data, copy, flow meaning, or note content.
- No speculative layout modes, color systems, or note types are included.
- This document defines behavior and scope only; implementation is intentionally deferred.

## Acceptance criteria

- A map tidied twice without intervening edits has the same layout after each run.
- One Undo restores the entire pre-tidy layout.
- **Tidy map** and **Snap to alignment** are visibly and behaviorally distinct.
- The left editor exposes the refreshed hierarchy, **+ Text note**, semantic account colors, and custom-arrow color control.
- Calculated runway/gap text fits or disappears safely; user notes remain present.
