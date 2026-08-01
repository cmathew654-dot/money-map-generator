import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, type TestInfo } from '@playwright/test'

export const BOOK_KEY = 'money-map-generator:book'
export const LEGACY_BOOK_KEY = 'money-map-book:v1'

export async function openApp(page: Page) {
  await page.goto('/')
  await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
}
export async function evidence(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`${name}.png`), fullPage: true })
}
export async function fullForm(page: Page) {
  await page.getByRole('button', { name: 'Full form' }).click()
  await expect(page.locator('.client-form')).toBeVisible()
}
export async function focusPage(page: Page) {
  await page.bringToFront()
  await expect.poll(() => page.evaluate(() => ({
    focused: document.hasFocus(),
    visibility: document.visibilityState,
  }))).toEqual({ focused: true, visibility: 'visible' })

  const pages = page.context().pages().filter((candidate) => !candidate.isClosed())
  for (const other of pages) {
    if (other !== page) await other.evaluate(() => window.dispatchEvent(new FocusEvent('blur')))
  }
  await page.evaluate(() => window.dispatchEvent(new FocusEvent('focus')))
  await expect.poll(async () => {
    const enabled = await Promise.all(pages.map(async (candidate) => {
      const title = candidate.getByLabel('Title')
      return await title.count() > 0 && await title.isEnabled()
    }))
    return {
      active: await page.getByLabel('Title').isEnabled(),
      writers: enabled.filter(Boolean).length,
    }
  }).toEqual({ active: true, writers: 1 })
}
export async function assertWcag22AA(page: Page, info: TestInfo, state: string) {
  // No axe rules are disabled. Any future exclusion requires a reproduced engine/axe false positive.
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  const evidence = result.violations.flatMap((violation) => violation.nodes.map((node) => ({ state, rule: violation.id, impact: violation.impact, target: node.target, html: node.html })))
  await info.attach(`axe-${state}-violations`, { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' })
  expect(result.violations, result.violations.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([])
}
