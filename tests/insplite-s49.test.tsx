import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { newBook, parseBook } from '../src/model/book'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'
import { MapSvg } from '../src/render/MapSvg'
import { ARROW_COLORS } from '../src/render/tokens'

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

const arrowId = SAMPLE_WHITFIELD.customArrows![0].id
const arrowKey = `arrow:custom:${arrowId}`

const withArrow = (patch: Record<string, unknown>): MoneyMapData => ({
  ...SAMPLE_WHITFIELD,
  customArrows: SAMPLE_WHITFIELD.customArrows!.map((arrow) =>
    arrow.id === arrowId ? { ...arrow, ...patch } : arrow,
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

const savedArrow = (data: MoneyMapData | undefined) =>
  data?.customArrows?.find((arrow) => arrow.id === arrowId)

describe('lighter map inspector bar (s49)', () => {
  it('drops the endpoint nudge groups from custom flow controls', () => {
    const markup = renderInspector(arrowKey)

    expect(markup).not.toContain('Start point')
    expect(markup).not.toContain('End point')
    // The remaining flow controls survive.
    for (const label of ['Style', 'Color', 'Curve', 'From', 'To', 'Reset flow']) {
      expect(markup).toContain(label)
    }
  })

  it('drops the endpoint nudge groups from generated flow controls', () => {
    const markup = renderInspector('arrow:income')

    expect(markup).not.toContain('Start point')
    expect(markup).not.toContain('End point')
    expect(markup).toContain('Hide flow')
  })

  it('collapses the flow color row into one swatch button plus a popover', () => {
    const markup = renderInspector(arrowKey, withArrow({ color: 'blue' }))

    expect(markup).toContain('aria-label="Flow color"')
    // HTML attribute names are case-insensitive; React serializes this one camelCase.
    expect(markup).toMatch(/popovertarget="map-inspector-flow-colors"/i)
    expect(markup).toMatch(/<div[^>]*popover="auto"/)
    // Trigger previews the arrow's current color.
    expect(markup).toMatch(
      new RegExp(`aria-label="Flow color"[^>]*background-color:${ARROW_COLORS.blue}`),
    )
  })

  it('keeps every swatch option inside the popover with its pressed state', () => {
    const markup = renderInspector(arrowKey, withArrow({ color: 'blue' }))
    const popover = /<div[^>]*popover="auto"[^>]*>(.*?)<\/div>/s.exec(markup)?.[1] ?? ''

    for (const color of ['Green', 'Ink', 'Blue', 'Gold', 'Teal', 'Purple', 'Red']) {
      expect(popover).toContain(`aria-label="${color} flow color"`)
    }
    expect(popover).toMatch(
      /aria-label="Blue flow color"[^>]*aria-pressed="true"/,
    )
  })

  it('applies a popover swatch through the existing custom arrow color path', () => {
    const { changes, node } = inspectorWith(arrowKey, SAMPLE_WHITFIELD)

    findControl(node, 'Red flow color').props.onClick?.()

    expect(savedArrow(changes.at(-1))?.color).toBe('red')
  })

  it('steps a per-arrow thickness override for custom flows', () => {
    const custom = renderInspector(arrowKey)

    expect(custom).toContain('Thickness')
    expect(custom).toContain('aria-label="Increase flow thickness"')
    // s50: generated flows gained the same control; non-flow selections have none.
    expect(renderInspector('income')).not.toContain('Thickness')
  })

  it('round-trips the thickness override through model and persistence', () => {
    const { changes, node } = inspectorWith(arrowKey, SAMPLE_WHITFIELD)

    findControl(node, 'Increase flow thickness').props.onClick?.()
    expect(savedArrow(changes.at(-1))?.sw).toBe(3)

    const thin = inspectorWith(arrowKey, withArrow({ sw: 1 }))
    findControl(thin.node, 'Decrease flow thickness').props.onClick?.()
    expect(savedArrow(thin.changes.at(-1))?.sw).toBe(1)

    const book = newBook()
    book.clients[0] = { ...book.clients[0], customArrows: [
      { id: 'flow-1', sourceId: 'income', targetId: 'need', style: 'solid', sw: 4 },
    ] }
    expect(parseBook(JSON.stringify(book))).toEqual(book)

    const bad = structuredClone(book) as Record<string, any>
    bad.clients[0].customArrows[0].sw = 'thick'
    expect(() => parseBook(JSON.stringify(bad))).toThrow()
  })

  it('renders the custom flow at its overridden stroke width', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, { data: withArrow({ sw: 5 }) }),
    )
    const path = /<path[^>]*data-arrow-kind="custom"[^>]*>/.exec(markup)?.[0] ?? ''

    expect(path).toContain('stroke-width="5"')
    expect(markup).toMatch(/data-arrow-kind="income"[^>]*stroke-width="2"/)
  })
})
