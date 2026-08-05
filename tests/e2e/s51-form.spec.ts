import { expect, test, type Page } from '@playwright/test'
import { openApp } from './helpers'

const ACT = { timeout: 5_000 }
const SEE = { timeout: 5_000 }

function mapAccount(page: Page, id: string) {
  return page
    .locator(`svg.map-interactive [data-account-id="${id}"][role="group"]`)
    .locator('.map-account-body-hit:not(ellipse)')
}

async function openData(page: Page) {
  await page.getByRole('button', { name: 'Data', exact: true }).click(ACT)
  const panel = page.getByRole('dialog', { name: 'Data' })
  await expect(panel).toBeVisible(SEE)
  return panel
}

test.describe('s51 Data panel ledger', () => {
  test('a map selection auto-expands and reveals that ledger row', async ({ page }) => {
    await openApp(page)
    const panel = await openData(page)

    const cashRow = panel.locator('[data-account-id="cash-at-bank"] button.account-summary')
    const rothRow = panel.locator('[data-account-id="roth-ira-dana"] button.account-summary')
    await expect(cashRow).toHaveAttribute('aria-expanded', 'false', SEE)

    await mapAccount(page, 'cash-at-bank').click(ACT)
    await expect(cashRow).toHaveAttribute('aria-expanded', 'true', SEE)
    await expect(
      panel.locator('[data-account-id="cash-at-bank"] .account-body'),
    ).toBeInViewport({ ratio: 0.1, ...SEE })

    // Selecting another account on the map moves the auto-expanded row.
    await mapAccount(page, 'roth-ira-dana').click(ACT)
    await expect(rothRow).toHaveAttribute('aria-expanded', 'true', SEE)
    await expect(cashRow).toHaveAttribute('aria-expanded', 'false', SEE)
  })

  test('the row toggles on click and the filter narrows the ledger', async ({ page }) => {
    await openApp(page)
    const panel = await openData(page)

    const cashRow = panel.locator('[data-account-id="cash-at-bank"] button.account-summary')
    await cashRow.click(ACT)
    await expect(cashRow).toHaveAttribute('aria-expanded', 'true', SEE)
    await cashRow.click(ACT)
    await expect(cashRow).toHaveAttribute('aria-expanded', 'false', SEE)

    await panel.getByLabel('Filter data').fill('Roth', ACT)
    await expect(panel.locator('[data-account-id="roth-ira-dana"]')).toHaveCount(1, SEE)
    await expect(panel.locator('[data-account-id="cash-at-bank"]')).toHaveCount(0, SEE)
  })

  test('the in-panel close button closes the Data panel', async ({ page }) => {
    await openApp(page)
    const panel = await openData(page)

    await panel.getByRole('button', { name: 'Close Data panel' }).click(ACT)
    await expect(panel).toHaveCount(0, SEE)
  })
})
