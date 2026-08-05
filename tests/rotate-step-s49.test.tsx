import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'

type Control = ReactElement<{ 'aria-label'?: string; children?: ReactNode; onClick?: () => void }>

function findControl(node: ReactNode, label: string): Control {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as Control
    if (element.props['aria-label'] === label) return element
    if (typeof element.type === 'function') {
      try {
        return findControl((element.type as (props: unknown) => ReactNode)(element.props), label)
      } catch {
        // keep searching siblings
      }
    }
    if (element.props.children !== undefined) {
      try {
        return findControl(element.props.children, label)
      } catch {
        // keep searching siblings
      }
    }
  }
  throw new Error(`Missing inspector control: ${label}`)
}

const NOTE_DATA: MoneyMapData = {
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'step-note', text: 'Fine rotation', x: 500, y: 400 }],
}
const FOOTNOTE_KEY = `text:footnotes:line:${SAMPLE_WHITFIELD.footnotes[0].id}`

const rotate = (
  selectedTargetKey: string,
  direction: 'Rotate clockwise' | 'Rotate counterclockwise',
  data: MoneyMapData,
) => {
  const changes: MoneyMapData[] = []
  const inspector = MapInspector({
    data,
    selectedTargetKey,
    onChange: (next) => { changes.push(next) },
    onClose: () => undefined,
    onSelect: () => undefined,
  })
  findControl(inspector, direction).props.onClick?.()
  return changes.at(-1)
}

describe('inspector rotate step is 5 degrees', () => {
  it('steps accounts by 5 degrees per click', () => {
    expect(rotate('account:cash-at-bank', 'Rotate clockwise', SAMPLE_WHITFIELD)
      ?.layoutOverrides?.['cash-at-bank']?.rot).toBe(5)
    expect(rotate('account:cash-at-bank', 'Rotate counterclockwise', SAMPLE_WHITFIELD)
      ?.layoutOverrides?.['cash-at-bank']?.rot).toBe(355)
  })

  it.each([
    ['note', 'note:step-note', NOTE_DATA],
    ['footnote line', FOOTNOTE_KEY, SAMPLE_WHITFIELD],
    ['as-needed chip', 'asNeededChip', SAMPLE_WHITFIELD],
  ])('steps %s selections by 5 degrees per click', (_name, key, data) => {
    expect(rotate(key, 'Rotate clockwise', data)?.layoutOverrides?.[key]?.rot).toBe(5)
    expect(rotate(key, 'Rotate counterclockwise', data)?.layoutOverrides?.[key]?.rot).toBe(355)
  })

  it('increments from the existing rotation', () => {
    const data = {
      ...NOTE_DATA,
      layoutOverrides: { 'note:step-note': { color: 'blue' as const, rot: 30 } },
    }
    expect(rotate('note:step-note', 'Rotate clockwise', data)?.layoutOverrides?.['note:step-note'])
      .toEqual({ color: 'blue', rot: 35 })
  })
})
