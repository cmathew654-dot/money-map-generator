import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'

const render = (
  selectedTargetKey: string,
  data: MoneyMapData = SAMPLE_WHITFIELD,
  selectedTargetKeys?: readonly string[],
) =>
  renderToStaticMarkup(
    createElement(MapInspector, {
      data,
      selectedTargetKey,
      selectedTargetKeys,
      onChange: () => undefined,
      onClose: () => undefined,
      onSelect: () => undefined,
    }),
  )

const DIVIDER = 'map-inspector-divider'

/** Asserts each marker appears, in the given left-to-right order. */
function expectOrder(markup: string, markers: readonly string[]) {
  let previous = -1
  for (const marker of markers) {
    const at = markup.indexOf(marker)
    expect(at, `missing marker: ${marker}`).toBeGreaterThan(-1)
    expect(at, `out of order: ${marker}`).toBeGreaterThan(previous)
    previous = at
  }
}

/** The danger cluster is last: nothing but danger buttons follows the divider. */
function expectDangerLast(markup: string) {
  const divider = markup.indexOf(DIVIDER)
  expect(divider).toBeGreaterThan(-1)
  expect(markup.indexOf('map-inspector-danger')).toBeGreaterThan(divider)
  expect(markup.lastIndexOf('map-inspector-field')).toBeLessThan(divider)
  expect(markup.lastIndexOf('map-inspector-danger')).toBeGreaterThan(
    markup.lastIndexOf('map-inspector-group'),
  )
}

const accountId = SAMPLE_WHITFIELD.accounts[0].id
const customArrowId = SAMPLE_WHITFIELD.customArrows![0].id

const LABELLED_ARROW: MoneyMapData = {
  ...SAMPLE_WHITFIELD,
  customArrows: SAMPLE_WHITFIELD.customArrows!.map((arrow) =>
    arrow.id === customArrowId ? { ...arrow, label: 'Premium' } : arrow,
  ),
}

const NOTE_DATA: MoneyMapData = {
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'order-note', text: 'Order matters', x: 500, y: 400 }],
}

describe('s49 inspector grammar order', () => {
  it('orders an account: appearance, connections, position, divider, danger', () => {
    const markup = render(`account:${accountId}`)
    expectOrder(markup, [
      'aria-label="Shape"',
      'aria-label="Account type"',
      'aria-label="Decrease size"',
      'aria-label="Rotate counterclockwise"',
      'aria-label="Add flow to"',
      'aria-label="Move left"',
      'Duplicate',
      DIVIDER,
      'Reset item',
      'Delete account',
    ])
    expectDangerLast(markup)
  })

  it('orders a custom flow: appearance, content, position, divider, danger', () => {
    const markup = render(`arrow:custom:${customArrowId}`, LABELLED_ARROW)
    expectOrder(markup, [
      'aria-label="Style"',
      'aria-label="Flow color"',
      'aria-label="Decrease flow thickness"',
      'aria-label="Decrease curve"',
      'aria-label="Label"',
      'aria-label="From"',
      'aria-label="To"',
      'aria-label="Label position left"',
      DIVIDER,
      'Reset flow',
      'Delete flow',
    ])
    expectDangerLast(markup)
  })

  it('orders a generated flow with Hide flow after the divider', () => {
    const markup = render('arrow:income')
    expectOrder(markup, [
      'aria-label="Style"',
      'aria-label="Flow color"',
      'aria-label="Decrease curve"',
      DIVIDER,
      'Reset flow',
      'Hide flow',
    ])
    expectDangerLast(markup)
  })

  it('orders a note: appearance, position, divider, danger', () => {
    const markup = render('note:order-note', NOTE_DATA)
    expectOrder(markup, [
      'aria-label="Decrease note size"',
      'aria-label="Background"',
      'aria-label="Font"',
      'aria-label="Rotate counterclockwise"',
      'aria-label="Move left"',
      'Duplicate',
      DIVIDER,
      'Reset note',
      'Delete note',
    ])
    expectDangerLast(markup)
  })

  it('orders a text target: appearance, position, divider, reset', () => {
    const markup = render('text:masthead:label')
    expectOrder(markup, [
      'aria-label="Font size"',
      'aria-label="Move left"',
      DIVIDER,
      'Reset text position',
    ])
  })

  it('keeps multi-selection to alignment controls with no danger cluster', () => {
    const markup = render(`account:${accountId}`, SAMPLE_WHITFIELD, [
      `account:${accountId}`,
      `account:${SAMPLE_WHITFIELD.accounts[1].id}`,
    ])
    expectOrder(markup, ['aria-label="Align"', 'aria-label="Distribute"'])
    expect(markup).not.toContain('map-inspector-danger')
    expect(markup).not.toContain(DIVIDER)
  })
})
