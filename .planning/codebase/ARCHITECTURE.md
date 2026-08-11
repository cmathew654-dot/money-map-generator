<!-- refreshed: 2026-08-08 -->
# Architecture

**Analysis Date:** 2026-08-08

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     App (React Root)                         │
│  `src/App.tsx` — Orchestrates state, routing, persistence    │
├──────────────────┬──────────────────┬───────────────────────┤
│   Data Panel     │   Canvas (SVG)   │   Right-Hand Panels   │
│    (Form)        │   (MapSvg)       │   (Add/Contents)      │
│  `src/form/`     │  `src/render/`   │  `src/ui/Editor*`     │
│  `src/ui/Form`   │                  │                       │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management                           │
│  Snapshot + History | Selection | UI State | MapTextEdit    │
│  All in App.tsx, passed as props to child components        │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Model Layer                             │
│  Book, Accounts, IncomeSource, MapNote, CustomArrow         │
│  `src/model/types.ts`, `src/model/book.ts`                  │
│  Browser storage, File I/O                                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| App | State orchestration, history/undo, file I/O, browser persistence, focus management | `src/App.tsx` (~2500 lines) |
| Form | Left-panel data entry UI for all sections (client, income, need, accounts, notes) | `src/form/Form.tsx` (~1600 lines) |
| Wizard | Guided setup flow for new clients, step navigation | `src/form/Wizard.tsx` |
| MapSvg | Canvas rendering, SVG generation, pointer event handling | `src/render/MapSvg.tsx` |
| EditorPanels | Right-hand panels (Add, Contents, Help) for map operations | `src/ui/EditorPanels.tsx` |
| EditorRail | Bottom toolbar, keyboard shortcuts, command buttons | `src/ui/EditorRail.tsx` |
| MapTextEditor | In-canvas text editing UI, font size control | `src/ui/MapTextEditor.tsx` |
| Selection Reducer | Single source of truth for map item selection | `src/render/selection.ts` |

## Pattern Overview

**Overall:** Unidirectional data flow with React hooks for state management.

**Key Characteristics:**
- **Single state owner**: App.tsx holds book snapshot, history, UI state, selection
- **Immutable updates**: All mutations create new objects, pushed to history
- **Hook-based**: useReducer for selection, useState for UI flags, useRef for imperative handles
- **Prop drilling**: State passed down, callbacks passed up through component tree
- **No external state management**: React only, no Redux/Zustand/Context

## Layers

**App Layer (Orchestration):**
- Purpose: Top-level state management, history/undo, file persistence, tab coordination
- Location: `src/App.tsx`
- Contains: snapshot state, history state, UI state (editorPanel, dataFilter, selection)
- Depends on: model, form, render, ui components
- Used by: Browser, rendered as root

**Form/UI Layer (Data Entry):**
- Purpose: Render and collect edits from the left-hand data panel
- Location: `src/form/Form.tsx`, `src/form/Wizard.tsx`
- Contains: Form sections (client, income, need, accounts, notes), field components
- Depends on: model types, vocabulary builder
- Used by: App via EditorRail panel toggle

**Canvas/Render Layer (Visualization):**
- Purpose: SVG rendering, layout calculations, interactive pointer handling
- Location: `src/render/`, `src/layout/`
- Contains: SVG drawing, arrow layout, collision detection, text positioning
- Depends on: model types, layout calculations
- Used by: MapSvg component, selection interactions

**Model Layer (Domain):**
- Purpose: Data structure definitions, book manipulation, validation
- Location: `src/model/`
- Contains: Book structure, account/income operations, persistence APIs
- Depends on: None
- Used by: All layers

**Storage Layer (Persistence):**
- Purpose: Browser localStorage, file I/O, recovery management
- Location: `src/model/browserStore.ts`, `src/model/filestore.ts`
- Contains: Tab-based writer leasing, IndexedDB fallback, encryption-less JSON
- Depends on: model types
- Used by: App at startup and on state changes

## Data Flow

### Primary Request Path: User Edits Data Panel → Canvas Updates

1. **User types in form field** (`src/form/Form.tsx` field onChange)
   - Field component calls `onChange(newValue)` from FormProps
   
2. **Form onChange prop** (App.tsx ~line 60: `<Form onChange={handleClientChange} />`)
   - Form passes edited MoneyMapData to App's handler
   
3. **App calls handleClientChange** (~line 1373)
   - Wraps edited client in `freezeAsNeededChip` (layout-preserving state)
   - Calls `commitSnapshot({ book: updateClient(...), activeClientId })`
   
4. **commitSnapshot** (~line 636)
   - Checks `canMutate` (demo mode or browser writer lease held)
   - Calls `pushHistory` to record undo point
   - Calls `showSnapshot` (setState wrapper)
   - Triggers `useEffect` at line 805 (book dependency)
   
5. **Browser save effect** (~line 805)
   - Triggers 400ms debounce
   - Calls `saveBrowserBook(localStorage, book)`
   - Sets browserSaveStatus
   
6. **Canvas re-renders**
   - MapSvg receives updated `activeClient` prop
   - Calls `layoutMap` to recalculate positions (~line 514)
   - SVG rerenders via React reconciliation

### Selection Flow: Map Click → Details Panel Opens

1. **Map pointer down** (MapSvg ~line 68: `onPointerDown`)
   - Emits click event with target key and modifiers
   
2. **App handler** (handleMapElementClick ~line 1337)
   - If `editorPanel === 'data'`, calls `focusDataTarget(section, id)`
   
3. **focusDataTarget** (~line 1315)
   - Sets `editorPanel = 'data'`
   - Sets `dataSection` to the form section
   - Increments focusRequestCounter, sets focusRequest
   - Bumps `formRevision` to trigger form re-render
   
4. **Form receives focusRequest prop**
   - IncomeSection/AccountCard effects hook into `focusRequest`
   - `usePendingFocus` resolves on next layout, focuses the targeted field
   
5. **Selection state**
   - Parallel: `dispatchSelection({ type: 'canvas/click', key, ... })`
   - Selection reducer updates anchor and keys
   - MapInspector can show details for the selected item

### Secondary Flow: Data Panel Row Click → Canvas Selection

1. **Form AccountCard button click** (~line 865 in Form.tsx)
   - Calls `onSelectAccount(accountId, { modified: shiftKey || ctrlKey })`
   
2. **App's handler** (receives via Form prop)
   - Routes to `dispatchSelection({ type: 'panel/rowClick', accountId, modified })`
   
3. **Selection reducer** (~line 132)
   - primary() call with `modified` flag
   - Updates keys and anchor
   
4. **Selection updates map focus**
   - MapInspector shows inspector for selected account
   - Rotate handle appears on canvas

### Text Editor Flow: Click Map Text → Inline Edit

1. **Map click lands on text** (MapSvg, target.kind === 'edit')
   - Calls `handleMapElementClick({ kind: 'edit', edit: target, ... })`
   
2. **App sets mapTextEdit state** (~line 1338)
   - Stores target, rect, anchorRect, rawValue, fontSize
   
3. **MapTextEditor opens** (rendered conditionally when `mapTextEdit !== null`)
   - Overlay positioned at target rect
   - FontSize slider, save/cancel controls
   
4. **User edits text or font**
   - onChange calls `applyMapTextEdit` or `applyMapTextFontSize`
   - Returns new MoneyMapData
   - Calls `commitSnapshot`
   
5. **Editor closes**
   - User clicks save/cancel or presses Escape
   - `closeMapTextEditor` clears `mapTextEdit` state
   - Flag `discardMapTextCommitRef` prevents accidental commits

### State Management: Snapshot vs History

| State | Owner | Updates | Undo-able |
|-------|-------|---------|-----------|
| `snapshot` | App.useState | `commitSnapshot` pushes to history | Yes |
| `history` | App.useState | `pushHistory` appends undo step | Yes |
| `selection` | App.useReducer | `dispatchSelection` | No (pruned on client change) |
| `mapTextEdit` | App.useState | Direct setState | No (discarded on close) |
| `editorPanel` | App.useState | setEditorPanel | No |
| `formRevision` | App.useState | bumpFormRevision | No (forces form re-render) |

**Baseline tracking**: `historyBaselineRef` stores snapshot before chip-freeze gesture, so the pre-freeze state becomes the undo target when the edit commits.

## Key Abstractions

**BookSnapshot:**
- `{ book: MoneyMapFile, activeClientId: string }`
- Immutable record of app state at a point in time
- Pushed to history on edit, restored on undo

**FormSection:**
- Type: `'client' | 'income' | 'accounts' | 'need' | 'notes'`
- Maps form layout to data model sections
- Used to auto-scroll form when a map item is selected

**MapItemKey:**
- Format: `account:${id}` | `note:${id}` | `arrow:custom:${id}` | `text:${role}:${owner}:${role}` | `income` | `need`
- Uniquely identifies every selectable canvas element
- Routes selection back to data panel via `dataTargetForMapKey`

**LayoutOverride:**
- `{ dx, dy, fs, w, h, rot, bow, startT, endT, startAt, endAt, style, color, sw }`
- Persisted position/rotation/font tweaks for every map element
- Survives undo (part of MoneyMapData)

**MoneyMapData (Client):**
- Contains: income, need, accounts, custom arrows, notes, layout overrides, footnotes
- Referred to as "activeClient" in App.tsx (~line 490)
- One per client in the book file

## Entry Points

**App.tsx:**
- Location: `src/App.tsx`
- Triggers: Browser loads index.html
- Responsibilities: Render root component, initialize state from localStorage, set up event listeners
- Exports: default App component

**main.tsx:**
- Location: `src/main.tsx`
- Triggers: Vite dev server or production build
- Responsibilities: Mount React root to DOM
- Code: ~5 lines, standard React bootstrap

## Architectural Constraints

- **Threading:** Single-threaded event loop. No workers. Browser main thread only.
- **Global state:** `localStorage` for cross-tab coordination (writer lease, book snapshot). Tab ID stored in sessionStorage-like state to break ties.
- **Circular imports:** Selection.ts → mapInteraction.ts (type check only, no actual circ-dep).
- **History depth:** Unbounded in-memory array. No size cap. ~500 undo steps typical for a session before performance degrades.
- **File persistence:** localStorage ~5MB limit (book + recovery + metadata). Fallback to IndexedDB (~50MB). No sync between tabs after init — last-write-wins within a lease period.
- **Map rendering:** Vectorial, no raster. Re-layouts fully on every data change (not incremental). Zoom applied at viewport level (CSS transform or SVG viewport), not in layout.

## Anti-Patterns Observed

### 1. Prop Drilling Through Many Layers

**What happens:** Form receives 15+ props from App; child components receive subsets; adds noise to signatures.

**Why it's wrong:** Hard to refactor, props become implicit documentation contracts, easy to miss prop additions.

**Do this instead:** React Context for form props (focusRequest, vocabulary, formRevision) that never change mid-mount. Keep onChange as a callback prop (it is the dependency boundary).

### 2. Multiple State Owners for Related Concerns

**What happens:** editorPanel, dataSection, dataFilter, focusRequest, and formRevision all live in App and control form focus/scroll behavior in different ways.

**Why it's wrong:** Race conditions when multiple effects update form visibility; hard to reason about focus order (why is focusRequest cleared on client change but dataSection persists until a map click?).

**Do this instead:** Consolidate to a single `formUiState: { section, filteredAccounts, focusedId, focusedAt }` object. Clear all on client change as a single setState call.

### 3. Ref Capture in Event Handlers

**What happens:** mapCommandFeedbackRef.current assigned in handlers, read later in effects. Same for discardMapTextCommitRef, historyBaselineRef.

**Why it's wrong:** Refs hide data dependencies; `useEffect` dependency arrays don't know to rerun when a ref changes; easy to stale-close over captured values.

**Do this instead:** For transient feedback (like "Flow added" toast), use a state machine: `type FormCommit = { kind, feedback }` in state, clear it in a cleanup effect. For baseline snapshots, store in state instead of a ref.

## Error Handling

**Strategy:** Try-catch at I/O boundaries (file read, localStorage access). Swallow silently or show toast on non-critical failures.

**Patterns:**
- File I/O: Catch and show dialog with error message (line 1221)
- localStorage access: Wrapped in try-catch, fallback to next strategy (e.g., line 712)
- Book validation: Custom BookValidationError type, rethrow with user message
- Export failures: Show error dialog, stay in edit mode (line 1287)

## Cross-Cutting Concerns

**Logging:** console.log in dev only (no logger imported). Errors logged to console.error.

**Validation:** Book structure validated on load (BookValidationError). No runtime validation on edits (assume valid state always).

**Authentication:** None. File permissions via File API (requestBookFilePermission). Browser writer lease via localStorage CAS loop.

---

*Architecture analysis: 2026-08-08*
