// gate11 — interactive post-Wave-1 gate vs demo-gate on 4281. TIMEOUT-BUDGET 4000ms.
import { chromium } from '@playwright/test'

const SHOT = 'C:/Users/Cyril/AppData/Local/Temp/claude/C--Users-Cyril/762307f4-c05a-435c-8220-82dc9ea5a536/scratchpad'
const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.setDefaultTimeout(4000)
await page.goto('http://127.0.0.1:4281/')
await page.getByText('Money Map', { exact: true }).first().waitFor()
await page.waitForTimeout(800)
const gotIt = page.getByRole('button', { name: 'Got it' })
if (await gotIt.count()) await gotIt.click()

const zoomLevel = () => page.evaluate(() => document.querySelector('[aria-label="Zoom level"]')?.textContent?.trim())

// 1. Undo keeps Data panel open
try {
  await page.getByRole('button', { name: 'Data', exact: true }).click()
  await page.locator('.client-form').waitFor()
  const acct = page.locator('g[aria-label="Accounts"] > g').first()
  const box = await acct.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 40, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.waitForTimeout(300)
  check('undo-keeps-panel', await page.locator('.client-form').isVisible())
  await page.keyboard.press('Escape') // close panel for later checks
} catch (e) { check('undo-keeps-panel', false, e.message) }

// 2. Present zoom restore on Esc exit
try {
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await page.getByRole('button', { name: 'Zoom in' }).click()
  const before = await zoomLevel()
  await page.getByRole('button', { name: 'Present' }).click()
  await page.waitForTimeout(500)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  const after = await zoomLevel()
  check('present-zoom-restore', before === after && before !== undefined, `before=${before} after=${after}`)
  await page.getByRole('button', { name: 'Fit' }).click()
} catch (e) { check('present-zoom-restore', false, e.message) }

// 3+4+5a. Chip: dblclick edit — typing visible+growing, value saves, font pill works
try {
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  // 3. typing visible + growing on a single-line editor (account value)
  await page.locator('[data-map-edit-key^="accountValue:"]').first().dblclick()
  const lineEditor = page.locator('.map-text-editor').first()
  await lineEditor.waitFor()
  const lw0 = (await lineEditor.boundingBox()).width
  await page.keyboard.press('Control+a')
  await page.keyboard.type('123456789012345', { delay: 15 })
  const typed = await page.locator('.map-text-editor input, .map-text-editor textarea').first().inputValue()
  const lw1 = (await lineEditor.boundingBox()).width
  check('typing-visible-growing', typed.includes('123456789012345') && lw1 > lw0, `w ${lw0}->${lw1} typed=${typed}`)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  // 4+5a. chip: value saves + font pill
  const chipText = page.locator('g[data-map-target="asNeededChip"] text').first()
  const fsBefore = await chipText.getAttribute('font-size')
  await page.locator('[data-map-edit-hit="asNeededAmount"]').dblclick()
  await page.locator('.map-text-editor').first().waitFor()
  await page.keyboard.press('Control+a')
  await page.keyboard.type('4321')
  // font pill A+ while editor open
  const plus = page.getByRole('button', { name: 'Increase font size' }).first()
  let pillOk = false
  if (await plus.count()) { await plus.click(); await plus.click(); pillOk = true }
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const saved = await page.evaluate(() => document.body.textContent.includes('4,321'))
  check('chip-value-saves', saved)
  const fsAfter = await page.locator('g[data-map-target="asNeededChip"] text').first().getAttribute('font-size')
  check('chip-font-pill', pillOk && Number(fsAfter) > Number(fsBefore ?? 22), `fs ${fsBefore}->${fsAfter}`)
  await page.keyboard.press('Escape')
} catch (e) { check('chip-edit-suite', false, e.message) }

// 5b+6. Income header: size-only pill has "Text size" label and A+ works
try {
  const header = page.locator('g[aria-label="Income sources"] text').first()
  await header.dblclick()
  await page.waitForTimeout(300)
  const pill = page.locator('.map-text-size-controls')
  await pill.waitFor()
  const label = await pill.textContent()
  check('size-only-label', label.includes('Text size'), label.slice(0, 40))
  await page.screenshot({ path: SHOT + '/gate11-size-pill.png' })
  const fsBefore = await header.evaluate((el) => el.getAttribute('font-size'))
  await pill.getByRole('button', { name: 'Increase font size' }).click()
  await page.waitForTimeout(200)
  const fsAfter = await page.locator('g[aria-label="Income sources"] text').first().evaluate((el) => el.getAttribute('font-size'))
  check('income-header-pill', Number(fsAfter) > Number(fsBefore), `fs ${fsBefore}->${fsAfter}`)
  await page.keyboard.press('Escape')
} catch (e) { check('income-header-pill-suite', false, e.message) }

// 7. Inspector: no clip at 1440x900 + status-stack overlap
try {
  await page.keyboard.press('Escape')
  const acct = page.locator('g[aria-label="Accounts"] > g').first()
  await acct.click()
  const inspector = page.locator('.map-inspector')
  await inspector.waitFor()
  const m = await inspector.evaluate((el) => ({
    clipX: el.scrollWidth - el.clientWidth, clipY: el.scrollHeight - el.clientHeight,
    rect: el.getBoundingClientRect().toJSON(),
  }))
  const stack = await page.evaluate(() => document.querySelector('.app-status-stack')?.getBoundingClientRect().toJSON() ?? null)
  const overlap = stack && !(stack.top >= m.rect.bottom || stack.bottom <= m.rect.top || stack.left >= m.rect.right || stack.right <= m.rect.left)
  check('inspector-no-clip', m.clipX <= 1 && m.clipY <= 1, JSON.stringify(m))
  check('inspector-stack-no-overlap', !overlap, JSON.stringify(stack))
  const delBtn = page.getByRole('button', { name: 'Delete account' })
  check('delete-account-visible', await delBtn.isVisible())
  await page.screenshot({ path: SHOT + '/gate11-inspector.png' })
  await page.keyboard.press('Escape')
} catch (e) { check('inspector-suite', false, e.message) }

// 8. Flow labels layer painted after accounts (z-order)
try {
  const order = await page.evaluate(() => {
    const svg = document.querySelector('svg[aria-label], svg')
    const groups = [...document.querySelectorAll('g[aria-label="Accounts"], g[aria-label="Flow labels"]')].map((g) => g.getAttribute('aria-label'))
    return groups.join('|')
  })
  check('flow-labels-after-accounts', /Accounts\|Flow labels/.test(order), order)
  await page.screenshot({ path: SHOT + '/gate11-map.png', fullPage: false })
} catch (e) { check('flow-labels-after-accounts', false, e.message) }

// 9. Esc cancels armed note placement first, Data panel survives
try {
  await page.getByRole('button', { name: 'Data', exact: true }).click()
  await page.locator('.client-form').waitFor()
  const addNote = page.getByRole('button', { name: 'Add text note' })
  await addNote.click()
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  const armed = await addNote.getAttribute('aria-pressed')
  check('esc-cancels-placement-first', armed !== 'true' && await page.locator('.client-form').isVisible(), `aria-pressed=${armed}`)
} catch (e) { check('esc-cancels-placement-first', false, e.message) }

// ---- Wave 2 checks ----

// 10. dblclick account body opens Data panel
try {
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  // dblclick the cylinder edge, not the center — text runs own their own dblclick
  const acctBox = await page.locator('g[aria-label="Accounts"] > g').first().boundingBox()
  await page.mouse.dblclick(acctBox.x + acctBox.width * 0.12, acctBox.y + acctBox.height * 0.75)
  await page.locator('.client-form').waitFor()
  check('dblclick-opens-data', true)
  await page.keyboard.press('Escape')
} catch (e) { check('dblclick-opens-data', false, e.message) }

// 11. + Flow button exists, disabled without a two-item selection
try {
  const flowBtn = page.getByRole('button', { name: '+ Flow' })
  check('flow-button-disabled-idle', await flowBtn.isDisabled(), await flowBtn.getAttribute('title'))
} catch (e) { check('flow-button-disabled-idle', false, e.message) }

// 12. note spawns bottom-center-ish
try {
  await page.getByRole('button', { name: '+ Add', exact: false }).first().click().catch(() => page.locator('button:has-text("Add")').first().click())
  await page.waitForTimeout(300)
  await page.locator('aside, .editor-rail').getByRole('button', { name: 'Add text note' }).first().click()
  await page.locator('.map-text-editor').waitFor()
  await page.keyboard.type('Gate note')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  const box = await page.locator('g.map-note.map-draggable').first().boundingBox()
  const vp = 900
  check('note-spawn-bottom', box !== null && box.y > vp * 0.5, JSON.stringify(box))
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.keyboard.press('Escape')
} catch (e) { check('note-spawn-bottom', false, e.message) }

// 13. zoom floor 25
try {
  const out = page.getByRole('button', { name: 'Zoom out' })
  for (let i = 0; i < 12 && !(await out.isDisabled()); i++) await out.click()
  const level = await zoomLevel()
  check('zoom-floor-25', (await out.isDisabled()) && level === '25%', `level=${level}`)
  await page.getByRole('button', { name: 'Fit' }).click()
} catch (e) { check('zoom-floor-25', false, e.message) }

// 14. live thousands separators in a money field
try {
  await page.getByRole('button', { name: 'Data', exact: true }).click()
  await page.locator('.client-form').waitFor()
  const moneyInput = page.locator('.client-form input[inputmode="decimal"], .client-form input[inputmode="numeric"]').first()
  await moneyInput.click()
  await page.keyboard.press('Control+a')
  await page.keyboard.type('1234567', { delay: 20 })
  const val = await moneyInput.inputValue()
  check('money-separators', val.includes('1,234,567'), `val=${val}`)
  await page.keyboard.press('Control+a')
  await page.keyboard.press('Delete')
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.keyboard.press('Escape')
} catch (e) { check('money-separators', false, e.message) }

// 15. Contents grouping headers
try {
  await page.getByRole('button', { name: 'Contents', exact: true }).click()
  await page.waitForTimeout(300)
  const heads = await page.evaluate(() =>
    [...document.querySelectorAll('.editor-panel-section > h3')].map((h) => h.textContent))
  check('contents-groups', heads.includes('Income') && heads.includes('Accounts'), heads.join(','))
  await page.keyboard.press('Escape')
} catch (e) { check('contents-groups', false, e.message) }

// 16-18. custom arrow: nudges gone, color popover, thickness
try {
  await page.keyboard.press('Escape')
  // click a custom arrow on-stroke
  const pt = await page.evaluate(() => {
    const g = [...document.querySelectorAll('g[aria-label^="Adjust flow from"]')][0]
    const path = g?.querySelector('path')
    if (!path) return null
    const p = path.getPointAtLength(path.getTotalLength() / 2)
    const m = path.getScreenCTM()
    return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f }
  })
  await page.mouse.click(pt.x, pt.y)
  await page.locator('.map-inspector').waitFor()
  const barText = await page.locator('.map-inspector').textContent()
  check('nudge-groups-gone', !barText.includes('Start point') && !barText.includes('End point'), barText.slice(0, 80))
  // color popover
  await page.getByRole('button', { name: 'Flow color' }).click()
  await page.waitForTimeout(200)
  const swatches = page.locator('.map-inspector-swatches button')
  const openCount = await swatches.count()
  const popoverVisible = openCount > 0 && await swatches.first().isVisible()
  let colorChanged = false
  if (popoverVisible) {
    await page.getByRole('button', { name: 'Amber flow color' }).click().catch(() =>
      swatches.nth(2).click())
    await page.waitForTimeout(200)
    colorChanged = true
  }
  check('color-popover', popoverVisible && colorChanged, `swatches=${openCount}`)
  await page.screenshot({ path: SHOT + '/gate11-insplite.png' })
  // thickness
  const swBefore = await page.evaluate(() => {
    const g = [...document.querySelectorAll('g[aria-label^="Adjust flow from"]')][0]
    return g?.querySelector('path')?.getAttribute('stroke-width')
  })
  await page.getByRole('button', { name: 'Increase flow thickness' }).click()
  await page.waitForTimeout(200)
  const swAfter = await page.evaluate(() => {
    const g = [...document.querySelectorAll('g[aria-label^="Adjust flow from"]')][0]
    return g?.querySelector('path')?.getAttribute('stroke-width')
  })
  check('arrow-thickness', Number(swAfter ?? 0) > Number(swBefore ?? 2), `sw ${swBefore}->${swAfter}`)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.keyboard.press('Escape')
} catch (e) { check('arrow-inspector-suite', false, e.message) }

// 19. income row rename on map
try {
  await page.keyboard.press('Escape')
  const nameRun = page.locator('[data-map-edit-key^="incomeRowLabel:"]').first()
  await nameRun.dblclick()
  await page.locator('.map-text-editor').first().waitFor()
  await page.keyboard.press('Control+a')
  await page.keyboard.type('Consulting Income')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const renamed = await page.evaluate(() => document.body.textContent.includes('Consulting Income'))
  check('income-row-rename', renamed)
  await page.getByRole('button', { name: 'Undo' }).click()
} catch (e) { check('income-row-rename', false, e.message) }

// ---- s50 checks (P1-P4 merge) ----

// 20. Present exit restores zoom AND scroll (map not huddled in a corner)
try {
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Fit' }).click()
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await page.waitForTimeout(300)
  const ref = () => page.locator('g[aria-label="Accounts"]').first().boundingBox()
  const before = await ref()
  const zBefore = await zoomLevel()
  await page.getByRole('button', { name: 'Present' }).click()
  await page.waitForTimeout(500)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  const after = await ref()
  const zAfter = await zoomLevel()
  const posOk = Math.abs(after.x - before.x) < 5 && Math.abs(after.y - before.y) < 5
  check('present-restores-zoom-scroll', zBefore === zAfter && posOk,
    `zoom ${zBefore}->${zAfter} pos (${before.x.toFixed(0)},${before.y.toFixed(0)})->(${after.x.toFixed(0)},${after.y.toFixed(0)})`)
  await page.screenshot({ path: SHOT + '/gate11-present-restore.png' })
  await page.getByRole('button', { name: 'Fit' }).click()
} catch (e) { check('present-restores-zoom-scroll', false, e.message) }

// 21. ctrl+wheel zooms during Present, then drag-pan works
try {
  await page.getByRole('button', { name: 'Present' }).click()
  await page.waitForTimeout(500)
  const ref = () => page.locator('g[aria-label="Accounts"]').first().boundingBox()
  const b0 = await ref()
  await page.mouse.move(720, 450)
  await page.keyboard.down('Control')
  await page.mouse.wheel(0, -240)
  await page.keyboard.up('Control')
  await page.waitForTimeout(400)
  const b1 = await ref()
  const zoomed = b1.width > b0.width * 1.02
  // drag-pan on empty background
  await page.mouse.move(720, 850)
  await page.mouse.down()
  await page.mouse.move(820, 750, { steps: 6 })
  await page.mouse.up()
  await page.waitForTimeout(300)
  const b2 = await ref()
  const panned = Math.abs(b2.x - b1.x) > 20 || Math.abs(b2.y - b1.y) > 20
  check('present-ctrlwheel-then-pan', zoomed && panned,
    `w ${b0.width.toFixed(0)}->${b1.width.toFixed(0)} pan (${b1.x.toFixed(0)},${b1.y.toFixed(0)})->(${b2.x.toFixed(0)},${b2.y.toFixed(0)})`)
  await page.screenshot({ path: SHOT + '/gate11-present-wheel.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Fit' }).click()
} catch (e) { check('present-ctrlwheel-then-pan', false, e.message); await page.keyboard.press('Escape') }

// 22. Rotate ± buttons step 5°
try {
  await page.keyboard.press('Escape')
  const acct = page.locator('g[aria-label="Accounts"] > g').first()
  const box = await acct.boundingBox()
  await page.mouse.click(box.x + box.width * 0.12, box.y + box.height * 0.75)
  await page.locator('.map-inspector').waitFor()
  await page.getByRole('button', { name: 'Rotate clockwise' }).click()
  await page.waitForTimeout(300)
  const rotated = await page.evaluate(() =>
    [...document.querySelectorAll('[transform]')].some((el) => /rotate\(5[ .)]/.test(el.getAttribute('transform'))))
  check('rotate-step-5', rotated, `rotate(5 found=${rotated}`)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.keyboard.press('Escape')
} catch (e) { check('rotate-step-5', false, e.message) }

// 23. lease live-region div in DOM
try {
  const live = await page.evaluate(() => {
    const el = document.querySelector('.visually-hidden[role="status"]')
    return el ? el.textContent : null
  })
  check('lease-live-region', live !== null, `text=${live}`)
} catch (e) { check('lease-live-region', false, e.message) }

// 24. generated arrow: Thickness group + Increase bumps stroke-width
try {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  const pt = await page.evaluate(() => {
    const grp = document.querySelector('g[aria-label="Money flow"]')
    const path = grp?.querySelector('path')
    if (!path) return null
    const p = path.getPointAtLength(path.getTotalLength() / 2)
    const m = path.getScreenCTM()
    return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f }
  })
  await page.mouse.click(pt.x, pt.y)
  await page.locator('.map-inspector').waitFor()
  const swBefore = await page.evaluate(() =>
    document.querySelector('g[aria-label="Money flow"] path')?.getAttribute('stroke-width'))
  const inc = page.getByRole('button', { name: 'Increase flow thickness' })
  const hasThickness = await inc.count()
  if (hasThickness) { await inc.click(); await page.waitForTimeout(300) }
  const swAfter = await page.evaluate(() =>
    document.querySelector('g[aria-label="Money flow"] path')?.getAttribute('stroke-width'))
  check('generated-arrow-thickness', hasThickness > 0 && Number(swAfter ?? 0) > Number(swBefore ?? 2),
    `sw ${swBefore}->${swAfter}`)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.keyboard.press('Escape')
} catch (e) { check('generated-arrow-thickness', false, e.message) }

console.log(results.map((r) => `${r.ok ? 'PASS' : 'FAIL'} ${r.name} ${r.detail}`.trim()).join('\n'))
await browser.close()
process.exit(results.every((r) => r.ok) ? 0 : 1)
