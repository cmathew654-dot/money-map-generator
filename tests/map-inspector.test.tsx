import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { MapInspector } from '../src/render/MapInspector'

const render = (selectedTargetKey: string, data = SAMPLE_WHITFIELD) =>
  renderToStaticMarkup(
    createElement(MapInspector, {
      data,
      selectedTargetKey,
      onChange: () => undefined,
      onClose: () => undefined,
    }),
  )

describe('persistent map inspector', () => {
  it('provides complete click alternatives for selected accounts', () => {
    const markup = render('account:cash-at-bank')

    for (const label of ['Shape', 'Move', 'Size', 'Rotate', 'Connect to', 'Reset']) {
      expect(markup).toContain(label)
    }
  })

  it('gives custom and generated arrows the appropriate visual controls', () => {
    const custom = render('arrow:custom:migrated-flow:managed-ira-jordan')
    const generated = render('arrow:income')

    for (const label of ['Style', 'Color', 'Bend', 'Source', 'Target', 'Reset', 'Delete flow']) {
      expect(custom).toContain(label)
    }
    for (const label of ['Style', 'Color', 'Bend', 'Reset', 'Hide flow']) {
      expect(generated).toContain(label)
    }
    expect(generated).not.toContain('Source</label>')
    expect(generated).not.toContain('Target</label>')
  })

  it('provides note and calculated-text click alternatives', () => {
    const note = render('note:audit-note', {
      ...SAMPLE_WHITFIELD,
      notes: [{ id: 'audit-note', text: 'Keep this visible', x: 500, y: 400 }],
    })
    const supporting = render('text:need:supporting')

    for (const label of ['Move', 'Size', 'Background', 'Reset', 'Delete note']) {
      expect(note).toContain(label)
    }
    for (const label of ['Move', 'Font size', 'Reset']) {
      expect(supporting).toContain(label)
    }
  })

  it('keeps every native inspector target at least 32 CSS pixels', () => {
    const css = readFileSync('src/styles/app.css', 'utf8')
    expect(css).toMatch(/\.map-inspector (?:button|select)[^{]*\{[^}]*min-height:\s*32px/s)
  })
})
