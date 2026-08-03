import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

const PAN_ZOOM_HINT_KEY = 'money-map-generator:pan-zoom-hint:v1'

type ButtonProbe = {
  label: string | null
  box: { left: number; top: number; right: number; bottom: number }
  withinViewport: boolean
  hitTestable: boolean
}

test.describe('toolbar reachable at 200 percent zoom (slice 11)', () => {
  test.use({ viewport: { width: 640, height: 360 } })

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-1280x720',
      'Viewport is forced via test.use; the 640x360 check runs once in the default Chromium project.',
    )
    await openApp(page)
  })

  test('every map-chrome button is inside the viewport and hit-testable at its center', async ({ page }) => {
    const probes: ButtonProbe[] = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll<HTMLElement>('.map-chrome button')]
      return buttons.map((button) => {
        const box = button.getBoundingClientRect()
        const cx = box.left + box.width / 2
        const cy = box.top + box.height / 2
        const hit = document.elementFromPoint(cx, cy)
        return {
          label: button.getAttribute('aria-label') || button.textContent?.trim() || null,
          box: { left: box.left, top: box.top, right: box.right, bottom: box.bottom },
          withinViewport:
            box.left >= 0 &&
            box.top >= 0 &&
            box.right <= window.innerWidth &&
            box.bottom <= window.innerHeight,
          hitTestable: hit === button || Boolean(hit && button.contains(hit)),
        }
      })
    })

    // Sanity: the toolbar actually rendered its buttons (Tidy map, + Text
    // note, + Account, and the zoom cluster's Zoom out / Zoom in / Fit).
    expect(probes.length).toBeGreaterThanOrEqual(5)

    for (const probe of probes) {
      expect(probe.withinViewport, `"${probe.label}" bounding box escapes the viewport: ${JSON.stringify(probe.box)}`).toBe(true)
      expect(probe.hitTestable, `"${probe.label}" center point does not hit-test to the button`).toBe(true)
    }
  })
})

test.describe('honest pan hint (slice 12)', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-1280x720',
      'The pan-hint copy regression runs once in Chromium.',
    )
    await page.addInitScript((key) => localStorage.removeItem(key), PAN_ZOOM_HINT_KEY)
    await openApp(page)
  })

  test('omits pan wording at fit zoom, states it once zoomed past fit', async ({ page }) => {
    const hint = page.locator('.pan-zoom-hint')
    await expect(hint).toBeVisible()

    // At load, mapZoom is 'fit' — panning is disabled, so the hint must not
    // promise it.
    await expect(hint).toContainText('Hold Ctrl')
    await expect(hint).not.toContainText('pan')

    await page.getByRole('button', { name: 'Zoom in' }).click()

    // Past fit zoom, panning is live — the hint should say so.
    await expect(hint).toContainText('pan')
  })
})
