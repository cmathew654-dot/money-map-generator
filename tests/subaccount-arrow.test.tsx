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
import * as layout from '../src/layout/layout'
import type {
  Placed,
  PlacedAccount,
  SubAccountLayout,
} from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { parseBook } from '../src/model/book'
import { MapInspector } from '../src/render/MapInspector'
import { addCustomArrow } from '../src/render/mapInteraction'
import { MapSvg } from '../src/render/MapSvg'

const sleeveIds = {
  taxableMuni: 'sleeve-taxable-muni',
  deferredMuni: 'sleeve-deferred-muni',
} as const

type SubAccountRect = (
  placed: PlacedAccount,
  subLayout: SubAccountLayout,
) => Placed

function sleeveData(): MoneyMapData {
  const data = structuredClone(SAMPLE_WHITFIELD)
  data.accounts = data.accounts.map((account) => {
    if (account.id === 'managed-after-tax-trust') {
      return {
        ...account,
        subAccounts: [
          {
            id: sleeveIds.taxableMuni,
            label: 'Muni bonds',
            value: 330_000,
          },
        ],
      }
    }
    if (account.id === 'managed-ira-jordan') {
      return {
        ...account,
        subAccounts: [
          { id: 'sleeve-deferred-cash', label: 'Cash reserve', value: 80_000 },
          { id: 'sleeve-deferred-equity', label: 'Equity sleeve', value: 120_000 },
          {
            id: sleeveIds.deferredMuni,
            label: 'Muni bonds',
            value: 240_000,
          },
        ],
      }
    }
    return account
  })
  data.customArrows = []
  return data
}

function placedAccount(data: MoneyMapData, id: string) {
  return layout.layoutMap(data).accounts.find(
    (placed) => placed.account.id === id,
  )!
}

function sleeveLayout(placed: PlacedAccount, id: string) {
  return placed.subAccountLayouts.find(
    (subLayout) => subLayout.subAccount.id === id,
  )!
}

function sleeveRect(placed: PlacedAccount, subLayout: SubAccountLayout) {
  const subAccountRect = (
    layout as unknown as { subAccountRect?: SubAccountRect }
  ).subAccountRect
  expect(subAccountRect).toBeTypeOf('function')
  return subAccountRect?.(placed, subLayout)
}

function expectInVerticalBand(y: number, rect: Placed) {
  expect(y).toBeGreaterThanOrEqual(rect.y)
  expect(y).toBeLessThanOrEqual(rect.y + rect.h)
}

describe('sub-account arrows', () => {
  it('derives a sleeve rectangle from its parent account box', () => {
    const data = sleeveData()
    const placed = placedAccount(data, 'managed-ira-jordan')
    const subLayout = sleeveLayout(placed, sleeveIds.deferredMuni)
    const rect = sleeveRect(placed, subLayout)
    if (!rect) return

    expect(rect.x).toBe(placed.x + placed.w * 0.14)
    expect(rect.y).toBe(placed.y + subLayout.y)
    expect(rect.w).toBe(placed.w * 0.72)
    expect(rect.h).toBe(subLayout.h)
  })

  it('lays out an account-to-sleeve arrow on the sleeve band', () => {
    const data = sleeveData()
    data.customArrows = [
      {
        id: 'account-to-sleeve',
        sourceId: 'managed-after-tax-trust',
        targetId: sleeveIds.deferredMuni,
        style: 'solid',
      },
    ]

    const map = layout.layoutMap(data)
    const target = placedAccount(data, 'managed-ira-jordan')
    const targetRect = sleeveRect(
      target,
      sleeveLayout(target, sleeveIds.deferredMuni),
    )
    const arrow = map.arrows.find((candidate) => candidate.id === 'account-to-sleeve')

    expect(arrow).toBeDefined()
    if (!arrow || !targetRect) return
    expectInVerticalBand(arrow.end.y, targetRect)
    expect(target.y + target.h / 2).toBeLessThan(targetRect.y)
  })

  it('lays out both endpoints of a sleeve-to-sleeve arrow in their sleeve bands', () => {
    const data = sleeveData()
    data.customArrows = [
      {
        id: 'sleeve-to-sleeve',
        sourceId: sleeveIds.taxableMuni,
        targetId: sleeveIds.deferredMuni,
        style: 'solid',
      },
    ]

    const map = layout.layoutMap(data)
    const source = placedAccount(data, 'managed-after-tax-trust')
    const target = placedAccount(data, 'managed-ira-jordan')
    const arrow = map.arrows.find((candidate) => candidate.id === 'sleeve-to-sleeve')
    const sourceRect = sleeveRect(
      source,
      sleeveLayout(source, sleeveIds.taxableMuni),
    )
    const targetRect = sleeveRect(
      target,
      sleeveLayout(target, sleeveIds.deferredMuni),
    )

    expect(arrow).toBeDefined()
    if (!arrow || !sourceRect || !targetRect) return
    expectInVerticalBand(arrow.start.y, sourceRect)
    expectInVerticalBand(arrow.end.y, targetRect)
  })

  it('keeps truly unknown sleeve endpoints dropped', () => {
    const data = sleeveData()
    data.customArrows = [
      {
        id: 'unknown-sleeve',
        sourceId: 'managed-after-tax-trust',
        targetId: 'missing-sleeve',
        style: 'solid',
      },
    ]

    expect(
      layout.layoutMap(data).arrows.find(
        (candidate) => candidate.id === 'unknown-sleeve',
      ),
    ).toBeUndefined()
  })

  it('skips sleeves without ids without throwing', () => {
    const data = sleeveData()
    data.accounts = data.accounts.map((account) =>
      account.id === 'managed-ira-jordan'
        ? {
            ...account,
            subAccounts: account.subAccounts?.map((subAccount) =>
              subAccount.id === sleeveIds.deferredMuni
                ? { ...subAccount, id: undefined }
                : subAccount,
            ),
          }
        : account,
    )
    data.customArrows = [
      {
        id: 'idless-sleeve',
        sourceId: 'managed-after-tax-trust',
        targetId: sleeveIds.deferredMuni,
        style: 'solid',
      },
    ]

    expect(() => layout.layoutMap(data)).not.toThrow()
    expect(
      layout.layoutMap(data).arrows.find(
        (candidate) => candidate.id === 'idless-sleeve',
      ),
    ).toBeUndefined()
  })
})

function renderMap(data: MoneyMapData, anchor?: string) {
  return renderToStaticMarkup(
    createElement(MapSvg, {
      anchor,
      data,
      onChange: () => undefined,
    }),
  )
}

function sampleMarkupHash() {
  return createHash('sha256')
    .update(renderMap(SAMPLE_WHITFIELD))
    .digest('hex')
}

function arrowEditorMarkup(markup: string, id: string) {
  const target = `data-map-target="arrow:custom:${id}"`
  const targetIndex = markup.indexOf(target)
  const start = markup.lastIndexOf('<g', targetIndex)
  const end = markup.indexOf('</g>', targetIndex)
  return markup.slice(start, end)
}

describe('sub-account arrow rendering', () => {
  it('names a sleeve at the end of a custom flow', () => {
    const data = sleeveData()
    data.customArrows = [
      {
        id: 'named-sleeve-flow',
        sourceId: 'managed-after-tax-trust',
        targetId: sleeveIds.deferredMuni,
        style: 'solid',
      },
    ]

    const markup = renderMap(data)

    expect(markup).toContain(
      'aria-label="Adjust flow from Managed After-Tax Trust to Muni bonds"',
    )
    expect(markup).not.toContain(
      'aria-label="Adjust flow from Managed After-Tax Trust to Map item"',
    )
  })

  it('renders same-named sleeves at their own endpoint paths', () => {
    const data = sleeveData()
    data.customArrows = [
      {
        id: 'to-taxable-sleeve',
        sourceId: 'cash-at-bank',
        targetId: sleeveIds.taxableMuni,
        style: 'solid',
      },
      {
        id: 'to-deferred-sleeve',
        sourceId: 'cash-at-bank',
        targetId: sleeveIds.deferredMuni,
        style: 'solid',
      },
    ]

    const arrows = layout.layoutMap(data).arrows
    const taxable = arrows.find((arrow) => arrow.id === 'to-taxable-sleeve')!
    const deferred = arrows.find((arrow) => arrow.id === 'to-deferred-sleeve')!
    const markup = renderMap(data)

    expect(taxable.end).not.toEqual(deferred.end)
    expect(arrowEditorMarkup(markup, taxable.id!)).toContain(`d="${taxable.d}"`)
    expect(arrowEditorMarkup(markup, deferred.id!)).toContain(`d="${deferred.d}"`)
  })

  it('records the pre-refactor sample markup fingerprint', () => {
    expect(sampleMarkupHash()).toBe('6552690fa906ddef34be7e7927defbb29a57cdeaa08314967ce91e9384bf4dfb')
  })
})

type InspectorControl = ReactElement<{
  'aria-label'?: string
  children?: ReactNode
  onChange?: (event: { target: { value: string } }) => void
  onClick?: () => void
}>

function findInspectorControl(
  node: ReactNode,
  label: string,
): InspectorControl {
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

function endpointOptions(control: InspectorControl) {
  return Children.toArray(control.props.children).flatMap((child) => {
    if (!isValidElement(child)) return []
    const option = child as ReactElement<{
      children?: ReactNode
      value?: string
    }>
    return [{ id: option.props.value ?? '', label: String(option.props.children) }]
  })
}

function pickerData(): MoneyMapData {
  const data = sleeveData()
  data.customArrows = [
    {
      id: 'sleeve-picker-flow',
      sourceId: 'cash-at-bank',
      targetId: 'short-term-funds',
      style: 'solid',
    },
  ]
  return data
}

function pickerInspector(
  data: MoneyMapData,
  onChange: (next: MoneyMapData) => void,
) {
  return MapInspector({
    data,
    onChange,
    onClose: () => undefined,
    onSelect: () => undefined,
    selectedTargetKey: 'arrow:custom:sleeve-picker-flow',
  })
}

describe('sub-account arrow pickers', () => {
  it('offers identified sleeves after their owning accounts in both endpoint pickers', () => {
    const inspector = pickerInspector(pickerData(), () => undefined)

    expect(endpointOptions(findInspectorControl(inspector, 'From'))).toEqual([
      { id: 'income', label: 'Income sources' },
      { id: 'need', label: 'Monthly need' },
      { id: 'cash-at-bank', label: 'Cash at Bank' },
      { id: 'managed-after-tax-trust', label: 'Managed After-Tax Trust' },
      {
        id: sleeveIds.taxableMuni,
        label: 'Muni bonds \u2014 Managed After-Tax Trust',
      },
      { id: 'managed-ira-jordan', label: 'Managed IRA \u2014 Jordan' },
      {
        id: 'sleeve-deferred-cash',
        label: 'Cash reserve \u2014 Managed IRA \u2014 Jordan',
      },
      {
        id: 'sleeve-deferred-equity',
        label: 'Equity sleeve \u2014 Managed IRA \u2014 Jordan',
      },
      {
        id: sleeveIds.deferredMuni,
        label: 'Muni bonds \u2014 Managed IRA \u2014 Jordan',
      },
      { id: 'roth-ira-dana', label: 'Roth IRA \u2014 Dana' },
      { id: 'donor-advised-fund', label: 'Donor-Advised Fund' },
    ])
    expect(endpointOptions(findInspectorControl(inspector, 'To'))).toEqual([
      { id: 'income', label: 'Income sources' },
      { id: 'need', label: 'Monthly need' },
      { id: 'short-term-funds', label: 'Short-Term Funds' },
      { id: 'managed-after-tax-trust', label: 'Managed After-Tax Trust' },
      {
        id: sleeveIds.taxableMuni,
        label: 'Muni bonds \u2014 Managed After-Tax Trust',
      },
      { id: 'managed-ira-jordan', label: 'Managed IRA \u2014 Jordan' },
      {
        id: 'sleeve-deferred-cash',
        label: 'Cash reserve \u2014 Managed IRA \u2014 Jordan',
      },
      {
        id: 'sleeve-deferred-equity',
        label: 'Equity sleeve \u2014 Managed IRA \u2014 Jordan',
      },
      {
        id: sleeveIds.deferredMuni,
        label: 'Muni bonds \u2014 Managed IRA \u2014 Jordan',
      },
      { id: 'roth-ira-dana', label: 'Roth IRA \u2014 Dana' },
      { id: 'donor-advised-fund', label: 'Donor-Advised Fund' },
    ])
  })

  it('retargets the To picker to a sleeve and preserves it through parsing', () => {
    const changes: MoneyMapData[] = []
    const inspector = pickerInspector(pickerData(), (next) => {
      changes.push(next)
    })

    findInspectorControl(inspector, 'To').props.onChange?.({
      target: { value: sleeveIds.taxableMuni },
    })

    const updated = changes.at(-1)!
    expect(updated.customArrows?.[0].targetId).toBe(sleeveIds.taxableMuni)
    const parsed = parseBook(JSON.stringify({
      fileType: 'money-map-book',
      version: 1,
      clients: [updated],
    }))
    expect(parsed.clients[0].customArrows?.[0].targetId).toBe(
      sleeveIds.taxableMuni,
    )
  })

  it('retargets the From picker to a sleeve and preserves it through parsing', () => {
    const changes: MoneyMapData[] = []
    const inspector = pickerInspector(pickerData(), (next) => {
      changes.push(next)
    })

    findInspectorControl(inspector, 'From').props.onChange?.({
      target: { value: sleeveIds.deferredMuni },
    })

    const updated = changes.at(-1)!
    expect(updated.customArrows?.[0].sourceId).toBe(sleeveIds.deferredMuni)
    const parsed = parseBook(JSON.stringify({
      fileType: 'money-map-book',
      version: 1,
      clients: [updated],
    }))
    expect(parsed.clients[0].customArrows?.[0].sourceId).toBe(
      sleeveIds.deferredMuni,
    )
  })

  it('uses the same endpoint guard when creating a sleeve-to-sleeve arrow', () => {
    const data = pickerData()
    const updated = addCustomArrow(
      data,
      sleeveIds.taxableMuni,
      sleeveIds.deferredMuni,
    )

    expect(updated.customArrows).toContainEqual(expect.objectContaining({
      sourceId: sleeveIds.taxableMuni,
      targetId: sleeveIds.deferredMuni,
    }))
  })
})

describe('sub-account arrow routing', () => {
  it('routes a custom arrow ending on a sleeve over shapes', () => {
    const data = pickerData()
    data.customArrows = [
      {
        id: 'sleeve-picker-flow',
        sourceId: 'cash-at-bank',
        targetId: sleeveIds.taxableMuni,
        style: 'solid',
      },
    ]

    const changes: MoneyMapData[] = []
    const inspector = pickerInspector(data, (next) => {
      changes.push(next)
    })

    findInspectorControl(inspector, 'Route flow over shapes').props.onClick?.()

    expect(changes).toHaveLength(1)
    expect(
      changes[0]?.layoutOverrides?.['arrow:custom:sleeve-picker-flow']?.z,
    ).toBeGreaterThan(0)
  })
})
