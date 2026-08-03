import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

type OverflowMetrics = {
  clientWidth: number
  scrollWidth: number
  clientHeight: number
  scrollHeight: number
  overflowX: string
}

const metrics = (element: Element): OverflowMetrics => ({
  clientWidth: element.clientWidth,
  scrollWidth: element.scrollWidth,
  clientHeight: element.clientHeight,
  scrollHeight: element.scrollHeight,
  overflowX: getComputedStyle(element).overflowX,
})

test('200 percent desktop reflow stacks controls while preserving map overflow and Present mode', async ({ page }, testInfo) => {
  // A 1280x720 desktop viewport at 200% browser zoom exposes a 640x360 CSS viewport.
  const configuredViewport = page.viewportSize()
  await page.setViewportSize({ width: 640, height: 360 })
  await openApp(page)
  const cssViewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, devicePixelRatio }))
  console.log(`ZOOM_HARNESS ${JSON.stringify({ project: testInfo.project.name, configuredViewport, cssViewport })}`)

  const header = page.locator('.app-header')
  const workspace = page.locator('.workspace')
  const editor = page.locator('.form-pane')
  const preview = page.locator('.preview-pane')

  await page.getByRole('button', { name: 'Export map' }).click()
  const saveMenu = page.locator('.save-menu-trigger + .menu-popover')
  await expect(saveMenu).toBeVisible()
  const saveMenuState = await saveMenu.evaluate((element) => {
    const box = element.getBoundingClientRect()
    const itemBoxes = [...element.querySelectorAll<HTMLElement>('[role="menuitem"]')].map((item) => {
      const itemBox = item.getBoundingClientRect()
      return { text: item.textContent?.trim(), left: itemBox.left, top: itemBox.top, right: itemBox.right, bottom: itemBox.bottom }
    })
    return {
      box: { left: box.left, top: box.top, right: box.right, bottom: box.bottom },
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      clippedItems: itemBoxes.filter((item) => item.left < 0 || item.top < 0 || item.right > window.innerWidth || item.bottom > window.innerHeight),
      withinViewport: box.left >= 0 && box.top >= 0 && box.right <= window.innerWidth && box.bottom <= window.innerHeight,
    }
  })
  await testInfo.attach('save-menu-200-percent', { body: await page.screenshot(), contentType: 'image/png' })
  await page.keyboard.press('Escape')

  const statusStack = page.locator('.app-status-stack')
  await statusStack.evaluate((element) => {
    element.innerHTML = '<section class="app-status-banner is-demo"><strong>Public demo</strong><span>Changes are temporary. Do not enter real client data. Real use requires a private separate-origin deployment with <code>VITE_DATA_MODE=real</code>.</span></section>'
  })
  await expect(statusStack).toBeVisible()
  const statusState = await page.evaluate(() => {
    const stack = document.querySelector<HTMLElement>('.app-status-stack')!
    const stackBox = stack.getBoundingClientRect()
    const targets = [...document.querySelectorAll<HTMLElement>('.app-header button, .form-pane button')]
      .filter((element) => ['Guide me', 'Data'].includes(element.textContent?.trim() || '') || Boolean(element.closest('.app-header')))
      .filter((element) => {
        const style = getComputedStyle(element)
        return style.display !== 'none' && style.visibility !== 'hidden'
      })
    const obstructions = targets.flatMap((target) => {
      const box = target.getBoundingClientRect()
      const left = Math.max(box.left, stackBox.left)
      const right = Math.min(box.right, stackBox.right)
      const top = Math.max(box.top, stackBox.top)
      const bottom = Math.min(box.bottom, stackBox.bottom)
      if (left >= right || top >= bottom) return []
      const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2)
      return [{
        label: target.getAttribute('aria-label') || target.textContent?.trim(),
        geometric: true,
        pointerBlocked: Boolean(hit?.closest('.app-status-stack')),
      }]
    })
    return {
      position: getComputedStyle(stack).position,
      box: { left: stackBox.left, top: stackBox.top, right: stackBox.right, bottom: stackBox.bottom },
      obstructions,
    }
  })

  await testInfo.attach('demo-banner-200-percent', { body: await page.screenshot(), contentType: 'image/png' })
  console.log(`P1_REFLOW_STATE ${JSON.stringify({ saveMenuState, statusState })}`)
  expect({
    saveMenuWithinViewport: saveMenuState.withinViewport,
    saveMenuClippedItems: saveMenuState.clippedItems,
    statusObstructions: statusState.obstructions,
  }).toEqual({
    saveMenuWithinViewport: true,
    saveMenuClippedItems: [],
    statusObstructions: [],
  })

  const regions = { header, workspace, editor }
  for (const [name, region] of Object.entries(regions)) {
    await expect.poll(async () => {
      const { clientWidth, scrollWidth } = await region.evaluate(metrics)
      return { name, horizontalOverflow: scrollWidth - clientWidth }
    }).toEqual({ name, horizontalOverflow: 0 })
  }

  await expect.poll(() => page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }))).toEqual({ viewport: 640, documentWidth: 640 })

  const headerMetrics = await header.evaluate(metrics)
  expect(headerMetrics.scrollHeight).toBeGreaterThan(52)
  expect(['auto', 'scroll']).not.toContain(headerMetrics.overflowX)

  const headerActions = header.locator('button, input, select, textarea, summary, [role="button"]')
  for (let index = 0; index < await headerActions.count(); index += 1) {
    const action = headerActions.nth(index)
    if (!await action.isVisible()) continue
    await action.scrollIntoViewIfNeeded()
    const bounds = await action.evaluate((element) => {
      const box = element.getBoundingClientRect()
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom }
    })
    expect(bounds.left).toBeGreaterThanOrEqual(0)
    expect(bounds.right).toBeLessThanOrEqual(640)
    expect(bounds.top).toBeGreaterThanOrEqual(0)
    expect(bounds.bottom).toBeLessThanOrEqual(360)
  }

  const headerLabelDiagnostics = await header.evaluate((element) => {
    const paint = (node: HTMLElement) => {
      const box = node.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(node)
      const textBox = range.getBoundingClientRect()
      return { label: node.getAttribute('aria-label') || node.textContent?.trim(), box: { left: box.left, right: box.right }, textBox: { left: textBox.left, right: textBox.right }, clipped: textBox.left < box.left - 1 || textBox.right > box.right + 1 }
    }
    const labels = [...element.querySelectorAll<HTMLElement>('button, .book-connection-name, .wordmark span')]
      .filter((node) => getComputedStyle(node).display !== 'none')
      .map(paint)
    const select = element.querySelector<HTMLSelectElement>('.client-select')!
    const style = getComputedStyle(select)
    const probe = document.createElement('span')
    probe.textContent = select.selectedOptions[0]?.textContent || ''
    Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', whiteSpace: 'nowrap', font: style.font })
    document.body.append(probe)
    const selectedTextWidth = probe.getBoundingClientRect().width
    probe.remove()
    const horizontalChrome = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth) + 18
    return { labels, select: { text: select.selectedOptions[0]?.textContent, clientWidth: select.clientWidth, requiredWidth: selectedTextWidth + horizontalChrome, clipped: selectedTextWidth + horizontalChrome > select.clientWidth + 1 } }
  })
  console.log(`HEADER_LABEL_DIAGNOSTICS ${JSON.stringify(headerLabelDiagnostics)}`)
  const clippedHeaderLabels = headerLabelDiagnostics.labels.filter(({ clipped }) => clipped)

  await page.getByRole('button', { name: 'Data', exact: true }).click()
  const shownAs = page.getByLabel('Amount note').first()
  await shownAs.fill('Gross, After-Tax')
  const shownAsMetrics = await shownAs.evaluate((element: HTMLInputElement) => {
    const style = getComputedStyle(element)
    const probe = document.createElement('span')
    probe.textContent = element.value
    Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', whiteSpace: 'nowrap', font: style.font })
    document.body.append(probe)
    const textWidth = probe.getBoundingClientRect().width
    probe.remove()
    const requiredWidth = textWidth + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)
    return { value: element.value, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth, requiredWidth, clipped: requiredWidth > element.clientWidth + 1 }
  })
  await shownAs.press('Home')
  const homeScrollLeft = await shownAs.evaluate((element: HTMLInputElement) => element.scrollLeft)
  await shownAs.press('End')
  const endScrollLeft = await shownAs.evaluate((element: HTMLInputElement) => element.scrollLeft)
  console.log(`SHOWN_AS_DIAGNOSTICS ${JSON.stringify({ ...shownAsMetrics, homeScrollLeft, endScrollLeft })}`)
  const shownAsReachable = await shownAs.inputValue() === 'Gross, After-Tax' && (!shownAsMetrics.clipped || (homeScrollLeft === 0 && endScrollLeft > homeScrollLeft))
  await page.getByRole('button', { name: 'Guide me' }).click()

  const layout = await page.evaluate(() => {
    const editorBox = document.querySelector('.form-pane')!.getBoundingClientRect()
    const previewBox = document.querySelector('.preview-pane')!.getBoundingClientRect()
    return {
      editorLeft: Math.round(editorBox.left),
      previewLeft: Math.round(previewBox.left),
      editorBottom: Math.round(editorBox.bottom),
      previewTop: Math.round(previewBox.top),
    }
  })
  expect(layout.previewLeft).toBe(layout.editorLeft)
  expect(layout.previewTop).toBeGreaterThanOrEqual(layout.editorBottom)

  const formControls = editor.locator('button, input, select, textarea, summary')
  for (let index = 0; index < await formControls.count(); index += 1) {
    const control = formControls.nth(index)
    if (!await control.isVisible() || await control.evaluate((element) => element.classList.contains('visually-hidden'))) continue
    await control.scrollIntoViewIfNeeded()
    const bounds = await control.evaluate((element) => {
      const box = element.getBoundingClientRect()
      return { left: box.left, right: box.right }
    })
    expect(bounds.left).toBeGreaterThanOrEqual(0)
    expect(bounds.right).toBeLessThanOrEqual(640)
    expect(await page.evaluate(() => window.scrollX)).toBe(0)
  }

  const statusStackForOverlap = page.locator('.app-status-stack')
  if (await statusStackForOverlap.count() && await statusStackForOverlap.isVisible()) {
    const obstructionTargets = page.locator('.app-header button, .app-header [role="button"], .form-pane button, .form-pane input, .form-pane select, .form-pane textarea, .form-pane summary')
    for (let index = 0; index < await obstructionTargets.count(); index += 1) {
      const target = obstructionTargets.nth(index)
      if (!await target.isVisible() || await target.evaluate((element) => element.classList.contains('visually-hidden'))) continue
      await target.scrollIntoViewIfNeeded()
      const isObstructed = await target.evaluate((element) => {
        const targetBox = element.getBoundingClientRect()
        const statusBox = document.querySelector('.app-status-stack')!.getBoundingClientRect()
        return targetBox.left < statusBox.right && targetBox.right > statusBox.left && targetBox.top < statusBox.bottom && targetBox.bottom > statusBox.top
      })
      expect(isObstructed).toBe(false)
    }
  }

  await expect(preview).toBeVisible()
  await expect(page.locator('.map-page svg')).toBeVisible()
  await expect.poll(() => preview.evaluate((element) => element.clientHeight)).toBeGreaterThan(0)

  const previewMetrics = await preview.evaluate(metrics)
  expect(previewMetrics.scrollWidth).toBeGreaterThanOrEqual(previewMetrics.clientWidth)
  expect(['auto', 'scroll']).toContain(previewMetrics.overflowX)
  await page.evaluate(() => window.scrollTo(0, 0))
  const intrinsicOverflowDiagnostics = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('body *')]
    .filter((element) => element.scrollWidth > element.clientWidth + 1 && !element.closest('.preview-pane') && !element.classList.contains('visually-hidden'))
    .map((element) => {
      const box = element.getBoundingClientRect()
      const parentBox = element.parentElement?.getBoundingClientRect()
      const style = getComputedStyle(element)
      const focusable = element.matches('button, input, select, textarea, summary, a[href], [tabindex]:not([tabindex="-1"])')
      const withinViewport = box.left >= 0 && box.right <= window.innerWidth && box.top >= 0 && box.bottom <= window.innerHeight
      const paintedWithinParent = Boolean(parentBox && box.left >= parentBox.left - 1 && box.right <= parentBox.right + 1 && box.top >= parentBox.top - 1 && box.bottom <= parentBox.bottom + 1)
      const provenInternalIntrinsic = withinViewport && paintedWithinParent && ((element.tagName === 'SELECT' && focusable) || (style.display === 'inline' && !focusable))
      return {
        element: element.className || element.tagName,
        tag: element.tagName,
        display: style.display,
        text: element.textContent?.trim(),
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        box: { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height },
        parentBox: parentBox ? { left: parentBox.left, top: parentBox.top, right: parentBox.right, bottom: parentBox.bottom, width: parentBox.width } : null,
        focusable,
        withinViewport,
        paintedWithinParent,
        provenInternalIntrinsic,
      }
    }))
  console.log(`INTRINSIC_OVERFLOW_DIAGNOSTICS ${JSON.stringify(intrinsicOverflowDiagnostics)}`)
  expect(intrinsicOverflowDiagnostics.filter(({ provenInternalIntrinsic }) => !provenInternalIntrinsic)).toEqual([])

  const computedLayoutMetrics = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector)!
      const box = element.getBoundingClientRect()
      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        left: Math.round(box.left),
        top: Math.round(box.top),
        right: Math.round(box.right),
        bottom: Math.round(box.bottom),
        overflowX: getComputedStyle(element).overflowX,
      }
    }
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth },
      header: read('.app-header'),
      workspace: read('.workspace'),
      editor: read('.form-pane'),
      preview: read('.preview-pane'),
      statusStack: document.querySelector('.app-status-stack') ? read('.app-status-stack') : null,
    }
  })
  console.log(`REFLOW_METRICS ${JSON.stringify(computedLayoutMetrics)}`)

  await page.getByRole('button', { name: 'Present' }).click()
  await expect(page.locator('.app-shell')).toHaveClass(/is-presenting/)
  await expect(header).toBeHidden()
  await expect(editor).toBeHidden()
  await expect(page.locator('.map-page svg')).toBeVisible()
  await expect(page.locator('.map-chrome')).toHaveCount(0)
  const presentZoom = page.locator('.present-zoom .zoom-cluster')
  await expect(presentZoom).toBeVisible()
  const presentBounds = await page.evaluate(() => {
    const read = (selector: string) => {
      const box = document.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, width: box.width, height: box.height }
    }
    return { viewport: { width: innerWidth, height: innerHeight }, paper: read('.map-page'), svg: read('.map-page svg'), zoom: read('.present-zoom .zoom-cluster') }
  })
  console.log(`PRESENT_BOUNDS ${JSON.stringify(presentBounds)}`)
  const presentOutOfViewport = [presentBounds.paper, presentBounds.svg, presentBounds.zoom].filter((box) => box.left < 0 || box.top < 0 || box.right > presentBounds.viewport.width || box.bottom > presentBounds.viewport.height)
  const zoomOverlapsPaper = presentBounds.zoom.left < presentBounds.paper.right && presentBounds.zoom.right > presentBounds.paper.left && presentBounds.zoom.top < presentBounds.paper.bottom && presentBounds.zoom.bottom > presentBounds.paper.top
  expect({
    clippedHeaderLabels,
    selectedClientClipped: headerLabelDiagnostics.select.clipped,
    shownAsReachable,
    presentOutOfViewport,
    zoomOverlapsPaper,
  }).toEqual({
    clippedHeaderLabels: [],
    selectedClientClipped: false,
    shownAsReachable: true,
    presentOutOfViewport: [],
    zoomOverlapsPaper: false,
  })
  await page.keyboard.press('Escape')
  await expect(page.locator('.app-shell')).not.toHaveClass(/is-presenting/)
})
