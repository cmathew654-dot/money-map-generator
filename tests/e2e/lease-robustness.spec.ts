import { expect, test, type Locator, type Page } from '@playwright/test'
import { openApp } from './helpers'

// Mirrors WRITER_HEARTBEAT_MS in src/model/browserStore.ts - importing that
// module here executes its Vite-only env resolution under Node and crashes.
const WRITER_HEARTBEAT_MS = 2000

const WRITER_KEY = 'money-map-generator:writer'

function shortTermFundsLocators(page: Page) {
  return {
    label: page.locator(
      '[data-map-edit-visual="accountLabel:short-term-funds"]',
    ),
    account: page.locator(
      '[data-account-id="short-term-funds"][role="group"]',
    ),
  }
}

async function dragBy(page: Page, account: Locator, label: Locator, dx: number) {
  const before = await account.boundingBox()
  const target = await label.boundingBox()
  if (!before || !target) throw new Error('Short-Term Funds target is not measurable')
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    target.x + target.width / 2 + dx,
    target.y + target.height / 2 + 20,
    { steps: 6 },
  )
  await page.mouse.up()
  await expect
    .poll(async () => (await account.boundingBox())?.x ?? before.x)
    [dx > 0 ? 'toBeGreaterThan' : 'toBeLessThan'](before.x + (dx > 0 ? 20 : -20))
}

async function dispatchVisibleFocus(page: Page) {
  await page.bringToFront()
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    })
    document.dispatchEvent(new Event('visibilitychange'))
    window.dispatchEvent(new FocusEvent('focus'))
  })
}

test('a tab that loses the lease while visible regains it and can edit again', async ({
  context,
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-1280x720',
    'The lease robustness regression runs once in Chromium.',
  )
  await openApp(page)
  const { label, account } = shortTermFundsLocators(page)
  await expect
    .poll(() => page.locator('.map-page svg').getAttribute('class'))
    .toBe('map-interactive')
  await dragBy(page, account, label, 80)

  const second = await context.newPage()
  await openApp(second)
  await dispatchVisibleFocus(second)
  await expect
    .poll(() => page.evaluate((key) => {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw).tabId : null
    }, WRITER_KEY))
    .not.toBeNull()
  await expect
    .poll(() => page.locator('.map-page svg').getAttribute('class'))
    .toBe('')
  await expect(page.locator('.map-readonly-banner')).toBeVisible()

  await dispatchVisibleFocus(page)
  await expect
    .poll(() => page.locator('.map-page svg').getAttribute('class'))
    .toBe('map-interactive')
  await dragBy(page, account, label, 80)
})

test('a single tab keeps editing across three heartbeat intervals', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-1280x720',
    'The lease robustness regression runs once in Chromium.',
  )
  await openApp(page)
  const { label, account } = shortTermFundsLocators(page)
  await expect
    .poll(() => page.locator('.map-page svg').getAttribute('class'))
    .toBe('map-interactive')

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await dragBy(page, account, label, attempt % 2 === 0 ? 80 : -80)
    await page.waitForTimeout(WRITER_HEARTBEAT_MS)
  }
})
