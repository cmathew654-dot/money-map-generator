import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { layoutOverrideRect } from '../src/layout/layout'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'
import { MapSvg, rotateHandleTarget } from '../src/render/MapSvg'
import { snapRotation } from '../src/render/mapInteraction'

type Control = ReactElement<{
  'aria-label'?: string
  children?: ReactNode
  onClick?: () => void
}>

function findControl(node: ReactNode, label: string): Control | null {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as Control
    if (element.props['aria-label'] === label) return element
    // Inspector controls live inside plain, hook-free sub-components; invoke them.
    if (typeof element.type === 'function') {
      const render = element.type as (props: unknown) => ReactNode
      const nested = findControl(render(element.props), label)
      if (nested) return nested
    }
    if (element.props.children !== undefined) {
      const nested = findControl(element.props.children, label)
      if (nested) return nested
    }
  }
  return null
}

// The one sample account carrying all three rotatable text roles.
const ACCOUNT_ID = SAMPLE_WHITFIELD.accounts.find(
  (account) => account.caption && account.value !== null,
)!.id
const TEXT_KEYS = [
  `text:${ACCOUNT_ID}:label`,
  `text:${ACCOUNT_ID}:caption`,
  `text:${ACCOUNT_ID}:value`,
]

function inspector(
  selectedTargetKey: string,
  data: MoneyMapData,
  onChange: (next: MoneyMapData) => void = () => undefined,
) {
  return MapInspector({
    data,
    selectedTargetKey,
    onChange,
    onClose: () => undefined,
    onSelect: () => undefined,
  })
}

describe('s51 rotate: account text sub-elements are rotatable', () => {
  it('offers rotate controls for every account text sub-element key', () => {
    for (const key of TEXT_KEYS) {
      const tree = inspector(key, SAMPLE_WHITFIELD)
      expect(
        findControl(tree, 'Rotate clockwise'),
        `missing rotate control for ${key}`,
      ).not.toBeNull()
    }
  })

  it('exposes an on-canvas rotate handle target for account text keys', () => {
    for (const key of TEXT_KEYS) {
      const target = rotateHandleTarget(SAMPLE_WHITFIELD, key)
      expect(target, `missing rotate handle for ${key}`).not.toBeNull()
      expect(target!.key).toBe(key)
      expect(target!.rect).toEqual(layoutOverrideRect(SAMPLE_WHITFIELD, key))
    }
  })

  it('renders a rotate transform for a rotated account text sub-element', () => {
    for (const key of TEXT_KEYS) {
      const data = structuredClone(SAMPLE_WHITFIELD) as MoneyMapData
      data.layoutOverrides = { ...(data.layoutOverrides ?? {}), [key]: { rot: 35 } }
      const markup = renderToStaticMarkup(createElement(MapSvg, { data }))
      expect(markup, `no rotate(35 ...) rendered for ${key}`).toContain(
        'rotate(35 ',
      )
    }
  })

  it('rotates account text about its own centre, not the account centre', () => {
    const key = `text:${ACCOUNT_ID}:label`
    const block = layoutOverrideRect(SAMPLE_WHITFIELD, key)!
    const data = structuredClone(SAMPLE_WHITFIELD) as MoneyMapData
    data.layoutOverrides = { ...(data.layoutOverrides ?? {}), [key]: { rot: 35 } }
    const markup = renderToStaticMarkup(createElement(MapSvg, { data }))
    const centre = `rotate(35 ${block.x + block.w / 2} ${block.y + block.h / 2})`
    expect(markup).toContain(centre)
  })

  it('leaves unrotated account text free of a transform', () => {
    const markup = renderToStaticMarkup(
      createElement(MapSvg, { data: SAMPLE_WHITFIELD }),
    )
    expect(markup).not.toContain('rotate(0 ')
  })
})

describe('s51 rotate: every rotate step is 5 degrees', () => {
  it('steps the Details rotate buttons by 5', () => {
    const key = `text:${ACCOUNT_ID}:label`
    const data = structuredClone(SAMPLE_WHITFIELD) as MoneyMapData
    data.layoutOverrides = { ...(data.layoutOverrides ?? {}), [key]: { rot: 20 } }
    const seen: number[] = []
    const tree = inspector(key, data, (next) => {
      seen.push(next.layoutOverrides![key].rot!)
    })
    findControl(tree, 'Rotate clockwise')!.props.onClick!()
    findControl(tree, 'Rotate counterclockwise')!.props.onClick!()
    expect(seen).toEqual([25, 15])
  })

  it('snaps drag rotation to 5-degree increments', () => {
    expect(snapRotation(7)).toBe(5)
    expect(snapRotation(12)).toBe(10)
    expect(snapRotation(43)).toBe(45)
    expect(snapRotation(359)).toBe(0)
  })
})
