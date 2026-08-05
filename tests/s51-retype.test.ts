import { describe, expect, it } from 'vitest'
import * as mapTextEditor from '../src/ui/MapTextEditor'
import { SAMPLE_WHITFIELD } from '../src/model/samples'

describe('s51 aggregate map edits', () => {
  it('keeps a position-backed account total unchanged and identifies its rows for the follow-up affordance', () => {
    const accountId = 'managed-after-tax-trust'
    const before = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.id === accountId,
    )!
    const updated = mapTextEditor.applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'accountValue', accountId },
      '999k',
    )
    const after = updated.accounts.find((account) => account.id === accountId)!
    const aggregateTarget = (
      mapTextEditor as typeof mapTextEditor & {
        mapTextEditAggregateTarget?: (
          data: typeof SAMPLE_WHITFIELD,
          target: { kind: 'accountValue'; accountId: string },
        ) => { section: 'accounts'; id: string } | null
      }
    ).mapTextEditAggregateTarget?.(SAMPLE_WHITFIELD, {
      kind: 'accountValue',
      accountId,
    })

    expect(after.value).toBe(710_000)
    expect(after.positions).toEqual(before.positions)
    expect(aggregateTarget).toEqual({ section: 'accounts', id: accountId })
  })
})
