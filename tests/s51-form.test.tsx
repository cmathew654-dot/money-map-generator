// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import appSource from '../src/App.tsx?raw'
import { AccountsSection, Form, isAccountExpanded } from '../src/form/Form'
import { blankClient } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'

const formCss: string = readFileSync('src/styles/form.css', 'utf8')

function withAccounts(): MoneyMapData {
  const data = blankClient()
  data.accounts = [
    { id: 'roth-ira', bucket: 'taxPreferred', label: 'Roth IRA', value: 240_000 },
    { id: 'cash-bank', bucket: 'cash', label: 'Cash at Bank', value: 35_000 },
  ]
  return data
}

function renderAccounts(selectedAccountId: string | null = null) {
  return renderToStaticMarkup(
    createElement(AccountsSection, {
      data: withAccounts(),
      selectedAccountId,
      onChange: () => undefined,
    }),
  )
}

function renderForm(overrides: Partial<Parameters<typeof Form>[0]> = {}) {
  return renderToStaticMarkup(
    createElement(Form, {
      data: withAccounts(),
      onChange: () => undefined,
      ...overrides,
    }),
  )
}

describe('s51 ledger rows collapse and expand', () => {
  it('renders every account as a collapsed accordion button', () => {
    const markup = renderAccounts()

    expect(markup).toContain('aria-expanded="false"')
    expect(markup).toMatch(/<button[^>]*class="[^"]*account-summary/)
    // A collapsed row is one line: no editor body in the markup.
    expect(markup).not.toContain('Account type')
    expect(markup).not.toContain('Supporting note')
  })

  it('keeps the dot, name and tabular value on the row', () => {
    const markup = renderAccounts()

    expect(markup).toContain('account-swatch')
    expect(markup).toContain('Roth IRA')
    expect(markup).toContain('account-summary-value')
    expect(formCss).toMatch(/\.account-summary-value\s*\{[^}]*tabular-nums/)
  })

  it('expands the selected row in place and leaves the others closed', () => {
    const markup = renderAccounts('roth-ira')

    expect(markup).toContain('aria-expanded="true"')
    expect(markup).toContain('aria-expanded="false"')
    expect(markup).toContain('Account type')
    expect(markup).toContain('Supporting note')
    // The shape control now lives inside the expanded body.
    expect(markup).toContain('Shape for Roth IRA')
    expect(markup).not.toContain('Shape for Cash at Bank')
  })

  it('marks the body as a labelled region owned by its row button', () => {
    const markup = renderAccounts('roth-ira')

    expect(markup).toContain('aria-controls="account-body-roth-ira"')
    expect(markup).toContain('id="account-body-roth-ira"')
    expect(markup).toContain('id="account-row-roth-ira"')
  })
})

describe('s51 auto-expand follows the map selection', () => {
  it('opens the selected account when the user has not touched the row', () => {
    expect(isAccountExpanded({}, 'a', 'a')).toBe(true)
    expect(isAccountExpanded({}, 'a', 'b')).toBe(false)
    expect(isAccountExpanded({}, 'a', null)).toBe(false)
  })

  it('keeps manual expands open when the selection moves on', () => {
    expect(isAccountExpanded({ a: true }, 'a', 'b')).toBe(true)
  })

  it('honours a manual collapse over the selection', () => {
    expect(isAccountExpanded({ a: false }, 'a', 'a')).toBe(false)
  })

  it('moves the auto-expanded row when the selection changes', () => {
    const first = renderAccounts('roth-ira')
    const second = renderAccounts('cash-bank')

    const rowState = (markup: string, id: string) =>
      new RegExp(`aria-controls="account-body-${id}"[^>]*aria-expanded="(\\w+)"`)
        .exec(markup)?.[1]

    expect(rowState(first, 'roth-ira')).toBe('true')
    expect(rowState(first, 'cash-bank')).toBe('false')
    expect(rowState(second, 'cash-bank')).toBe('true')
    expect(rowState(second, 'roth-ira')).toBe('false')
  })

  it('scrolls the focused row into view through the existing focusRequest path', () => {
    const source: string = readFileSync('src/form/Form.tsx', 'utf8')
    // The s49 focusRequest effect keeps ownership of scroll + field focus.
    expect(source).toMatch(/if \(!focusRequest\) return[\s\S]{0,600}scrollIntoView/)
    // One mechanism only: no parallel selection-keyed scroll effect.
    expect(source).not.toMatch(/\}, \[selectedAccountId[^\]]*\]\)/)
    expect(source.match(/scrollIntoView/g)?.length).toBeLessThanOrEqual(4)
  })
})

describe('s51 filter chrome', () => {
  it('narrows the ledger to matching rows', () => {
    const markup = renderForm({ filter: 'Roth' })

    expect(markup).toContain('Roth IRA')
    expect(markup).not.toContain('Cash at Bank')
  })

  it('renders an inline search glyph and a 14px full-width field', () => {
    const markup = renderForm()

    expect(markup).toContain('data-filter-glyph')
    expect(formCss).toMatch(/\.data-form-filter input\s*\{[^}]*font-size:\s*14px/)
    expect(formCss).toMatch(/\.data-form-filter input:focus[^{]*\{[^}]*#1e7a4a/)
  })
})

describe('s51 in-panel close', () => {
  it('renders a close control when the panel supplies a close path', () => {
    expect(renderForm({ onClose: () => undefined })).toContain(
      'aria-label="Close Data panel"',
    )
  })

  it('omits the close control when there is nothing to close', () => {
    expect(renderForm()).not.toContain('aria-label="Close Data panel"')
  })

  it('wires the close control to the same path as the rail toggle', () => {
    expect(appSource).toContain('onClose={closeDataPanel}')
    expect(appSource).toContain('if (editorPanel === panel) closeDataPanel()')
  })
})

describe('s51 section headers', () => {
  it('gives each section a sticky header with a right-aligned count', () => {
    const markup = renderForm()

    expect(markup).toContain('form-section-head')
    expect(markup).toMatch(/form-section-count[^>]*>2</)
    expect(formCss).toMatch(/\.form-section-head\s*\{[^}]*position:\s*sticky/)
  })
})
