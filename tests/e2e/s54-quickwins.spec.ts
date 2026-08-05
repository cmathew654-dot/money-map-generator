import { expect, test, type Locator, type Page } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'
import { SAMPLE_WHITFIELD } from '../../src/model/samples'
import type { MoneyMapFile } from '../../src/model/types'

const T = { timeout: 4000 } as const

test.beforeEach(async ({ page: _page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-1280x720',
    'Selection/clipboard behavior is project-independent; the canvas-interaction geometry runs once in the default Chromium project.',
  )
})

const account = (page: Page, id: string) =>
  page.locator(`[data-account-id="${id}"][role="group"]`).first()

const accounts = (page: Page) =>
  page.locator('svg.map-interactive [data-account-id][role="group"]')

const selected = (page: Page) => page.locator("[data-map-selected='true']")

/** The need card's coverage note — a calculated text, not a map item. */
const coverageNote = (page: Page) =>
  page
    .locator('svg.map-interactive [data-map-target="text:need:supporting"]')
    .first()

async function clickAccountBody(
  target: Locator,
  modifiers: ('Shift' | 'Control' | 'Meta')[] = [],
) {
  const hit = target.locator('.map-account-body-hit:not(ellipse)')
  const box = await hit.boundingBox({ timeout: 4000 })
  if (!box) throw new Error('Account body hit has no measurable bounds')
  await hit.click({
    modifiers,
    position: {
      x: Math.min(32, box.width / 4),
      y: Math.max(16, box.height - 24),
    },
    timeout: 4000,
  })
}

/** A point inside the canvas that resolves to no map target at all. */
async function blankSpot(page: Page) {
  const spot = await page
    .locator('svg.map-interactive')
    .evaluate((svg) => {
      const box = svg.getBoundingClientRect()
      const owned =
        '[data-map-target],[data-account-id],[data-note-id],[data-connect-id],[data-layout-key]'
      for (let fy = 0.04; fy < 0.99; fy += 0.04) {
        for (let fx = 0.04; fx < 0.99; fx += 0.04) {
          const hit = document.elementFromPoint(
            box.left + box.width * fx,
            box.top + box.height * fy,
          )
          if (!hit || !svg.contains(hit) || hit.closest(owned)) continue
          return { x: box.width * fx, y: box.height * fy }
        }
      }
      return null
    }, undefined, { timeout: 4000 })
  if (!spot) throw new Error('No blank canvas point found')
  return spot
}

test('Ctrl+C with nothing selected keeps the earlier map clipboard', async ({
  page,
}) => {
  await openApp(page)
  const before = await accounts(page).count()

  await clickAccountBody(account(page, 'cash-at-bank'))
  await expect(selected(page)).toHaveCount(1, T)
  await page.keyboard.press('Control+c')

  await page.keyboard.press('Escape')
  await expect(selected(page)).toHaveCount(0, T)

  // A copy that has nothing to copy must leave the clipboard alone.
  await page.keyboard.press('Control+c')
  await page.keyboard.press('Control+v')

  await expect(accounts(page)).toHaveCount(before + 1, T)
})

/**
 * The coverage note needs all three gap-line inputs *and* a need card wide
 * enough to fit the sentence at the 9px floor — the shipped 257px card never
 * shows it, so the amounts here are sized to widen the card past ~323px.
 */
async function openAppWithCoverageNote(page: Page) {
  const client = structuredClone(SAMPLE_WHITFIELD)
  client.monthlyNeed = 99_999_999_999
  client.asNeededAmount = 99_999_999_999
  client.layoutOverrides = {
    ...client.layoutOverrides,
    'text:need:value': { fs: 40 },
  }
  const book: MoneyMapFile = {
    fileType: 'money-map-book',
    version: 1,
    clients: [client],
  }
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: BOOK_KEY, value: book },
  )
  await openApp(page)
}

test('shift-click on the coverage note preserves the account selection', async ({
  page,
}) => {
  await openAppWithCoverageNote(page)
  await expect(coverageNote(page)).toHaveCount(1, T)

  await clickAccountBody(account(page, 'cash-at-bank'))
  await expect(selected(page)).toHaveCount(1, T)

  await coverageNote(page).click({ modifiers: ['Shift'], timeout: 4000 })
  // Pointer focus must not select ahead of the click: the calculated text
  // cannot join a map-item selection, so the account survives untouched.
  await expect(account(page, 'cash-at-bank')).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
  await expect(selected(page)).toHaveCount(1, T)
})

test('shift-click on blank canvas keeps the multi-selection', async ({
  page,
}) => {
  await openApp(page)

  await clickAccountBody(account(page, 'cash-at-bank'))
  await clickAccountBody(account(page, 'roth-ira-dana'), ['Shift'])
  await expect(selected(page)).toHaveCount(2, T)

  await page
    .locator('svg.map-interactive')
    .click({ modifiers: ['Shift'], position: await blankSpot(page), timeout: 4000 })

  // A modifier-click that lands on nothing is a miss, not a "clear".
  await expect(selected(page)).toHaveCount(2, T)
})
