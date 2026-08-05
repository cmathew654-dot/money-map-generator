import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'

type InspectorControl = ReactElement<{
  'aria-label'?: string
  children?: ReactNode
  onClick?: () => void
}>

function findControl(node: ReactNode, label: string): InspectorControl {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as InspectorControl
    if (element.props['aria-label'] === label || element.props.children === label) return element
    if (typeof element.type === 'function') {
      try {
        return findControl(
          (element.type as (props: unknown) => ReactNode)(element.props),
          label,
        )
      } catch {
        // Keep searching sibling branches.
      }
    }
    if (element.props.children !== undefined) {
      try {
        return findControl(element.props.children, label)
      } catch {
        // Keep searching sibling branches.
      }
    }
  }
  throw new Error(`Missing inspector control: ${label}`)
}

const NOTE_DATA: MoneyMapData = {
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'audit-note', text: 'Keep this visible', x: 500, y: 400 }],
}
const FOOTNOTE_KEY = `text:footnotes:line:${SAMPLE_WHITFIELD.footnotes[0].id}`

const inspect = (selectedTargetKey: string, data: MoneyMapData, changes: MoneyMapData[]) =>
  MapInspector({
    data,
    selectedTargetKey,
    onChange: (next) => { changes.push(next) },
    onClose: () => undefined,
    onSelect: () => undefined,
  })

const markupFor = (selectedTargetKey: string, data: MoneyMapData = SAMPLE_WHITFIELD) =>
  renderToStaticMarkup(
    createElement(MapInspector, {
      data,
      selectedTargetKey,
      onChange: () => undefined,
      onClose: () => undefined,
      onSelect: () => undefined,
    }),
  )

const rotate = (
  selectedTargetKey: string,
  direction: 'Rotate clockwise' | 'Rotate counterclockwise',
  data: MoneyMapData,
) => {
  const changes: MoneyMapData[] = []
  findControl(inspect(selectedTargetKey, data, changes), direction).props.onClick?.()
  return changes.at(-1)
}

describe('inspector rotation control coverage', () => {
  it.each([
    ['as-needed chip', 'asNeededChip', SAMPLE_WHITFIELD],
    ['note', 'note:audit-note', NOTE_DATA],
    ['footnote line', FOOTNOTE_KEY, SAMPLE_WHITFIELD],
  ])('renders the rotate control for %s selections', (_name, key, data) => {
    const markup = markupFor(key, data)
    expect(markup).toContain('aria-label="Rotate counterclockwise"')
    expect(markup).toContain('aria-label="Rotate clockwise"')
  })

  it.each([
    ['as-needed chip', 'asNeededChip', SAMPLE_WHITFIELD],
    ['note', 'note:audit-note', NOTE_DATA],
    ['footnote line', FOOTNOTE_KEY, SAMPLE_WHITFIELD],
  ])('writes rot on the %s override key', (_name, key, data) => {
    expect(rotate(key, 'Rotate clockwise', data)?.layoutOverrides?.[key]?.rot).toBe(5)
    expect(rotate(key, 'Rotate counterclockwise', data)?.layoutOverrides?.[key]?.rot).toBe(355)
  })

  it('increments from the existing rot on the override key', () => {
    const data = {
      ...NOTE_DATA,
      layoutOverrides: { 'note:audit-note': { color: 'blue' as const, rot: 30 } },
    }
    const next = rotate('note:audit-note', 'Rotate clockwise', data)
    expect(next?.layoutOverrides?.['note:audit-note']).toEqual({ color: 'blue', rot: 35 })
  })

  it('resets note rotation with the Reset note action', () => {
    const changes: MoneyMapData[] = []
    const inspector = inspect(
      'note:audit-note',
      { ...NOTE_DATA, layoutOverrides: { 'note:audit-note': { rot: 45 } } },
      changes,
    )
    findControl(inspector, 'Reset note').props.onClick?.()
    expect(changes.at(-1)?.layoutOverrides?.['note:audit-note']?.rot ?? 0).toBe(0)
  })

  it('keeps the rotate control on account selections', () => {
    const markup = markupFor('account:cash-at-bank')
    expect(markup).toContain('aria-label="Rotate clockwise"')
    expect(rotate('account:cash-at-bank', 'Rotate clockwise', SAMPLE_WHITFIELD)
      ?.layoutOverrides?.['cash-at-bank']?.rot).toBe(5)
  })
})
