import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'
import { SAMPLE_WHITFIELD } from '../../src/model/samples'
import {
  assertWcag22AA,
  BOOK_KEY,
  evidence,
  fullForm,
  openApp,
} from './helpers'

const VIEWPORT = { width: 1280, height: 720 }
type BookEnvelope = {
  clients: unknown[]
  [key: string]: unknown
}

type TimingSample = {
  inputMs: number
  saveMs: number
  title: string
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function certificationClient(index: number) {
  const client = clone(SAMPLE_WHITFIELD)
  const ordinal = String(index).padStart(3, '0')
  client.id = `certification-client-${ordinal}`
  client.client.title = `Certification Client ${ordinal}`
  client.accounts = client.accounts.map((account) => ({
    ...account,
    id: `${account.id}-${ordinal}`,
  }))
  client.customArrows = client.customArrows?.map((arrow) => ({
    ...arrow,
    id: `${arrow.id}-${ordinal}`,
    sourceId: `${arrow.sourceId}-${ordinal}`,
    targetId: `${arrow.targetId}-${ordinal}`,
  }))
  return client
}

async function storedBook(page: Page): Promise<BookEnvelope> {
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), BOOK_KEY))
    .not.toBeNull()
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? '{}') as BookEnvelope,
    BOOK_KEY,
  )
}

async function reloadWithBook(
  page: Page,
  book: BookEnvelope,
  marker: string,
) {
  const flag = `extended-certification:${marker}`
  await page.addInitScript(
    ({ key, payload, sessionFlag }) => {
      if (
        location.protocol.startsWith('http') &&
        sessionStorage.getItem(sessionFlag) !== 'installed'
      ) {
        localStorage.setItem(key, payload)
        sessionStorage.setItem(sessionFlag, 'installed')
      }
    },
    { key: BOOK_KEY, payload: JSON.stringify(book), sessionFlag: flag },
  )
  await page.reload()
  await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'reduce' })
}

async function installTwoHundredClientBook(page: Page) {
  await openApp(page)
  const envelope = await storedBook(page)
  const clients = Array.from({ length: 200 }, (_, index) =>
    certificationClient(index + 1),
  )
  await reloadWithBook(
    page,
    { ...envelope, clients },
    'two-hundred-clients',
  )
  await expect(page.getByLabel('Active client').locator('option')).toHaveCount(
    200,
  )
}

async function writeJsonArtifact(
  testInfo: TestInfo,
  name: string,
  value: unknown,
) {
  await testInfo.attach(name, {
    body: `${JSON.stringify(value, null, 2)}\n`,
    contentType: 'application/json',
  })
  return (
    testInfo.attachments[testInfo.attachments.length - 1]?.path ??
    testInfo.outputDir
  )
}

function percentile(samples: number[], fraction: number) {
  if (samples.length === 0) return 0
  const sorted = [...samples].sort((left, right) => left - right)
  const index = Math.max(
    0,
    Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1),
  )
  return Number(sorted[index].toFixed(2))
}

async function installPerformanceProbe(page: Page) {
  await page.evaluate((storageKey) => {
    type Probe = {
      expectedClientId: string | null
      expectedTitle: string | null
      inputPromise: Promise<number> | null
      longTasks: Array<{
        duration: number
        name: string
        startTime: number
      }>
      observer: PerformanceObserver | null
      originalSetItem: typeof Storage.prototype.setItem
      resolveSave: ((duration: number) => void) | null
      sampleStart: number
      savePromise: Promise<number> | null
    }
    const extendedWindow = window as Window & {
      __extendedCertificationProbe?: Probe
    }
    const originalSetItem = Storage.prototype.setItem
    const probe: Probe = {
      expectedClientId: null,
      expectedTitle: null,
      inputPromise: null,
      longTasks: [],
      observer: null,
      originalSetItem,
      resolveSave: null,
      sampleStart: 0,
      savePromise: null,
    }

    if (
      'PerformanceObserver' in window &&
      PerformanceObserver.supportedEntryTypes.includes('longtask')
    ) {
      probe.observer = new PerformanceObserver((list) => {
        probe.longTasks.push(
          ...list.getEntries().map((entry) => ({
            duration: Number(entry.duration.toFixed(2)),
            name: entry.name,
            startTime: Number(entry.startTime.toFixed(2)),
          })),
        )
      })
      probe.observer.observe({ buffered: true, type: 'longtask' })
    }

    extendedWindow.__extendedCertificationProbe = probe
    Storage.prototype.setItem = function setItem(
      this: Storage,
      key: string,
      value: string,
    ) {
      const result = originalSetItem.call(this, key, value)
      const activeProbe = extendedWindow.__extendedCertificationProbe
      if (
        this === localStorage &&
        key === storageKey &&
        activeProbe?.resolveSave &&
        activeProbe.expectedClientId &&
        activeProbe.expectedTitle &&
        value.includes(activeProbe.expectedClientId) &&
        value.includes(JSON.stringify(activeProbe.expectedTitle))
      ) {
        const resolve = activeProbe.resolveSave
        activeProbe.resolveSave = null
        resolve(performance.now() - activeProbe.sampleStart)
      }
      return result
    }
  }, BOOK_KEY)
}

async function measureTitleKeystroke(
  page: Page,
  title: Locator,
  clientId: string,
  expectedTitle: string,
  character: string,
): Promise<TimingSample> {
  await title.evaluate(
    (element, expected) => {
      type Probe = {
        expectedClientId: string | null
        expectedTitle: string | null
        inputPromise: Promise<number> | null
        resolveSave: ((duration: number) => void) | null
        sampleStart: number
        savePromise: Promise<number> | null
      }
      const probe = (
        window as Window & { __extendedCertificationProbe?: Probe }
      ).__extendedCertificationProbe
      if (!probe) throw new Error('Performance probe is not installed')

      probe.expectedClientId = expected.clientId
      probe.expectedTitle = expected.title
      probe.sampleStart = performance.now()
      probe.savePromise = new Promise<number>((resolve) => {
        probe.resolveSave = resolve
      })
      probe.inputPromise = new Promise<number>((resolve) => {
        element.addEventListener(
          'input',
          () => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                resolve(performance.now() - probe.sampleStart)
              })
            })
          },
          { once: true },
        )
      })
    },
    { clientId, title: expectedTitle },
  )

  await page.keyboard.type(character)
  const measured = await page.evaluate(async () => {
    type Probe = {
      inputPromise: Promise<number> | null
      savePromise: Promise<number> | null
    }
    const probe = (
      window as Window & { __extendedCertificationProbe?: Probe }
    ).__extendedCertificationProbe
    if (!probe?.inputPromise || !probe.savePromise) {
      throw new Error('Performance sample was not armed')
    }
    const [inputMs, saveMs] = await Promise.all([
      probe.inputPromise,
      probe.savePromise,
    ])
    return {
      inputMs: Number(inputMs.toFixed(2)),
      saveMs: Number(saveMs.toFixed(2)),
    }
  })
  return { ...measured, title: expectedTitle }
}

async function finishPerformanceProbe(page: Page) {
  return page.evaluate(() => {
    type LongTask = {
      duration: number
      name: string
      startTime: number
    }
    type Probe = {
      longTasks: LongTask[]
      observer: PerformanceObserver | null
      originalSetItem: typeof Storage.prototype.setItem
    }
    const probe = (
      window as Window & { __extendedCertificationProbe?: Probe }
    ).__extendedCertificationProbe
    if (!probe) throw new Error('Performance probe is not installed')
    if (probe.observer) {
      probe.longTasks.push(
        ...probe.observer.takeRecords().map((entry) => ({
          duration: Number(entry.duration.toFixed(2)),
          name: entry.name,
          startTime: Number(entry.startTime.toFixed(2)),
        })),
      )
      probe.observer.disconnect()
    }
    Storage.prototype.setItem = probe.originalSetItem
    return probe.longTasks
  })
}

type PaintedTargetState = {
  bounds: { bottom: number; left: number; right: number; top: number }
  fullyPainted: boolean
  label: string
  ownerFound: boolean
  reachable: boolean
  truncatedLabels: string[]
}

async function applyRequiredTextSpacing(page: Page) {
  await page.addStyleTag({
    content: [
      'html, body, body * {',
      '  letter-spacing: 0.12em !important;',
      '  line-height: 1.5 !important;',
      '  word-spacing: 0.16em !important;',
      '}',
      'p { margin-bottom: 2em !important; }',
    ].join('\n'),
  })
  await expect
    .poll(() =>
      page.evaluate(() => {
        const bodyStyle = getComputedStyle(document.body)
        const fontSize = Number.parseFloat(bodyStyle.fontSize)
        const paragraph = document.querySelector('p')
        const paragraphStyle = paragraph ? getComputedStyle(paragraph) : null
        const paragraphFontSize = paragraphStyle
          ? Number.parseFloat(paragraphStyle.fontSize)
          : 1
        return {
          letterSpacing:
            Number.parseFloat(bodyStyle.letterSpacing) / fontSize >= 0.12,
          lineHeight:
            Number.parseFloat(bodyStyle.lineHeight) / fontSize >= 1.5,
          paragraphSpacing:
            Boolean(paragraphStyle) &&
            Number.parseFloat(paragraphStyle!.marginBottom) /
              paragraphFontSize >=
              2,
          wordSpacing:
            Number.parseFloat(bodyStyle.wordSpacing) / fontSize >= 0.16,
        }
      }),
    )
    .toEqual({
      letterSpacing: true,
      lineHeight: true,
      paragraphSpacing: true,
      wordSpacing: true,
    })
}

async function paintedTargetState(
  label: string,
  locator: Locator,
  ownerSelector: string,
): Promise<PaintedTargetState> {
  await locator.scrollIntoViewIfNeeded()
  await expect(locator).toBeVisible()
  return locator.evaluate(
    (element, target) => {
      const box = element.getBoundingClientRect()
      const owner =
        target.ownerSelector === 'viewport'
          ? document.documentElement
          : element.closest(target.ownerSelector)
      const ownerBox = owner?.getBoundingClientRect() ?? {
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth,
        top: 0,
      }
      const centerX = Math.min(
        window.innerWidth - 1,
        Math.max(0, box.left + box.width / 2),
      )
      const centerY = Math.min(
        window.innerHeight - 1,
        Math.max(0, box.top + box.height / 2),
      )
      const hit = document.elementFromPoint(centerX, centerY)
      const labelNodes: HTMLElement[] = []
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        for (const associatedLabel of Array.from(element.labels ?? [])) {
          labelNodes.push(
            associatedLabel.querySelector<HTMLElement>(':scope > span') ??
              associatedLabel,
          )
        }
      } else if (
        element instanceof HTMLElement &&
        element.textContent?.trim()
      ) {
        labelNodes.push(element)
      }
      const truncatedLabels = labelNodes.flatMap((node) => {
        const style = getComputedStyle(node)
        const horizontal =
          ['clip', 'hidden'].includes(style.overflowX) &&
          node.scrollWidth > node.clientWidth + 1
        const vertical =
          ['clip', 'hidden'].includes(style.overflowY) &&
          node.scrollHeight > node.clientHeight + 1
        if (!horizontal && !vertical) return []
        return [node.textContent?.replace(/\s+/g, ' ').trim() || target.label]
      })
      return {
        bounds: {
          bottom: Math.round(box.bottom),
          left: Math.round(box.left),
          right: Math.round(box.right),
          top: Math.round(box.top),
        },
        fullyPainted:
          box.width > 0 &&
          box.height > 0 &&
          box.left >= ownerBox.left - 1 &&
          box.right <= ownerBox.right + 1 &&
          box.top >= ownerBox.top - 1 &&
          box.bottom <= ownerBox.bottom + 1,
        label: target.label,
        ownerFound: Boolean(owner),
        reachable: Boolean(
          hit &&
            (hit === element || element.contains(hit) || hit.contains(element)),
        ),
        truncatedLabels,
      }
    },
    { label, ownerSelector },
  )
}

async function focusBoundaryState(label: string, locator: Locator) {
  await locator.scrollIntoViewIfNeeded()
  await locator.focus()
  await expect(locator).toBeFocused()
  return locator.evaluate((element, controlLabel) => {
    const style = getComputedStyle(element)
    const borderWidths = [
      style.borderTopWidth,
      style.borderRightWidth,
      style.borderBottomWidth,
      style.borderLeftWidth,
    ].map((width) => Number.parseFloat(width) || 0)
    const outlineWidth = Number.parseFloat(style.outlineWidth) || 0
    const svgBoundary =
      element instanceof SVGElement &&
      [...element.querySelectorAll<SVGElement>('*')].some((child) => {
        const childStyle = getComputedStyle(child)
        return (
          childStyle.stroke !== 'none' &&
          childStyle.stroke !== 'transparent' &&
          (Number.parseFloat(childStyle.strokeWidth) || 0) > 0
        )
      })
    return {
      borderStyle: style.borderStyle,
      borderWidths,
      boxShadow: style.boxShadow,
      focused: document.activeElement === element,
      focusVisible: element.matches(':focus-visible'),
      forcedColorsActive: matchMedia('(forced-colors: active)').matches,
      hasVisibleBoundary:
        (style.outlineStyle !== 'none' && outlineWidth > 0) ||
        (style.borderStyle !== 'none' &&
          borderWidths.some((width) => width > 0)) ||
        style.boxShadow !== 'none' ||
        svgBoundary,
      label: controlLabel,
      outlineStyle: style.outlineStyle,
      outlineWidth,
      svgBoundary,
    }
  }, label)
}

async function readCompoundState(page: Page) {
  return page.evaluate((key) => {
    const book = JSON.parse(localStorage.getItem(key) ?? '{}') as {
      clients?: Array<{
        accounts: Array<{
          id: string
          positions?: Array<{ label: string }>
          shape?: string
          subAccounts?: Array<{ label: string }>
        }>
        client: { title: string }
        footnotes?: Array<{ label: string }>
        id: string
        layoutOverrides?: Record<string, Record<string, number>>
        notes?: Array<{ text: string }>
      }>
    }
    const client = book.clients?.find(
      (candidate) => candidate.id === 'sample-whitfield',
    )
    if (!client) return null
    const account = client.accounts.find(
      (candidate) => candidate.id === 'cash-at-bank',
    )
    return {
      accountDx: client.layoutOverrides?.['cash-at-bank']?.dx ?? 0,
      accountShape: account?.shape ?? null,
      footnoteLabels: client.footnotes?.map((item) => item.label) ?? [],
      incomeTextDy:
        client.layoutOverrides?.['text:income:header']?.dy ?? 0,
      noteTexts: client.notes?.map((item) => item.text) ?? [],
      positionLabels: account?.positions?.map((item) => item.label) ?? [],
      subAccountLabels:
        account?.subAccounts?.map((item) => item.label) ?? [],
      title: client.client.title,
    }
  }, BOOK_KEY)
}

test.describe('extended desktop certification', () => {
  test.use({ viewport: VIEWPORT })

  test.beforeEach(({ browserName }, testInfo) => {
    const isChromiumDesktop =
      browserName === 'chromium' &&
      testInfo.project.name === 'chromium-1280x720'
    const isWebKitTextSpacing =
      browserName === 'webkit' &&
      testInfo.project.name === 'webkit-1440x900' &&
      testInfo.title ===
        'WCAG text spacing and forced colors preserve content and boundaries'
    const isCompoundPresentEscape =
      testInfo.title ===
        'Present then Escape retains compound form and map edits' &&
      [
        'chromium-1280x720',
        'chrome-1440x900',
        'msedge-1440x900',
        'webkit-1440x900',
      ].includes(testInfo.project.name)
    test.skip(
      !isChromiumDesktop &&
        !isWebKitTextSpacing &&
        !isCompoundPresentEscape,
      'Extended certification is scoped by test and browser project.',
    )
  })

  test('200-client edit/export races preserve ownership and report responsiveness', async ({
    page,
  }, testInfo) => {
    await installTwoHundredClientBook(page)
    const clientSelect = page.getByLabel('Active client')
    const client200 = 'certification-client-200'
    const client199 = 'certification-client-199'
    const client198 = 'certification-client-198'

    await clientSelect.selectOption(client200)
    await fullForm(page)
    const title = page.getByLabel('Title')
    await expect(title).toHaveValue('Certification Client 200')
    await title.focus()
    await title.press('End')
    await installPerformanceProbe(page)

    const samples: TimingSample[] = []
    let currentTitle = await title.inputValue()
    for (const character of 'abcdefghi') {
      currentTitle += character
      samples.push(
        await measureTitleKeystroke(
          page,
          title,
          client200,
          currentTitle,
          character,
        ),
      )
    }
    await expect(title).toHaveValue(currentTitle)

    const pendingEditTitle = 'Client 200 pending-switch edit'
    await title.fill(pendingEditTitle)
    await clientSelect.selectOption(client199)
    await expect(title).toHaveValue('Certification Client 199')
    await expect
      .poll(() =>
        page.evaluate(
          ({ key, id }) => {
            const book = JSON.parse(localStorage.getItem(key) ?? '{}') as {
              clients?: Array<{
                client: { title: string }
                id: string
              }>
            }
            return book.clients?.find((client) => client.id === id)?.client
              .title
          },
          { key: BOOK_KEY, id: client200 },
        ),
      )
      .toBe(pendingEditTitle)

    let releaseFonts: () => void = () => {}
    const fontGate = new Promise<void>((resolve) => {
      releaseFonts = resolve
    })
    let exportFontRequests = 0
    await page.route('**/*.woff2', async (route) => {
      exportFontRequests += 1
      await fontGate
      await route.continue()
    })
    const downloads: string[] = []
    page.on('download', (download) => {
      downloads.push(download.suggestedFilename())
    })

    await page.getByRole('button', { name: 'Export map' }).click()
    await page.getByRole('menuitem', { name: 'PNG image' }).click()
    await expect.poll(() => exportFontRequests).toBe(4)
    await page.getByRole('button', { name: 'Export map' }).click()
    await expect(page.getByText('Exporting PNG…')).toBeVisible()
    const pngItem = page.getByRole('menuitem', { name: 'PNG image' })
    await expect(pngItem).toBeDisabled()
    await pngItem.evaluate((element) => {
      for (let index = 0; index < 12; index += 1) {
        element.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        )
      }
    })
    await page.keyboard.press('Escape')
    await clientSelect.selectOption(client198)
    await expect(clientSelect).toHaveValue(client198)
    releaseFonts()

    await expect.poll(() => downloads.length).toBe(1)
    expect(downloads[0]).toContain('Certification Client 199')
    await page.getByRole('button', { name: 'Export map' }).click()
    await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeEnabled()
    await expect(page.getByText('Exporting PNG…')).toHaveCount(0)
    expect(exportFontRequests).toBe(4)
    expect(downloads).toHaveLength(1)
    await page.keyboard.press('Escape')

    const longTasks = await finishPerformanceProbe(page)
    const inputValues = samples.map((sample) => sample.inputMs)
    const saveValues = samples.map((sample) => sample.saveMs)
    const flaggedInputs = samples.filter((sample) => sample.inputMs > 100)
    const flaggedLongTasks = longTasks.filter((task) => task.duration > 200)
    const metrics = {
      thresholds: {
        inputFlagAboveMs: 100,
        longTaskFlagAboveMs: 200,
      },
      input: {
        p50Ms: percentile(inputValues, 0.5),
        p95Ms: percentile(inputValues, 0.95),
        samples,
      },
      save: {
        p50Ms: percentile(saveValues, 0.5),
        p95Ms: percentile(saveValues, 0.95),
      },
      longTasks,
      flags: {
        input: flaggedInputs,
        longTasks: flaggedLongTasks,
      },
      race: {
        downloads,
        exportFontRequests,
        finalActiveClient: await clientSelect.inputValue(),
        pendingEditOwner: client200,
      },
    }
    const metricsPath = await writeJsonArtifact(
      testInfo,
      'extended-performance',
      metrics,
    )
    console.log(
      `EXTENDED_CERT_PERFORMANCE ${JSON.stringify({
        artifact: metricsPath,
        inputP50Ms: metrics.input.p50Ms,
        inputP95Ms: metrics.input.p95Ms,
        saveP50Ms: metrics.save.p50Ms,
        saveP95Ms: metrics.save.p95Ms,
        flaggedInputs: flaggedInputs.length,
        flaggedLongTasks: flaggedLongTasks.length,
      })}`,
    )

    await page.reload()
    await expect(page.getByText('Money Map', { exact: true }).first()).toBeVisible()
    await clientSelect.selectOption(client200)
    await fullForm(page)
    await expect(page.getByLabel('Title')).toHaveValue(pendingEditTitle)
    await evidence(page, testInfo, 'two-hundred-client-races')

    expect(
      flaggedInputs,
      `Input samples over 100 ms; see ${metricsPath}`,
    ).toEqual([])
    expect(
      flaggedLongTasks,
      `Long tasks over 200 ms; see ${metricsPath}`,
    ).toEqual([])
  })

  test('WCAG text spacing and forced colors preserve content and boundaries', async ({
    browserName,
    page,
  }, testInfo) => {
    test.setTimeout(120_000)
    await openApp(page)
    await applyRequiredTextSpacing(page)
    const painted: PaintedTargetState[] = []
    const capture = async (
      label: string,
      locator: Locator,
      ownerSelector: string,
    ) => {
      painted.push(await paintedTargetState(label, locator, ownerSelector))
    }

    await capture('Active client', page.getByLabel('Active client'), '.app-header')
    await capture('New', page.getByRole('button', { name: 'New', exact: true }), '.app-header')
    await capture('Book menu', page.getByRole('button', { name: 'Book menu' }), '.app-header')
    await capture('Present', page.getByRole('button', { name: 'Present' }), '.app-header')
    await capture('Print', page.getByRole('button', { name: 'Print', exact: true }), '.app-header')
    await capture('Export map', page.getByRole('button', { name: 'Export map' }), '.app-header')
    await capture('Guide me', page.getByRole('button', { name: 'Guide me' }), '.form-pane')
    await capture('Full form', page.getByRole('button', { name: 'Full form' }), '.form-pane')
    await capture('Wizard Client step', page.getByRole('button', { name: 'Client', exact: true }), '.form-pane')
    await capture('Wizard Next', page.getByRole('button', { name: 'Next' }), '.form-pane')
    await capture('Wizard footer', page.locator('.wizard-footer'), '.form-pane')
    await assertWcag22AA(page, testInfo, 'text-spacing-wizard')

    await fullForm(page)
    const firstAccount = page.locator('.account-card').first()
    await firstAccount.locator('summary').click()
    const shapeGroup = page.getByRole('group', {
      name: 'Shape for Cash at Bank',
      exact: true,
    })
    await capture('Title input', page.getByLabel('Title'), '.form-pane')
    await capture(
      'Year select',
      page.getByRole('combobox', { name: /^Year\b/ }),
      '.form-pane',
    )
    await capture('Income amount', page.getByLabel('Amount').first(), '.form-pane')
    await capture(
      'Account name input',
      firstAccount.getByLabel('Account name'),
      '.form-pane',
    )
    await capture('Cash account shape group', shapeGroup, '.form-pane')
    await capture(
      'Card shape control',
      shapeGroup.getByRole('button', { name: 'Card shape' }),
      '.form-pane',
    )

    await page.getByRole('button', { name: 'Book menu' }).click()
    await capture('Open Book menu', page.getByRole('menu'), 'viewport')
    await capture(
      'Download book backup menu item',
      page.getByRole('menuitem', { name: 'Download book backup' }),
      'viewport',
    )
    await assertWcag22AA(page, testInfo, 'text-spacing-book-menu')
    await page.keyboard.press('Escape')

    await page.evaluate(() => {
      const extendedWindow = window as Window & {
        __extendedOriginalObjectUrl?: typeof URL.createObjectURL
      }
      extendedWindow.__extendedOriginalObjectUrl = URL.createObjectURL
      URL.createObjectURL = () => {
        throw new Error('text-spacing dialog state')
      }
    })
    await page.getByRole('button', { name: 'Book menu' }).click()
    await page.getByRole('menuitem', { name: 'Download book backup' }).click()
    const dialog = page.getByRole('dialog', { name: 'Could not save book' })
    await capture('Open save error dialog', dialog, 'viewport')
    await capture('Dialog action', dialog.getByRole('button'), 'viewport')
    await assertWcag22AA(page, testInfo, 'text-spacing-dialog')
    await dialog.getByRole('button').click()
    await page.evaluate(() => {
      const extendedWindow = window as Window & {
        __extendedOriginalObjectUrl?: typeof URL.createObjectURL
      }
      if (extendedWindow.__extendedOriginalObjectUrl) {
        URL.createObjectURL = extendedWindow.__extendedOriginalObjectUrl
      }
    })

    const paintedFailures = painted.filter(
      (state) =>
        !state.ownerFound ||
        !state.fullyPainted ||
        !state.reachable ||
        state.truncatedLabels.length > 0,
    )
    const textSpacingPath = await writeJsonArtifact(
      testInfo,
      'targeted-wcag-text-spacing',
      { browserName, painted, paintedFailures },
    )
    await evidence(page, testInfo, 'targeted-wcag-text-spacing')
    expect(
      paintedFailures,
      'Targeted text-spacing failure; see ' + textSpacingPath,
    ).toEqual([])

    let forcedColorsSupported = false
    let forcedColorsError: string | null = null
    try {
      await page.emulateMedia({
        forcedColors: 'active',
        reducedMotion: 'reduce',
      })
      forcedColorsSupported = await page.evaluate(() =>
        matchMedia('(forced-colors: active)').matches,
      )
    } catch (error) {
      forcedColorsError =
        error instanceof Error ? error.message : String(error)
    }
    if (!forcedColorsSupported) {
      await testInfo.attach('forced-colors-capability', {
        body: JSON.stringify({ browserName, forcedColorsError, supported: false }),
        contentType: 'application/json',
      })
      return
    }

    const boundaries = []
    const clientSelect = page.getByLabel('Active client')
    const initialClient = await clientSelect.inputValue()
    boundaries.push(await focusBoundaryState('Active client', clientSelect))
    await clientSelect.selectOption({ index: 1 })
    await expect(clientSelect).not.toHaveValue(initialClient)
    await clientSelect.selectOption(initialClient)
    await expect(clientSelect).toHaveValue(initialClient)
    await page.keyboard.press('Tab')

    const bookMenu = page.getByRole('button', { name: 'Book menu' })
    boundaries.push(await focusBoundaryState('Book menu', bookMenu))
    await page.keyboard.press('Enter')
    await expect(page.getByRole('menu')).toBeVisible()
    await page.keyboard.press('Escape')

    const cardShape = page
      .getByRole('group', {
        name: 'Shape for Cash at Bank',
        exact: true,
      })
      .getByRole('button', { name: 'Card shape' })
    boundaries.push(await focusBoundaryState('Card shape', cardShape))
    await page.keyboard.press('Space')
    await expect(cardShape).toHaveAttribute('aria-pressed', 'true')

    const mapAccount = page
      .locator('[data-account-id="cash-at-bank"][role="group"]')
      .first()
    boundaries.push(await focusBoundaryState('Map account editor', mapAccount))
    await page.keyboard.press('ArrowRight')
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const book = JSON.parse(localStorage.getItem(key) ?? '{}') as {
            clients?: Array<{
              id: string
              layoutOverrides?: Record<string, { dx?: number }>
            }>
          }
          const client = book.clients?.find(
            (candidate) => candidate.id === 'sample-whitfield',
          )
          return client?.layoutOverrides?.['cash-at-bank']?.dx ?? 0
        }, BOOK_KEY),
      )
      .toBeGreaterThan(0)

    const present = page.getByRole('button', { name: 'Present' })
    boundaries.push(await focusBoundaryState('Present', present))
    await page.keyboard.press('Enter')
    await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
    await page.keyboard.press('Escape')
    await expect(page.locator('.app-shell')).not.toHaveClass(/is-presenting/)

    const forcedColorPaint = []
    for (const [label, control] of [
      ['Print', page.getByRole('button', { name: 'Print', exact: true })],
      ['Export map', page.getByRole('button', { name: 'Export map', exact: true })],
    ] as const) {
      boundaries.push(await focusBoundaryState(label, control))
      forcedColorPaint.push(await control.evaluate((element, controlLabel) => {
        const style = getComputedStyle(element)
        return {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          color: style.color,
          controlLabel,
          focusVisible: element.matches(':focus-visible'),
          forcedColorAdjust: style.forcedColorAdjust,
          outlineColor: style.outlineColor,
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
        }
      }, label))
    }
    console.log(`FORCED_COLOR_PAINT ${JSON.stringify(forcedColorPaint)}`)

    await assertWcag22AA(page, testInfo, 'forced-colors-keyboard-controls')
    const forcedColorPaintFailures = forcedColorPaint.filter(
      (state) => state.color === state.backgroundColor || !state.focusVisible || state.outlineStyle === 'none' || Number.parseFloat(state.outlineWidth) <= 0,
    )
    const boundaryFailures = boundaries.filter(
      (state) =>
        !state.focused ||
        !state.focusVisible ||
        !state.forcedColorsActive ||
        !state.hasVisibleBoundary,
    )
    const boundaryPath = await writeJsonArtifact(
      testInfo,
      'forced-colors-keyboard-boundaries',
      { boundaries, boundaryFailures, browserName },
    )
    await evidence(page, testInfo, 'forced-colors-keyboard-controls')
    expect(
      boundaryFailures,
      'Forced-colors focus boundary failure; see ' + boundaryPath,
    ).toEqual([])
    expect(forcedColorPaintFailures, 'Forced-colors paint/focus failure').toEqual([])
  })

  test('axe covers open menus, native dialog, layout overflow, and focused map controls', async ({
    browser,
    page,
  }, testInfo) => {
    await openApp(page)
    const envelope = await storedBook(page)
    const failures: string[] = []
    const audit = async (target: Page, state: string) => {
      try {
        await assertWcag22AA(target, testInfo, state)
      } catch (error) {
        failures.push(
          `${state}: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    await page.getByRole('button', { name: 'Book menu' }).click()
    await expect(page.getByRole('menuitem', { name: 'Download book backup' })).toBeVisible()
    await audit(page, 'book-menu-open')
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: 'Export map' }).click()
    await expect(page.getByRole('menuitem', { name: 'PNG image' })).toBeVisible()
    await audit(page, 'save-menu-open')
    await page.keyboard.press('Escape')

    await page.evaluate(() => {
      const extendedWindow = window as Window & {
        __extendedOriginalObjectUrl?: typeof URL.createObjectURL
      }
      extendedWindow.__extendedOriginalObjectUrl = URL.createObjectURL
      URL.createObjectURL = () => {
        throw new Error('extended certification forced failure')
      }
    })
    await page.getByRole('button', { name: 'Book menu' }).click()
    await page.getByRole('menuitem', { name: 'Download book backup' }).click()
    const dialog = page.getByRole('dialog', { name: 'Could not save book' })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.evaluate((element) => (element as HTMLDialogElement).open),
    ).resolves.toBe(true)
    await audit(page, 'native-dialog-open')
    await dialog.getByRole('button').click()
    await page.evaluate(() => {
      const extendedWindow = window as Window & {
        __extendedOriginalObjectUrl?: typeof URL.createObjectURL
      }
      if (extendedWindow.__extendedOriginalObjectUrl) {
        URL.createObjectURL = extendedWindow.__extendedOriginalObjectUrl
      }
    })

    await fullForm(page)
    const mapAccount = page
      .locator('[data-account-id="cash-at-bank"][role="group"]')
      .first()
    await mapAccount.focus()
    await expect(mapAccount).toBeFocused()
    await audit(page, 'map-edit-control-focused')

    const stressed = clone(SAMPLE_WHITFIELD)
    stressed.id = 'extended-layout-warning'
    stressed.client.title = 'Extended Layout Warning'
    const seedAccount = stressed.accounts[0]
    stressed.accounts.push(
      ...Array.from({ length: 30 }, (_, index) => ({
        ...clone(seedAccount),
        id: `extended-stress-${index}`,
        label: `Stress account ${index + 1} with a long wrapped title`,
      })),
    )
    const stressedBook = { ...envelope, clients: [stressed] }
    const stressedContext = await browser.newContext({
      baseURL: new URL(page.url()).origin,
      colorScheme: 'light',
      locale: 'en-US',
      reducedMotion: 'reduce',
      viewport: VIEWPORT,
    })
    await stressedContext.addInitScript(
      ({ key, payload, expectedOrigin }) => {
        if (location.origin === expectedOrigin) {
          localStorage.setItem(key, payload)
        }
      },
      {
        key: BOOK_KEY,
        payload: JSON.stringify(stressedBook),
        expectedOrigin: new URL(page.url()).origin,
      },
    )
    const stressedPage = await stressedContext.newPage()
    try {
      await openApp(stressedPage)
      await expect(stressedPage.getByText('Export paused')).toHaveCount(0)
      await expect(
        stressedPage.getByRole('button', { name: 'Print', exact: true }),
      ).toBeEnabled()
      await stressedPage.getByRole('button', { name: 'Export map' }).click()
      for (const name of ['PNG image', 'PDF image snapshot', 'SVG image']) {
        await expect(
          stressedPage.getByRole('menuitem', { name }),
        ).toBeEnabled()
      }
      await audit(stressedPage, 'layout-warning-output')
      await evidence(stressedPage, testInfo, 'axe-layout-warning-output')
    } finally {
      await stressedContext.close()
    }

    const axePath = await writeJsonArtifact(
      testInfo,
      'axe-dynamic-states',
      { failures, statesAudited: 5 },
    )
    expect(failures, `Dynamic-state axe failures; see ${axePath}`).toEqual([])
  })

  test('Present then Escape retains compound form and map edits', async ({
    page,
  }, testInfo) => {
    await openApp(page)
    await fullForm(page)
    await page.getByLabel('Title').fill('Whitfield Compound Retention')

    const shapeGroup = page.getByRole('group', {
      name: 'Shape for Cash at Bank',
      exact: true,
    })
    const accountShell = page
      .locator('.account-card-shell')
      .filter({ has: shapeGroup })
    const account = accountShell.locator('.account-card')
    const nextShape = shapeGroup.getByRole('button', { name: 'Card shape' })
    await expect(shapeGroup).toBeVisible()
    await nextShape.click()
    await expect(nextShape).toHaveAttribute('aria-pressed', 'true')
    await account.locator('summary').click()
    await account
      .getByRole('button', { name: '+ Add position', exact: true })
      .click()
    await accountShell
      .getByLabel('Label', { exact: true })
      .last()
      .fill('Retention position')
    await account
      .getByRole('button', { name: '+ Add sub-account', exact: true })
      .click()
    await accountShell
      .locator('.subaccount-row')
      .last()
      .getByLabel('Label', { exact: true })
      .fill('Retention sub-account')
    await page
      .getByRole('button', { name: '+ Add fine print line', exact: true })
      .click()
    await page
      .locator('.footnote-row')
      .last()
      .getByLabel('Label', { exact: true })
      .fill('Retention fine print')
    await page
      .getByRole('button', { name: '+ Add note', exact: true })
      .click()
    await page.getByLabel('Note 1', { exact: true }).fill('Retention note')

    const mapAccount = page
      .locator('[data-account-id="cash-at-bank"][role="group"]')
      .first()
    await mapAccount.focus()
    await page.keyboard.press('ArrowRight')
    const incomeHeader = page
      .locator('[data-map-edit-key="incomeHeader"]')
      .first()
    await incomeHeader.focus()
    await page.keyboard.press('Shift+ArrowDown')

    await expect
      .poll(async () => {
        const state = await readCompoundState(page)
        return {
          accountMoved: (state?.accountDx ?? 0) > 0,
          accountShapeChanged: Boolean(state?.accountShape),
          finePrintRetained:
            state?.footnoteLabels.includes('Retention fine print') ?? false,
          incomeTextMoved: (state?.incomeTextDy ?? 0) > 0,
          noteRetained:
            state?.noteTexts.includes('Retention note') ?? false,
          positionRetained:
            state?.positionLabels.includes('Retention position') ?? false,
          subAccountRetained:
            state?.subAccountLabels.includes('Retention sub-account') ?? false,
          title: state?.title,
        }
      })
      .toEqual({
        accountMoved: true,
        accountShapeChanged: true,
        finePrintRetained: true,
        incomeTextMoved: true,
        noteRetained: true,
        positionRetained: true,
        subAccountRetained: true,
        title: 'Whitfield Compound Retention',
      })
    const beforePresent = await readCompoundState(page)

    await page.getByRole('button', { name: 'Present' }).click()
    await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
    await expect(page.locator('.map-page svg')).toBeVisible()
    await expect(page.locator('.map-page').filter({
      hasText: 'Whitfield Compound Retention',
    }).first()).toBeVisible()
    const duringPresent = await readCompoundState(page)
    expect(duringPresent).toEqual(beforePresent)
    await page.keyboard.press('Escape')
    await expect(page.locator('.app-shell')).not.toHaveClass(/is-presenting/)
    await expect(page.getByLabel('Title')).toHaveValue(
      'Whitfield Compound Retention',
    )
    const afterPresent = await readCompoundState(page)
    await evidence(page, testInfo, 'compound-present-escape-retained')

    expect(afterPresent).toEqual(beforePresent)
  })
})
