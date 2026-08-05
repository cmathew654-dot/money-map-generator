import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { layoutMap } from '../src/layout/layout'
import { newBook, parseBook } from '../src/model/book'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'

type Control = ReactElement<{
  'aria-label'?: string
  children?: ReactNode
  onClick?: () => void
}>

function findControl(node: ReactNode, label: string): Control {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as Control
    if (element.props['aria-label'] === label) return element
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

const withOverrides = (
  layoutOverrides: NonNullable<MoneyMapData['layoutOverrides']>,
): MoneyMapData => ({ ...SAMPLE_WHITFIELD, layoutOverrides })

const inspectorWith = (selectedTargetKey: string, data: MoneyMapData) => {
  const changes: MoneyMapData[] = []
  const node = MapInspector({
    data,
    selectedTargetKey,
    onChange: (next) => { changes.push(next) },
    onClose: () => undefined,
    onSelect: () => undefined,
  })
  return { changes, node }
}

describe('generated-arrow thickness override (s50)', () => {
  it('carries an sw override onto the laid-out income arrow', () => {
    const arrows = layoutMap(withOverrides({ 'arrow:income': { sw: 5 } })).arrows

    expect(arrows.find((arrow) => arrow.kind === 'income')?.sw).toBe(5)
    expect(arrows.find((arrow) => arrow.kind === 'asNeeded')?.sw).toBeUndefined()
  })

  it('carries an sw override onto the laid-out as-needed arrow', () => {
    const arrows = layoutMap(withOverrides({ 'arrow:asNeeded': { sw: 4 } })).arrows

    expect(arrows.find((arrow) => arrow.kind === 'asNeeded')?.sw).toBe(4)
  })

  it('round-trips a valid sw and rejects out-of-range or non-generated sw', () => {
    const book = newBook()
    book.clients[0].layoutOverrides = { 'arrow:income': { sw: 6 } }
    expect(parseBook(JSON.stringify(book)).clients[0].layoutOverrides).toEqual(
      book.clients[0].layoutOverrides,
    )

    for (const bad of [{ 'arrow:income': { sw: 7 } }, { 'arrow:income': { sw: 0 } }]) {
      const broken = newBook()
      broken.clients[0].layoutOverrides = bad
      expect(() => parseBook(JSON.stringify(broken))).toThrow(
        'invalid layout overrides',
      )
    }
  })

  it('steps generated-arrow thickness through the override path', () => {
    const { changes, node } = inspectorWith('arrow:income', SAMPLE_WHITFIELD)

    findControl(node, 'Increase flow thickness').props.onClick?.()
    expect(changes.at(-1)?.layoutOverrides?.['arrow:income']?.sw).toBe(3)

    const thin = inspectorWith('arrow:asNeeded', withOverrides({
      'arrow:asNeeded': { sw: 1 },
    }))
    findControl(thin.node, 'Decrease flow thickness').props.onClick?.()
    expect(thin.changes.at(-1)?.layoutOverrides?.['arrow:asNeeded']?.sw).toBe(1)
  })
})
