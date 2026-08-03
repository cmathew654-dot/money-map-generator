import { expect, test } from '@playwright/test'
import { assertWcag22AA, openApp } from './helpers'

test.describe('WCAG 2.2 AA certification', () => {
  test('editor', async ({ page }, info) => {
    await openApp(page)
    const rail = page.getByRole('complementary', { name: 'Editor tools' })
    for (const name of ['Add', 'Data', 'Contents', 'Help']) {
      const button = rail.getByRole('button', { name, exact: true })
      await expect(button).toBeVisible()
      await button.focus()
      await expect(button).toBeFocused()
      await button.click()
      const panel = page.getByRole('dialog', { name })
      await expect(panel.getByRole('heading', { name })).toBeFocused()
      await page.keyboard.press('Escape')
      await expect(button).toBeFocused()
    }
    await assertWcag22AA(page, info, 'editor')
  })
  test('wizard', async ({ page }, info) => { await openApp(page); await assertWcag22AA(page, info, 'wizard') })
  test('presentation', async ({ page }, info) => { await openApp(page); await page.getByRole('button', { name: 'Present' }).click(); await assertWcag22AA(page, info, 'presentation') })
})
