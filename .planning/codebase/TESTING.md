# Testing Patterns

**Analysis Date:** 2026-08-08

## Test Framework

**Unit Tests:**
- Framework: Vitest 3.2.4
- Runner: `npm run test` (runs `vitest run`)
- Watch mode: `npm run test` (use `vitest watch` locally)
- Tests co-located in `tests/` directory (not in src/)

**E2E Tests:**
- Framework: Playwright Test 1.62.0
- Runner: `npm run test:e2e` (headless), `npm run test:e2e:headed` (headed)
- Visual tests: `npm run test:e2e:visual` (chromium-only, tests/e2e/visual.spec.ts)
- Tests in `tests/e2e/` directory

**Assertion Library:**
- Vitest: built-in `expect()` from Vitest
- Playwright: built-in `expect()` from @playwright/test

**Run Commands:**
```bash
npm run test              # Vitest run (unit tests)
npm run test:e2e          # Playwright headless (15 project configs)
npm run test:e2e:headed   # Playwright headed (browser visible)
npm run test:e2e:visual   # Playwright visual regression (chromium-1440x900)
```

## Test File Organization

**Location:**
- Unit tests: `tests/*.test.ts` and `tests/*.test.tsx`
- E2E tests: `tests/e2e/*.spec.ts`
- Helpers: `tests/e2e/helpers.ts` (shared utilities)
- Test results: `test-results/e2e/` (outputs)
- Playwright report: `playwright-report/` (HTML report)

**Current Suite Counts:**
- Unit tests: ~60 files (math.test.ts, format.test.ts, book.test.ts, form.test.ts, layout.test.ts, export.test.ts, pdf.test.ts, undo.test.ts, wizard.test.ts, App-related: app-interactions-s49.test.tsx, app-state-s49.test.tsx, map-interactions-s40.test.tsx, session40-app.test.ts, map-svg-bounded-text.test.tsx, and many slice-specific tests like s51-selection.test.tsx, s54-selection-reducer.test.ts, etc.)
- E2E tests: ~30 spec files covering accessibility, canvas interactions, keyboard navigation, resilience, certification, etc.

**Naming:**
- Test files: `[feature].test.ts` (unit) or `[feature].spec.ts` (e2e)
- Slice notation: `s51-form.test.tsx`, `s50-arrow-sw.test.tsx` (slice indicators in filenames)

## Test Structure

**Unit Test Suite Organization:**
```typescript
import { describe, expect, it } from 'vitest'
import { targetFunction } from '../src/path/to/module'

describe('Feature or function name', () => {
  it('specific behavior', () => {
    expect(result).toBe(expected)
  })

  it.each([
    [input1, output1],
    [input2, output2],
  ])('parameterized behavior (%s)', (input, output) => {
    expect(transform(input)).toBe(output)
  })
})
```

**Patterns:**
- `describe()` blocks group related tests by feature or function
- `it()` blocks describe one specific behavior
- `it.each()` used for parameterized tests (see `math.test.ts` lines 25–34)
- Test descriptions use natural language ("renders", "suppresses", "uses")
- Setup usually inline in test, not beforeEach (functions are pure)

**E2E Test Suite Organization:**
```typescript
import { expect, test, type Locator, type Page } from '@playwright/test'
import { openApp, assertWcag22AA } from './helpers'

test.describe('Feature group', () => {
  test('specific user journey', async ({ page }, info) => {
    await openApp(page)
    await page.getByRole('button', { name: 'Action' }).click()
    await expect(page.getByText('Result')).toBeVisible()
    await assertWcag22AA(page, info, 'state-name')
  })
})
```

**Patterns:**
- `test.describe()` groups related tests
- `test()` (or `test.skip()`, `test.only()`) describes one user journey
- Uses Playwright's `Locator` API (role-based, text-based queries)
- Helpers from `tests/e2e/helpers.ts` used for common operations
- `TestInfo` parameter allows screenshots and attachments via `info.outputPath()`, `info.attach()`
- Accessibility assertions via `assertWcag22AA(page, info, state)` using axe-core

## Mocking

**Framework:** None — Vitest's built-in mocking (not heavily used)

**Patterns:**
- Mostly testing pure functions (no mocks needed)
- Reducer tests pass action objects and assert new state (see `s51-selection.test.tsx`)
- React component tests use actual React (no enzyme or testing-library shallow renders)
- E2E tests use real browser (no mocking of network or DOM)

**What NOT to Mock:**
- React components (test in isolation, assert output)
- localStorage (use real localStorage, clear in test)
- Async operations (use real promises, await them)

**Storage in E2E Tests:**
- `localStorage` cleared between test runs (Playwright's browser context)
- Test helpers define `BOOK_KEY` and `LEGACY_BOOK_KEY` for storage inspection

## Fixtures and Factories

**Test Data:**
No explicit factory pattern; test data created inline:

```typescript
// From s51-selection.test.tsx lines 9–15
const CASH = 'account:cash-at-bank'
const ROTH = 'account:roth-ira-dana'
const NOTE = 'note:note-1'

const stateOf = (keys: string[]): SelectionState => ({
  keys,
  anchor: keys.at(-1) ?? null,
})
```

**Location:**
- Constants defined at top of test file
- Helper functions defined below constants
- No separate fixtures/ directory

**Factories:**
- Reducer tests use factory functions that wrap dispatch (see `click()` in s51-selection.test.tsx)
- App tests use sample data from `src/model/samples.ts`

## Coverage

**Requirements:** None enforced (no coverage thresholds in vitest config)

**View Coverage:**
- Run vitest with `--coverage` flag (not configured in scripts)
- Playwright reports include visual diffs in HTML report

## Test Types

**Unit Tests:**
- Scope: Pure functions, reducers, utilities
- Location: `tests/*.test.ts` and `tests/*.test.tsx`
- Approach: 
  - Import function, call with test inputs, assert outputs
  - No browser APIs (runs in Node)
  - Test edge cases (nulls, negatives, empty arrays)
  - Parameterize common patterns with `it.each()`
- Examples: 
  - `math.test.ts` — runway and gap line calculations with 30+ cases
  - `s51-selection.test.tsx` — reducer state transitions with 15+ cases
  - `book.test.ts` — data structure operations

**Integration Tests:**
- Scope: React components with hooks, state management
- Location: `tests/*.test.tsx` (e.g., `app-interactions-s49.test.tsx`)
- Approach:
  - Import component, render with React Test Utilities (or use Vitest's basic render)
  - Fire events (click, type, etc.)
  - Assert DOM output
  - Use actual localStorage for state tests
- Examples:
  - `app-state-s49.test.tsx` — App state transitions
  - `map-interactions-s40.test.tsx` — Map canvas interactions
  - `data-filter-s48.test.tsx` — Data panel filtering

**E2E Tests:**
- Scope: Full user journeys, cross-browser
- Location: `tests/e2e/*.spec.ts`
- Approach:
  - Start app via `openApp(page)` helper
  - Perform user actions (click, type, navigate)
  - Assert visible/invisible content
  - Validate accessibility with axe-core
  - Capture evidence (screenshots, videos, traces on failure)
- Examples:
  - `accessibility.spec.ts` — WCAG 2.2 AA certification
  - `canvas-editor.spec.ts` — Map canvas interactions
  - `menu-keyboard.spec.ts` — Keyboard navigation in menus

## Playwright Configuration

**Config File:** `playwright.config.ts`

**Browser Projects (15 total):**
- **Desktop Chromium:** 5 viewport sizes (1280x720, 1366x768, 1440x900, 1536x864, 1920x1080)
- **Desktop Firefox:** 5 viewport sizes (same as above)
- **Desktop WebKit (Safari):** 5 viewport sizes (same as above)
- **Special cases:**
  - Chromium at 200% text zoom (1 project: 640x360 physical, 200% zoom)
  - Chrome channel (native Chrome browser, 1440x900)
  - MS Edge channel (native Edge browser, 1440x900)

**Server Configuration:**
- Dev mode: `npm run dev -- --host 127.0.0.1 --port 4187`
- Build mode: `npm run build && npm run preview -- --host 127.0.0.1 --port 4187`
- Port: 4187 (configurable via `PLAYWRIGHT_PORT` env var)
- Server wait timeout: 120 seconds

**Test Settings:**
- Timeout: 45 seconds per test
- Expect timeout: 7.5 seconds
- Retries: 0
- Workers: 1 (local), 2 (CI)
- Parallel: false (sequential mode)
- Screenshot: only-on-failure
- Trace: retain-on-failure (for debugging)
- Video: retain-on-failure
- Reduced motion: enabled (`reducedMotion: 'reduce'`)
- Color scheme: light (`colorScheme: 'light'`)
- Locale: en-US

**Test Environments:**
- `VITE_DATA_MODE=real` for e2e (not demo mode)

## Common Test Patterns

**Unit Test: Pure Function**
```typescript
describe('runwayLine', () => {
  it('renders one decimal place from account value and monthly draw', () => {
    expect(runwayLine(165_000, 6_000)).toBe(
      'Approximately 2.3 years at $6,000 per month.',
    )
  })

  it.each([
    [null, 6_000],
    [165_000, null],
  ])('suppresses absent inputs (%s, %s)', (value, draw) => {
    expect(runwayLine(value, draw)).toBeNull()
  })
})
```

**Unit Test: Reducer**
```typescript
const click = (keys: string[], key: string | null, modified: boolean) => {
  const state = stateOf(keys)
  const next = selectionReducer(state, {
    type: 'canvas/click',
    key,
    textKey: null,
    modified,
  })
  return { state, next, keys: next.keys }
}

describe('selection: modifier-click behavior', () => {
  it('replaces the selection on a plain click', () => {
    expect(click([CASH], ROTH, false).keys).toEqual([ROTH])
  })

  it('adds a second account on modifier-click', () => {
    expect(click([CASH], ROTH, true).keys).toEqual([CASH, ROTH])
  })
})
```

**E2E Test: User Journey**
```typescript
test('editor accessibility', async ({ page }, info) => {
  await openApp(page)
  const button = page.getByRole('button', { name: 'Add', exact: true })
  await expect(button).toBeVisible()
  await button.click()
  const panel = page.getByRole('dialog', { name: 'Add' })
  await expect(panel).toBeVisible()
  await assertWcag22AA(page, info, 'editor-add')
})
```

**E2E Test: Async + Evidence**
```typescript
test('file I/O', async ({ page }, info) => {
  await openApp(page)
  await page.getByRole('button', { name: 'Save' }).click()
  const downloadPromise = page.waitForEvent('download')
  const download = await downloadPromise
  await evidence(page, info, 'after-save')
  expect(download.suggestedFilename()).toContain('Money Map')
})
```

## Accessibility Testing

**Framework:** Axe Core via @axe-core/playwright

**Assertion Pattern:**
```typescript
async function assertWcag22AA(page: Page, info: TestInfo, state: string) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const evidence = result.violations.flatMap(...)
  await info.attach(`axe-${state}-violations`, { body: JSON.stringify(...) })
  expect(result.violations, ...).toEqual([])
}
```

**Coverage:**
- WCAG 2.2 AA rules enforced
- All tags included: wcag2a, wcag2aa, wcag21aa, wcag22aa
- No rules disabled (any exclusion requires reproduced false positive)
- Violations attached to test report for debugging

**Test Locations:**
- `accessibility.spec.ts` — editor, wizard, presentation modes
- Various `.spec.ts` files call `assertWcag22AA()` after user actions

## Known Test Gaps

- No performance benchmarks (no perf regression testing)
- No visual regression testing beyond manual review (visual.spec.ts exists but is manual)
- No automated cross-browser compatibility testing (Playwright runs multiple browsers but no visual compare)
- Network resilience not tested (no offline simulation)

## Slice Testing Conventions

Tests are tagged with slice numbers (e.g., "s51", "s49", "s40"). These correlate to development slices and mark which session/sprint introduced or modified the test:
- `s51-form.test.tsx`, `s51-selection.test.tsx`, `s51-rotate.test.tsx` — data panel & selection work
- `s49-*` tests — app state & interactions
- `s40-*` tests — session 40 work (storage, layout)

This convention helps trace test history and understand which slices cover which features.
