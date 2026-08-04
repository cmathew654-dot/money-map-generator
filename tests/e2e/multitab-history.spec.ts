import { expect, test } from '@playwright/test'
import { BOOK_KEY, focusPage, fullForm, openApp } from './helpers'

test('external writer snapshot invalidates stale undo history before ownership returns', async ({ context, page }) => {
  await openApp(page)
  await fullForm(page)

  const firstTitle = page.getByLabel('Title')
  await firstTitle.fill('Page A history seed')
  await firstTitle.press('Tab')
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), BOOK_KEY)).toContain('Page A history seed')

  const second = await context.newPage()
  await openApp(second)
  await fullForm(second)
  const authoritativeTitle = second.getByLabel('Title')
  await expect(authoritativeTitle).toHaveValue('Page A history seed')
  await focusPage(second)
  await expect(authoritativeTitle).toBeEnabled()
  await expect(firstTitle).toBeDisabled()

  await expect(authoritativeTitle).toHaveValue('Page A history seed')
  await authoritativeTitle.fill('Page B authoritative edit')
  await authoritativeTitle.press('Tab')
  await expect.poll(() => second.evaluate((key) => localStorage.getItem(key), BOOK_KEY)).toContain('Page B authoritative edit')
  await expect(firstTitle).toHaveValue('Page B authoritative edit')

  await focusPage(page)
  await expect(firstTitle).toBeEnabled()
  await expect(authoritativeTitle).toBeDisabled()
  await page.keyboard.press('ControlOrMeta+z')

  await expect(firstTitle).toHaveValue('Page B authoritative edit')
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), BOOK_KEY)).toContain('Page B authoritative edit')
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), BOOK_KEY)).not.toContain('Page A history seed')
})

test('writer takeover waits for a delayed incumbent to flush its pending edit', async ({ context, page }) => {
  await openApp(page)
  await fullForm(page)
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), BOOK_KEY)).toContain('Jordan & Dana Whitfield')

  const second = await context.newPage()
  await openApp(second)
  await fullForm(second)
  await focusPage(page)
  await expect(page.getByLabel('Title')).toBeEnabled()
  await expect(second.getByLabel('Title')).toBeDisabled()

  await page.getByLabel('Title').fill('Page A pending handoff edit')
  const incumbentBlock = page.evaluate(() => {
    localStorage.setItem('money-map-generator:test-incumbent-blocked', 'true')
    const releaseAt = performance.now() + 900
    while (performance.now() < releaseAt) { /* Deliberately delay the storage event. */ }
  })
  await expect.poll(() => second.evaluate(() => localStorage.getItem('money-map-generator:test-incumbent-blocked'))).toBe('true')
  await focusPage(second)
  await incumbentBlock
  await expect(page.getByLabel('Title')).toBeDisabled()

  await second.waitForTimeout(650)
  await expect(second.getByLabel('Title')).toHaveValue('Page A pending handoff edit')
  await expect.poll(() => second.evaluate((key) => localStorage.getItem(key), BOOK_KEY)).toContain('Page A pending handoff edit')
})
test('a stale lease from a crashed tab is reclaimed promptly on load, no TTL wait', async ({ context, page }) => {
  await context.addInitScript(() => {
    if (!location.origin.startsWith('http://127.0.0.1:')) return
    localStorage.setItem('money-map-generator:writer', JSON.stringify({
      tabId: 'crashed-tab',
      updatedAt: Date.now() - 9_000,
    }))
  })
  await openApp(page)
  await fullForm(page)
  const start = Date.now()
  await focusPage(page)
  // There is no lease TTL to wait out: acquireBrowserWriter(force) always
  // succeeds. Reclamation completes well under the old 9s TTL window.
  expect(Date.now() - start).toBeLessThan(5_000)
  await expect(page.getByLabel('Title')).toBeEnabled()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('money-map-generator:writer') || '{}').tabId)).not.toBe('crashed-tab')
})

test('focused money draft keeps its local undo and redo behavior', async ({ page }) => {
  await openApp(page)
  await fullForm(page)
  const field = page.locator('.money-input').first()

  await field.focus()
  const focusedOriginal = await field.inputValue()
  await field.fill('92000')
  await field.press('ControlOrMeta+z')
  await expect(field).toHaveValue(focusedOriginal)
  await field.press('ControlOrMeta+Shift+z')
  await expect(field).toHaveValue(/92,?000|\$92,?000/)
})
test('navigation pagehide hands ownership to the follower immediately', async ({ context, page }) => {
  await openApp(page)
  await fullForm(page)
  const second = await context.newPage()
  await openApp(second)
  await fullForm(second)
  await focusPage(page)
  await expect(second.getByLabel('Title')).toBeDisabled()

  await page.goto('about:blank')
  await expect(second.getByLabel('Title')).toBeEnabled({ timeout: 2_000 })
  await page.close()
})

test('background writer tab releases ownership for the visible follower', async ({ context, page }) => {
  await openApp(page)
  await fullForm(page)
  await expect(page.getByLabel('Title')).toBeEnabled()

  const second = await context.newPage()
  await openApp(second)
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
  })
  await fullForm(second)
  await second.bringToFront()
  await second.evaluate(() => window.dispatchEvent(new FocusEvent('focus')))
  await expect(second.getByLabel('Title')).toBeEnabled({ timeout: 2_000 })
  await expect(page.getByLabel('Title')).toBeDisabled()
})
