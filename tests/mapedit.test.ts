import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { accountDisplayName } from '../src/model/format'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  addCustomArrow,
  accountTextPointerAction,
  addMapNote,
  deleteCustomArrow,
  deleteMapNote,
} from '../src/render/mapInteraction'
import { MapSvg } from '../src/render/MapSvg'
import {
  adjustAccountTextFontSize,
  applyMapTextEdit,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'

const accountId = 'managed-ira-jordan'

describe('applyMapTextEdit', () => {
  it('clamps account text font-size steps at 9 and 28', () => {
    expect(adjustAccountTextFontSize(9, -1)).toBe(9)
    expect(adjustAccountTextFontSize(9, 1)).toBe(10)
    expect(adjustAccountTextFontSize(28, 1)).toBe(28)
    expect(adjustAccountTextFontSize(28, -1)).toBe(27)
  })

  it('decides edit versus move at the account text drag threshold', () => {
    const start = { x: 20, y: 30 }

    expect(accountTextPointerAction(start, { x: 23, y: 32 })).toBe('edit')
    expect(accountTextPointerAction(start, { x: 24, y: 30 })).toBe('move')
  })

  it.each([
    [{ kind: 'accountValue', accountId }, 'account'],
    [{ kind: 'incomeAmount', incomeIndex: 0 }, 'income'],
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
})

describe('custom arrow edits', () => {
  it('rejects self, unknown, and duplicate connections without changes', () => {
    const first = SAMPLE_WHITFIELD.accounts[0].id
    const second = SAMPLE_WHITFIELD.accounts[1].id
    const withArrow = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        { id: 'existing', sourceId: first, targetId: second },
      ],
    }

    expect(addCustomArrow(SAMPLE_WHITFIELD, first, first)).toBe(
      SAMPLE_WHITFIELD,
    )
    expect(addCustomArrow(SAMPLE_WHITFIELD, 'missing', first)).toBe(
      SAMPLE_WHITFIELD,
    )
    expect(addCustomArrow(SAMPLE_WHITFIELD, first, 'missing')).toBe(
      SAMPLE_WHITFIELD,
    )
    expect(addCustomArrow(withArrow, first, second)).toBe(withArrow)
  })

  it('appends a fresh custom arrow and allows reverse direction', () => {
    const first = SAMPLE_WHITFIELD.accounts[0].id
    const second = SAMPLE_WHITFIELD.accounts[1].id
    const forward = addCustomArrow(SAMPLE_WHITFIELD, first, second)
    const reverse = addCustomArrow(forward, second, first)

    expect(forward).not.toBe(SAMPLE_WHITFIELD)
    expect(forward.customArrows).toHaveLength(1)
    expect(forward.customArrows?.[0]).toMatchObject({
      sourceId: first,
      targetId: second,
    })
    expect(forward.customArrows?.[0].id).toMatch(/^arrow-/)
    expect(reverse.customArrows).toHaveLength(2)
  })

  it('deletes by id and leaves unknown deletes untouched', () => {
    const withArrow = addCustomArrow(
      SAMPLE_WHITFIELD,
      'income',
      'need',
    )
    const id = withArrow.customArrows![0].id
    const deleted = deleteCustomArrow(withArrow, id)

    expect(deleted.customArrows).toEqual([])
    expect(deleteCustomArrow(withArrow, 'missing')).toBe(withArrow)
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
})

describe('noninteractive map rendering', () => {
  const editorChrome = [
    'map-arrow-delete',
    'map-arrow-editor',
    'map-arrow-handle',
    'map-connect-handle',
    'map-resize-handle',
    'map-rotate-handle',
    'map-shape-flip',
    'map-note-delete',
  ]

  it('emits zero editor chrome nodes without edit callbacks', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        { id: 'print-note', text: 'Print this annotation.', x: 520, y: 480 },
      ],
    }
    const markup = renderToStaticMarkup(
      createElement(MapSvg, { data }),
    )

    expect(markup).toContain('Print this annotation.')
    for (const className of editorChrome) {
      expect(markup).not.toContain(className)
    }
    expect(markup).not.toContain('map-interactive')
    expect(markup).not.toContain('map-editable-text')
    expect(markup).not.toContain('data-connect-id')
  })

  it('keeps editor chrome in the interactive render path', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      notes: [
        { id: 'test-note', text: 'Printed note', x: 520, y: 480 },
      ],
      customArrows: [
        { id: 'test-arrow', sourceId: 'income', targetId: 'need' },
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
    for (const className of editorChrome) {
      expect(markup).toContain(className)
    }
  })
})
