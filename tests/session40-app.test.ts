import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'
import {
  appMapFileName,
  browserPersistenceLabel,
  canMutateBook,
  canWriteConnectedBook,
  layoutOutputBlockMessage,
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
      'Demo mode — changes are temporary',
    )
    expect(browserPersistenceLabel('real', false, 'saved')).toBe(
      'Read only — another tab owns browser saves',
    )
    expect(browserPersistenceLabel('real', true, 'saving')).toBe(
      'Saving in this browser…',
    )
    expect(browserPersistenceLabel('real', true, 'saved')).toBe(
      'Saved in this browser',
    )
    expect(browserPersistenceLabel('real', true, 'error')).toBe(
      'Browser save failed',
    )
  })

  it('omits the year separator before a no-year PNG extension', () => {
    expect(appMapFileName('New Client', '', 'png')).toBe(
      'New Client — Money Map.png',
    )
  })

  it('uses one warning gate for every map output path', () => {
    expect(layoutOutputBlockMessage([])).toBeNull()
    expect(
      layoutOutputBlockMessage([{ message: 'Accounts exceed the page.' }]),
    ).toBe('Accounts exceed the page.')
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
