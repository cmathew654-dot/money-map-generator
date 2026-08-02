import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'
import {
  appMapFileName,
  artboardPointFromClient,
  browserPersistenceLabel,
  canMutateBook,
  canWriteConnectedBook,
} from '../src/App'

describe('Session 40 App safety boundaries', () => {
  it('allows book mutation only to the real-mode writer outside recovery', () => {
    expect(canMutateBook('real', true, false)).toBe(true)
    expect(canMutateBook('real', false, false)).toBe(false)
    expect(canMutateBook('real', true, true)).toBe(false)
    expect(canMutateBook('demo', false, false)).toBe(true)
  })

  it('reports persistence without claiming demo autosave', () => {
    expect(browserPersistenceLabel('demo', false, 'saved')).toBe(
      'Public demo — changes are temporary',
    )
    expect(browserPersistenceLabel('real', false, 'saved')).toBe(
      'View only — editing is active in another Money Map tab.',
    )
    expect(browserPersistenceLabel('real', false, 'saved', true)).toBe(
      'Getting this tab ready to edit…',
    )
    expect(browserPersistenceLabel('real', true, 'saving')).toBe(
      'Saving in this browser…',
    )
    expect(browserPersistenceLabel('real', true, 'saved')).toBe(
      'Saved in this browser',
    )
    expect(browserPersistenceLabel('real', true, 'error')).toBe(
      'Changes could not be saved in this browser.',
    )
  })

  it('omits the year separator before a no-year PNG extension', () => {
    expect(appMapFileName('New Client', '', 'png')).toBe(
      'New Client — Money Map.png',
    )
  })

  it('guards connected writes and destructive loads behind writer authority', () => {
    expect(canWriteConnectedBook(true, true)).toBe(true)
    expect(canWriteConnectedBook(false, true)).toBe(false)
    expect(canWriteConnectedBook(true, false)).toBe(false)
    expect(appSource).toMatch(
      /const applyLoadedBook[\s\S]*?if \(!canMutate\) return[\s\S]*?handleDisconnectFile\(\)/,
    )
    expect(appSource).toMatch(
      /const handlePageHide[\s\S]*?releaseBrowserWriter\(localStorage, tabId\)/,
    )
  })
  it('keeps lease release isolated to the tab lifecycle and guards commits', () => {
    expect(appSource).toMatch(
      /const commitSnapshot = useCallback\([\s\S]*?if \(!canMutate\) return/,
    )
    expect(appSource).toMatch(
      /useEffect\(\s*\(\) => \(\) => \{[\s\S]*?releaseBrowserWriter\(localStorage, tabId\)[\s\S]*?\[tabId\],\s*\)/,
    )
  })
})

describe('map text placement', () => {
  it('converts a client point into fixed artboard coordinates', () => {
    expect(
      artboardPointFromClient(
        { x: 430, y: 305 },
        { left: 100, top: 50, width: 660, height: 510 },
      ),
    ).toEqual({ x: 660, y: 510 })
  })
})
