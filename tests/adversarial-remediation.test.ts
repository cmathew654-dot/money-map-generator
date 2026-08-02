import { describe, expect, it } from 'vitest'
import { layoutMap, OVERRIDE_BOUNDS } from '../src/layout/layout'
import { BookValidationError, parseBook } from '../src/model/book'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData, MoneyMapFile } from '../src/model/types'

function bookFor(client: MoneyMapData): MoneyMapFile {
  return { fileType: 'money-map-book', version: 1, clients: [client] }
}

describe('adversarial remediation', () => {
  it('rejects an imported flow that connects an item to itself', () => {
    const client = structuredClone(SAMPLE_WHITFIELD)
    client.customArrows = [
      { id: 'self', sourceId: 'income', targetId: 'income', style: 'solid' },
    ]

    expect(() => parseBook(JSON.stringify(bookFor(client)))).toThrow(
      'Jordan & Dana Whitfield has a flow that connects Income sources to itself.',
    )
    expect(() => parseBook(JSON.stringify(bookFor(client)))).toThrow(BookValidationError)
  })

  it('rejects duplicate imported flows using visible endpoint names', () => {
    const client = structuredClone(SAMPLE_WHITFIELD)
    client.customArrows = [
      { id: 'one', sourceId: 'income', targetId: 'need', style: 'solid' },
      { id: 'two', sourceId: 'income', targetId: 'need', style: 'dashed' },
    ]

    expect(() => parseBook(JSON.stringify(bookFor(client)))).toThrow(
      'Jordan & Dana Whitfield has more than one flow from Income sources to Monthly need.',
    )
  })

  it('keeps extreme free endpoints and their curve visible and distinct', () => {
    const client = structuredClone(SAMPLE_WHITFIELD)
    const id = client.customArrows![0].id
    client.layoutOverrides = {
      ...client.layoutOverrides,
      [`arrow:custom:${id}`]: {
        startAt: { dx: -1_000_000, dy: -1_000_000 },
        endAt: { dx: -1_000_000, dy: -1_000_000 },
        bow: 1_000_000,
      },
    }

    const arrow = layoutMap(client).arrows.find((candidate) => candidate.id === id)!

    expect(Math.hypot(arrow.end.x - arrow.start.x, arrow.end.y - arrow.start.y)).toBeGreaterThanOrEqual(24)
    for (const point of [arrow.start, arrow.control, arrow.end]) {
      expect(point.x).toBeGreaterThanOrEqual(OVERRIDE_BOUNDS.left)
      expect(point.x).toBeLessThanOrEqual(OVERRIDE_BOUNDS.right)
      expect(point.y).toBeGreaterThanOrEqual(OVERRIDE_BOUNDS.top)
      expect(point.y).toBeLessThanOrEqual(OVERRIDE_BOUNDS.bottom)
    }
  })

  it('keeps dense default account columns inside the editable map', () => {
    const client = structuredClone(SAMPLE_WHITFIELD)
    const long = 'W'.repeat(180)
    client.client.title = long
    client.client.mastheadLabel = long
    client.needTag = long
    client.incomeSources[0].label = long
    client.incomeSources[0].amount = Number.MAX_SAFE_INTEGER
    client.incomeSources[0].qualifier = long
    client.accounts[0] = {
      ...client.accounts[0],
      label: long,
      caption: long,
      valueTag: long,
      positions: [{ label: long, value: Number.MAX_SAFE_INTEGER }],
      subAccounts: [{ label: long, caption: long, value: -9_999_999_999_999 }],
    }
    client.footnotes = [{ id: 'extreme-footnote', label: long, gross: Number.MAX_SAFE_INTEGER, net: -9_999_999_999_999 }]
    client.notes = [{ id: 'extreme-note', text: long.repeat(3), x: 1080, y: 850, w: 120, fs: 40, bg: true }]
    client.customArrows = [{ id: 'extreme-arrow', sourceId: 'income', targetId: 'need', style: 'dotted', label: long }]

    for (const account of layoutMap(client).accounts) {
      expect(account.x, account.account.id).toBeGreaterThanOrEqual(OVERRIDE_BOUNDS.left)
      expect(account.x + account.w, account.account.id).toBeLessThanOrEqual(OVERRIDE_BOUNDS.right)
      expect(account.y, account.account.id).toBeGreaterThanOrEqual(OVERRIDE_BOUNDS.top)
      expect(account.y + account.h, account.account.id).toBeLessThanOrEqual(OVERRIDE_BOUNDS.bottom)
    }
  })
})
