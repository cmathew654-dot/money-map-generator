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

export const SAMPLE_CALLOWAY: MoneyMapData = {
  id: 'sample-calloway',
  client: {
    title: 'The Calloway Family',
    year: '2026',
    variant: 'postNote',
    postNoteLabel: 'April 2026',
  },
  incomeSources: [
    {
      label: 'Real Estate Income',
      amount: 21000,
      period: 'mo',
      qualifier: 'Gross',
    },
    {
      label: 'Union Pension',
      amount: 1200,
      period: 'mo',
      qualifier: 'Gross',
    },
    {
      label: 'Social Security',
      amount: 3100,
      period: 'mo',
      qualifier: 'Gross',
    },
  ],
  afterTaxIncome: 17000,
  monthlyNeed: 30000,
  asNeededAmount: 20000,
  accounts: [
    {
      id: 'calloway-cash-at-home',
      bucket: 'cash',
      label: 'Cash at Home',
      value: 450000,
      inWaterfall: false,
    },
    {
      id: 'calloway-short-term',
      bucket: 'shortTerm',
      label: 'Short-Term Account',
      caption: "Earmarked taxes and 2-3 years' worth of income needs",
      value: 520000,
      inWaterfall: true,
    },
    {
      id: 'calloway-trust',
      bucket: 'afterTax',
      label: 'Trust Account',
      caption: 'Target 70-80% Equities — Tax-Managed',
      value: 4900000,
      inWaterfall: true,
    },
    {
      id: 'calloway-ira-marcus',
      bucket: 'taxDeferred',
      label: 'IRA — Marcus',
      caption: 'Most Aggressive Allocation',
      value: 2650000,
      subAccounts: [{ label: 'Short-Term Account', value: 110000 }],
      inWaterfall: true,
    },
    {
      id: 'calloway-life-insurance',
      bucket: 'taxPreferred',
      label: 'Cash-Value Life Insurance',
      value: 350000,
      inWaterfall: false,
    },
    {
      id: 'calloway-daf',
      bucket: 'charitable',
      label: 'Donor-Advised Fund',
      value: 160000,
      inWaterfall: false,
    },
    {
      id: 'calloway-installment-note',
      bucket: 'note',
      label: '5-Year Installment Note',
      caption: 'Through Feb 2027 — $92K pre-tax annual',
      value: 185000,
      inWaterfall: false,
    },
  ],
  footnotes: [{ label: 'Marcus 2026 RMD', gross: 89000, net: 67000 }],
}

export const SAMPLE_VENKAT: MoneyMapData = {
  id: 'sample-venkat',
  client: {
    title: 'Sam & Priya Venkat',
    year: '2026',
    variant: 'annual',
  },
  incomeSources: [
    {
      label: 'Rental Income',
      amount: 26000,
      period: 'mo',
      qualifier: 'Gross',
    },
    {
      label: 'Eventual Social Security',
      amount: null,
      period: 'mo',
    },
  ],
  afterTaxIncome: null,
  monthlyNeed: 13000,
  asNeededAmount: null,
  accounts: [
    {
      id: 'venkat-short-term',
      bucket: 'shortTerm',
      label: 'Short-Term Bucket',
      caption: "2-3 years' worth of income needs",
      value: 18000,
      inWaterfall: true,
    },
    {
      id: 'venkat-cash',
      bucket: 'cash',
      label: 'Cash Accounts',
      value: 1450000,
      inWaterfall: false,
    },
    {
      id: 'venkat-trust',
      bucket: 'afterTax',
      label: 'Trust After-Tax Account',
      caption: 'Concentrated holding',
      value: 690000,
      positions: [{ label: 'S&P 500 Index', value: 495000 }],
      inWaterfall: true,
    },
    {
      id: 'venkat-brokerage',
      bucket: 'afterTax',
      label: 'Brokerage — Individual Stocks',
      value: 720000,
      inWaterfall: false,
    },
    {
      id: 'venkat-iras',
      bucket: 'taxDeferred',
      label: 'IRAs — Most Aggressive',
      caption: '70% Equity Allocation',
      value: 2100000,
      inWaterfall: true,
    },
    {
      id: 'venkat-charitable',
      bucket: 'charitable',
      label: 'Family Charitable Fund',
      value: 140000,
      inWaterfall: false,
    },
  ],
  footnotes: [],
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
