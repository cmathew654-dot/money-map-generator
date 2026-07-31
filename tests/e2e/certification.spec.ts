import { expect, test } from '@playwright/test'
import { BOOK_KEY, LEGACY_BOOK_KEY, evidence, fullForm, openApp } from './helpers'

test.describe('desktop behavioral certification', () => {
  test.beforeEach(async ({ page }) => openApp(page))

  test('untouched Whitfield is warning-free', async ({ page }, info) => {
    await expect(page.getByText('Export paused')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Print' })).toBeEnabled()
    await evidence(page, info, 'whitfield-warning-free')
  })

  test('full-form compound edits preserve the complete map', async ({ page }, info) => {
    await fullForm(page)
    const title = page.getByLabel('Title')
    await title.fill('Whitfield Compound Certification')
    const account = page.locator('.account-card').first()
    await account.locator('summary').click()
    const shape = account.locator('.shape-option').first()
    if (await shape.count()) await shape.click()
    for (const name of ['+ Add position', '+ Add subaccount', '+ Add fine print line', '+ Add note']) {
      const button = page.getByRole('button', { name, exact: true }).first()
      if (await button.count()) await button.click()
    }
    await expect(title).toHaveValue('Whitfield Compound Certification')
    await expect(page.locator('.map-page svg')).toBeVisible()
    await expect(page.locator('.map-page svg path[marker-end]').first()).toBeVisible()
    await evidence(page, info, 'compound-editor')
  })

  test('undo and redo synchronize a monetary edit', async ({ page }) => {
    await fullForm(page)
    const field = page.locator('.money-input').first()
    const original = await field.inputValue()
    await field.fill('92000'); await field.press('Tab')
    await page.keyboard.press('Control+z'); await expect(field).toHaveValue(original)
    await page.keyboard.press('Control+Shift+z'); await expect(field).toHaveValue(/92,?000|\$92,?000/)
  })

  test('new client completes the wizard', async ({ page }, info) => {
    await page.getByRole('button', { name: 'New', exact: true }).click()
    for (let i = 0; i < 4; i += 1) await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByRole('heading', { name: 'The map is ready.' })).toBeVisible()
    await evidence(page, info, 'wizard-complete')
  })

  test('Present shows the map and Escape exits', async ({ page }, info) => {
    await page.getByRole('button', { name: 'Present' }).click()
    await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
    await expect(page.locator('.map-page svg')).toBeVisible()
    await evidence(page, info, 'present-mode')
    await page.keyboard.press('Escape')
    await expect(page.locator('.app-shell')).not.toHaveClass(/is-presenting/)
  })

  test('writer ownership transfers between pages', async ({ context, page }) => {
    const second = await context.newPage(); await openApp(second)
    await expect(second.getByText('Read-only tab')).toBeVisible()
    await second.getByRole('button', { name: 'Take over editing' }).click()
    await expect(second.getByText('Read-only tab')).toHaveCount(0)
    await expect(page.getByText('Read-only tab')).toBeVisible()
  })

  test('legacy storage migrates without loss', async ({ browser, page }) => {
    await page.waitForTimeout(600)
    const raw = await page.evaluate((key) => localStorage.getItem(key), BOOK_KEY)
    if (!raw) throw new Error('Book not persisted')
    const context = await browser.newContext()
    await context.addInitScript(({ legacy, payload }) => {
      if (location.origin === 'http://127.0.0.1:4187') localStorage.setItem(legacy, payload)
    }, { legacy: LEGACY_BOOK_KEY, payload: raw })
    const migrated = await context.newPage(); await openApp(migrated)
    await expect.poll(() => migrated.evaluate((k) => Boolean(localStorage.getItem(k)), BOOK_KEY)).toBe(true)
    await expect.poll(() => migrated.evaluate((k) => localStorage.getItem(k), LEGACY_BOOK_KEY)).toBeNull()
    await context.close()
  })

  test('Save Book and PNG download', async ({ page }) => {
    await page.getByRole('button', { name: 'Book menu' }).click()
    const book = page.waitForEvent('download'); await page.getByRole('menuitem', { name: 'Save book' }).click()
    expect((await book).suggestedFilename()).toBe('money-map-book.json')
    await page.getByRole('button', { name: 'Save map' }).click()
    const png = page.waitForEvent('download'); await page.getByRole('menuitem', { name: 'PNG image' }).click()
    expect((await png).suggestedFilename()).toMatch(/Money Map.*\.png$/)
  })

  test('layout warning guards output', async ({ browser, page }, info) => {
    await page.waitForTimeout(600)
    const payload = await page.evaluate((key) => {
      const book = JSON.parse(localStorage.getItem(key) || '{}'); const client = book.clients?.[0]
      if (!client) throw new Error('No client'); const seed = client.accounts[0]
      client.accounts.push(...Array.from({ length: 30 }, (_, i) => ({ ...seed, id: 'stress-' + i, label: 'Stress account ' + (i + 1) + ' with a long wrapped title' })))
      return JSON.stringify(book)
    }, BOOK_KEY)
    const context = await browser.newContext()
    await context.addInitScript(({ key, value, expectedOrigin }) => {
      if (location.origin === expectedOrigin) localStorage.setItem(key, value)
    }, { key: BOOK_KEY, value: payload, expectedOrigin: new URL(page.url()).origin })
    const stressed = await context.newPage(); await openApp(stressed)
    await expect(stressed.getByText('Export paused')).toBeVisible()
    await expect(stressed.getByRole('button', { name: 'Print' })).toBeDisabled()
    await evidence(stressed, info, 'layout-warning-guard')
    await context.close()
  })

  test('200 percent zoom remains operable', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium-text-zoom-200', 'Dedicated zoom project')
    await page.evaluate(() => { document.body.style.zoom = '200%' })
    await expect(page.getByRole('button', { name: 'Full form' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Print' })).toBeVisible()
    await evidence(page, info, 'text-zoom-200')
  })
})
