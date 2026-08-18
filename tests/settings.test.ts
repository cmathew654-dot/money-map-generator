import { describe, expect, it } from 'vitest'
import {
  PROTECTION_ENABLED_KEY,
  protectionEnabled,
  setProtectionEnabled,
} from '../src/model/settings'
import type { StorageLike } from '../src/model/browserStore'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

class ThrowingStorage implements StorageLike {
  getItem(): string {
    throw new Error('localStorage is unavailable')
  }
  setItem(): void {
    throw new Error('localStorage is unavailable')
  }
  removeItem(): void {
    throw new Error('localStorage is unavailable')
  }
}

describe('protection preference', () => {
  it('defaults to off on a storage with no entry for the key', () => {
    const storage = new MemoryStorage()
    expect(protectionEnabled(storage)).toBe(false)
  })

  it('turns on and off through setProtectionEnabled', () => {
    const storage = new MemoryStorage()
    setProtectionEnabled(true, storage)
    expect(protectionEnabled(storage)).toBe(true)
    setProtectionEnabled(false, storage)
    expect(protectionEnabled(storage)).toBe(false)
  })

  it('fails safe to off when the storage throws', () => {
    const storage = new ThrowingStorage()
    expect(protectionEnabled(storage)).toBe(false)
  })

  it('treats any stored value other than the enabled marker as off', () => {
    const storage = new MemoryStorage()
    storage.setItem(PROTECTION_ENABLED_KEY, 'off')
    expect(protectionEnabled(storage)).toBe(false)
    storage.setItem(PROTECTION_ENABLED_KEY, 'garbage')
    expect(protectionEnabled(storage)).toBe(false)
  })
})
