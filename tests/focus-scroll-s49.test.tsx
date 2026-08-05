// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import formSource from '../src/form/Form.tsx?raw'

/**
 * focusRequest (Details / dblclick on the map) scrolls the matching entry into
 * the Data panel. The panel stacks two sticky headers — `.editor-panel > h2`
 * (44px) and `.data-form-tools` (85px, stuck at top: 41px) — so anything landing
 * above 126px sits underneath them. scroll-margin-top keeps the entry clear.
 */
const css: string = readFileSync('src/styles/app.css', 'utf8')
  // Comments hold commas and would land in the selector split below.
  .replace(/\/\*[\s\S]*?\*\//g, '')
const STICKY_STACK = 126

function scrollMarginRule(): { selectors: string[]; value: number } {
  const match = css.match(
    /([^{}]+)\{[^{}]*scroll-margin-top:\s*(\d+)px[^{}]*\}/,
  )
  if (!match) throw new Error('no scroll-margin-top rule in app.css')
  return {
    selectors: match[1].split(',').map((selector) => selector.trim()),
    value: Number(match[2]),
  }
}

describe('focus scroll clears the sticky panel headers (s49)', () => {
  it('gives the account card a scroll margin', () => {
    expect(scrollMarginRule().selectors).toContain('.account-card')
  })

  it('covers the income, need and notes focus targets too', () => {
    // Form.tsx scrolls incomeSectionRef / needSectionRef (both `.form-section`)
    // and the note textarea inside `.note-row`.
    const { selectors } = scrollMarginRule()
    expect(selectors).toContain('.form-section')
    expect(selectors).toContain('.note-row textarea')
    // Those sections outrun the panel height, so they must align to 'start' —
    // 'center' would honour only half the scroll margin and clip the heading.
    expect(formSource).toMatch(/block: 'start',\s*behavior: 'smooth',/)
  })

  it('clears the full sticky header stack', () => {
    expect(scrollMarginRule().value).toBeGreaterThanOrEqual(STICKY_STACK)
  })
})
