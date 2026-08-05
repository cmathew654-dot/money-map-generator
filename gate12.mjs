// gate12 — s51 interactive gate. Ports all 27 gate11 checks, adds Group A
// (state-context selection, from the proven L-PIN matrix) and Group B
// (s51 features under construction, probe-guarded).
//
// Run against a build of THIS worktree on 4298:
//   pnpm exec vite build --outDir gate-dist
//   pnpm exec vite preview --outDir gate-dist --host 127.0.0.1 --port 4298 --strictPort
//   node gate12.mjs
//
// TIMEOUT-BUDGET: default action timeout 4000ms, feature probes 2000ms, whole run < 8 min.
//
// Driver traps carried over from gate11 (do not "simplify" these):
//   * g[aria-label="Accounts"] resolves TWO nodes — the live map and a hidden
//     print copy. Always .first() before descending.
//   * rotate transforms land on inner elements, not the group you clicked —
//     scan [transform] DOM-wide for rotate(N).
//   * account CENTRE hits text runs (they own dblclick); click the body edge
//     (~12% x, ~75% y) or .map-account-body-hit for plain selection.
//
// Status semantics:
//   PASS    — asserted behaviour observed.
//   FAIL    — asserted behaviour contradicted. Exit code 1 iff any FAIL.
//   PENDING — Group B only: the feature is not built yet (probe missed, or the
//             known pre-s51 baseline was observed). The final audit flips these
//             to PASS simply by the features existing. Never a pass-by-default
//             for a broken feature: once the s51 signature is present, a wrong
//             value is a FAIL.
import { chromium } from '@playwright/test'

const SHOT = 'C:/Users/Cyril/AppData/Local/Temp/claude/C--Users-Cyril/433c551c-834a-44fd-8862-c21fa4f1bd37/scratchpad'
const results = []
const check = (name, ok, detail = '') => results.push({ name, status: ok ? 'PASS' : 'FAIL', detail })
const pending = (name, detail = '') => results.push({ name, status: 'PENDING', detail })
// Group B tri-state: s51 signature -> PASS, known pre-s51 baseline -> PENDING, neither -> FAIL.
const tri = (name, pass, baseline, detail = '') =>
  results.push({ name, status: pass ? 'PASS' : baseline ? 'PENDING' : 'FAIL', detail })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.setDefaultTimeout(4000)
await page.goto('http://127.0.0.1:4298/')
await page.getByText('Money Map', { exact: true }).first().waitFor()
await page.waitForTimeout(800)
const gotIt = page.getByRole('button', { name: 'Got it' })
if (await gotIt.count()) await gotIt.click()

const zoomLevel = () => page.evaluate(() => document.querySelector('[aria-label="Zoom level"]')?.textContent?.trim())
// TRAP: .first() — the hidden print copy is the second match.
const accounts = page.locator('g[aria-label="Accounts"]').first().locator('> g')
const flowBtn = page.getByRole('button', { name: '+ Flow' })
const flowEnabled = async () => !(await flowBtn.isDisabled())
const selectedAccounts = () => page.evaluate(() => {
  const grp = document.querySelector('g[aria-label="Accounts"]')
  return grp ? grp.querySelectorAll(':scope > g[data-map-selected="true"]').length : -1
})
const reset = async () => {
  await page.keyboard.press('Escape')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
}
// Feature probe for Group B: does this element exist within 2s?
const probe = async (selector, ms = 2000) => {
  try {
    await page.locator(selector).first().waitFor({ state: 'attached', timeout: ms })
    return true
  } catch {
    return false
  }
}
// Accounts are addressed by id, captured ONCE.
// TRAP: selecting an account moves its <g> to the END of the Accounts group so
// it paints on top — nth(1) is a DIFFERENT account after the first click. Any
// index-based account driver silently drifts onto the wrong shape mid-sequence.
const ACCT = await accounts.evaluateAll((els) => els.map((el) => el.getAttribute('data-account-id')))
// TRAP: raw coordinate math off the group bbox is unreliable too — account
// bboxes overlap, so 12%/75% of account A can land on account B. Drive the
// account's own .map-account-body-hit rect (convention from map-keyboard.spec.ts).
const bodyHit = (id) => page.locator(`[data-account-id="${id}"] .map-account-body-hit:not(ellipse)`).first()
const bodyHitPoint = (box) => ({ x: Math.min(32, box.width / 4), y: Math.max(16, box.height - 24) })
const clickAccountBody = async (id, modifiers = []) => {
  const hit = bodyHit(id)
  const box = await hit.boundingBox()
  await hit.click({ modifiers, position: bodyHitPoint(box) })
  await page.waitForTimeout(300)
}
const rotationsInDom = (deg) => page.evaluate((d) => {
  // TRAP: the rotate transform lands on an inner element, not the clicked group.
  const re = new RegExp(`rotate\\(-?${d}[ .)]`)
  return [...document.querySelectorAll('[transform]')].some((el) => re.test(el.getAttribute('transform')))
}, deg)

// ============================================================
// LEGACY — the 27 gate11 checks, carried forward in gate11 order.
// ============================================================

// 1. Undo keeps Data panel open
try {
  await page.getByRole('button', { name: 'Data', exact: true }).click()
  await page.locator('.client-form').waitFor()
  const acct = accounts.first()
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
  await reset()
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
  const chipText = page.locator('g[data-map-target="asNeededChip"] text').first()
  const fsBefore = await chipText.getAttribute('font-size')
  await page.locator('[data-map-edit-hit="asNeededAmount"]').dblclick()
  await page.locator('.map-text-editor').first().waitFor()
  await page.keyboard.press('Control+a')
  await page.keyboard.type('4321')
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
  await page.screenshot({ path: SHOT + '/gate12-size-pill.png' })
  const fsBefore = await header.evaluate((el) => el.getAttribute('font-size'))
  await pill.getByRole('button', { name: 'Increase font size' }).click()
  await page.waitForTimeout(200)
  const fsAfter = await page.locator('g[aria-label="Income sources"] text').first().evaluate((el) => el.getAttribute('font-size'))
  check('income-header-pill', Number(fsAfter) > Number(fsBefore), `fs ${fsBefore}->${fsAfter}`)
  await page.keyboard.press('Escape')
} catch (e) { check('income-header-pill-suite', false, e.message) }

// 7. Inspector: no clip at 1440x900 + status-stack overlap + delete affordance
try {
  await page.keyboard.press('Escape')
  await accounts.first().click()
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
  await page.screenshot({ path: SHOT + '/gate12-inspector.png' })
  await page.keyboard.press('Escape')
} catch (e) { check('inspector-suite', false, e.message) }

// 8. Flow labels layer painted after accounts (z-order)
try {
  const order = await page.evaluate(() =>
    [...document.querySelectorAll('g[aria-label="Accounts"], g[aria-label="Flow labels"]')]
      .map((g) => g.getAttribute('aria-label')).join('|'))
  check('flow-labels-after-accounts', /Accounts\|Flow labels/.test(order), order)
  await page.screenshot({ path: SHOT + '/gate12-map.png', fullPage: false })
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

// 10. dblclick account body opens Data panel
try {
  await reset()
  // dblclick the cylinder edge, not the center — text runs own their own dblclick
  const acctBox = await accounts.first().boundingBox()
  await page.mouse.dblclick(acctBox.x + acctBox.width * 0.12, acctBox.y + acctBox.height * 0.75)
  await page.locator('.client-form').waitFor()
  check('dblclick-opens-data', true)
  await page.keyboard.press('Escape')
} catch (e) { check('dblclick-opens-data', false, e.message) }

// 11. + Flow button exists, disabled without a two-item selection
try {
  await reset()
  check('flow-button-disabled-idle', await flowBtn.isDisabled(), await flowBtn.getAttribute('title'))
} catch (e) { check('flow-button-disabled-idle', false, e.message) }

// 12. note spawns bottom-center-ish
// TRAP: two buttons answer to "Add text note". The map-chrome one only ARMS
// placement (aria-pressed) and waits for a map click; the +Add panel one
// inserts a note at its default spawn point, which is what this check measures.
try {
  // TRAP: the toolbar button reads "+Add" but its '+' is aria-hidden — the
  // accessible name is plain 'Add'. (gate11 asked for '+ Add' and only worked
  // because its .catch() fell back to a text selector.)
  await page.getByRole('button', { name: 'Add', exact: true }).first().click()
  await page.waitForTimeout(300)
  await page.locator('aside, .editor-rail').getByRole('button', { name: 'Add text note' }).first().click()
  await page.locator('.map-text-editor').waitFor()
  await page.keyboard.type('Gate note')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  const box = await page.locator('g.map-note.map-draggable').first().boundingBox()
  check('note-spawn-bottom', box !== null && box.y > 900 * 0.5, JSON.stringify(box))
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
  await reset()
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
  await page.getByRole('button', { name: 'Flow color' }).click()
  await page.waitForTimeout(200)
  const swatches = page.locator('.map-inspector-swatches button')
  const openCount = await swatches.count()
  const popoverVisible = openCount > 0 && await swatches.first().isVisible()
  let colorChanged = false
  if (popoverVisible) {
    await page.getByRole('button', { name: 'Amber flow color' }).click().catch(() => swatches.nth(2).click())
    await page.waitForTimeout(200)
    colorChanged = true
  }
  check('color-popover', popoverVisible && colorChanged, `swatches=${openCount}`)
  await page.screenshot({ path: SHOT + '/gate12-insplite.png' })
  const swBefore = await page.evaluate(() =>
    document.querySelector('g[aria-label^="Adjust flow from"] path')?.getAttribute('stroke-width'))
  await page.getByRole('button', { name: 'Increase flow thickness' }).click()
  await page.waitForTimeout(200)
  const swAfter = await page.evaluate(() =>
    document.querySelector('g[aria-label^="Adjust flow from"] path')?.getAttribute('stroke-width'))
  check('arrow-thickness', Number(swAfter ?? 0) > Number(swBefore ?? 2), `sw ${swBefore}->${swAfter}`)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.keyboard.press('Escape')
} catch (e) { check('arrow-inspector-suite', false, e.message) }

// 19. income row rename on map
try {
  await reset()
  await page.locator('[data-map-edit-key^="incomeRowLabel:"]').first().dblclick()
  await page.locator('.map-text-editor').first().waitFor()
  await page.keyboard.press('Control+a')
  await page.keyboard.type('Consulting Income')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  const renamed = await page.evaluate(() => document.body.textContent.includes('Consulting Income'))
  check('income-row-rename', renamed)
  await page.getByRole('button', { name: 'Undo' }).click()
} catch (e) { check('income-row-rename', false, e.message) }

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
  await page.screenshot({ path: SHOT + '/gate12-present-restore.png' })
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
  await page.mouse.move(720, 850)
  await page.mouse.down()
  await page.mouse.move(820, 750, { steps: 6 })
  await page.mouse.up()
  await page.waitForTimeout(300)
  const b2 = await ref()
  const panned = Math.abs(b2.x - b1.x) > 20 || Math.abs(b2.y - b1.y) > 20
  check('present-ctrlwheel-then-pan', zoomed && panned,
    `w ${b0.width.toFixed(0)}->${b1.width.toFixed(0)} pan (${b1.x.toFixed(0)},${b1.y.toFixed(0)})->(${b2.x.toFixed(0)},${b2.y.toFixed(0)})`)
  await page.screenshot({ path: SHOT + '/gate12-present-wheel.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'Fit' }).click()
} catch (e) { check('present-ctrlwheel-then-pan', false, e.message); await page.keyboard.press('Escape') }

// 22. Rotate ± buttons step 5°
try {
  await reset()
  await clickAccountBody(ACCT[0])
  await page.locator('.map-inspector').waitFor()
  await page.getByRole('button', { name: 'Rotate clockwise' }).click()
  await page.waitForTimeout(300)
  const rotated = await rotationsInDom(5)
  check('rotate-step-5', rotated, `rotate(5) found=${rotated}`)
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
  await reset()
  const pt = await page.evaluate(() => {
    const path = document.querySelector('g[aria-label="Money flow"] path')
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

// ============================================================
// GROUP A — state-context selection checks (proven L-PIN matrix).
// These close the false-green gap: the old suite only ever exercised
// shift-click from a *pristine* state, so a phantom selection bug that only
// appeared with the inspector open survived ~50 sessions unseen.
// ============================================================

// A1a. click acct 1 -> shift-click acct 2 => both selected (pristine state).
try {
  await reset()
  await clickAccountBody(ACCT[0])
  await clickAccountBody(ACCT[1], ['Shift'])
  const count = await selectedAccounts()
  const flow = await flowEnabled()
  check('A1a-shift-click-both-pristine', count === 2 && flow, `selected=${count} flow=${flow}`)
} catch (e) { check('A1a-shift-click-both-pristine', false, e.message) }

// A1b. …and STILL both selected with the Details inspector (Data panel) open.
// This is the state-context half of the pair: A1a passing while A1b fails is
// exactly the false-green shape the L-PIN matrix was built to expose.
try {
  await reset()
  await clickAccountBody(ACCT[0])
  // TRAP: getByRole name match is a substring by default — a bare 'Details'
  // also matches the map's "Edit investment details" hit rects (4 nodes).
  await page.locator('.map-inspector').getByRole('button', { name: 'Details', exact: true }).click()
  await page.locator('.client-form').waitFor()
  await page.waitForTimeout(300)
  const afterDetails = await selectedAccounts()
  await clickAccountBody(ACCT[1], ['Shift'])
  const count = await selectedAccounts()
  const flow = await flowEnabled()
  check('A1b-shift-click-both-details-open', count === 2 && flow,
    `afterDetails=${afterDetails} selected=${count} flow=${flow}`)
} catch (e) { check('A1b-shift-click-both-details-open', false, e.message) }

// A2. click acct -> click an inspector control -> shift-click acct 2 => both selected.
// Touching the inspector must not orphan the map selection.
try {
  await reset()
  await clickAccountBody(ACCT[0])
  await page.locator('.map-inspector').waitFor()
  await page.getByRole('button', { name: 'Rotate clockwise' }).click()
  await page.waitForTimeout(300)
  await clickAccountBody(ACCT[1], ['Shift'])
  const count = await selectedAccounts()
  const flow = await flowEnabled()
  check('A2-after-inspector-control', count === 2 && flow, `selected=${count} flow=${flow}`)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.waitForTimeout(200)
} catch (e) { check('A2-after-inspector-control', false, e.message) }

// A3. click acct -> Escape -> shift-click acct 2 => SINGLE selection.
// *** INTENDED BEHAVIOUR — NOT A BUG. ***
// Escape clears the selection outright. A shift-click after a cleared
// selection starts a NEW selection of one; it must NOT resurrect the
// pre-Escape item. If this check ever reports 2, selection state is leaking
// across an explicit clear — that is the regression, not the fix.
try {
  await reset()
  await clickAccountBody(ACCT[0])
  await page.keyboard.press('Escape')
  await page.waitForTimeout(250)
  await clickAccountBody(ACCT[1], ['Shift'])
  const count = await selectedAccounts()
  const flow = await flowEnabled()
  check('A3-escape-then-shift-is-single', count === 1 && !flow, `selected=${count} flow=${flow} (1 is CORRECT)`)
} catch (e) { check('A3-escape-then-shift-is-single', false, e.message) }

// A4. shift micro-drag (mousedown, +3px, mouseup) on the second account.
// A 3px wobble is a click with jitter, not a drag — it must still extend the selection.
// TRAP: DRAG_THRESHOLD_PX is 4 (hypot). A +3/+3 diagonal is 4.24px and commits a
// REAL drag — the account moves and the selection never extends. Keep the wobble
// on one axis so total displacement stays under the threshold.
try {
  await reset()
  await clickAccountBody(ACCT[0])
  const hit = bodyHit(ACCT[1])
  const box = await hit.boundingBox()
  const point = bodyHitPoint(box)
  const x = box.x + point.x
  const y = box.y + point.y
  await page.keyboard.down('Shift')
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 3, y, { steps: 3 })
  await page.mouse.up()
  await page.keyboard.up('Shift')
  await page.waitForTimeout(300)
  const count = await selectedAccounts()
  const flow = await flowEnabled()
  check('A4-shift-micro-drag', count === 2 && flow, `selected=${count} flow=${flow}`)
} catch (e) { check('A4-shift-micro-drag', false, e.message) }

// A5. dblclick an account VALUE => editor opens, is on-screen, focused, typing lands.
// (ported from repro1.mjs)
try {
  await reset()
  const run = page.locator('[data-map-edit-key^="accountValue:"]').first()
  const box = await run.boundingBox()
  await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(300)
  const ed = page.locator('.map-text-editor input, .map-text-editor textarea').first()
  const opened = (await ed.count()) > 0
  const visible = opened && await ed.isVisible()
  const focused = opened && await ed.evaluate((el) => document.activeElement === el)
  const eb = opened ? await page.locator('.map-text-editor').first().boundingBox() : null
  const onScreen = Boolean(eb && eb.y >= 0 && eb.y < 900 && eb.x >= 0 && eb.x < 1440)
  if (opened) await page.keyboard.type('777')
  const typed = opened ? await ed.inputValue() : ''
  check('A5-dblclick-value-editor', visible && focused && onScreen && typed.includes('777'),
    `visible=${visible} focused=${focused} onScreen=${onScreen} typed="${typed}"`)
  await page.keyboard.press('Escape')
} catch (e) { check('A5-dblclick-value-editor', false, e.message) }

// ============================================================
// GROUP B — s51 features under construction. Every check is probe-guarded:
// absent feature => PENDING, present-but-wrong => FAIL.
// ============================================================

// B1. selection ring visible: computed filter on [data-map-selected="true"].
try {
  await reset()
  await clickAccountBody(ACCT[0])
  const has = await probe('[data-map-selected="true"]')
  if (!has) {
    check('B1-selection-ring', false, 'no [data-map-selected=true] after selecting an account')
  } else {
    const filter = await page.evaluate(() =>
      getComputedStyle(document.querySelector('[data-map-selected="true"]')).filter)
    // baseline (feature absent) = no filter at all; s51 signature = a visible ring.
    tri('B1-selection-ring', filter !== 'none' && filter !== '', filter === 'none' || filter === '', `filter=${filter}`)
  }
} catch (e) { check('B1-selection-ring', false, e.message) }

// B2. N-selected badge text in the inspector.
try {
  await reset()
  await clickAccountBody(ACCT[0])
  await clickAccountBody(ACCT[1], ['Shift'])
  const has = await probe('.map-inspector')
  if (!has) pending('B2-n-selected-badge', 'no inspector on multi-selection yet')
  else {
    const text = (await page.locator('.map-inspector').textContent()) ?? ''
    tri('B2-n-selected-badge', /2 map items selected/.test(text), !/selected/i.test(text), text.slice(0, 50))
  }
} catch (e) { check('B2-n-selected-badge', false, e.message) }

// B3. note/chip modifier-click never clobbers the selection.
// DESIGN (s51): `MapItemKey` holds `account:` / `note:` keys only, so a NOTE can
// join a multi-selection but the as-needed CHIP cannot — modifier-clicking the
// chip while something is selected is a deliberate NO-OP
// (`nextSelectedTargetKeys` returns null; tests/s51-selection.test.tsx:39-43),
// never a silent drop of the accounts. With nothing selected the chip takes the
// selection outright (ibid. :49-53), and a plain click always replaces.
// The sample seeds no notes, so the chip branch is the one that runs here; the
// note branch stays for seeded data.
try {
  await reset()
  const useNote = await probe('[data-note-id]', 1000)
  const hasChip = await probe('g[data-map-target="asNeededChip"]')
  const chipSelected = () =>
    page.locator('g[data-map-target="asNeededChip"][data-map-selected="true"]').count()
  if (!useNote && !hasChip) pending('B3-note-chip-shift-adds', 'neither a note nor the as-needed chip is on the map')
  else if (useNote) {
    await clickAccountBody(ACCT[0])
    const box = await page.locator('[data-note-id]').first().boundingBox()
    await page.keyboard.down('Shift')
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.keyboard.up('Shift')
    await page.waitForTimeout(300)
    const total = await page.evaluate(() => document.querySelectorAll('[data-map-selected="true"]').length)
    tri('B3-note-chip-shift-adds', total >= 2, total === 1, `note total=${total}`)
  } else {
    const box = await page.locator('g[data-map-target="asNeededChip"]').first().boundingBox()
    const clickChip = async (modifier) => {
      if (modifier) await page.keyboard.down('Shift')
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
      if (modifier) await page.keyboard.up('Shift')
      await page.waitForTimeout(300)
    }
    // A plain click replaces whatever was selected, so this needs no precondition.
    await clickChip(false)
    const chipAlone = (await chipSelected()) > 0 && (await selectedAccounts()) === 0
    // Now the designed no-op: accounts selected, modifier-click the chip.
    await clickAccountBody(ACCT[0])
    const before = await selectedAccounts()
    await clickChip(true)
    const after = await selectedAccounts()
    const joined = await chipSelected()
    check('B3-note-chip-shift-adds',
      chipAlone && before === 1 && after === before && joined === 0,
      `chipAlone=${chipAlone} accounts ${before}->${after} chipJoined=${joined}`)
  }
} catch (e) { check('B3-note-chip-shift-adds', false, e.message) }

// B4. dblclick EACH line of a wrapped account TITLE opens the editor.
try {
  await reset()
  const lines = await page.evaluate(() => {
    const groups = {}
    for (const el of document.querySelectorAll('[data-edit-line-node^="accountLabel:"]')) {
      const key = el.getAttribute('data-edit-line-node')
      groups[key] = (groups[key] ?? 0) + 1
    }
    const wrapped = Object.entries(groups).find(([, n]) => n > 1)
    return wrapped ? { key: wrapped[0], count: wrapped[1] } : null
  })
  if (!lines) pending('B4-wrapped-title-lines', 'no account title wraps to 2+ line nodes yet')
  else {
    let allOpen = true
    for (let i = 0; i < lines.count; i++) {
      await reset()
      const node = page.locator(`[data-edit-line-node="${lines.key}"]`).nth(i)
      const box = await node.boundingBox()
      await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2)
      await page.waitForTimeout(300)
      if (!(await page.locator('.map-text-editor').count())) allOpen = false
      await page.keyboard.press('Escape')
    }
    check('B4-wrapped-title-lines', allOpen, `${lines.key} lines=${lines.count}`)
  }
} catch (e) { check('B4-wrapped-title-lines', false, e.message) }

// B5. account TITLE text rotates via the Details buttons, 5° per step.
try {
  await reset()
  const titleRun = page.locator('[data-map-edit-key^="accountLabel:"]').first()
  const box = await titleRun.boundingBox()
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await page.waitForTimeout(300)
  const cw = page.getByRole('button', { name: 'Rotate clockwise' })
  if (!(await probe('.map-inspector')) || !(await cw.count())) {
    pending('B5-title-rotate-5deg', 'no rotate control for a selected title text run yet')
  } else {
    await cw.click()
    await page.waitForTimeout(300)
    check('B5-title-rotate-5deg', await rotationsInDom(5), 'rotate(5) on title')
    await page.getByRole('button', { name: 'Undo' }).click()
  }
} catch (e) { check('B5-title-rotate-5deg', false, e.message) }

// B6. keyboard bracket rotate = 5° (pre-s51 baseline is 15°).
try {
  await reset()
  const acct = page.locator('[data-account-id][role="group"]').first()
  await acct.focus()
  await page.keyboard.press(']')
  await page.waitForTimeout(300)
  const five = await rotationsInDom(5)
  const fifteen = await rotationsInDom(15)
  tri('B6-bracket-rotate-5deg', five, fifteen, `rotate5=${five} rotate15=${fifteen}`)
  await page.getByRole('button', { name: 'Undo' }).click()
  await page.waitForTimeout(200)
} catch (e) { check('B6-bracket-rotate-5deg', false, e.message) }

// B7. aggregate value edit refuses the commit and offers the row-edit notice.
// SHIPPED SIGNATURE (src/ui/MapTextEditor.tsx:1066-1078, MAP_TEXT_AGGREGATE_NOTICE
// = 'Total is the sum of its rows — Edit the rows'), not /retype|change type/.
// Two preconditions the old probe missed: the account must be an AGGREGATE
// (positions sum exactly to value — managed-after-tax-trust, 380k+330k=710k, is
// the only one in the sample), and the notice replaces the editor only after a
// COMMIT ATTEMPT, so type and press Enter first. NOTICE_TIMEOUT_MS (6s) closes it.
try {
  await reset()
  const value = page.locator('[data-map-edit-key="accountValue:managed-after-tax-trust"]').first()
  if (!(await value.count())) pending('B7-aggregate-retype-pill', 'no aggregate account in the sample')
  else {
    const box = await value.boundingBox()
    // The glyph run is pointer-transparent; the sibling hit rect owns the gesture.
    await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2)
    await page.locator('.map-text-editor input, .map-text-editor textarea').first()
      .waitFor({ state: 'visible', timeout: 4000 })
    await page.keyboard.press('Control+a')
    await page.keyboard.type('864200')
    await page.keyboard.press('Enter')
    const notice = page.locator('.map-text-size-controls').getByRole('button', { name: /Edit the rows/ })
    let shown = true
    try { await notice.waitFor({ state: 'visible', timeout: 6000 }) } catch { shown = false }
    if (!shown) check('B7-aggregate-retype-pill', false, 'no "Edit the rows" notice after an aggregate commit attempt')
    else {
      await notice.click()
      await page.waitForTimeout(500)
      check('B7-aggregate-retype-pill', await page.locator('.client-form').isVisible(), 'notice -> Data row')
      await page.keyboard.press('Escape')
    }
  }
} catch (e) { check('B7-aggregate-retype-pill', false, e.message) }

// B8/B9/B10/B11. Data panel: account-row accordion, map-selection auto-expand,
// 14px filter input, in-panel X.
try {
  await reset()
  await page.getByRole('button', { name: 'Data', exact: true }).click()
  await page.locator('.client-form').waitFor()

  // B8 accordion
  const rowToggle = page.locator('.client-form [data-account-id] button[aria-expanded]')
  if (!(await rowToggle.count())) pending('B8-data-account-accordion', 'no account-row accordion in the Data panel yet')
  else {
    const before = await rowToggle.first().getAttribute('aria-expanded')
    await rowToggle.first().click()
    await page.waitForTimeout(250)
    const after = await rowToggle.first().getAttribute('aria-expanded')
    check('B8-data-account-accordion', before !== after, `aria-expanded ${before}->${after}`)
  }

  // B9 map selection auto-expands that account's row
  if (!(await rowToggle.count())) pending('B9-data-autoexpand-on-select', 'accordion not built yet')
  else {
    const id = ACCT[1]
    await clickAccountBody(id)
    await page.waitForTimeout(400)
    const expanded = await page.locator(`.client-form [data-account-id="${id}"] button[aria-expanded]`).first()
      .getAttribute('aria-expanded').catch(() => null)
    check('B9-data-autoexpand-on-select', expanded === 'true', `account=${id} aria-expanded=${expanded}`)
  }

  // B10 filter input at 14px
  const filter = page.locator('.client-form input[type="search"], .client-form input[aria-label*="Filter" i], .client-form input[placeholder*="Filter" i]')
  if (!(await filter.count())) pending('B10-data-filter-14px', 'no Data panel filter input yet')
  else {
    // The filter input already exists; s51 only bumps it to 14px. Pre-s51
    // baseline is 11px — anything else means someone else moved it.
    const fs = await filter.first().evaluate((el) => getComputedStyle(el).fontSize)
    tri('B10-data-filter-14px', fs === '14px', fs === '11px', `font-size=${fs}`)
  }

  // B11 in-panel X closes the panel
  const closeX = page.locator('.client-form').getByRole('button', { name: /close/i })
  if (!(await closeX.count())) pending('B11-data-inpanel-close', 'no in-panel X in the Data panel yet')
  else {
    await closeX.first().click()
    await page.waitForTimeout(300)
    check('B11-data-inpanel-close', !(await page.locator('.client-form').isVisible()), 'X hides .client-form')
  }
  await page.keyboard.press('Escape')
} catch (e) { check('B8-B11-data-panel-suite', false, e.message) }

// B12. docked bench: four buttons resolvable by accessible name.
// SHIPPED SIGNATURE: `.map-chrome .action-bench` = role="group" aria-label="Map
// actions" (src/App.tsx:2318). The old probe sniffed .map-bench /
// [data-docked] / [data-bench], none of which ever shipped.
try {
  await reset()
  const bench = page.locator('.map-chrome .action-bench')
  if (!(await probe('.map-chrome .action-bench'))) {
    pending('B12-docked-bench', 'no .action-bench inside .map-chrome yet')
  } else {
    // '+ Text note' is the visible label; 'Add text note' is its accessible name.
    const names = ['Tidy map', 'Add text note', '+ Flow', '+ Account']
    const found = []
    for (const name of names) {
      found.push(await bench.getByRole('button', { name, exact: true }).count() > 0)
    }
    const grouped = await page.getByRole('group', { name: 'Map actions' }).count() > 0
    check('B12-docked-bench', grouped && found.every(Boolean),
      `group=${grouped} ` + names.map((n, i) => `${n}=${found[i]}`).join(' '))
  }
} catch (e) { check('B12-docked-bench', false, e.message) }

// ============================================================
// Summary
// ============================================================
for (const r of results) console.log(`${r.status.padEnd(7)} ${r.name}${r.detail ? ' — ' + r.detail : ''}`)
const tally = (s) => results.filter((r) => r.status === s).length
console.log('\n' + '-'.repeat(52))
console.log(`checks ${results.length}   PASS ${tally('PASS')}   FAIL ${tally('FAIL')}   PENDING ${tally('PENDING')}`)
if (tally('FAIL')) console.log('FAILED: ' + results.filter((r) => r.status === 'FAIL').map((r) => r.name).join(', '))
console.log('-'.repeat(52))
await browser.close()
process.exit(tally('FAIL') ? 1 : 0)
