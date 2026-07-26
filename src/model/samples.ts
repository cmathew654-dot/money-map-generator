import type { MoneyMapData } from './types'

export const SAMPLE_WHITFIELD: MoneyMapData = {
  id: 'sample-whitfield',
  client: {
    title: 'Jordan & Dana Whitfield',
    year: '2026',
    variant: 'annual',
  },
  incomeSources: [
    { label: 'Social Security', amount: 2400, period: 'mo' },
    { label: 'Pension — Dana', amount: 1900, period: 'mo' },
    { label: 'Rental Income', amount: null, period: 'mo', qualifier: 'Gross' },
  ],
  afterTaxIncome: 5900,
  monthlyNeed: 15000,
  asNeededAmount: null,
  accounts: [
    {
      id: 'cash-at-bank',
      bucket: 'cash',
      label: 'Cash at Bank',
      value: null,
      inWaterfall: false,
    },
    {
      id: 'short-term-funds',
      bucket: 'shortTerm',
      label: 'Short-Term Funds',
      caption: "2-3 years' worth of income needs",
      value: 165000,
      inWaterfall: true,
    },
    {
      id: 'managed-after-tax-trust',
      bucket: 'afterTax',
      label: 'Managed After-Tax Trust',
      caption: '~50% Equities / ~50% Fixed Income',
      value: 710000,
      positions: [
        { label: 'S&P 500 Index Fund', value: 380000 },
        { label: 'Municipal Bond Ladder', value: 330000 },
      ],
      inWaterfall: true,
    },
    {
      id: 'managed-ira-jordan',
      bucket: 'taxDeferred',
      label: 'Managed IRA — Jordan',
      caption: 'Most Aggressive Allocation',
      value: 2450000,
      subAccounts: [
        {
          label: 'Short-Term Funds',
          caption: 'Target ~$160,000 — Annual RMDs',
          value: 240000,
        },
      ],
      inWaterfall: true,
    },
    {
      id: 'roth-ira-dana',
      bucket: 'taxPreferred',
      label: 'Roth IRA — Dana',
      value: 85000,
      inWaterfall: false,
    },
    {
      id: 'donor-advised-fund',
      bucket: 'charitable',
      label: 'Donor-Advised Fund',
      value: 120000,
      inWaterfall: false,
    },
  ],
  footnotes: [{ label: 'Jordan 2026 RMD', gross: 96500, net: 74300 }],
}

export function blankClient(): MoneyMapData {
  return {
    id: '',
    client: {
      title: '',
      year: '',
      variant: 'annual',
    },
    incomeSources: [{ label: '', amount: null, period: 'mo' }],
    afterTaxIncome: null,
    monthlyNeed: null,
    asNeededAmount: null,
    accounts: [
      {
        id: '',
        bucket: 'shortTerm',
        label: '',
        value: null,
        inWaterfall: true,
      },
      {
        id: '',
        bucket: 'afterTax',
        label: '',
        value: null,
        inWaterfall: true,
      },
      {
        id: '',
        bucket: 'taxDeferred',
        label: '',
        value: null,
        inWaterfall: true,
      },
    ],
    footnotes: [],
  }
}
