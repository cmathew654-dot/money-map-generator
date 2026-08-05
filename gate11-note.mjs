import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.setDefaultTimeout(4000)
await page.goto('http://127.0.0.1:4281/')
await page.getByText('Money Map', { exact: true }).first().waitFor()
await page.waitForTimeout(800)
const gotIt = page.getByRole('button', { name: 'Got it' })
if (await gotIt.count()) await gotIt.click()
const dump = () => page.evaluate(() => ({
  notes: document.querySelectorAll('g.map-note').length,
  anyNote: [...document.querySelectorAll('g')].filter((g) => (g.getAttribute('class') || '').includes('note')).map((g) => g.getAttribute('class')).slice(0, 4),
  editor: Boolean(document.querySelector('.map-text-editor')),
}))
await page.getByRole('button', { name: '+ Add', exact: false }).first().click().catch(() => page.locator('button:has-text("Add")').first().click())
await page.waitForTimeout(300)
await page.locator('aside, .editor-rail').getByRole('button', { name: 'Add text note' }).first().click()
await page.waitForTimeout(500)
console.log('after spawn:', JSON.stringify(await dump()))
await page.keyboard.type('Gate note')
await page.keyboard.press('Enter')
await page.waitForTimeout(400)
const after = await dump()
const box = await page.locator('g.map-note').last().boundingBox().catch(() => null)
console.log('after commit:', JSON.stringify(after), 'box:', JSON.stringify(box))
await browser.close()
