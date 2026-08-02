import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  accountKeyboardActivation,
  MapSvg,
} from '../src/render/MapSvg'

const firstAccount = SAMPLE_WHITFIELD.accounts[0]
const selectedKey = `account:${firstAccount.id}`

function renderInteractive(
  selectedTargetKey?: string | null,
  data = SAMPLE_WHITFIELD,
) {
  return renderToStaticMarkup(
    <MapSvg
      data={data}
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

  it('keeps selected account chrome outside the transformed SVG group', () => {
    const markup = renderInteractive(selectedKey)

    expect(markup).toContain(`data-selected-target="${selectedKey}"`)
    expect(markup).toContain('data-map-selected="true"')
    expect(markup).not.toContain('data-account-controls-for=')
    expect(markup).not.toContain('map-account-controls')
    expect(markup).not.toContain('map-shape-picker')
    expect(markup).not.toContain('map-adjust-controls')
  })

  it('shows only selected arrow geometry handles and no SVG action HUD', () => {
    const arrowKey = `arrow:custom:${SAMPLE_WHITFIELD.customArrows![0].id}`
    const resting = renderInteractive()
    const selected = renderInteractive(arrowKey)

    expect(resting).not.toContain('map-arrow-handle-hit')
    expect(selected.match(/class="map-arrow-handle-hit"/g)).toHaveLength(3)
    for (const removed of [
      'map-arrow-delete',
      'map-arrow-style',
      'map-arrow-colors',
      'map-arrow-label-add',
    ]) {
      expect(selected).not.toContain(removed)
    }
  })

  it('names each custom flow by its plain endpoints without changing generated names', () => {
    const markup = renderInteractive()

    expect(markup).toContain(
      'aria-label="Adjust flow from Managed IRA — Jordan to Managed After-Tax Trust"',
    )
    expect(markup).toContain(
      'aria-label="Adjust flow from Managed After-Tax Trust to Short-Term Funds"',
    )
    expect(markup).toContain('aria-label="Adjust income flow"')
    expect(markup).toContain('aria-label="Adjust account withdrawal flow"')
    expect(markup).not.toContain('aria-label="Adjust custom flow"')
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
  it('selects focused endpoints with Enter or Space', () => {
    expect(accountKeyboardActivation('Enter', 'cash-at-bank')).toEqual({
      selectedTargetKey: 'account:cash-at-bank',
    })
    expect(accountKeyboardActivation(' ', 'managed-ira-jordan')).toEqual({
      selectedTargetKey: 'account:managed-ira-jordan',
    })
    expect(accountKeyboardActivation('Enter', 'income')).toEqual({
      selectedTargetKey: 'income',
    })
    expect(accountKeyboardActivation(' ', 'need')).toEqual({
      selectedTargetKey: 'need',
    })
    expect(accountKeyboardActivation('ArrowRight', 'cash-at-bank')).toBe(
      null,
    )
  })

  it('renders full account body hits below text without account drag handles', () => {
    const markup = renderInteractive(selectedKey)
    const accountStart = markup.indexOf(
      'data-account-id="' + firstAccount.id + '"',
    )
    const bodyHit = markup.indexOf('class="map-account-body-hit"', accountStart)
    const label = markup.indexOf(
      'data-map-edit-key="accountLabel:' + firstAccount.id + '"',
      accountStart,
    )

    expect(accountStart).toBeGreaterThanOrEqual(0)
    expect(bodyHit).toBeGreaterThan(accountStart)
    expect(bodyHit).toBeLessThan(label)
    expect(markup).toMatch(
      /class="map-account-body-hit"[^>]*pointer-events="all"/,
    )
    expect(markup).not.toContain('map-rotate-handle')
    expect(markup).not.toContain('map-resize-handle')
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

  it('exposes keyboard shortcuts on generated endpoints', () => {
    const markup = renderInteractive()
    for (const endpointId of ['income', 'need']) {
      const endpointTag = markup.match(
        new RegExp('<g[^>]*data-connect-id="' + endpointId + '"[^>]*>'),
      )?.[0]
      expect(endpointTag).toContain('aria-keyshortcuts="')
      expect(endpointTag).toContain('Enter Space')
    }
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

  it('makes notes focusable inspector targets without inline controls', () => {
    const markup = renderInteractive(null, {
      ...SAMPLE_WHITFIELD,
      notes: [{ id: 'audit-note', text: 'Review this note', x: 500, y: 400 }],
    })
    const note = markup.match(/<g[^>]*aria-label="Adjust note: Review this note"[^>]*>/)?.[0]
    expect(note).toContain('role="group"')
    expect(note).toContain('tabindex="0"')
    expect(markup).not.toContain('map-note-delete')
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
