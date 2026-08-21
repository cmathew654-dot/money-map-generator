import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { describe, expect, it } from 'vitest'
import { layoutMap } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'
import {
  BOW_SNAP_THRESHOLD,
  snapBow,
} from '../src/render/mapInteraction'

type InspectorControl = ReactElement<{
  'aria-label'?: string
  children?: ReactNode
  onClick?: () => void
}>

function findControl(node: ReactNode, label: string): InspectorControl {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as InspectorControl
    if (element.props['aria-label'] === label) return element
    if (element.props.children !== undefined) {
      try {
        return findControl(element.props.children, label)
      } catch {
        // Keep searching sibling branches.
      }
    }
  }
  throw new Error('Missing inspector control: ' + label)
}

function straighten(data: MoneyMapData): MoneyMapData {
  let changed = data
  const inspector = MapInspector({
    data,
    selectedTargetKey: 'arrow:income',
    onChange: (next) => { changed = next },
    onClose: () => undefined,
    onSelect: () => undefined,
  })
  const button = findControl(inspector, 'Straighten')

  findControl(inspector, 'Decrease curve')
  findControl(inspector, 'Increase curve')
  expect(button.props.children).toBe('Straighten')
  button.props.onClick?.()
  return changed
}

describe('arrow bow editing', () => {
  it('snaps bows at and within the six-unit drag deadband', () => {
    expect(BOW_SNAP_THRESHOLD).toBe(6)
    expect(snapBow(0)).toBe(0)
    expect(snapBow(3)).toBe(0)
    expect(snapBow(-3)).toBe(0)
    expect(snapBow(6)).toBe(0)
    expect(snapBow(-6)).toBe(0)
  })

  it('keeps deliberate bows just beyond the drag deadband unchanged', () => {
    expect(snapBow(6.001)).toBe(6.001)
    expect(snapBow(-6.001)).toBe(-6.001)
    expect(snapBow(40)).toBe(40)
    expect(snapBow(-40)).toBe(-40)
  })

  it('returns the same result for repeated bow inputs without changing them', () => {
    const input = 3

    expect([snapBow(input), snapBow(input)]).toEqual([0, 0])
    expect(input).toBe(3)
  })

  it.each([144, -144])(
    'straightens a selected %i bow while preserving its override and other arrows',
    (bow) => {
      const incomeOverride = {
        bow,
        startT: 0.2,
        endT: 0.8,
        color: 'blue' as const,
        style: 'dotted' as const,
        sw: 5,
        z: 1,
      }
      const asNeededOverride = { bow: -42, color: 'red' as const }
      const next = straighten({
        ...SAMPLE_WHITFIELD,
        layoutOverrides: {
          'arrow:income': incomeOverride,
          'arrow:asNeeded': asNeededOverride,
        },
      })

      expect(next.layoutOverrides?.['arrow:income']).toEqual({
        ...incomeOverride,
        bow: 0,
      })
      expect(next.layoutOverrides?.['arrow:asNeeded']).toEqual(
        asNeededOverride,
      )
    },
  )

  it('creates a zero bow override when the selected arrow has none', () => {
    const asNeededOverride = { bow: -42, color: 'red' as const }
    const next = straighten({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: { 'arrow:asNeeded': asNeededOverride },
    })

    expect(next.layoutOverrides?.['arrow:income']).toEqual({ bow: 0 })
    expect(next.layoutOverrides?.['arrow:asNeeded']).toEqual(asNeededOverride)
  })

  it('puts a zero-bow control at the chord midpoint while default routing remains curved', () => {
    const straight = layoutMap({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: { 'arrow:income': { bow: 0 } },
    }).arrows.find((arrow) => arrow.kind === 'income')!
    const defaultArrow = layoutMap(SAMPLE_WHITFIELD).arrows.find(
      (arrow) => arrow.kind === 'income',
    )!
    const midpoint = {
      x: (straight.start.x + straight.end.x) / 2,
      y: (straight.start.y + straight.end.y) / 2,
    }
    const defaultMidpoint = {
      x: (defaultArrow.start.x + defaultArrow.end.x) / 2,
      y: (defaultArrow.start.y + defaultArrow.end.y) / 2,
    }

    expect(straight.control.x).toBeCloseTo(midpoint.x)
    expect(straight.control.y).toBeCloseTo(midpoint.y)
    expect(
      Math.hypot(
        defaultArrow.control.x - defaultMidpoint.x,
        defaultArrow.control.y - defaultMidpoint.y,
      ),
    ).toBeGreaterThan(1e-6)
  })

})
