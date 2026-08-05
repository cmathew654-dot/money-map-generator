import { expect, test, type Page } from '@playwright/test'
import { openApp } from './helpers'

const ACT = 5_000

async function dblclickLine(page: Page, key: string, lineIndex: number) {
  const text = page
    .locator(`text[data-map-edit-key="${key}"], text[data-map-edit-visual="${key}"]`)
    .first()
  // Wrapped labels paint each line in a <tspan>; single-line ones may not.
  const spans = text.locator('tspan')
  const line = (await spans.count()) > 0 ? spans.nth(lineIndex) : text
  await expect(line).toBeVisible({ timeout: ACT })
  const box = await line.boundingBox({ timeout: ACT })
  expect(box, `no box for ${key} line ${lineIndex}`).not.toBeNull()
  await page.mouse.dblclick(box!.x + box!.width / 2, box!.y + box!.height / 2)
}

async function expectEditor(page: Page, value: string) {
  const input = page.locator('.map-text-editor-input')
  await expect(input).toBeVisible({ timeout: ACT })
  await expect(input).toHaveValue(value, { timeout: ACT })
  await page.keyboard.press('Escape')
  await expect(input).toBeHidden({ timeout: ACT })
}

test.describe('s51 double-click opens the text editor on wrapped labels', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page)
    await expect(page.locator('[data-account-id]').first()).toBeVisible({ timeout: ACT })
  })

  // Wrapped sub-account label: renders as "Short-Term" / "Funds".
  for (const lineIndex of [0, 1]) {
    test(`wrapped sub-account label line ${lineIndex + 1}`, async ({ page }) => {
      await dblclickLine(page, 'accountSubLabel:managed-ira-jordan:0', lineIndex)
      await expectEditor(page, 'Short-Term Funds')
    })
  }

  // Wrapped position label: renders as "S&P 500 Index" / "Fund".
  for (const lineIndex of [0, 1]) {
    test(`wrapped position label line ${lineIndex + 1}`, async ({ page }) => {
      await dblclickLine(page, 'accountPositionLabel:managed-after-tax-trust:0', lineIndex)
      await expectEditor(page, 'S&P 500 Index Fund')
    })
  }

  test('wrapped sub-account caption', async ({ page }) => {
    await dblclickLine(page, 'accountSubCaption:managed-ira-jordan:0', 1)
    await expectEditor(page, 'Target ~$160,000 — Annual RMDs')
  })

  // Regression guard: these already worked and must keep working.
  for (const lineIndex of [0, 1]) {
    test(`wrapped account title line ${lineIndex + 1}`, async ({ page }) => {
      await dblclickLine(page, 'accountLabel:managed-after-tax-trust', lineIndex)
      await expectEditor(page, 'Managed After-Tax Trust')
    })
  }

  test('single-line account title', async ({ page }) => {
    await dblclickLine(page, 'accountLabel:roth-ira-dana', 0)
    await expectEditor(page, 'Roth IRA — Dana')
  })

  test('account value', async ({ page }) => {
    await dblclickLine(page, 'accountPositionValue:managed-after-tax-trust:0', 0)
    await expectEditor(page, '$380,000')
  })
})
