import { expect, test, type Page } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'
import { SAMPLE_WHITFIELD } from '../../src/model/samples'
import type { MoneyMapData, MoneyMapFile } from '../../src/model/types'

function extremeClient(): MoneyMapData {
  const data = structuredClone(SAMPLE_WHITFIELD)
  const long = 'W'.repeat(180)
  const multilingual = 'Zoë 李雷 Пример العائلة 👩🏽‍💼 é — '
  data.client.title = `${multilingual}${'Wide Family '.repeat(8)}`
  data.client.mastheadLabel = `${multilingual}${'MAP '.repeat(24)}`
  data.needTag = long
  data.incomeSources[0].label = `${multilingual}${long}`
  data.incomeSources[0].qualifier = `${multilingual}${long}`
  data.accounts[0].label = `${multilingual}${long}`
  data.accounts[0].caption = `${multilingual}${long}`
  data.accounts[0].valueTag = long
  data.accounts[0].positions = [{ label: `${multilingual}${long}`, value: Number.MAX_SAFE_INTEGER }]
  data.accounts[0].subAccounts = [{ label: `${multilingual}${long}`, caption: `${multilingual}${long}`, value: -9_999_999_999_999 }]
  data.footnotes = [{ id: 'extreme-footnote', label: `${multilingual}${long}`, gross: Number.MAX_SAFE_INTEGER, net: -9_999_999_999_999 }]
  data.notes = [{ id: 'extreme-note', text: `${multilingual}${long.repeat(3)}`, x: 1080, y: 850, w: 120, fs: 40, bg: true }]
  data.customArrows = [{ id: 'extreme-arrow', sourceId: 'income', targetId: 'need', style: 'dotted', label: `${multilingual}${long}` }]
  return data
}

async function loadClient(page: Page, client: MoneyMapData) {
  const book: MoneyMapFile = { fileType: 'money-map-book', version: 1, clients: [client] }
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: BOOK_KEY, value: book })
  await page.reload()
  await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible()
}

test.describe('adversarial remediation', () => {
  test.beforeEach(async ({ page }) => openApp(page))

  test('keeps extreme multilingual SVG glyphs inside the artboard', async ({ page }, testInfo) => {
    await loadClient(page, extremeClient())
    const outside = await page.locator('.map-page svg').evaluate((node) => {
      const root = node as SVGSVGElement
      const inverse = root.getScreenCTM()?.inverse()
      if (!inverse) throw new Error('Map SVG has no screen matrix')
      return [...root.querySelectorAll<SVGGraphicsElement>('text')].map((element) => {
        const relative = inverse.multiply(element.getScreenCTM()!)
        const box = element.getBBox()
        const points = [[box.x, box.y], [box.x + box.width, box.y], [box.x + box.width, box.y + box.height], [box.x, box.y + box.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(relative))
        return {
          text: element.textContent?.slice(0, 120),
          points,
        }
      }).filter(({ points }) => points.some(({ x, y }) => x < 0 || y < 0 || x > 1320 || y > 1020))
    })
    await page.locator('.map-page').screenshot({ path: testInfo.outputPath('extreme-map.png') })
    await testInfo.attach('outside-artboard-glyphs', { body: JSON.stringify(outside, null, 2), contentType: 'application/json' })
    expect(outside).toEqual([])
  })

  test('shows map attention without exposing implementation terms', async ({ page }) => {
    await loadClient(page, extremeClient())
    await expect(page.getByText('Map needs attention', { exact: true })).toBeVisible()
    await expect(page.locator('body')).not.toContainText(/VITE_DATA_MODE|writer|lease|clients array|accountLabel:[\w-]+/i)
  })

  test('keeps selected flow controls accessible and touch-sized', async ({ page }) => {
    const flow = page.getByRole('group', { name: 'Adjust income flow' })
    await flow.focus()
    const inspector = page.locator('.map-inspector')
    await expect(inspector).toBeVisible()
    const overlapsStatus = await page.evaluate(() => {
      const inspectorBox = document.querySelector('.map-inspector')?.getBoundingClientRect()
      const statusBox = document.querySelector('.app-status-banner')?.getBoundingClientRect()
      if (!inspectorBox || !statusBox) return false
      return inspectorBox.left < statusBox.right
        && inspectorBox.right > statusBox.left
        && inspectorBox.top < statusBox.bottom
        && inspectorBox.bottom > statusBox.top
    })
    expect(overlapsStatus).toBe(false)
    const controls = inspector.getByRole('button').or(inspector.getByRole('combobox'))
    await expect(controls.first()).toBeVisible()
    const sizes = await controls.evaluateAll((elements) => elements.map((element) => {
      const { width, height } = element.getBoundingClientRect()
      return { name: element.getAttribute('aria-label') ?? element.textContent, width, height }
    }))
    expect(sizes, JSON.stringify(sizes)).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Decrease curve' }),
      expect.objectContaining({ name: 'Increase curve' }),
    ]))
    expect(sizes.every(({ width, height }) => width >= 32 && height >= 32), JSON.stringify(sizes)).toBe(true)
    await inspector.getByRole('button', { name: 'Increase curve' }).click()
    await expect(inspector).toBeVisible()
  })

  test('prints only the map even while a toast is live', async ({ page }) => {
    await page.getByRole('button', { name: 'Export map' }).click()
    await page.getByRole('menuitem', { name: 'PNG image' }).click()
    await expect(page.locator('.toast')).toBeVisible()
    await page.emulateMedia({ media: 'print' })
    await expect.poll(() => page.locator('.app-shell').evaluate((shell) =>
      [...shell.children].every((child) => child.classList.contains('print-map')
        ? getComputedStyle(child).display === 'grid'
        : getComputedStyle(child).display === 'none'),
    )).toBe(true)
  })
})
