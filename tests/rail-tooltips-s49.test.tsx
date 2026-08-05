import railSource from '../src/ui/EditorRail.tsx?raw'
import { describe, expect, it } from 'vitest'

describe('editor rail tooltips (s49)', () => {
  it('renders a title on each rail button', () => {
    expect(railSource).toMatch(/title=\{panelTitles\[panel\]\}/)
  })

  it('explains the Add panel', () => {
    expect(railSource).toMatch(/add: 'Add income, accounts, flows, or notes'/)
  })

  it('explains the Data and Contents panels', () => {
    expect(railSource).toMatch(/data: 'The numbers behind the map'/)
    expect(railSource).toMatch(/contents: 'Everything on the map, as a list'/)
  })

  it('explains the Help panel', () => {
    expect(railSource).toMatch(/help: 'Shortcuts and tips'/)
  })
})
