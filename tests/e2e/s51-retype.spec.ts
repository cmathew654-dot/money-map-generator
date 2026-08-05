import { expect, test } from '@playwright/test'

const NOTICE = 'Total is the sum of its rows — Edit the rows'
const TOTAL = '[data-map-edit-key="accountValue:managed-after-tax-trust"]'

test('retyping an aggregate account total leaves the rows alone and points at them', async ({
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
  // The number itself, not the transparent hit rect that carries the edit key.
  const total = account.getByText('$710,000')
  const notice = page.getByRole('button', { name: NOTICE })
  const retypeTotal = async () => {
    await account.locator(TOTAL).dblclick({ timeout: 5_000 })
    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible({ timeout: 5_000 })
    await editor.fill('999000', { timeout: 5_000 })
    await editor.press('Enter', { timeout: 5_000 })
  }

  await retypeTotal()
  await expect(notice).toBeVisible({ timeout: 5_000 })
  // The refused edit must never reach the map.
  await expect(total).toBeVisible({ timeout: 5_000 })
  await expect(account).not.toContainText('$999,000', { timeout: 5_000 })

  await page.keyboard.press('Escape')
  await expect(notice).toBeHidden({ timeout: 5_000 })
  await expect(total).toBeVisible({ timeout: 5_000 })
  await expect(account).not.toContainText('$999,000', { timeout: 5_000 })

  await retypeTotal()
  await notice.click({ timeout: 5_000 })
  await expect(notice).toBeHidden({ timeout: 5_000 })

  const panel = page.getByRole('dialog', { name: 'Data' })
  await expect(panel).toBeVisible({ timeout: 5_000 })
  const positions = panel
    .locator('details[data-account-id="managed-after-tax-trust"] .nested-list')
    .first()
  await expect(positions.getByLabel('Value').nth(0)).toHaveValue('$380,000', {
    timeout: 5_000,
  })
  await expect(positions.getByLabel('Value').nth(1)).toHaveValue('$330,000', {
    timeout: 5_000,
  })
})

test('a text size staged on an aggregate total survives the notice that refuses the number', async ({
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
  const total = account.locator('text[aria-label="$710,000"]').first()
  const fontSize = async () => Number(await total.getAttribute('font-size'))
  const before = await fontSize()

  await account.locator(TOTAL).dblclick({ timeout: 5_000 })
  const editor = page.locator('.map-text-editor-input')
  await expect(editor).toBeVisible({ timeout: 5_000 })
  // Shrinking cannot be clamped by the fit-to-box the box would apply going up.
  await page
    .locator('.map-text-size-controls')
    .getByRole('button', { name: 'Decrease font size' })
    .click({ timeout: 5_000 })
  await expect
    .poll(fontSize, { timeout: 5_000 })
    .toBeLessThan(before)

  await editor.fill('999000', { timeout: 5_000 })
  await editor.press('Enter', { timeout: 5_000 })
  const notice = page.getByRole('button', { name: NOTICE })
  await expect(notice).toBeVisible({ timeout: 5_000 })
  await page.keyboard.press('Escape')
  await expect(notice).toBeHidden({ timeout: 5_000 })

  // The refused number snaps back; the size the advisor watched apply does not.
  await expect(total).toBeVisible({ timeout: 5_000 })
  await expect(account).not.toContainText('$999,000', { timeout: 5_000 })
  expect(await fontSize()).toBeLessThan(before)
})
