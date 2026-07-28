import { describe, expect, it } from 'vitest'
import { accountDisplayName } from '../src/model/format'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  addCustomArrow,
  deleteCustomArrow,
} from '../src/render/mapInteraction'
import {
  applyMapTextEdit,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'

const accountId = 'managed-ira-jordan'

describe('applyMapTextEdit', () => {
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
