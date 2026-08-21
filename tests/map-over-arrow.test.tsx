import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { parseBook } from '../src/model/book'
import * as layout from '../src/layout/layout'
import {
  layoutMap,
  pointOnOutline,
  type OutlineElement,
} from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'
import { MapSvg } from '../src/render/MapSvg'

const [firstCustomArrow, secondCustomArrow] = SAMPLE_WHITFIELD.customArrows!

const withOverrides = (
  layoutOverrides: NonNullable<MoneyMapData['layoutOverrides']>,
): MoneyMapData => ({
  ...SAMPLE_WHITFIELD,
  layoutOverrides,
})

const renderMap = (data: MoneyMapData, interactive = false) =>
  renderToStaticMarkup(
    createElement(MapSvg, {
      data,
      onChange: interactive ? () => undefined : undefined,
    }),
  )

const arrowIndex = (
  markup: string,
  data: MoneyMapData,
  matches: (arrow: ReturnType<typeof layoutMap>['arrows'][number]) => boolean,
) => {
  const arrow = layoutMap(data).arrows.find(matches)
  if (!arrow) throw new Error('Expected arrow to exist')
  return markup.indexOf(`d="${arrow.d}"`)
}

const accountsIndex = (markup: string) => markup.indexOf('aria-label="Accounts"')

describe('over-shapes arrow rendering', () => {
  it('keeps a custom arrow without an override before accounts', () => {
    const markup = renderMap(SAMPLE_WHITFIELD, true)

    expect(
      arrowIndex(
        markup,
        SAMPLE_WHITFIELD,
        (arrow) => arrow.kind === 'custom' && arrow.id === firstCustomArrow.id,
      ),
    ).toBeLessThan(accountsIndex(markup))
  })

  it('paints an opted-in custom arrow after accounts', () => {
    const data = withOverrides({ [`arrow:custom:${firstCustomArrow.id}`]: { z: 1 } })
    const markup = renderMap(data, true)

    expect(
      arrowIndex(
        markup,
        data,
        (arrow) => arrow.kind === 'custom' && arrow.id === firstCustomArrow.id,
      ),
    ).toBeGreaterThan(accountsIndex(markup))
  })

  it('keeps non-opted arrows before accounts when another arrow opts in', () => {
    const data = withOverrides({ [`arrow:custom:${firstCustomArrow.id}`]: { z: 1 } })
    const markup = renderMap(data, true)

    expect(
      arrowIndex(
        markup,
        data,
        (arrow) => arrow.kind === 'custom' && arrow.id === secondCustomArrow.id,
      ),
    ).toBeLessThan(accountsIndex(markup))
  })

  it('partitions opted-in arrows in the read-only render path', () => {
    const data = withOverrides({ [`arrow:custom:${firstCustomArrow.id}`]: { z: 1 } })
    const markup = renderMap(data)

    expect(
      arrowIndex(
        markup,
        data,
        (arrow) => arrow.kind === 'custom' && arrow.id === firstCustomArrow.id,
      ),
    ).toBeGreaterThan(accountsIndex(markup))
  })

  it('paints an opted-in generated arrow after accounts', () => {
    const data = withOverrides({ 'arrow:income': { z: 1 } })
    const markup = renderMap(data, true)

    expect(
      arrowIndex(markup, data, (arrow) => arrow.kind === 'income'),
    ).toBeGreaterThan(accountsIndex(markup))
  })
})
type InspectorControl = ReactElement<{
  'aria-label'?: string
  children?: ReactNode
  onClick?: () => void
}>

const topOutlineT = (
  layout as typeof layout & {
    topOutlineT?: (element: OutlineElement) => number
  }
).topOutlineT

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

const findOptionalControl = (node: ReactNode, label: string) => {
  try {
    return findControl(node, label)
  } catch {
    return undefined
  }
}

const renderInspector = (data = SAMPLE_WHITFIELD) =>
  renderToStaticMarkup(
    createElement(MapInspector, {
      data,
      selectedTargetKey: arrowKey,
      onChange: () => undefined,
      onClose: () => undefined,
      onSelect: () => undefined,
    }),
  )

const arrowKey = 'arrow:custom:' + firstCustomArrow.id

const outlineFor = (data: MoneyMapData, id: string | undefined) => {
  const map = layoutMap(data)
  if (id === 'income') return map.income
  if (id === 'need') return map.need
  return map.accounts.find((placed) => placed.account.id === id)
}

const selectedArrow = (data: MoneyMapData) =>
  layoutMap(data).arrows.find(
    (arrow) => arrow.kind === 'custom' && arrow.id === firstCustomArrow.id,
  )

const clickOver = (data: MoneyMapData) => {
  const changes: MoneyMapData[] = []
  const inspector = MapInspector({
    data,
    selectedTargetKey: arrowKey,
    onChange: (next) => {
      changes.push(next)
    },
    onClose: () => undefined,
    onSelect: () => undefined,
  })
  findOptionalControl(inspector, 'Route flow over shapes')?.props.onClick?.()
  return changes
}

const accountOutline = (
  shape: 'drum' | 'card' | 'pill' | 'rect',
  width: number,
  height: number,
): OutlineElement => ({
  x: 120,
  y: 220,
  w: width,
  h: height,
  capRy: shape === 'drum' ? 18 : 0,
  account: {
    id: 'outline-' + shape,
    bucket: 'cash',
    label: shape,
    shape,
    value: null,
  },
} as OutlineElement)

describe('over-shapes routing', () => {
  it('derives the top centre from every outline shape', () => {
    expect(topOutlineT).toBeTypeOf('function')
    if (!topOutlineT) return
    const elements: OutlineElement[] = [
      accountOutline('drum', 220, 150),
      accountOutline('card', 260, 150),
      accountOutline('pill', 430, 50),
      accountOutline('rect', 260, 150),
      { x: 120, y: 220, w: 240, h: 130 },
    ]

    for (const element of elements) {
      const point = pointOnOutline(element, topOutlineT(element))
      expect(Math.abs(point.y - element.y)).toBeLessThanOrEqual(1)
      expect(Math.abs(point.x - (element.x + element.w / 2))).toBeLessThanOrEqual(1)
    }
  })

  it('keeps topOutlineT pure', () => {
    expect(topOutlineT).toBeTypeOf('function')
    if (!topOutlineT) return
    const element = accountOutline('pill', 420, 54)
    const before = structuredClone(element)

    expect(topOutlineT(element)).toBe(topOutlineT(element))
    expect(element).toEqual(before)
  })

  it('renders an unpressed over-shapes routing control', () => {
    const markup = renderInspector()

    expect(markup).toMatch(
      /aria-label="Route flow over shapes"[^>]*aria-pressed="false"/,
    )
  })

  it('applies attachment, bow, and paint order in one data change', () => {
    const changes = clickOver(SAMPLE_WHITFIELD)

    expect(changes).toHaveLength(1)
    const next = changes[0]
    if (!next || !topOutlineT) return
    const source = outlineFor(SAMPLE_WHITFIELD, firstCustomArrow.sourceId)
    const target = outlineFor(SAMPLE_WHITFIELD, firstCustomArrow.targetId)
    if (!source || !target) return
    const override = next.layoutOverrides?.[arrowKey]

    expect(override?.z).toBeGreaterThan(0)
    expect(override?.startT).toBe(topOutlineT(source))
    expect(override?.endT).toBe(topOutlineT(target))
    expect(override?.startAt).toBeUndefined()
    expect(override?.endAt).toBeUndefined()
  })

  it('lifts the resulting arc above its chord and source shape', () => {
    const changes = clickOver(SAMPLE_WHITFIELD)

    expect(changes).toHaveLength(1)
    const next = changes[0]
    if (!next) return
    const arrow = selectedArrow(next)
    const source = outlineFor(next, firstCustomArrow.sourceId)
    if (!arrow || !source) return
    const midpoint = {
      x: (arrow.start.x + 2 * arrow.control.x + arrow.end.x) / 4,
      y: (arrow.start.y + 2 * arrow.control.y + arrow.end.y) / 4,
    }

    expect(midpoint.y).toBeLessThan((arrow.start.y + arrow.end.y) / 2)
    expect(midpoint.y).toBeLessThan(source.y)
  })

  it('restores every captured field after toggling over-shapes off', () => {
    const original = {
      z: -3,
      bow: 37,
      startT: 0.173,
      endT: 0.781,
      startAt: { dx: 11, dy: -13 },
      endAt: { dx: -17, dy: 19 },
    }
    const data = withOverrides({ [arrowKey]: original })
    const enabledChanges = clickOver(data)

    expect(enabledChanges).toHaveLength(1)
    const enabled = enabledChanges[0]
    if (!enabled) return
    const restoredChanges = clickOver(enabled)

    expect(restoredChanges).toHaveLength(1)
    const restored = restoredChanges[0]
    if (!restored) return
    expect(restored.layoutOverrides).toEqual({ [arrowKey]: original })
  })

  it('leaves no routing fields behind when toggled off without a prior override', () => {
    const enabledChanges = clickOver(SAMPLE_WHITFIELD)

    expect(enabledChanges).toHaveLength(1)
    const enabled = enabledChanges[0]
    if (!enabled) return
    const restoredChanges = clickOver(enabled)

    expect(restoredChanges).toHaveLength(1)
    const restored = restoredChanges[0]
    if (!restored) return
    expect(restored.layoutOverrides).toBeUndefined()
  })

  it('does not change another arrow override', () => {
    const siblingKey = 'arrow:custom:' + secondCustomArrow.id
    const data = withOverrides({ [siblingKey]: { bow: 41 } })
    const changes = clickOver(data)

    expect(changes).toHaveLength(1)
    const next = changes[0]
    if (!next) return
    expect(next.layoutOverrides?.[siblingKey]).toEqual({ bow: 41 })
  })

  it('round-trips the enabled override and its capture through parseBook', () => {
    const changes = clickOver(SAMPLE_WHITFIELD)

    expect(changes).toHaveLength(1)
    const enabled = changes[0]
    if (!enabled) return
    const book = {
      fileType: 'money-map-book' as const,
      version: 1 as const,
      clients: [enabled],
    }
    const parsed = parseBook(JSON.stringify(book))
    const captureKey = arrowKey + ':over'

    expect(parsed.clients[0].layoutOverrides?.[arrowKey]).toEqual(
      enabled.layoutOverrides?.[arrowKey],
    )
    expect(parsed.clients[0].layoutOverrides?.[captureKey]).toEqual(
      enabled.layoutOverrides?.[captureKey],
    )
  })
})

describe('default over-shapes rendering', () => {
  it('keeps the sample markup byte-identical with an empty override bag', () => {
    const defaultMarkup = renderMap(SAMPLE_WHITFIELD)
    const emptyOverridesMarkup = renderMap({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {},
    })

    expect(emptyOverridesMarkup).toBe(defaultMarkup)
    expect(defaultMarkup).not.toContain('aria-label="Money flow over shapes"')
  })
})
