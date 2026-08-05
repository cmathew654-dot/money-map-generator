import { chromium } from '@playwright/test'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.setDefaultTimeout(4000)
await page.goto('http://127.0.0.1:4281/')
await page.getByText('Money Map', { exact: true }).first().waitFor()
await page.waitForTimeout(800)
const gotIt = page.getByRole('button', { name: 'Got it' })
if (await gotIt.count()) await gotIt.click()

// A: what does the +Add rail contain?
await page.getByRole('button', { name: '+ Add', exact: false }).first().click().catch(() => page.locator('button:has-text("Add")').first().click())
await page.waitForTimeout(400)
console.log('panel buttons:', JSON.stringify(await page.evaluate(() =>
  [...document.querySelectorAll('.editor-panel button, [class*="panel"] button')].map((b) => b.textContent.trim()).filter(Boolean).slice(0, 25))))
await page.keyboard.press('Escape')

// B: dblclick account body — dump state after
await page.keyboard.press('Escape')
const acct = page.locator('g[aria-label="Accounts"] > g').first()
await acct.dblclick()
await page.waitForTimeout(600)
console.log('after dblclick:', JSON.stringify(await page.evaluate(() => ({
  clientForm: Boolean(document.querySelector('.client-form')),
  inspector: Boolean(document.querySelector('.map-inspector')),
  selected: document.querySelector('svg[data-selected-target]')?.getAttribute('data-selected-target'),
  editor: Boolean(document.querySelector('.map-text-editor')),
  panels: [...document.querySelectorAll('[class*="editor-panel"], aside')].map((el) => el.className).slice(0, 5),
}))))
await browser.close()
