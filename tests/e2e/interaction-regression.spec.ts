import {
  expect,
  test,
  type Locator,
  type Page,
} from '@playwright/test'
import { BOOK_KEY, fullForm, openApp } from './helpers'

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
  asNeededAmount?: number | null
  customArrows?: Array<{
    id: string
    sourceId: string
    targetId: string
  }>
  id: string
  layoutOverrides?: Record<
    string,
    { dx?: number; dy?: number; fs?: number }
  >
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

async function spawnPreset(
  page: Page,
  button: string,
  bucket: string,
  label: string,
) {
  const beforeIds = new Set(
    (await currentClient(page)).accounts.map((account) => account.id),
  )
  await page.getByRole('button', { name: '+ Shape', exact: true }).click()
  await page
    .getByLabel('Add blank shape')
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

async function connectByPointer(
  page: Page,
  source: Locator,
  target: Locator,
  cancel: boolean,
) {
  const [sourceBox, targetBox] = await Promise.all([
    source.boundingBox(),
    target.boundingBox(),
  ])
  if (!sourceBox || !targetBox) {
    throw new Error('Connector endpoints have no measurable bounds')
  }
  const start = {
    x: sourceBox.x + sourceBox.width / 2,
    y: sourceBox.y + sourceBox.height / 2,
  }
  const end = {
    x: targetBox.x + targetBox.width / 2,
    y: targetBox.y + targetBox.height / 2,
  }
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(start.x + 24, start.y, { steps: 4 })
  await page.mouse.move(end.x, end.y, { steps: 10 })
  if (cancel) await page.keyboard.press('Escape')
  await page.mouse.up()
}

test.describe('approved desktop interaction regression', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-1280x720',
      'Combined interaction regression runs once in bundled Chromium.',
    )
    await openApp(page)
    await expect.poll(() => storedClient(page)).not.toBeNull()
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

    const accountControls = page.locator(
      `[data-account-controls-for="${subject.id}"]`,
    )
    await expect(accountControls).toBeVisible()
    for (const option of [
      { label: 'Card', shape: 'card' },
      { label: 'Cylinder', shape: 'drum' },
      { label: 'Bucket', shape: 'rect' },
      { label: 'Pill', shape: 'pill' },
    ] as const) {
      await accountControls
        .getByRole('button', {
          name: `Use ${option.label} shape for ${subject.label}`,
          exact: true,
        })
        .click()
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

    await labelTarget.click()
    const editor = page.locator('.map-text-editor-input')
    await expect(editor).toBeVisible()
    await editor.fill('Edited Short-Term Shape')
    await page
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

    await labelTarget.click()
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

    await pointerDrag(page, labelTarget, { x: 30, y: 18 })
    await expect(page.locator('.map-text-editor-input')).toHaveCount(0)
    await expect
      .poll(async () => {
        const override = (await currentClient(page)).layoutOverrides?.[
          `text:${subject.id}:label`
        ]
        return Math.abs(override?.dx ?? 0) + Math.abs(override?.dy ?? 0)
      })
      .toBeGreaterThan(0)

    const afterTextDrag = await currentClient(page)
    expect(afterTextDrag.layoutOverrides?.[subject.id]?.dx).toBe(
      afterBodyDrag?.dx,
    )
    expect(afterTextDrag.layoutOverrides?.[subject.id]?.dy).toBe(
      afterBodyDrag?.dy,
    )
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

    await sourceLabel.click()
    const editor = page.locator('.map-text-editor-input')
    await editor.fill('Cancelled Source Rename')
    await editor.press('Escape')
    await expect(editor).toHaveCount(0)
    expect(
      (await currentClient(page)).accounts.find(
        (account) => account.id === sourceId,
      )?.label,
    ).toBe('Connector Source')

    await sourceLabel.click()
    await editor.fill('Blurred Source Rename')
    await page.getByRole('button', { name: '+ Shape', exact: true }).click()
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
    await page.getByRole('button', { name: '+ Note', exact: true }).click()
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
    const sourceControls = page.locator(
      `[data-account-controls-for="${sourceId}"]`,
    )
    await expect(sourceControls).toBeVisible()
    const sourceHandle = sourceControls.getByRole('button', {
      name: 'Connect flow from Blurred Source Rename',
      exact: true,
    })
    const target = page.locator(
      `[data-account-id="${targetId}"][data-connect-id="${targetId}"]`,
    )
    const arrowsBefore =
      (await currentClient(page)).customArrows?.length ?? 0
    await sourceHandle.focus()
    await connectByPointer(page, sourceHandle, target, true)
    await expect
      .poll(
        async () =>
          (await currentClient(page)).customArrows?.length ?? 0,
      )
      .toBe(arrowsBefore)

    await clickBlankAccountBody(source)
    await expect(sourceControls).toBeVisible()
    await sourceHandle.focus()
    await connectByPointer(page, sourceHandle, target, false)
    await expect
      .poll(async () => {
        const arrows = (await currentClient(page)).customArrows ?? []
        return arrows.some(
          (arrow) =>
            arrow.sourceId === sourceId && arrow.targetId === targetId,
        )
      })
      .toBe(true)
  })

  test('large as-needed values stay compact and selected controls leave Present Mode', async ({
    page,
  }) => {
    await fullForm(page)
    const asNeeded = page.getByLabel('Draw from Short-Term Bucket')
    const noisyValue = '$999,999,999,999.49'
    await asNeeded.fill(noisyValue)
    await asNeeded.press('Tab')
    await expect
      .poll(async () => (await currentClient(page)).asNeededAmount)
      .toBe(999_999_999_999.49)

    const exactLabel = 'Monthly Income as Needed $999,999,999,999'
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
        page.getByRole('button', { name: '+ Shape', exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: '+ Note', exact: true }),
      ).toBeVisible()
    }

    const accountId = (await currentClient(page)).accounts[0]?.id
    if (!accountId) throw new Error('No account available for selection')
    const account = page.locator(
      `[data-account-id="${accountId}"][role="group"]`,
    )
    await clickBlankAccountBody(account)
    const accountControls = page.locator(
      `[data-account-controls-for="${accountId}"]`,
    )
    await expect(accountControls).toBeVisible()
    await expect(accountControls.locator('.map-shape-picker')).toBeVisible()
    await expect(accountControls.locator('.map-adjust-controls')).toBeVisible()
    await expect(
      accountControls.locator('.map-connect-flow-control'),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Present' }).click()
    await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
    await expect(
      page.getByRole('button', { name: '+ Shape', exact: true }),
    ).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: '+ Note', exact: true }),
    ).toHaveCount(0)
    await expect(page.locator('[data-account-controls-for]')).toHaveCount(0)
    await expect(page.locator('.map-shape-picker')).toHaveCount(0)
    await expect(page.locator('.map-adjust-controls')).toHaveCount(0)
    await expect(page.locator('.map-connect-flow-control')).toHaveCount(0)
    await expect(page.locator('.map-text-editor-input')).toHaveCount(0)
    await expect(page.getByLabel('Map zoom')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('.app-shell')).not.toHaveClass(/is-presenting/)
    await expect(
      page.getByRole('button', { name: '+ Shape', exact: true }),
    ).toBeVisible()
  })
})
