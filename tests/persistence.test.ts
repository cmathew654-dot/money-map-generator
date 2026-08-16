import { describe, expect, it } from 'vitest'
import {
  BOOK_STORAGE_KEY,
  LEGACY_BOOK_STORAGE_KEY,
  loadBrowserBook,
  type StorageLike,
} from '../src/model/browserStore'
import { newBook } from '../src/model/book'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  writes: Array<[string, string]> = []
  removed: string[] = []
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.writes.push([key, value]); this.values.set(key, value) }
  removeItem(key: string) { this.removed.push(key); this.values.delete(key) }
}

describe('legacy browser book migration', () => {
  it('copies a valid legacy book to the current key and removes the legacy key', () => {
    const storage = new MemoryStorage()
    const raw = JSON.stringify(newBook())
    storage.values.set(LEGACY_BOOK_STORAGE_KEY, raw)

    const loaded = loadBrowserBook(storage)

    expect(loaded.status).toBe('ready')
    expect(storage.values.get(BOOK_STORAGE_KEY)).toBe(raw)
    expect(storage.values.has(LEGACY_BOOK_STORAGE_KEY)).toBe(false)
  })

  it('never overwrites valid current data with legacy data', () => {
    const storage = new MemoryStorage()
    const current = newBook()
    const legacy = newBook()
    legacy.clients[0].client.title = 'Legacy title'
    const currentRaw = JSON.stringify(current)
    storage.values.set(BOOK_STORAGE_KEY, currentRaw)
    storage.values.set(LEGACY_BOOK_STORAGE_KEY, JSON.stringify(legacy))

    const loaded = loadBrowserBook(storage)

    expect(loaded.status).toBe('ready')
    expect(loaded.book.clients[0].client.title).toBe(current.clients[0].client.title)
    expect(storage.values.get(BOOK_STORAGE_KEY)).toBe(currentRaw)
    expect(storage.writes).toHaveLength(0)
  })

  it('returns corrupt legacy payloads for recovery without writing either key', () => {
    const storage = new MemoryStorage()
    storage.values.set(LEGACY_BOOK_STORAGE_KEY, '{broken legacy')

    const loaded = loadBrowserBook(storage)

    expect(loaded.status).toBe('recovery')
    expect(loaded.raw).toBe('{broken legacy')
    expect(storage.writes).toHaveLength(0)
    expect(storage.values.get(LEGACY_BOOK_STORAGE_KEY)).toBe('{broken legacy')
  })

  it('prioritizes corrupt current data for recovery rather than replacing it', () => {
    const storage = new MemoryStorage()
    storage.values.set(BOOK_STORAGE_KEY, '{broken current')
    storage.values.set(LEGACY_BOOK_STORAGE_KEY, JSON.stringify(newBook()))

    const loaded = loadBrowserBook(storage)

    expect(loaded.status).toBe('recovery')
    expect(loaded.raw).toBe('{broken current')
    expect(storage.writes).toHaveLength(0)
  })
})