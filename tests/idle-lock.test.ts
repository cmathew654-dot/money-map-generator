import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'
import { AUTO_LOCK_MS, shouldAutoLock } from '../src/App'

describe('idle auto-lock contract', () => {
  it('uses the ten-minute timeout and only locks an eligible connected file', () => {
    expect(AUTO_LOCK_MS).toBe(10 * 60 * 1000)
    expect(shouldAutoLock({ now: 601_000, lastActivity: 0, connected: true, hasCrypto: true, dialogOpen: false, recoveryOpen: false, ceremonyPlaying: false, fileWriteInFlight: false, locked: false })).toBe(true)
    expect(shouldAutoLock({ now: 601_000, lastActivity: 0, connected: false, hasCrypto: true, dialogOpen: false, recoveryOpen: false, ceremonyPlaying: false, fileWriteInFlight: false, locked: false })).toBe(false)
  })

  it('postpones while a dialog or file write is active', () => {
    const base = { now: 601_000, lastActivity: 0, connected: true, hasCrypto: true, dialogOpen: false, recoveryOpen: false, ceremonyPlaying: false, fileWriteInFlight: false, locked: false }
    expect(shouldAutoLock({ ...base, dialogOpen: true })).toBe(false)
    expect(shouldAutoLock({ ...base, fileWriteInFlight: true })).toBe(false)
  })

  it('wipes the key, history, and book, then deletes the cached DEK', () => {
    expect(appSource).toMatch(/flushConnectedFileSave\(\)/)
    expect(appSource).toMatch(/flushBrowserSave\(\)/)
    expect(appSource).toMatch(/fileCryptoRef\.current = null/)
    expect(appSource).toMatch(/showHistory\(emptyHistory\(\)\)/)
    expect(appSource).toMatch(/showSnapshot\(\{ book: newBook\(\)/)
    expect(appSource).toMatch(/deleteStoredBookDataKey\(connectedFile\)/)
  })

  it('reopens through the existing factor path after lock', () => {
    expect(appSource).toMatch(/replaceBookFromFile\(handle, true\)/)
    expect(appSource).toMatch(/getStoredBookDataKey\(handle\)/)
    expect(appSource).toMatch(/if \(cachedDek\)/)
    expect(appSource).toMatch(/const lockCover/)
  })
})
