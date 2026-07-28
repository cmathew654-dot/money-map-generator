import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  ClientSection,
  IncomeSection,
  addIncomeSource,
  yearSelectOptions,
} from '../src/form/Form'
import { blankClient } from '../src/model/samples'

describe('income source presets', () => {
  it('adds a prefilled row without mutating the existing rows', () => {
    const existing = [
      { label: 'Pension', amount: 2_000, period: 'mo' as const },
    ]

    const result = addIncomeSource(existing, 'Social Security')

    expect(result).toEqual([
      existing[0],
      {
        label: 'Social Security',
        amount: null,
        period: 'mo',
      },
    ])
    expect(result).not.toBe(existing)
    expect(existing).toHaveLength(1)
  })

  it('renders the preset chips and clarified row labels', () => {
    const data = blankClient()
    data.incomeSources = [
      { label: '', amount: null, period: 'mo' },
    ]

    const markup = renderToStaticMarkup(
      createElement(IncomeSection, {
        data,
        onChange: () => undefined,
      }),
    )

    expect(markup).toContain('Income source')
    expect(markup).toContain('Shown as')
    expect(markup).toContain('e.g. Gross, After-Tax')
    expect(markup).toContain('Social Security')
    expect(markup).toContain('Something else')
    expect(markup).not.toContain('+ Add income source')
  })
})

describe('client date selects', () => {
  it('includes and selects an out-of-range stored year', () => {
    const data = blankClient()
    const storedYear = String(new Date().getFullYear() + 10)
    data.client.year = storedYear

    expect(yearSelectOptions(storedYear)).toContain(storedYear)

    const markup = renderToStaticMarkup(
      createElement(ClientSection, {
        data,
        onChange: () => undefined,
      }),
    )

    expect(markup).toContain(
      `<option value="${storedYear}" selected="">${storedYear}</option>`,
    )
  })

  it('keeps a legacy mid-year value selected until a month is chosen', () => {
    const data = blankClient()
    data.client.variant = 'postNote'
    data.client.postNoteLabel = 'April 2026'

    const markup = renderToStaticMarkup(
      createElement(ClientSection, {
        data,
        onChange: () => undefined,
      }),
    )

    expect(markup).toContain(
      '<option value="April 2026" selected="">April 2026</option>',
    )
    expect(data.client.postNoteLabel).toBe('April 2026')
  })
})
