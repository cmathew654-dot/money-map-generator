import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  footnoteLineLayouts,
  layoutMap,
  layoutOverrideRect,
} from '../src/layout/layout'
import { SAMPLE_CALLOWAY } from '../src/model/samples'
import { mapItemTextOverrideKey } from '../src/model/types'
import type { MoneyMapData } from '../src/model/types'
import { MapSvg } from '../src/render/MapSvg'

const NOTE_ID = 'note-rot'
const FOOTNOTE_ID = SAMPLE_CALLOWAY.footnotes[0].id

const withNote = (): MoneyMapData => {
  const data = structuredClone(SAMPLE_CALLOWAY)
  data.notes = [
    { id: NOTE_ID, text: 'Rotation note', x: 400, y: 900, w: 220 },
  ]
  return data
}

const render = (data: MoneyMapData) =>
  renderToStaticMarkup(createElement(MapSvg, { data }))

describe('rotation transforms on chip, notes and footnote lines', () => {
  it('rotates the as-needed chip group around the chip center', () => {
    const data = withNote()
    data.layoutOverrides = { asNeededChip: { rot: 17 } }
    const rect = layoutOverrideRect(data, 'asNeededChip')!

    expect(render(data)).toContain(
      `rotate(17 ${rect.x + rect.w / 2} ${rect.y + rect.h / 2})`,
    )
  })

  it('rotates a note group around the note center and keeps the color box', () => {
    const data = withNote()
    data.layoutOverrides = { [`note:${NOTE_ID}`]: { rot: -25, color: 'blue' } }
    const placed = layoutMap(data).notes.find(
      (candidate) => candidate.note.id === NOTE_ID,
    )!
    const markup = render(data)

    expect(markup).toContain(
      `rotate(-25 ${placed.x + placed.w / 2} ${placed.y + placed.h / 2})`,
    )
    expect(markup).toContain('data-note-color="blue"')
  })

  it('rotates a footnote line group around the line center', () => {
    const data = withNote()
    const key = mapItemTextOverrideKey('footnotes', 'line', FOOTNOTE_ID)
    expect(key.startsWith('text:footnotes:')).toBe(true)
    data.layoutOverrides = { [key]: { rot: 8 } }
    const line = footnoteLineLayouts(data, layoutMap(data).footnotesAt.y).find(
      (candidate) => candidate.footnote.id === FOOTNOTE_ID,
    )!
    const cy = line.y - line.fontSize - 3 + (line.fontSize + 9) / 2

    expect(render(data)).toContain(
      `rotate(8 ${layoutMap(data).footnotesAt.x} ${cy})`,
    )
  })

  it('renders no rotate transform when no rot override is present', () => {
    expect(render(withNote())).not.toContain('rotate(')
  })
})
