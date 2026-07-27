import { describe, expect, it } from 'vitest'
import {
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
  it.each(Object.entries(BUCKETS))(
    '%s tag meets 4.5:1 on its cap and body tints',
    (_bucket, style) => {
      expect(contrastRatio(style.tagColor, style.capTint)).toBeGreaterThanOrEqual(
        4.5,
      )
      expect(contrastRatio(style.tagColor, style.tint)).toBeGreaterThanOrEqual(
        4.5,
      )
    },
  )

  it.each([
    ['muted text', MUTED, PAPER],
    ['flow green', FLOW_GREEN, PAPER],
    ['need red', NEED_RED, '#faeae7'],
  ])('%s meets 4.5:1 on its surface', (_name, foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
  })
})
