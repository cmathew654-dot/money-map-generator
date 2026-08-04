import appSource from '../src/App.tsx?raw'
import panelSource from '../src/ui/EditorPanels.tsx?raw'
import { describe, expect, it } from 'vitest'
import {
  clampZoom,
  dataTargetForMapKey,
  flowEndpointsFromSelection,
  noteSpawnPoint,
} from '../src/App'

describe('Session 49 zoom floor', () => {
  it('lets the map zoom down to 25%', () => {
    expect(clampZoom(25)).toBe(25)
    expect(clampZoom(35 - 10)).toBe(25)
    expect(clampZoom(10)).toBe(25)
  })

  it('still caps the map at 200%', () => {
    expect(clampZoom(200)).toBe(200)
    expect(clampZoom(260)).toBe(200)
    expect(clampZoom(120)).toBe(120)
  })

  it('disables zoom-out at the new floor, not at 50', () => {
    expect(appSource).not.toContain('mapZoom === 50')
    expect(appSource).toContain('mapZoom === MIN_ZOOM')
  })
})

describe('Session 49 details on double click', () => {
  it('maps map target keys to their data panel section and id', () => {
    expect(dataTargetForMapKey('income')).toEqual({ section: 'income', id: 'income' })
    expect(dataTargetForMapKey('need')).toEqual({ section: 'need', id: 'need' })
    expect(dataTargetForMapKey('account:acct-1')).toEqual({ section: 'accounts', id: 'acct-1' })
    expect(dataTargetForMapKey('note:note-1')).toEqual({ section: 'notes', id: 'note-1' })
  })

  it('has no data target for arrows or an empty selection', () => {
    expect(dataTargetForMapKey('arrow:custom:a1')).toBeNull()
    expect(dataTargetForMapKey(null)).toBeNull()
  })

  it('opens details from a map double click without touching single click', () => {
    expect(appSource).toContain('onDoubleClick={handleMapDoubleClick}')
    expect(appSource).toContain('const handleMapDoubleClick = ()')
  })

  it('opens details from a Contents row double click', () => {
    expect(panelSource).toContain('onOpenTarget')
    expect(panelSource).toContain('onDoubleClick={() => onOpenTarget(item.key)}')
    expect(appSource).toContain('onOpenTarget={openDetailsForTargetKey}')
  })
})

describe('Session 49 add flow from the map chrome', () => {
  it('pairs exactly two selected endpoints', () => {
    expect(flowEndpointsFromSelection(['income', 'account:a1'])).toEqual({
      source: 'income',
      target: 'a1',
    })
    expect(flowEndpointsFromSelection(['account:a1', 'need'])).toEqual({
      source: 'a1',
      target: 'need',
    })
  })

  it('refuses selections that cannot make a flow', () => {
    expect(flowEndpointsFromSelection(['income'])).toBeNull()
    expect(flowEndpointsFromSelection(['income', 'need', 'account:a1'])).toBeNull()
    expect(flowEndpointsFromSelection(['income', 'income'])).toBeNull()
    expect(flowEndpointsFromSelection(['note:n1', 'need'])).toBeNull()
  })

  it('wires the chrome button to the existing flow adder', () => {
    expect(appSource).toContain('+ Flow')
    expect(appSource).toContain('handlePanelAddFlow(pair.source, pair.target)')
  })
})

describe('Session 49 note spawn position', () => {
  const visible = { left: 100, right: 900, top: 0, bottom: 600 }

  it('drops the first note at the bottom centre of the visible map', () => {
    expect(noteSpawnPoint(visible, 0)).toEqual({ x: 500, y: 528 })
  })

  it('cascades successive notes so they do not stack', () => {
    const first = noteSpawnPoint(visible, 0)
    const second = noteSpawnPoint(visible, 1)
    const third = noteSpawnPoint(visible, 2)
    expect(second.x).toBeGreaterThan(first.x)
    expect(second.y).toBeLessThan(first.y)
    expect(third.x).toBeGreaterThan(second.x)
  })

  it('keeps the cascade inside a short viewport', () => {
    const short = { left: 0, right: 200, top: 0, bottom: 100 }
    for (let index = 0; index < 8; index += 1) {
      expect(noteSpawnPoint(short, index).y).toBeGreaterThanOrEqual(short.top)
    }
  })
})
