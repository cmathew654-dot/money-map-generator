import { expect, test, type Locator, type Page } from '@playwright/test'
import { openApp } from './helpers'

// s51 state-context selection matrix (the "L-PIN" cases).
//
// The pre-s51 suite only ever exercised shift-click from a pristine map, which
// is why a selection bug that only appears with a panel open survived ~50
// sessions unseen. These cases pin the *context* the gesture happens in, not
// just the gesture.
//
// Driver traps these tests exist to encode:
//   * Selecting an account moves its <g> to the END of g[aria-label="Accounts"]
//     so it paints on top. Index-based addressing (nth(1)) silently retargets a
//     DIFFERENT account after the first click — always address accounts by
//     [data-account-id].
//   * Account bounding boxes overlap, so coordinate math off the group box can
//     land on a neighbour. Drive the account's own .map-account-body-hit rect.
//   * The account centre belongs to its text runs (they own dblclick). Click
//     low-left inside the body hit for a plain selection.
//   * DRAG_THRESHOLD_PX is 4 (hypot). A +3/+3 diagonal is 4.24px and commits a
//     REAL drag, so keep a "jitter" wobble on one axis.

const FIRST = 'short-term-funds'
const SECOND = 'roth-ira-dana'

async function dismissIntro(page: Page) {
  const gotIt = page.getByRole('button', { name: 'Got it' })
  if (await gotIt.count()) await gotIt.click()
}

function bodyHit(page: Page, accountId: string): Locator {
  return page.locator(`[data-account-id="${accountId}"] .map-account-body-hit:not(ellipse)`).first()
}

async function clickAccount(page: Page, accountId: string, modifiers: 'Shift'[] = []) {
  const hit = bodyHit(page, accountId)
  const box = await hit.boundingBox()
  if (!box) throw new Error(`Account ${accountId} has no measurable body hit`)
  await hit.click({
    modifiers,
    position: { x: Math.min(32, box.width / 4), y: Math.max(16, box.height - 24) },
  })
}

function selectedAccountIds(page: Page) {
  return page.evaluate(() => {
    // The hidden print copy is the second g[aria-label="Accounts"] — take the live one.
    const group = document.querySelector('g[aria-label="Accounts"]')
    return [...(group?.querySelectorAll(':scope > g[data-map-selected="true"]') ?? [])]
      .map((el) => el.getAttribute('data-account-id'))
  })
}

async function clearSelection(page: Page) {
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await expect.poll(() => selectedAccountIds(page)).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await openApp(page)
  await dismissIntro(page)
  await expect(bodyHit(page, FIRST)).toBeVisible()
})

test('A1a: shift-click extends the selection to both accounts', async ({ page }) => {
  await clearSelection(page)
  await clickAccount(page, FIRST)
  await clickAccount(page, SECOND, ['Shift'])

  await expect.poll(() => selectedAccountIds(page)).toEqual([FIRST, SECOND])
  await expect(page.getByRole('button', { name: '+ Flow' })).toBeEnabled()
})

// KNOWN RED at lane/s51-gate @ 92e39be — this is the phantom selection bug.
// With the Data panel open, clicking an account also runs App's
// `editorPanel === 'data'` branch -> focusDataTarget() -> the Data panel focuses
// that account's row -> Form's onSelectAccount fires setSelectedMapTargetKey(),
// the SINGLE-key setter, which collapses the shift-extended selection to one.
// DELETE THE test.fail() ANNOTATION (not the test) when the fix lands — a green
// run here reports as "expected to fail but passed", which is the reminder.
test('A1b: shift-click still extends with the Details panel open', async ({ page }) => {
  test.fail()
  await clearSelection(page)
  await clickAccount(page, FIRST)
  await page.locator('.map-inspector').getByRole('button', { name: 'Details', exact: true }).click()
  await expect(page.locator('.client-form')).toBeVisible()
  await expect.poll(() => selectedAccountIds(page)).toEqual([FIRST])

  await clickAccount(page, SECOND, ['Shift'])
  await expect.poll(() => selectedAccountIds(page)).toEqual([FIRST, SECOND])
})

test('A2: shift-click still extends after using an inspector control', async ({ page }) => {
  await clearSelection(page)
  await clickAccount(page, FIRST)
  await expect(page.locator('.map-inspector')).toBeVisible()
  await page.getByRole('button', { name: 'Rotate clockwise' }).click()
  await clickAccount(page, SECOND, ['Shift'])

  await expect.poll(() => selectedAccountIds(page)).toEqual([FIRST, SECOND])
  await expect(page.getByRole('button', { name: '+ Flow' })).toBeEnabled()
  await page.getByRole('button', { name: 'Undo' }).click()
})

// *** INTENDED BEHAVIOUR — NOT A BUG. ***
// Escape clears the selection outright, so the following shift-click starts a
// NEW selection of one. It must not resurrect the pre-Escape account. Two
// selected here would mean selection state leaked across an explicit clear.
test('A3: Escape then shift-click yields a single selection', async ({ page }) => {
  await clearSelection(page)
  await clickAccount(page, FIRST)
  await page.keyboard.press('Escape')
  await expect.poll(() => selectedAccountIds(page)).toEqual([])

  await clickAccount(page, SECOND, ['Shift'])
  await expect.poll(() => selectedAccountIds(page)).toEqual([SECOND])
  await expect(page.getByRole('button', { name: '+ Flow' })).toBeDisabled()
})

test('A4: a 3px shift micro-drag still extends the selection', async ({ page }) => {
  await clearSelection(page)
  await clickAccount(page, FIRST)

  const hit = bodyHit(page, SECOND)
  const box = await hit.boundingBox()
  if (!box) throw new Error(`Account ${SECOND} has no measurable body hit`)
  const x = box.x + Math.min(32, box.width / 4)
  const y = box.y + Math.max(16, box.height - 24)
  await page.keyboard.down('Shift')
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 3, y, { steps: 3 }) // one axis: 3px < DRAG_THRESHOLD_PX (4)
  await page.mouse.up()
  await page.keyboard.up('Shift')

  await expect.poll(() => selectedAccountIds(page)).toEqual([FIRST, SECOND])
  await expect(page.getByRole('button', { name: '+ Flow' })).toBeEnabled()
})

test('A5: double-clicking an account value opens a focused editor that accepts typing', async ({ page }) => {
  await clearSelection(page)
  const valueRun = page.locator('[data-map-edit-key^="accountValue:"]').first()
  await valueRun.dblclick()

  const editor = page.locator('.map-text-editor input, .map-text-editor textarea').first()
  await expect(editor).toBeVisible()
  await expect(editor).toBeFocused()

  const box = await page.locator('.map-text-editor').first().boundingBox()
  const viewport = page.viewportSize()
  expect(box, 'editor has measurable bounds').not.toBeNull()
  expect(box!.x, 'editor is on screen horizontally').toBeGreaterThanOrEqual(0)
  expect(box!.y, 'editor is on screen vertically').toBeGreaterThanOrEqual(0)
  expect(box!.x).toBeLessThan(viewport!.width)
  expect(box!.y).toBeLessThan(viewport!.height)

  await page.keyboard.type('777')
  await expect(editor).toHaveValue(/777/)
})
