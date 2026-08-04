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
import {
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  type MoneyMapData,
} from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'
import { MapSvg } from '../src/render/MapSvg'
import { TYPE } from '../src/render/tokens'

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
  throw new Error(`Missing inspector control: ${label}`)
}

const noteData = (fs?: number): MoneyMapData => ({
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'audit-note', text: 'Keep this visible', x: 500, y: 400, fs }],
})

function press(label: string, data: MoneyMapData): MoneyMapData {
  let next = data
  const inspector = MapInspector({
    data,
    selectedTargetKey: 'note:audit-note',
    onChange: (updated: MoneyMapData) => {
      next = updated
    },
    onClose: () => undefined,
    onSelect: () => undefined,
  })
  findControl(inspector, label).props.onClick?.()
  return next
}

const noteFs = (data: MoneyMapData) => data.notes?.[0].fs

const renderedFontSize = (data: MoneyMapData) =>
  renderToStaticMarkup(createElement(MapSvg, { data }))
    .match(/class="map-note-text"[^>]*font-size="([\d.]+)"/)?.[1]

describe('note size buttons drive font size', () => {
  it('raises the note font size by 2 and the rendered markup follows', () => {
    const next = press('Increase note size', noteData(16))

    expect(noteFs(next)).toBe(18)
    expect(renderedFontSize(next)).toBe('18')
  })

  it('lowers the note font size by 2 from the default when unset', () => {
    const next = press('Decrease note size', noteData())

    expect(noteFs(next)).toBe(TYPE.note - 2)
    expect(renderedFontSize(next)).toBe(String(TYPE.note - 2))
  })

  it('leaves the note width untouched', () => {
    const next = press('Increase note size', noteData(16))

    expect(next.notes?.[0].w).toBeUndefined()
  })

  it('clamps at both font size bounds', () => {
    expect(noteFs(press('Decrease note size', noteData(MIN_MAP_TEXT_FONT_SIZE))))
      .toBe(MIN_MAP_TEXT_FONT_SIZE)
    expect(noteFs(press('Increase note size', noteData(MAX_MAP_TEXT_FONT_SIZE))))
      .toBe(MAX_MAP_TEXT_FONT_SIZE)
  })
})
