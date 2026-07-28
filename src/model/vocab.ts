import type { MoneyMapFile } from './types'

export const ACCOUNT_TYPE_SEEDS = [
  'Roth IRA',
  'Traditional IRA',
  'Rollover IRA',
  'Inherited IRA',
  'SEP IRA',
  '401(k)',
  '403(b)',
  '457(b)',
  '529 Plan',
  'HSA',
  'Joint TOD',
  'Individual',
  'Trust Account',
  'Checking',
  'Savings',
  'Money Market',
  'CD',
  'Brokerage',
  'Variable Annuity',
  'Fixed Annuity',
  'Fixed-Index Annuity',
  'VUL',
  'IUL',
  'Whole Life',
  'Term Life',
  'Donor-Advised Fund',
  'Charitable Trust',
  'Cash at Bank',
] as const

export const CARRIER_SEEDS = [
  'Jackson National',
  'Pacific Life',
  'Minnesota Life',
  'Allianz',
  'Athene',
  'Nationwide',
  'Lincoln Financial',
  'Prudential',
  'Equitable',
  'Brighthouse',
  'Securian',
  'New York Life',
  'MassMutual',
  'Fidelity',
  'Schwab',
  'Vanguard',
] as const

export interface VocabularyTerm {
  text: string
  frequency: number
}

export interface VocabularySuggestion {
  text: string
  matchStart: number
  matchEnd: number
  fromBook: boolean
}

interface CasingCount {
  count: number
  firstSeen: number
}

export function buildVocabulary(book: MoneyMapFile): VocabularyTerm[] {
  const counts = new Map<
    string,
    {
      frequency: number
      casings: Map<string, CasingCount>
    }
  >()
  let seenIndex = 0

  const add = (raw: string | undefined) => {
    const text = raw?.trim()
    if (!text) return
    const key = text.toLocaleLowerCase()
    const entry = counts.get(key) ?? {
      frequency: 0,
      casings: new Map<string, CasingCount>(),
    }
    const casing = entry.casings.get(text) ?? {
      count: 0,
      firstSeen: seenIndex,
    }
    entry.frequency += 1
    casing.count += 1
    entry.casings.set(text, casing)
    counts.set(key, entry)
    seenIndex += 1
  }

  for (const client of book.clients) {
    for (const account of client.accounts) {
      add(account.label)
      add(account.caption)
      for (const position of account.positions ?? []) add(position.label)
      for (const subAccount of account.subAccounts ?? []) {
        add(subAccount.label)
        add(subAccount.caption)
      }
    }
    for (const source of client.incomeSources) {
      add(source.label)
      add(source.qualifier)
    }
  }

  return Array.from(counts.values())
    .map(({ casings, frequency }) => {
      const [text] = Array.from(casings.entries()).sort(
        ([, left], [, right]) =>
          right.count - left.count || left.firstSeen - right.firstSeen,
      )[0]
      return { text, frequency }
    })
    .sort(
      (left, right) =>
        right.frequency - left.frequency ||
        left.text.localeCompare(right.text, 'en', {
          sensitivity: 'base',
        }),
    )
}

export function suggest(
  bookTerms: readonly VocabularyTerm[],
  seeds: readonly string[],
  query: string,
  limit = 8,
): VocabularySuggestion[] {
  if (!query.trim() || limit <= 0) return []

  const normalizedQuery = query.toLocaleLowerCase()
  const seen = new Set(
    bookTerms.map((term) => term.text.toLocaleLowerCase()),
  )
  const suggestions: VocabularySuggestion[] = []
  const addMatch = (text: string, fromBook: boolean) => {
    const normalizedText = text.toLocaleLowerCase()
    if (normalizedText === normalizedQuery) return
    const matchStart = normalizedText.indexOf(normalizedQuery)
    if (matchStart < 0) return
    suggestions.push({
      text,
      matchStart,
      matchEnd: matchStart + query.length,
      fromBook,
    })
  }

  const sortedBookTerms = [...bookTerms].sort(
    (left, right) =>
      right.frequency - left.frequency ||
      left.text.localeCompare(right.text, 'en', {
        sensitivity: 'base',
      }),
  )
  const emittedBookTerms = new Set<string>()
  for (const term of sortedBookTerms) {
    const key = term.text.toLocaleLowerCase()
    if (emittedBookTerms.has(key)) continue
    emittedBookTerms.add(key)
    addMatch(term.text, true)
    if (suggestions.length >= limit) return suggestions
  }

  for (const seed of seeds) {
    const key = seed.toLocaleLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    addMatch(seed, false)
    if (suggestions.length >= limit) break
  }
  return suggestions
}
