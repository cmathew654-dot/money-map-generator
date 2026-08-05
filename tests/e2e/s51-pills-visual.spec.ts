import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

// s51 T-PILLS lane: the four scattered map-chrome pills become ONE docked bench.
// Labels, accessible names and handlers must survive the restyle untouched.

const BENCH = '.map-chrome .action-bench'
const ACTION_NAMES = ['Tidy map', 'Add text note', '+ Flow', '+ Account'] as const

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('money-map-generator:pan-zoom-hint:v1', 'dismissed')
  })
})

test.describe('s51 docked action bench', () => {
  test('groups all four actions under their existing accessible names', async ({ page }) => {
    await openApp(page)
    const bench = page.locator(BENCH)
    await expect(bench).toBeVisible({ timeout: 5_000 })
    for (const name of ACTION_NAMES) {
      await expect(
        bench.getByRole('button', { name, exact: true }),
        `bench is missing "${name}"`,
      ).toHaveCount(1, { timeout: 5_000 })
    }
  })

  test('+ Text note still places a note', async ({ page }) => {
    await openApp(page)
    const bench = page.locator(BENCH)
    await bench.getByRole('button', { name: 'Add text note', exact: true }).click({ timeout: 5_000 })
    await expect(page.locator('.text-placement-hint')).toBeVisible({ timeout: 5_000 })
    await page.locator('.map-page svg > [data-map-background="true"]').first().click({ timeout: 5_000 })
    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible({ timeout: 5_000 })
    await editor.fill('Bench note')
    await editor.press('Enter')
    await expect(editor).toHaveCount(0, { timeout: 5_000 })
    await expect(
      page.locator('[data-map-edit-hit^="noteText:"]').filter({ hasText: 'Bench note' }),
    ).toHaveCount(1, { timeout: 5_000 })
  })

  test('bench matches its visual baseline', async ({ page }) => {
    await openApp(page)
    const bench = page.locator(BENCH)
    await expect(bench).toBeVisible({ timeout: 5_000 })
    await page.evaluate(async () => { await document.fonts.ready })
    await page.locator('.toast').evaluateAll((toasts) => toasts.forEach((toast) => toast.remove()))
    await expect(bench).toHaveScreenshot('pills-bench.png', {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      maxDiffPixelRatio: 0.002,
    })
  })
})
