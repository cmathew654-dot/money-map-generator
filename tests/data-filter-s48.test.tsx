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
