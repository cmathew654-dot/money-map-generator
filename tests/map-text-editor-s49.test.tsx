import { createElement, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { incomeTextSizes, NOTE_LEADING } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { mapTextOverrideKey } from '../src/model/types'
import { TYPE } from '../src/render/tokens'
import {
  applyMapTextFontSize,
  consumeMapTextDiscard,
  MapTextEditor,
  mapTextEditFsInfo,
  mapTextEditorInputWidth,
  mapTextEditorTextStyle,
  type ActiveMapTextEdit,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'

function render(edit: ActiveMapTextEdit): string {
  return renderToStaticMarkup(
    createElement(MapTextEditor, {
      containerRef: createRef<HTMLElement>(),
      edit,
      onCancel: () => {},
      onCommit: () => {},
    }),
  )
}

function styleOf(markup: string, className: string): string {
  const pattern = new RegExp(
    `<[^>]*class="[^"]*${className}[^"]*"[^>]*style="([^"]*)"`,
  )
  return markup.match(pattern)?.[1] ?? ''
}

const RECT = { left: 100, top: 200, width: 120, height: 20 }

describe('s49 editor: size-only pill honesty', () => {
  it('labels the pill so a size-only target does not look like a text field', () => {
    const markup = render({
      target: { kind: 'needLabel' },
      rect: RECT,
      rawValue: '',
      fontSize: TYPE.needLabel,
      fontSizeMax: 24,
    })
    expect(markup).not.toContain('<input')
    expect(markup).toContain('Text size')
  })

  it('leaves the editable pill unlabelled', () => {
    const markup = render({
      target: { kind: 'monthlyNeed' },
      rect: RECT,
      rawValue: '$4,000',
      fontSize: TYPE.needValue,
      fontSizeMax: 24,
    })
    expect(markup).toContain('<input')
    expect(markup).not.toContain('Text size')
  })
})

describe('s49 editor: input width grows with content', () => {
  const style = mapTextEditorTextStyle(
    { kind: 'accountLabel', accountId: 'a1' },
    16,
  )

  it('keeps the pre-edit width as the floor', () => {
    expect(mapTextEditorInputWidth('a', style, 220)).toBe(220)
  })

  it('grows past the floor for long content', () => {
    const short = mapTextEditorInputWidth('Roth', style, 40)
    const long = mapTextEditorInputWidth(
      'Roth IRA rollover from prior employer plan',
      style,
      40,
    )
    expect(long).toBeGreaterThan(short)
    expect(long).toBeGreaterThan(40)
  })

  it('renders the grown width on the editor element', () => {
    const markup = render({
      target: { kind: 'accountLabel', accountId: 'a1' },
      rect: { ...RECT, width: 40 },
      rawValue: 'Roth IRA rollover from prior employer plan',
      fontSize: 16,
      fontSizeMax: 24,
    })
    const width = Number(
      styleOf(markup, 'map-text-editor').match(/width:([\d.]+)px/)?.[1],
    )
    expect(width).toBeGreaterThan(40)
  })
})

describe('s49 editor: leading matches the map', () => {
  it('uses the note leading token, not 1.25', () => {
    const markup = render({
      target: { kind: 'noteText', noteId: 'n1' },
      rect: { ...RECT, height: 120 },
      rawValue: 'a long note that wraps',
      fontSize: TYPE.note,
      fontSizeMax: 24,
    })
    expect(styleOf(markup, 'map-text-editor')).toContain(
      `line-height:${NOTE_LEADING}px`,
    )
  })
})

describe('s49 editor: incomeHeader font size', () => {
  const target: MapTextEditTarget = { kind: 'incomeHeader' }

  it('exposes a font-size control path', () => {
    expect(mapTextEditFsInfo(SAMPLE_WHITFIELD, target)).toEqual({
      key: mapTextOverrideKey('income', 'header'),
      fallback: TYPE.panelHeader,
      max: expect.any(Number),
    })
  })

  it('feeds the income panel layout end to end', () => {
    const next = applyMapTextFontSize(SAMPLE_WHITFIELD, target, 20)
    expect(incomeTextSizes(next).header).toBe(20)
  })
})

describe('s49 editor: discard flag is consumed once', () => {
  it('clears the flag so the next commit is not swallowed', () => {
    const ref = { current: true }
    expect(consumeMapTextDiscard(ref)).toBe(true)
    expect(ref.current).toBe(false)
    expect(consumeMapTextDiscard(ref)).toBe(false)
  })

  it('leaves an unarmed flag alone', () => {
    const ref = { current: false }
    expect(consumeMapTextDiscard(ref)).toBe(false)
    expect(ref.current).toBe(false)
  })
})
