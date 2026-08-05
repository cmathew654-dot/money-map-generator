import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapSvg } from '../src/render/MapSvg'

/**
 * S51 O-DBL. Double-clicking a wrapped label opened the size-only pill instead
 * of the text editor: every wrapped label paints its glyphs in <tspan>s, so a
 * <text> that owns its own dblclick handler has no painted area of its own and
 * the block-level hit rect underneath wins the hit test.
 */
const editMarkup = () =>
  renderToStaticMarkup(
    createElement(MapSvg, {
      data: structuredClone(SAMPLE_WHITFIELD),
      onElementClick: () => {},
    }),
  )

const textNodes = (markup: string) => [
  ...markup.matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g),
].map((match) => match[0])

describe('s51 double-click reaches wrapped labels', () => {
  it('keeps tspans hit-testable inside self-interactive text nodes', () => {
    const selfInteractive = textNodes(editMarkup()).filter(
      (node) => node.includes('data-map-edit-key=') && node.includes('<tspan'),
    )
    expect(selfInteractive.length).toBeGreaterThan(0)

    const deaf = selfInteractive.filter((node) =>
      /<tspan\b[^>]*pointer-events="none"/.test(node),
    )
    expect(
      deaf.map((node) => node.match(/data-map-edit-key="([^"]+)"/)?.[1]),
    ).toEqual([])
  })

  it('covers every wrapped label line with a hit target', () => {
    const markup = editMarkup()
    const height = (key: string) =>
      Number(
        markup
          .match(new RegExp(`<rect[^>]*data-map-edit-hit="${key}"[^>]*>`))?.[0]
          .match(/height="([\d.]+)"/)?.[1] ?? 0,
      )

    // "Managed After-Tax Trust" wraps to two lines; "Roth IRA — Dana" does not.
    const wrapped = height('accountLabel:managed-after-tax-trust')
    const single = height('accountLabel:roth-ira-dana')
    expect(single).toBeGreaterThan(0)
    expect(wrapped).toBeGreaterThan(single)
  })
})
