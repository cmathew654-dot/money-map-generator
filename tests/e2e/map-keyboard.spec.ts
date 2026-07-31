import { expect, test } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'

test('keyboard arrangement persists move, resize, rotate, text offset, and connector reconnection', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  await account.focus()
  await expect(account).toBeFocused()
  await expect(account).toHaveAttribute('aria-keyshortcuts', /ArrowRight/)
  await expect(account).not.toHaveClass(/highlight/)
  for (const key of ['Enter', 'Space']) {
    await account.focus()
    await page.keyboard.press(key)
    await expect(account).toBeFocused()
    await expect(account).not.toHaveClass(/highlight/)
  }
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Alt+ArrowRight')
  await page.keyboard.press(']')

  const incomeHeader = page.locator('[data-map-edit-key="incomeHeader"]').first()
  await incomeHeader.focus()
  await expect(incomeHeader).toBeFocused()
  await expect(incomeHeader).toHaveAttribute('aria-keyshortcuts', /Shift\+ArrowDown/)
  await page.keyboard.press('Shift+ArrowDown')

  const customArrow = page.getByRole('group', { name: 'Adjust custom arrow' }).first()
  await customArrow.focus()
  await expect(customArrow).toBeFocused()
  await expect(customArrow).toHaveAttribute('aria-keyshortcuts', /Control\+ArrowRight/)
  await page.keyboard.press('Control+ArrowRight')

  await expect.poll(() => page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const persisted = JSON.parse(raw)
    const client = persisted.clients.find(
      (item: { id: string }) => item.id === 'sample-whitfield',
    )
    if (!client) return null
    const accountOverride = client.layoutOverrides?.['cash-at-bank']
    const textOverride = client.layoutOverrides?.['text:income:header']
    return {
      moved: (accountOverride?.dx ?? 0) > 0,
      resized: (accountOverride?.w ?? 0) > 0,
      rotation: accountOverride?.rot,
      textOffset: textOverride?.dy,
      reconnected:
        client.customArrows?.[0]?.targetId !== 'managed-after-tax-trust',
    }
  }, BOOK_KEY)).toEqual({
    moved: true,
    resized: true,
    rotation: 15,
    textOffset: 10,
    reconnected: true,
  })
})