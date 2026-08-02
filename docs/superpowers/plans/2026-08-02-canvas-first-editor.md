# Canvas-First Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. This session executes inline; do not delegate.

**Goal:** Replace the permanent full-form workspace with a canvas-first editor whose on-demand Data, Add, Contents, and Help tools remain complete and whose selection, dragging, alignment, flows, Tidy, reset, and persistence behavior are safe.

**Architecture:** `App.tsx` remains the sole owner of book, client, history, persistence, writer, selection, and panel state. Existing `Form`, `Wizard`, `MapSvg`, `MapInspector`, `mapInteraction`, book, layout, and history functions stay authoritative. New UI components receive current data and callbacks; they never retain a second `MoneyMapData` snapshot. New geometry operations are pure functions in the existing interaction module.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Playwright; no new dependency.

## Global Constraints

- Preserve null money values as blanks and all saved-book fields/layout overrides.
- Every model mutation routes through `handleClientChange` or `handleMapChange` and creates one existing history entry.
- Form focus/drafts never intercept editor shortcuts or revive data after Clear/Reset/client switching.
- Present, print, PNG, PDF, and SVG contain no editor chrome.
- Reuse `Form`, `Wizard`, `Toast`, autocomplete behavior, `addCustomArrow`, `tidyArrangement`, `withOverride`, and layout helpers.
- Use unique ports and time-bounded browser commands; label runner setup separately from app assertions.
- Do not push under `AGENTS.md`; finish with focused local commits and report the exact SHA.

---

## Task 1: Make pointer ownership honest and recoverable

**Files:**
- Modify: `src/render/MapSvg.tsx`
- Modify: `src/render/MapInspector.tsx`
- Modify: `src/render/mapInteraction.ts`
- Modify: `src/styles/app.css`
- Modify: `tests/mapedit.test.ts`
- Modify: `tests/map-inspector.test.tsx`
- Modify: `tests/map-interactions-s40.test.tsx`
- Modify: `tests/e2e/interaction-regression.spec.ts`

### Step 1: Add failing tests

Prove ordinary account-text pointer movement edits rather than moves text; card-body drag changes only its layout override; text hover does not apply card shadow; and `Snap to alignment` is absent.

```ts
it('does not turn ordinary account text interaction into a move', () => {
  expect(accountTextPointerAction({ x: 10, y: 10 }, { x: 80, y: 80 }, 500)).toBe('edit')
})

it('does not expose the redundant snap command', () => {
  render(<MapInspector data={sample} selectedTargetKey={'account:' + id} {...callbacks} />)
  expect(screen.queryByRole('button', { name: 'Snap to alignment' })).toBeNull()
})
```

In the browser regression, drag the visible account title and assert its `text:account:*` override is unchanged, then drag the card body and assert its override changes while serialized financial content is identical.

### Step 2: Run and witness expected failures

```powershell
npx vitest run tests/mapedit.test.ts tests/map-inspector.test.tsx tests/map-interactions-s40.test.tsx
npx playwright test tests/e2e/interaction-regression.spec.ts --project=chromium
```

Expected: pointer helper returns `move`, MapSvg installs text-drag handlers, broad hover fires, and the inspector renders the snap button.

### Step 3: Apply the smallest production change

- Make `accountTextPointerAction` return `edit` in normal mode and remove unused drag timing constants.
- Remove `beginAccountTextDrag` and text-hit-area pointer wiring; retain text click/edit and rendering of saved offsets.
- Scope hover styling to card-body hit targets; text uses a text cursor/quiet underline and body uses grab/outline.
- Remove inspector import/calculation/rendering for `snapRectToAlignment`; retain drag-time guides.
- Reuse `withoutOverride` for selected text reset. Add one pure helper for all text offsets:

```ts
export function resetAllTextPositions(data: MoneyMapData): MoneyMapData {
  const current = data.layoutOverrides ?? {}
  const entries = Object.entries(current).filter(([key]) => !key.startsWith('text:'))
  return entries.length === Object.keys(current).length
    ? data
    : { ...data, layoutOverrides: Object.fromEntries(entries) }
}
```

Wire the existing Reset menu/dialog in App to `Reset all text positions`, one confirmation, one `handleMapChange`, and toast `Text positions reset`.

### Step 4: Re-run focused tests and commit

Run Step 2, then:

```powershell
git add src/render/MapSvg.tsx src/render/MapInspector.tsx src/render/mapInteraction.ts src/styles/app.css tests/mapedit.test.ts tests/map-inspector.test.tsx tests/map-interactions-s40.test.tsx tests/e2e/interaction-regression.spec.ts
git commit -m "fix: clarify map pointer interactions"
```

---

## Task 2: Replace the permanent form with the canvas-first shell

**Files:**
- Create: `src/ui/EditorRail.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Modify: `tests/session40-app.test.ts`
- Modify: `tests/e2e/app-guidance-s40.spec.ts`
- Create: `tests/e2e/canvas-editor.spec.ts`

**New-file justification:** `EditorRail.tsx` isolates rail buttons/focus restoration from oversized state-owning `App.tsx`; the e2e file holds the new canvas-first contract without bloating legacy coverage.

### Step 1: Add failing shell tests

Assert existing clients open with a labeled 72px rail and no panel; Data opens the complete existing Form in a 380px panel and closes on Escape; all four rail buttons expose `aria-expanded`; Guide me/Full form is absent in normal editing; new-client/guided setup remains reachable.

```ts
await expect(page.getByRole('complementary', { name: 'Editor tools' })).toBeVisible()
await expect(page.getByRole('button', { name: 'Data' })).toHaveAttribute('aria-expanded', 'false')
await expect(page.getByRole('complementary', { name: 'Client editor' })).toHaveCount(0)
await page.getByRole('button', { name: 'Data' }).click()
await expect(page.getByRole('dialog', { name: 'Data' })).toBeVisible()
```

### Step 2: Run and confirm old-shell failures

```powershell
npx vitest run tests/session40-app.test.ts
npx playwright test tests/e2e/app-guidance-s40.spec.ts tests/e2e/canvas-editor.spec.ts --project=chromium
```

### Step 3: Implement rail and conditional Data panel

```ts
type EditorPanel = 'add' | 'data' | 'contents' | 'help'
const [editorPanel, setEditorPanel] = useState<EditorPanel | null>(null)
```

`EditorRail` renders four native buttons and calls `onToggle(panel)`. Remove the normal `formMode` toggle and render existing Form only for Data. Keep Wizard for new-client/guided setup. Opening focuses the panel heading; closing restores focus to its rail button. Escape cancels the current operation, then closes the panel, then clears selection.

CSS grid is `72px minmax(0, 380px) minmax(0, 1fr)` with a panel and `72px minmax(0, 1fr)` without. Below 1180px the panel overlays. Do not change artboard/export sizing.

### Step 4: Re-run and commit

Run Step 2, then:

```powershell
git add src/ui/EditorRail.tsx src/App.tsx src/styles/app.css tests/session40-app.test.ts tests/e2e/app-guidance-s40.spec.ts tests/e2e/canvas-editor.spec.ts
git commit -m "feat: make the editor canvas first"
```

---

## Task 3: Make Data complete, searchable, and selection-synchronized

**Files:**
- Modify: `src/form/Form.tsx`
- Modify: `src/App.tsx`
- Modify: `src/render/MapInspector.tsx`
- Modify: `src/styles/app.css`
- Modify: `tests/form.test.ts`
- Modify: `tests/map-inspector.test.tsx`
- Modify: `tests/e2e/canvas-editor.spec.ts`
- Modify: `tests/e2e/interaction-regression.spec.ts`

### Step 1: Add failing Data-path tests

Cover section filtering without model mutation, Details opening the right section, canvas selection highlighting/focusing its record, immediate Salary/Wages rendering, and Clear/Reset with a focused Data field not being overwritten after blur, drag, autosave, or reload.

```ts
await page.getByRole('button', { name: 'Data' }).click()
await page.getByLabel('Salary/Wages amount').fill('5000')
await expect(page.getByTestId('income-panel')).toContainText('$5,000')
await page.getByRole('button', { name: 'Clear map' }).click()
await page.getByRole('button', { name: 'Clear map', exact: true }).click()
await page.reload()
await expect(page.getByText('$5,000')).toHaveCount(0)
```

### Step 2: Run and confirm failures

```powershell
npx vitest run tests/form.test.ts tests/map-inspector.test.tsx
npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium
```

### Step 3: Reuse Form; do not create a second editor

- Add optional `filter`, `activeSection`, and `onSectionFocus` props to Form.
- Render a sticky native filter and section links above existing sections. Filtering only hides nonmatches.
- Keep current `MoneyField` focused draft; valid typing calls canonical `onChange`, blank remains `null`. Key focused editing by active client and clear/reset revision so obsolete blur work unmounts.
- Map selection into current `focusRequest` (`income`, `need`, account id, note id).
- Add `onDetails` to MapInspector; App opens Data and raises the existing focus request.
- Do not duplicate account/income update logic outside Form.

### Step 4: Re-run and commit

Run Step 2, then:

```powershell
git add src/form/Form.tsx src/App.tsx src/render/MapInspector.tsx src/styles/app.css tests/form.test.ts tests/map-inspector.test.tsx tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts
git commit -m "feat: connect map selection to data"
```

---

## Task 4: Add concise Add, Contents, and Help panels

**Files:**
- Create: `src/ui/EditorPanels.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Modify: `tests/e2e/canvas-editor.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`

**New-file justification:** one presentational module holds all three non-Data panels, avoiding three speculative component files while keeping App focused on state/mutations.

### Step 1: Add failing end-to-end tests

Prove Add exposes income/account/need/flow/text/fine-print actions; empty-state actions open the matching path; Contents lists/selects Income, Need, each account, flow, note, and fine print; hidden generated flows restore; Help lists shortcuts; controls are keyboard reachable.

### Step 2: Run and confirm missing panels

```powershell
npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/accessibility.spec.ts --project=chromium
```

### Step 3: Implement one callback-only panel module

`EditorPanels.tsx` receives active panel, current data, selection, warnings, and callbacks. Reuse existing creation helpers and `handleQuickAdd`; do not mutate data inside the component. Contents is a filtered semantic list, not a layers engine. Add actions select created objects. Help is static accessible text. Render empty-map actions only when corresponding data is absent.

### Step 4: Re-run and commit

```powershell
npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/accessibility.spec.ts --project=chromium
git add src/ui/EditorPanels.tsx src/App.tsx src/styles/app.css tests/e2e/canvas-editor.spec.ts tests/e2e/accessibility.spec.ts
git commit -m "feat: add canvas editor tools"
```

---

## Task 5: Add deterministic multi-selection, alignment, and copy/paste

**Files:**
- Modify: `src/render/mapInteraction.ts`
- Modify: `src/render/MapSvg.tsx`
- Modify: `src/render/MapInspector.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Modify: `tests/mapedit.test.ts`
- Modify: `tests/map-inspector.test.tsx`
- Modify: `tests/e2e/map-keyboard.spec.ts`
- Modify: `tests/e2e/canvas-editor.spec.ts`

### Step 1: Add failing pure and browser tests

For two compatible rects, assert align left/center/right and top/middle/bottom preserve sizes/content. For three, assert distribution uses first/last extents and stable current ordering. Browser tests prove Shift/Ctrl/Cmd-click toggles accounts/notes, one command is one undo step, and shortcuts do nothing while an input/select/edit overlay is focused.

```ts
const next = alignMapItems(data, ['account:a', 'note:n'], 'left')
expect(layoutRect(next, 'account:a')!.x).toBe(layoutRect(next, 'note:n')!.x)
expect(next.accounts).toEqual(data.accounts)
```

### Step 2: Run and confirm missing behavior

```powershell
npx vitest run tests/mapedit.test.ts tests/map-inspector.test.tsx
npx playwright test tests/e2e/map-keyboard.spec.ts tests/e2e/canvas-editor.spec.ts --project=chromium
```

### Step 3: Implement with existing overrides/history

- Replace App's single selection with `selectedMapTargetKeys: string[]` plus last item as primary; pass both to MapSvg/Inspector.
- Add pure `alignMapItems` and `distributeMapItems` in `mapInteraction.ts`. Resolve rects through current layout and write only `x`/`y` via `withOverride` or `moveMapNote`.
- Multi-selection accepts accounts and notes only. One App callback calls `handleMapChange` once.
- Store an internal clipboard in `useRef` for accounts/notes only. Reuse `duplicateMapAccount`/`duplicateMapNote` for IDs/offsets; do not use system clipboard.
- Gate shortcuts with:

```ts
function isEditingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement &&
    (target.matches('input, textarea, select, [contenteditable="true"]') ||
      Boolean(target.closest('[data-map-text-editor]')))
}
```

- Preserve explicit keyboard nudging. Remove tests expecting implicit pointer text movement.

### Step 4: Re-run and commit

Run Step 2, then:

```powershell
git add src/render/mapInteraction.ts src/render/MapSvg.tsx src/render/MapInspector.tsx src/App.tsx src/styles/app.css tests/mapedit.test.ts tests/map-inspector.test.tsx tests/e2e/map-keyboard.spec.ts tests/e2e/canvas-editor.spec.ts
git commit -m "feat: align selected map items"
```

---

## Task 6: Add direct connector handles and searchable clients

**Files:**
- Create: `src/ui/ClientCombobox.tsx`
- Modify: `src/render/MapSvg.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Modify: `tests/mapedit.test.ts`
- Modify: `tests/e2e/canvas-editor.spec.ts`
- Modify: `tests/e2e/menu-keyboard.spec.ts`

**New-file justification:** the active-client combobox has a distinct listbox/focus keyboard contract and would make App's header harder to verify if inlined.

### Step 1: Add failing tests

Cover title/year filtering across 120 clients, ArrowUp/Down/Enter/Escape/focus restoration, connector handle visibility for Income/Need/account, eligible target highlight, existing-validity flow creation, and Escape/empty-drop cancellation without history.

### Step 2: Run and confirm failures

```powershell
npx vitest run tests/mapedit.test.ts
npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/menu-keyboard.spec.ts --project=chromium
```

### Step 3: Implement native combobox and flow gesture

- `ClientCombobox` uses a native input with `role="combobox"`, filtered `role="listbox"`, `aria-activedescendant`, and current selection callback. Match normalized title/year; no fuzzy-search abstraction.
- In MapSvg, selected Income/Need/account renders one connector handle. Pointer movement updates interface-only preview/highlight; pointer up on eligible endpoint calls existing `addCustomArrow` once and selects the new custom arrow. Escape/invalid drop clears preview only.
- Keep inspector `Add flow to` as keyboard-accessible equivalent.

### Step 4: Re-run and commit

Run Step 2, then:

```powershell
git add src/ui/ClientCombobox.tsx src/render/MapSvg.tsx src/App.tsx src/styles/app.css tests/mapedit.test.ts tests/e2e/canvas-editor.spec.ts tests/e2e/menu-keyboard.spec.ts
git commit -m "feat: streamline clients and flows"
```

---

## Task 7: Integrate, verify, and report

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Modify: `tests/e2e/visual.spec.ts`
- Modify: affected `tests/e2e/visual.spec.ts-snapshots/*`
- Create: `docs/codex/SESSION-42-REPORT.md`

**New-file justification:** the session report is required by `AGENTS.md`.

### Step 1: Finish feedback and responsive behavior

- Tidy uses `tidyArrangement`, stays disabled when unchanged, commits once, and reports `Map layout reset`.
- Add/duplicate/flow/reset commands use plain-language toasts.
- At 1180px/200% zoom the panel overlays and scrolls independently.
- Present, print, PNG, PDF, and SVG hide editor UI and editing hit areas.

### Step 2: Run focused cross-browser regression

```powershell
npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium --project=webkit
```

### Step 3: Run project gates

```powershell
npm test
npm run build
npm run build:demo
npm run test:visual
git diff --check
git status --short
```

Update only intentional editor-mode baselines. Do not update Present snapshots unless the map changed.

### Step 4: Perform actual Chrome/Windows dogfood

Announce before control. Use the user's Chrome/WinApp with a hard timeout. Reproduce: Data; Salary/Wages 5000 immediate update; drag Income Sources with Data open; Tidy; Reset; Clear/confirm; blur/drag/reload; multi-align; connector; client search; 200% zoom; Present/export. Finalize browser control immediately.

### Step 5: Write report and final local commit

Record file LOC, verbatim test/build outputs, focused Chromium/WebKit/actual-Chrome evidence, deviations, new-file justifications, and unrelated observations.

```powershell
git add src tests docs/codex/SESSION-42-REPORT.md
git commit -m "test: certify canvas-first editor"
git diff origin/main...HEAD --check
git status --short --branch
git log --oneline origin/main..HEAD
```

Use `superpowers:verification-before-completion` before a completion claim. Do not push; report the exact local SHA and the repository rule requiring owner action for remote deployment.

