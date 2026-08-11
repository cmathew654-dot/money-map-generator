# Codebase Structure

**Analysis Date:** 2026-08-08

## Directory Layout

```
money-map-generator/
├── src/
│   ├── App.tsx                 # Root component, state orchestration
│   ├── main.tsx                # React bootstrap
│   ├── form/                   # Data panel (left side)
│   │   ├── Form.tsx            # Main form with all sections (~1600 lines)
│   │   └── Wizard.tsx          # Guided setup flow
│   ├── ui/                     # UI components (panels, dialogs, editors)
│   │   ├── EditorPanels.tsx    # Right-hand panels (Add/Contents/Help)
│   │   ├── EditorRail.tsx      # Bottom toolbar
│   │   ├── MapTextEditor.tsx   # Inline text editing overlay
│   │   ├── MapInspector.tsx    # Details panel for selected items
│   │   ├── Autocomplete.tsx    # Term suggestion for fields
│   │   ├── ClientCombobox.tsx  # Client selector dropdown
│   │   ├── Dialog.tsx          # Modal dialogs
│   │   ├── Toast.tsx           # Notification toasts
│   │   ├── Mark.tsx            # Semantic highlight for search
│   │   ├── Menu.tsx            # Context menus
│   │   └── SelectionBadge.tsx  # Selection count indicator
│   ├── render/                 # Canvas rendering & interaction
│   │   ├── MapSvg.tsx          # Main SVG canvas component
│   │   ├── mapInteraction.ts   # Pointer handlers, drag logic
│   │   ├── selection.ts        # Selection reducer (single source of truth)
│   │   ├── MapInspector.tsx    # Inspector for selected canvas items
│   │   ├── tokens.ts           # Design tokens (colors, dimensions)
│   │   └── mapInteraction.ts   # Map edits (add/delete/move items)
│   ├── model/                  # Data layer
│   │   ├── types.ts            # Domain models (Account, Book, etc.)
│   │   ├── book.ts             # Book manipulation (add/update/delete)
│   │   ├── browserStore.ts     # localStorage with tab coordination
│   │   ├── filestore.ts        # File I/O (FileSystemAccessAPI wrapper)
│   │   ├── format.ts           # Number/date/text formatters
│   │   ├── math.ts             # Financial calculations
│   │   ├── vocab.ts            # Vocabulary builder for autocomplete
│   │   └── samples.ts          # Default sample books
│   ├── layout/                 # SVG layout calculations
│   │   ├── layout.ts           # Main layout engine (~400 lines)
│   │   └── textfit.ts          # Font size auto-scaling
│   ├── export/                 # Export formatters
│   │   ├── export.ts           # High-level export orchestration
│   │   ├── pdf.ts              # PDF generation
│   │   └── ... (other formats)
│   ├── styles/
│   │   ├── print.css           # Print stylesheet
│   │   └── ... (other styles)
│   └── fonts/                  # Embedded font files
├── tests/
│   ├── unit tests (.test.ts)   # Model & utility tests
│   └── e2e/                    # Playwright browser tests
├── public/
│   ├── index.html              # Entry point
│   └── ... (assets)
├── docs/
│   ├── superpowers/            # Handoffs, plans, specs
│   └── ...
├── .planning/
│   └── codebase/               # This directory (ARCHITECTURE.md, STRUCTURE.md, etc.)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Directory Purposes

**src/App.tsx:**
- Purpose: Root React component, state management (snapshot, history, UI flags)
- Contains: All state (useState/useReducer), all event handlers, effect orchestration
- Key files: defines EditorPanel, FormSection, exported functions for routing
- ~2500 lines; central hub, intentionally large

**src/form/:**
- Purpose: Left-hand data entry panel
- Contains: Form.tsx (~1600 lines) with sections, field components, AccountCard
- Key files: FormProps interface, FormSection type, Form component export
- Separated from ui/ because it's domain-specific (financial form) not generic (button, dialog)

**src/ui/:**
- Purpose: Generic and app-specific UI components
- Contains: Panels, dialogs, editors, buttons, menus
- Key files: EditorPanels (add/contents/help), EditorRail (toolbar), MapTextEditor
- All receive data + callbacks from App; no local state except UI flags (expanded rows, filter text)

**src/render/:**
- Purpose: Canvas rendering and interaction
- Contains: MapSvg component, layout calculations, selection reducer, pointer handlers
- Key files: selection.ts (reducer), mapInteraction.ts (edit functions), MapSvg.tsx (render)
- Does not own state; App passes activeClient and dispatchSelection

**src/model/:**
- Purpose: Data structures and domain logic
- Contains: Type definitions, book operations, persistence
- Key files: types.ts (MoneyMapData, Account, etc.), book.ts (updateClient, etc.), browserStore.ts, filestore.ts
- No React imports; pure data layer

**src/layout/:**
- Purpose: Vectorial layout calculations (positions, sizes, rotations)
- Contains: layoutMap (main), textfit algorithms, override application
- Key files: layout.ts (~400 lines), called from MapSvg and App (~line 514)
- No DOM access; pure math and algorithms

**src/export/:**
- Purpose: Export handlers (PNG, PDF, SVG)
- Contains: Format-specific serialization
- Key files: export.ts (orchestration), pdf.ts (PDF generation), ...
- Called from App's handleExport (~line 1256)

**tests/:**
- Purpose: Automated test coverage
- Contains: Unit tests (.test.ts) for model layer, e2e tests (.spec.ts) for full app
- Key files: app-interactions-s49.test.tsx, canvas-editor.spec.ts (Playwright)
- Run with `npm test` (vitest) or `npm run test:e2e` (Playwright)

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React root mount
- `public/index.html`: HTML shell (references main.tsx)
- `src/App.tsx`: React component tree root

**Configuration:**
- `package.json`: Dependencies (React, vitest, playwright)
- `tsconfig.json`: TypeScript config
- `vite.config.ts`: Build/dev config
- `.prettierrc`: Code formatting
- `.eslintrc`: Linting (if present)

**Core Logic:**
- `src/model/types.ts`: MoneyMapData, Account, CustomArrow, all domain types
- `src/model/book.ts`: addClient, updateClient, deleteClient, all mutations
- `src/model/browserStore.ts`: localStorage persistence with writer lease
- `src/render/selection.ts`: selectionReducer, single source of truth for map selection
- `src/layout/layout.ts`: layoutMap, asNeededChipCenter, layout override application

**Testing:**
- `tests/app-interactions-s49.test.tsx`: Form interactions, focus flow
- `tests/e2e/canvas-editor.spec.ts`: End-to-end map editing with Playwright
- `tests/book.test.ts`: Book model mutations

**Styles:**
- `src/styles/print.css`: Print stylesheet for export
- Inline styles in components (CSS-in-JS not used; no CSS-in-JS library)

## Naming Conventions

**Files:**
- `*.tsx`: React components (JSX)
- `*.ts`: Pure TypeScript (no JSX)
- `*.test.ts`, `*.test.tsx`: Unit tests (vitest)
- `*.spec.ts`: E2E tests (Playwright)
- PascalCase for component files (`Form.tsx`, `MapSvg.tsx`)
- camelCase for utility/model files (`browserStore.ts`, `layout.ts`)

**Functions:**
- `handle*`: Event handlers (`handleClientChange`, `handleUndo`)
- `is*`, `should*`: Predicates (`isEditingTarget`, `canMutateBook`)
- `*Reducer`: Reducer functions (`selectionReducer`)
- `*Target`: Target objects/keys (`dataTargetForMapKey`, `selectedMapTargetKey`)
- Imperative/domain: `add*`, `update*`, `delete*` for mutations (`addClient`, `updateClient`)
- `use*`: React hooks (`usePendingFocus`)

**Variables:**
- `*Ref`: useRef values (`snapshotRef`, `historyRef`, `focusRequestCounter`)
- `*State`: State tuples from useState (`[editorPanel, setEditorPanel]`)
- Descriptive: `activeClient`, `selectedMapTargetKey`, `focusedAccountId`
- Prefixed by intent: `data*` for form data, `map*` for canvas, `browser*` for persistence

**Types:**
- PascalCase for interfaces/types (`MoneyMapData`, `BookSnapshot`)
- `*Props` for component prop interfaces (`FormProps`, `EditorPanelsProps`)
- `*Event` for event types (`SelectionEvent`)
- Generic: `<T>` for type parameters (rare; mostly concrete)

## Where to Add New Code

**New Feature (e.g., "Add a field to the Need section"):**
- **Data model**: Add property to MoneyMapData or Footnote in `src/model/types.ts`
- **Form UI**: Add field component in `src/form/Form.tsx` NeedSection (~line 482)
- **Form onChange**: Ensure Form's onChange handler captures the new field (already generic: passes full data object)
- **Book mutations**: If it's a client property, add to `clearedClient()` in `src/model/book.ts` so it's cleared on "Clear Map"
- **Tests**: Add to `tests/app-interactions-s49.test.tsx` or new test file

**New Component/Module:**
- **UI component**: Create in `src/ui/` if generic (Dialog, Menu patterns), or inline in parent if used once
- **Model logic**: Create in `src/model/` with pure functions, no React imports
- **Layout/render**: Create in `src/render/` if related to canvas, or `src/layout/` if pure math
- **Export**: Create in `src/export/` for new export format handlers

**Utilities/Helpers:**
- **Formatting**: Add to `src/model/format.ts` (money, date, text formatting)
- **Calculations**: Add to `src/model/math.ts` (financial math)
- **Layout**: Add to `src/layout/layout.ts` or `src/layout/textfit.ts`
- **Vocabulary**: Add to `src/model/vocab.ts` for autocomplete seeds

**Styles:**
- No global CSS file. Inline CSS in `src/styles/print.css` for print styles.
- All UI styles inlined via `className` attributes with CSS classes (stylesheets generated via build).
- If adding a major component (e.g., new panel), add its styles to `src/styles/` as a separate file and import in App.tsx.

## Special Directories

**docs/superpowers/handoffs/:**
- Purpose: Phase handoff documents for ongoing work
- Generated: Yes (via /gsd-execute-phase or manual)
- Committed: Yes
- Example: `2026-08-05-s54-handoff.md` — contains implementation notes and next steps

**docs/dogfood/:**
- Purpose: Testing routes and routes for internal testing (demo, visual regression checks)
- Generated: Yes (via build scripts)
- Committed: No (build output)
- Example: `s54-dogfood-route.html`

**.planning/codebase/:**
- Purpose: Architecture and structure docs for this project (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: Via /gsd-map-codebase
- Committed: Yes
- Updated: When codebase shape changes (new directories, major refactors)

**tests/**
- Purpose: Test files
- Committed: Yes
- Run: `npm test` (unit), `npm run test:e2e` (end-to-end)

---

*Structure analysis: 2026-08-08*
