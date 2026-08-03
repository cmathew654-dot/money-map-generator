import { expect, test, type Locator, type Page } from '@playwright/test'
import { WRITER_HEARTBEAT_MS } from '../../src/model/browserStore'
import { openApp } from './helpers'

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

async function dragRight(page: Page, account: Locator, label: Locator) {
  const before = await account.boundingBox()
  const target = await label.boundingBox()
  if (!before || !target) throw new Error('Short-Term Funds target is not measurable')
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    target.x + target.width / 2 + 80,
    target.y + target.height / 2 + 40,
    { steps: 6 },
  )
  await page.mouse.up()
  await expect
    .poll(async () => (await account.boundingBox())?.x ?? before.x)
    .toBeGreaterThan(before.x + 20)
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
  await dragRight(page, account, label)

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
  await dragRight(page, account, label)
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
    await dragRight(page, account, label)
    await page.waitForTimeout(WRITER_HEARTBEAT_MS)
  }
})
