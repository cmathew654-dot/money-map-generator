import { describe, expect, it } from 'vitest'
import {
  acquireBrowserWriter,
  currentBrowserWriter,
  publishBrowserWriterTakeoverRequest,
  WRITER_HEARTBEAT_MS,
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
  it('republishes a blocked takeover request with a fresh timestamp', () => {
    const storage = new MemoryStorage()

    publishBrowserWriterTakeoverRequest(storage, 'requester', 1_000)
    publishBrowserWriterTakeoverRequest(storage, 'requester', 1_250)

    expect(storage.getItem('money-map-generator:writer-takeover-request')).toBe(
      JSON.stringify({ requester: 'requester', requestedAt: 1_250 }),
    )
  })

  it('blocks a passive acquire while another tab holds the lease', () => {
    const storage = new MemoryStorage()
    storage.setItem(WRITER_STORAGE_KEY, JSON.stringify({ tabId: 'incumbent', updatedAt: 1_000 }))

    expect(acquireBrowserWriter(storage, 'requester', false, 1_500)).toEqual({
      status: 'blocked',
      owner: 'incumbent',
    })
    expect(currentBrowserWriter(storage)).toBe('incumbent')
  })

  it('forced takeover succeeds immediately — editing is never blocked', () => {
    const storage = new MemoryStorage()
    storage.setItem(WRITER_STORAGE_KEY, JSON.stringify({ tabId: 'incumbent', updatedAt: 1_000 }))

    expect(acquireBrowserWriter(storage, 'requester', true, 1_001)).toEqual({ status: 'acquired' })
    expect(currentBrowserWriter(storage)).toBe('requester')
  })

  it('refreshing the active writer keeps its lease against passive acquires', () => {
    const storage = new MemoryStorage()
    expect(acquireBrowserWriter(storage, 'incumbent', false, 1_000)).toEqual({ status: 'acquired' })
    expect(acquireBrowserWriter(storage, 'incumbent', false, 1_000 + WRITER_HEARTBEAT_MS)).toEqual({ status: 'acquired' })

    expect(acquireBrowserWriter(storage, 'requester', false, 1_000 + WRITER_HEARTBEAT_MS + 1)).toEqual({
      status: 'blocked',
      owner: 'incumbent',
    })
  })
})
