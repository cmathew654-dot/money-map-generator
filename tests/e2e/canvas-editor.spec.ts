import { expect, test } from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'
import { SAMPLE_WHITFIELD } from '../../src/model/samples'

test('existing clients open on the canvas and Data restores rail focus when it closes', async ({ page }) => {
  await openApp(page)

  const rail = page.getByRole('complementary', { name: 'Editor tools' })
  await expect(rail).toBeVisible()
  for (const name of ['Add', 'Data', 'Contents', 'Help']) {
    await expect(rail.getByRole('button', { name })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  }
  await expect(
    page.getByRole('complementary', { name: 'Client editor' }),
  ).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Guide me' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Full form' })).toHaveCount(0)

  const data = rail.getByRole('button', { name: 'Data' })
  await data.click()
  const panel = page.getByRole('dialog', { name: 'Data' })
  await expect(panel).toBeVisible()
  await expect(data).toHaveAttribute('aria-expanded', 'true')
  await expect(panel.getByRole('heading', { name: 'Data' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(data).toBeFocused()
})

test('each editor rail button pairs its accessible text label with a visible decorative icon', async ({ page }) => {
  await openApp(page)

  const rail = page.getByRole('complementary', { name: 'Editor tools' })
  for (const name of ['Add', 'Data', 'Contents', 'Help']) {
    const button = rail.getByRole('button', { name, exact: true })
    await expect(button).toContainText(name)
    await expect(button.locator('[aria-hidden=true]')).toBeVisible()
  }
})

test('Data overlays the canvas below the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1179, height: 720 })
  await openApp(page)
  await page.getByRole('button', { name: 'Data' }).click()

  const geometry = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>('.editor-panel')!
    const preview = document.querySelector<HTMLElement>('.preview-pane')!
    return {
      panel: panel.getBoundingClientRect().toJSON(),
      preview: preview.getBoundingClientRect().toJSON(),
    }
  })
  expect(Math.round(geometry.panel.width)).toBe(380)
  expect(Math.round(geometry.panel.x)).toBe(Math.round(geometry.preview.x))
})

test('New still opens the guided setup', async ({ page }) => {
  await openApp(page)
  await expect(
    page.getByRole('complementary', { name: 'Editor tools' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'More actions' }).click()
  await page.getByRole('menuitem', { name: 'New client' }).click()

  await expect(
    page.getByRole('heading', { name: 'Who is this map for?' }),
  ).toBeVisible()
})

test('Data filters records and Details focuses the selected account', async ({ page }) => {
  await openApp(page)

  const dataButton = page.getByRole('button', { name: 'Data', exact: true })
  await dataButton.click()
  const panel = page.getByRole('dialog', { name: 'Data' })
  const filter = panel.getByLabel('Filter data')
  await filter.fill('Managed IRA')
  await expect(panel.locator('[data-form-section="accounts"]')).toBeVisible()
  await expect(panel.locator('[data-form-section="client"]')).toHaveCount(0)
  await expect(panel.getByText('Managed IRA', { exact: true })).toBeVisible()

  await filter.fill('')
  await dataButton.click()
  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  await account.locator('.map-account-body-hit:not(ellipse)').click()
  await expect(account).toHaveAttribute('data-map-selected', 'true')
  const inspector = page.getByRole('region', { name: /Adjust Cash at Bank/ })
  await expect(inspector.getByRole('button', { name: 'Details' })).toBeVisible()
  await inspector.getByRole('button', { name: 'Details' }).click()
  await expect(panel).toBeVisible()
  await expect(panel.locator('[data-form-section="accounts"]')).toHaveClass(/is-active/)
  await expect(panel.locator('[data-account-id="cash-at-bank"] input').first()).toBeFocused()
})

test('Data heading regains focus after a Details request becomes stale', async ({ page }) => {
  await openApp(page)

  const dataButton = page.getByRole('button', { name: 'Data', exact: true })
  const panel = page.getByRole('dialog', { name: 'Data' })
  await dataButton.click()
  await expect(panel).toBeVisible()
  await dataButton.click()

  const cashAtBank = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  await cashAtBank.locator('.map-account-body-hit:not(ellipse)').click()
  await page.getByRole('region', { name: /Adjust Cash at Bank/ }).getByRole('button', { name: 'Details' }).click()
  await expect(panel.locator('[data-account-id="cash-at-bank"] input').first()).toBeFocused()

  await dataButton.click()
  const managedIra = page.locator('[data-account-id="managed-ira-jordan"][role="group"]')
  await managedIra.focus()
  await managedIra.press('Enter')
  await expect(managedIra).toHaveAttribute('data-map-selected', 'true')

  await dataButton.click()
  await expect(panel.getByRole('heading', { name: 'Data' })).toBeFocused()
})

test('Add exposes map actions and selects new records', async ({ page }) => {
  await openApp(page)

  const rail = page.getByRole('complementary', { name: 'Editor tools' })
  const addButton = rail.getByRole('button', { name: 'Add', exact: true })
  const dataButton = rail.getByRole('button', { name: 'Data', exact: true })
  await addButton.click()
  const panel = page.getByRole('dialog', { name: 'Add' })
  await expect(panel.getByRole('heading', { name: 'Add' })).toBeFocused()
  for (const name of [
    'Add income source',
    'Add account',
    'Set monthly need',
    'Add flow',
    'Add text note',
    'Add fine print',
  ]) {
    await expect(panel.getByRole('button', { name })).toBeVisible()
  }

  await panel.getByRole('button', { name: 'Add account' }).click()
  const dataPanel = page.getByRole('dialog', { name: 'Data' })
  await expect(dataPanel.locator('[data-form-section="accounts"]')).toHaveClass(/is-active/)
  await expect(page.locator('[data-map-target^="account:"][data-map-selected="true"]')).toHaveCount(1)
  await expect(page.getByRole('region', { name: /Adjust/ })).toBeVisible()

  await dataButton.click()
  await addButton.click()
  await panel.getByRole('button', { name: 'Add income source' }).click()
  await expect(dataPanel.locator('[data-form-section="income"]')).toHaveClass(/is-active/)
  await expect(page.locator('[data-map-target="income"][data-map-selected="true"]')).toHaveCount(1)

  await dataButton.click()
  await addButton.click()
  await panel.getByRole('button', { name: 'Set monthly need' }).click()
  await expect(dataPanel.locator('[data-form-section="need"]')).toHaveClass(/is-active/)
  await dataButton.click()
  await addButton.click()
  await panel.getByRole('button', { name: 'Add flow' }).click()
  await expect(page.locator('[data-map-target^="arrow:custom:"][data-map-selected="true"]')).toHaveCount(1)

  await panel.getByRole('button', { name: 'Add fine print' }).click()
  await expect(dataPanel.locator('[data-form-section="need"]')).toHaveClass(/is-active/)
  await dataButton.click()
  await addButton.click()
  await panel.getByRole('button', { name: 'Add text note' }).click()
  await expect(page.getByRole('textbox', { name: 'Edit map note' })).toBeFocused()

  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await expect(addButton).toBeFocused()
})

test('+ Account quick-add focuses and routes into the new account', async ({ page }) => {
  await openApp(page)

  const accounts = page.locator('svg.map-interactive [data-account-id][role="group"]')
  const before = await accounts.count()
  const beforeIds = await accounts.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('data-account-id')),
  )
  await page.getByRole('button', { name: '+ Account', exact: true }).click()

  const popover = page.locator('.shape-popover')
  await expect(popover).toBeVisible()
  await expect.poll(() => page.evaluate(() => Boolean(
    document.activeElement?.closest('.shape-popover'),
  ))).toBe(true)

  await popover.getByRole('button', { name: 'Cash', exact: true }).click()
  await expect(accounts).toHaveCount(before + 1)
  const afterIds = await accounts.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('data-account-id')),
  )
  const newIds = afterIds.filter(
    (id): id is string => id !== null && !beforeIds.includes(id),
  )
  expect(newIds).toHaveLength(1)
  await expect(
    page.locator(`svg.map-interactive [data-account-id="${newIds[0]}"][role="group"]`),
  ).toHaveAttribute('data-map-selected', 'true')
  await expect(page.getByRole('textbox', { name: 'Edit account name' })).toBeFocused()
})

test('empty Add panel opens the matching Data section without coercing blanks', async ({ page }) => {
  await openApp(page)

  await page.getByRole('button', { name: 'More actions' }).click()
  await page.getByRole('menuitem', { name: /Clear map/ }).click()
  await page.getByRole('button', { name: 'Clear map', exact: true }).click()

  const addButton = page.getByRole('button', { name: 'Add', exact: true })
  await addButton.click()
  const add = page.getByRole('dialog', { name: 'Add' })
  await expect(add.getByRole('button', { name: 'Add income' })).toBeVisible()
  await expect(add.getByRole('button', { name: 'Add account' })).toBeVisible()
  await expect(add.getByRole('button', { name: 'Set monthly need' })).toBeVisible()
  await expect(add.getByRole('button', { name: 'Open all data fields' })).toBeVisible()
  await expect(add.getByRole('button', { name: 'Add flow' })).toHaveCount(0)
  await expect(add.getByRole('button', { name: 'Add text note' })).toHaveCount(0)
  await expect(add.getByRole('button', { name: 'Add fine print' })).toHaveCount(0)

  const dataButton = page.getByRole('button', { name: 'Data', exact: true })
  await add.getByRole('button', { name: 'Add income' }).click()
  await expect(page.getByRole('dialog', { name: 'Data' }).locator('[data-form-section="income"]')).toHaveClass(/is-active/)
  await dataButton.click()
  await addButton.click()
  await add.getByRole('button', { name: 'Add account' }).click()
  await expect(page.getByRole('dialog', { name: 'Data' }).locator('[data-form-section="accounts"]')).toHaveClass(/is-active/)
  await dataButton.click()
  await addButton.click()
  await add.getByRole('button', { name: 'Set monthly need' }).click()
  await expect(page.getByRole('dialog', { name: 'Data' }).locator('[data-form-section="need"]')).toHaveClass(/is-active/)
  await expect(page.getByRole('dialog', { name: 'Data' }).getByRole('textbox', { name: 'Monthly amount needed' })).toHaveValue('')
})

test('Contents lists semantic map targets and restores hidden generated flows', async ({ page }) => {
  const seededBook = {
    fileType: 'money-map-book',
    version: 1,
    clients: [{
      id: 'task-4-contents',
      client: { title: 'Task 4 contents', year: '2026', variant: 'annual' },
      incomeSources: [{ id: 'task-4-income', label: 'Pension', amount: 1900, period: 'mo' }],
      afterTaxIncome: 1900,
      monthlyNeed: 4000,
      asNeededAmount: null,
      accounts: [
        { id: 'task-4-short-term', bucket: 'shortTerm', label: 'Short-Term Funds', value: 100000 },
        { id: 'cash-at-bank', bucket: 'cash', label: 'Cash at Bank', value: 25000 },
        { id: 'managed-ira-jordan', bucket: 'taxDeferred', label: 'Managed IRA — Jordan', value: 250000 },
        { id: 'managed-after-tax-trust', bucket: 'afterTax', label: 'Managed After-Tax Trust', value: 250000 },
      ],
      customArrows: [{ id: 'task-4-arrow', sourceId: 'managed-ira-jordan', targetId: 'managed-after-tax-trust', style: 'dotted' }],
      footnotes: [{ id: 'task-4-footnote', label: 'Jordan 2026 RMD', gross: 10000, net: 8000 }],
      hiddenArrows: ['income'],
    }],
  }
  await page.addInitScript(({ key, book }) => {
    localStorage.setItem(key, JSON.stringify(book))
  }, { key: BOOK_KEY, book: seededBook })
  await openApp(page)
  await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible()

  await page.getByRole('button', { name: 'Add', exact: true }).click()
  const addPanel = page.getByRole('dialog', { name: 'Add' })
  await addPanel.getByRole('button', { name: 'Add text note' }).click()
  const noteEditor = page.getByRole('textbox', { name: 'Edit map note' })
  await noteEditor.fill('Review beneficiary update')
  await noteEditor.press('Enter')
  await expect(noteEditor).toHaveCount(0)

  await page.getByRole('button', { name: 'Contents', exact: true }).click()
  const panel = page.getByRole('dialog', { name: 'Contents' })
  const hiddenGenerated = panel.getByRole('button', {
    name: 'Flow from Income sources to Monthly need',
    exact: true,
  })
  await expect(hiddenGenerated).toBeDisabled()
  for (const name of [
    'Income sources',
    'Monthly income need',
    'Short-Term Funds',
    'Cash at Bank',
    /^Managed IRA.*Jordan$/,
    'Managed After-Tax Trust',
    'Flow from Income sources to Monthly need',
    'Flow from Managed IRA — Jordan to Managed After-Tax Trust',
    'Review beneficiary update',
    'Jordan 2026 RMD',
  ]) {
    await expect(panel.getByRole('button', { name, exact: true })).toBeVisible()
  }
  await expect(panel.getByRole('button', { name: 'Restore automatic flows', exact: true })).toBeVisible()

  for (const name of [
    'Income sources',
    'Monthly income need',
    'Short-Term Funds',
    'Cash at Bank',
    /^Managed IRA.*Jordan$/,
    'Managed After-Tax Trust',
    /^Flow from Managed IRA.*Managed After-Tax Trust$/,
    'Review beneficiary update',
    'Jordan 2026 RMD',
  ]) {
    const item = panel.getByRole('button', { name, exact: true })
    await item.click()
    await expect(item).toHaveAttribute('aria-pressed', 'true')
  }

  await panel.getByRole('button', { name: 'Restore automatic flows', exact: true }).click()
  await expect(page.getByText('Automatic flows restored', { exact: true })).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Restore automatic flows', exact: true })).toHaveCount(0)
  await expect(hiddenGenerated).toBeEnabled()
  await hiddenGenerated.click()
  await expect(hiddenGenerated).toHaveAttribute('aria-pressed', 'true')
})

test('Help lists the editor keyboard shortcuts', async ({ page }) => {
  await openApp(page)
  await page.getByRole('button', { name: 'Help', exact: true }).click()
  const panel = page.getByRole('dialog', { name: 'Help' })
  await expect(panel.getByRole('heading', { name: 'Help' })).toBeFocused()
  for (const text of ['Enter', 'Escape', 'Arrow keys', 'Duplicate', 'Delete', 'Copy / paste', 'Undo / redo', '?']) {
    await expect(panel.getByText(text, { exact: true }).first()).toBeVisible()
  }
})

test('copy, paste, delete, and alignment shortcuts do nothing inside controls and text overlays', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id=cash-at-bank][role=group]')
  const bodyHit = account.locator('.map-account-body-hit:not(ellipse)')
  const bodyBox = await bodyHit.boundingBox()
  if (!bodyBox) throw new Error('Account body hit has no measurable bounds')
  await bodyHit.click({ position: { x: Math.min(18, bodyBox.width / 4), y: 18 } })
  const inspector = page.getByRole('region', { name: /Adjust Cash at Bank/ })
  const shape = inspector.getByLabel('Shape')
  await shape.focus()
  await page.keyboard.press('Delete')
  await page.keyboard.press('Control+C')
  await page.keyboard.press('Control+V')
  await expect(page.locator('svg.map-interactive [data-account-id=cash-at-bank]')).toHaveCount(1)

  const label = account.getByRole('button', { name: 'Edit account name' })
  await label.dblclick()
  const editor = page.getByRole('textbox', { name: 'Edit account name' })
  await expect(editor).toBeFocused()
  await page.keyboard.press('Control+C')
  await page.keyboard.press('Control+V')
  await page.keyboard.press('Delete')
  await editor.press('Escape')
  await expect(page.locator('svg.map-interactive [data-account-id=cash-at-bank]')).toHaveCount(1)
})

test('client search matches title or year across a large book and restores focus after Escape', async ({ page }) => {
  const clients = Array.from({ length: 120 }, (_, index) => ({
    id: `task-6-client-${index}`,
    client: {
      title: `Household ${index}`,
      year: String(2020 + index),
      variant: 'annual' as const,
    },
    incomeSources: [],
    afterTaxIncome: null,
    monthlyNeed: null,
    asNeededAmount: null,
    accounts: [],
    footnotes: [],
  }))
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value))
  }, {
    key: BOOK_KEY,
    value: { fileType: 'money-map-book', version: 1, clients },
  })
  await openApp(page)

  const combo = page.getByRole('combobox', { name: 'Active client' })
  await combo.fill('  HOUSEHOLD 119 ')
  await expect(page.getByRole('listbox')).toBeVisible()
  await expect(page.getByRole('option')).toHaveCount(1)
  await combo.press('ArrowDown')
  await expect(combo).toHaveAttribute('aria-activedescendant', /.+/)
  await combo.press('Enter')
  await expect(combo).toHaveValue('Household 119')
  await expect(combo).toBeFocused()

  await combo.fill('2039')
  await expect(page.getByRole('option', { name: /Household 19/ })).toBeVisible()
  await combo.press('Escape')
  await expect(page.getByRole('listbox')).toHaveCount(0)
  await expect(combo).toHaveValue('Household 119')
  await expect(combo).toBeFocused()
})

test('map layout diagnostics never surface as advisor-facing warnings', async ({ page }) => {
  const overflowingAccountId = SAMPLE_WHITFIELD.accounts[0].id
  const overflowingBook = {
    fileType: 'money-map-book',
    version: 1,
    clients: [
      {
        ...structuredClone(SAMPLE_WHITFIELD),
        // Same fixture the mapedit unit test proves yields an untargeted warning.
        layoutOverrides: {
          ...SAMPLE_WHITFIELD.layoutOverrides,
          [overflowingAccountId]: { h: 900 },
        },
      },
    ],
  }
  await page.addInitScript(({ key, book }) => {
    localStorage.setItem(key, JSON.stringify(book))
  }, { key: BOOK_KEY, book: overflowingBook })
  await openApp(page)

  // Proves the seeded book loaded, so the absence assertions are not vacuous.
  await expect(
    page.locator(`[data-account-id="${overflowingAccountId}"][role="group"]`),
  ).toBeVisible()
  await expect(page.getByText('Map needs attention')).toHaveCount(0)
  await expect(page.locator('[aria-label="Map warnings"]')).toHaveCount(0)

  await page.getByRole('button', { name: 'Contents', exact: true }).click()
  const contents = page.getByRole('dialog', { name: 'Contents' })
  await expect(contents).toBeVisible()
  await expect(contents.getByText('Map needs attention')).toHaveCount(0)
  await expect(contents.locator('[aria-label="Map warnings"]')).toHaveCount(0)
})

test('the inspector stays visible while an inline title editor is open', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  await account.locator('.map-account-body-hit:not(ellipse)').click()
  const inspector = page.locator('.map-inspector')
  await expect(inspector).toBeVisible()

  await account
    .locator('[data-map-edit-key="accountLabel:cash-at-bank"]')
    .first()
    .dblclick()
  const editor = page.locator('.map-text-editor-input')
  await expect(editor).toBeVisible()
  await expect(inspector).toBeVisible()

  await editor.fill('Renamed while inspecting')
  await expect(inspector).toBeVisible()
  await editor.press('Escape')
  await expect(editor).toHaveCount(0)
  await expect(inspector).toBeVisible()
})

test('an armed text note lands over an account without disturbing it', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  const body = account.locator('.map-account-body-hit:not(ellipse)')
  const position = () =>
    body.evaluate((element) => {
      const box = (element as SVGGraphicsElement).getBBox()
      return { x: Math.round(box.x), y: Math.round(box.y) }
    })
  const before = await position()

  await page.getByRole('button', { name: 'Add text note', exact: true }).click()
  const box = await body.boundingBox()
  if (!box) throw new Error('Account body has no measurable bounds')
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)

  const editor = page.locator('.map-text-editor-input')
  await expect(editor).toBeVisible()
  await editor.fill('Inside account note')
  await editor.press('Enter')
  await expect(editor).toHaveCount(0)

  await expect(page.locator('svg.map-interactive')).toHaveAttribute(
    'data-selected-target',
    /^note:/,
  )
  await expect(page.locator('.map-inspector')).toContainText(
    'Inside account note',
  )
  expect(await position()).toEqual(before)
  await expect(account).not.toHaveAttribute('data-map-selected', 'true')
})

test('only a selected account exposes a resize handle, and dragging it resizes the account', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  const body = account.locator('.map-account-body-hit:not(ellipse)')
  const size = () =>
    body.evaluate((element) => {
      const box = (element as SVGGraphicsElement).getBBox()
      return { h: Math.round(box.height), w: Math.round(box.width) }
    })

  await expect(page.locator('.map-resize-handle')).toHaveCount(0)
  await body.click()
  await expect(account).toHaveAttribute('data-map-selected', 'true')

  const handle = page.locator('.map-resize-handle')
  await expect(handle).toHaveCount(1)

  const before = await size()
  const handleBox = await handle.boundingBox()
  if (!handleBox) throw new Error('Resize handle geometry is not measurable')
  const grip = {
    x: handleBox.x + handleBox.width / 2,
    y: handleBox.y + handleBox.height / 2,
  }
  await page.mouse.move(grip.x, grip.y)
  await page.mouse.down()
  await page.mouse.move(grip.x + 60, grip.y + 44, { steps: 6 })
  await page.mouse.up()

  await expect
    .poll(async () => {
      const now = await size()
      return { taller: now.h > before.h, wider: now.w > before.w }
    })
    .toEqual({ taller: true, wider: true })
})

test('selected Income, Need, or account exposes one direct connector handle and a valid drop selects the new flow', async ({ page }) => {
  await openApp(page)

  const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
  await account.locator('.map-account-body-hit:not(ellipse)').click()
  const handle = page.locator('.map-connector-handle')
  await expect(handle).toHaveCount(1)
  await expect(handle).toHaveAttribute('tabindex', '-1')
  await expect(handle).toHaveAttribute('data-connector-source', 'cash-at-bank')

  const destination = page.locator('[data-connect-id="need"][role="group"]')
  const handleBox = await handle.boundingBox()
  const destinationBox = await destination.boundingBox()
  if (!handleBox || !destinationBox) throw new Error('Connector geometry is not measurable')
  const handlePoint = {
    x: handleBox.x + handleBox.width / 2,
    y: handleBox.y + handleBox.height / 2,
  }
  const destinationPoint = {
    x: destinationBox.x + destinationBox.width / 2,
    y: destinationBox.y + destinationBox.height / 2,
  }
  await page.mouse.move(handlePoint.x, handlePoint.y)
  await page.mouse.down()
  await page.mouse.move(destinationPoint.x, destinationPoint.y, { steps: 5 })
  await expect(destination).toHaveAttribute('data-connector-highlight', 'true')
  await page.mouse.up()
  await expect(page.locator('[data-map-target^="arrow:custom:"][data-map-selected="true"]')).toHaveCount(1)

  await page.getByRole('button', { name: 'Undo' }).click()
  await account.locator('.map-account-body-hit:not(ellipse)').click()
  const refreshedHandle = page.locator('.map-connector-handle')
  const refreshedBox = await refreshedHandle.boundingBox()
  const background = page.locator('[data-map-background="true"]').first()
  const backgroundBox = await background.boundingBox()
  if (!refreshedBox || !backgroundBox) throw new Error('Connector cancellation geometry is not measurable')
  await page.mouse.move(refreshedBox.x + refreshedBox.width / 2, refreshedBox.y + refreshedBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(backgroundBox.x + 28, backgroundBox.y + 28, { steps: 5 })
  await page.mouse.up()
  await expect(page.locator('[data-map-target^="arrow:custom:"][data-map-selected="true"]')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled()

  await page.mouse.move(refreshedBox.x + refreshedBox.width / 2, refreshedBox.y + refreshedBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(destinationPoint.x, destinationPoint.y, { steps: 5 })
  await expect(destination).toHaveAttribute('data-connector-highlight', 'true')
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-connector-preview="true"]')).toHaveCount(0)
  await page.mouse.up()
  await expect(page.locator('[data-map-target^="arrow:custom:"][data-map-selected="true"]')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled()
})
