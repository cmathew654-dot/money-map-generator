import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { accountDisplayName } from '../src/model/format'
import { incomeTextSizes } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  addCustomArrow,
  accountTextPointerAction,
  addMapNote,
  cycleCustomArrowStyle,
  deleteCustomArrow,
  deleteMapNote,
  hideGeneratedArrow,
  resizeMapNote,
  restoreGeneratedArrows,
  setCustomArrowColor,
  setMapNoteBackground,
} from '../src/render/mapInteraction'
import {
  MapSvg,
  resolveCustomArrowColor,
} from '../src/render/MapSvg'
import {
  adjustMapTextFontSize,
  applyMapTextEdit,
  applyMapTextFontSize,
  mapTextEditorPillPosition,
  mapTextEditorTextStyle,
  mapTextEditFsInfo,
  mapTextEditRawValue,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'

const accountId = 'managed-ira-jordan'

describe('seamless map text editor geometry and typography', () => {
  it('renders the shared effective income total sizes', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        ...SAMPLE_WHITFIELD.layoutOverrides,
        'text:income:total': { fs: 30 },
      },
    }
    const sizes = incomeTextSizes(data)
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
      }),
    )

    expect(sizes.totalLabel).toBeCloseTo(30 * (13 / 17))
    expect(sizes.totalValue).toBe(30)
    expect(markup).toContain(
      `font-size="${sizes.totalLabel}" font-weight="600">After-Tax Income`,
    )
    expect(markup).toMatch(
      new RegExp(`font-size="${sizes.totalValue}"[^>]*>\\$5,900`),
    )
  })

  it('places the size pill above text or flips it below near the map top', () => {
    expect(
      mapTextEditorPillPosition(
        { left: 200, top: 120, width: 100, height: 20 },
        0,
      ),
    ).toEqual({
      left: 214,
      placement: 'above',
      top: 82,
    })
    expect(
      mapTextEditorPillPosition(
        { left: 200, top: 30, width: 100, height: 20 },
        0,
      ),
    ).toEqual({
      left: 214,
      placement: 'below',
      top: 58,
    })
  })

  it.each([
    [{ kind: 'accountLabel', accountId }, "'Literata', Georgia, serif", 19, 600],
    [{ kind: 'accountCaption', accountId }, "'Public Sans', 'Segoe UI', sans-serif", 14.5, 400],
    [{ kind: 'accountValue', accountId }, "'Literata', Georgia, serif", 25, 600],
    [{ kind: 'accountRows', accountId }, "'Public Sans', 'Segoe UI', sans-serif", 14.5, 400],
    [{ kind: 'accountSub', accountId }, "'Literata', Georgia, serif", 17, 600],
    [{ kind: 'incomeHeader' }, "'Public Sans', 'Segoe UI', sans-serif", 17.5, 700],
    [{ kind: 'incomeAmount', incomeIndex: 0 }, "'Literata', Georgia, serif", 15, 600],
    [{ kind: 'afterTaxIncome' }, "'Literata', Georgia, serif", 17, 600],
    [{ kind: 'needLabel' }, "'Public Sans', 'Segoe UI', sans-serif", 15, 700],
    [{ kind: 'monthlyNeed' }, "'Literata', Georgia, serif", 30, 600],
    [{ kind: 'mastheadLabel' }, "'Public Sans', 'Segoe UI', sans-serif", 14, 600],
    [{ kind: 'footnoteText' }, "'Public Sans', 'Segoe UI', sans-serif", 15, 400],
    [{ kind: 'asNeededAmount' }, "'Literata', Georgia, serif", 14.5, 600],
    [{ kind: 'flowLabel', arrowId: 'flow' }, "'Public Sans', 'Segoe UI', sans-serif", 14.5, 400],
    [{ kind: 'noteText', noteId: 'note' }, "'Literata', Georgia, serif", 16, 400],
  ] as [MapTextEditTarget, string, number, number][])(
    'matches the rendered font for %s',
    (target, fontFamily, fontSize, fontWeight) => {
      expect(mapTextEditorTextStyle(target)).toMatchObject({
        fontFamily,
        fontSize,
        fontWeight,
      })
    },
  )

  it('marks every interactive editable-line text node as clickable or click-through', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        {
          id: 'line-audit-note',
          text: 'Audit this note.',
          x: 520,
          y: 480,
        },
      ],
    }
    const noninteractive = renderToStaticMarkup(
      createElement(MapSvg, { data }),
    )
    const interactive = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )
    const textTags =
      interactive.match(
        /<(?:text|tspan)\b(?=[^>]*data-edit-line-node)[^>]*>/g,
      ) ?? []

    expect(textTags.length).toBeGreaterThan(30)
    for (const tag of textTags) {
      expect(
        tag.includes('role="button"') ||
          tag.includes('pointer-events="none"'),
      ).toBe(true)
    }
    expect(interactive).toContain(
      'data-edit-line-node="afterTaxIncome"',
    )
    expect(interactive).toContain(
      'data-edit-line-node="monthlyNeed"',
    )
    expect(interactive).toContain(
      'data-edit-line-node="footnoteText"',
    )
    expect(interactive).toContain(
      'data-edit-line-node="noteText:line-audit-note"',
    )
    expect(noninteractive).not.toContain('data-edit-line-node')
    expect(noninteractive).not.toContain('data-map-edit-key')
  })
})

describe('applyMapTextEdit', () => {
  it('clamps map text font-size steps at 9 and each target maximum', () => {
    expect(adjustMapTextFontSize(9, -1, 28)).toBe(9)
    expect(adjustMapTextFontSize(9, 1, 28)).toBe(10)
    expect(adjustMapTextFontSize(28, 1, 28)).toBe(28)
    expect(adjustMapTextFontSize(40, 1, 40)).toBe(40)
    expect(adjustMapTextFontSize(40, -1, 40)).toBe(39)
  })

  it('previews and stores note font size on the note record at 9/40', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        {
          id: 'sized-note',
          text: 'Size this note.',
          x: 520,
          y: 480,
          fs: 20,
        },
      ],
    }
    const target = { kind: 'noteText' as const, noteId: 'sized-note' }

    expect(mapTextEditFsInfo(data, target)).toEqual({
      fallback: 20,
      max: 40,
    })
    expect(applyMapTextFontSize(data, target, 2).notes?.[0].fs).toBe(9)
    expect(applyMapTextFontSize(data, target, 80).notes?.[0].fs).toBe(40)
    expect(data.notes[0].fs).toBe(20)
  })

  it.each([
    [
      { kind: 'accountLabel', accountId },
      { key: `text:${accountId}:label`, fallback: 19, max: 28 },
    ],
    [
      { kind: 'monthlyNeed' },
      { key: 'text:need:value', fallback: 30, max: 40 },
    ],
    [
      { kind: 'accountRows', accountId },
      { key: `text:${accountId}:rows`, fallback: 14.5, max: 40 },
    ],
    [
      { kind: 'accountSub', accountId },
      { key: `text:${accountId}:sub`, fallback: 17, max: 40 },
    ],
  ] as [MapTextEditTarget, { key: string; fallback: number; max: number }][])(
    'maps the %s target to its font-size override',
    (target, expected) => {
      expect(mapTextEditFsInfo(SAMPLE_WHITFIELD, target)).toEqual(expected)
    },
  )

  it('decides edit versus move at the account text drag threshold', () => {
    const start = { x: 20, y: 30 }

    expect(accountTextPointerAction(start, { x: 23, y: 32 })).toBe('edit')
    expect(accountTextPointerAction(start, { x: 24, y: 30 })).toBe('move')
  })

  it.each([
    [{ kind: 'accountValue', accountId }, 'account'],
    [{ kind: 'incomeAmount', incomeIndex: 0 }, 'income'],
    [{ kind: 'afterTaxIncome' }, 'afterTax'],
    [{ kind: 'monthlyNeed' }, 'need'],
    [{ kind: 'asNeededAmount' }, 'draw'],
  ] as [MapTextEditTarget, string][])(
    'parses shorthand for the %s money edit',
    (target) => {
      const updated = applyMapTextEdit(SAMPLE_WHITFIELD, target, '85k')

      const values = {
        account: updated.accounts.find((account) => account.id === accountId)!
          .value,
        income: updated.incomeSources[0].amount,
        afterTax: updated.afterTaxIncome,
        need: updated.monthlyNeed,
        draw: updated.asNeededAmount,
      }
      expect(Object.values(values)).toContain(85_000)
    },
  )

  it('commits empty money text as null, never zero', () => {
    const updated = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'monthlyNeed' },
      '',
    )

    expect(updated.monthlyNeed).toBeNull()
    expect(updated.monthlyNeed).not.toBe(0)
  })

  it('opens money edits with the same formatted text shown on the map', () => {
    expect(
      mapTextEditRawValue(SAMPLE_WHITFIELD, {
        kind: 'afterTaxIncome',
      }),
    ).toBe('$5,900')
    expect(
      mapTextEditRawValue(SAMPLE_WHITFIELD, {
        kind: 'accountValue',
        accountId,
      }),
    ).toBe('$2,450,000')
  })

  it('trims labels and preserves the unnamed fallback', () => {
    const trimmed = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'accountLabel', accountId },
      '  Retirement IRA  ',
    )
    const unnamed = applyMapTextEdit(
      trimmed,
      { kind: 'accountLabel', accountId },
      '   ',
    )
    const account = unnamed.accounts.find((item) => item.id === accountId)!

    expect(
      trimmed.accounts.find((item) => item.id === accountId)!.label,
    ).toBe('Retirement IRA')
    expect(account.label).toBe('')
    expect(accountDisplayName(account)).toBe('Tax-Deferred · unnamed')
  })

  it('edits an account caption in place', () => {
    const updated = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'accountCaption', accountId },
      '  Updated allocation note  ',
    )

    expect(
      updated.accounts.find((item) => item.id === accountId)?.caption,
    ).toBe('Updated allocation note')
  })

  it('returns the untouched model when an edit is cancelled', () => {
    const cancelled = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'accountValue', accountId },
      null,
    )

    expect(cancelled).toBe(SAMPLE_WHITFIELD)
  })

  it.each([
    { kind: 'incomeHeader' },
    { kind: 'needLabel' },
    { kind: 'footnoteText' },
    { kind: 'accountRows', accountId },
    { kind: 'accountSub', accountId },
  ] as MapTextEditTarget[])(
    'keeps size-only %s edits out of the data model',
    (target) => {
      expect(mapTextEditRawValue(SAMPLE_WHITFIELD, target)).toBe('')
      expect(applyMapTextEdit(SAMPLE_WHITFIELD, target, 'ignored')).toBe(
        SAMPLE_WHITFIELD,
      )
    },
  )

  it('commits a trimmed flow label and clears it with blank text', () => {
    const arrowId = SAMPLE_WHITFIELD.customArrows![0].id
    const labeled = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'flowLabel', arrowId },
      '  $2,000/mo — funds 529  ',
    )
    const cleared = applyMapTextEdit(
      labeled,
      { kind: 'flowLabel', arrowId },
      '   ',
    )

    expect(labeled.customArrows?.[0].label).toBe(
      '$2,000/mo — funds 529',
    )
    expect(cleared.customArrows?.[0].label).toBeUndefined()
  })

  it('commits a trimmed masthead label and restores the default when empty', () => {
    expect(
      mapTextEditRawValue(SAMPLE_WHITFIELD, { kind: 'mastheadLabel' }),
    ).toBe('Money Map')

    const custom = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'mastheadLabel' },
      '  Retirement Roadmap  ',
    )
    const restored = applyMapTextEdit(
      custom,
      { kind: 'mastheadLabel' },
      '   ',
    )

    expect(custom.client.mastheadLabel).toBe('Retirement Roadmap')
    expect(restored.client.mastheadLabel).toBeUndefined()
    expect(
      mapTextEditRawValue(restored, { kind: 'mastheadLabel' }),
    ).toBe('Money Map')
  })
})

describe('custom arrow edits', () => {
  it.each([
    ['dotted', undefined, 'green'],
    ['dashed', undefined, 'green'],
    ['solid', undefined, 'ink'],
    ['dotted', 'blue', 'blue'],
    ['dashed', 'gold', 'gold'],
    ['solid', 'red', 'red'],
  ] as const)(
    'resolves %s flow color %s to %s',
    (style, color, expected) => {
      expect(resolveCustomArrowColor(style, color)).toBe(expected)
    },
  )

  it('rejects self, unknown, and duplicate connections without changes', () => {
    const base = { ...SAMPLE_WHITFIELD, customArrows: [] }
    const first = SAMPLE_WHITFIELD.accounts[0].id
    const second = SAMPLE_WHITFIELD.accounts[1].id
    const withArrow = {
      ...base,
      customArrows: [
        {
          id: 'existing',
          sourceId: first,
          targetId: second,
          style: 'solid' as const,
        },
      ],
    }

    expect(addCustomArrow(base, first, first)).toBe(base)
    expect(addCustomArrow(base, 'missing', first)).toBe(base)
    expect(addCustomArrow(base, first, 'missing')).toBe(base)
    expect(addCustomArrow(withArrow, first, second)).toBe(withArrow)
  })

  it('appends a fresh custom arrow and allows reverse direction', () => {
    const base = { ...SAMPLE_WHITFIELD, customArrows: [] }
    const first = SAMPLE_WHITFIELD.accounts[0].id
    const second = SAMPLE_WHITFIELD.accounts[1].id
    const forward = addCustomArrow(base, first, second)
    const reverse = addCustomArrow(forward, second, first)

    expect(forward).not.toBe(base)
    expect(forward.customArrows).toHaveLength(1)
    expect(forward.customArrows?.[0]).toMatchObject({
      sourceId: first,
      targetId: second,
    })
    expect(forward.customArrows?.[0].id).toMatch(/^arrow-/)
    expect(forward.customArrows?.[0].style).toBe('dotted')
    expect(reverse.customArrows).toHaveLength(2)
  })

  it('deletes by id and leaves unknown deletes untouched', () => {
    const withArrow = addCustomArrow(
      { ...SAMPLE_WHITFIELD, customArrows: [] },
      'income',
      'need',
    )
    const id = withArrow.customArrows![0].id
    const deleted = deleteCustomArrow(withArrow, id)

    expect(deleted.customArrows).toEqual([])
    expect(deleteCustomArrow(withArrow, 'missing')).toBe(withArrow)
  })

  it('cycles flow style dot to dash to solid to dot', () => {
    const base = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        {
          id: 'style-target',
          sourceId: 'income',
          targetId: 'need',
          style: 'dotted' as const,
        },
      ],
    }
    const dashed = cycleCustomArrowStyle(base, 'style-target')
    const solid = cycleCustomArrowStyle(dashed, 'style-target')
    const dotted = cycleCustomArrowStyle(solid, 'style-target')

    expect(dashed.customArrows?.[0].style).toBe('dashed')
    expect(solid.customArrows?.[0].style).toBe('solid')
    expect(dotted.customArrows?.[0].style).toBe('dotted')
    expect(cycleCustomArrowStyle(base, 'missing')).toBe(base)
  })

  it('sets a semantic flow color and leaves unknown ids untouched', () => {
    const base = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        {
          id: 'color-target',
          sourceId: 'income',
          targetId: 'need',
          style: 'solid' as const,
        },
      ],
    }

    expect(
      setCustomArrowColor(base, 'color-target', 'blue').customArrows?.[0]
        .color,
    ).toBe('blue')
    expect(setCustomArrowColor(base, 'missing', 'red')).toBe(base)
  })
})

describe('generated arrow edits', () => {
  it('hides one generated arrow and restores all generated arrows', () => {
    const hidden = hideGeneratedArrow(SAMPLE_WHITFIELD, 'income')
    const restored = restoreGeneratedArrows(hidden)

    expect(hidden.hiddenArrows).toEqual(['income'])
    expect(hideGeneratedArrow(hidden, 'income')).toBe(hidden)
    expect(restored.hiddenArrows).toBeUndefined()
    expect(restoreGeneratedArrows(SAMPLE_WHITFIELD)).toBe(SAMPLE_WHITFIELD)
  })
})

describe('map note edits', () => {
  const note = {
    id: 'note-target',
    text: 'Confirm the rollover timing.',
    x: 520,
    y: 480,
  }

  it('adds a trimmed note and treats empty text as a no-op', () => {
    const added = addMapNote(SAMPLE_WHITFIELD, {
      ...note,
      text: `  ${note.text}  `,
    })

    expect(added.notes).toEqual([note])
    expect(addMapNote(SAMPLE_WHITFIELD, { ...note, text: '   ' })).toBe(
      SAMPLE_WHITFIELD,
    )
  })

  it('deletes only the target note', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        note,
        { id: 'note-other', text: 'Keep this note.', x: 620, y: 560 },
      ],
    }

    expect(deleteMapNote(data, note.id).notes).toEqual([data.notes[1]])
    expect(deleteMapNote(data, 'missing')).toBe(data)
  })

  it('clamps note resize to 120/600 and ignores unknown ids', () => {
    const data = { ...SAMPLE_WHITFIELD, notes: [note] }
    const minimum = resizeMapNote(data, note.id, 40)
    const maximum = resizeMapNote(minimum, note.id, 900)

    expect(minimum.notes?.[0].w).toBe(120)
    expect(maximum.notes?.[0].w).toBe(600)
    expect(resizeMapNote(data, 'missing', 420)).toBe(data)
  })

  it('toggles a note background and ignores unknown ids', () => {
    const data = { ...SAMPLE_WHITFIELD, notes: [note] }
    const solid = setMapNoteBackground(data, note.id, true)
    const transparent = setMapNoteBackground(solid, note.id, false)

    expect(solid.notes?.[0].bg).toBe(true)
    expect(transparent.notes?.[0].bg).toBe(false)
    expect(setMapNoteBackground(data, 'missing', true)).toBe(data)
  })
})

describe('noninteractive map rendering', () => {
  const editorChrome = [
    'map-arrow-delete',
    'map-arrow-editor',
    'map-arrow-handle',
    'map-arrow-label-add',
    'map-arrow-style',
    'map-arrow-colors',
    'map-connect-handle',
    'map-resize-handle',
    'map-rotate-handle',
    'map-shape-flip',
    'map-note-delete',
    'map-note-background',
    'map-note-resize',
  ]

  it('emits zero editor chrome nodes without edit callbacks', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        { id: 'print-note', text: 'Print this annotation.', x: 520, y: 480 },
      ],
      customArrows: SAMPLE_WHITFIELD.customArrows?.map((arrow, index) =>
        index === 0
          ? {
              ...arrow,
              style: 'solid' as const,
              label: '$2,000/mo — funds 529',
            }
          : arrow,
      ),
    }
    const markup = renderToStaticMarkup(
      createElement(MapSvg, { data }),
    )

    expect(markup).toContain('Print this annotation.')
    expect(markup).toContain('$2,000/mo — funds 529')
    expect(markup).toContain('data-arrow-style="solid"')
    for (const className of editorChrome) {
      expect(markup).not.toContain(className)
    }
    expect(markup).not.toContain('map-interactive')
    expect(markup).not.toContain('map-editable-text')
    expect(markup).not.toContain('data-connect-id')
    expect(markup).not.toMatch(
      /<rect(?=[^>]*pointer-events="none")(?![^>]*fill="transparent")/,
    )
  })

  it('renders fixed-element overrides and proportional income row sizes', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      footnotes: [
        ...SAMPLE_WHITFIELD.footnotes,
        { label: 'Dana 2026 RMD', gross: 80_000, net: 61_000 },
      ],
      layoutOverrides: {
        'text:income:header': { fs: 19 },
        'text:income:row': { fs: 20 },
        'text:income:total': { fs: 21 },
        'text:need:label': { fs: 22 },
        'text:need:value': { fs: 40 },
        'text:footnotes:line': { fs: 18 },
        'text:legend:label': { fs: 16 },
      },
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(markup).toMatch(/font-size="19"[^>]*>INCOME SOURCES/)
    expect(markup).toMatch(
      /font-size="18\.571428571428573"[^>]*>Social Security/,
    )
    expect(markup).toMatch(/font-size="20"[^>]*><tspan>\$2,400 mo\./)
    expect(markup).toMatch(/font-size="17\.142857142857142"[^>]*>Gross/)
    expect(markup).toMatch(/font-size="21"[^>]*>\$5,900/)
    expect(markup).toMatch(/font-size="22"[^>]*>MONTHLY INCOME NEED/)
    expect(markup).toMatch(/font-size="40"[^>]*><tspan[^>]*>\$15,000/)
    expect(markup).toContain(
      'y="930" fill="#1c2422" font-family="&#x27;Public Sans&#x27;, &#x27;Segoe UI&#x27;, sans-serif" font-size="18"',
    )
    expect(markup).toContain(
      'y="958.8" fill="#1c2422" font-family="&#x27;Public Sans&#x27;, &#x27;Segoe UI&#x27;, sans-serif" font-size="18"',
    )
    expect(markup).not.toContain('Flow legend')
    expect(markup).not.toContain('data-legend-kind')
  })

  it('renders shared position and proportional sub-account font sizes', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        'text:managed-after-tax-trust:rows': { fs: 24 },
        'text:managed-ira-jordan:sub': { fs: 34 },
      },
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(markup).toMatch(
      /font-size="24"[^>]*>S&amp;P 500 Index Fund/,
    )
    expect(markup).toMatch(
      /font-size="25"[^>]*font-weight="600"[^>]*><tspan[^>]*>Short-Ter/,
    )
    expect(markup).toMatch(/font-size="34"[^>]*>\$240,000/)
  })

  it('prints solid notes and semantic flow colors without editor chrome', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        {
          id: 'solid-note',
          text: 'A note presented as a card.',
          x: 520,
          y: 480,
          w: 420,
          bg: true,
        },
      ],
      customArrows: [
        {
          id: 'blue-flow',
          sourceId: 'income',
          targetId: SAMPLE_WHITFIELD.accounts[0].id,
          style: 'solid' as const,
          color: 'blue' as const,
          label: 'Blue flow',
        },
        {
          id: 'red-flow',
          sourceId: SAMPLE_WHITFIELD.accounts[1].id,
          targetId: 'need',
          style: 'dashed' as const,
          color: 'red' as const,
          label: 'Red flow',
        },
      ],
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(markup).toContain(
      'class="map-note-card" fill="#ffffff" height="41" rx="8" stroke="#dde1dc" width="440"',
    )
    expect(markup).toMatch(
      /class="map-note-text" fill="#1c2422"[^>]*>.*A note presented as a card\./,
    )
    expect(markup).toMatch(
      /data-arrow-color="blue"[^>]*data-arrow-style="solid"[^>]*marker-end="url\(#custom-arrowhead-blue-[^)]+\)"[^>]*stroke="#2f6bab"/,
    )
    expect(markup).toMatch(
      /data-arrow-color="red"[^>]*data-arrow-style="dashed"[^>]*marker-end="url\(#custom-arrowhead-red-[^)]+\)"[^>]*stroke="#c03a2d"[^>]*stroke-dasharray="7 6"/,
    )
    expect(markup).toMatch(
      /fill="#2f6bab"[^>]*class="map-flow-label">Blue flow/,
    )
    expect(markup).toMatch(
      /fill="#c03a2d"[^>]*class="map-flow-label">Red flow/,
    )
    for (const className of editorChrome) {
      expect(markup).not.toContain(className)
    }
  })

  it('composes a custom masthead label for annual and mid-year maps', () => {
    const annual = {
      ...SAMPLE_WHITFIELD,
      client: {
        ...SAMPLE_WHITFIELD.client,
        mastheadLabel: 'Retirement Roadmap',
      },
    }
    const midYear = {
      ...annual,
      client: {
        ...annual.client,
        variant: 'postNote' as const,
        postNoteLabel: 'April 2026',
      },
    }

    const annualMarkup = renderToStaticMarkup(
      createElement(MapSvg, { data: annual }),
    )
    const midYearMarkup = renderToStaticMarkup(
      createElement(MapSvg, { data: midYear }),
    )
    const interactiveMarkup = renderToStaticMarkup(
      createElement(MapSvg, {
        data: annual,
        onElementClick: () => undefined,
      }),
    )

    expect(annualMarkup).toContain('RETIREMENT ROADMAP 2026')
    expect(midYearMarkup).toContain(
      'RETIREMENT ROADMAP — APRIL 2026',
    )
    expect(interactiveMarkup).toMatch(
      /class="map-editable-text"[^>]*>RETIREMENT ROADMAP 2026/,
    )
  })

  it('renders a migrated dotted flow without color in legacy green', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        {
          id: 'migrated-flow:test-account',
          sourceId: 'income',
          targetId: SAMPLE_WHITFIELD.accounts[0].id,
          style: 'dotted' as const,
        },
      ],
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))
    const interactiveMarkup = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )

    expect(markup).toMatch(
      /data-arrow-color="green"[^>]*data-arrow-style="dotted"[^>]*marker-end="url\(#custom-arrowhead-green-[^)]+\)"[^>]*stroke="#1e7a4a"/,
    )
    expect(interactiveMarkup).toContain(
      'class="map-arrow-color-ring" cx="16"',
    )
  })

  it('keeps editor chrome in the interactive render path', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        { id: 'test-note', text: 'Printed note', x: 520, y: 480 },
      ],
      customArrows: [
        {
          id: 'test-arrow',
          sourceId: 'income',
          targetId: 'need',
          style: 'solid' as const,
        },
      ],
    }
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )

    expect(markup).toContain('map-interactive')
    expect(markup).toContain('aria-label="Resize income sources"')
    expect(markup).toContain('class="map-editable-hit"')
    for (const className of editorChrome) {
      expect(markup).toContain(className)
    }
    expect(markup).toContain('class="map-arrow-color-ring" cx="0"')
  })
})
