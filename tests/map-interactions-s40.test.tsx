// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  accountKeyboardActivation,
  adjustPanelX,
  MapSvg,
  stopMapControlPointerDown,
} from '../src/render/MapSvg'

const firstAccount = SAMPLE_WHITFIELD.accounts[0]
const selectedKey = `account:${firstAccount.id}`

function renderInteractive(selectedTargetKey?: string) {
  return renderToStaticMarkup(
    <MapSvg
      data={SAMPLE_WHITFIELD}
      onChange={() => undefined}
      onElementClick={() => undefined}
      selectedTargetKey={selectedTargetKey}
    />,
  )
}

describe('Session 40 map interaction affordances', () => {
  it('identifies exact account and text targets while keeping resting accounts clean', () => {
    const markup = renderInteractive()

    expect(markup).toContain(`data-map-target="${selectedKey}"`)
    expect(markup).toMatch(/data-map-target="text:[^"]+"/)
    expect(markup).not.toContain('data-account-controls-for=')
  })

  it('renders explicit selected-only shape, connect, and adjust controls', () => {
    const markup = renderInteractive(selectedKey)

    expect(markup).toContain(`data-selected-target="${selectedKey}"`)
    expect(markup).toContain(
      `data-account-controls-for="${firstAccount.id}"`,
    )
    for (const label of ['Card', 'Cylinder', 'Bucket', 'Pill']) {
      expect(markup).toContain(
        `aria-label="Use ${label} shape for ${firstAccount.label}"`,
      )
    }
    expect(markup).toContain(
      `aria-label="Connect flow from ${firstAccount.label}"`,
    )
    expect(markup).toContain(`aria-label="Adjust ${firstAccount.label}"`)
    expect(markup).toContain('aria-label="Move left"')
    expect(markup).toContain('aria-label="Increase size"')
    expect(markup).toContain('aria-label="Rotate clockwise"')
    expect(markup).toContain('data-min-screen-hit="28"')
    expect(markup).toContain('Resize account')
    expect(markup).toContain('Rotate account')
  })

  it('marks decorative account layers click-through and omits edit chrome from output SVGs', () => {
    const selectedMarkup = renderInteractive(selectedKey)
    const outputMarkup = renderToStaticMarkup(
      <MapSvg data={SAMPLE_WHITFIELD} />,
    )

    expect(selectedMarkup).toMatch(
      /class="map-account-decoration"[^>]*pointer-events="none"/,
    )
    expect(outputMarkup).not.toContain('data-account-controls-for=')
    expect(outputMarkup).not.toContain('map-shape-picker')
    expect(outputMarkup).not.toContain('map-adjust-controls')
    expect(outputMarkup).not.toContain('map-connect-instruction')
    expect(outputMarkup).not.toContain('data-selected-target=')
  })
  it('selects focused accounts with Enter or Space and completes keyboard connect targets', () => {
    expect(accountKeyboardActivation('Enter', 'cash-at-bank', null)).toEqual({
      selectedTargetKey: 'account:cash-at-bank',
    })
    expect(accountKeyboardActivation(' ', 'managed-ira-jordan', null)).toEqual({
      selectedTargetKey: 'account:managed-ira-jordan',
    })
    expect(
      accountKeyboardActivation(
        'Enter',
        'managed-ira-jordan',
        'cash-at-bank',
      ),
    ).toEqual({
      connection: {
        sourceId: 'cash-at-bank',
        targetId: 'managed-ira-jordan',
      },
      selectedTargetKey: 'account:managed-ira-jordan',
    })
    expect(
      accountKeyboardActivation('Enter', 'cash-at-bank', 'cash-at-bank'),
    ).toEqual({ selectedTargetKey: 'account:cash-at-bank' })
    expect(accountKeyboardActivation('ArrowRight', 'cash-at-bank', null)).toBe(
      null,
    )
  })

  it('stops nested control pointerdown before the account drag handler', () => {
    let stopped = false
    stopMapControlPointerDown({
      stopPropagation: () => {
        stopped = true
      },
    })
    expect(stopped).toBe(true)
  })

  it('renders full account body hits below text and pointer-only drag handles', () => {
    const markup = renderInteractive(selectedKey)
    const accountStart = markup.indexOf(
      'data-account-id="' + firstAccount.id + '"',
    )
    const bodyHit = markup.indexOf('class="map-account-body-hit"', accountStart)
    const label = markup.indexOf(
      'data-map-edit-key="accountLabel:' + firstAccount.id + '"',
      accountStart,
    )
    const rotateTag = markup.match(
      /<g[^>]*class="map-rotate-handle"[^>]*>/,
    )?.[0]
    const resizeTag = markup.match(
      /<g[^>]*class="map-resize-handle"[^>]*>/,
    )?.[0]

    expect(accountStart).toBeGreaterThanOrEqual(0)
    expect(bodyHit).toBeGreaterThan(accountStart)
    expect(bodyHit).toBeLessThan(label)
    expect(markup).toMatch(
      /class="map-account-body-hit"[^>]*pointer-events="all"/,
    )
    expect(rotateTag).toContain('aria-hidden="true"')
    expect(rotateTag).not.toContain('role=')
    expect(rotateTag).not.toContain('tabindex=')
    expect(resizeTag).toContain('aria-hidden="true"')
    expect(resizeTag).not.toContain('role=')
    expect(resizeTag).not.toContain('tabindex=')
  })

  it('clamps the Adjust panel to both artboard edges', () => {
    expect(adjustPanelX(-100)).toBe(24)
    expect(adjustPanelX(660)).toBe(368)
    expect(adjustPanelX(2_000)).toBe(712)
  })

  it('defines forced-color system rules for every new map control family', () => {
    const css = readFileSync(
      new URL('../src/styles/app.css', import.meta.url),
      'utf8',
    )
    expect(css).toContain('@media (forced-colors: active)')
    for (const selector of [
      '.map-control-panel',
      '.map-control-button',
      '.map-control-surface',
      '.map-shape-option-glyph',
      '.map-rotate-glyph',
      '.map-resize-glyph',
      '.map-connect-flow-glyph',
      '.map-control-label',
      '.map-adjust-glyph',
      '.map-connect-flow-label',
    ]) {
      expect(css).toContain(selector)
    }
    expect(css).toContain('fill: Canvas;')
    expect(css).toContain('stroke: CanvasText;')
    expect(css).toContain('fill: CanvasText;')
    expect(css).toContain('outline-color: Highlight;')
  })
  it('keeps arrow hit paths below endpoint hit surfaces and account body hits below text', () => {
    const markup = renderInteractive()
    const arrowHit = markup.indexOf('map-arrow-hit')
    const firstAccountStart = markup.indexOf(
      'data-account-id="' + firstAccount.id + '"',
    )
    const firstBodyHit = markup.indexOf(
      'class="map-account-body-hit"',
      firstAccountStart,
    )

    expect(arrowHit).toBeGreaterThanOrEqual(0)
    expect(arrowHit).toBeLessThan(firstAccountStart)
    expect(firstBodyHit).toBeGreaterThan(firstAccountStart)

    for (const account of SAMPLE_WHITFIELD.accounts) {
      const accountStart = markup.indexOf(
        'data-account-id="' + account.id + '"',
      )
      const bodyHit = markup.indexOf(
        'class="map-account-body-hit"',
        accountStart,
      )
      const editableText = markup.indexOf(
        'data-map-edit-key="accountLabel:' + account.id + '"',
        accountStart,
      )

      expect(accountStart).toBeGreaterThanOrEqual(0)
      expect(bodyHit).toBeGreaterThan(accountStart)
      expect(bodyHit).toBeLessThan(editableText)
    }
  })

  it('supports keyboard connection completion for account, income, and need endpoints', () => {
    expect(
      accountKeyboardActivation('Enter', 'income', firstAccount.id),
    ).toEqual({
      connection: {
        sourceId: firstAccount.id,
        targetId: 'income',
      },
      selectedTargetKey: 'income',
    })
    expect(
      accountKeyboardActivation(' ', 'need', firstAccount.id),
    ).toEqual({
      connection: {
        sourceId: firstAccount.id,
        targetId: 'need',
      },
      selectedTargetKey: 'need',
    })

    const markup = renderInteractive()
    for (const endpointId of ['income', 'need']) {
      const endpointTag = markup.match(
        new RegExp('<g[^>]*data-connect-id="' + endpointId + '"[^>]*>'),
      )?.[0]
      expect(endpointTag).toContain('aria-keyshortcuts="')
      expect(endpointTag).toContain('Enter Space')
    }
  })

  it('wires every focusable ConnectHandle for Enter and Space activation', () => {
    const markup = renderInteractive()
    const connectHandles =
      markup.match(/<g[^>]*class="map-connect-handle"[^>]*>/g) ?? []
    expect(connectHandles.length).toBeGreaterThanOrEqual(2)
    for (const handle of connectHandles) {
      expect(handle).toContain('role="button"')
      expect(handle).toContain('tabindex="0"')
      expect(handle).toContain('aria-keyshortcuts="Enter Space"')
    }

    const source = readFileSync(
      new URL('../src/render/MapSvg.tsx', import.meta.url),
      'utf8',
    )
    const connectHandle = source.slice(
      source.indexOf('function ConnectHandle'),
      source.indexOf('function AsNeededLabel'),
    )
    expect(connectHandle).toContain('onKeyDown={(event) =>')
    expect(connectHandle).toContain(
      'activateMapControl(event, onActivate)',
    )
  })

  it('shields the entire selected-account controls layer from pointerdown bubbling', () => {
    const markup = renderInteractive(selectedKey)
    const controls = markup.match(
      /<g[^>]*class="map-account-controls map-interaction-control"[^>]*>/,
    )?.[0]

    expect(controls).toContain('data-pointer-shield="true"')

    const source = readFileSync(
      new URL('../src/render/MapSvg.tsx', import.meta.url),
      'utf8',
    )
    const controlsStart = source.indexOf(
      'className="map-account-controls map-interaction-control"',
    )
    const controlsOpening = source.slice(controlsStart, controlsStart + 240)
    expect(controlsOpening).toContain(
      'onPointerDown={stopMapControlPointerDown}',
    )
  })
  it('uses explicit topmost geometry targets for core account text', () => {
    const markup = renderInteractive()
    const accountId = 'managed-ira-jordan'
    const accountStart = markup.indexOf(
      'data-account-id="' + accountId + '"',
    )
    const bodyHit = markup.indexOf(
      'class="map-account-body-hit"',
      accountStart,
    )

    for (const kind of [
      'accountLabel',
      'accountCaption',
      'accountValue',
    ]) {
      const key = kind + ':' + accountId
      const targetMatches =
        markup.match(
          new RegExp('data-map-edit-key="' + key + '"', 'g'),
        ) ?? []
      const targetTag = markup.match(
        new RegExp(
          '<rect[^>]*data-map-edit-key="' + key + '"[^>]*>',
        ),
      )?.[0]
      const visual = markup.indexOf(
        'data-map-edit-visual="' + key + '"',
        accountStart,
      )
      const target = markup.indexOf(
        'data-map-edit-key="' + key + '"',
        accountStart,
      )

      expect(targetMatches).toHaveLength(1)
      expect(targetTag).toContain('class="map-editable-hit"')
      expect(targetTag).toContain('fill="transparent"')
      expect(targetTag).toContain('role="button"')
      expect(targetTag).toContain('tabindex="0"')
      expect(bodyHit).toBeLessThan(visual)
      expect(visual).toBeLessThan(target)
    }
  })
  it('renders the selected account as the final account sibling without changing base order', () => {
    const accountIds = SAMPLE_WHITFIELD.accounts.map(
      (account) => account.id,
    )
    const renderedOrder = (markup: string) =>
      [...accountIds].sort(
        (left, right) =>
          markup.indexOf('data-account-id="' + left + '"') -
          markup.indexOf('data-account-id="' + right + '"'),
      )
    const baseOrder = renderedOrder(renderInteractive())

    for (const selectedAccount of SAMPLE_WHITFIELD.accounts.slice(0, 2)) {
      const selectedOrder = renderedOrder(
        renderInteractive('account:' + selectedAccount.id),
      )

      expect(selectedOrder.at(-1)).toBe(selectedAccount.id)
      expect(selectedOrder.slice(0, -1)).toEqual(
        baseOrder.filter((id) => id !== selectedAccount.id),
      )
    }
  })
})
