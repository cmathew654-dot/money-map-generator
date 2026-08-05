// repro #1 — dblclick plain account number at several zooms, verify editor visible + typing lands
import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.setDefaultTimeout(4000)
await page.goto('http://127.0.0.1:4280/')
await page.getByText('Money Map', { exact: true }).first().waitFor()
await page.waitForTimeout(800)
const gotIt = page.getByRole('button', { name: 'Got it' })
if (await gotIt.count()) await gotIt.click()

async function tryEdit(label) {
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  const run = page.locator('[data-map-edit-key^="accountValue:"]').first()
  const box = await run.boundingBox()
  if (!box || box.y < 0 || box.y > 900 || box.x < 0 || box.x > 1440) {
    console.log(`${label}: value run off-screen ${JSON.stringify(box)}`); return
  }
  await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(300)
  const ed = page.locator('.map-text-editor input, .map-text-editor textarea').first()
  const open = await ed.count()
  if (!open) { console.log(`${label}: EDITOR DID NOT OPEN`); return }
  const vis = await ed.isVisible()
  const focused = await ed.evaluate((el) => document.activeElement === el)
  const eb = await page.locator('.map-text-editor').first().boundingBox()
  const onScreen = eb && eb.y >= 0 && eb.y < 900 && eb.x >= 0 && eb.x < 1440
  await page.keyboard.type('777')
  const val = await ed.inputValue()
  console.log(`${label}: visible=${vis} focused=${focused} onScreen=${onScreen} typed777->"${val}"`)
  await page.keyboard.press('Escape')
}

await tryEdit('fit-default')
await page.getByRole('button', { name: 'Zoom in' }).click()
await page.getByRole('button', { name: 'Zoom in' }).click()
await tryEdit('zoomed-in-x2')
await page.getByRole('button', { name: 'Fit' }).click()
for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Zoom out' }).click()
await tryEdit('zoomed-out-x4')
await browser.close()
