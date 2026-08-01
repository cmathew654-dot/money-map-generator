import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  incomePanelMetrics,
  layoutMap,
  mapTextOffset,
  mastheadTitleFontSize,
} from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg } from '../src/render/MapSvg'
import {
  applyMapTextEdit,
  mapTextEditRawValue,
} from '../src/ui/MapTextEditor'

describe('Session 40 map editing and capacity', () => {
  it('centers need text in its existing rows before additive offsets', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        'text:need:label': { fs: 22 },
        'text:need:value': { fs: 40 },
      },
    }
    const need = layoutMap(data).need
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )
    const geometry = (key: string) => {
      const match = markup.match(
        new RegExp(
          `<text x="([^"]+)" y="([^"]+)"[^>]*data-edit-line-node="${key}"`,
        ),
      )
      expect(match, `Missing rendered text geometry for ${key}`).not.toBeNull()
      return { x: Number(match![1]), y: Number(match![2]) }
    }
    const label = geometry('needLabel')
    const value = geometry('monthlyNeed')

    expect(label.x).toBe(need.x + need.w / 2)
    expect(value.x).toBe(label.x)
    expect(label.y).toBeCloseTo(need.y + 31 + 38 / 2 + 22 * 0.35)
    expect(value.y).toBeCloseTo(need.y + 75 + 52 / 2 + 40 * 0.35)

    const movedMarkup = renderToStaticMarkup(
      createElement(MapSvg, {
        data: {
          ...data,
          layoutOverrides: {
            ...data.layoutOverrides,
            'text:need:label': { fs: 22, dx: 13, dy: -7 },
            'text:need:value': { fs: 40, dx: -9, dy: 6 },
          },
        },
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )
    expect(movedMarkup).toMatch(
      /transform="translate\(13 -7\)"[^>]*><rect[^>]*data-map-edit-hit="needLabel"/,
    )
    expect(movedMarkup).toMatch(
      /transform="translate\(-9 6\)"[^>]*><rect[^>]*data-map-edit-hit="monthlyNeed"/,
    )
  })

  it('edits individual position and sub-account fields', () => {
    const positionAccount = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.positions?.length,
    )!
    const subAccount = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.subAccounts?.length,
    )!
    const positionLabel = {
      kind: 'accountPositionLabel' as const,
      accountId: positionAccount.id,
      positionIndex: 0,
    }
    const positionValue = {
      kind: 'accountPositionValue' as const,
      accountId: positionAccount.id,
      positionIndex: 0,
    }
    const subLabel = {
      kind: 'accountSubLabel' as const,
      accountId: subAccount.id,
      subAccountIndex: 0,
    }
    const subCaption = {
      kind: 'accountSubCaption' as const,
      accountId: subAccount.id,
      subAccountIndex: 0,
    }
    const subValue = {
      kind: 'accountSubValue' as const,
      accountId: subAccount.id,
      subAccountIndex: 0,
    }

    expect(mapTextEditRawValue(SAMPLE_WHITFIELD, positionLabel)).toBe(
      positionAccount.positions![0].label,
    )
    expect(
      applyMapTextEdit(SAMPLE_WHITFIELD, positionLabel, '  Cash reserve  ')
        .accounts.find((account) => account.id === positionAccount.id)
        ?.positions?.[0].label,
    ).toBe('Cash reserve')
    expect(
      applyMapTextEdit(SAMPLE_WHITFIELD, positionValue, '85k')
        .accounts.find((account) => account.id === positionAccount.id)
        ?.positions?.[0].value,
    ).toBe(85_000)
    expect(
      applyMapTextEdit(SAMPLE_WHITFIELD, subLabel, '  Near-term cash  ')
        .accounts.find((account) => account.id === subAccount.id)
        ?.subAccounts?.[0].label,
    ).toBe('Near-term cash')
    expect(
      applyMapTextEdit(SAMPLE_WHITFIELD, subCaption, '  Two years  ')
        .accounts.find((account) => account.id === subAccount.id)
        ?.subAccounts?.[0].caption,
    ).toBe('Two years')
    expect(
      applyMapTextEdit(SAMPLE_WHITFIELD, subValue, '125k')
        .accounts.find((account) => account.id === subAccount.id)
        ?.subAccounts?.[0].value,
    ).toBe(125_000)
  })

  it('renders field targets while retaining group drag hit areas', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, {
        data: SAMPLE_WHITFIELD,
        onChange: () => undefined,
        onElementClick: () => undefined,
      }),
    )

    for (const target of [
      'accountPositionLabel:',
      'accountPositionValue:',
      'accountSubLabel:',
      'accountSubCaption:',
      'accountSubValue:',
      'data-map-edit-hit="accountRows:',
      'data-map-edit-hit="accountSub:',
    ]) expect(markup).toContain(target)
  })

  it('prefers per-item offsets and falls back to shared offsets', () => {
    const source = SAMPLE_WHITFIELD.incomeSources[0]
    const block = { x: 100, y: 200, w: 100, h: 30 }
    const shared = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: { 'text:income:row': { dx: 11, dy: 12 } },
    }
    const specific = {
      ...shared,
      layoutOverrides: {
        ...shared.layoutOverrides,
        [`text:income:row:${source.id}`]: { dx: 31 },
      },
    }

    expect(mapTextOffset(shared, 'income', 'row', block, source.id)).toEqual({
      dx: 11,
      dy: 12,
    })
    expect(mapTextOffset(specific, 'income', 'row', block, source.id)).toEqual({
      dx: 31,
      dy: 12,
    })
  })

  it('separates dense income from need and warns for capacity overflow', () => {
    const incomeDense = {
      ...SAMPLE_WHITFIELD,
      incomeSources: Array.from({ length: 10 }, (_, index) => ({
        ...SAMPLE_WHITFIELD.incomeSources[0],
        id: `stress-income-${index}`,
        label: `Income source ${index + 1}`,
      })),
    }
    const incomeLayout = layoutMap(incomeDense)
    expect(incomeLayout.income.y + incomeLayout.income.h).toBeLessThanOrEqual(
      incomeLayout.need.y,
    )

    const extraAccounts = Array.from({ length: 5 }, (_, index) => ({
      ...SAMPLE_WHITFIELD.accounts[2],
      id: `stress-account-${index}`,
    }))
    const dense = {
      ...SAMPLE_WHITFIELD,
      accounts: [...SAMPLE_WHITFIELD.accounts, ...extraAccounts],
      footnotes: Array.from({ length: 6 }, (_, index) => ({
        ...SAMPLE_WHITFIELD.footnotes[0],
        id: `stress-footnote-${index}`,
        label: `Scenario ${index + 1}`,
      })),
    }
    const warnings = layoutMap(dense).warnings.map((warning) => warning.code)
    expect(warnings).toContain('account-column-overflow')
    expect(warnings).toContain('footnote-overlap')
  })

  it('warns for every primary panel outside the artboard', () => {
    const denseIncome = {
      ...SAMPLE_WHITFIELD,
      incomeSources: Array.from({ length: 36 }, (_, index) => ({
        ...SAMPLE_WHITFIELD.incomeSources[0],
        id: `artboard-income-${index}`,
        label: `Artboard income ${index + 1}`,
      })),
    }
    const layout = layoutMap(denseIncome)
    const incomeMetrics = incomePanelMetrics(denseIncome)
    const panels = [
      [
        'Income sources panel',
        {
          ...layout.income,
          w: Math.max(layout.income.w, incomeMetrics.minWidth),
          h: Math.max(layout.income.h, incomeMetrics.contentHeight),
        },
      ],
      ['Monthly income need panel', layout.need],
    ] as const
    const outside = panels.filter(([, panel]) =>
      panel.x < 0 ||
      panel.y < 0 ||
      panel.x + panel.w > layout.artboard.width ||
      panel.y + panel.h > layout.artboard.height,
    )

    expect(outside.length).toBeGreaterThan(0)
    for (const [name] of outside) {
      expect(layout.warnings).toContainEqual({
        code: 'panel-out-of-bounds',
        message: expect.stringContaining(name),
      })
    }
    expect(layoutMap(SAMPLE_WHITFIELD).warnings).not.toContainEqual(
      expect.objectContaining({ code: 'panel-out-of-bounds' }),
    )
  })

  it('auto-fits mastheads and warns at the minimum size', () => {
    const fitted = {
      ...SAMPLE_WHITFIELD,
      client: {
        ...SAMPLE_WHITFIELD.client,
        title: 'The Whitfield Family Charitable and Retirement Plan',
      },
    }
    const impossible = {
      ...fitted,
      client: { ...fitted.client, title: 'Extraordinarily '.repeat(20) },
    }

    expect(mastheadTitleFontSize(fitted)).toBeLessThan(30)
    expect(mastheadTitleFontSize(fitted)).toBeGreaterThanOrEqual(18)
    expect(
      layoutMap(impossible).warnings.some(
        (warning) => warning.code === 'masthead-title-overflow',
      ),
    ).toBe(true)
  })
})
