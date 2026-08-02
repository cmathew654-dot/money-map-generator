# Canvas-First Editor Design

## Status

Approved direction. This specification supersedes the left-editor and inspector-alignment portions of `2026-08-02-editor-tidy-design.md`. The existing map-level **Tidy map** behavior remains in scope as described below.

## Problem

The map is the product, but the current workspace gives a permanent 420px form pane equal visual weight. The pane exposes the entire data model at once, consumes the space needed to inspect the map, produces a long tab sequence, and separates the field being edited from its visual result.

The canvas already has a stronger selection-driven inspector, direct text editing, dragging, zoom, and quick-add controls. The two editing models compete with one another. Their pointer affordances are also ambiguous: editable text lives inside draggable card groups, so hovering text can highlight the whole card while dragging the same text creates a persistent text-position override.

The current **Snap to alignment** inspector action is also misleading. It only moves one selected item by at most 24 artboard units toward the closest nearby edge or center. Dragging already applies the same snapping. The action is easy to miss visually, gives no useful feedback, and sounds like it will align more than it actually does.

## Goals

- Make the canvas the default and dominant editing surface.
- Keep every financial field discoverable and editable without permanently displaying every field.
- Use selection to show only controls relevant to the selected map object.
- Give card bodies, editable text, connectors, and the canvas background unambiguous pointer behavior.
- Prevent accidental text-position changes and provide simple recovery for existing text offsets.
- Replace the ambiguous local snap command with visible drag snapping and explicit multi-selection alignment.
- Add the highest-value canvas-editor quality-of-life features without turning the product into a general-purpose diagram editor.
- Preserve the current book format, one-state-owner architecture, undo/redo, persistence, writer ownership, calculations, export, print, Present mode, and blank-dollar behavior.

## Non-goals

- Infinite canvas, minimap, arbitrary grouping, arbitrary locking, rich text, freehand drawing, or a plugin system.
- A new state framework, persistence system, or runtime dependency.
- A speculative graph-layout engine. **Tidy map** continues to restore the generated Money Map arrangement; it does not invent a new financial structure or flow meaning.
- Hiding advanced financial data or making direct canvas manipulation the only way to edit.

## Interaction model

The workspace has five persistent zones:

1. **Header** — client search, New, Undo, Redo, Book, Reset, Present, Print, and Export.
2. **Editor rail** — labeled **Add**, **Data**, **Contents**, and **Help** actions.
3. **Canvas** — the full Money Map workspace and default focus.
4. **Contextual inspector** — quick actions for the current selection.
5. **Canvas toolbar** — Tidy map, text note, account quick-add, zoom, and Fit.

The editor rail is 72px wide and uses icons plus short text labels. It must not rely on unlabeled icons. The canvas occupies all remaining space when no rail panel is open.

**Add**, **Data**, and **Contents** open one shared 380px panel next to the rail. Opening one closes the others. The panel is always dismissible. At CSS viewports below 1180px, and under zoom conditions that produce the same available width, it overlays the canvas instead of pushing the map below or off screen.

The old **Guide me / Full form** toggle is removed from the normal workspace. Guided setup is available when creating a client and from an explicit **Start guided setup** action in Data. It is not a permanent editor mode.

## Data panel

The Data panel is the complete, explicit answer to “where do I enter this?” It contains every existing financial field and preserves null dollar values as blanks.

Its sections are:

- Client — title, year, map type, runway/gap visibility.
- Income — income sources, amounts, period, qualifier, and after-tax income.
- Accounts — account name, type, shape, caption, value, positions, and nested accounts.
- Need — monthly amount needed, qualifier, and monthly account withdrawal.
- Fine print.
- Notes.

The panel has a sticky section navigator and a filter that matches section, account, income-source, and field labels. Filtering never changes map data.

Selection is synchronized in both directions:

- Selecting Income, Need, an account, or a note on the canvas highlights its Data section.
- Opening **Details** from the contextual inspector opens Data and focuses that section.
- Selecting or focusing a Data record highlights and, when necessary, brings the corresponding map object into view.
- Closing Data leaves the canvas selection intact.

All fields update the same canonical `MoneyMapData` owned by `App`. A panel may hold a display draft only while its input is focused; it may not hold a second book or client snapshot. Valid numeric input updates the map during typing. Blank money input remains `null`. Clear, reset, undo, client switching, and writer handoff cancel obsolete display drafts so pending work cannot resurrect older state.

## Add panel and empty states

The Add panel groups creation by financial meaning:

- Income source.
- Account, using the existing account presets.
- Monthly need.
- Flow.
- Text note.
- Fine-print line.

Creating an item selects it, shows its contextual inspector, and exposes **Details**. New accounts and income sources use the existing blank-value semantics.

An empty map teaches the model with three primary actions: **Add income**, **Add account**, and **Set monthly need**. It also links to **Open all data fields**. These actions disappear once the corresponding content exists.

## Contents panel

Contents is a searchable outline of the current map, not a generic layers system. It groups:

- Income and monthly need.
- Accounts.
- Flows.
- Notes and fine print.

Hovering an outline row highlights the map object. Activating a row selects the object and brings it into view. Warnings appear beside their related objects in plain language. Hidden generated flows are represented and can be restored from their row.

## Contextual inspector

The existing selected-object inspector remains the visual foundation. It shows quick, selection-specific actions and a clearly labeled **Details** action. Exhaustive content editing belongs in Data; the inspector must not become another full form.

| Selection | Inspector controls |
| --- | --- |
| Income | Details, add source, add flow, size, reset position |
| Monthly need | Details, add flow, size, reset position |
| Account | Details, account type, shape, add flow, duplicate, size, rotate, reset appearance, delete |
| Flow | From, To, style, color, curve, reset flow, delete or hide |
| Note | Details, duplicate, size, background, reset appearance, delete |
| Editable text | Edit text, font size, reset text position |
| Multiple accounts/notes | Align, distribute, duplicate, reset positions |

Dangerous actions remain visually separated. Controls use user language and never expose override keys, reducer names, or persistence terminology.

## Pointer and selection behavior

Every point on the map has one primary interaction:

- **Text hover:** underline or quiet text highlight plus text cursor. No card shadow.
- **Text click:** edit the text or amount.
- **Card-body hover:** quiet outline plus grab cursor.
- **Card-body drag:** move the complete card.
- **Selected card:** persistent selection outline and connector handles.
- **Connector hover:** connection cursor and endpoint emphasis.
- **Canvas-background drag:** pan only when zoomed.

Editable account text is not freely draggable in the default mode. Existing per-text offsets remain compatible and render unchanged, but changing them requires an explicit **Move text** action in the inspector. Escape cancels Move text. Finishing or cancelling the action returns to ordinary text editing.

**Reset text position** removes the selected text offset. **Reset selected appearance** removes the selected object’s layout, rotation, size, and text offsets without changing financial content. The Reset menu also offers **Reset all text positions** with confirmation and one-step Undo so maps damaged by accidental text drags can be repaired.

## Alignment and Tidy

The standalone **Snap to alignment** inspector button is removed.

Single-object dragging continues to snap to nearby left, center, right, top, middle, and bottom guides. A guide is visible while the snap is active. Holding the existing bypass modifier disables snapping for precise placement.

Shift-click or Ctrl/Cmd-click adds or removes accounts and notes from the selection. Multi-selection exposes:

- Align left, horizontal center, or right.
- Align top, vertical middle, or bottom.
- Distribute horizontally or vertically when at least three compatible items are selected.

Each alignment or distribution command is one undoable action and never changes financial content.

**Tidy map** remains a map-level command. It removes manual layout overrides and restores the deterministic generated arrangement while preserving all financial content, notes, flows, and saved-book compatibility. It is disabled when the map already matches the generated arrangement and reports **Map layout reset** after completion.

## Flow creation

Selecting Income, Need, or an account shows a connector handle. Dragging the handle previews a flow. Eligible destinations highlight; dropping on an eligible destination creates one custom flow and selects it. Escape or dropping on empty canvas cancels without history.

The inspector’s **Add flow to** control remains as the keyboard-accessible alternative. Duplicate and self-referential flows remain prohibited by the existing model helpers.

## Client and command discovery

The active-client control becomes a searchable combobox suitable for 100–200 clients, reusing the project’s existing autocomplete behavior. Search matches household title and year. Keyboard navigation, Escape, Enter, and focus restoration follow standard combobox behavior.

Help opens a compact keyboard and interaction reference. Required shortcuts:

- Enter — edit or open Details for the selected object.
- Escape — cancel the current operation, close the current panel, or clear selection in that order.
- Arrow keys — nudge the selection; Shift increases the step.
- Ctrl/Cmd+D — duplicate compatible selected objects.
- Delete/Backspace — delete compatible selected objects after the existing safety rules.
- Ctrl/Cmd+C and Ctrl/Cmd+V — internal copy/paste for accounts and notes.
- Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z or Ctrl+Y — undo and redo.
- `?` — open Help when focus is not in a text field.

Income and Need are semantic singletons and cannot be copied, duplicated, or deleted as objects.

## Feedback, history, and saving

Every command that changes the model produces one history entry and plain-language feedback. Examples include **Account duplicated**, **Flow added**, **Text position reset**, and **Map layout reset**.

The header retains visible save state. Errors remain persistent until resolved. Success messages are brief and do not obscure the contextual inspector. Undo and Redo always describe the actual model state rather than panel state.

Panel visibility, active Data section, Contents filter, and Help visibility are interface state. They are not part of the Money Map book and do not participate in financial history. Selection may remain interface state, but commands applied to a selection update the canonical model once.

## Accessibility and responsive behavior

- Preserve WCAG 2.2 AA targets, visible focus, forced-colors support, and reduced-motion behavior.
- All canvas commands have keyboard equivalents; connector dragging retains the inspector-select alternative.
- Opening a panel moves focus to its heading or requested record. Closing returns focus to the rail action that opened it.
- Selecting through Contents places programmatic focus on the corresponding canvas object without triggering an edit.
- At 200% browser zoom and narrow widths, rail panels overlay the canvas and remain independently scrollable. The map is never pushed below the full Data form.
- Present mode removes the rail, panels, inspector, canvas toolbar, selection visuals, and editing hit areas.
- Print and export remain free of editor chrome.

## State and implementation constraints

- `App` remains the sole owner of book, client, history, writer, persistence, selection, and panel state.
- Existing pure book, layout, formatting, and map-interaction helpers are reused.
- No new runtime or development dependency.
- No context provider or new state framework.
- Existing saved books and layout overrides continue to load.
- Content edits and layout edits remain separate in the model.
- Destructive commands invalidate obsolete focused-input drafts before applying their canonical update.

## Delivery sequence

The feature is delivered as one coherent branch but implemented in independently verifiable slices:

1. Correct pointer ownership, remove implicit text dragging, add text-reset recovery, and remove **Snap to alignment**.
2. Introduce the rail and canvas-first shell; move the existing complete form into an on-demand Data panel.
3. Add Add and Contents panels plus synchronized selection/focus.
4. Extend contextual inspectors and direct creation/editing paths.
5. Add searchable clients, multi-selection alignment/distribution, connector handles, internal copy/paste, Help, and action feedback.
6. Complete responsive, accessibility, browser-resilience, visual, and saved-book compatibility verification.

No slice may introduce a second canonical data owner or temporarily allow a panel draft to overwrite a newer book state.

## Acceptance criteria

- A freshly opened existing map shows the full canvas with only the compact rail; the complete form is not permanently visible.
- Every field previously available in Full form remains reachable through Data and keyboard navigation.
- New users can discover Add and Data without a shortcut or hidden gesture.
- Selecting a map object and opening Details focuses the correct Data record.
- Editing Salary/Wages updates the rendered Income card during the intended input interaction without a canvas gesture.
- Hovering or editing text never applies the card-drag hover treatment.
- Dragging text in normal mode never creates a text-position override.
- Dragging a card body moves the complete card and no financial content.
- Existing accidental text offsets can be reset individually or together without changing content.
- **Snap to alignment** no longer appears.
- Active snap guides are visible during card dragging.
- Multi-selection alignment and distribution are deterministic, content-preserving, and one-step undoable.
- **Tidy map** restores the generated arrangement, preserves content, and is one-step undoable.
- Clear and Reset remain correct with Data open, a field focused, after drag, after autosave, and after reload.
- Connector drag and the keyboard-accessible Add-flow control produce the same valid model result.
- Search finds any of 100–200 clients by household title or year.
- Contents can select every account, flow, note, Income, and Need object.
- Present, print, PNG, PDF, and SVG output contain no editor UI.
- Existing books with manual layout and text offsets load without data loss.
- Windows Chrome and Edge plus macOS Chrome, WebKit, and native Safari certification remain green.

