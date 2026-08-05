import { expect, test, type Locator, type Page } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'

const ACCOUNT_ID = 'cash-at-bank'
const TEXT_KEY = `text:${ACCOUNT_ID}:label`

/**
 * s52 click-again: the first plain click on account text selects the ACCOUNT.
 * Text selection is reached by selecting the account (its body hit, so the two
 * clicks are never read as a dblclick) and then clicking the text.
 */
async function selectAccountText(page: Page, label: Locator) {
  const hit = page
    .locator(`[data-account-id="${ACCOUNT_ID}"] .map-account-body-hit:not(ellipse)`)
    .first()
  const box = await hit.boundingBox()
  if (!box) throw new Error(`Account ${ACCOUNT_ID} has no measurable body hit`)
  await hit.click({
    position: { x: Math.min(32, box.width / 4), y: Math.max(16, box.height - 24) },
    timeout: 5_000,
  })
  await label.click({ timeout: 5_000 })
}

async function storedRotation(page: Page): Promise<number | null> {
  return page.evaluate(
    ([key, textKey]) => {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const persisted = JSON.parse(raw)
      const client = persisted.clients?.find(
        (item: { id: string }) => item.id === 'sample-whitfield',
      )
      return client?.layoutOverrides?.[textKey]?.rot ?? null
    },
    [BOOK_KEY, TEXT_KEY] as const,
  )
}

/** Rotation transforms land on inner elements, so scan every [transform] node. */
async function renderedTransforms(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('[transform]')).map(
      (node) => node.getAttribute('transform') ?? '',
    ),
  )
}

test.describe('s51: account text rotates like a note', () => {
  test('Details buttons and bracket keys rotate account title text by 5 degrees', async ({
    page,
  }) => {
    await openApp(page)

    const label = page
      .locator(`[data-map-edit-key="accountLabel:${ACCOUNT_ID}"]`)
      .first()
    await expect(label).toBeVisible({ timeout: 5_000 })

    // The first plain click on the label selects the ACCOUNT, not its text.
    await label.click({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: /^Rotate text: / })).toHaveCount(0, {
      timeout: 5_000,
    })

    await selectAccountText(page, label)

    const inspector = page.locator('.map-inspector')
    await expect(inspector).toBeVisible({ timeout: 5_000 })
    const clockwise = inspector.getByRole('button', {
      name: 'Rotate clockwise',
    })
    await expect(clockwise).toBeVisible({ timeout: 5_000 })

    await clockwise.click({ timeout: 5_000 })
    await expect.poll(() => storedRotation(page), { timeout: 5_000 }).toBe(5)
    await expect
      .poll(() => renderedTransforms(page), { timeout: 5_000 })
      .toEqual(expect.arrayContaining([expect.stringContaining('rotate(5 ')]))

    await label.focus()
    await page.keyboard.press(']')
    await expect.poll(() => storedRotation(page), { timeout: 5_000 }).toBe(10)
    await expect
      .poll(() => renderedTransforms(page), { timeout: 5_000 })
      .toEqual(expect.arrayContaining([expect.stringContaining('rotate(10 ')]))

    await page.keyboard.press('[')
    await expect.poll(() => storedRotation(page), { timeout: 5_000 }).toBe(5)

    // The account itself must not have been rotated by the text gesture.
    const accounts = page.locator('g[aria-label="Accounts"]').first()
    await expect(
      accounts.locator(`[data-account-id="${ACCOUNT_ID}"]`).first(),
    ).not.toHaveAttribute('transform', /rotate/)
  })

  test('an on-canvas rotate handle is offered for account text', async ({
    page,
  }) => {
    await openApp(page)
    const label = page
      .locator(`[data-map-edit-key="accountLabel:${ACCOUNT_ID}"]`)
      .first()
    await selectAccountText(page, label)
    await expect(
      page.getByRole('button', { name: /^Rotate text: / }),
    ).toBeVisible({ timeout: 5_000 })
  })
})
