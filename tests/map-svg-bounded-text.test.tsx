import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  flowLabelText,
  footnoteLineLayouts,
  incomeSourceTextLayout,
  incomeTotalTextLayout,
  layoutMap,
  mastheadTextLayout,
  needTextLayout,
} from '../src/layout/layout'
import { money } from '../src/model/format'
import { gapLine } from '../src/model/math'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg } from '../src/render/MapSvg'

const html = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

describe('MapSvg bounded text', () => {
  it('renders fitted text while retaining every exact constrained value', () => {
    const data = structuredClone(SAMPLE_WHITFIELD)
    const long = 'BOUNDARY '.repeat(80).trim()
    data.client.title = `TITLE ${long}`
    data.client.mastheadLabel = `LABEL ${long}`
    data.afterTaxIncome = Number.MAX_SAFE_INTEGER
    data.monthlyNeed = Number.MAX_SAFE_INTEGER
    data.asNeededAmount = 1
    data.needTag = long
    data.incomeSources[0].label = `INCOME ${long}`
    data.incomeSources[0].amount = Number.MAX_SAFE_INTEGER
    data.incomeSources[0].qualifier = long
    data.accounts[0].value = Number.MAX_SAFE_INTEGER
    data.accounts[0].valueTag = long
    data.accounts.find((account) => account.positions?.length)!.positions![0].value = Number.MAX_SAFE_INTEGER
    data.accounts.find((account) => account.subAccounts?.length)!.subAccounts![0].value = Number.MAX_SAFE_INTEGER
    data.customArrows![0].label = `FLOW ${long}`
    data.footnotes[0].label = `FOOTNOTE ${long}`
    data.footnotes[0].gross = Number.MAX_SAFE_INTEGER
    data.footnotes[0].net = Number.MAX_SAFE_INTEGER

    const layout = layoutMap(data)
    const needSupporting = gapLine(
      data.monthlyNeed,
      data.afterTaxIncome,
      data.asNeededAmount,
      true,
    )
    const masthead = mastheadTextLayout(data)
    const income = incomeSourceTextLayout(data, layout.income, data.incomeSources[0])
    const total = incomeTotalTextLayout(data, layout.income)
    const need = needTextLayout(data, layout.need, needSupporting)
    const arrow = layout.arrows.find((candidate) => candidate.id === data.customArrows![0].id)!
    const account = layout.accounts.find((candidate) => candidate.account.id === data.accounts[0].id)!
    const positioned = layout.accounts.find((candidate) => candidate.account.positions?.length)!
    const subAccount = layout.accounts.find((candidate) => candidate.account.subAccounts?.length)!
    const footnote = footnoteLineLayouts(data)[0].text
    const pairs = [
      masthead.title,
      masthead.label,
      income.label,
      income.amount,
      total.value,
      need.value,
      need.supporting,
      flowLabelText(arrow),
      footnote,
      {
        display: account.valueText,
        exact: `${money(account.account.value)} ${account.account.valueTag}`,
      },
      {
        display: positioned.positionRows[0].valueText,
        exact: money(positioned.account.positions![0].value),
      },
      {
        display: subAccount.subAccountLayouts[0].valueText,
        exact: money(subAccount.subAccountLayouts[0].subAccount.value),
      },
    ]
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))

    expect(pairs.filter((pair) => pair.display !== pair.exact).length).toBeGreaterThan(8)
    for (const pair of pairs) {
      if (pair.display !== pair.exact) {
        expect(pair.display).toMatch(/…$/)
        const prefix = pair === need.supporting ? 'Adjust coverage note: ' : ''
        expect(markup).toContain(`aria-label="${prefix}${html(pair.exact)}"`)
      }
      expect(markup).toContain(html(pair.display))
    }
  })
})
