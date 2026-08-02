import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { fullForm, openApp } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('money-map-generator:pan-zoom-hint:v1', 'dismissed')
  })
})

async function stabilize(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(async () => { await document.fonts.ready })
  await page.locator('.toast').evaluateAll((toasts) => toasts.forEach((toast) => toast.remove()))
}

const elementScreenshotOptions = {
  animations: 'disabled' as const,
  caret: 'hide' as const,
  scale: 'css' as const,
  maxDiffPixelRatio: 0.002,
}
const screenshotOptions = { ...elementScreenshotOptions, fullPage: true }

async function compareOrAttachReflow(page: Page, info: TestInfo, name: string) {
  if (info.project.name === 'chromium-text-zoom-200') {
    await info.attach(`${name}-640x360`, {
      body: await page.screenshot({ animations: 'disabled', caret: 'hide', fullPage: true, scale: 'css' }),
      contentType: 'image/png',
    })
  }
  await expect(page).toHaveScreenshot(`${name}.png`, screenshotOptions)
}

test.describe('desktop visual baselines', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Pixel baselines are certified in Windows Chromium projects; Firefox/WebKit retain behavioral and axe coverage.',
  )
  test('editor', async ({ page }, info) => {
    await openApp(page)
    await fullForm(page)
    const firstAccountSummary = page.locator('.account-card').first().locator('summary')
    await firstAccountSummary.evaluate((element) => {
      const pane = element.closest<HTMLElement>('.form-pane')
      if (!pane) throw new Error('Account summary is outside form pane')
      const paneRect = pane.getBoundingClientRect()
      const summaryRect = element.getBoundingClientRect()
      if (summaryRect.top < paneRect.top || summaryRect.bottom > paneRect.bottom) {
        element.scrollIntoView({ block: 'center', inline: 'nearest' })
      }
    })
    await firstAccountSummary.click()
    await stabilize(page)
    await compareOrAttachReflow(page, info, 'editor')
  })

  test('wizard', async ({ page }, info) => {
    await openApp(page)
    await stabilize(page)
    await compareOrAttachReflow(page, info, 'wizard')
  })

  test('present', async ({ page }, info) => {
    await openApp(page)
    await page.getByRole('button', { name: 'Present' }).click()
    await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
    await stabilize(page)
    await compareOrAttachReflow(page, info, 'present')
  })

  test('selected account, arrow, note, and calculated text', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium-1440x900', 'Selected-state baselines use the canonical editor viewport.')
    test.slow()
    await openApp(page)
    await fullForm(page)
    const preview = page.locator('.preview-pane')

    const account = page.locator('[data-account-id][role="group"]').first()
    await account.locator('.map-account-body-hit:not(ellipse)').click({ position: { x: 18, y: 18 } })
    await expect(page.locator('.map-inspector')).toBeVisible()
    await stabilize(page)
    await expect(preview).toHaveScreenshot('selected-account.png', elementScreenshotOptions)

    const arrowHit = page.getByRole('group', { name: /^Adjust flow from / }).first().locator('.map-arrow-hit')
    const arrowPoint = await arrowHit.evaluate((element) => {
      const path = element as SVGPathElement
      const point = path.getPointAtLength(path.getTotalLength() / 2)
      const matrix = path.getScreenCTM()
      if (!matrix) throw new Error('Arrow has no screen transform')
      return {
        x: matrix.a * point.x + matrix.c * point.y + matrix.e,
        y: matrix.b * point.x + matrix.d * point.y + matrix.f,
      }
    })
    await page.mouse.click(arrowPoint.x, arrowPoint.y)
    await expect(page.locator('.map-inspector')).toBeVisible()
    await stabilize(page)
    await expect(preview).toHaveScreenshot('selected-arrow.png', elementScreenshotOptions)

    await page.getByRole('button', { name: '+ Note', exact: true }).click()
    const editor = page.locator('.map-text-editor-input')
    await editor.fill('Selected state note')
    await editor.press('Enter')
    await page.getByRole('group', { name: 'Adjust note: Selected state note' }).focus()
    await expect(page.locator('.map-inspector')).toBeVisible()
    await stabilize(page)
    await expect(preview).toHaveScreenshot('selected-note.png', elementScreenshotOptions)

    const asNeeded = page.getByLabel('Monthly account withdrawal', { exact: true })
    await asNeeded.fill('9100')
    await asNeeded.press('Tab')
    await page.getByRole('button', { name: /^Adjust coverage note:/ }).focus()
    await expect(page.locator('.map-inspector')).toBeVisible()
    await stabilize(page)
    await expect(preview).toHaveScreenshot('selected-supporting-text.png', elementScreenshotOptions)
  })
})
