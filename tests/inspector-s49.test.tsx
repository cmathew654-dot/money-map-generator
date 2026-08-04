import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import { MapInspector } from '../src/render/MapInspector'

type InspectorControl = ReactElement<{
  children?: ReactNode
  onClick?: () => void
}>

function findByText(node: ReactNode, text: string): InspectorControl {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as InspectorControl
    if (element.props.children === text) return element
    if (element.props.children !== undefined) {
      try {
        return findByText(element.props.children, text)
      } catch {
        // Keep searching sibling branches.
      }
    }
  }
  throw new Error(`Missing inspector control: ${text}`)
}

const render = (selectedTargetKey: string, data = SAMPLE_WHITFIELD) =>
  renderToStaticMarkup(
    createElement(MapInspector, {
      data,
      selectedTargetKey,
      onChange: () => undefined,
      onClose: () => undefined,
      onSelect: () => undefined,
    }),
  )

const NOTE_DATA: MoneyMapData = {
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'audit-note', text: 'Keep this visible', x: 500, y: 400 }],
}

describe('s49 inspector bar', () => {
  it('lets the bar grow down instead of clipping its controls', () => {
    const css = readFileSync('src/styles/app.css', 'utf8')
    const bar = /\.map-inspector \{([^}]*)\}/s.exec(css)?.[1] ?? ''

    expect(bar).not.toMatch(/(^|[;\s])height:\s*\d+px/)
    expect(Number(/min-height:\s*(\d+)px/.exec(bar)?.[1])).toBeGreaterThanOrEqual(72)
    // Anchored at the top so the heading never jumps when a second row appears.
    expect(bar).toMatch(/top:\s*12px/)

    const controls = /\.map-inspector-controls \{([^}]*)\}/s.exec(css)?.[1] ?? ''
    expect(controls).toMatch(/flex-wrap:\s*wrap/)
    expect(controls).not.toMatch(/overflow-x:\s*auto/)
  })

  it('offers Delete account for a selected account only', () => {
    expect(render('account:cash-at-bank')).toContain('Delete account')
    expect(render('note:audit-note', NOTE_DATA)).not.toContain('Delete account')
    expect(render('arrow:income')).not.toContain('Delete account')
  })

  it('deletes the selected account through the shared map mutation', () => {
    const changes: MoneyMapData[] = []
    let closes = 0
    const inspector = MapInspector({
      data: SAMPLE_WHITFIELD,
      selectedTargetKey: 'account:cash-at-bank',
      onChange: (next) => { changes.push(next) },
      onClose: () => { closes += 1 },
      onSelect: () => undefined,
    })

    findByText(inspector, 'Delete account').props.onClick?.()

    const next = changes.at(-1)!
    expect(next.accounts.some((account) => account.id === 'cash-at-bank')).toBe(false)
    expect(next.accounts).toHaveLength(SAMPLE_WHITFIELD.accounts.length - 1)
    expect(next.customArrows?.some(
      (arrow) => arrow.sourceId === 'cash-at-bank' || arrow.targetId === 'cash-at-bank',
    )).toBeFalsy()
    expect(closes).toBe(1)
  })

  it('names the close button for pointer and screen-reader users', () => {
    expect(render('account:cash-at-bank')).toMatch(
      /<button[^>]*aria-label="Close[^"]*"[^>]*title="Close"[^>]*>×<\/button>/,
    )
  })
})
