import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SelectionBadge } from '../src/ui/SelectionBadge'

const render = (count: number) =>
  renderToStaticMarkup(createElement(SelectionBadge, { count }))

describe('selection badge', () => {
  it('reports the selected count and gives the single-selection hint', () => {
    const markup = render(1)

    expect(markup).toContain('1 selected')
    expect(markup).toContain('shift-click adds')
  })

  it('is absent when nothing is selected', () => {
    expect(render(0)).toBe('')
  })
})
