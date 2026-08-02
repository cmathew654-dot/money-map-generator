import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { describe, expect, it, vi } from 'vitest'
import { layoutMap, OVERRIDE_BOUNDS, rotatedBounds } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'

type Button = ReactElement<{
  children?: ReactNode
  onClick(): void
}>

function findButton(node: ReactNode, label: string): Button | undefined {
  if (!isValidElement(node)) return undefined
  const props = node.props as { children?: ReactNode; onClick?: () => void }
  if (node.type === 'button' && props.children === label && props.onClick) {
    return node as Button
  }
  for (const child of Children.toArray(props.children)) {
    const match = findButton(child, label)
    if (match) return match
  }
  return undefined
}

function inspector(
  data: MoneyMapData,
  selectedTargetKey: string,
  onChange: (next: MoneyMapData) => void,
  onSelect: (key: string) => void,
) {
  const props = {
    data,
    selectedTargetKey,
    onChange,
    onClose: () => undefined,
    onSelect,
  } as Parameters<typeof MapInspector>[0] & {
    onSelect(key: string): void
  }
  return MapInspector(props)
}

describe('selected map object duplicate', () => {
  it('duplicates one account with remapped visual overrides and no new flows', () => {
    const source = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.id === 'managed-after-tax-trust',
    )!
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      accounts: [source],
      notes: [],
      customArrows: [{
        id: 'source-flow',
        sourceId: source.id,
        targetId: 'need',
        style: 'solid',
        label: 'Keep on source',
      }],
      layoutOverrides: {
        [source.id]: { dx: 3, dy: 4, w: 310, h: 420, rot: 15 },
        [`text:${source.id}:label`]: { fs: 20, dx: 1 },
        [`text:${source.id}:caption`]: { fs: 15, dy: 2 },
        [`text:${source.id}:value`]: { fs: 24, dx: 3 },
        [`text:${source.id}:rows`]: { fs: 14, dy: 4 },
        [`text:${source.id}:sub`]: { fs: 18, dx: 5 },
      },
    }
    const onChange = vi.fn<(next: MoneyMapData) => void>()
    const onSelect = vi.fn<(key: string) => void>()

    const duplicate = findButton(
      inspector(data, `account:${source.id}`, onChange, onSelect),
      'Duplicate',
    )

    expect(duplicate).toBeDefined()
    duplicate!.props.onClick()
    expect(onChange).toHaveBeenCalledTimes(1)
    const next = onChange.mock.calls[0][0]
    const copy = next.accounts[1]
    const sourceRect = layoutMap(data).accounts.find(
      (placed) => placed.account.id === source.id,
    )!
    const copyRect = layoutMap(next).accounts.find(
      (placed) => placed.account.id === copy.id,
    )!
    expect(copy).toEqual({ ...source, id: copy.id })
    expect(copy.id).not.toBe(source.id)
    expect(copy.positions).not.toBe(source.positions)
    expect(copy.positions?.[0]).not.toBe(source.positions?.[0])
    expect(next.customArrows).toEqual(data.customArrows)
    expect(next.customArrows?.some((arrow) =>
      arrow.sourceId === copy.id || arrow.targetId === copy.id,
    )).toBe(false)
    expect(next.layoutOverrides?.[copy.id]).toEqual({
      w: 310,
      h: 420,
      rot: 15,
      dx: expect.any(Number),
      dy: expect.any(Number),
    })
    expect({ x: copyRect.x, y: copyRect.y }).toEqual({
      x: sourceRect.x + 24,
      y: sourceRect.y + 24,
    })
    for (const role of ['label', 'caption', 'value', 'rows', 'sub']) {
      expect(next.layoutOverrides?.[`text:${copy.id}:${role}`]).toEqual(
        data.layoutOverrides?.[`text:${source.id}:${role}`],
      )
    }
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith(`account:${copy.id}`)
  })

  it('duplicates a note once and falls back up-left when down-right is blocked', () => {
    const source = {
      id: 'source-note',
      text: 'Preserve every note setting',
      x: 500,
      y: 500,
      w: 120,
      bg: true,
      fs: 18,
    }
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      accounts: [],
      customArrows: [],
      notes: [
        source,
        { id: 'blocking-note', text: 'Occupied', x: 524, y: 524, w: 120 },
      ],
    }
    const onChange = vi.fn<(next: MoneyMapData) => void>()
    const onSelect = vi.fn<(key: string) => void>()

    const duplicate = findButton(
      inspector(data, 'note:source-note', onChange, onSelect),
      'Duplicate',
    )

    expect(duplicate).toBeDefined()
    duplicate!.props.onClick()
    expect(onChange).toHaveBeenCalledTimes(1)
    const next = onChange.mock.calls[0][0]
    const copy = next.notes?.find(
      (note) => note.id !== 'source-note' && note.id !== 'blocking-note',
    )
    expect(copy).toEqual({ ...source, id: copy!.id, x: 476, y: 476 })
    expect(copy!.id).not.toBe(source.id)
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith(`note:${copy!.id}`)
  })

  it('moves a rotated edge account up-left by rendered bounds and keeps it bounded', () => {
    const source = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.id === 'managed-after-tax-trust',
    )!
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      accounts: [source],
      notes: [],
      customArrows: [],
      layoutOverrides: {
        [source.id]: { dx: 10_000, dy: 10_000, w: 310, h: 420, rot: 45 },
      },
    }
    const onChange = vi.fn<(next: MoneyMapData) => void>()

    findButton(
      inspector(data, `account:${source.id}`, onChange, () => undefined),
      'Duplicate',
    )!.props.onClick()

    const next = onChange.mock.calls[0][0]
    const copy = next.accounts.find((account) => account.id !== source.id)!
    const sourcePlaced = layoutMap(next).accounts.find(
      (placed) => placed.account.id === source.id,
    )!
    const copyPlaced = layoutMap(next).accounts.find(
      (placed) => placed.account.id === copy.id,
    )!
    const sourcePixels = rotatedBounds(sourcePlaced, sourcePlaced.rot)
    const copyPixels = rotatedBounds(copyPlaced, copyPlaced.rot)

    expect(copyPixels.x).toBeCloseTo(sourcePixels.x - 24)
    expect(copyPixels.y).toBeCloseTo(sourcePixels.y - 24)
    expect(copyPixels).not.toEqual(sourcePixels)
    expect(copyPixels.x).toBeGreaterThanOrEqual(OVERRIDE_BOUNDS.left)
    expect(copyPixels.y).toBeGreaterThanOrEqual(OVERRIDE_BOUNDS.top)
    expect(copyPixels.x + copyPixels.w).toBeLessThanOrEqual(OVERRIDE_BOUNDS.right)
    expect(copyPixels.y + copyPixels.h).toBeLessThanOrEqual(OVERRIDE_BOUNDS.bottom)
  })

  it('does not offer duplicate for flows or text targets', () => {
    const noop = () => undefined
    const arrowId = SAMPLE_WHITFIELD.customArrows![0].id

    expect(findButton(
      inspector(SAMPLE_WHITFIELD, `arrow:custom:${arrowId}`, noop, noop),
      'Duplicate',
    )).toBeUndefined()
    expect(findButton(
      inspector(SAMPLE_WHITFIELD, 'text:need:value', noop, noop),
      'Duplicate',
    )).toBeUndefined()
  })
})
