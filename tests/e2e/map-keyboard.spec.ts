import { expect, test, type Locator } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'

async function clickBlankAccountBody(
  account: Locator,
  modifiers: ('Shift' | 'Control' | 'Meta')[] = [],
) {
  const bodyHit = account.locator('.map-account-body-hit:not(ellipse)')
  const box = await bodyHit.boundingBox()
  if (!box) throw new Error('Account body hit has no measurable bounds')
  await bodyHit.click({
    modifiers,
    position: {
      x: Math.min(32, box.width / 4),
      y: Math.max(16, box.height - 24),
    },
  })
}

test('keyboard arrangement persists move, resize, rotate, text offset, and connector reconnection', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  await account.focus()
  await expect(account).toBeFocused()
  await expect(account).toHaveAttribute('aria-keyshortcuts', /ArrowRight/)
  await expect(account).not.toHaveClass(/highlight/)
  for (const key of ['Enter', 'Space']) {
    await account.focus()
    await page.keyboard.press(key)
    await expect(account).toBeFocused()
    await expect(account).not.toHaveClass(/highlight/)
  }
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Alt+ArrowRight')
  await page.keyboard.press(']')

  const incomeHeader = page.locator('[data-map-edit-key="incomeHeader"]').first()
  await incomeHeader.focus()
  await expect(incomeHeader).toBeFocused()
  await expect(incomeHeader).toHaveAttribute('aria-keyshortcuts', /Shift\+ArrowDown/)
  await page.keyboard.press('Shift+ArrowDown')

  const customArrow = page.getByRole('group', { name: /^Adjust flow from / }).first()
  await customArrow.focus()
  await expect(customArrow).toBeFocused()
  await expect(customArrow).toHaveAttribute('aria-keyshortcuts', /Control\+ArrowRight/)
  await page.keyboard.press('Control+ArrowRight')

  await expect.poll(() => page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const persisted = JSON.parse(raw)
    const client = persisted.clients.find(
      (item: { id: string }) => item.id === 'sample-whitfield',
    )
    if (!client) return null
    const accountOverride = client.layoutOverrides?.['cash-at-bank']
    const textOverride = client.layoutOverrides?.['text:income:header']
    return {
      moved: (accountOverride?.dx ?? 0) > 0,
      resized: (accountOverride?.w ?? 0) > 0,
      rotation: accountOverride?.rot,
      textOffset: textOverride?.dy,
      reconnected:
        client.customArrows?.[0]?.targetId !== 'managed-after-tax-trust',
    }
  }, BOOK_KEY)).toEqual({
    moved: true,
    resized: true,
    rotation: 5,
    textOffset: 10,
    reconnected: true,
  })
})

test('Shift and the platform selection modifier toggle compatible account and note selection', async ({ page }) => {
  await openApp(page)

  await page.getByRole('button', { name: 'Add text note' }).press('Enter')
  const noteEditor = page.getByRole('textbox', { name: 'Edit map note' })
  await noteEditor.fill('Selection note')
  await noteEditor.press('Enter')
  await expect(page.locator('[data-note-id=note-1]')).toHaveCount(0)
  const note = page.locator('svg.map-interactive .map-note[data-note-id]').last()
  await expect(note).toHaveCount(1)
  const noteHit = note.locator('rect').first()
  await expect(noteHit).toBeVisible()

  const first = page.locator('[data-account-id=cash-at-bank][role=group]')
  const second = page.locator('[data-account-id=short-term-funds][role=group]')
  await clickBlankAccountBody(first)
  await expect(page.locator('[data-map-selected=true]')).toHaveCount(1)

  const isMac = await page.evaluate(() => navigator.platform.startsWith('Mac'))
  const modifiers: ('Shift' | 'Control' | 'Meta')[] =
    isMac ? ['Shift', 'Meta'] : ['Shift', 'Control']
  for (const modifier of modifiers) {
    await clickBlankAccountBody(second, [modifier])
    const selectedAfterAdd = page.locator('[data-map-selected=true]')
    await expect(selectedAfterAdd).toHaveCount(2)
    await noteHit.click({ modifiers: [modifier] })
    await expect(page.locator('[data-map-selected=true]')).toHaveCount(3)
    await noteHit.click({ modifiers: [modifier] })
    await expect(page.locator('[data-map-selected=true]')).toHaveCount(2)
    await clickBlankAccountBody(second, [modifier])
    await expect(page.locator('[data-map-selected=true]')).toHaveCount(1)
  }
})

test('a multi-item alignment command is one undo step', async ({ page }) => {
  await openApp(page)

  const first = page.locator('[data-account-id=cash-at-bank][role=group]')
  const second = page.locator('[data-account-id=managed-after-tax-trust][role=group]')
  await first.focus()
  await page.keyboard.press('Enter')
  await second.focus()
  await page.keyboard.press('Shift+Enter')
  const inspector = page.getByRole('region', { name: /2 map items selected/ })
  await expect(inspector).toBeVisible()

  const readSelectedGeometry = () => page.locator('[data-account-id][data-map-selected=true]').evaluateAll((nodes) =>
    Object.fromEntries(nodes.map((node) => {
      const box = (node as SVGGraphicsElement).getBBox()
      return [node.getAttribute('data-account-id'), { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) }]
    }))
  )
  const before = await readSelectedGeometry()
  await inspector.getByRole('button', { name: 'Align left' }).click()
  await expect.poll(readSelectedGeometry).not.toEqual(before)
  await page.keyboard.press('Control+Z')
  await expect.poll(readSelectedGeometry).toEqual(before)
})
