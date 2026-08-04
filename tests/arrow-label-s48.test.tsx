import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'
import { MapSvg } from '../src/render/MapSvg'
import { setCustomArrowLabel } from '../src/render/mapInteraction'

const arrowId = SAMPLE_WHITFIELD.customArrows![0].id

const labelOf = (data: MoneyMapData) =>
  data.customArrows?.find((arrow) => arrow.id === arrowId)?.label

const withLabel = (label: string): MoneyMapData => ({
  ...SAMPLE_WHITFIELD,
  customArrows: SAMPLE_WHITFIELD.customArrows!.map((arrow) =>
    arrow.id === arrowId ? { ...arrow, label } : arrow,
  ),
})

const renderInspector = (selectedTargetKey: string, data = SAMPLE_WHITFIELD) =>
  renderToStaticMarkup(
    createElement(MapInspector, {
      data,
      selectedTargetKey,
      onChange: () => undefined,
      onClose: () => undefined,
      onSelect: () => undefined,
    }),
  )

describe('custom flow labels', () => {
  it('sets a label on a custom arrow', () => {
    expect(labelOf(setCustomArrowLabel(SAMPLE_WHITFIELD, arrowId, 'College funding')))
      .toBe('College funding')
  })

  it('clears the label when given empty or whitespace text', () => {
    const labeled = setCustomArrowLabel(SAMPLE_WHITFIELD, arrowId, 'College funding')
    expect(labelOf(setCustomArrowLabel(labeled, arrowId, ''))).toBeUndefined()
    expect(labelOf(setCustomArrowLabel(labeled, arrowId, '   '))).toBeUndefined()
  })

  it('ignores unknown arrow ids', () => {
    expect(setCustomArrowLabel(SAMPLE_WHITFIELD, 'nope', 'x')).toBe(SAMPLE_WHITFIELD)
  })

  it('renders the label text on the map', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, { data: setCustomArrowLabel(SAMPLE_WHITFIELD, arrowId, 'College funding') }),
    )
    expect(markup).toContain('College funding')
  })

  it('shows the label input for custom flows only', () => {
    expect(renderInspector(`arrow:custom:${arrowId}`)).toContain('aria-label="Label"')
    expect(renderInspector('arrow:income')).not.toContain('aria-label="Label"')
  })

  it('seeds the input with the existing label', () => {
    expect(renderInspector(`arrow:custom:${arrowId}`, withLabel('College funding')))
      .toContain('value="College funding"')
  })
})
