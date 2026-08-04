import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'
import {
  canStartMapPan,
  mapTargetKeyStillExists,
  presentExitZoom,
} from '../src/App'

const client = {
  accounts: [{ id: 'acct-1' }, { id: 'acct-2' }],
  notes: [{ id: 'note-1' }],
  customArrows: [{ id: 'arrow-1' }],
}

describe('Session 49 map target survival', () => {
  it('keeps id-less targets that always exist on a restored map', () => {
    expect(mapTargetKeyStillExists('income', client)).toBe(true)
    expect(mapTargetKeyStillExists('need', client)).toBe(true)
    expect(mapTargetKeyStillExists('income', undefined)).toBe(true)
  })

  it('keeps account keys only while the account is in the snapshot', () => {
    expect(mapTargetKeyStillExists('account:acct-2', client)).toBe(true)
    expect(mapTargetKeyStillExists('account:gone', client)).toBe(false)
    expect(mapTargetKeyStillExists('account:acct-1', undefined)).toBe(false)
  })

  it('keeps note keys only while the note is in the snapshot', () => {
    expect(mapTargetKeyStillExists('note:note-1', client)).toBe(true)
    expect(mapTargetKeyStillExists('note:gone', client)).toBe(false)
    expect(mapTargetKeyStillExists('note:note-1', { accounts: [] })).toBe(false)
  })

  it('keeps custom arrow keys only while the arrow is in the snapshot', () => {
    expect(mapTargetKeyStillExists('arrow:custom:arrow-1', client)).toBe(true)
    expect(mapTargetKeyStillExists('arrow:custom:gone', client)).toBe(false)
    expect(mapTargetKeyStillExists('arrow:generated:income', client)).toBe(true)
  })
})

describe('Session 49 map pan gate', () => {
  it('refuses to pan a fit-to-page map or a non-primary button', () => {
    expect(canStartMapPan({ mapZoom: 'fit', button: 0, presentMode: false, onBackground: true })).toBe(false)
    expect(canStartMapPan({ mapZoom: 'fit', button: 0, presentMode: true, onBackground: true })).toBe(false)
    expect(canStartMapPan({ mapZoom: 150, button: 2, presentMode: false, onBackground: true })).toBe(false)
    expect(canStartMapPan({ mapZoom: 150, button: 2, presentMode: true, onBackground: true })).toBe(false)
  })

  it('requires the map background while editing', () => {
    expect(canStartMapPan({ mapZoom: 150, button: 0, presentMode: false, onBackground: true })).toBe(true)
    expect(canStartMapPan({ mapZoom: 150, button: 0, presentMode: false, onBackground: false })).toBe(false)
  })

  it('pans from anywhere while presenting', () => {
    expect(canStartMapPan({ mapZoom: 150, button: 0, presentMode: true, onBackground: false })).toBe(true)
  })
})

describe('Session 49 present mode zoom', () => {
  it('restores the zoom stashed when present mode started', () => {
    expect(presentExitZoom(150, 'fit')).toBe(150)
    expect(presentExitZoom('fit', 200)).toBe('fit')
  })

  it('leaves the current zoom alone when nothing was stashed', () => {
    expect(presentExitZoom(null, 120)).toBe(120)
    expect(presentExitZoom(null, 'fit')).toBe('fit')
  })
})

describe('Session 49 App wiring', () => {
  it('leaves the data panel open when history is restored', () => {
    const restore = appSource.slice(
      appSource.indexOf('const restoreHistorySnapshot'),
      appSource.indexOf('const handleUndo'),
    )
    expect(restore).not.toContain('closeDataPanel')
    expect(restore).toContain('mapTargetKeyStillExists')
  })

  it('routes a fullscreen exit through exitPresentMode so the zoom is restored', () => {
    expect(appSource).toMatch(
      /const handleFullscreenChange = \(\) => \{\s*if \(!document\.fullscreenElement\) \{\s*exitPresentMode\(\)/,
    )
    expect(appSource).toMatch(/presentZoomRef\.current = mapZoom/)
  })

  it('cancels a pending text note placement before any other Escape action', () => {
    const chain = appSource.slice(
      appSource.indexOf('const handleEditorEscape'),
      appSource.indexOf('window.addEventListener(\'keydown\', handleEditorEscape)'),
    )
    expect(chain.indexOf('placingTextNote')).toBeLessThan(chain.indexOf('mapTextEdit'))
  })
})
