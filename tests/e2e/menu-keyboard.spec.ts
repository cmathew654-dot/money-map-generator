import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

test('Menu supports Home, End, and printable-character navigation', async ({ page }) => {
  await openApp(page)
  const trigger = page.getByRole('button', { name: 'Export map' })
  await trigger.click()
  await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeFocused()
  await page.keyboard.press('End')
  await expect(page.getByRole('menuitem', { name: 'SVG image' })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeFocused()
  await page.keyboard.press('s')
  await expect(page.getByRole('menuitem', { name: 'SVG image' })).toBeFocused()
})

test('active client combobox keeps input focus through Arrow navigation and Escape', async ({ page }) => {
  await openApp(page)

  const combo = page.getByRole('combobox', { name: 'Active client' })
  await combo.focus()
  await combo.press('ArrowDown')
  await expect(page.getByRole('listbox')).toBeVisible()
  await expect(combo).toHaveAttribute('aria-activedescendant', /.+/)
  await combo.press('Escape')
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(combo).toBeFocused()
})
