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
  'aria-label'?: string
  children?: ReactNode
  onChange?: (event: { target: { value: string } }) => void
  onClick?: () => void
}>

function findControl(node: ReactNode, label: string): InspectorControl {
  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) continue
    const element = child as InspectorControl
    if (element.props['aria-label'] === label) return element
    if (element.props.children !== undefined) {
      try {
        return findControl(element.props.children, label)
      } catch {
        // Keep searching sibling branches.
      }
    }
  }
  throw new Error(`Missing inspector control: ${label}`)
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

describe('persistent map inspector', () => {
  it('provides complete click alternatives for selected accounts', () => {
    const markup = render('account:cash-at-bank')

    for (const label of ['Shape', 'Account type', 'Move', 'Size', 'Rotate', 'Add flow to', 'Reset item', 'Snap to alignment']) {
      expect(markup).toContain(label)
    }
    expect(markup).toContain('Short-term')
    expect(markup).not.toContain('Bucket color')
    expect(markup).not.toContain('Color follows bucket')
    expect(markup).not.toContain('Tidy alignment')
  })

  it('gives custom and generated arrows the appropriate visual controls', () => {
    const arrowId = SAMPLE_WHITFIELD.customArrows![0].id
    const custom = render(`arrow:custom:${arrowId}`, {
      ...SAMPLE_WHITFIELD,
      customArrows: SAMPLE_WHITFIELD.customArrows?.map((arrow) =>
        arrow.id === arrowId ? { ...arrow, label: 'College funding' } : arrow,
      ),
    })
    const generated = render('arrow:income')

    for (const label of ['Style', 'Color', 'Curve', 'Start point', 'End point', 'Label position', 'From', 'To', 'Reset flow', 'Delete flow']) {
      expect(custom).toContain(label)
    }
    expect(custom).toContain('aria-label="Blue flow color"')
    expect(custom).toContain('aria-pressed="false"')
    expect(custom).not.toContain('<select aria-label="Color"')
    for (const label of ['Style', 'Color', 'Curve', 'Start point', 'End point', 'Reset flow', 'Hide flow']) {
      expect(generated).toContain(label)
    }
    expect(generated).not.toContain('From</label>')
    expect(generated).not.toContain('To</label>')
  })

  it('materializes a generated arrows resolved color only when its style changes', () => {
    const changes: MoneyMapData[] = []
    const inspector = MapInspector({
      data: SAMPLE_WHITFIELD,
      selectedTargetKey: 'arrow:income',
      onChange: (next) => { changes.push(next) },
      onClose: () => undefined,
      onSelect: () => undefined,
    })

    findControl(inspector, 'Style').props.onChange?.({
      target: { value: 'dotted' },
    })
    expect(changes.at(-1)?.layoutOverrides?.['arrow:income']).toEqual({
      color: 'green',
      style: 'dotted',
    })

    findControl(inspector, 'Blue flow color').props.onClick?.()
    expect(changes.at(-1)?.layoutOverrides?.['arrow:income']).toEqual({
      color: 'blue',
    })
  })

  it('provides note and calculated-text click alternatives', () => {
    const note = render('note:audit-note', {
      ...SAMPLE_WHITFIELD,
      notes: [{ id: 'audit-note', text: 'Keep this visible', x: 500, y: 400 }],
    })
    const supporting = render('text:need:supporting')
    const accountText = render('text:managed-ira-jordan:label')

    for (const label of ['Move', 'Size', 'Background', 'Reset', 'Delete note']) {
      expect(note).toContain(label)
    }
    for (const label of ['Move', 'Font size', 'Reset']) {
      expect(supporting).toContain(label)
    }
    expect(supporting).toContain('Adjust Coverage note')
    expect(accountText).toContain('Adjust Account name for Managed IRA — Jordan')
    expect(accountText).not.toContain('managed-ira-jordan')
  })

  it('keeps every native inspector target at least 32 CSS pixels', () => {
    const css = readFileSync('src/styles/app.css', 'utf8')
    expect(css).toMatch(/\.map-inspector (?:button|select)[^{]*\{[^}]*min-height:\s*32px/s)
  })
})
