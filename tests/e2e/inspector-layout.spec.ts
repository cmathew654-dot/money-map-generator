import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-1280x720',
    'The inspector layout regression runs once in Chromium.',
  )
  await openApp(page)
})

test('inspector select controls never truncate their text', async ({ page }) => {
  const account = page.locator(
    '[data-account-id="cash-at-bank"][role="group"]',
  )
  const bodyHit = account.locator('.map-account-body-hit:not(ellipse)')
  const box = await bodyHit.boundingBox()
  if (!box) throw new Error('Account body hit has no measurable bounds')
  await bodyHit.click({
    position: { x: Math.min(32, box.width / 4), y: Math.max(16, box.height - 24) },
  })

  const inspector = page.locator('.map-inspector')
  await expect(inspector).toBeVisible()

  const shape = inspector.getByLabel('Shape', { exact: true })
  const accountType = inspector.getByLabel('Account type', { exact: true })
  const addFlowTo = inspector.getByLabel('Add flow to', { exact: true })

  await expect(shape).toBeVisible()
  await expect(accountType).toBeVisible()
  await expect(addFlowTo).toBeVisible()

  // Stress with the longest known option text so the fix is proven, not assumed.
  await shape.selectOption({ label: 'Cylinder' })
  await accountType.selectOption({ label: 'Tax-preferred' })

  for (const select of [shape, accountType, addFlowTo]) {
    await expect
      .poll(() => select.evaluate((el: HTMLSelectElement) => el.scrollWidth <= el.clientWidth))
      .toBe(true)
  }

  const allSelects = inspector.locator('select')
  const count = await allSelects.count()
  for (let index = 0; index < count; index += 1) {
    const select = allSelects.nth(index)
    expect(
      await select.evaluate((el: HTMLSelectElement) => el.scrollWidth <= el.clientWidth),
    ).toBe(true)
  }
})
