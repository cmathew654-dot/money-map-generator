import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { accountDisplayName } from '../src/model/format'
import { incomeTextSizes, layoutMap } from '../src/layout/layout'
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
  retargetCustomArrow,
  restoreGeneratedArrows,
  setCustomArrowColor,
  setMapNoteBackground,
  snapRectToAlignment,
} from '../src/render/mapInteraction'
import {
  MapSvg,
  resolveCustomArrowColor,
} from '../src/render/MapSvg'
import {
  MapTextEditor,
  adjustMapTextFontSize,
  applyMapTextEdit,
  applyMapTextFontSize,
  mapTextEditorDismissAction,
  mapTextEditorFocusOrigin,
  mapTextEditorShouldRestoreFocus,
  mapTextEditorPillPosition,
  mapTextEditorTextStyle,
  mapTextEditFsInfo,
  mapTextEditRawValue,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'

const accountId = 'managed-ira-jordan'

describe('alignment snapping', () => {
  it('engages within the snap radius', () => {
    const snapped = snapRectToAlignment(
      { x: 95, y: 100, w: 100, h: 100 },
      [{ x: 200, y: 300, w: 100, h: 100 }],
      6,
    )

    expect(snapped.rect).toEqual({ x: 100, y: 100, w: 100, h: 100 })
    expect(snapped.x?.value).toBe(200)
  })

  it('does not engage outside the snap radius', () => {
    const rect = { x: 93, y: 100, w: 100, h: 100 }

    expect(
      snapRectToAlignment(rect, [{ x: 200, y: 300, w: 100, h: 100 }], 6),
    ).toEqual({ rect })
  })

  it('bypasses snapping when Alt is held', () => {
    const rect = { x: 95, y: 100, w: 100, h: 100 }

    expect(
      snapRectToAlignment(
        rect,
        [{ x: 200, y: 300, w: 100, h: 100 }],
        6,
        true,
      ),
    ).toEqual({ rect })
  })

  it('uses the nearest eligible line', () => {
    const snapped = snapRectToAlignment(
      { x: 94, y: 100, w: 100, h: 100 },
      [
        { x: 200, y: 300, w: 100, h: 100 },
        { x: 198, y: 500, w: 100, h: 100 },
      ],
      6,
    )

    expect(snapped.rect.x).toBe(98)
    expect(snapped.x?.value).toBe(198)
  })

  it('snaps x and y independently', () => {
    expect(
      snapRectToAlignment(
        { x: 97, y: 297, w: 100, h: 100 },
        [{ x: 200, y: 400, w: 100, h: 100 }],
        6,
      ).rect,
    ).toEqual({ x: 100, y: 300, w: 100, h: 100 })
  })

  it('uses the 24-unit tidy radius and leaves distant axes alone', () => {
    const other = [{ x: 200, y: 300, w: 100, h: 100 }]

    expect(
      snapRectToAlignment({ x: 80, y: 80, w: 100, h: 100 }, other, 24).rect,
    ).toEqual({ x: 100, y: 80, w: 100, h: 100 })
    expect(
      snapRectToAlignment({ x: 70, y: 80, w: 100, h: 100 }, other, 24).rect,
    ).toEqual({ x: 70, y: 80, w: 100, h: 100 })
  })
})

describe('seamless map text editor geometry and typography', () => {
  it('renders a visible close control with the required accessible name', () => {
    const markup = renderToStaticMarkup(
      createElement(MapTextEditor, {
        containerRef: { current: null },
        edit: {
          rawValue: '$2,450,000',
          rect: { left: 200, top: 120, width: 120, height: 30 },
          target: { kind: 'accountValue', accountId },
        },
        onCancel: () => undefined,
        onCommit: () => undefined,
      }),
    )

    expect(markup).toContain('aria-label="Close text editor"')
  })

  it.each([
    ['close', 'commit'],
    ['outside', 'commit'],
    ['escape', 'cancel'],
  ] as const)('%s dismissal requests %s', (reason, action) => {
    expect(mapTextEditorDismissAction(reason)).toBe(action)
  })

  it.each([
    ['close', true],
    ['escape', true],
    ['outside', false],
  ] as const)(
    '%s dismissal restores originating map focus: %s',
    (reason, expected) => {
      expect(mapTextEditorShouldRestoreFocus(reason)).toBe(expected)
    },
  )
  it('keeps the exact captured origin among duplicate edit keys until it disconnects', () => {
    const key = `accountValue:${accountId}`
    const candidate = {
      isConnected: true,
      getAttribute: (name: string) =>
        name === 'data-map-edit-key' ? key : null,
    }
    const invoked = {
      isConnected: true,
      getAttribute: (name: string) =>
        name === 'data-map-edit-key' ? key : null,
    }

    expect(mapTextEditorFocusOrigin(invoked, key, [candidate, invoked])).toBe(
      invoked,
    )

    invoked.isConnected = false
    expect(mapTextEditorFocusOrigin(invoked, key, [candidate, invoked])).toBe(
      candidate,
    )
  })
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
    expect(markup).toMatch(
      new RegExp(`font-size="${sizes.totalLabel}"[^>]*>After-Tax Income`),
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
    [{ kind: 'accountSub', accountId }, "'Literata', Georgia, serif", 19, 600],
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
      'data-edit-line-node="footnoteText:',
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
      { key: `text:${accountId}:sub`, fallback: 19, max: 40 },
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
    expect(accountTextPointerAction(start, { x: 27, y: 30 })).toBe('edit')
    expect(accountTextPointerAction(start, { x: 28, y: 30 })).toBe('move')
  })

  it('treats a quick sloppy movement as a click, but a fast long flick as a drag', () => {
    const start = { x: 20, y: 30 }
    const sloppy = { x: 35, y: 30 }
    const flick = { x: 44, y: 30 }

    expect(accountTextPointerAction(start, sloppy, 100)).toBe('edit')
    expect(accountTextPointerAction(start, sloppy, 180)).toBe('move')
    expect(accountTextPointerAction(start, flick, 50)).toBe('move')
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

  it('retargets through one validator and clears only the moved endpoint placement', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        {
          id: 'retarget-me',
          sourceId: 'income',
          targetId: SAMPLE_WHITFIELD.accounts[0].id,
          style: 'solid' as const,
        },
      ],
      layoutOverrides: {
        'arrow:custom:retarget-me': {
          startAt: { dx: 90, dy: 20 },
          startT: 0.2,
          endAt: { dx: -80, dy: -10 },
          endT: 0.7,
          bow: 30,
        },
      },
    }

    const retargeted = retargetCustomArrow(
      data,
      'retarget-me',
      'sourceId',
      SAMPLE_WHITFIELD.accounts[1].id,
    )

    expect(retargeted.customArrows?.[0].sourceId).toBe(
      SAMPLE_WHITFIELD.accounts[1].id,
    )
    expect(retargeted.layoutOverrides?.['arrow:custom:retarget-me']).toEqual({
      endAt: { dx: -80, dy: -10 },
      endT: 0.7,
      bow: 30,
    })
    expect(
      retargetCustomArrow(
        retargeted,
        'retarget-me',
        'sourceId',
        SAMPLE_WHITFIELD.accounts[0].id,
      ),
    ).toBe(retargeted)
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
    expect(dashed.customArrows?.[0].color).toBe('green')
    expect(solid.customArrows?.[0].style).toBe('solid')
    expect(solid.customArrows?.[0].color).toBe('green')
    expect(dotted.customArrows?.[0].style).toBe('dotted')
    expect(dotted.customArrows?.[0].color).toBe('green')
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
  it('renders generated arrow style and color overrides independently', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        ...SAMPLE_WHITFIELD.layoutOverrides,
        'arrow:income': { style: 'dotted', color: 'blue' },
        'arrow:asNeeded': { style: 'solid', color: 'red' },
      },
    } as typeof SAMPLE_WHITFIELD
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(markup).toMatch(
      /data-arrow-kind="income"[^>]*data-arrow-style="dotted"[^>]*stroke="#2f6bab"/,
    )
    expect(markup).toMatch(
      /data-arrow-kind="asNeeded"[^>]*data-arrow-style="solid"[^>]*stroke="#c03a2d"/,
    )
  })

  it('uses fixed arrowhead geometry and one stroke width for every style', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data: {
          ...SAMPLE_WHITFIELD,
          customArrows: SAMPLE_WHITFIELD.customArrows?.map((arrow) => ({
            ...arrow,
            style: 'dotted' as const,
          })),
        },
      }),
    )

    expect(markup).not.toContain('markerUnits="strokeWidth"')
    expect(markup).toContain('markerUnits="userSpaceOnUse"')
    expect(markup).toContain('markerWidth="8"')
    expect(markup).toContain('markerHeight="8"')
    expect(markup).not.toContain('stroke-width=3.5')
  })

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
  it('renders calculated need supporting text as a movable non-editable target', () => {
    const markup = renderToStaticMarkup(createElement(MapSvg, {
      data: { ...SAMPLE_WHITFIELD, asNeededAmount: 9_000 },
      onChange: () => undefined,
      onElementClick: () => undefined,
    }))

    expect(markup).toContain('text:need:supporting')
    expect(markup).toContain('aria-label="Adjust coverage note:')
    expect(markup).not.toContain('Edit needSupporting')
  })

  const editorChrome = [
    'map-arrow-delete',
    'map-arrow-editor',
    'map-arrow-handle',
    'map-arrow-label-add',
    'map-arrow-style',
    'map-arrow-colors',
    'map-connect-handle',
    'map-resize-handle',

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
    expect(markup).not.toContain('data-account-controls-for=')
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
        {
          id: 'footnote-dana-2026-rmd',
          label: 'Dana 2026 RMD',
          gross: 80_000,
          net: 61_000,
        },
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

  it('renders every newly movable fixed text role at its override offset', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        'text:income:header': { dx: 11, dy: 12 },
        'text:income:row': { dx: 21, dy: 22 },
        'text:income:total': { dx: 31, dy: 32 },
        'text:need:label': { dx: 41, dy: -12 },
        'text:need:value': { dx: 51, dy: -22 },
        'text:footnotes:line': { dx: 100, dy: -32 },
        'text:masthead:label': { dx: -20, dy: 80 },
      },
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    for (const [dx, dy] of [
      [11, 12],
      [21, 22],
      [31, 32],
      [41, -12],
      [51, -22],
      [100, -32],
      [-20, 80],
    ]) {
      expect(markup).toContain(`transform="translate(${dx} ${dy})"`)
    }
  })

  it('renders account row/sub blocks and custom flow labels at moved positions', () => {
    const rowsId = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.positions?.length,
    )!.id
    const subId = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.subAccounts?.length,
    )!.id
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        [`text:${rowsId}:rows`]: { dx: 26, dy: -13 },
        [`text:${subId}:sub`]: { dx: -18, dy: 15 },
      },
      customArrows: [
        {
          id: 'rendered-label-offset',
          sourceId: 'income',
          targetId: 'need',
          style: 'solid' as const,
          label: 'Moved label',
          labelDx: 34,
          labelDy: -27,
        },
      ],
    }
    const layout = layoutMap(data)
    const rows = layout.accounts.find(
      (account) => account.account.id === rowsId,
    )!.positionRows
    const arrow = layout.arrows.find(
      (candidate) => candidate.id === 'rendered-label-offset',
    )!
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(markup).toContain(`x="${rows[0].leftX + layout.accounts.find(
      (account) => account.account.id === rowsId,
    )!.x}"`)
    expect(markup).toContain('transform="translate(-18 15)"')
    expect(markup).toContain(
      `x="${arrow.labelAt!.x}" y="${arrow.labelAt!.y + 14.5 / 3}"`,
    )
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
    const subTitleSize = layoutMap(data).accounts.find(
      (account) => account.account.id === 'managed-ira-jordan',
    )!.subAccountLayouts[0].titleFontSize

    expect(markup).toMatch(
      /font-size="24"[^>]*><tspan[^>]*>S&amp;P<\/tspan>/,
    )
    expect(markup).toMatch(/font-size="24"[^>]*>\$380,000/)
    expect(subTitleSize).toBeCloseTo((14.5 / 19) * 34)
    expect(markup).toMatch(
      new RegExp(
        `font-size="${subTitleSize}"[^>]*font-weight="600"[^>]*><tspan[^>]*>Short-Te`,
      ),
    )
    expect(markup).toMatch(/font-size="34"[^>]*>\$240,0…/)
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
      /data-arrow-color="green"[^>]*data-arrow-style="dotted"[^>]*stroke="#1e7a4a"/,
    )
    expect(interactiveMarkup).toContain(
      `data-map-target="arrow:custom:${data.customArrows[0].id}"`,
    )
    expect(interactiveMarkup).not.toContain('map-arrow-color-ring')
  })

  it('compacts only constrained as-needed money while retaining exact accessible text', () => {
    const constrained = renderToStaticMarkup(
      createElement(MapSvg, {
        data: { ...SAMPLE_WHITFIELD, asNeededAmount: 930_923_028 },
      }),
    )
    const unconstrained = renderToStaticMarkup(
      createElement(MapSvg, {
        data: { ...SAMPLE_WHITFIELD, asNeededAmount: 930_923 },
      }),
    )
    const placeholder = renderToStaticMarkup(
      createElement(MapSvg, {
        data: { ...SAMPLE_WHITFIELD, asNeededAmount: null },
      }),
    )

    expect(constrained).toContain(
      'aria-label="Monthly income drawn as needed $930,923,028"',
    )
    expect(constrained).toContain(
      '<title>Monthly income drawn as needed $930,923,028</title>',
    )
    expect(constrained).toMatch(/>\$930\.9M<\/tspan>/)
    expect(unconstrained).toMatch(/>\$930,923<\/tspan>/)
    expect(unconstrained).not.toContain('$930.9K')
    expect(placeholder).toContain('~$ ______')
  })

  it('keeps selection geometry in the SVG and all actions in HTML', () => {
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
    const selectedAccount = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
        selectedTargetKey: 'account:' + data.accounts[0].id,
      }),
    )
    const selectedArrow = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
        selectedTargetKey: 'arrow:custom:test-arrow',
      }),
    )

    expect(markup).toContain('map-interactive')
    expect(markup).toContain('map-arrow-editor')
    expect(markup).toContain('class="map-editable-hit"')
    expect(markup).not.toContain('map-arrow-handle-hit')
    for (const className of editorChrome.filter(
      (name) => name !== 'map-arrow-editor' && name !== 'map-arrow-handle',
    )) {
      expect(markup).not.toContain(className)
    }
    expect(selectedAccount).toContain('data-map-selected="true"')
    expect(selectedAccount).not.toContain('map-account-controls')
    expect(selectedArrow.match(/class="map-arrow-handle-hit"/g)).toHaveLength(3)
  })
})
