// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  ARROW_COLORS,
  BUCKETS,
  FLOW_GREEN,
  MUTED,
  NEED_RED,
  PAPER,
} from '../src/render/tokens'

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)

  if (!channels || channels.length !== 3) {
    throw new Error(`Expected a six-digit hex color, received ${hex}.`)
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground: string, background: string): number {
  const light = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  )
  const dark = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  )
  return (light + 0.05) / (dark + 0.05)
}

describe('palette contrast contract', () => {
  it.each(Object.entries(ARROW_COLORS))(
    '%s flow arrow meets 3:1 on paper',
    (_name, color) => {
      expect(contrastRatio(color, PAPER)).toBeGreaterThanOrEqual(3)
    },
  )

  it.each(Object.entries(BUCKETS))(
    '%s tag meets 4.5:1 on its flat tint',
    (_bucket, style) => {
      expect(contrastRatio(style.tagColor, style.tint)).toBeGreaterThanOrEqual(
        4.5,
      )
    },
  )

  it.each([
    ['paper', PAPER],
    ...Object.entries(BUCKETS).map(([bucket, style]) => [
      `${bucket} tint`,
      style.tint,
    ]),
  ])('muted text meets 4.5:1 on %s', (_surface, background) => {
    expect(contrastRatio(MUTED, background)).toBeGreaterThanOrEqual(4.5)
  })

  it.each([
    ['flow green', FLOW_GREEN, PAPER],
    ['need red', NEED_RED, '#faeae7'],
  ])('%s meets 4.5:1 on its surface', (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
  })
})

describe('ledger field boundary contrast', () => {
  const formCss: string = readFileSync('src/styles/form.css', 'utf8')
  const tokensCss: string = readFileSync('src/styles/tokens.css', 'utf8')

  // --fm-* tokens are aliases of the canonical --mm-* set; follow one level of
  // var() indirection into tokens.css to reach the hex the browser resolves.
  function token(name: string): string {
    const match = formCss.match(
      new RegExp(`--${name}:\\s*(#[0-9a-f]{6}|var\\(--([a-z0-9-]+)\\))`, 'i'),
    )
    if (!match) {
      throw new Error(`Expected --${name} to be defined in form.css.`)
    }
    if (!match[2]) return match[1]
    const resolved = tokensCss.match(
      new RegExp(`--${match[2]}:\\s*(#[0-9a-f]{6})`, 'i'),
    )
    if (!resolved) {
      throw new Error(`Expected --${match[2]} to resolve to a hex in tokens.css.`)
    }
    return resolved[1]
  }

  // Sketch 003 eliminated the boxed treatment because its --fm-hairline input
  // boundary measured 1.2875:1 against paper. The ledger rule is the boundary
  // that replaced it, so it has to clear SC 1.4.11 on its own rather than
  // inherit the defect that disqualified the option it beat.
  it.each([
    ['the field fill', 'fm-section'],
    ['the panel surface', 'fm-surface'],
  ])('the field rule meets 3:1 on %s', (_where, background) => {
    expect(
      contrastRatio(token('fm-muted'), token(background)),
    ).toBeGreaterThanOrEqual(3)
  })

  // De-boxing the fields left focus with nothing but a hue shift on a rule of
  // unchanged thickness. PRODUCT.md requires visible focus that never rests on
  // colour alone, so the app-wide 2px ring has to survive in the panel.
  it('never suppresses the app-wide focus ring', () => {
    expect(formCss).not.toMatch(/:focus-visible[^{]*\{[^}]*outline:\s*none/)
  })
})
