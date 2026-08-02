import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

const PAN_ZOOM_HINT_KEY = 'money-map-generator:pan-zoom-hint:v1'
const TAKEOVER_REQUEST_KEY = 'money-map-generator:writer-takeover-request'
const WRITER_KEY = 'money-map-generator:writer'

test('pan and zoom guidance is editor-only and remembers either dismissal path', async ({ page }) => {
  await page.addInitScript(({ key, guard }) => {
    if (sessionStorage.getItem(guard)) return
    localStorage.removeItem(key)
    sessionStorage.setItem(guard, 'ready')
  }, { key: PAN_ZOOM_HINT_KEY, guard: 'pan-zoom-hint-test-ready' })
  await openApp(page)

  const hint = page.getByText(
    'Hold Ctrl (or ⌘ on Mac) while scrolling to zoom. Drag the map background to pan.',
  )
  await expect(hint).toBeVisible()

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

test('a delayed writer handoff offers a retry without replacing the live lease', async ({ page }) => {
  const now = new Date('2026-08-01T12:00:00Z')
  await page.clock.install({ time: now })
  await page.addInitScript(({ writerKey }) => {
    localStorage.setItem(writerKey, JSON.stringify({ tabId: 'other-live-tab', updatedAt: Date.now() }))
  }, { writerKey: WRITER_KEY })
  await openApp(page)
  await page.clock.runFor(2_000)

  const status = page.getByRole('status', { name: 'Editing handoff status' })
  await expect(status).toContainText(/another tab|other tab/i, { timeout: 3_500 })
  await expect(status.getByRole('button', { name: 'Try again' })).toBeVisible()

  const before = await page.evaluate(({ requestKey, writerKey }) => ({
    request: JSON.parse(localStorage.getItem(requestKey) || '{}') as { requestedAt?: number },
    writer: localStorage.getItem(writerKey),
  }), { requestKey: TAKEOVER_REQUEST_KEY, writerKey: WRITER_KEY })

  const retriedAt = (await page.evaluate(() => Date.now())) + 1
  expect(retriedAt).toBeGreaterThan(before.request.requestedAt ?? 0)
  await page.clock.pauseAt(retriedAt)
  await status.getByRole('button', { name: 'Try again' }).click()

  const after = await page.evaluate(({ requestKey, writerKey }) => ({
    request: JSON.parse(localStorage.getItem(requestKey) || '{}') as { requestedAt?: number },
    writer: localStorage.getItem(writerKey),
  }), { requestKey: TAKEOVER_REQUEST_KEY, writerKey: WRITER_KEY })
  expect(after.request.requestedAt).toBe(retriedAt)
  expect(after.writer).toBe(before.writer)
})

test('the first-run hint does not displace or cover map controls at 200 percent', async ({ page }) => {
  await page.addInitScript((key) => localStorage.removeItem(key), PAN_ZOOM_HINT_KEY)
  await page.setViewportSize({ width: 640, height: 360 })
  await openApp(page)

  const targets = [
    page.getByRole('button', { name: '+ Note' }),
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
