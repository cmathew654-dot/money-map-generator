import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import mapSvgSource from '../src/render/MapSvg.tsx?raw'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg } from '../src/render/MapSvg'
import { mapTextOverrideKey } from '../src/model/types'
import {
  applyMapTextEdit,
  mapTextEditFsInfo,
  mapTextEditRawValue,
  mapTextEditTargetKey,
} from '../src/ui/MapTextEditor'

const sources = SAMPLE_WHITFIELD.incomeSources
const first = sources[0]
const second = sources[1]

const nameEdit = (index: number) =>
  ({
    kind: 'incomeRowLabel',
    incomeIndex: index,
    incomeId: sources[index].id,
  }) as const

const amountEdit = (index: number) =>
  ({
    kind: 'incomeAmount',
    incomeIndex: index,
    incomeId: sources[index].id,
  }) as const

describe('income row name is its own edit target', () => {
  it('renders the name run with the incomeRowLabel kind, not incomeAmount', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data: SAMPLE_WHITFIELD,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )
    expect(markup).toContain(
      `data-map-edit-key="incomeRowLabel:${first.id}"`,
    )
    expect(markup).toContain(`data-map-edit-key="incomeAmount:${first.id}"`)
  })

  it('gives the name run its own double-click handler (editableTextProps)', () => {
    const rowAt = mapSvgSource.indexOf('function IncomeRow(')
    const rowEnd = mapSvgSource.indexOf('function IncomePanel(')
    const body = mapSvgSource.slice(rowAt, rowEnd)
    expect(rowAt).toBeGreaterThan(-1)
    expect(body).toContain("kind: 'incomeRowLabel'")
    expect(body).toContain('editableTextProps(')
  })

  it('keys name targets per row and apart from the amount target', () => {
    expect(mapTextEditTargetKey(nameEdit(0))).not.toBe(
      mapTextEditTargetKey(nameEdit(1)),
    )
    expect(mapTextEditTargetKey(nameEdit(0))).not.toBe(
      mapTextEditTargetKey(amountEdit(0)),
    )
  })
})

describe('income row name edits', () => {
  it('seeds the editor with the current name', () => {
    expect(mapTextEditRawValue(SAMPLE_WHITFIELD, nameEdit(0))).toBe(first.label)
  })

  it('writes the trimmed name to that row only', () => {
    const next = applyMapTextEdit(SAMPLE_WHITFIELD, nameEdit(0), '  Pension  ')
    expect(next.incomeSources[0].label).toBe('Pension')
    expect(next.incomeSources[0].amount).toBe(first.amount)
    expect(next.incomeSources[1].label).toBe(second.label)
  })

  it('keeps the old name when the commit is empty', () => {
    const next = applyMapTextEdit(SAMPLE_WHITFIELD, nameEdit(0), '   ')
    expect(next.incomeSources[0].label).toBe(first.label)
  })

  it('leaves the amount path untouched', () => {
    const next = applyMapTextEdit(SAMPLE_WHITFIELD, amountEdit(0), '$4,200')
    expect(next.incomeSources[0].amount).toBe(4200)
    expect(next.incomeSources[0].label).toBe(first.label)
  })

  it('reuses the income row font-size override key', () => {
    const rowKey = mapTextOverrideKey('income', 'row')
    expect(mapTextEditFsInfo(SAMPLE_WHITFIELD, nameEdit(0))?.key).toBe(rowKey)
    expect(mapTextEditFsInfo(SAMPLE_WHITFIELD, nameEdit(0))).toEqual(
      mapTextEditFsInfo(SAMPLE_WHITFIELD, amountEdit(0)),
    )
  })
})
