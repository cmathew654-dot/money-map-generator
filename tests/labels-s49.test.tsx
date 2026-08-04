import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mapSvgSource from '../src/render/MapSvg.tsx?raw'
import { asNeededChipFontSize } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg } from '../src/render/MapSvg'
import { TYPE } from '../src/render/tokens'
import type { MoneyMapData } from '../src/model/types'
import {
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  mapTextOverrideKey,
} from '../src/model/types'
import {
  applyMapTextFontSize,
  mapTextEditFsInfo,
} from '../src/ui/MapTextEditor'

const arrowId = SAMPLE_WHITFIELD.customArrows![0].id

const withFlowLabel = (label: string): MoneyMapData => ({
  ...SAMPLE_WHITFIELD,
  customArrows: SAMPLE_WHITFIELD.customArrows!.map((arrow) =>
    arrow.id === arrowId ? { ...arrow, label } : arrow,
  ),
})

const chipKey = mapTextOverrideKey('asNeeded', 'amount')

const withChipFs = (fs: number): MoneyMapData => ({
  ...SAMPLE_WHITFIELD,
  layoutOverrides: { ...SAMPLE_WHITFIELD.layoutOverrides, [chipKey]: { fs } },
})

const render = (data: MoneyMapData, editable = false) =>
  renderToStaticMarkup(
    createElement(
      MapSvg,
      editable ? { data, onChange: () => undefined } : { data },
    ),
  )

describe('flow label z-order', () => {
  it('renders every flow label after the accounts layer in the source tree', () => {
    const accountsAt = mapSvgSource.indexOf('aria-label="Accounts"')
    expect(accountsAt).toBeGreaterThan(-1)
    const usages = [...mapSvgSource.matchAll(/<FlowArrowLabel/g)].map(
      (match) => match.index!,
    )
    expect(usages.length).toBeGreaterThan(0)
    for (const at of usages) expect(at).toBeGreaterThan(accountsAt)
  })

  it('paints the label markup after the accounts group (read-only)', () => {
    const markup = render(withFlowLabel('College funding'))
    expect(markup).toContain('College funding')
    expect(markup.indexOf('College funding')).toBeGreaterThan(
      markup.indexOf('aria-label="Accounts"'),
    )
  })

  it('paints the label markup after the accounts group (editable)', () => {
    const markup = render(withFlowLabel('College funding'), true)
    expect(markup.indexOf('College funding')).toBeGreaterThan(
      markup.indexOf('aria-label="Accounts"'),
    )
  })
})

describe('as-needed chip font size', () => {
  it('falls back to the arrow label size', () => {
    expect(asNeededChipFontSize(SAMPLE_WHITFIELD)).toBe(TYPE.arrowLabel)
  })

  it('reads the stored override', () => {
    expect(asNeededChipFontSize(withChipFs(22))).toBe(22)
  })

  it('clamps the override to the map text range', () => {
    expect(asNeededChipFontSize(withChipFs(2))).toBe(MIN_MAP_TEXT_FONT_SIZE)
    expect(asNeededChipFontSize(withChipFs(400))).toBe(MAX_MAP_TEXT_FONT_SIZE)
  })

  it('renders the chip text at the overridden size', () => {
    expect(render(withChipFs(22))).toContain('font-size="22"')
  })

  it('exposes an fs target so the A-/A+ pill can drive the chip', () => {
    const info = mapTextEditFsInfo(SAMPLE_WHITFIELD, { kind: 'asNeededAmount' })
    expect(info).toEqual({
      key: chipKey,
      fallback: TYPE.arrowLabel,
      max: MAX_MAP_TEXT_FONT_SIZE,
    })
  })

  it('writes the chip font size into layout overrides', () => {
    const next = applyMapTextFontSize(
      SAMPLE_WHITFIELD,
      { kind: 'asNeededAmount' },
      22,
    )
    expect(next.layoutOverrides?.[chipKey]?.fs).toBe(22)
    expect(asNeededChipFontSize(next)).toBe(22)
  })
})
