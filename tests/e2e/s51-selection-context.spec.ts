import { expect, test, type Locator, type Page } from '@playwright/test'
import { openApp } from './helpers'

const T = { timeout: 4000 } as const

const account = (page: Page, id: string) =>
  page.locator(`[data-account-id="${id}"][role="group"]`).first()

/** The editable chip; the print copy has neither class nor pointer handlers. */
const chip = (page: Page) =>
  page.locator('.map-draggable[data-map-target="asNeededChip"]').first()

/** Only the editable note is focusable, so tabindex disambiguates the print copy. */
const notes = (page: Page) => page.locator('[data-note-id][tabindex="0"]')

const selected = (page: Page) => page.locator("[data-map-selected='true']")

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

async function addNote(page: Page, text: string) {
  await page.getByRole('button', { name: 'Add', exact: true }).click(T)
  await page
    .getByRole('dialog', { name: 'Add' })
    .getByRole('button', { name: 'Add text note' })
    .click(T)
  const editor = page.getByRole('textbox', { name: 'Edit map note' })
  await editor.fill(text, T)
  await editor.press('Enter', T)
  await expect(editor).toHaveCount(0, T)
  await expect(notes(page)).toHaveCount(1, T)
}

test('shift-click extends an account selection', async ({ page }) => {
  await openApp(page)

  await clickAccountBody(account(page, 'cash-at-bank'))
  await expect(account(page, 'cash-at-bank')).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )

  await clickAccountBody(account(page, 'roth-ira-dana'), ['Shift'])
  await expect(selected(page)).toHaveCount(2, T)
  await expect(account(page, 'cash-at-bank')).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
})

test('Escape then shift-click starts a fresh single selection (INTENDED)', async ({
  page,
}) => {
  await openApp(page)

  await clickAccountBody(account(page, 'cash-at-bank'))
  await expect(selected(page)).toHaveCount(1, T)

  await page.keyboard.press('Escape')
  await expect(selected(page)).toHaveCount(0, T)

  await clickAccountBody(account(page, 'roth-ira-dana'), ['Shift'])
  // INTENDED BEHAVIOUR, NOT A BUG: Escape really did deselect, so there is
  // nothing left to extend and the shift-click starts a new single selection.
  // The inspector closing and reopening makes this look like "shift-click is
  // broken" to a user; it is not.
  await expect(selected(page)).toHaveCount(1, T)
  await expect(account(page, 'roth-ira-dana')).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
  await expect(account(page, 'cash-at-bank')).not.toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
})

test('shift-click on the as-needed chip preserves the account selection', async ({
  page,
}) => {
  await openApp(page)

  await clickAccountBody(account(page, 'cash-at-bank'))
  await clickAccountBody(account(page, 'roth-ira-dana'), ['Shift'])
  await expect(selected(page)).toHaveCount(2, T)

  await chip(page).click({ modifiers: ['Shift'], timeout: 4000 })
  // The chip cannot join a MapItemKey multi-selection, so the accounts must
  // survive untouched rather than being silently dropped for the chip.
  await expect(selected(page)).toHaveCount(2, T)
  await expect(account(page, 'cash-at-bank')).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
})

test('shift-click on a note extends into a mixed selection', async ({ page }) => {
  await openApp(page)
  await addNote(page, 'Review beneficiary update')

  await clickAccountBody(account(page, 'cash-at-bank'))
  await expect(selected(page)).toHaveCount(1, T)

  await notes(page).first().click({ modifiers: ['Shift'], timeout: 4000 })
  await expect(selected(page)).toHaveCount(2, T)
  await expect(account(page, 'cash-at-bank')).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
  await expect(notes(page).first()).toHaveAttribute(
    'data-map-selected',
    'true',
    T,
  )
})

test('keyboard focus still reaches and selects a note', async ({ page }) => {
  await openApp(page)
  await addNote(page, 'Keyboard reachable note')
  await clickAccountBody(account(page, 'cash-at-bank'))

  const note = notes(page).first()
  let reached = false
  for (let step = 0; step < 90 && !reached; step += 1) {
    await page.keyboard.press('Tab')
    reached = await note.evaluate((el) => el === document.activeElement)
  }
  expect(reached, 'Tab never reached the map note').toBe(true)

  await expect(note).toBeFocused(T)
  await expect(note).toHaveAttribute('data-map-selected', 'true', T)
  expect(await note.evaluate((el) => el.matches(':focus-visible'))).toBe(true)
})
