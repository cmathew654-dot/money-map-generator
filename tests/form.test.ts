import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  ClientSection,
  IncomeSection,
  NeedSection,
  NotesSection,
  addIncomeSource,
  appendBlankNote,
  updateNoteText,
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

describe('need fine print', () => {
  it('nests the renamed fine print controls in Need', () => {
    const data = blankClient()
    data.footnotes = [{ label: '', gross: null, net: null }]

    const markup = renderToStaticMarkup(
      createElement(NeedSection, {
        data,
        onChange: () => undefined,
      }),
    )

    expect(markup).toContain('Fine print')
    expect(markup).toContain('+ Add fine print line')
    expect(markup).toContain('Remove fine print line 1')
    expect(markup).not.toContain('Footnotes')
    expect(markup).not.toContain('+ Add footnote')
  })
})

describe('map note form helpers', () => {
  it('appends centered blank notes with unique ids', () => {
    const data = blankClient()
    const first = appendBlankNote(data)
    const second = appendBlankNote(first)

    expect(first.notes).toHaveLength(1)
    expect(first.notes?.[0]).toMatchObject({
      text: '',
      x: 540,
      y: 510,
    })
    expect(second.notes).toHaveLength(2)
    expect(second.notes?.[1].id).not.toBe(first.notes?.[0].id)
    expect(data.notes).toBeUndefined()
  })

  it('updates matching text and is a no-op for an unknown id', () => {
    const data = appendBlankNote(blankClient())
    const id = data.notes?.[0].id ?? ''
    const updated = updateNoteText(data, id, 'Call out this detail')

    expect(updated.notes?.[0].text).toBe('Call out this detail')
    expect(updateNoteText(updated, 'missing-note', 'ignored')).toBe(
      updated,
    )
  })

  it('renders a two-row textarea and filters the selected note on delete', () => {
    const first = appendBlankNote(blankClient())
    const data = appendBlankNote(first)
    const removedId = data.notes?.[0].id
    const remaining = data.notes?.filter((note) => note.id !== removedId)

    const markup = renderToStaticMarkup(
      createElement(NotesSection, {
        data,
        onChange: () => undefined,
      }),
    )

    expect(markup).toContain('rows="2"')
    expect(markup).toContain('+ Add note')
    expect(markup).toContain('Remove note 1')
    expect(remaining).toEqual([data.notes?.[1]])
  })
})
