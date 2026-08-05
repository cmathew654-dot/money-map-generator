import { describe, expect, it } from 'vitest'
import {
  applyMapTextEdit,
  mapTextEditAggregateTarget,
} from '../src/ui/MapTextEditor'
import { SAMPLE_WHITFIELD } from '../src/model/samples'

describe('s51 aggregate map edits', () => {
  it('keeps a position-backed account total unchanged and identifies its rows for the follow-up affordance', () => {
    const accountId = 'managed-after-tax-trust'
    const before = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.id === accountId,
    )!
    const updated = applyMapTextEdit(
      SAMPLE_WHITFIELD,
      { kind: 'accountValue', accountId },
      '999k',
    )
    const after = updated.accounts.find((account) => account.id === accountId)!

    expect(after.value).toBe(710_000)
    expect(after.positions).toEqual(before.positions)
    expect(
      mapTextEditAggregateTarget(SAMPLE_WHITFIELD, {
        kind: 'accountValue',
        accountId,
      }),
    ).toEqual({ section: 'accounts', id: accountId })
  })

  it('leaves totals editable when the rows underneath them are not the whole story', () => {
    // Sub-accounts are earmarked carve-outs and positions can be a partial
    // highlight. Neither makes the total a sum, so neither edit is refused.
    const carveOut = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.id === 'managed-ira-jordan',
    )!
    const partial = {
      ...SAMPLE_WHITFIELD,
      accounts: SAMPLE_WHITFIELD.accounts.map((account) =>
        account.id === 'managed-after-tax-trust'
          ? { ...account, positions: account.positions?.slice(0, 1) }
          : account,
      ),
    }

    expect(carveOut.subAccounts?.length).toBe(1)
    expect(
      mapTextEditAggregateTarget(SAMPLE_WHITFIELD, {
        kind: 'accountValue',
        accountId: 'managed-ira-jordan',
      }),
    ).toBeNull()
    expect(
      mapTextEditAggregateTarget(partial, {
        kind: 'accountValue',
        accountId: 'managed-after-tax-trust',
      }),
    ).toBeNull()
    expect(
      applyMapTextEdit(
        partial,
        { kind: 'accountValue', accountId: 'managed-after-tax-trust' },
        '999k',
      ).accounts.find((account) => account.id === 'managed-after-tax-trust')!
        .value,
    ).toBe(999_000)
  })

  it('never treats after-tax income as a sum of the income rows', () => {
    // The map's gross rows total 4,300 against a 5,900 after-tax figure — it is
    // a number the advisor enters, not a total the rows produce.
    expect(
      mapTextEditAggregateTarget(SAMPLE_WHITFIELD, { kind: 'afterTaxIncome' }),
    ).toBeNull()
    expect(
      applyMapTextEdit(SAMPLE_WHITFIELD, { kind: 'afterTaxIncome' }, '6k')
        .afterTaxIncome,
    ).toBe(6_000)
  })
})
