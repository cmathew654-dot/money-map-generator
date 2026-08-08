# Coding Conventions

**Analysis Date:** 2026-08-08

## Naming Patterns

**Files:**
- React components: `PascalCase.tsx` (e.g., `src/ui/EditorPanels.tsx`, `src/App.tsx`, `src/render/MapSvg.tsx`)
- Utility modules: `camelCase.ts` (e.g., `src/model/math.ts`, `src/layout/textfit.ts`)
- CSS files: `kebab-case.css` (e.g., `app.css`, `form.css`, `pills.css`, `selection.css`, `print.css`)
- Test files: `name.test.ts` or `name.test.tsx` for unit tests; `name.spec.ts` for e2e tests

**Functions:**
- Camel case for all function names (e.g., `runwayLine`, `gapLine`, `clampZoom`, `openApp`, `focusPage`)
- Exported helper functions follow camelCase (e.g., `canMutateBook`, `flowEndpointsFromSelection`, `noteSpawnPoint`)

**Variables and Constants:**
- Local variables: camelCase (e.g., `activeClient`, `connectedFile`, `mapTextEdit`, `selectedMapTargetKey`)
- Module constants: UPPER_SNAKE_CASE (e.g., `MIN_ZOOM`, `MAX_ZOOM`, `WRITER_HEARTBEAT_MS`, `BOOK_STORAGE_KEY`)
- CSS custom properties in form.css: `--fm-[purpose]` (e.g., `--fm-ink`, `--fm-muted`, `--fm-hairline`, `--fm-surface`, `--fm-flow`, `--fm-need`)

**Types:**
- TypeScript types: PascalCase (e.g., `EditorPanel`, `BookSnapshot`, `BrowserSaveStatus`, `MapZoom`, `AppDialog`, `FileStoreApi`)
- Union types written inline or with type aliases

**CSS Classes:**
- Kebab-case for all class names (e.g., `.map-page`, `.editor-panel`, `.client-form`, `.data-form-filter`, `.action-bench`)
- BEM-inspired variants with single hyphens (e.g., `.app-status-banner.is-demo`, `.wizard-step-button.is-current`)
- Data attributes used sparingly (e.g., `data-account-id`, `data-map-selected`, `data-form-section`)

## Code Style

**Formatting:**
- Prettier enforced (configured via implicit defaults)
- Line length: No explicit limit enforced
- Indentation: 2 spaces (visible in all source files)
- Semicolons: Required (TypeScript strict mode)

**Linting:**
- TypeScript strict mode enabled (`"strict": true` in tsconfig.json)
- No unused locals allowed (`"noUnusedLocals": true`)
- No unused parameters allowed (`"noUnusedParameters": true`)
- No fallthrough cases in switch statements (`"noFallthroughCasesInSwitch": true`)

**Type Checking:**
- ES2022 target with full ES2022, DOM, and DOM.Iterable libraries
- `moduleResolution: bundler` for modern bundler support
- React 19.1.0 with `jsx: react-jsx` (automatic JSX transform)
- `isolatedModules: true` for safe compilation by individual tools

## Import Organization

**Order:**
1. React hooks and types (e.g., `import { useState, useCallback, useRef } from 'react'`)
2. Internal data/model imports (e.g., `import { newBook, addClient } from './model/book'`)
3. Layout/calculation imports (e.g., `import { layoutMap, layoutOverrideRect } from './layout/layout'`)
4. Rendering/interaction imports (e.g., `import { MapSvg } from './render/MapSvg'`)
5. UI component imports (e.g., `import { Dialog } from './ui/Dialog'`)
6. CSS/style imports last (e.g., `import './styles/print.css'`)

**Type imports:**
- Use `type` keyword explicitly for type-only imports: `type PointerEvent as ReactPointerEvent`
- Grouped with regular imports from same module

**Re-exports:**
- Barrel files used in UI layer (e.g., `Menu` exports `MenuItem`, `MenuSeparator`)
- No aliasing on import, only destructuring

## Error Handling

**Patterns:**
- Try/catch for file operations and async operations (`src/App.tsx` lines 1030-1076)
- Early returns for guard clauses (e.g., `if (!canMutate) return`)
- Error type checking with `instanceof` (e.g., `error instanceof DOMException`, `error instanceof BookValidationError`)
- Safe JSON.parse with try/catch (line 853: `JSON.parse(event.newValue)`)
- Errors rendered to user via dialog system: `showError(title, error, fallback)` function (lines 1222-1228)
- Optional chaining and nullish coalescing used liberally (`??`, `?.`)

**What NOT to throw:**
- Errors are caught and handled, not re-thrown (file operations fallback to browser storage)
- Silent failures acceptable for non-critical operations (e.g., IndexedDB unavailable, storage events)

## Logging

**Framework:** `console` only — no logging library

**Patterns:**
- No production logging observed
- No debug logging in codebase
- Console calls avoided to keep bundle clean
- State changes tracked via React DevTools or browser storage inspection

## Comments

**When to Comment:**
- Complex algorithmic logic (e.g., selection reducer, layout freeze logic)
- Non-obvious architectural decisions (e.g., `handleClientChange` freezing the as-needed chip)
- Cross-file dependencies and why they exist
- Lane ownership markers (e.g., "s51 T-FORM lane: Data panel facelift styles")
- Known limitations with upgrade paths (e.g., "ponytail:" comments marking corners cut)

**Style:**
- Multi-line comments for complex reasoning (see `App.tsx` lines 310-317, 342-348)
- Inline comments for specific gotchas (see `selection.css` lines 3-8)
- Lane ownership comments in CSS (see `form.css` line 1, `pills.css` line 1)
- No JSDoc used; inline types preferred

**Deliberate Simplifications:**
- Marked with `ponytail:` prefix naming the ceiling and upgrade path
- Example: `// ponytail: global lock, per-account locks if throughput matters`
- Example: `// ponytail: fullscreen shrinks back after this commit...`

## Function Design

**Size:** Functions average 10–30 lines; complex handlers in App.tsx reach 50–80 lines due to state coordination

**Parameters:**
- Destructured from objects when more than 2 params (e.g., `{ kind, clientId, name }` in AppDialog type)
- Callback functions passed inline or via `useCallback`
- Optional params use trailing `?:` in type signatures

**Return Values:**
- Early returns preferred for guards (`if (!x) return false`)
- Reducers return state by identity when no change occurred (e.g., selection reducer)
- Async functions return `Promise<void>` or `Promise<T>` consistently
- Explicit `null` for optional returns (e.g., `runwayLine` returns `string | null`)

**Closure Usage:**
- Refs used for stable identity across renders (`useRef` for persistent objects)
- Capture state via `useCallback` deps array, never rely on stale closures
- State refs (snapshotRef, historyRef) updated alongside setState calls for immediate access

## Module Design

**Exports:**
- Named exports preferred (e.g., `export function clampZoom(...)`)
- Default exports only for React components (`export default function App() {}`)
- Types always exported explicitly: `export type EditorPanel = ...`

**Barrel Files:**
- `src/ui/Menu.tsx` exports `Menu`, `MenuItem`, `MenuSeparator` as named exports
- No index.ts barrel files in src/ tree; imports are explicit paths

**Shared Utilities:**
- `src/model/` contains pure data transformations (book, math, types)
- `src/layout/` contains layout calculations (never mutates data)
- `src/render/` contains rendering logic and selection management
- `src/ui/` contains reusable components

## CSS Architecture & Custom Properties

**Design System (form.css):**
The form panel establishes a semantic color system via CSS custom properties. All properties are scoped to `.client-form`:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--fm-ink` | `#1c2422` | Primary text color |
| `--fm-muted` | `#47504d` | Secondary/helper text |
| `--fm-hairline` | `#dde1dc` | Borders and dividers |
| `--fm-section` | `#f4f6f2` | Section background (sticky headers) |
| `--fm-surface` | `#ffffff` | Card/input background |
| `--fm-flow` | `#1e7a4a` | Accent (flows, focus states) |
| `--fm-need` | `#c03a2d` | Danger/warning color |

**Left Panel Input Controls:**
Defined in `src/styles/app.css` lines 698–704:
- `.editor-panel-field` containers with 4px gap
- `.editor-panel-field input` and `.editor-panel-field select` set to `width: 100%`, `min-height: 32px`, `padding: 5px 7px`
- Focused inputs get `border-color: #1e7a4a` and `outline: 2px solid #1e7a4a` (focus-visible state, lines 123–130)

**Form-Specific Selectors (form.css):**
- `.data-form-filter input` — search bar with icon (lines 60–75)
- `.editor-panel .account-summary` — ledger row (lines 197–209)
- `.editor-panel .account-body input` — nested account fields (lines 290–305)
- `.editor-panel .need-fields input` — need field inputs (lines 426–431)

All input/select styling in the editor panel uses CSS custom properties and matches the form theme system.

**Theme System:**
- Light theme (default): colors defined in `:root` (`app.css` lines 33–38) and scoped overrides in form.css
- No dark theme CSS present; single color palette
- Focus visible uses green (`#1e7a4a`) on all interactive elements
- Forced colors mode supported via `@media (forced-colors: active)` (lines 2354–2411)

**Animations:**
- Entrance animations: `.quiet-enter` fade + slide (lines 2115–2120)
- Transitions: 120–160ms for smooth state changes (e.g., `.account-row-chevron` 140ms, form.css line 249)
- Reduced motion respected: `@media (prefers-reduced-motion: reduce)` disables all transitions

## Cross-Cutting Concerns

**Logging:** None — no logging framework or middleware

**Validation:**
- Form validation not visible in App.tsx; handled in model layer (`BookValidationError` is caught and displayed)
- Type system enforces many constraints (strict TypeScript)
- Input sanitization via React (no XSS attack surface in form inputs)

**Authentication:** Not applicable (single-user browser app with optional file I/O)

**Authorization:** Browser-level (read-only writer lease system in `src/model/browserStore.ts`)

**State Management:**
- React hooks (useState, useReducer, useCallback, useRef, useMemo, useLayoutEffect, useEffect)
- No Redux, Zustand, or other state library
- localStorage for persistence (book data, UI hints, writer lease)
- IndexedDB for file handles (optional, graceful fallback to localStorage)

## Branch/Fork Strategies

**Multi-Tab Coordination:**
- Writer lease system: one tab owns the write lock via localStorage
- Heartbeat polling every `WRITER_HEARTBEAT_MS` (10 seconds) to detect disconnected writers
- Takeover requests via storage events (`WRITER_TAKEOVER_REQUEST_KEY`)
- Cross-tab book sync via storage event listener on `BOOK_STORAGE_KEY`
