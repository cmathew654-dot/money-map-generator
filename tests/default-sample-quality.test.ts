import { describe, expect, it } from 'vitest'
import { layoutMap } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'

describe('default sample quality', () => {
  it('lays out with zero warnings', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    expect(layout.warnings.map((w) => `${w.code}:${w.message}`)).toEqual([])
  })

  it('renders every fixed label unabridged', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    for (const account of layout.accounts) {
      expect(account.titleLines.at(-1)).not.toMatch(/…$/)
    }
  })

  it('produces finite arrow paths when two arrow-linked accounts fully overlap', () => {
    const base = layoutMap(SAMPLE_WHITFIELD)
    const [a, b] = base.accounts
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        { id: 'arrow-x', sourceId: a.account.id, targetId: b.account.id, style: 'solid' },
      ],
      layoutOverrides: {
        ...SAMPLE_WHITFIELD.layoutOverrides,
        [b.account.id]: { dx: a.x - b.x, dy: a.y - b.y, w: a.w, h: a.h },
      },
    }
    for (const arrow of layoutMap(data).arrows) {
      expect(arrow.d, `${arrow.kind} path`).not.toMatch(/NaN/)
    }
  })
})
