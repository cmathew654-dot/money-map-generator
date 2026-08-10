import { expect, test, type Locator, type Page } from '@playwright/test'
import { assertWcag22AA, openApp } from './helpers'

async function tabTo(page: Page, target: Locator) {
  for (let index = 0; index < 40; index += 1) {
    if (await target.evaluate((node) => node === document.activeElement)) return
    await page.keyboard.press('Tab')
  }
  throw new Error('Could not reach target with Tab')
}

test.describe('WCAG 2.2 AA certification', () => {
  test('editor', async ({ page }, info) => {
    await openApp(page)
    const header = page.locator('.app-header')
    await expect(page.getByRole('complementary', { name: 'Editor tools' })).toHaveCount(0)
    const exercisePanel = async (name: 'Contents', button: Locator) => {
      await expect(button).toBeVisible()
      await tabTo(page, button)
      await expect(button).toBeFocused()
      await page.keyboard.press('Enter')
      const panel = page.getByRole('dialog', { name })
      await expect(panel).toBeVisible()
      await expect(panel.getByRole('heading', { name })).toBeFocused()
      await assertWcag22AA(page, info, 'editor-' + name.toLowerCase())
      await page.keyboard.press('Tab')
      await expect(panel.getByRole('button', { name: 'Close ' + name + ' panel' })).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(button).toBeFocused()
    }
    const contentsButton = header.getByRole('button', { name: 'Contents', exact: true })
    await exercisePanel('Contents', contentsButton)
  })
  test('wizard', async ({ page }, info) => { await openApp(page); await assertWcag22AA(page, info, 'wizard') })
  test('presentation', async ({ page }, info) => { await openApp(page); await page.getByRole('button', { name: 'Present' }).click(); await assertWcag22AA(page, info, 'presentation') })
})
