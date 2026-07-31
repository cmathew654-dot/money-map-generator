import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  footnoteLineLayouts,
  layoutMap,
  mapTextOffset,
} from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg } from '../src/render/MapSvg'

describe('Session 40 layout/render repair', () => {
  it('keeps untouched Whitfield free of blocking layout warnings', () => {
    expect(layoutMap(SAMPLE_WHITFIELD).warnings).toEqual([])
  })

  it('uses per-footnote sizes for rendering and baseline spacing', () => {
    const first = SAMPLE_WHITFIELD.footnotes[0]
    const second = {
      id: 'footnote-second-line',
      label: 'Dana 2026 RMD',
      gross: 80_000,
      net: 61_000,
    }
    const data = {
      ...SAMPLE_WHITFIELD,
      footnotes: [first, second],
      layoutOverrides: {
        ...SAMPLE_WHITFIELD.layoutOverrides,
        'text:footnotes:line': { fs: 12 },
        [`text:footnotes:line:${first.id}`]: { fs: 23 },
      },
    }
    const lines = footnoteLineLayouts(data)
    const layout = layoutMap(data)
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(lines.map((line) => line.fontSize)).toEqual([23, 12])
    expect(lines[1].y - lines[0].y).toBeCloseTo(23 * 1.6)
    expect(layout.footnotesAt.y).toBeCloseTo(lines[0].y)
    expect(markup).toContain(`y="${lines[0].y}"`)
    expect(markup).toContain('font-size="23"')
    expect(markup).toContain(`y="${lines[1].y}"`)
    expect(markup).toContain('font-size="12"')
  })

  it('keeps adjacent variable-size lines separated after per-line movement', () => {
    const first = SAMPLE_WHITFIELD.footnotes[0]
    const second = {
      id: 'footnote-large-second',
      label: 'Dana 2026 RMD',
      gross: 80_000,
      net: 61_000,
    }
    const data = {
      ...SAMPLE_WHITFIELD,
      footnotes: [first, second],
      layoutOverrides: {
        [`text:footnotes:line:${first.id}`]: { fs: 9, dy: 30 },
        [`text:footnotes:line:${second.id}`]: { fs: 40, dy: -30 },
      },
    }
    const placed = footnoteLineLayouts(data).map((line) => {
      const block = {
        x: 300,
        y: line.y - line.fontSize - 3,
        w: 720,
        h: line.fontSize + 9,
      }
      const offset = mapTextOffset(
        data,
        'footnotes',
        'line',
        block,
        line.footnote.id,
      )
      return { ...block, y: block.y + offset.dy }
    })

    expect(placed[1].y).toBeGreaterThanOrEqual(
      placed[0].y + placed[0].h,
    )
  })

  it('blocks manual account and note collisions without connector warnings', () => {
    const base = layoutMap(SAMPLE_WHITFIELD)
    const trust = base.accounts.find(
      (account) => account.account.id === 'managed-after-tax-trust',
    )!
    const ira = base.accounts.find(
      (account) => account.account.id === 'managed-ira-jordan',
    )!
    const shortTerm = base.accounts.find(
      (account) => account.account.id === 'short-term-funds',
    )!
    const accountCollision = layoutMap({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        [ira.account.id]: {
          dx: trust.x - ira.x,
          dy: trust.y - ira.y,
        },
      },
    })
    const panelCollision = layoutMap({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        [shortTerm.account.id]: {
          dx: base.income.x - shortTerm.x,
          dy: base.income.y - shortTerm.y,
        },
      },
    })
    const noteCollision = layoutMap({
      ...SAMPLE_WHITFIELD,
      notes: [
        {
          id: 'note-over-income',
          text: 'Overlapping note',
          x: base.income.x + 20,
          y: base.income.y + 20,
          w: 180,
        },
      ],
    })

    expect(accountCollision.warnings.map((warning) => warning.code)).toContain(
      'account-overlap',
    )
    expect(panelCollision.warnings.map((warning) => warning.code)).toContain(
      'account-panel-overlap',
    )
    expect(noteCollision.warnings.map((warning) => warning.code)).toContain(
      'note-content-overlap',
    )
    expect(base.warnings).toEqual([])
  })

  it('does not render fully blank fine-print rows', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      footnotes: [{ id: 'blank-footnote', label: '', gross: null, net: null }],
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(footnoteLineLayouts(data)).toEqual([])
    expect(markup).not.toContain('aria-label="Footnotes"')
    expect(markup).not.toContain('after withholding')
    expect(markup).not.toContain(': →')
  })

  it('includes placed notes in bounds and warns on a real fine-print collision', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        {
          id: 'note-over-footnote',
          text: 'A note occupying the fine-print band',
          x: 540,
          y: 910,
          w: 260,
        },
      ],
    }
    const layout = layoutMap(data)
    const note = layout.notes[0]

    expect(layout.contentBounds.x).toBeLessThanOrEqual(note.x)
    expect(layout.contentBounds.x + layout.contentBounds.w).toBeGreaterThanOrEqual(
      note.x + note.w,
    )
    expect(layout.contentBounds.y + layout.contentBounds.h).toBeGreaterThanOrEqual(
      note.y + note.h,
    )
    expect(layout.warnings.map((warning) => warning.code)).toContain(
      'footnote-overlap',
    )
  })
})
