import { expect, test, type Locator, type Page } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'

// s52 "click-again": account text is no longer selected by the FIRST plain
// click. A plain click on a label/caption/value selects the ACCOUNT; only a
// further plain click on the text of the already-sole-selected account
// promotes the selection to that text. Modifier-clicks never reach the text.
//
// Driver traps these tests exist to encode:
//   * Two plain clicks on the same point inside the browser's double-click
//     interval ARE a dblclick and open the title editor instead. Any
//     click-again gesture must be separated in time (see `clickAgain`).
//   * Selecting an account moves its <g> to the END of g[aria-label="Accounts"],
//     so accounts are only ever addressed by [data-account-id], never by index.
//   * 'Rotate clockwise' is offered for BOTH account and text selections, so it
//     does not discriminate. The on-canvas /^Rotate text: / handle does.
//   * DRAG_THRESHOLD_PX is 4 (hypot), so a real drag stays on one axis and goes
//     well past it.

const ACT = { timeout: 4_000 }
const SEE = { timeout: 4_000 }
const DOUBLE_CLICK_INTERVAL_MS = 600

const CASH = 'cash-at-bank'
const ROTH = 'roth-ira-dana'

async function dismissIntro(page: Page) {
  const gotIt = page.getByRole('button', { name: 'Got it' })
  if (await gotIt.count()) await gotIt.click(ACT)
}

function bodyHit(page: Page, accountId: string): Locator {
  return page.locator(`[data-account-id="${accountId}"] .map-account-body-hit:not(ellipse)`).first()
}

function label(page: Page, accountId: string): Locator {
  return page.locator(`[data-map-edit-key="accountLabel:${accountId}"]`).first()
}

/** TEXT is selected iff the on-canvas text rotate handle is offered. */
function textHandle(page: Page): Locator {
  return page.getByRole('button', { name: /^Rotate text: / })
}

async function clickAccountBody(page: Page, accountId: string, modifiers: ('Shift' | 'Control')[] = []) {
  const hit = bodyHit(page, accountId)
  const box = await hit.boundingBox()
  if (!box) throw new Error(`Account ${accountId} has no measurable body hit`)
  await hit.click({
    modifiers,
    position: { x: Math.min(32, box.width / 4), y: Math.max(16, box.height - 24) },
    ...ACT,
  })
}

/** A second PLAIN click, far enough apart in time that it is not a dblclick. */
async function clickAgain(page: Page, target: Locator) {
  await page.waitForTimeout(DOUBLE_CLICK_INTERVAL_MS)
  await target.click(ACT)
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
  await expect.poll(() => selectedAccountIds(page), SEE).toEqual([])
}

function layoutOverrides(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const persisted = JSON.parse(raw)
    const client = persisted.clients?.find((item: { id: string }) => item.id === 'sample-whitfield')
    return client?.layoutOverrides ?? null
  }, BOOK_KEY)
}

test.beforeEach(async ({ page }) => {
  await openApp(page)
  await dismissIntro(page)
  await expect(label(page, CASH)).toBeVisible(SEE)
})

// 1. Plain click on account text, account NOT sole-selected -> the ACCOUNT.
test('C1: a plain click on account text selects the account, not the text', async ({ page }) => {
  await clearSelection(page)
  await label(page, CASH).click(ACT)

  await expect.poll(() => selectedAccountIds(page), SEE).toEqual([CASH])
  await expect(textHandle(page)).toHaveCount(0, SEE)
  await expect(page.locator('.map-inspector').getByRole('button', { name: 'Rotate clockwise' }))
    .toBeVisible(SEE)
})

// 1 (collapse clause). A multi-selection collapses to the clicked ACCOUNT — the
// label click must never leave the other account selected, nor select the text.
test('C1b: a plain label click collapses a multi-selection to that account', async ({ page }) => {
  await clearSelection(page)
  await clickAccountBody(page, ROTH)
  await clickAccountBody(page, CASH, ['Shift'])
  await expect.poll(() => selectedAccountIds(page), SEE).toEqual([ROTH, CASH])

  await label(page, ROTH).click(ACT)

  await expect.poll(() => selectedAccountIds(page), SEE).toEqual([ROTH])
  await expect(textHandle(page)).toHaveCount(0, SEE)
  await expect(page.getByRole('button', { name: '+ Flow' })).toBeDisabled(SEE)
})

// 2. Plain click on the text of the SOLELY selected account promotes to TEXT.
test('C2: clicking the text of the sole-selected account promotes to the text', async ({ page }) => {
  await clearSelection(page)
  await clickAccountBody(page, CASH)
  await expect.poll(() => selectedAccountIds(page), SEE).toEqual([CASH])

  await label(page, CASH).click(ACT)

  await expect(textHandle(page)).toBeVisible(SEE)
})

// 3. Repeat plain clicks on the selected text keep the TEXT selected — they
// must not bounce the selection back up to the account.
test('C3: repeat clicks on the selected text keep the text selected', async ({ page }) => {
  await clearSelection(page)
  await clickAccountBody(page, CASH)
  await label(page, CASH).click(ACT)
  await expect(textHandle(page)).toBeVisible(SEE)

  await clickAgain(page, label(page, CASH))
  await expect(textHandle(page)).toBeVisible(SEE)

  await clickAgain(page, label(page, CASH))
  await expect(textHandle(page)).toBeVisible(SEE)
})

// 4. Modifier-clicks on account text ALWAYS resolve to the ACCOUNT, so two
// shift-clicked labels are a two-account selection and + Flow arms.
test('C4: modifier-clicking two account labels selects two accounts and arms + Flow', async ({ page }) => {
  for (const modifier of ['Shift', 'Control'] as const) {
    await clearSelection(page)
    await label(page, CASH).click(ACT)
    await expect.poll(() => selectedAccountIds(page), SEE).toEqual([CASH])

    await label(page, ROTH).click({ modifiers: [modifier], ...ACT })

    await expect.poll(() => selectedAccountIds(page), SEE).toEqual([CASH, ROTH])
    await expect(textHandle(page)).toHaveCount(0, SEE)
    await expect(page.getByRole('button', { name: '+ Flow' })).toBeEnabled(SEE)
  }
})

// 5. A text selection still has a parent account, so Details stays available
// and opens the PARENT's details rather than going dead.
test('C5: Details is enabled with text selected and opens the parent account', async ({ page }) => {
  await clearSelection(page)
  await clickAccountBody(page, CASH)
  await label(page, CASH).click(ACT)
  await expect(textHandle(page)).toBeVisible(SEE)

  const details = page.locator('.map-inspector').getByRole('button', { name: 'Details', exact: true })
  await expect(details).toBeEnabled(SEE)
  await details.click(ACT)
  await expect(page.locator('.client-form')).toBeVisible(SEE)
})

// 5 (panel clause). With text selected the Data panel focuses the PARENT's row.
test('C5b: the Data panel focuses the parent row while its text is selected', async ({ page }) => {
  await page.getByRole('button', { name: 'Data', exact: true }).click(ACT)
  const panel = page.getByRole('dialog', { name: 'Data' })
  await expect(panel).toBeVisible(SEE)

  // Start focused elsewhere so a stale expansion cannot pass this by accident.
  await clickAccountBody(page, ROTH)
  await expect(panel.locator(`[data-account-id="${ROTH}"] button.account-summary`))
    .toHaveAttribute('aria-expanded', 'true', SEE)

  await label(page, CASH).click(ACT) // -> selects the ACCOUNT
  await clickAgain(page, label(page, CASH)) // -> promotes to its TEXT
  await expect(textHandle(page)).toBeVisible(SEE)

  await expect(panel.locator(`[data-account-id="${CASH}"] button.account-summary`))
    .toHaveAttribute('aria-expanded', 'true', SEE)
})

// 6. Dblclick still opens the title editor from any selection state.
test('C6: dblclick opens the title editor whether or not the account was selected', async ({ page }) => {
  const editor = page.locator('.map-text-editor input, .map-text-editor textarea').first()

  await clearSelection(page)
  await label(page, CASH).dblclick(ACT)
  await expect(editor).toBeVisible(SEE)
  await page.keyboard.press('Escape')
  await expect(editor).toHaveCount(0, SEE)

  await clickAccountBody(page, CASH)
  await expect.poll(() => selectedAccountIds(page), SEE).toEqual([CASH])
  await label(page, CASH).dblclick(ACT)
  await expect(editor).toBeVisible(SEE)
})

// 7. Text is never independently draggable: a drag that starts on it moves the
// whole ACCOUNT and leaves the text's own offset untouched.
test('C7: a drag starting on account text moves the account', async ({ page }) => {
  await clearSelection(page)
  const before = await layoutOverrides(page)
  const box = await label(page, CASH).boundingBox()
  if (!box) throw new Error(`Account ${CASH} has no measurable label`)

  const x = box.x + box.width / 2
  const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 36, y, { steps: 6 }) // one axis, well past DRAG_THRESHOLD_PX (4)
  await page.mouse.up()

  await expect.poll(async () => {
    const now = await layoutOverrides(page)
    return {
      accountMoved: (now?.[CASH]?.dx ?? 0) !== (before?.[CASH]?.dx ?? 0),
      textMoved: (now?.[`text:${CASH}:label`]?.dx ?? 0) !== (before?.[`text:${CASH}:label`]?.dx ?? 0),
    }
  }, SEE).toEqual({ accountMoved: true, textMoved: false })
})
