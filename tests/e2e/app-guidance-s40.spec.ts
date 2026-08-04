import { expect, test } from '@playwright/test'
import { fullForm, openApp } from './helpers'

const PAN_ZOOM_HINT_KEY = 'money-map-generator:pan-zoom-hint:v1'
const WRITER_KEY = 'money-map-generator:writer'

test('pan and zoom guidance is editor-only and remembers either dismissal path', async ({ page }) => {
  await page.addInitScript(({ key, guard }) => {
    if (sessionStorage.getItem(guard)) return
    localStorage.removeItem(key)
    sessionStorage.setItem(guard, 'ready')
  }, { key: PAN_ZOOM_HINT_KEY, guard: 'pan-zoom-hint-test-ready' })
  await openApp(page)

  // Slice 12 (daa1b9a): at fit zoom, panning is disabled (beginMapPan no-ops
  // while mapZoom === 'fit'), so the hint omits the pan wording it can't
  // honor yet.
  const hint = page.locator('.pan-zoom-hint')
  await expect(hint).toBeVisible()
  await expect(hint).toContainText('Hold Ctrl')
  await expect(hint).not.toContainText('pan')

  await page.getByRole('button', { name: 'Present' }).click()
  await expect(hint).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(hint).toBeVisible()

  await page.getByRole('button', { name: 'Got it' }).click()
  await expect(hint).toHaveCount(0)
  await page.reload()
  await expect(hint).toHaveCount(0)

  await page.evaluate((key) => localStorage.removeItem(key), PAN_ZOOM_HINT_KEY)
  await page.reload()
  await expect(hint).toBeVisible()
  await page.locator('.map-scroller').dispatchEvent('wheel', {
    clientX: 700,
    clientY: 400,
    ctrlKey: true,
    deltaY: -100,
  })
  await expect(hint).toHaveCount(0)
  // The zoom actually moved past fit — panning (tested next) now works, and
  // a freshly-shown hint at this zoom level would include the pan wording
  // (see 'omits pan wording at fit zoom, states it once zoomed past fit' in
  // tests/e2e/chrome-layout.spec.ts, which asserts that branch directly).
  await expect(page.getByRole('button', { name: 'Fit' })).not.toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), PAN_ZOOM_HINT_KEY)).toBe('dismissed')

  await page.evaluate((key) => localStorage.removeItem(key), PAN_ZOOM_HINT_KEY)
  const scroller = page.locator('.map-scroller')
  const beforePan = await scroller.evaluate((element) => ({
    left: element.scrollLeft,
    top: element.scrollTop,
  }))
  const pan = await scroller.evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    for (let y = Math.ceil(bounds.top) + 56; y < bounds.bottom - 8; y += 8) {
      for (let x = Math.ceil(bounds.left) + 56; x < bounds.right - 8; x += 8) {
        if (document.elementFromPoint(x, y)?.closest('[data-map-background]')) {
          return {
            start: { x, y },
            end: { x: x - 48, y: y - 48 },
          }
        }
      }
    }
    throw new Error('No visible map background point found')
  })
  await page.mouse.move(pan.start.x, pan.start.y)
  await page.mouse.down()
  await page.mouse.move(pan.end.x, pan.end.y, { steps: 4 })
  await page.mouse.up()
  await expect.poll(() => scroller.evaluate((element) => ({
    left: element.scrollLeft,
    top: element.scrollTop,
  }))).not.toEqual(beforePan)
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), PAN_ZOOM_HINT_KEY)).toBe('dismissed')

  await page.reload()
  await expect(hint).toHaveCount(0)
})

test('the read-only banner offers an instant click-to-take-over of a live writer lease', async ({ page }) => {
  await page.addInitScript((writerKey) => {
    localStorage.setItem(writerKey, JSON.stringify({ tabId: 'other-live-tab', updatedAt: Date.now() }))
  }, WRITER_KEY)
  await openApp(page)
  await fullForm(page)

  const banner = page.locator('.map-readonly-banner')
  await expect(banner).toBeVisible()
  await expect(page.getByLabel('Title')).toBeDisabled()

  await banner.click()

  await expect(banner).toHaveCount(0)
  await expect(page.getByLabel('Title')).toBeEnabled()
  await expect
    .poll(() => page.evaluate((writerKey) => JSON.parse(localStorage.getItem(writerKey) || '{}').tabId, WRITER_KEY))
    .not.toBe('other-live-tab')
})

test('the first-run hint does not displace or cover map controls at 200 percent', async ({ page }) => {
  await page.addInitScript((key) => localStorage.removeItem(key), PAN_ZOOM_HINT_KEY)
  await page.setViewportSize({ width: 640, height: 360 })
  await openApp(page)

  const targets = [
    page.getByRole('button', { name: 'Tidy map' }),
    page.getByRole('button', { name: 'Add text note' }),
    page.getByRole('button', { name: '+ Account' }),
    page.getByLabel('Map zoom'),
    page.locator('.pan-zoom-hint'),
  ]
  for (const target of targets) await expect(target).toBeVisible()
  const boxes = await Promise.all(targets.map((target) => target.boundingBox()))
  expect(boxes.every((box) => box && box.x >= 0 && box.x + box.width <= 640)).toBe(true)
  for (let first = 0; first < boxes.length; first += 1) {
    for (let second = first + 1; second < boxes.length; second += 1) {
      const a = boxes[first]!
      const b = boxes[second]!
      expect(
        a.x + a.width <= b.x || b.x + b.width <= a.x ||
        a.y + a.height <= b.y || b.y + b.height <= a.y,
      ).toBe(true)
    }
  }
})
