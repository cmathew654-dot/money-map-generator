import { describe, expect, it } from 'vitest'
import {
  acquireBrowserWriter,
  currentBrowserWriter,
  WRITER_HEARTBEAT_MS,
  WRITER_LEASE_TTL_MS,
  WRITER_STORAGE_KEY,
  type StorageLike,
} from '../src/model/browserStore'

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>()

  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

describe('browser writer lease expiry', () => {
  it('rejects forced takeover of a fresh foreign lease', () => {
    const storage = new MemoryStorage()
    storage.setItem(WRITER_STORAGE_KEY, JSON.stringify({ tabId: 'incumbent', updatedAt: 1_000 }))

    expect(acquireBrowserWriter(storage, 'requester', true, 1_000 + WRITER_LEASE_TTL_MS - 1)).toEqual({
      status: 'blocked',
      owner: 'incumbent',
    })
    expect(currentBrowserWriter(storage)).toBe('incumbent')
  })

  it('allows forced takeover only when the foreign lease has expired', () => {
    const storage = new MemoryStorage()
    storage.setItem(WRITER_STORAGE_KEY, JSON.stringify({ tabId: 'crashed', updatedAt: 1_000 }))

    expect(acquireBrowserWriter(storage, 'requester', true, 1_000 + WRITER_LEASE_TTL_MS)).toEqual({ status: 'acquired' })
    expect(currentBrowserWriter(storage)).toBe('requester')
  })

  it('refreshing the active writer keeps its lease fresh for a full TTL', () => {
    const storage = new MemoryStorage()
    expect(acquireBrowserWriter(storage, 'incumbent', false, 1_000)).toEqual({ status: 'acquired' })
    expect(acquireBrowserWriter(storage, 'incumbent', false, 1_000 + WRITER_HEARTBEAT_MS)).toEqual({ status: 'acquired' })

    expect(acquireBrowserWriter(
      storage,
      'requester',
      true,
      1_000 + WRITER_HEARTBEAT_MS + WRITER_LEASE_TTL_MS - 1,
    )).toEqual({ status: 'blocked', owner: 'incumbent' })
  })
})
