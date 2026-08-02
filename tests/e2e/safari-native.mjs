#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import process from 'node:process'

const ELEMENT_KEY = 'element-6066-11e4-a52e-4f735466cecf'
const KEY_NULL = '\uE000'
const KEY_ESCAPE = '\uE00C'
const KEY_META = '\uE03D'
const KEY_TAB = '\uE004'
const BOOK_KEY = 'money-map-generator:book'
const TITLE = 'Safari Native Retention'
const POSITION_LABEL = 'Safari native position'
const DEFAULT_TIMEOUT_MS = 15_000
const DOWNLOAD_TIMEOUT_MS = 45_000

const baseUrl = new URL(
  process.env.BASE_URL ?? 'http://127.0.0.1:4173/',
).href
const webdriverUrl = (
  process.env.WEBDRIVER_URL ?? 'http://127.0.0.1:4444'
).replace(/\/+$/, '')
const artifactDir = resolve(
  process.env.ARTIFACT_DIR ?? 'test-results/safari-native',
)
const downloadDir = resolve(
  process.env.DOWNLOAD_DIR ?? join(homedir(), 'Downloads'),
)

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds))

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function serializeError(error) {
  if (!(error instanceof Error)) return { message: String(error) }
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
    details: error.details,
  }
}

function elementId(element) {
  const id = element?.[ELEMENT_KEY] ?? element?.ELEMENT
  if (!id) throw new Error('WebDriver did not return an element reference')
  return encodeURIComponent(id)
}

class WebDriverClient {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.sessionId = null
    this.capabilities = null
  }

  async request(method, path, body) {
    const options = {
      method,
      headers: { Accept: 'application/json' },
    }
    if (body !== undefined) {
      options.headers['Content-Type'] = 'application/json; charset=utf-8'
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.endpoint}${path}`, options)
    const raw = await response.text()
    let payload = {}
    if (raw) {
      try {
        payload = JSON.parse(raw)
      } catch {
        throw new Error(
          `WebDriver returned non-JSON data for ${method} ${path}: ${raw}`,
        )
      }
    }

    const value = payload?.value
    if (
      !response.ok ||
      (value && typeof value === 'object' && value.error)
    ) {
      const code = value?.error ?? `HTTP ${response.status}`
      const message = value?.message ?? raw ?? response.statusText
      const error = new Error(`WebDriver ${code}: ${message}`)
      error.details = { method, path, status: response.status, value }
      throw error
    }
    return value
  }

  async start() {
    const value = await this.request('POST', '/session', {
      capabilities: {
        alwaysMatch: {
          browserName: 'safari',
          pageLoadStrategy: 'normal',
        },
      },
    })
    this.sessionId = value?.sessionId
    this.capabilities = value?.capabilities ?? {}
    assert(this.sessionId, 'safaridriver did not create a W3C session')
    return this.capabilities
  }

  async sessionCommand(method, suffix, body) {
    assert(this.sessionId, 'No active WebDriver session')
    return this.request(
      method,
      `/session/${encodeURIComponent(this.sessionId)}${suffix}`,
      body,
    )
  }

  async goto(url) {
    await this.sessionCommand('POST', '/url', { url })
  }

  async refresh() {
    await this.sessionCommand('POST', '/refresh', {})
  }

  async setWindowRect(rect) {
    return this.sessionCommand('POST', '/window/rect', rect)
  }

  async execute(script, args = []) {
    return this.sessionCommand('POST', '/execute/sync', { script, args })
  }

  async click(element) {
    await this.sessionCommand(
      'POST',
      `/element/${elementId(element)}/click`,
      {},
    )
  }

  async clear(element) {
    await this.sessionCommand(
      'POST',
      `/element/${elementId(element)}/clear`,
      {},
    )
  }

  async sendKeys(element, text) {
    await this.sessionCommand(
      'POST',
      `/element/${elementId(element)}/value`,
      { text, value: [...text] },
    )
  }

  async pressKey(value) {
    await this.sessionCommand('POST', '/actions', {
      actions: [
        {
          type: 'key',
          id: 'keyboard',
          actions: [
            { type: 'keyDown', value },
            { type: 'keyUp', value },
          ],
        },
      ],
    })
    await this.sessionCommand('DELETE', '/actions')
  }

  async screenshot() {
    return this.sessionCommand('GET', '/screenshot')
  }

  async quit() {
    if (!this.sessionId) return
    const sessionId = this.sessionId
    this.sessionId = null
    await this.request('DELETE', `/session/${encodeURIComponent(sessionId)}`)
  }
}

async function waitFor(
  description,
  probe,
  { timeoutMs = DEFAULT_TIMEOUT_MS, intervalMs = 125 } = {},
) {
  const deadline = Date.now() + timeoutMs
  let lastError = null
  while (Date.now() < deadline) {
    try {
      const value = await probe()
      if (value) return value
    } catch (error) {
      lastError = error
    }
    await sleep(intervalMs)
  }
  const suffix = lastError ? ` Last error: ${lastError.message}` : ''
  throw new Error(`Timed out waiting for ${description}.${suffix}`)
}

const BUTTON_BY_NAME_SCRIPT = `
const wanted = arguments[0]
const root = arguments[1] || document
const normalized = (value) => (value || '').replace(/\\s+/g, ' ').trim()
const accessibleName = (element) =>
  normalized(element.getAttribute('aria-label')) ||
  normalized(element.innerText || element.textContent)
return Array.from(
  root.querySelectorAll('button, [role="button"], [role="menuitem"]'),
).find(
  (element) =>
    accessibleName(element) === wanted &&
    !element.disabled &&
    element.getClientRects().length > 0,
) || null
`

const CONTROL_BY_LABEL_SCRIPT = `
const wanted = arguments[0]
const root = arguments[1] || document
const pickLast = arguments[2] === 'last'
const normalized = (value) => (value || '').replace(/\\s+/g, ' ').trim()
const controls = []
for (const label of root.querySelectorAll('label')) {
  if (normalized(label.textContent) !== wanted) continue
  const control = label.control || label.querySelector('input, textarea, select')
  if (control) controls.push(control)
}
for (const control of root.querySelectorAll('[aria-label]')) {
  if (normalized(control.getAttribute('aria-label')) === wanted) {
    controls.push(control)
  }
}
const unique = Array.from(new Set(controls)).filter((control) => !control.disabled)
return (pickLast ? unique.at(-1) : unique[0]) || null
`

const READ_STATE_SCRIPT = `
const selectedShapeName = arguments[0]
const normalized = (value) => (value || '').replace(/\\s+/g, ' ').trim()
const controlsForLabel = (root, wanted) => {
  const controls = []
  for (const label of root.querySelectorAll('label')) {
    if (normalized(label.textContent) !== wanted) continue
    const control = label.control || label.querySelector('input, textarea, select')
    if (control) controls.push(control)
  }
  for (const control of root.querySelectorAll('[aria-label]')) {
    if (normalized(control.getAttribute('aria-label')) === wanted) {
      controls.push(control)
    }
  }
  return Array.from(new Set(controls))
}
const title = controlsForLabel(document, 'Title')[0]
const shapeGroup = document.querySelector(
  '[role="group"][aria-label="Shape for Cash at Bank"]',
)
const shell = shapeGroup?.closest('.account-card-shell')
const selectedShape = shapeGroup
  ? Array.from(shapeGroup.querySelectorAll('button')).find(
      (button) =>
        normalized(button.getAttribute('aria-label') || button.textContent) ===
        selectedShapeName,
    )
  : null
const positionLabels = shell
  ? controlsForLabel(shell, 'Label').map((control) => control.value)
  : []
const stored = localStorage.getItem('${BOOK_KEY}') || ''
return {
  title: title?.value || null,
  positionLabels,
  selectedShapePressed: selectedShape?.getAttribute('aria-pressed') === 'true',
  presenting: document.querySelector('.app-shell')?.classList.contains('is-presenting') || false,
  storageHasTitle: stored.includes('${TITLE}'),
  storageHasPosition: stored.includes('${POSITION_LABEL}'),
}
`

async function findButton(driver, name, root = null) {
  return waitFor(`button or menu item "${name}"`, () =>
    driver.execute(BUTTON_BY_NAME_SCRIPT, [name, root]),
  )
}

async function clickButton(driver, name, root = null) {
  const button = await findButton(driver, name, root)
  await driver.click(button)
  return button
}

async function findControl(driver, label, root = null, pick = 'first') {
  return waitFor(`control labelled "${label}"`, () =>
    driver.execute(CONTROL_BY_LABEL_SCRIPT, [label, root, pick]),
  )
}

async function fillControl(driver, element, value) {
  await driver.sendKeys(element, `${KEY_META}a${KEY_NULL}`)
  await driver.sendKeys(element, value)
  await driver.pressKey(KEY_TAB)
  await waitFor(`control value "${value}"`, async () =>
    (await driver.execute('return arguments[0].value', [element])) === value,
  )
}

async function openFullForm(driver) {
  await clickButton(driver, 'Full form')
  await waitFor('full form editor', () =>
    driver.execute(
      `return Boolean(
        document.querySelector('.client-form')?.getClientRects().length
      )`,
    ),
  )
}

async function readState(driver, selectedShapeName) {
  return driver.execute(READ_STATE_SCRIPT, [selectedShapeName])
}

function assertRetainedState(state, phase) {
  assert(state?.title === TITLE, `${phase}: title was not retained`)
  assert(
    state?.positionLabels?.includes(POSITION_LABEL),
    `${phase}: position label was not retained`,
  )
  assert(
    state?.selectedShapePressed,
    `${phase}: selected account shape was not retained`,
  )
  assert(state?.storageHasTitle, `${phase}: persisted title is missing`)
  assert(
    state?.storageHasPosition,
    `${phase}: persisted position label is missing`,
  )
}

async function snapshotFiles(directory) {
  await mkdir(directory, { recursive: true })
  const snapshot = new Map()
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const path = join(directory, entry.name)
    try {
      const metadata = await stat(path)
      snapshot.set(path, {
        path,
        name: entry.name,
        size: metadata.size,
        mtimeMs: metadata.mtimeMs,
      })
    } catch {
      // The browser may still be renaming a temporary download.
    }
  }
  return snapshot
}

async function waitForStableDownload(directory, before, startedAt) {
  const previousSizes = new Map()
  return waitFor(
    'a stable Safari download',
    async () => {
      const current = await snapshotFiles(directory)
      const candidates = [...current.values()]
        .filter((file) => {
          if (/\.(download|part|crdownload)$/i.test(file.name)) return false
          const old = before.get(file.path)
          return (
            !old ||
            old.size !== file.size ||
            old.mtimeMs !== file.mtimeMs ||
            file.mtimeMs >= startedAt - 1_000
          )
        })
        .sort((left, right) => right.mtimeMs - left.mtimeMs)
      const candidate = candidates[0]
      if (!candidate || candidate.size <= 0) return null
      const previousSize = previousSizes.get(candidate.path)
      previousSizes.set(candidate.path, candidate.size)
      return previousSize === candidate.size ? candidate : null
    },
    { timeoutMs: DOWNLOAD_TIMEOUT_MS, intervalMs: 300 },
  )
}

async function run() {
  await mkdir(artifactDir, { recursive: true })
  await mkdir(downloadDir, { recursive: true })

  const receipt = {
    schemaVersion: 1,
    suite: 'safari-native',
    status: 'running',
    startedAt: new Date().toISOString(),
    environment: {
      baseUrl,
      webdriverUrl,
      artifactDir,
      downloadDir,
      node: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    capabilities: null,
    checks: [],
    screenshots: [],
    download: null,
    warnings: [],
    error: null,
  }
  const driver = new WebDriverClient(webdriverUrl)
  let failure = null

  const pass = (name, details = {}) => {
    const check = {
      name,
      status: 'passed',
      at: new Date().toISOString(),
      ...details,
    }
    receipt.checks.push(check)
    console.log(`[safari-native] PASS ${name}`)
  }

  const capture = async (name) => {
    const filename = `${name}.png`
    const data = await driver.screenshot()
    assert(typeof data === 'string' && data.length > 0, 'Empty screenshot')
    await writeFile(join(artifactDir, filename), Buffer.from(data, 'base64'))
    receipt.screenshots.push(filename)
  }

  const safeCapture = async (name) => {
    if (!driver.sessionId) return
    try {
      await capture(name)
    } catch (error) {
      receipt.warnings.push(`Failure screenshot unavailable: ${error.message}`)
    }
  }

  try {
    const capabilities = await driver.start()
    receipt.capabilities = capabilities
    assert(
      String(capabilities.browserName ?? '').toLowerCase() === 'safari',
      `Expected real Safari, got ${capabilities.browserName ?? 'unknown'}`,
    )
    pass('real Safari WebDriver session', {
      browserName: capabilities.browserName,
      browserVersion: capabilities.browserVersion,
      platformName: capabilities.platformName,
    })

    try {
      const rect = await driver.setWindowRect({ width: 1440, height: 900 })
      pass('desktop window configured', { rect })
    } catch (error) {
      receipt.warnings.push(`Window sizing was not supported: ${error.message}`)
    }

    await driver.goto(baseUrl)
    await waitFor('Money Map application load', () =>
      driver.execute(
        `return Boolean(document.querySelector('.app-shell')) &&
          document.body.innerText.includes('Money Map')`,
      ),
    )
    pass('application load')
    await capture('01-app-loaded')

    await openFullForm(driver)
    const title = await findControl(driver, 'Title')
    await fillControl(driver, title, TITLE)
    pass('title edit')

    const shapeGroup = await waitFor('Cash at Bank shape group', () =>
      driver.execute(`return document.querySelector(
        '[role="group"][aria-label="Shape for Cash at Bank"]'
      )`),
    )
    const shapeChoice = await waitFor('an unselected Cash at Bank shape', () =>
      driver.execute(
        `
        const group = arguments[0]
        const buttons = Array.from(group.querySelectorAll('button'))
        return buttons.find(
          (button) =>
            button.getAttribute('aria-label') === 'Card shape' &&
            button.getAttribute('aria-pressed') !== 'true',
        ) || buttons.find(
          (button) => button.getAttribute('aria-pressed') !== 'true',
        ) || null
        `,
        [shapeGroup],
      ),
    )
    const selectedShapeName = await driver.execute(
      `return arguments[0].getAttribute('aria-label') ||
        arguments[0].textContent.trim()`,
      [shapeChoice],
    )
    await driver.click(shapeChoice)
    await waitFor(`${selectedShapeName} selection`, async () => {
      const selected = await driver.execute(
        `return Array.from(arguments[0].querySelectorAll('button')).find(
          (button) =>
            (button.getAttribute('aria-label') || button.textContent.trim()) ===
            arguments[1]
        )?.getAttribute('aria-pressed') === 'true'`,
        [shapeGroup, selectedShapeName],
      )
      return selected
    })
    pass('account shape change', { selectedShapeName })

    const accountShell = await waitFor('Cash at Bank account shell', () =>
      driver.execute(
        `return arguments[0].closest('.account-card-shell')`,
        [shapeGroup],
      ),
    )
    const accountCard = await driver.execute(
      `return arguments[0].querySelector('.account-card')`,
      [accountShell],
    )
    assert(accountCard, 'Cash at Bank account card is missing')
    const accountOpen = await driver.execute(
      'return Boolean(arguments[0].open)',
      [accountCard],
    )
    if (!accountOpen) {
      const summary = await driver.execute(
        `return arguments[0].querySelector('summary')`,
        [accountCard],
      )
      assert(summary, 'Cash at Bank account summary is missing')
      await driver.click(summary)
    }
    await waitFor('expanded Cash at Bank account', () =>
      driver.execute('return Boolean(arguments[0].open)', [accountCard]),
    )
    await clickButton(driver, '+ Add position', accountCard)
    const positionLabel = await findControl(
      driver,
      'Label',
      accountShell,
      'last',
    )
    await fillControl(driver, positionLabel, POSITION_LABEL)
    await waitFor('edited state persistence', async () => {
      const state = await readState(driver, selectedShapeName)
      return (
        state.storageHasTitle &&
        state.storageHasPosition &&
        state.selectedShapePressed
      )
    })
    pass('position addition and persistence')
    await capture('02-compound-edits')

    const beforePresent = await readState(driver, selectedShapeName)
    assertRetainedState(beforePresent, 'before Present')
    await clickButton(driver, 'Present')
    await waitFor('Present mode', () =>
      driver.execute(
        `return document.querySelector('.app-shell')?.classList.contains(
          'is-presenting'
        )`,
      ),
    )
    const duringPresent = await readState(driver, selectedShapeName)
    assertRetainedState(duringPresent, 'during Present')
    assert(duringPresent.presenting, 'Present mode was not active')
    pass('Present state retention')
    await capture('03-present')

    await driver.pressKey(KEY_ESCAPE)
    await waitFor('Present mode exit', async () => {
      const presenting = await driver.execute(
        `return document.querySelector('.app-shell')?.classList.contains(
          'is-presenting'
        )`,
      )
      return !presenting
    })
    const afterEscape = await readState(driver, selectedShapeName)
    assertRetainedState(afterEscape, 'after Escape')
    assert(!afterEscape.presenting, 'Escape did not exit Present mode')
    pass('Escape retention')
    await capture('04-after-escape')

    const beforeDownload = await snapshotFiles(downloadDir)
    const downloadStartedAt = Date.now()
    await clickButton(driver, 'Book menu')
    await clickButton(driver, 'Download book backup')
    const downloaded = await waitForStableDownload(
      downloadDir,
      beforeDownload,
      downloadStartedAt,
    )
    const bytes = await readFile(downloaded.path)
    assert(bytes.length > 0, 'Save Book produced an empty file')
    let parsedBook
    try {
      parsedBook = JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, ''))
    } catch (error) {
      throw new Error(`Save Book download is not valid JSON: ${error.message}`)
    }
    assert(
      parsedBook && typeof parsedBook === 'object' && !Array.isArray(parsedBook),
      'Save Book JSON must be a top-level object',
    )
    const serializedBook = JSON.stringify(parsedBook)
    assert(
      serializedBook.includes(TITLE),
      'Downloaded book JSON is missing the edited title',
    )
    assert(
      serializedBook.includes(POSITION_LABEL),
      'Downloaded book JSON is missing the added position',
    )
    const evidenceBook = join(artifactDir, 'saved-book.json')
    await writeFile(evidenceBook, bytes)
    receipt.download = {
      sourcePath: downloaded.path,
      evidenceFile: basename(evidenceBook),
      filename: downloaded.name,
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      jsonValid: true,
      containsEditedTitle: true,
      containsAddedPosition: true,
    }
    pass('Save Book real download', receipt.download)
    await capture('05-after-download')

    await driver.refresh()
    await waitFor('application reload', () =>
      driver.execute(
        `return Boolean(document.querySelector('.app-shell')) &&
          document.body.innerText.includes('Money Map')`,
      ),
    )
    await openFullForm(driver)
    const afterReload = await readState(driver, selectedShapeName)
    assertRetainedState(afterReload, 'after reload')
    pass('reload persistence')

    await driver.goto('about:blank')
    await driver.goto(baseUrl)
    await waitFor('application reopen', () =>
      driver.execute(
        `return Boolean(document.querySelector('.app-shell')) &&
          document.body.innerText.includes('Money Map')`,
      ),
    )
    await openFullForm(driver)
    const afterReopen = await readState(driver, selectedShapeName)
    assertRetainedState(afterReopen, 'after reopen')
    pass('reopen persistence')
    await capture('06-reopened')

    await driver.execute(`
      window.__safariNativeOriginalPrint = window.print
      window.__safariNativePrintCalls = 0
      window.print = () => { window.__safariNativePrintCalls += 1 }
    `)
    await clickButton(driver, 'Print')
    const printCalls = await waitFor('Print invocation', () =>
      driver.execute('return window.__safariNativePrintCalls || 0'),
    )
    assert(printCalls === 1, `Expected one Print invocation, got ${printCalls}`)
    await driver.execute(`
      window.print = window.__safariNativeOriginalPrint
      delete window.__safariNativeOriginalPrint
    `)
    pass('Print invocation without OS dialog', { printCalls })

    await driver.execute(`
      window.__safariNativeOriginalCreateObjectURL = URL.createObjectURL
      URL.createObjectURL = () => {
        throw new Error('safari-native forced blob failure')
      }
    `)
    await clickButton(driver, 'Book menu')
    await clickButton(driver, 'Download book backup')
    const failureDialog = await waitFor('Could not save book dialog', () =>
      driver.execute(`
        return Array.from(document.querySelectorAll('dialog, [role="dialog"]'))
          .find((dialog) =>
            (dialog.open || dialog.getAttribute('aria-modal') === 'true') &&
            dialog.textContent.includes('Could not save book')
          ) || null
      `),
    )
    pass('Save Book failure dialog')
    await capture('07-save-failure-dialog')
    const dismiss = await driver.execute(
      `return arguments[0].querySelector('button')`,
      [failureDialog],
    )
    if (dismiss) await driver.click(dismiss)
    await driver.execute(`
      URL.createObjectURL = window.__safariNativeOriginalCreateObjectURL
      delete window.__safariNativeOriginalCreateObjectURL
    `)

    receipt.status = 'passed'
  } catch (error) {
    failure = error
    receipt.status = 'failed'
    receipt.error = serializeError(error)
    await safeCapture('99-failure')
  } finally {
    try {
      await driver.quit()
    } catch (error) {
      receipt.warnings.push(`WebDriver teardown failed: ${error.message}`)
    }
    receipt.finishedAt = new Date().toISOString()
    receipt.durationMs =
      Date.parse(receipt.finishedAt) - Date.parse(receipt.startedAt)
    await writeFile(
      join(artifactDir, 'receipt.json'),
      `${JSON.stringify(receipt, null, 2)}\n`,
    )
  }

  if (failure) throw failure
  console.log(
    `[safari-native] PASS receipt=${join(artifactDir, 'receipt.json')}`,
  )
}

run().catch((error) => {
  console.error(`[safari-native] FAIL ${error.stack ?? error}`)
  process.exitCode = 1
})
