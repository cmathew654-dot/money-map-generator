import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg, rotateHandleTarget } from '../src/render/MapSvg'
import { snapRotation, withOverride } from '../src/render/mapInteraction'

const FOOTNOTE_KEY = `text:footnotes:line:${SAMPLE_WHITFIELD.footnotes[0].id}`
const NOTE_KEY = 'note:rot-note'

const data = {
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'rot-note', text: 'Rotate me', x: 520, y: 420 }],
}

function render(selectedTargetKey?: string | null) {
  return renderToStaticMarkup(
    <MapSvg
      data={data}
      onChange={() => undefined}
      onElementClick={() => undefined}
      selectedTargetKey={selectedTargetKey}
    />,
  )
}

describe('free-rotate drag handle', () => {
  it('renders no rotate handle when nothing is selected', () => {
    expect(render()).not.toContain('data-pointer-action="rotate"')
  })

  it('renders no rotate handle in the read-only map', () => {
    const markup = renderToStaticMarkup(
      <MapSvg data={data} selectedTargetKey={NOTE_KEY} />,
    )
    expect(markup).not.toContain('data-pointer-action="rotate"')
  })

  it('renders the rotate handle for the selected as-needed chip', () => {
    const markup = render('asNeededChip')
    expect(markup).toContain('data-pointer-action="rotate"')
    expect(markup).toContain('class="map-rotate-handle"')
    expect(markup).toContain('aria-label="Rotate as needed chip"')
  })

  it('renders the rotate handle for a selected note', () => {
    const markup = render(NOTE_KEY)
    expect(markup).toContain('data-pointer-action="rotate"')
    expect(markup).toContain('aria-label="Rotate note: Rotate me"')
  })

  it('renders the rotate handle for a selected footnote line', () => {
    const markup = render(FOOTNOTE_KEY)
    expect(markup).toContain('data-pointer-action="rotate"')
    expect(markup).toContain('aria-label="Rotate footnote: Jordan 2026 RMD"')
  })

  it('keeps the rotate handle off unrotatable selections', () => {
    expect(render('income')).not.toContain('data-pointer-action="rotate"')
    expect(rotateHandleTarget(data, 'income')).toBeNull()
    expect(rotateHandleTarget(data, null)).toBeNull()
    expect(rotateHandleTarget(data, 'note:missing')).toBeNull()
  })

  it('resolves the override key and rect for every rotatable selection', () => {
    for (const key of ['asNeededChip', NOTE_KEY, FOOTNOTE_KEY]) {
      const target = rotateHandleTarget(data, key)
      expect(target?.key).toBe(key)
      expect(target?.rect.w).toBeGreaterThan(0)
      expect(target?.rect.h).toBeGreaterThan(0)
    }
  })

  it('writes rot on the selected override key for a simulated handle drag', () => {
    for (const key of ['asNeededChip', NOTE_KEY, FOOTNOTE_KEY]) {
      const target = rotateHandleTarget(data, key)!
      const center = {
        x: target.rect.x + target.rect.w / 2,
        y: target.rect.y + target.rect.h / 2,
      }
      // Pointer starts above the centre (the handle position) and is dragged
      // to the right of it — a quarter turn clockwise.
      const startAngle = Math.atan2(-100, 0)
      const endAngle = Math.atan2(0, 100)
      const rot = snapRotation(
        ((endAngle - startAngle) * 180) / Math.PI,
      )
      const next = withOverride(data, target.key, { rot })
      expect(next.layoutOverrides?.[key]?.rot).toBeCloseTo(90)
      expect(center.x).toBeGreaterThan(0)
    }
  })
})
