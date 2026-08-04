import { expect, test } from '@playwright/test'
import { BOOK_KEY, LEGACY_BOOK_KEY, evidence, focusPage, fullForm, openApp } from './helpers'

test.describe('desktop behavioral certification', () => {
  test.beforeEach(async ({ page }) => openApp(page))

  test('untouched Whitfield keeps output controls available', async ({ page }, info) => {
    await expect(page.getByText('Export paused')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Print', exact: true })).toBeEnabled()
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
    const undo = page.getByRole('button', { name: 'Undo', exact: true })
    await expect(undo).toBeEnabled()
    await undo.click()
    await expect(field).toHaveValue(original)
    const redo = page.getByRole('button', { name: 'Redo', exact: true })
    await expect(redo).toBeEnabled()
    await redo.click()
    await expect(field).toHaveValue(/92,?000|\$92,?000/)
  })

  test('new client completes the wizard', async ({ page }, info) => {
    await page.getByRole('button', { name: 'More actions' }).click()
    await page.getByRole('menuitem', { name: 'New client' }).click()
    for (let i = 0; i < 4; i += 1) await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByRole('heading', { name: 'Review the map before sharing.' })).toBeVisible()
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

  test('writer ownership follows the focused page, with the banner marking the read-only tab', async ({ context, page }) => {
    await fullForm(page)
    const firstTitle = page.getByLabel('Title')
    const firstBanner = page.locator('.map-readonly-banner')
    const second = await context.newPage(); await openApp(second)
    await fullForm(second)
    const secondTitle = second.getByLabel('Title')
    const secondBanner = second.locator('.map-readonly-banner')

    await focusPage(second)
    await expect(secondTitle).toBeEnabled()
    await expect(secondBanner).toHaveCount(0)
    await expect(firstTitle).toBeDisabled()
    await expect(firstBanner).toBeVisible()

    await focusPage(page)
    await expect(firstTitle).toBeEnabled()
    await expect(firstBanner).toHaveCount(0)
    await expect(secondTitle).toBeDisabled()
    await expect(secondBanner).toBeVisible()
  })

  test('writer ownership survives rapid tab handoffs with edits', async ({ context, page }) => {
    test.setTimeout(180_000)
    const second = await context.newPage(); await openApp(second)
    await focusPage(page)
    await page.getByLabel('Title').fill('Rapid handoff seed')
    await page.getByLabel('Title').press('Tab')

    for (let switchIndex = 0; switchIndex < 25; switchIndex += 1) {
      const active = switchIndex % 2 === 0 ? second : page
      await focusPage(active)
      const value = `Rapid handoff ${switchIndex + 1}`
      await active.getByLabel('Title').fill(value)
      await active.getByLabel('Title').press('Tab')
    }
    await focusPage(page)
    await expect(page.getByLabel('Title')).toHaveValue('Rapid handoff 25')
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

  test('Save Book and map exports download', async ({ page }) => {
    await page.getByRole('button', { name: 'More actions' }).click()
    const book = page.waitForEvent('download'); await page.getByRole('menuitem', { name: 'Download book backup' }).click()
    expect((await book).suggestedFilename()).toBe('money-map-book.json')
    for (const [name, extension] of [
      ['PNG image', 'png'],
      ['PDF image snapshot', 'pdf'],
      ['SVG image', 'svg'],
    ] as const) {
      await page.getByRole('button', { name: 'Export map' }).click()
      const download = page.waitForEvent('download')
      await page.getByRole('menuitem', { name }).click()
      expect((await download).suggestedFilename()).toMatch(
        new RegExp(`Money Map.*\\.${extension}$`),
      )
    }
  })

  test('print media shows only the dedicated map', async ({ page }) => {
    await page.emulateMedia({ media: 'print' })
    await expect.poll(() => page.locator('.app-shell').evaluate((shell) =>
      [...shell.children].every((child) =>
        child.classList.contains('print-map')
          ? getComputedStyle(child).display === 'grid'
          : getComputedStyle(child).display === 'none',
      ),
    )).toBe(true)
  })
  test('layout warnings remain diagnostic and never gate output', async ({ browser, page }, info) => {
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
    await expect(stressed.getByText('Export paused')).toHaveCount(0)
    await stressed.evaluate(() => {
      ;(window as Window & { __printCalls?: number }).__printCalls = 0
      window.print = () => {
        ;(window as Window & { __printCalls?: number }).__printCalls! += 1
      }
    })
    await expect(stressed.getByRole('button', { name: 'Print', exact: true })).toBeEnabled()
    await stressed.getByRole('button', { name: 'Print', exact: true }).click()
    await expect.poll(() => stressed.evaluate(() => (window as Window & { __printCalls?: number }).__printCalls)).toBe(1)
    await stressed.getByRole('button', { name: 'Export map' }).click()
    for (const name of ['PNG image', 'PDF image snapshot', 'SVG image']) {
      await expect(stressed.getByRole('menuitem', { name })).toBeEnabled()
    }
    await evidence(stressed, info, 'layout-warning-diagnostics')
    await context.close()
  })

  test('200 percent zoom remains operable', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium-text-zoom-200', 'Dedicated zoom project')
    await page.evaluate(() => { document.body.style.zoom = '200%' })
    await expect(page.getByRole('button', { name: 'Data', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Print', exact: true })).toBeVisible()
    await evidence(page, info, 'text-zoom-200')
  })
})
