import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { fullForm, openApp } from './helpers'

async function stabilize(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.evaluate(async () => { await document.fonts.ready })
  await page.locator('.toast').evaluateAll((toasts) => toasts.forEach((toast) => toast.remove()))
}

const screenshotOptions = {
  animations: 'disabled' as const,
  caret: 'hide' as const,
  fullPage: true,
  scale: 'css' as const,
  maxDiffPixelRatio: 0.001,
}

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
    await page.locator('.account-card').first().locator('summary').click()
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
})