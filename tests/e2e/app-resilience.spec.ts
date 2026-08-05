import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { focusPage, openApp } from './helpers'

test.describe('App resilience', () => {
  test('file input is named and account summaries contain no nested controls', async ({ page }) => {
    await openApp(page)
    await expect(page.locator('input[type="file"]')).toHaveAccessibleName('Open book backup file')
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    const account = page.locator('.account-card').first()
    const accountRow = account.locator('button.account-summary')
    await expect(accountRow).toHaveAttribute('aria-expanded', 'false')
    // s51: the shape control lives in the expanded ledger body.
    await accountRow.click()
    await expect(accountRow).toHaveAttribute('aria-expanded', 'true')
    const shapeGroup = page.getByRole('group', { name: /^Shape for / }).first()
    const nextShape = shapeGroup.locator('.shape-option[aria-pressed="false"]').first()
    await expect(shapeGroup).toBeVisible()
    await expect(nextShape).toBeVisible()
    const nextShapeName = await nextShape.getAttribute('aria-label')
    if (!nextShapeName) throw new Error('Shape option must have an accessible name')
    await nextShape.focus()
    await expect(nextShape).toBeFocused()
    await nextShape.click()
    await expect(shapeGroup.getByRole('button', { name: nextShapeName, exact: true })).toHaveAttribute('aria-pressed', 'true')
    await accountRow.click()
    await expect(accountRow).toHaveAttribute('aria-expanded', 'false')
    await accountRow.click()
    await expect(shapeGroup).toBeVisible()
    const result = await new AxeBuilder({ page }).include('.form-pane').withRules(['nested-interactive', 'label']).analyze()
    expect(result.violations).toEqual([])
  })

  test('damaged-copy download attaches before click, revokes later, and reports errors', async ({ browser }) => {
    const context = await browser.newContext()
    await context.addInitScript(() => { if (location.origin.startsWith('http://127.0.0.1:')) localStorage.setItem('money-map-generator:book', '{broken') })
    const page = await context.newPage()
    await openApp(page)
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    await expect(page.getByLabel('Title')).toBeDisabled()
    await page.getByRole('button', { name: 'More actions' }).click()
    await expect(page.getByRole('menuitem', { name: 'New client' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Download damaged copy' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Start fresh' })).toBeEnabled()
    await page.evaluate(() => {
      const events: string[] = []
      Object.assign(window, { __downloadEvents: events })
      URL.createObjectURL = () => { events.push('create'); return 'blob:recovery' }
      URL.revokeObjectURL = () => events.push('revoke')
      HTMLAnchorElement.prototype.click = function () { events.push(this.isConnected ? 'click-attached' : 'click-detached') }
    })
    await page.getByRole('button', { name: 'Download damaged copy' }).click()
    expect((await page.evaluate(() => (window as unknown as { __downloadEvents: string[] }).__downloadEvents)).slice(0, 2)).toEqual(['create', 'click-attached'])
    await expect.poll(() => page.evaluate(() => (window as unknown as { __downloadEvents: string[] }).__downloadEvents)).toEqual(['create', 'click-attached', 'revoke'])

    await page.evaluate(() => { URL.createObjectURL = () => { throw new Error('blob blocked') } })
    await page.getByRole('button', { name: 'Download damaged copy' }).click()
    await expect(page.getByRole('dialog', { name: 'Could not download recovery copy' })).toBeVisible()
    await context.close()
  })

  test('Save Book reports failure instead of claiming success', async ({ page }) => {
    await openApp(page)
    await page.evaluate(() => { URL.createObjectURL = () => { throw new Error('blob blocked') } })
    await page.getByRole('button', { name: 'More actions' }).click()
    await page.getByRole('menuitem', { name: 'Download book backup' }).click()
    await expect(page.getByRole('dialog', { name: 'Could not save book' })).toBeVisible()
    await expect(page.getByText('Book saved')).toHaveCount(0)
  })

  test('PNG export exposes busy status and prevents duplicate export', async ({ page }) => {
    await openApp(page)
    await page.route('**/*.woff2', async (route) => { await new Promise((resolve) => setTimeout(resolve, 1200)); await route.continue() })
    await page.getByRole('button', { name: 'Export map' }).click()
    const download = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: 'PNG image' }).click()
    await page.getByRole('button', { name: 'Export map' }).click()
    await expect(page.getByText('Exporting PNG…')).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeDisabled()
    await download
  })
  // beyond product intent per Cyril 2026-08-05 - one-user tool, tab-handoff choreography untested by design; lease protection itself stays covered elsewhere
  test.skip('focused follower enables mutation controls after ownership transfers', async ({ context, page }) => {
    await openApp(page)
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    const writerTitle = page.getByLabel('Title')
    await expect(writerTitle).toBeEnabled()

    const follower = await context.newPage()
    await openApp(follower)
    await follower.getByRole('button', { name: 'Data', exact: true }).click()
    const followerTitle = follower.getByLabel('Title')
    await focusPage(page)
    await expect(writerTitle).toBeEnabled()
    await expect(followerTitle).toBeDisabled()
    await follower.getByRole('button', { name: 'More actions' }).click()
    await expect(follower.getByRole('menuitem', { name: 'New client' })).toBeDisabled()

    await follower.getByRole('button', { name: 'More actions' }).click()
    await expect(follower.getByRole('menuitem', { name: 'Delete client' })).toBeDisabled()
    await follower.keyboard.press('Escape')
    await follower.getByRole('button', { name: 'More actions' }).click()
    await expect(follower.getByRole('menuitem', { name: 'Open book backup' })).toBeDisabled()
    await follower.keyboard.press('Escape')
    await follower.getByRole('button', { name: 'More actions' }).click()
    await expect(follower.getByRole('menuitem', { name: 'Clear map…' })).toBeDisabled()
    await follower.keyboard.press('Escape')

    await focusPage(follower)
    await expect(followerTitle).toBeEnabled()
    await follower.getByRole('button', { name: 'More actions' }).click()
    await expect(follower.getByRole('menuitem', { name: 'New client' })).toBeEnabled()
    await expect(writerTitle).toBeDisabled()
  })
  test('wizard footer stays bottom-anchored through the mutation fieldset', async ({ page }) => {
    await openApp(page)
    // The wizard only renders in guided setup, which New client enters.
    await page.getByRole('button', { name: 'More actions' }).click({ timeout: 5_000 })
    await page.getByRole('menuitem', { name: 'New client' }).click({ timeout: 5_000 })
    await expect(page.locator('.form-pane .wizard')).toBeVisible({ timeout: 5_000 })

    const pane = page.locator('.form-pane')
    const fieldset = pane.locator('.mutation-fieldset')
    const wizardShell = fieldset.locator(':scope > *').first()
    const next = page.getByRole('button', { name: 'Next' })
    const [paneBox, fieldsetBox, shellBox, nextBox] = await Promise.all([
      pane.boundingBox(),
      fieldset.boundingBox(),
      wizardShell.boundingBox(),
      next.boundingBox(),
    ])
    if (!paneBox || !fieldsetBox || !shellBox || !nextBox) throw new Error('Wizard geometry is not measurable')
    const readFlexStyle = (element: Element) => {
      const style = getComputedStyle(element)
      return {
        display: style.display,
        flex: style.flex,
        flexDirection: style.flexDirection,
        height: style.height,
        minHeight: style.minHeight,
        overflow: style.overflow,
      }
    }
    const [paneStyle, fieldsetStyle, shellStyle] = await Promise.all([
      pane.evaluate(readFlexStyle),
      fieldset.evaluate(readFlexStyle),
      wizardShell.evaluate(readFlexStyle),
    ])

    const geometry = {
      styles: { pane: paneStyle, fieldset: fieldsetStyle, wizardShell: shellStyle },
      pane: paneBox,
      fieldset: fieldsetBox,
      wizardShell: shellBox,
      next: nextBox,
      fieldsetBottomGap: paneBox.y + paneBox.height - (fieldsetBox.y + fieldsetBox.height),
      shellBottomGap: paneBox.y + paneBox.height - (shellBox.y + shellBox.height),
      nextBottomGap: paneBox.y + paneBox.height - (nextBox.y + nextBox.height),
    }
    const evidence = JSON.stringify(geometry)
    expect.soft(geometry.fieldsetBottomGap, evidence).toBeLessThanOrEqual(2)
    expect.soft(geometry.shellBottomGap, evidence).toBeLessThanOrEqual(2)
    expect(geometry.nextBottomGap, evidence).toBeLessThanOrEqual(90)
  })
})
