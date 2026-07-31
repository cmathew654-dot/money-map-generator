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
  appendBlankPosition,
  focusPendingTarget,
  isMoneyDraftDirty,
  synchronizeMoneyDraft,
  nextEnterFocusTarget,
  updateNoteText,
  yearSelectOptions,
} from '../src/form/Form'
import { blankClient } from '../src/model/samples'

describe('income source presets', () => {
  it('adds a prefilled row without mutating the existing rows', () => {
    const existing = [
      { id: 'income-existing', label: 'Pension', amount: 2_000, period: 'mo' as const },
    ]

    const result = addIncomeSource(existing, 'Social Security')

    expect(result).toEqual([
      existing[0],
      {
        id: expect.stringMatching(/^income-/),
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
      { id: 'income-test', label: '', amount: null, period: 'mo' },
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

describe('rapid-entry keyboard helpers', () => {
  it('advances through a select in the Enter chain', () => {
    const titleInput = { id: 'title' }
    const periodSelect = { id: 'period' }
    const shownAsInput = { id: 'shown-as' }
    const focusables = [titleInput, periodSelect, shownAsInput]

    expect(nextEnterFocusTarget(focusables, titleInput)).toBe(
      periodSelect,
    )
    expect(nextEnterFocusTarget(focusables, periodSelect)).toBe(
      shownAsInput,
    )
  })

  it('only marks a money draft dirty when it changed after focus', () => {
    expect(isMoneyDraftDirty(null, '85000')).toBe(false)
    expect(isMoneyDraftDirty('85000', '85000')).toBe(false)
    expect(isMoneyDraftDirty('85k', '85000')).toBe(true)
    expect(isMoneyDraftDirty('', '85000')).toBe(true)
  })

  it('synchronizes an inactive mounted money draft without clobbering active typing', () => {
    expect(synchronizeMoneyDraft('85000', false, 72_000)).toBeNull()
    expect(synchronizeMoneyDraft('85k', true, 85_000)).toBe('85k')
    expect(synchronizeMoneyDraft(null, true, null)).toBeNull()
  })

  it('adopts focused external history values so blur and Escape cannot replay stale typing', () => {
    const externalSnapshot = '85000'
    const synchronized = synchronizeMoneyDraft('92k', true, 85_000)

    expect(synchronized).toBe(externalSnapshot)
    expect(isMoneyDraftDirty(synchronized, externalSnapshot)).toBe(false)
    expect(synchronizeMoneyDraft('92k', true, null)).toBe('')
  })
  it('focuses any pending target through the shared mechanism', () => {
    const focused: string[] = []
    const input = { focus: () => focused.push('input') }
    const textarea = { focus: () => focused.push('textarea') }

    expect(focusPendingTarget(() => input)).toBe(true)
    expect(focusPendingTarget(() => textarea)).toBe(true)
    expect(focusPendingTarget(() => null)).toBe(false)
    expect(focused).toEqual(['input', 'textarea'])
  })

  it('keeps a blur commit when Add position follows in the same gesture', () => {
    let current = blankClient()
    current.accounts = [
      {
        id: 'account-1',
        bucket: 'afterTax',
        label: 'Trust Account',
        value: null,
      },
    ]
    const onChange = (next: typeof current) => {
      current = next
    }

    onChange({
      ...current,
      accounts: current.accounts.map((account) => ({
        ...account,
        value: 85_000,
      })),
    })
    const accountAfterBlur = current.accounts[0]
    onChange({
      ...current,
      accounts: [
        {
          ...accountAfterBlur,
          positions: appendBlankPosition(
            accountAfterBlur.positions ?? [],
          ),
        },
      ],
    })

    expect(current.accounts[0].value).toBe(85_000)
    expect(current.accounts[0].positions).toEqual([
      { label: '', value: null },
    ])
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
    data.footnotes = [{ id: 'footnote-test', label: '', gross: null, net: null }]

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
