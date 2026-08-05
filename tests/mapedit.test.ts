import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { accountDisplayName } from '../src/model/format'
import { incomeTextSizes, layoutMap, needTextLayout } from '../src/layout/layout'
import { textWidth } from '../src/layout/textfit'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  addCustomArrow,
  accountTextPointerAction,
  addMapNote,
  alignMapItems,
  cycleCustomArrowStyle,
  deleteCustomArrow,
  deleteMapNote,
  distributeMapItems,
  hideGeneratedArrow,
  layoutRect,
  resizeMapNote,
  retargetCustomArrow,
  restoreGeneratedArrows,
  setCustomArrowColor,
  setMapNoteBackground,
  setMapNoteFont,
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
  mapTextEditorTargetLabel,
  mapTextEditFsInfo,
  mapTextEditRawValue,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'
import { filterClientOptions } from '../src/ui/ClientCombobox'

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

describe('multi-item alignment', () => {
  const data = {
    ...SAMPLE_WHITFIELD,
    notes: [
      { id: 'n', text: 'Keep this note', x: 420, y: 410, w: 220 },
    ],
  }

  it.each([
    ['left', (rect: { x: number; y: number; w: number; h: number }) => rect.x],
    ['center', (rect: { x: number; y: number; w: number; h: number }) => rect.x + rect.w / 2],
    ['right', (rect: { x: number; y: number; w: number; h: number }) => rect.x + rect.w],
    ['top', (rect: { x: number; y: number; w: number; h: number }) => rect.y],
    ['middle', (rect: { x: number; y: number; w: number; h: number }) => rect.y + rect.h / 2],
    ['bottom', (rect: { x: number; y: number; w: number; h: number }) => rect.y + rect.h],
  ] as const)('aligns %s without changing item content or size', (mode, anchor) => {
    const beforeAccount = layoutRect(data, 'account:cash-at-bank')!
    const beforeNote = layoutRect(data, 'note:n')!
    const next = alignMapItems(data, ['account:cash-at-bank', 'note:n'], mode)
    const afterAccount = layoutRect(next, 'account:cash-at-bank')!
    const afterNote = layoutRect(next, 'note:n')!

    expect(anchor(afterAccount)).toBeCloseTo(anchor(afterNote), 8)
    expect(afterAccount.w).toBe(beforeAccount.w)
    expect(afterAccount.h).toBe(beforeAccount.h)
    expect(afterNote.w).toBe(beforeNote.w)
    expect(afterNote.h).toBe(beforeNote.h)
    expect(next.accounts).toEqual(data.accounts)
    expect(next.notes?.[0]).toMatchObject({ id: 'n', text: 'Keep this note', w: 220 })
  })

  it('distributes three notes across first and last extents in stable order', () => {
    const threeNotes = {
      ...SAMPLE_WHITFIELD,
      notes: [
        { id: 'a', text: 'A', x: 100, y: 120, w: 100, fs: 12 },
        { id: 'b', text: 'B', x: 270, y: 380, w: 140, fs: 16 },
        { id: 'c', text: 'C', x: 650, y: 520, w: 180, fs: 18 },
      ],
    }
    const beforeRects = ['note:a', 'note:b', 'note:c'].map((key) => layoutRect(threeNotes, key)!)
    const first = beforeRects[0]
    const last = beforeRects[2]
    const gap = (last.x + last.w - first.x - beforeRects.reduce((sum, rect) => sum + rect.w, 0)) / 2
    const expectedMiddleX = first.x + first.w + gap
    const next = distributeMapItems(
      threeNotes,
      ['note:a', 'note:b', 'note:c'],
      'horizontal',
    )
    const rects = ['note:a', 'note:b', 'note:c'].map((key) => layoutRect(next, key)!)
    expect(rects[0].x).toBeCloseTo(first.x, 8)
    expect(rects[1].x).toBeCloseTo(expectedMiddleX, 8)
    expect(rects[2].x).toBeCloseTo(last.x, 8)
    expect(next.notes).toEqual([
      expect.objectContaining({ id: 'a', text: 'A', y: 120, w: 100, fs: 12 }),
      expect.objectContaining({ id: 'b', text: 'B', y: 380, w: 140, fs: 16 }),
      expect.objectContaining({ id: 'c', text: 'C', y: 520, w: 180, fs: 18 }),
    ])
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
      // S51: a wrapped line may also inherit, taking its owning <text>'s
      // semantics — click-through under a visual label, clickable under a
      // role="button" one. Hard-coding `none` here left self-interactive text
      // unhittable; tests/s51-dblclick-hitrect.test.tsx asserts the owner.
      expect(
        tag.includes('role="button"') ||
          tag.includes('pointer-events="none"') ||
          tag.includes('pointer-events="inherit"'),
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

describe('client combobox and direct connector handles', () => {
  it('filters clients by normalized title or year substring without a fuzzy model', () => {
    const clients = Array.from({ length: 120 }, (_, index) => ({
      ...SAMPLE_WHITFIELD,
      id: `client-${index}`,
      client: {
        ...SAMPLE_WHITFIELD.client,
        title: `Household ${index}`,
        year: String(2020 + index),
      },
    }))

    expect(filterClientOptions(clients, '  HOUSEHOLD 119 ')).toHaveLength(1)
    expect(filterClientOptions(clients, '  2039 ')).toHaveLength(1)
    expect(filterClientOptions(clients, '')).toHaveLength(120)
  })

  it.each(['income', 'need', 'account:' + accountId])(
    'renders one non-focusable connector handle for %s', (selectedTargetKey) => {
      const markup = renderToStaticMarkup(
        createElement(MapSvg, {
          data: SAMPLE_WHITFIELD,
          onChange: () => undefined,
          onElementClick: () => undefined,
          selectedTargetKey,
        }),
      )

      expect(markup.match(/class="map-connector-handle"/g)).toHaveLength(1)
      expect(markup).toContain('data-connector-source="' + selectedTargetKey.replace('account:', '') + '"')
      expect(markup).toContain('tabindex="-1"')
    },
  )

  it('does not render connector handles for the print map', () => {
    const markup = renderToStaticMarkup(createElement(MapSvg, { data: SAMPLE_WHITFIELD }))
    expect(markup).not.toContain('map-connector-handle')
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

  it('sets the font on only the target note and ignores unknown ids', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        note,
        { id: 'note-other', text: 'Keep this note.', x: 620, y: 560 },
      ],
    }
    const sans = setMapNoteFont(data, note.id, 'sans')

    expect(sans.notes?.[0].font).toBe('sans')
    expect(sans.notes?.[1].font).toBeUndefined()
    expect(setMapNoteFont(sans, note.id, 'serif').notes?.[0].font).toBe('serif')
    expect(setMapNoteFont(data, 'missing', 'sans')).toBe(data)
  })

  it('renders the chosen note font and leaves legacy notes on serif', () => {
    const noteFontFamily = (font?: 'serif' | 'sans') => {
      const markup = renderToStaticMarkup(
        createElement(MapSvg, {
          data: {
            ...SAMPLE_WHITFIELD,
            notes: [{ ...note, ...(font ? { font } : {}) }],
          },
          onChange: () => undefined,
          onElementClick: () => undefined,
        }),
      )
      const tag = /<text[^>]*map-note-text[^>]*>/.exec(markup)?.[0] ?? ''
      return /font-family="([^"]*)"/.exec(tag)?.[1] ?? ''
    }

    expect(noteFontFamily('sans')).toContain('Public Sans')
    expect(noteFontFamily('serif')).toContain('Literata')
    expect(noteFontFamily()).toContain('Literata')
  })
})

describe('direct resize handles', () => {
  const data = {
    ...SAMPLE_WHITFIELD,
    notes: [
      { id: 'note-resize', text: 'Confirm the rollover.', x: 520, y: 480 },
    ],
  }

  const resizeLabels = (markup: string) =>
    [...markup.matchAll(/aria-label="(Resize [^"]*)"/g)].map((match) => match[1])

  const editableLabels = (selectedTargetKey: string | null) =>
    resizeLabels(
      renderToStaticMarkup(
        createElement(MapSvg, {
          data,
          onChange: () => undefined,
          onElementClick: () => undefined,
          selectedTargetKey,
        }),
      ),
    )

  it('offers no resize handle while nothing is selected', () => {
    expect(editableLabels(null)).toEqual([])
  })

  it('gives the selected account exactly one named resize handle', () => {
    expect(editableLabels('account:cash-at-bank')).toEqual([
      'Resize Cash at Bank',
    ])
  })

  it.each(['income', 'need', 'note:note-resize'])(
    'gives the selected %s exactly one named resize handle',
    (selectedTargetKey) => {
      const labels = editableLabels(selectedTargetKey)

      expect(labels).toHaveLength(1)
      expect(labels[0]).toMatch(/^Resize .+/)
    },
  )

  it('keeps resize handles out of noninteractive output', () => {
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(resizeLabels(markup)).toEqual([])
  })
})

describe('editable text hit geometry', () => {
  it('fits the account title target to the rendered title, not the shape width', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data: SAMPLE_WHITFIELD,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )
    const placed = layoutMap(SAMPLE_WHITFIELD).accounts.find(
      (candidate) => candidate.account.id === 'cash-at-bank',
    )!
    const hit =
      /<rect[^>]*data-map-edit-key="accountLabel:cash-at-bank"[^>]*>/.exec(
        markup,
      )?.[0] ?? ''
    const width = Number(/width="([\d.]+)"/.exec(hit)?.[1])
    const rendered = Math.max(
      ...placed.titleLines.map((line) =>
        textWidth(line, placed.text.titleFontSize),
      ),
    )

    expect(width).toBeGreaterThanOrEqual(rendered)
    expect(width).toBeLessThanOrEqual(rendered + 16)
    expect(width).toBeLessThan(placed.w * 0.84)
  })

  it('keeps fixed income, need, and note edit targets tight to their rendered text', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [{ id: 'note-tight', text: 'Rollover', x: 520, y: 480 }],
    }
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )
    const tagFor = (pattern: string) =>
      new RegExp(pattern).exec(markup)?.[0] ?? ''
    const numberIn = (tag: string, attribute: string) =>
      Number(new RegExp(`${attribute}="([\\d.]+)"`).exec(tag)?.[1] ?? 0)
    const hitWidth = (key: string) =>
      numberIn(tagFor(`<rect[^>]*data-map-edit-hit="${key}"[^>]*>`), 'width')
    /** Painted width, including the tracking SVG adds between glyphs. */
    const paintedWidth = (content: string, tag: string) =>
      textWidth(content, numberIn(tag, 'font-size')) +
      numberIn(tag, 'letter-spacing') * Math.max(0, [...content].length - 1)

    const layout = layoutMap(data)
    const note = layout.notes[0]
    const needValue = needTextLayout(data, layout.need).value.exact
    expect(note.lines).toHaveLength(1)

    const rows = [
      {
        name: 'income header',
        owner: layout.income.w - 24,
        rendered: paintedWidth(
          'INCOME SOURCES',
          tagFor('<text[^>]*>INCOME SOURCES</text>'),
        ),
        width: hitWidth('incomeHeader'),
      },
      {
        name: 'need value',
        owner: layout.need.w - 24,
        rendered: paintedWidth(
          needValue,
          tagFor('<text[^>]*data-edit-line-node="monthlyNeed"[^>]*>'),
        ),
        width: hitWidth('monthlyNeed'),
      },
      {
        name: 'note text',
        owner: note.w,
        rendered: textWidth(note.lines[0], note.fontSize),
        width: hitWidth(`noteText:${note.note.id}`),
      },
    ]

    expect(
      rows.map((row) => ({
        name: row.name,
        coversRenderedText: row.width >= row.rendered,
        narrowerThanOwner: row.width < row.owner,
        withinSmallPadding: row.width <= row.rendered + 12,
      })),
    ).toEqual(
      rows.map((row) => ({
        name: row.name,
        coversRenderedText: true,
        narrowerThanOwner: true,
        withinSmallPadding: true,
      })),
    )
  })
})

describe('amount notes and layout diagnostics', () => {
  const tagged = {
    ...SAMPLE_WHITFIELD,
    needTag: 'goal',
    incomeSources: SAMPLE_WHITFIELD.incomeSources.map((source) => ({
      ...source,
      qualifier: 'Gross',
    })),
    accounts: SAMPLE_WHITFIELD.accounts.map((account) => ({
      ...account,
      valueTag: 'est.',
    })),
  }

  it.each([
    ['interactive', true],
    ['noninteractive', false],
  ])('leaves amount-note text out of %s map output', (_name, interactive) => {
    const markup = renderToStaticMarkup(
      createElement(
        MapSvg,
        interactive
          ? {
              data: tagged,
              onChange: () => undefined,
              onElementClick: () => undefined,
            }
          : { data: tagged },
      ),
    )

    expect(markup).not.toContain('Gross')
    expect(markup).not.toContain('est.')
    expect(markup).not.toContain('goal')
    expect(markup).toContain('Cash at Bank')
  })

  it('keeps the amount-note values on the client that rendered without them', () => {
    expect(tagged.needTag).toBe('goal')
    expect(tagged.incomeSources[0].qualifier).toBe('Gross')
    expect(tagged.accounts[0].valueTag).toBe('est.')
  })

  it('still reports global layout diagnostics for internal use', () => {
    const overflowing = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        ...SAMPLE_WHITFIELD.layoutOverrides,
        [SAMPLE_WHITFIELD.accounts[0].id]: { h: 900 },
      },
    }

    expect(
      layoutMap(overflowing).warnings.some((warning) => !warning.targetKey),
    ).toBe(true)
  })
})

describe('noninteractive map rendering', () => {
  it('uses plain language for editable text and arrow accessibility names', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      customArrows: SAMPLE_WHITFIELD.customArrows?.map((arrow, index) =>
        index === 0 ? { ...arrow, label: 'Retirement transfer' } : arrow,
      ),
    }
    const markup = renderToStaticMarkup(createElement(MapSvg, {
      data,
      onChange: () => undefined,
      onElementClick: () => undefined,
    }))

    const editorTargets: MapTextEditTarget[] = [
      { kind: 'accountCaption', accountId },
      { kind: 'accountRows', accountId },
      { kind: 'accountSub', accountId },
      { kind: 'accountPositionLabel', accountId, positionIndex: 0 },
      { kind: 'accountPositionValue', accountId, positionIndex: 0 },
      { kind: 'accountSubLabel', accountId, subAccountIndex: 0 },
      { kind: 'accountSubCaption', accountId, subAccountIndex: 0 },
      { kind: 'accountSubValue', accountId, subAccountIndex: 0 },
      { kind: 'flowLabel', arrowId: 'flow' },
    ]
    expect(editorTargets.map(mapTextEditorTargetLabel)).toEqual([
      'account description',
      'investment details',
      'nested account details',
      'investment name',
      'investment amount',
      'nested account name',
      'nested account description',
      'nested account amount',
      'transfer description',
    ])
    for (const label of [
      'Edit investment details',
      'Edit nested account details',
      'Edit transfer description: Retirement transfer',
      'Adjust income flow',
      'Adjust account withdrawal flow',
      'Adjust flow from Managed IRA — Jordan to Managed After-Tax Trust',
    ]) {
      expect(markup).toContain(label)
    }
  })

  it('renders calculated need supporting text as a movable non-editable target', () => {
    const markup = renderToStaticMarkup(createElement(MapSvg, {
      data: {
        ...SAMPLE_WHITFIELD,
        asNeededAmount: 10_000,
        afterTaxIncome: Number.MAX_SAFE_INTEGER,
        monthlyNeed: Number.MAX_SAFE_INTEGER,
      },
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
    expect(markup).not.toContain('Gross')
    expect(
      data.incomeSources.some((source) => source.qualifier === 'Gross'),
    ).toBe(true)
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
