import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Form } from '../src/form/Form'
import { blankClient } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'

function withAccounts(): MoneyMapData {
  const data = blankClient()
  data.accounts = [
    { id: 'roth-ira', bucket: 'taxPreferred', label: 'Roth IRA', value: 240_000 },
    { id: 'roth-401k', bucket: 'taxPreferred', label: 'Roth 401(k)', value: 60_000 },
    { id: 'cash-bank', bucket: 'cash', label: 'Cash at Bank', value: 35_000 },
  ]
  return data
}

function render(data: MoneyMapData, filter: string) {
  return renderToStaticMarkup(
    createElement(Form, {
      activeSection: 'accounts',
      data,
      filter,
      onChange: () => undefined,
      onSectionFocus: () => undefined,
    }),
  )
}

describe('Data panel filter narrows account rows', () => {
  it('renders only the matching account rows for a query', () => {
    const data = withAccounts()
    const before = JSON.stringify(data)

    const markup = render(data, 'Roth')

    expect(markup).toContain('data-form-section="accounts"')
    expect(markup).toContain('Roth IRA')
    expect(markup).toContain('Roth 401(k)')
    expect(markup).not.toContain('Cash at Bank')
    expect(data).toEqual(JSON.parse(before))
  })

  it('matches case-insensitively', () => {
    const markup = render(withAccounts(), 'cASh at bank')

    expect(markup).toContain('Cash at Bank')
    expect(markup).not.toContain('Roth IRA')
  })

  it('renders every account row when the filter is empty', () => {
    const markup = render(withAccounts(), '')

    expect(markup).toContain('Roth IRA')
    expect(markup).toContain('Roth 401(k)')
    expect(markup).toContain('Cash at Bank')
  })
})

describe('Data panel filter with zero matches (task 1: baseline, then final state)', () => {
  it('renders no sections and a stated message for a query nothing matches', () => {
    // 'zzznomatch' has no substring collision against any section key or
    // label ('client'/'income'/'accounts'/'need'/'notes'), so this proves
    // the true zero-match case rather than an accidental partial match.
    const markup = render(withAccounts(), 'zzznomatch')
    const sectionCount = (markup.match(/data-form-section="/g) ?? []).length

    expect(sectionCount).toBe(0)
    // Baseline finding (task 1): contrary to the UI-SPEC's prediction that
    // the panel "goes blank," the shipped code already rendered a message
    // here before this plan touched it — "No matching data sections.",
    // shipped since commit c44cae0 (2026-08-02), pre-dating this phase.
    // Task 3 (this final assertion) updates the copy per the plan.
    expect(markup).toContain('No fields match that filter.')
    expect(markup).not.toContain('No matching data sections.')
  })

  it('renders no zero-results message when the filter is blank', () => {
    const markup = render(withAccounts(), '')

    expect(markup).not.toContain('No fields match that filter.')
  })
})
