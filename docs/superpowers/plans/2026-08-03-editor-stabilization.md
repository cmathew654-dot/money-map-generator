# Editor Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize live-advisor canvas interaction, free notes, Tidy, and the compact editor without changing financial semantics or saved-book compatibility.

**Architecture:** Keep `App.tsx` as the sole state/history owner. Extend existing pure helpers, reuse the SVG drag engine, and make visual cleanup with existing JSX and CSS. Preserve amount-note data while removing only its form/canvas presentation, and keep layout diagnostics internal.

**Tech Stack:** React 19, TypeScript, SVG, CSS, Vitest, Playwright; existing dependencies only.

## Global Constraints

- Exactly one Luna Max implementation stream edits product code; Sol high only orchestrates, reviews, and runs gates.
- No new dependencies, state owner, context provider, data migration, navigation rewrite, or push.
- Preserve `qualifier`, `valueTag`, and `needTag` in saved JSON while hiding their editor and map presentation.
- Keep null money values rendering as `~$ ______`; never coerce a blank to zero.
- Hide map-layout warning UI only; retain saving, recovery, writer-handoff, and public-demo status UI.
- Keep after-tax/gross/account-type data and calculations unchanged.
- Use the existing 4 px drag threshold, history pipeline, layout overrides, note mutators, and export renderer.
- Run Playwright serially with `--workers=1` and a unique `PLAYWRIGHT_PORT` per command.
- Create `docs/codex/SESSION-43-REPORT.md` because AGENTS.md requires a new session report; this is the one-line file-map exception for the current user-directed stabilization session.

## File Map

- Modify `src/model/types.ts`: optional note font family.
- Modify `src/model/book.ts`: note-font validation and anchor-based grid Tidy.
- Modify `src/render/mapInteraction.ts`: focused note-font mutator.
- Modify `src/layout/layout.ts`: stop amount notes affecting rendered layout and warnings.
- Modify `src/render/MapSvg.tsx`: tight text targets, text-to-parent dragging, selected resize handles, note font rendering, and amount-note-free SVG.
- Modify `src/render/MapInspector.tsx`: note font control.
- Modify `src/form/Form.tsx`: remove the three amount-note inputs only.
- Modify `src/ui/EditorPanels.tsx`: remove map warning presentation.
- Modify `src/App.tsx`: stable inspector, placement priority/selection, warning suppression, and grid-Tidy anchors/feedback.
- Modify `src/styles/app.css`: resize cursor/handle and restrained compact panel/inspector polish.
- Modify `tests/book.test.ts`, `tests/mapedit.test.ts`, `tests/map-inspector.test.tsx`, `tests/session40-app.test.ts`, `tests/e2e/canvas-editor.spec.ts`, `tests/e2e/interaction-regression.spec.ts`, and `tests/e2e/visual.spec.ts`: focused regressions and visual state.
- Modify only snapshots changed by `tests/e2e/visual.spec.ts` after inspecting the diff.
- Create `docs/codex/SESSION-43-REPORT.md`: file LOC, verbatim gate evidence, deviations, and deferred findings.

---

### Task 1: Conservative grid Tidy

**Files:**
- Modify: `src/model/book.ts:353`
- Modify: `src/App.tsx:285-298,905-910`
- Test: `tests/book.test.ts:320-370`
- Test: `tests/session40-app.test.ts`

**Interfaces:**
- Produces: `TidyAnchor = { key: string; x: number; y: number }`
- Produces: `tidyArrangement(data: MoneyMapData, anchors: readonly TidyAnchor[]): MoneyMapData`
- Consumes: `layoutMap(activeClient)` and existing layout override keys.

- [ ] **Step 1: Write failing pure-model tests**

Add tests proving a 12-unit snap, preservation, and idempotence:

```ts
const source = {
  ...structuredClone(SAMPLE_WHITFIELD),
  notes: [{ id: 'note-grid', text: 'Keep', x: 517, y: 481, fs: 19 }],
  layoutOverrides: {
    income: { dx: 5, dy: 7, w: 321, rot: 4 },
    'text:masthead:label': { dx: 3, dy: 9 },
  },
  customArrows: [{
    id: 'arrow-grid', sourceId: 'income', targetId: 'need',
    label: 'Keep label', labelDx: 11, labelDy: -8,
  }],
}
const tidied = tidyArrangement(source, [
  { key: 'income', x: 813, y: 159 },
  { key: 'note:note-grid', x: 517, y: 481 },
])
expect(tidied.layoutOverrides?.income).toMatchObject({ dx: 8, dy: 4, w: 321, rot: 4 })
expect(tidied.layoutOverrides?.['text:masthead:label']).toEqual({ dx: 3, dy: 9 })
expect(tidied.notes?.[0]).toMatchObject({ x: 516, y: 480, fs: 19 })
expect(tidied.customArrows?.[0]).toMatchObject({ labelDx: 11, labelDy: -8 })
expect(tidyArrangement(tidied, [
  { key: 'income', x: 816, y: 156 },
  { key: 'note:note-grid', x: 516, y: 480 },
])).toBe(tidied)
```

- [ ] **Step 2: Run the Tidy tests RED**

Run: `npx vitest run tests/book.test.ts`

Expected: FAIL because `tidyArrangement` still removes offsets and accepts no anchors.

- [ ] **Step 3: Replace reset-like Tidy with anchor snapping**

Implement the pure helper with `Math.round(value / 12) * 12`. For ordinary layout keys, add the snap delta to existing `dx`/`dy`; for `note:<id>`, update the note's stored `x`/`y`. Do not touch unrelated overrides or arrow-label offsets. Return `data` when no anchor changes.

```ts
export interface TidyAnchor { key: string; x: number; y: number }

export function tidyArrangement(
  data: MoneyMapData,
  anchors: readonly TidyAnchor[],
): MoneyMapData {
  const snap = (value: number) => Math.round(value / 12) * 12
  let next = data
  for (const anchor of anchors) {
    const dx = snap(anchor.x) - anchor.x
    const dy = snap(anchor.y) - anchor.y
    if (dx === 0 && dy === 0) continue
    if (anchor.key.startsWith('note:')) {
      const id = anchor.key.slice(5)
      next = { ...next, notes: next.notes?.map((note) =>
        note.id === id ? { ...note, x: note.x + dx, y: note.y + dy } : note,
      ) }
      continue
    }
    const overrides = next.layoutOverrides ?? {}
    const override = overrides[anchor.key] ?? {}
    next = { ...next, layoutOverrides: {
      ...overrides,
      [anchor.key]: {
        ...override,
        ...(dx === 0 ? {} : { dx: (override.dx ?? 0) + dx }),
        ...(dy === 0 ? {} : { dy: (override.dy ?? 0) + dy }),
      },
    } }
  }
  return next
}
```

- [ ] **Step 4: Wire current layout anchors in App**

Build anchors from one `layoutMap(activeClient)` result: `income`, `need`, every account using its account id, every note using `note:<id>`, and `asNeededChip` when `layoutOverrideRect` returns a rect. Compute `tidiedClient`, disable Tidy when referentially unchanged, keep the current one-step `handleMapChange`, and change feedback to `Map aligned to grid.` Do not clear selection or inline editing after Tidy.

- [ ] **Step 5: Run focused tests GREEN and commit**

Run: `npx vitest run tests/book.test.ts tests/session40-app.test.ts`

Expected: PASS.

Commit: `git commit -am "fix: make tidy preserve free placement"`

---

### Task 2: Persist and render note font family

**Files:**
- Modify: `src/model/types.ts:100-108`
- Modify: `src/model/book.ts:726-747`
- Modify: `src/render/mapInteraction.ts:617-628`
- Modify: `src/render/MapSvg.tsx:1990-2055`
- Modify: `src/render/MapInspector.tsx:579-589`
- Test: `tests/book.test.ts:468-520`
- Test: `tests/mapedit.test.ts:840-891`
- Test: `tests/map-inspector.test.tsx`

**Interfaces:**
- Produces: `MapNote.font?: 'serif' | 'sans'`.
- Produces: `setMapNoteFont(data, id, font): MoneyMapData`.

- [ ] **Step 1: Write failing note-font tests**

Add a book round-trip for both valid values, reject `font: 'comic'`, assert the mutator changes only the target note, assert static markup maps serif to `FONT_SERIF` and sans to `FONT_SANS`, and assert the note inspector exposes pressed Serif/Sans buttons.

```ts
expect(parseBook(JSON.stringify(bookWithSansNote)).clients[0].notes?.[0].font).toBe('sans')
expect(() => parseBook(invalidFontJson)).toThrow('Client 1 has invalid map notes.')
expect(setMapNoteFont(data, 'n', 'sans').notes?.[0].font).toBe('sans')
expect(renderToStaticMarkup(<MapSvg data={sansNoteData} />)).toContain('Public Sans')
```

- [ ] **Step 2: Run note tests RED**

Run: `npx vitest run tests/book.test.ts tests/mapedit.test.ts tests/map-inspector.test.tsx`

Expected: FAIL because `font` and `setMapNoteFont` do not exist.

- [ ] **Step 3: Implement the optional enum and one mutator**

Add `font?: 'serif' | 'sans'` to `MapNote`; accept only those two values in `validateMoneyMapData`; add `setMapNoteFont` beside `setMapNoteBackground`; render `note.font === 'sans' ? FONT_SANS : FONT_SERIF`; reset notes by deleting `font` along with `w`, `bg`, and `fs`.

- [ ] **Step 4: Add the compact font selector**

In the existing note inspector branch, add one `InspectorGroup label="Font"` with Serif and Sans buttons. Each button calls `setMapNoteFont`; use `aria-pressed` and no new dropdown or component.

- [ ] **Step 5: Run focused tests GREEN and commit**

Run: `npx vitest run tests/book.test.ts tests/mapedit.test.ts tests/map-inspector.test.tsx`

Expected: PASS.

Commit: `git commit -am "feat: add note font choice"`

---

### Task 3: Restore intuitive drag and direct resize

**Files:**
- Modify: `src/render/MapSvg.tsx:300-380,1112-1225,2225-2500,2888-3085`
- Modify: `src/styles/app.css:399-427,2105-2143,2360-2388`
- Test: `tests/mapedit.test.ts`
- Test: `tests/e2e/canvas-editor.spec.ts`
- Test: `tests/e2e/interaction-regression.spec.ts`

**Interfaces:**
- Reuses: `beginDrag(key, mode, placed)`, the 4 px threshold, click suppression, `resizeMapNote`, and current selection keys.
- Produces: selected-only `.map-resize-handle` for income, need, account, and note.

- [ ] **Step 1: Write failing render and pointer regressions**

Add static-markup assertions that interactive unselected content has no resize handle, selecting `account:<id>` emits exactly one handle with `aria-label="Resize <account name>"`, and noninteractive export has none. In Chromium, select an account, drag its title hit target by at least 30 px and assert its group bounding box changes; short-click the same target and assert `.map-text-editor-input` appears. Drag the resize handle and assert the account bounding box changes.

- [ ] **Step 2: Run the focused tests RED**

Run:

```powershell
npx vitest run tests/mapedit.test.ts
$env:PLAYWRIGHT_PORT='4330'; npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
```

Expected: FAIL because text pointerdown blocks parent movement and resize handles are absent.

- [ ] **Step 3: Make text pointerdown start the owning item's move**

Pass the existing `beginDrag` callback into edit hit areas for account, income, need, and note text. Keep click activation unchanged so the threshold distinguishes drag from click. Account text uses the account id and placed rect; income/need use their layout keys and rects; note text uses `noteMove` and its placed rect. Do not revive independent text dragging for these items.

- [ ] **Step 4: Tighten transparent text hit geometry**

Use the imported `textWidth` for account title/caption/value hit widths, with 8 map units of horizontal padding and the current line-leading height. Remove `Math.max(72, accountWidth * 0.84)`. Apply the same principle to fixed income/need/note hit rectangles: width is the maximum rendered-line width plus 8, clamped inside the owner; height is rendered line height plus 4. Leave remaining blank shape body exposed to the parent's grab target.

```ts
const width = Math.min(
  ownerWidth,
  Math.max(...lines.map((line) => textWidth(line, fontSize)), 1) + 8,
)
```

- [ ] **Step 5: Add selected-only resize handles through the current drag engine**

Render a bottom-right 16×16 handle only for the primary selected account, income, need, or note. Accounts/income/need call `beginDrag(key, 'resize', placed)`. Add `noteResize` to `DragMode`; while active call `resizeMapNote(data, id, startPlaced.w + localDelta.x)`. Stop propagation on handle pointerdown. Add `cursor: nwse-resize`, a white fill, green stroke, and a 32×32 transparent hit target if needed while keeping the visible square 12–16 units.

- [ ] **Step 6: Run focused tests GREEN and commit**

Repeat Step 2 with `PLAYWRIGHT_PORT='4331'`.

Expected: PASS.

Commit: `git commit -am "fix: restore canvas drag and resize"`

---

### Task 4: Stable inspector, free note placement, and silent diagnostics

**Files:**
- Modify: `src/App.tsx:1455-1478,1560-1578,1838-1870,1930-2005,2049-2081`
- Modify: `src/form/Form.tsx:428-440,526-564,877-889`
- Modify: `src/ui/EditorPanels.tsx:250-325,370-400`
- Modify: `src/layout/layout.ts:449-480,802-804,965-973,2474-2483,2757-2815`
- Modify: `src/render/MapSvg.tsx:2151-2153`
- Test: `tests/mapedit.test.ts`
- Test: `tests/session40-app.test.ts`
- Test: `tests/e2e/canvas-editor.spec.ts`
- Test: `tests/e2e/interaction-regression.spec.ts`

**Interfaces:**
- Preserves: amount-note fields in `MoneyMapData` and `parseBook`.
- Removes: `warnings` from `EditorPanelsProps` and all map-warning JSX.

- [ ] **Step 1: Write failing presentation regressions**

Add source/render tests proving the three `Amount note` fields are absent, existing tag values still parse and round-trip, SVG output does not contain `Gross`, `est.`, or a need tag, and no `Map needs attention`/`Map warnings` UI is rendered. Add E2E coverage that selects an account, opens its inline title editor, and keeps `.map-inspector` visible throughout.

- [ ] **Step 2: Write failing note-placement regression**

Arm Add text note, click the center of an account body, enter `Inside account note`, press Enter, and assert:

```ts
await expect(page.locator('svg')).toHaveAttribute('data-selected-target', /note:/)
await expect(page.locator('.map-inspector')).toContainText('Inside account note')
```

The click must not move or reselect the account beneath it.

- [ ] **Step 3: Run UI regressions RED**

Run:

```powershell
npx vitest run tests/mapedit.test.ts tests/session40-app.test.ts
$env:PLAYWRIGHT_PORT='4332'; npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
```

Expected: FAIL on current warning, amount-note, inspector, and placement behavior.

- [ ] **Step 4: Remove amount-note presentation without deleting data**

Delete only the three `TextField label="Amount note"` blocks from `Form.tsx`. In layout/render calculations use `money(value)`/`moneyPer(...)` without `needTag`, `valueTag`, or `qualifier`; do not change model types, parser validation, import/export JSON, vocabulary, or saved objects. Ensure account and need fit/warning checks compare to the same tag-free displayed strings.

- [ ] **Step 5: Remove map warning surfaces**

Delete the map-warning `<details>` from `App`, pass `hasWarnings={false}` to the existing wizard, remove the `warnings` prop and global/targeted warning rendering from `EditorPanels`, and stop passing warnings there. Keep `layoutMap(...).warnings` generation intact and retain all non-layout status banners.

- [ ] **Step 6: Keep inspector stable and make placement win**

Change both inspector conditions from `selectedMapTargetKey && !mapTextEdit && ...` to `selectedMapTargetKey && ...`. In `placeTextNote`, accept any click whose coordinates fall within the current SVG instead of requiring `[data-map-background]`; call `preventDefault` and `stopPropagation` while placement is armed. When a note commit changes the client, call `setSelectedMapTargetKey('note:' + mapTextEdit.target.noteId)` before clearing the editor.

- [ ] **Step 7: Run focused tests GREEN and commit**

Repeat Step 3 with `PLAYWRIGHT_PORT='4333'`.

Expected: PASS.

Commit: `git commit -am "fix: simplify notes and advisor feedback"`

---

### Task 5: Compact left panel and inspector polish

**Files:**
- Modify: `src/styles/app.css:595-705,743-870,1205-1250,1515-1530,1734-1760`
- Modify: `tests/map-inspector.test.tsx:171-174`
- Modify: `tests/e2e/visual.spec.ts:44-170`
- Modify: affected `tests/e2e/visual.spec.ts-snapshots/*.png` only after inspection.

**Interfaces:**
- Keeps: 420 px guided panel, 380 px editor panel, existing rail/tabs/markup, Public Sans controls, Literata map typography.

- [ ] **Step 1: Add one compact CSS contract test**

Replace the old 32 px inspector-only assertion with minimum 28 px compact controls and explicit 11–12 px control text, while preserving `:focus-visible` outlines. Add a visual scenario with Data open and a selected account whose inspector is visible.

- [ ] **Step 2: Run visual/unit tests before CSS changes**

Run:

```powershell
npx vitest run tests/map-inspector.test.tsx
$env:PLAYWRIGHT_PORT='4334'; npx playwright test tests/e2e/visual.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
```

Expected: the unit contract fails and the visual snapshot shows the current bulky styling.

- [ ] **Step 3: Apply a CSS-only compact pass**

Use current selectors. Reduce editor body/section gaps and padding, remove section card backgrounds/borders where a divider suffices, change section headings from spaced uppercase to normal-case 12 px/600 weight, reduce form-section padding/margins, and strengthen only `.form-section.is-active`/selected rows with the existing green tint. Set inspector button/select height to 28 px, text to 11–12 px, reduce heading width/type, and remove the inspector re-entry animation that makes focus changes look like state loss. Preserve keyboard focus outlines and readable hit targets.

- [ ] **Step 4: Inspect and update only intended snapshots**

Run the visual test without update, inspect each failing image, then run:

```powershell
$env:PLAYWRIGHT_PORT='4335'; npx playwright test tests/e2e/visual.spec.ts --project=chromium-1280x720 --workers=1 --update-snapshots --reporter=line
```

Confirm no map typography, Present mode, or export chrome changed unintentionally.

- [ ] **Step 5: Run focused tests GREEN and commit**

Run the unit and visual commands once more with `PLAYWRIGHT_PORT='4336'`.

Expected: PASS.

Commit: `git add src/styles/app.css tests/map-inspector.test.tsx tests/e2e/visual.spec.ts tests/e2e/visual.spec.ts-snapshots; git commit -m "style: compact the live editor controls"`

---

### Task 6: Cross-feature regression and dogfood certification

**Files:**
- Modify only already-listed test files if a focused assertion reveals a regression caused by Tasks 1–5.

**Interfaces:**
- Consumes: all behavior from Tasks 1–5.

- [ ] **Step 1: Run focused Vitest suites**

Run: `npx vitest run tests/book.test.ts tests/mapedit.test.ts tests/map-inspector.test.tsx tests/session40-app.test.ts`

Expected: PASS.

- [ ] **Step 2: Run focused Chromium sequentially**

Run:

```powershell
$env:PLAYWRIGHT_PORT='4337'; npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
```

Expected: PASS.

- [ ] **Step 3: Run focused WebKit sequentially**

Run:

```powershell
$env:PLAYWRIGHT_PORT='4338'; npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=webkit --workers=1 --reporter=line
```

Expected: PASS.

- [ ] **Step 4: Execute the required 12-minute route**

Using the local app, perform the exact six steps under `Required release route` in `docs/superpowers/specs/2026-08-03-editor-stabilization-design.md`. Record pass/fail for body/text drag, click edit, inspector stability, selected resize, shape change, note placement over a shape, note controls, Tidy/undo, reload, Present, and one PNG export. Do not claim actual-browser certification if the runner is unavailable.

- [ ] **Step 5: Review the complete diff**

Run `git diff 4ea1570 --check`, `git diff 4ea1570 --stat`, and inspect `git diff 4ea1570 -- src tests`. Remove duplicated helpers, dead warning props/styles, accidental tag deletion, and unrelated formatting. Confirm no dependencies or docs prompts changed.

---

### Task 7: Final gates, report, and local commit boundary

**Files:**
- Create: `docs/codex/SESSION-43-REPORT.md`

**Interfaces:**
- Produces: auditable completion evidence and a clean local branch; no push.

- [ ] **Step 1: Run mandatory repository gates**

Run serially:

```powershell
npm test
npm run build
npm run build:demo
npm run test:visual
git diff --check
git status --short
```

Record exact exit codes and verbatim summaries. A red command remains red in the report.

- [ ] **Step 2: Write the Session 43 report**

Create `docs/codex/SESSION-43-REPORT.md` with: approved scope; behavior delivered; file-by-file added/deleted LOC from `git diff --numstat 4ea1570`; verbatim `npm test` and `npm run build` summaries; Chromium/WebKit/visual/dogfood evidence; the report file-map exception; deviations; and observed-but-deferred items. State that warning diagnostics and amount-note data remain internal/preserved.

- [ ] **Step 3: Commit the report and verify the local boundary**

Run:

```powershell
git add docs/codex/SESSION-43-REPORT.md
git commit -m "docs: report editor stabilization"
git diff origin/main...HEAD --check
git status --short --branch
git log --oneline 4ea1570..HEAD
```

Expected: clean worktree, local commits only, no push.
