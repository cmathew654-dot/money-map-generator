import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'

import { freezeAsNeededChip } from '../src/App'
import {
  asNeededChipCenter,
  buildTidyAnchors,
  layoutMap,
  layoutOverrideRect,
  OVERRIDE_BOUNDS,
} from '../src/layout/layout'
import { tidyArrangement } from '../src/model/book'
import {
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'

const SAMPLES: [string, MoneyMapData][] = [
  ['Whitfield', SAMPLE_WHITFIELD],
  ['Calloway', SAMPLE_CALLOWAY],
  ['Venkat', SAMPLE_VENKAT],
]

// An edit that moves the need card — unrelated to the chip, but it drags the
// as-needed arrow (and therefore the chip's anchor) with it.
const nudgeNeed = (data: MoneyMapData, dx: number): MoneyMapData => ({
  ...data,
  layoutOverrides: { ...data.layoutOverrides, need: { dx, dy: 18 } },
})

const expectCenterNear = (
  actual: { x: number; y: number } | null,
  expected: { x: number; y: number } | null,
) => {
  expect(actual).not.toBeNull()
  expect(expected).not.toBeNull()
  expect(actual!.x).toBeCloseTo(expected!.x, 1)
  expect(actual!.y).toBeCloseTo(expected!.y, 1)
}

describe('as-needed chip freeze on first edit', () => {
  it.each(SAMPLES)(
    'materializes the chip override on the first edit without moving the chip (%s)',
    (_name, sample) => {
      expect(sample.layoutOverrides?.asNeededChip).toBeUndefined()
      const frozen = freezeAsNeededChip(sample, nudgeNeed(sample, 40))
      expect(frozen.layoutOverrides?.asNeededChip).toBeDefined()
      expectCenterNear(asNeededChipCenter(frozen), asNeededChipCenter(sample))
    },
  )

  it.each(SAMPLES)(
    'passes an already-placed chip through untouched (%s)',
    (_name, sample) => {
      const placed: MoneyMapData = {
        ...sample,
        layoutOverrides: {
          ...sample.layoutOverrides,
          asNeededChip: { dx: 12, dy: -8 },
        },
      }
      const edited = nudgeNeed(placed, 40)
      expect(freezeAsNeededChip(placed, edited)).toBe(edited)
    },
  )

  it.each(SAMPLES)(
    'composes the delta the edit itself wrote for the chip (%s)',
    (_name, sample) => {
      const before = asNeededChipCenter(sample)
      const dragged: MoneyMapData = {
        ...sample,
        layoutOverrides: {
          ...sample.layoutOverrides,
          asNeededChip: { dx: 30, dy: -20 },
        },
      }
      const frozen = freezeAsNeededChip(sample, dragged)
      expectCenterNear(asNeededChipCenter(frozen), {
        x: before!.x + 30,
        y: before!.y - 20,
      })
    },
  )

  it('routes every map mutation through the freeze at the choke point', () => {
    expect(appSource).toMatch(
      /const handleMapChange = \([\s\S]{0,400}?freezeAsNeededChip\(/,
    )
  })
})

describe('tidy convergence with a frozen chip', () => {
  // Mirrors App: anchors from the live layout, tidy, then the choke-point freeze.
  const tidyOnce = (client: MoneyMapData): MoneyMapData => {
    const anchors = buildTidyAnchors(
      layoutMap(client),
      layoutOverrideRect(client, 'asNeededChip'),
    )
    const tidied = tidyArrangement(client, anchors, OVERRIDE_BOUNDS)
    return tidied === client ? client : freezeAsNeededChip(client, tidied)
  }

  it.each(SAMPLES)('settles by the second tidy click (%s)', (_name, sample) => {
    const first = tidyOnce(sample)
    expect(tidyOnce(first)).toBe(first)
  })
})
