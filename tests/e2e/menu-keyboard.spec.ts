import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

test('Menu supports Home, End, and printable-character navigation', async ({ page }) => {
  await openApp(page)
  const trigger = page.getByRole('button', { name: 'Save map' })
  await trigger.click()
  await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeFocused()
  await page.keyboard.press('End')
  await expect(page.getByRole('menuitem', { name: 'SVG image' })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeFocused()
  await page.keyboard.press('s')
  await expect(page.getByRole('menuitem', { name: 'SVG image' })).toBeFocused()
})
