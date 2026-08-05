import {
  expect,
  test,
  type Locator,
  type Page,
} from '@playwright/test'
import { BOOK_KEY, openApp } from './helpers'

const CLIENT_ID = 'sample-whitfield'
const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 },
  { width: 1920, height: 1080 },
] as const
const SHAPE_PRESETS = [
  { button: 'Short-Term', bucket: 'shortTerm', shape: 'drum' },
  { button: 'Trust', bucket: 'afterTax', shape: 'drum' },
  { button: 'IRA', bucket: 'taxDeferred', shape: 'drum' },
  { button: 'Roth', bucket: 'taxPreferred', shape: 'drum' },
  { button: 'Cash', bucket: 'cash', shape: 'drum' },
  { button: 'Charitable', bucket: 'charitable', shape: 'drum' },
  { button: 'Note', bucket: 'note', shape: 'card' },
] as const

type StoredAccount = {
  bucket: string
  id: string
  label: string
  shape?: string
}

type StoredClient = {
  accounts: StoredAccount[]
  afterTaxIncome?: number | null
  asNeededAmount?: number | null
  customArrows?: Array<{
    id: string
    sourceId: string
    targetId: string
  }>
  footnotes?: Array<{ gross: number | null; label: string; net: number | null }>
  id: string
  incomeSources?: Array<{
    amount: number | null
    id: string
    label: string
    period: string
  }>
  layoutOverrides?: Record<
    string,
    { dx?: number; dy?: number; fs?: number }
  >
  monthlyNeed?: number | null
  notes?: Array<{ text: string }>
}

async function storedClient(page: Page): Promise<StoredClient | null> {
  return page.evaluate(
    ({ clientId, key }) => {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const book = JSON.parse(raw) as { clients?: StoredClient[] }
      return book.clients?.find((client) => client.id === clientId) ?? null
    },
    { clientId: CLIENT_ID, key: BOOK_KEY },
  )
}

async function currentClient(page: Page): Promise<StoredClient> {
  const client = await storedClient(page)
  if (!client) throw new Error('Active client was not persisted')
  return client
}

function financialContent(client: StoredClient) {
  return {
    accounts: client.accounts,
    afterTaxIncome: client.afterTaxIncome ?? null,
    asNeededAmount: client.asNeededAmount ?? null,
    footnotes: client.footnotes ?? [],
    incomeSources: client.incomeSources ?? [],
    monthlyNeed: client.monthlyNeed ?? null,
    notes: client.notes ?? [],
  }
}

async function svgPosition(locator: Locator) {
  return locator.evaluate((element) => {
    const bounds = (element as SVGGraphicsElement).getBBox()
    return { x: Math.round(bounds.x), y: Math.round(bounds.y) }
  })
}

async function spawnPreset(
  page: Page,
  button: string,
  bucket: string,
  label: string,
) {
  const beforeIds = new Set(
    (await currentClient(page)).accounts.map((account) => account.id),
  )
  await page.getByRole('button', { name: '+ Account', exact: true }).click()
  await page
    .getByLabel('Add account')
    .getByRole('button', { name: button, exact: true })
    .click()

  const editor = page.locator('.map-text-editor-input')
  await expect(editor).toBeVisible()
  await editor.fill(label)
  await editor.press('Enter')
  await expect(editor).toHaveCount(0)

  let accountId = ''
  await expect
    .poll(async () => {
      const client = await currentClient(page)
      const added = client.accounts.filter(
        (account) => !beforeIds.has(account.id),
      )
      accountId = added.length === 1 ? added[0].id : ''
      return added.length === 1
        ? { bucket: added[0].bucket, label: added[0].label }
        : null
    })
    .toEqual({ bucket, label })
  if (!accountId) throw new Error(`No account spawned from ${button}`)
  return accountId
}

async function pointerDrag(
  page: Page,
  locator: Locator,
  delta: { x: number; y: number },
  startRatio = { x: 0.5, y: 0.5 },
) {
  const box = await locator.boundingBox()
  if (!box) throw new Error('Pointer target has no measurable bounds')
  const start = {
    x: box.x + box.width * startRatio.x,
    y: box.y + box.height * startRatio.y,
  }
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x + delta.x, start.y + delta.y, {
    steps: 8,
  })
  await page.mouse.up()
}

async function clickBlankAccountBody(account: Locator) {
  const bodyHit = account.locator(
    '.map-account-body-hit:not(ellipse)',
  )
  const box = await bodyHit.boundingBox()
  if (!box) throw new Error('Account body hit has no measurable bounds')
  await bodyHit.click({
    position: {
      x: Math.min(32, box.width / 4),
      y: Math.max(16, box.height - 24),
    },
  })
}

test('foreign writer lease still hands editing to the focused tab', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium-1280x720',
    'The lease handoff regression runs once in Chromium.',
  )
  await page.addInitScript(() => {
    localStorage.setItem(
      'money-map-generator:writer',
      JSON.stringify({ tabId: 'stale-tab', updatedAt: Date.now() }),
    )
  })
  await openApp(page)
  await expect
    .poll(() => page.evaluate(() => {
      const raw = localStorage.getItem('money-map-generator:writer')
      return raw ? JSON.parse(raw).tabId : null
    }))
    .not.toBe('stale-tab')
  await expect
    .poll(() => page.locator('.map-page svg').getAttribute('class'))
    .toBe('map-interactive')
  const label = page.locator(
    '[data-map-edit-visual="accountLabel:short-term-funds"]',
  )
  const account = page.locator(
    '[data-account-id="short-term-funds"][role="group"]',
  )
  const before = await account.boundingBox()
  const target = await label.boundingBox()
  if (!before || !target) throw new Error('Short-Term Funds target is not measurable')
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    target.x + target.width / 2 + 80,
    target.y + target.height / 2 + 40,
    { steps: 6 },
  )
  await page.mouse.up()
  await expect
    .poll(async () => (await account.boundingBox())?.x ?? before.x)
    .toBeGreaterThan(before.x + 20)
  await expect
    .poll(() => page.evaluate(() => window.getSelection()?.toString() ?? ''))
    .toBe('')
})

test.describe('approved desktop interaction regression', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const crossBrowserStateTest =
      testInfo.title.includes('Tidy map is one undoable action') ||
      testInfo.title.includes(
        'drag preview yields to reset, clear, Salary edits, and reload',
      )
    test.skip(
      testInfo.project.name !== 'chromium-1280x720' &&
        !(crossBrowserStateTest && testInfo.project.name === 'webkit-1280x720'),
      'Combined interaction regression runs once in Chromium; the state regression also runs in WebKit.',
    )
    await openApp(page)
    await expect.poll(() => storedClient(page)).not.toBeNull()
  })

  test('single click selects an income panel without opening text edit', async ({
    page,
  }) => {
    const incomeHit = page.locator(
      '[data-map-target="income"] [data-map-edit-hit^="incomeAmount"]',
    ).first()
    await incomeHit.click()
    await expect(
      page.getByRole('region', { name: 'Adjust Income sources' }),
    ).toBeVisible()
    await expect(page.locator('textarea')).toHaveCount(0)
  })

  test('double click opens the income text editor', async ({ page }) => {
    const incomeHit = page.locator(
      '[data-map-target="income"] [data-map-edit-hit^="incomeAmount"]',
    ).first()
    await incomeHit.dblclick()
    await expect(page.locator('.map-text-editor-input')).toBeVisible()
  })

  test('dragging the as-needed chip writes a layout override', async ({ page }) => {
    const chip = page.locator('[data-as-needed-chip="true"]').first()
    const before = await chip.boundingBox()
    if (!before) throw new Error('As-needed chip has no measurable bounds')
    await pointerDrag(page, chip, { x: 72, y: 36 })
    await expect
      .poll(async () => {
        const override = (await currentClient(page)).layoutOverrides?.asNeededChip
        return Math.abs(override?.dx ?? 0) + Math.abs(override?.dy ?? 0)
      })
      .toBeGreaterThan(0)
    await expect.poll(() => chip.boundingBox()).not.toEqual(before)
  })

  test('clicking the as-needed amount opens its editor', async ({ page }) => {
    const amount = page.locator('[data-as-needed-chip="true"] [data-map-edit-hit="asNeededAmount"]').first()
    await amount.dblclick()
    await expect(page.locator('.map-text-editor-input')).toBeVisible()
  })

  test('dragging an income text run suppresses native selection and preserves editor selection', async ({
    page,
  }) => {
    const incomeCard = page.locator('[data-map-target="income"]')
    const incomeHit = incomeCard.locator('[data-map-edit-hit^="incomeAmount"]').first()
    const incomeBody = incomeCard.locator('rect').first()
    const before = await svgPosition(incomeBody)
    const box = await incomeHit.boundingBox()
    if (!box) throw new Error('Income text hit has no measurable bounds')
    const start = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    }

    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x + 100, start.y, { steps: 8 })
    await page.mouse.up()

    expect(await page.evaluate(() => window.getSelection()?.toString() ?? '')).toBe('')
    await expect.poll(() => svgPosition(incomeBody)).not.toEqual(before)

    await incomeHit.dblclick()
    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible()
    await editor.press('Control+A')
    expect(
      await editor.evaluate((element) => {
        const textarea = element as HTMLTextAreaElement
        return textarea.value.length > 0 && textarea.selectionStart !== textarea.selectionEnd
      }),
    ).toBe(true)
  })

  test('selection leaves map objects in place', async ({ page }) => {
    const account = page.locator(
      '[data-account-id="cash-at-bank"][role="group"]',
    )
    const before = await account.boundingBox()
    if (!before) throw new Error('Account has no measurable bounds')
    await account.locator('.map-account-body-hit:not(ellipse)').click()
    await expect(account).toHaveAttribute('data-map-selected', 'true')
    const after = await account.boundingBox()
    if (!after) throw new Error('Selected account has no measurable bounds')
    expect(Math.abs(after.x - before.x)).toBeLessThan(2)
    expect(Math.abs(after.y - before.y)).toBeLessThan(2)
  })
  test('undo discards an open map text draft', async ({ page }) => {
    const account = page.locator(
      '[data-account-id="cash-at-bank"][role="group"]',
    )
    await page.getByRole('button', { name: 'Add text note', exact: true }).click()
    await expect(page.locator('.text-placement-hint')).toBeVisible()
    await page.locator('.map-page svg > [data-map-background="true"]').first().click({ force: true })
    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible()
    await editor.fill('ORIGINAL NOTE')
    await editor.press('Enter')
    await expect(editor).toHaveCount(0)
    const noteText = page.locator('[data-map-edit-hit^="noteText:"]').first()
    await expect(noteText).toBeVisible()

    const bodyHit = account.locator('.map-account-body-hit:not(ellipse)')
    await pointerDrag(page, bodyHit, { x: 38, y: 20 }, { x: 0.16, y: 0.84 })
    await expect
      .poll(async () => {
        const override = (await currentClient(page)).layoutOverrides?.[
          'cash-at-bank'
        ]
        return Math.abs(override?.dx ?? 0) + Math.abs(override?.dy ?? 0)
      })
      .toBeGreaterThan(0)

    await noteText.dblclick()
    await expect(editor).toBeVisible()
    await editor.fill('STALE DRAFT')
    await page.keyboard.press('Control+Z')
    await expect(editor).toHaveCount(0)
    await expect
      .poll(async () => (await currentClient(page)).layoutOverrides?.['cash-at-bank'])
      .toBeUndefined()
    await expect
      .poll(async () =>
        (await currentClient(page)).notes?.some((note) => note.text === 'ORIGINAL NOTE') ?? false,
      )
      .toBe(true)
    await expect(page.locator('svg').getByText('STALE DRAFT')).toHaveCount(0)
  })

  test('spawn, selection, shape, text, font, and drag gestures stay independent', async ({
    page,
  }) => {
    test.slow()
    const spawned: Array<{ id: string; label: string }> = []
    for (const preset of SHAPE_PRESETS) {
      const label = `Spawned ${preset.button}`
      const id = await spawnPreset(
        page,
        preset.button,
        preset.bucket,
        label,
      )
      spawned.push({ id, label })
      await expect(
        page.locator(`[data-account-id="${id}"][role="group"]`),
      ).toHaveAttribute('data-account-shape', preset.shape)
    }

    const subject = spawned[0]
    const account = page.locator(
      `[data-account-id="${subject.id}"][role="group"]`,
    )
    await clickBlankAccountBody(account)
    await expect(account).toHaveAttribute('data-map-selected', 'true')

    const accountControls = page.getByRole('region', {
      name: `Adjust ${subject.label}`,
    })
    await expect(accountControls).toBeVisible()
    for (const option of [
      { label: 'Card', shape: 'card' },
      { label: 'Cylinder', shape: 'drum' },
      { label: 'Bucket', shape: 'rect' },
      { label: 'Pill', shape: 'pill' },
    ] as const) {
      await accountControls.getByLabel('Shape').selectOption(option.shape)
      await expect(account).toHaveAttribute(
        'data-account-shape',
        option.shape,
      )
    }

    const labelTarget = account
      .locator(`[data-map-edit-key="accountLabel:${subject.id}"]`)
      .first()
    const renderedLabel = account.locator(
      `[data-map-edit-visual="accountLabel:${subject.id}"]`,
    )
    const initialFontSize = await renderedLabel.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    )
    const expectedFontSize = initialFontSize + 1

    await labelTarget.dblclick()
    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible()
    await editor.fill('Edited Short-Term Shape')
    await page
      .locator('.map-text-size-controls')
      .getByRole('button', { name: 'Increase font size', exact: true })
      .click()
    await page
      .getByRole('button', { name: 'Close text editor', exact: true })
      .click()
    await expect(editor).toHaveCount(0)
    await expect
      .poll(() =>
        renderedLabel.evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        ),
      )
      .toBe(expectedFontSize)

    await labelTarget.dblclick()
    await expect(editor).toBeVisible()
    await editor.press('Escape')
    await expect(editor).toHaveCount(0)
    await expect
      .poll(async () => {
        const client = await currentClient(page)
        const stored = client.accounts.find(
          (candidate) => candidate.id === subject.id,
        )
        return {
          fontSize:
            client.layoutOverrides?.[`text:${subject.id}:label`]?.fs ?? 0,
          label: stored?.label,
          renderedFontSize: await renderedLabel.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).fontSize),
          ),
        }
      })
      .toEqual({
        fontSize: expectedFontSize,
        label: 'Edited Short-Term Shape',
        renderedFontSize: expectedFontSize,
      })

    await pointerDrag(
      page,
      account.locator('.map-account-body-hit:not(ellipse)'),
      { x: 38, y: 20 },
      { x: 0.16, y: 0.84 },
    )
    await expect
      .poll(async () => {
        const override = (await currentClient(page)).layoutOverrides?.[
          subject.id
        ]
        return Math.abs(override?.dx ?? 0) + Math.abs(override?.dy ?? 0)
      })
      .toBeGreaterThan(0)
    const afterBodyDrag = (await currentClient(page)).layoutOverrides?.[
      subject.id
    ]

    const beforeTextDrag = (await currentClient(page)).layoutOverrides?.[
      `text:${subject.id}:label`
    ]
    const beforeTextDragPosition = await svgPosition(
      account.locator('.map-account-body-hit:not(ellipse)'),
    )
    await pointerDrag(page, labelTarget, { x: 34, y: 22 })
    await expect
      .poll(async () =>
        (await currentClient(page)).layoutOverrides?.[
          `text:${subject.id}:label`
        ],
      )
      .toEqual(beforeTextDrag)

    await expect
      .poll(async () => {
        const now = await svgPosition(
          account.locator('.map-account-body-hit:not(ellipse)'),
        )
        return {
          movedRight: now.x > beforeTextDragPosition.x,
          movedDown: now.y > beforeTextDragPosition.y,
        }
      })
      .toEqual({ movedRight: true, movedDown: true })
    await expect
      .poll(async () =>
        (await currentClient(page)).layoutOverrides?.[subject.id],
      )
      .not.toEqual(afterBodyDrag)

    await labelTarget.dblclick()
    await expect(editor).toBeVisible()
    await editor.press('Escape')
    await expect(editor).toHaveCount(0)
  })

  test('editor close paths and connector cancellation preserve intent', async ({
    page,
  }) => {
    const sourceId = await spawnPreset(
      page,
      'Short-Term',
      'shortTerm',
      'Connector Source',
    )
    const targetId = await spawnPreset(
      page,
      'Trust',
      'afterTax',
      'Connector Target',
    )
    const sourceLabel = page
      .locator(
        `[data-account-id="${sourceId}"] [data-map-edit-key="accountLabel:${sourceId}"]`,
      )
      .first()

    await sourceLabel.dblclick()
    const editor = page.locator('.map-text-editor-input')
    await editor.fill('Cancelled Source Rename')
    await editor.press('Escape')
    await expect(editor).toHaveCount(0)
    expect(
      (await currentClient(page)).accounts.find(
        (account) => account.id === sourceId,
      )?.label,
    ).toBe('Connector Source')

    await sourceLabel.dblclick()
    await editor.fill('Blurred Source Rename')
    await page.getByRole('button', { name: '+ Account', exact: true }).click()
    await page.keyboard.press('Escape')
    await expect
      .poll(async () =>
        (await currentClient(page)).accounts.find(
          (account) => account.id === sourceId,
        )?.label,
      )
      .toBe('Blurred Source Rename')

    const notesBefore =
      (await currentClient(page)).notes?.map((note) => note.text) ?? []
    await page.getByRole('button', { name: 'Add text note', exact: true }).click()
    await expect(page.locator('.text-placement-hint')).toBeVisible()
    await page.locator('.map-page svg > [data-map-background="true"]').first().click()
    await expect(editor).toBeVisible()
    await editor.fill('Escape cancels a new note')
    await editor.press('Escape')
    await expect(editor).toHaveCount(0)
    await expect
      .poll(async () =>
        (await currentClient(page)).notes?.map((note) => note.text) ?? [],
      )
      .toEqual(notesBefore)

    const source = page.locator(
      `[data-account-id="${sourceId}"][role="group"]`,
    )
    await clickBlankAccountBody(source)
    const sourceControls = page.getByRole('region', {
      name: 'Adjust Blurred Source Rename',
    })
    await expect(sourceControls).toBeVisible()
    const arrowsBefore =
      (await currentClient(page)).customArrows?.length ?? 0
    await page.keyboard.press('Escape')
    await expect(sourceControls).toHaveCount(0)
    await expect
      .poll(
        async () =>
          (await currentClient(page)).customArrows?.length ?? 0,
      )
      .toBe(arrowsBefore)

    await clickBlankAccountBody(source)
    await expect(sourceControls).toBeVisible()
    await sourceControls.getByLabel('Add flow to').selectOption(targetId)
    await expect
      .poll(async () => {
        const arrows = (await currentClient(page)).customArrows ?? []
        return arrows.some(
          (arrow) =>
            arrow.sourceId === sourceId && arrow.targetId === targetId,
        )
      })
      .toBe(true)

    const incomeFlow = page.getByRole('group', { name: 'Adjust income flow' })
    await incomeFlow.focus()
    const flowInspector = page.locator('.map-inspector')
    await flowInspector.getByRole('button', { name: 'Hide flow' }).click()
    await expect(flowInspector).toHaveCount(0)
    await expect(incomeFlow).toHaveCount(0)
  })

  test('text-note placement cancels cleanly and pointer activation toggles the armed state', async ({
    page,
  }) => {
    const addTextNote = page.getByRole('button', {
      name: 'Add text note',
      exact: true,
    })
    const notesBefore = (await currentClient(page)).notes ?? []

    await addTextNote.click()
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('.text-placement-hint')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.text-placement-hint')).toHaveCount(0)
    await expect(page.locator('.map-text-editor-input')).toHaveCount(0)
    expect((await currentClient(page)).notes ?? []).toEqual(notesBefore)

    await addTextNote.click()
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'true')
    await addTextNote.click()
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('.text-placement-hint')).toHaveCount(0)
    await expect(page.locator('.map-text-editor-input')).toHaveCount(0)
    expect((await currentClient(page)).notes ?? []).toEqual(notesBefore)
  })

  test('keyboard activation opens a text-note editor at the visible map center', async ({
    page,
  }) => {
    const addTextNote = page.getByRole('button', {
      name: 'Add text note',
      exact: true,
    })
    await addTextNote.focus()
    await page.keyboard.press('Enter')

    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible()
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'false')
    const [editorBox, mapBox, viewportBox] = await Promise.all([
      editor.boundingBox(),
      page.locator('.map-page:visible svg.map-interactive').boundingBox(),
      page.locator('.map-scroller').boundingBox(),
    ])
    if (!editorBox || !mapBox || !viewportBox) {
      throw new Error('Editor, map, or viewport has no measurable bounds')
    }
    const expectedCenter = {
      x:
        (Math.max(mapBox.x, viewportBox.x) +
          Math.min(mapBox.x + mapBox.width, viewportBox.x + viewportBox.width)) /
        2,
      y:
        (Math.max(mapBox.y, viewportBox.y) +
          Math.min(mapBox.y + mapBox.height, viewportBox.y + viewportBox.height)) /
        2,
    }
    expect(editorBox.x + editorBox.width / 2).toBeCloseTo(expectedCenter.x, 0)
    expect(editorBox.y + editorBox.height / 2).toBeCloseTo(expectedCenter.y, 0)
  })

  test('panning while text placement is armed suppresses only the drag click', async ({
    page,
  }) => {
    const addTextNote = page.getByRole('button', {
      name: 'Add text note',
      exact: true,
    })
    await addTextNote.click()
    await page.getByRole('button', { name: 'Zoom in' }).click()

    const pan = await page.locator('.map-scroller').evaluate((element) => {
      const bounds = element.getBoundingClientRect()
      for (let y = Math.ceil(bounds.top) + 48; y < bounds.bottom - 48; y += 8) {
        for (let x = Math.ceil(bounds.left) + 48; x < bounds.right - 48; x += 8) {
          if (document.elementFromPoint(x, y)?.closest('[data-map-background]')) {
            return {
              end: { x: x - 40, y: y - 40 },
              start: { x, y },
            }
          }
        }
      }
      throw new Error('No visible map background point found')
    })
    await page.mouse.move(pan.start.x, pan.start.y)
    await page.mouse.down()
    await page.mouse.move(pan.end.x, pan.end.y, { steps: 4 })
    await page.mouse.up()

    await expect(page.locator('.map-text-editor-input')).toHaveCount(0)
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'true')
    const nextBackgroundPoint = await page
      .locator('.map-scroller')
      .evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        for (let y = Math.ceil(bounds.top) + 48; y < bounds.bottom - 48; y += 8) {
          for (let x = Math.ceil(bounds.left) + 48; x < bounds.right - 48; x += 8) {
            if (document.elementFromPoint(x, y)?.closest('[data-map-background]')) {
              return { x, y }
            }
          }
        }
        throw new Error('No visible map background point found after panning')
      })
    await page.mouse.move(nextBackgroundPoint.x, nextBackgroundPoint.y)
    await page.mouse.down()
    await page.mouse.move(
      nextBackgroundPoint.x + 2,
      nextBackgroundPoint.y + 1,
    )
    await page.mouse.up()
    await expect(page.locator('.map-text-editor-input')).toBeVisible()
    await expect(addTextNote).toHaveAttribute('aria-pressed', 'false')
  })

  test('text and card bodies expose different hover affordances', async ({ page }) => {
    const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
    const label = account.locator('[data-map-edit-key="accountLabel:cash-at-bank"]').first()
    const body = account.locator('.map-account-body-hit:not(ellipse)')
    await label.hover()
    await expect.poll(() => account.evaluate((node) => getComputedStyle(node).filter)).toBe('none')
    await body.hover()
    await expect.poll(() => account.evaluate((node) => getComputedStyle(node).filter)).not.toBe('none')
  })

  test('Reset offers recovery for accidental text positions', async ({ page }) => {
    const account = page.locator('[data-account-id="cash-at-bank"][role="group"]')
    await account.focus()
    await page.keyboard.press('ArrowRight')
    const label = account.locator('[data-map-edit-key="accountLabel:cash-at-bank"]').first()
    await label.dblclick()
    await page
      .locator('.map-text-size-controls')
      .getByRole('button', { name: 'Increase font size' })
      .click()
    await page.getByRole('button', { name: 'Close text editor' }).click()
    await label.focus()
    await page.keyboard.press('Shift+ArrowRight')
    await expect
      .poll(async () => {
        const overrides = (await currentClient(page)).layoutOverrides
        return Boolean(
          overrides?.['cash-at-bank']?.dx &&
          overrides?.['text:cash-at-bank:label']?.dx &&
          overrides?.['text:cash-at-bank:label']?.fs,
        )
      })
      .toBe(true)
    const before = (await currentClient(page)).layoutOverrides!
    await page.getByRole('button', { name: 'More actions' }).click()
    await page.getByRole('menuitem', { name: /Reset all text positions/ }).click()
    await page
      .getByRole('dialog', { name: 'Reset all text positions?' })
      .getByRole('button', { name: 'Reset text positions' })
      .click()
    await expect
      .poll(async () => {
        const overrides = (await currentClient(page)).layoutOverrides
        return {
          account: overrides?.['cash-at-bank'],
          text: overrides?.['text:cash-at-bank:label'],
        }
      })
      .toEqual({
        account: before['cash-at-bank'],
        text: { fs: before['text:cash-at-bank:label'].fs },
      })
    await expect(page.getByText('Text positions reset')).toBeVisible()
    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await expect
      .poll(async () =>
        (await currentClient(page)).layoutOverrides?.['text:cash-at-bank:label'],
      )
      .toEqual(before['text:cash-at-bank:label'])
  })

  test('Tidy map is one undoable action after a manual move', async ({ page }) => {
    const accountId = 'cash-at-bank'
    const account = page.locator(
      `[data-account-id=${accountId}][role=group]`,
    )
    const bodyHit = account.locator('.map-account-body-hit:not(ellipse)')
    const generatedPosition = await svgPosition(bodyHit)
    await pointerDrag(page, bodyHit, { x: 38, y: 20 }, { x: 0.16, y: 0.84 })
    await expect
      .poll(
        async () => {
          const override = (await currentClient(page)).layoutOverrides?.[
            accountId
          ]
          return Math.abs(override?.dx ?? 0) + Math.abs(override?.dy ?? 0)
        },
      )
      .toBeGreaterThan(0)
    const movedPosition = await svgPosition(bodyHit)
    expect(movedPosition).not.toEqual(generatedPosition)

    const movedOverride = (await currentClient(page)).layoutOverrides?.[
      accountId
    ]

    await page.getByRole('button', { name: 'Tidy map', exact: true }).click()
    await expect(
      page.locator('.toast').filter({ hasText: 'Map aligned to grid.' }),
    ).toBeVisible()
    const tidiedPosition = await svgPosition(bodyHit)
    // Snapping to the nearest 12 units can never move an anchor more than 6.
    expect(Math.abs(tidiedPosition.x - movedPosition.x)).toBeLessThanOrEqual(6)
    expect(Math.abs(tidiedPosition.y - movedPosition.y)).toBeLessThanOrEqual(6)
    expect(tidiedPosition).not.toEqual(generatedPosition)
    expect(
      (await currentClient(page)).layoutOverrides?.[accountId]?.dx,
    ).toBeDefined()

    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await expect
      .poll(
        async () =>
          (await currentClient(page)).layoutOverrides?.[accountId],
      )
      .toEqual(movedOverride)
    await expect
      .poll(
        async () => {
          const override = (await currentClient(page)).layoutOverrides?.[
            accountId
          ]
          return Math.abs(override?.dx ?? 0) + Math.abs(override?.dy ?? 0)
        },
      )
      .toBeGreaterThan(0)
    await expect.poll(() => svgPosition(bodyHit)).toEqual(movedPosition)
  })

  test('drag preview yields to reset, clear, Salary edits, and reload', async ({
    page,
  }) => {
    test.slow()
    const incomeCard = page.locator('[data-map-target=income]')
    const incomeBody = incomeCard.locator('rect').first()
    const generatedPosition = await svgPosition(incomeBody)
    const originalContent = financialContent(await currentClient(page))

    await pointerDrag(page, incomeCard, { x: 24, y: 16 }, { x: 0.92, y: 0.92 })
    await expect
      .poll(async () => financialContent(await currentClient(page)))
      .toEqual(originalContent)
    expect(await svgPosition(incomeBody)).not.toEqual(generatedPosition)

    await page.getByRole('button', { name: 'More actions' }).click()
    await page.getByRole('menuitem', { name: 'Reset arrangement' }).click()
    await page
      .getByRole('dialog', { name: 'Reset arrangement' })
      .getByRole('button', { name: 'Reset', exact: true })
      .click()
    await expect.poll(() => svgPosition(incomeBody)).toEqual(generatedPosition)
    await page.reload()
    await expect.poll(() => svgPosition(incomeBody)).toEqual(generatedPosition)

    await pointerDrag(page, incomeCard, { x: 24, y: 16 }, { x: 0.92, y: 0.92 })
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Data' })).toBeVisible()
    const socialSecurityAmount = page
      .locator(".income-row:has(input[value='Social Security'])")
      .getByLabel('Amount', { exact: true })
    await expect(socialSecurityAmount).toBeVisible()
    await socialSecurityAmount.fill('5000')

    await page.getByRole('button', { name: 'More actions' }).click()
    await page.getByRole('menuitem', { name: /Clear map/ }).click()
    await page
      .getByRole('dialog', { name: 'Clear map' })
      .getByRole('button', { name: 'Clear map', exact: true })
      .click()
    await expect(page.getByRole('group', { name: 'Cash at Bank' })).toHaveCount(0)
    await expect(incomeCard).not.toContainText('Social Security')
    await expect
      .poll(async () => financialContent(await currentClient(page)))
      .toEqual({
        accounts: [],
        afterTaxIncome: null,
        asNeededAmount: null,
        footnotes: [],
        incomeSources: [],
        monthlyNeed: null,
        notes: [],
      })

    await page
      .getByLabel('Add income source')
      .getByRole('button', { name: 'Salary / Wages', exact: true })
      .click()
    const salaryAmount = page
      .locator(".income-row:has(input[value='Salary / Wages'])")
      .getByLabel('Amount', { exact: true })
    await expect(salaryAmount).toBeVisible()
    await salaryAmount.fill('5000')
    await expect(incomeCard).toContainText('Salary / Wages')
    await expect(incomeCard).toContainText('$5,000 mo.')

    await expect
      .poll(async () => (await currentClient(page)).incomeSources?.length)
      .toBe(1)
    await expect
      .poll(async () =>
        (await currentClient(page)).incomeSources?.find(
          (source) => source.label === 'Salary / Wages',
        )?.amount,
      )
      .toBe(5000)
    await salaryAmount.fill('5k')
    await salaryAmount.press('Tab')
    await expect(salaryAmount).toHaveValue('$5,000')
    const clearedWithSalary = financialContent(await currentClient(page))
    await pointerDrag(page, incomeCard, { x: 0, y: 12 }, { x: 0.92, y: 0.92 })
    await expect
      .poll(async () => financialContent(await currentClient(page)))
      .toEqual(clearedWithSalary)
    await expect(page.getByRole('group', { name: 'Cash at Bank' })).toHaveCount(0)
    await expect(incomeCard).toContainText('$5,000 mo.')

    await salaryAmount.focus()
    await salaryAmount.fill('5k')
    await page.getByRole('button', { name: 'More actions' }).click()
    await page.getByRole('menuitem', { name: 'Reset arrangement' }).click()
    await page
      .getByRole('dialog', { name: 'Reset arrangement' })
      .getByRole('button', { name: 'Reset', exact: true })
      .click()
    await expect(salaryAmount).toHaveValue('$5,000')

    await page.getByRole('button', { name: 'Undo', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Data' })).toHaveCount(0)
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Data' })).toBeVisible()
    const salaryAfterUndo = page
      .locator(".income-row:has(input[value='Salary / Wages'])")
      .getByLabel('Amount', { exact: true })
    await expect(salaryAfterUndo).toHaveValue('$5,000')

    await salaryAfterUndo.focus()
    await salaryAfterUndo.fill('5k')
    const clientSelect = page.getByLabel('Active client')
    await clientSelect.fill('Calloway')
    await page.getByRole('option', { name: /The Calloway Family/ }).click()
    await expect(clientSelect).toHaveValue('The Calloway Family')
    await expect(
      page.locator(".income-row:has(input[value='Salary / Wages'])"),
    ).toHaveCount(0)
    await clientSelect.fill('Whitfield')
    await page.getByRole('option', { name: /Jordan & Dana Whitfield/ }).click()
    await expect(
      page
        .locator(".income-row:has(input[value='Salary / Wages'])")
        .getByLabel('Amount', { exact: true }),
    ).toHaveValue('$5,000')

    await page.reload()
    await expect(page.getByRole('group', { name: 'Cash at Bank' })).toHaveCount(0)
    await expect(incomeCard).toContainText('Salary / Wages')
    await expect(incomeCard).toContainText('$5,000 mo.')
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    await expect(
      page
        .locator(".income-row:has(input[value='Salary / Wages'])")
        .getByLabel('Amount', { exact: true }),
    ).toHaveValue('$5,000')
  })

  test('large as-needed values stay compact and selected controls leave Present Mode', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Data', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Data' })).toBeVisible()
    const asNeeded = page.getByLabel('Monthly account withdrawal', { exact: true })
    const noisyValue = '$999,999,999,999.49'
    await asNeeded.fill(noisyValue)
    await asNeeded.press('Tab')
    await expect
      .poll(async () => (await currentClient(page)).asNeededAmount)
      .toBe(999_999_999_999.49)

    const exactLabel = 'Monthly income drawn as needed $999,999,999,999'
    const interactiveMap = page.locator(
      '.map-page:visible svg.map-interactive',
    )
    await expect(interactiveMap).toBeVisible()
    const asNeededMapLabel = interactiveMap.locator(
      `g[aria-label="${exactLabel}"]`,
    )
    const compactAmount = asNeededMapLabel.locator(
      '[data-map-edit-key="asNeededAmount"]',
    )
    await expect(asNeededMapLabel).toBeVisible()
    await expect(asNeededMapLabel).toHaveAttribute(
      'aria-label',
      exactLabel,
    )
    await expect(asNeededMapLabel.locator('title')).toHaveText(exactLabel)
    await expect(compactAmount).toBeVisible()
    await expect(compactAmount).toHaveText('$1T')

    for (const viewport of DESKTOP_VIEWPORTS) {
      await page.setViewportSize(viewport)
      const documentFits = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      )
      expect.soft(
        documentFits,
        JSON.stringify({ documentFits, viewport }),
      ).toBe(true)
      await expect(asNeededMapLabel).toBeVisible()
      await expect(asNeededMapLabel).toHaveAttribute(
        'aria-label',
        exactLabel,
      )
      await expect(asNeededMapLabel.locator('title')).toHaveText(exactLabel)
      await expect(compactAmount).toBeVisible()
    await expect(compactAmount).toHaveText('$1T')
      await expect(
        page.getByRole('button', { name: '+ Account', exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Add text note', exact: true }),
      ).toBeVisible()
    }

    await page.setViewportSize({ width: 1280, height: 720 })
    const accountId = (await currentClient(page)).accounts[0]?.id
    if (!accountId) throw new Error('No account available for selection')
    const account = page.locator(
      `[data-account-id="${accountId}"][role="group"]`,
    )
    await clickBlankAccountBody(account)
    const accountControls = page.locator('.map-inspector')
    await expect(accountControls).toBeVisible()
    for (const label of ['Shape', 'Add flow to', 'Move', 'Size', 'Rotate']) {
      await expect(accountControls.getByLabel(label, { exact: true })).toBeVisible()
    }
    const [inspectorBox, transform] = await Promise.all([
      accountControls.boundingBox(),
      accountControls.evaluate((element) => getComputedStyle(element).transform),
    ])
    if (!inspectorBox) throw new Error('Inspector has no measurable bounds')
    expect(transform).toBe('none')

    await page.getByRole('button', { name: 'Present' }).click()
    await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
    await expect(
      page.getByRole('button', { name: '+ Account', exact: true }),
    ).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: 'Add text note', exact: true }),
    ).toHaveCount(0)
    await expect(page.locator('.map-inspector')).toHaveCount(0)
    await expect(page.locator('.map-text-editor-input')).toHaveCount(0)
    await expect(page.getByLabel('Map zoom')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.app-shell')).not.toHaveClass(/is-presenting/)
    await expect(
      page.getByRole('button', { name: '+ Account', exact: true }),
    ).toBeVisible()
  })
})
