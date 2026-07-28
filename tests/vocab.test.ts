import { describe, expect, it } from 'vitest'
import {
  buildVocabulary,
  suggest,
  type VocabularyTerm,
} from '../src/model/vocab'
import type { MoneyMapFile } from '../src/model/types'
import { blankClient } from '../src/model/samples'

function bookWithTerms(): MoneyMapFile {
  const first = blankClient()
  first.id = 'client-a'
  first.accounts = [
    {
      id: 'account-a',
      bucket: 'afterTax',
      label: 'Trust Account',
      caption: 'Long-term growth',
      value: 1,
      positions: [
        { label: 'Jackson National', value: 1 },
        { label: 'Fidelity', value: 1 },
      ],
      subAccounts: [
        {
          label: 'Income reserve',
          caption: 'Two years',
          value: 1,
        },
      ],
    },
  ]
  first.incomeSources = [
    {
      label: 'Social Security',
      amount: 1,
      period: 'mo',
      qualifier: 'Gross',
    },
  ]

  const second = structuredClone(first)
  second.id = 'client-b'
  second.accounts[0].id = 'account-b'
  second.accounts[0].label = 'trust account'
  second.accounts[0].caption = undefined
  second.accounts[0].positions = [
    { label: 'Jackson National', value: 1 },
  ]
  second.accounts[0].subAccounts = []
  second.incomeSources[0].label = 'SOCIAL SECURITY'
  second.incomeSources[0].qualifier = undefined

  const third = structuredClone(first)
  third.id = 'client-c'
  third.accounts[0].id = 'account-c'
  third.accounts[0].label = 'Trust Account'
  third.accounts[0].caption = undefined
  third.accounts[0].positions = []
  third.accounts[0].subAccounts = []
  third.incomeSources = []

  return {
    fileType: 'money-map-book',
    version: 1,
    clients: [first, second, third],
  }
}

describe('buildVocabulary', () => {
  it('frequency-ranks terms harvested across every client', () => {
    const terms = buildVocabulary(bookWithTerms())

    expect(terms.slice(0, 3)).toEqual([
      { text: 'Trust Account', frequency: 3 },
      { text: 'Jackson National', frequency: 2 },
      { text: 'Social Security', frequency: 2 },
    ])
    expect(terms).toContainEqual({ text: 'Long-term growth', frequency: 1 })
    expect(terms).toContainEqual({ text: 'Income reserve', frequency: 1 })
    expect(terms).toContainEqual({ text: 'Two years', frequency: 1 })
    expect(terms).toContainEqual({ text: 'Gross', frequency: 1 })
  })

  it('dedupes case-insensitively and keeps the most frequent casing', () => {
    const terms = buildVocabulary(bookWithTerms())

    expect(
      terms.filter(
        (term) => term.text.toLocaleLowerCase() === 'trust account',
      ),
    ).toEqual([{ text: 'Trust Account', frequency: 3 }])
    expect(
      terms.find(
        (term) =>
          term.text.toLocaleLowerCase() === 'social security',
      ),
    ).toEqual({ text: 'Social Security', frequency: 2 })
  })
})

describe('suggest', () => {
  const bookTerms: VocabularyTerm[] = [
    { text: 'Jackson Family Trust', frequency: 3 },
    { text: 'Jackson National', frequency: 2 },
    { text: 'Pacific Life', frequency: 1 },
  ]

  it('places frequency-ranked book matches before seeds', () => {
    expect(
      suggest(
        bookTerms,
        ['Jackson National', 'Jackson Annuity'],
        'jack',
      ),
    ).toEqual([
      {
        text: 'Jackson Family Trust',
        matchStart: 0,
        matchEnd: 4,
        fromBook: true,
      },
      {
        text: 'Jackson National',
        matchStart: 0,
        matchEnd: 4,
        fromBook: true,
      },
      {
        text: 'Jackson Annuity',
        matchStart: 0,
        matchEnd: 4,
        fromBook: false,
      },
    ])
  })

  it('finds case-insensitive substring matches and exact indices', () => {
    expect(suggest(bookTerms, [], 'SON')).toEqual([
      {
        text: 'Jackson Family Trust',
        matchStart: 4,
        matchEnd: 7,
        fromBook: true,
      },
      {
        text: 'Jackson National',
        matchStart: 4,
        matchEnd: 7,
        fromBook: true,
      },
    ])
  })

  it('limits results to eight by default', () => {
    const seeds = Array.from(
      { length: 12 },
      (_, index) => `Account ${index + 1}`,
    )
    expect(suggest([], seeds, 'account')).toHaveLength(8)
  })

  it('returns no suggestions for an empty query', () => {
    expect(suggest(bookTerms, ['Jackson Annuity'], '')).toEqual([])
    expect(suggest(bookTerms, ['Jackson Annuity'], '   ')).toEqual([])
  })

  it('does not offer the exact free-text value back to the user', () => {
    expect(
      suggest(
        [{ text: 'beac', frequency: 1 }],
        ['Beacon Harbor Account'],
        'beac',
      ),
    ).toEqual([
      {
        text: 'Beacon Harbor Account',
        matchStart: 0,
        matchEnd: 4,
        fromBook: false,
      },
    ])
  })
})
