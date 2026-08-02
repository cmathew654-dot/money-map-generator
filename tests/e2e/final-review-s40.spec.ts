import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

test('undoing a selected duplicate clears the stale inspector state', async ({ page }) => {
  await openApp(page)

  const accounts = page.getByRole('group', {
    name: 'Managed IRA — Jordan',
    exact: true,
  })
  await accounts.first().focus()
  await accounts.first().press('Enter')
  await page.locator('.map-inspector').getByRole('button', { name: 'Duplicate' }).click()
  await expect(accounts).toHaveCount(2)
  await expect(page.locator('.preview-pane')).toHaveClass(/has-map-inspector/)

  await page.getByRole('button', { name: 'Undo' }).click()

  await expect(accounts).toHaveCount(1)
  await expect(page.locator('.map-inspector')).toHaveCount(0)
  await expect(page.locator('.preview-pane')).not.toHaveClass(/has-map-inspector/)
})
