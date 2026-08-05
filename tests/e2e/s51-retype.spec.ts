import { expect, test } from '@playwright/test'

test('aggregate account edits preserve rows and offer Data-panel navigation', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-1280x720',
    'The aggregate edit regression runs once in Chromium.',
  )

  await page.goto('/', { timeout: 5_000 })
  await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible({ timeout: 5_000 })

  const account = page.locator(
    '[data-account-id="managed-after-tax-trust"][role="group"]:visible',
  )
  await account
    .locator('[data-map-edit-key="accountValue:managed-after-tax-trust"]')
    .dblclick({ timeout: 5_000 })
  const editor = page.locator('.map-text-editor-input')
  await expect(editor).toBeVisible({ timeout: 5_000 })
  await editor.fill('999000', { timeout: 5_000 })
  await editor.press('Enter', { timeout: 5_000 })

  const notice = page.getByRole('button', {
    name: 'Total is the sum of its rows - Edit the rows.',
  })
  await expect(notice).toBeVisible({ timeout: 5_000 })
  await notice.click({ timeout: 5_000 })

  const panel = page.getByRole('dialog', { name: 'Data' })
  await expect(panel).toBeVisible({ timeout: 5_000 })
  const trustCard = panel.locator('.account-card').filter({
    has: panel.getByDisplayValue('Managed After-Tax Trust'),
  })
  const positions = trustCard.locator('.nested-list').filter({
    has: trustCard.getByRole('heading', { name: 'Positions' }),
  })
  await expect(positions.getByLabel('Value').nth(0)).toHaveValue('$380,000', {
    timeout: 5_000,
  })
  await expect(positions.getByLabel('Value').nth(1)).toHaveValue('$330,000', {
    timeout: 5_000,
  })
})
