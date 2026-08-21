// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { createHash } from 'node:crypto'
import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { duplicateClient, newBook, parseBook } from '../src/model/book'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapSvg } from '../src/render/MapSvg'
import { MapInspector } from '../src/render/MapInspector'

const primaryAccountId = 'managed-ira-jordan'
const secondaryAccountId = 'managed-after-tax-trust'
const primarySleeves = [
  { id: 'risk-rail-reserve', label: 'Reserve sleeve', value: 80_000 },
  { id: 'risk-rail-income', label: 'Income sleeve', value: 120_000 },
  { id: 'risk-rail-growth', label: 'Growth sleeve', value: 240_000 },
]
const secondarySleeves = [
  { id: 'risk-rail-bonds', label: 'Bond sleeve', value: 160_000 },
  { id: 'risk-rail-equity', label: 'Equity sleeve', value: 320_000 },
]
const PRE_PLAN_SAMPLE_MARKUP_SHA256 = '89d3ee6eb39abfcca937f7835e91dfac70de121de6824a9ec448f5b8a6ebcf7f'

function sleeveRiskFlag(account: unknown): unknown {
  return (account as { showSleeveRisk?: unknown }).showSleeveRisk
}

function renderMap(data: MoneyMapData, editable = false): string {
  return renderToStaticMarkup(
    createElement(
      MapSvg,
      editable
        ? { data, onElementClick: () => undefined }
        : { data },
    ),
  )
}

function markupHash(markup: string): string {
  return createHash('sha256').update(markup).digest('hex')
}

function riskRails(markup: string): string[] {
  return Array.from(
    markup.matchAll(
      /<line(?=[^>]*role="img")(?=[^>]*aria-label="Sleeve \d+ of \d+ layering cue")[^>]*>/g,
    ),
    (match) => match[0],
  )
}

function attribute(element: string, name: string): string {
  const match = element.match(new RegExp(`\\b${name}="([^"]*)"`))
  if (!match) throw new Error(`Missing ${name} attribute.`)
  return match[1]
}

function sleeveRects(markup: string, accountId: string) {
  return Array.from(
    markup.matchAll(
      new RegExp(
        `<rect(?=[^>]*data-map-edit-hit="accountSub:${accountId}")[^>]*>`,
        'g',
      ),
    ),
    (match) => {
      const rect = match[0]
      return {
        x: attribute(rect, 'x'),
        y: attribute(rect, 'y'),
        width: attribute(rect, 'width'),
        height: attribute(rect, 'height'),
      }
    },
  )
}

function sleeveLabelPositions(markup: string, labels: string[]): number[] {
  return labels.map((label) => markup.indexOf(`>${label}<`))
}

function sleeveData(showCue: boolean): MoneyMapData {
  const data = structuredClone(SAMPLE_WHITFIELD)
  data.accounts = data.accounts.map((account) => {
    if (account.id === primaryAccountId) {
      return {
        ...account,
        ...(showCue ? { showSleeveRisk: true } : {}),
        subAccounts: primarySleeves,
      }
    }
    if (account.id === secondaryAccountId) {
      return { ...account, subAccounts: secondarySleeves }
    }
    return account
  })
  return data
}

type InspectorControl = ReactElement<{
  'aria-label'?: string
  'aria-pressed'?: boolean
  children?: ReactNode
  onClick?: () => void
}>

function findInspectorControl(node: ReactNode, label: string): InspectorControl {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as InspectorControl
    if (element.props['aria-label'] === label) return element
    if (element.props.children !== undefined) {
      try {
        return findInspectorControl(element.props.children, label)
      } catch {
        // Keep searching sibling branches.
      }
    }
  }
  throw new Error(`Missing inspector control: ${label}`)
}

describe('sleeve layering cue', () => {
  it('keeps the per-account cue absent by default, persists it, validates it, and copies it', () => {
    const absent = parseBook(JSON.stringify(newBook()))
    expect(
      absent.clients.flatMap((client) => client.accounts).every(
        (account) => sleeveRiskFlag(account) === undefined,
      ),
    ).toBe(true)

    const book = newBook()
    const account = book.clients[0].accounts[0]
    account.showSleeveRisk = true

    const parsed = parseBook(JSON.stringify(book))
    expect(sleeveRiskFlag(parsed.clients[0].accounts[0])).toBe(true)
    expect(
      parsed.clients[0].accounts.slice(1).every(
        (other) => sleeveRiskFlag(other) === undefined,
      ),
    ).toBe(true)

    const copy = duplicateClient(book, book.clients[0].id).book.clients.at(-1)!
    expect(sleeveRiskFlag(copy.accounts[0])).toBe(true)

    const invalid = newBook() as unknown as {
      clients: { accounts: { showSleeveRisk?: unknown }[] }[]
    }
    invalid.clients[0].accounts[0].showSleeveRisk = 'yes'
    expect(() => parseBook(JSON.stringify(invalid))).toThrow(
      'Client 1 has an invalid sleeve risk flag.',
    )
  })

  it('draws an opt-in layered cue without moving or reordering sleeves', () => {
    const sampleMarkup = renderMap(SAMPLE_WHITFIELD)
    const withoutCue = sleeveData(false)
    const withCue = sleeveData(true)
    const offMarkup = renderMap(withoutCue, true)
    const onMarkup = renderMap(withCue, true)
    const offPrimaryRects = sleeveRects(offMarkup, primaryAccountId)
    const onPrimaryRects = sleeveRects(onMarkup, primaryAccountId)
    const offSecondaryRects = sleeveRects(offMarkup, secondaryAccountId)
    const onSecondaryRects = sleeveRects(onMarkup, secondaryAccountId)
    const labels = primarySleeves.map((sleeve) => sleeve.label)
    const offLabelPositions = sleeveLabelPositions(offMarkup, labels)
    const onLabelPositions = sleeveLabelPositions(onMarkup, labels)

    expect(riskRails(offMarkup)).toHaveLength(0)

    const rails = riskRails(onMarkup)
    expect(rails).toHaveLength(primarySleeves.length)
    expect(rails.map((rail) => attribute(rail, 'aria-label'))).toEqual(
      primarySleeves.map(
        (_sleeve, index) =>
          `Sleeve ${index + 1} of ${primarySleeves.length} layering cue`,
      ),
    )

    const weights = rails.map((rail) => Number(attribute(rail, 'stroke-width')))
    expect(weights[0]).not.toBe(weights.at(-1))
    expect(
      weights.every((weight, index) => index === 0 || weight > weights[index - 1]),
    ).toBe(true)

    expect(onPrimaryRects).toEqual(offPrimaryRects)
    expect(onSecondaryRects).toEqual(offSecondaryRects)
    expect(
      offLabelPositions.every(
        (position, index) => index === 0 || position > offLabelPositions[index - 1],
      ),
    ).toBe(true)
    expect(
      onLabelPositions.every(
        (position, index) => index === 0 || position > onLabelPositions[index - 1],
      ),
    ).toBe(true)
    expect(
      rails.some((rail) => attribute(rail, 'aria-label').includes('of 2 ')),
    ).toBe(false)
    expect(markupHash(sampleMarkup)).toBe(PRE_PLAN_SAMPLE_MARKUP_SHA256)
  })

  it('offers and toggles the sleeve layering cue for only the selected sleeve account', () => {
    let current = sleeveData(false)
    const originalOthers = current.accounts.filter(
      (account) => account.id !== primaryAccountId,
    )
    const inspector = () =>
      MapInspector({
        data: current,
        selectedTargetKey: `account:${primaryAccountId}`,
        onChange: (next) => { current = next },
        onClose: () => undefined,
        onSelect: () => undefined,
      })
    const toggle = () => findInspectorControl(inspector(), 'Sleeve layering cue')

    expect(toggle().props['aria-pressed']).toBe(false)
    expect(toggle().props.children).toBe('Off')
    toggle().props.onClick?.()
    expect(
      current.accounts.find((account) => account.id === primaryAccountId)
        ?.showSleeveRisk,
    ).toBe(true)
    expect(
      current.accounts
        .filter((account) => account.id !== primaryAccountId)
        .every((account, index) => account === originalOthers[index]),
    ).toBe(true)
    expect(toggle().props['aria-pressed']).toBe(true)
    expect(toggle().props.children).toBe('On')
    toggle().props.onClick?.()
    expect(
      current.accounts.find((account) => account.id === primaryAccountId)
        ?.showSleeveRisk,
    ).not.toBe(true)

    const noSleeves = sleeveData(false)
    const noSleeveAccount = noSleeves.accounts.find(
      (account) => !account.subAccounts?.length,
    )!
    const noSleevesMarkup = renderToStaticMarkup(
      createElement(MapInspector, {
        data: noSleeves,
        selectedTargetKey: `account:${noSleeveAccount.id}`,
        onChange: () => undefined,
        onClose: () => undefined,
        onSelect: () => undefined,
      }),
    )
    expect(noSleevesMarkup).not.toContain('aria-label="Sleeve layering cue"')
  })
})
