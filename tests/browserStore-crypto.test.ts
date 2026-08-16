import { beforeAll, describe, expect, it } from 'vitest'
import { newBook } from '../src/model/book'
import {
  BOOK_STORAGE_KEY,
  loadBrowserBook,
  saveBrowserBook,
  type StorageLike,
  writeSealedBook,
} from '../src/model/browserStore'
import { deriveKey, isEnvelope, newSalt } from '../src/model/crypto'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

const salt = newSalt()
let key!: CryptoKey
let wrongKey!: CryptoKey

beforeAll(async () => {
  ;[key, wrongKey] = await Promise.all([
    deriveKey('correct horse', salt),
    deriveKey('wrong horse', salt),
  ])
})

describe('encrypted browser book persistence', () => {
  it('round-trips a sealed browser book', async () => {
    const storage = new MemoryStorage()
    const book = newBook()
    let requestedKey = false

    const saving = saveBrowserBook(storage, book, key, salt)
    expect(saving).toBeInstanceOf(Promise)
    expect(await saving).toBeNull()
    const loading = loadBrowserBook(storage, async (storedSalt) => {
      requestedKey = true
      expect(storedSalt).toEqual(salt)
      return key
    })
    expect(loading).toBeInstanceOf(Promise)
    const loaded = await loading

    expect(loaded.status).toBe('ready')
    expect(loaded.book).toEqual(book)
    expect(requestedKey).toBe(true)
  })

  it('does not store readable plaintext', async () => {
    const storage = new MemoryStorage()
    const book = newBook()
    book.clients[0].client.title = 'Private advisor notes'

    await saveBrowserBook(storage, book, key, salt)
    const stored = storage.getItem(BOOK_STORAGE_KEY)!

    expect(isEnvelope(stored)).toBe(true)
    expect(stored).not.toContain('Private advisor notes')
  })

  it('keeps ciphertext when the passphrase is wrong', async () => {
    const storage = new MemoryStorage()
    await saveBrowserBook(storage, newBook(), key, salt)
    const ciphertext = storage.getItem(BOOK_STORAGE_KEY)!

    const loaded = await loadBrowserBook(storage, async () => wrongKey)

    expect(loaded.status).toBe('error')
    expect(loaded.status !== 'ready' && loaded.message).toBe(
      'The passphrase did not open the saved book.',
    )
    expect(storage.getItem(BOOK_STORAGE_KEY)).toBe(ciphertext)
  })

  it('loads a legacy plaintext book', async () => {
    const storage = new MemoryStorage()
    const book = newBook()
    let requestedKey = false
    storage.setItem(BOOK_STORAGE_KEY, JSON.stringify(book))

    const loading = loadBrowserBook(storage, async () => {
      requestedKey = true
      return key
    })
    expect(loading).toBeInstanceOf(Promise)
    const loaded = await loading

    expect(loaded.status).toBe('ready')
    expect(loaded.book).toEqual(book)
    expect(requestedKey).toBe(false)
  })

  it('writes sealed data synchronously', async () => {
    const storage = new MemoryStorage()
    let awaitResolved = false
    const resolution = Promise.resolve().then(() => { awaitResolved = true })

    expect(writeSealedBook(storage, 'sealed book')).toBeNull()

    expect(awaitResolved).toBe(false)
    expect(storage.getItem(BOOK_STORAGE_KEY)).toBe('sealed book')
    await resolution
  })
})
