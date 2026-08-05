import { expect, test } from '@playwright/test'

test('selected account has a visible selection ring', async ({ page }, info) => {
  test.skip(
    info.project.name !== 'chromium-1440x900',
    'The selection-ring baseline uses the canonical editor viewport.',
  )
  await page.goto('/', { timeout: 5_000 })
  await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible({ timeout: 5_000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })

  const preview = page.locator('.preview-pane')
  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]').first()
  await account.locator('.map-account-body-hit:not(ellipse)').click({
    position: { x: 18, y: 18 },
    timeout: 5_000,
  })
  await expect(account).toHaveAttribute('data-map-selected', 'true', { timeout: 5_000 })
  await expect(preview).toHaveScreenshot('selection-ring.png', {
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
    maxDiffPixelRatio: 0.002,
    timeout: 5_000,
  })
})
