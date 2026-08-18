import { describe, expect, it } from 'vitest'
import { newBook } from '../src/model/book'
import { newDataKey, sealBook, type Wrap } from '../src/model/crypto'
import {
  readBookFile,
  writePlainBookFile,
  type BookFileHandle,
} from '../src/model/filestore'

class FakeBookFileHandle implements BookFileHandle {
  readonly kind = 'file' as const
  readonly name = 'money-map-book.json'
  createWritableCalls = 0
  closeCalls = 0
  failWriteWith: Error | null = null
  failCloseWith: Error | null = null

  constructor(public contents = '') {}

  async getFile(): Promise<File> {
    return { text: async () => this.contents } as File
  }

  async createWritable() {
    this.createWritableCalls += 1
    return {
      write: async (data: string) => {
        if (this.failWriteWith) throw this.failWriteWith
        this.contents = data
      },
      close: async () => {
        this.closeCalls += 1
        if (this.failCloseWith) throw this.failCloseWith
      },
    }
  }

  async queryPermission(): Promise<PermissionState> {
    return 'granted'
  }

  async requestPermission(): Promise<PermissionState> {
    return 'granted'
  }
}

const unexpectedGetDataKey = async () => {
  throw new Error('Plain read requested a key.')
}

describe('writePlainBookFile', () => {
  it('writes JSON.stringify(book, null, 2) and returns that same string', async () => {
    const handle = new FakeBookFileHandle()
    const book = newBook()

    const result = await writePlainBookFile(handle, book)

    expect(result).toBe(JSON.stringify(book, null, 2))
    expect(handle.contents).toBe(result)
  })

  it('calls createWritable() exactly once and close() exactly once', async () => {
    const handle = new FakeBookFileHandle()

    await writePlainBookFile(handle, newBook())

    expect(handle.createWritableCalls).toBe(1)
    expect(handle.closeCalls).toBe(1)
  })

  it('round-trips through readBookFile with zero crypto calls (assumption-delta invariant)', async () => {
    const handle = new FakeBookFileHandle()
    const book = newBook()
    await writePlainBookFile(handle, book)

    const loaded = await readBookFile(handle, unexpectedGetDataKey)

    expect(loaded).toEqual(book)
  })

  it('leaves the original file content unchanged when write() rejects mid-call', async () => {
    const original = JSON.stringify(newBook())
    const handle = new FakeBookFileHandle(original)
    handle.failWriteWith = new Error('disk full')

    await expect(writePlainBookFile(handle, newBook())).rejects.toThrow('disk full')
    expect(handle.contents).toBe(original)
  })

  it('rejects when close() fails after a successful write()', async () => {
    const original = JSON.stringify(newBook())
    const handle = new FakeBookFileHandle(original)
    handle.failCloseWith = new Error('handle revoked')

    await expect(writePlainBookFile(handle, newBook())).rejects.toThrow('handle revoked')
  })

  it('conversion round-trip: a v2-encrypted book, once decrypted, writes plain and reads back with no key requested', async () => {
    const dek = await newDataKey()
    const wraps: Wrap[] = []
    const book = newBook()
    const envelope = await sealBook(dek, JSON.stringify(book), wraps)
    const handle = new FakeBookFileHandle(envelope)

    await writePlainBookFile(handle, book)
    const loaded = await readBookFile(handle, unexpectedGetDataKey)

    expect(loaded).toEqual(book)
  })

  it('interrupted conversion: a v2 envelope survives byte-for-byte when the conversion write() rejects', async () => {
    const dek = await newDataKey()
    const wraps: Wrap[] = []
    const book = newBook()
    const envelope = await sealBook(dek, JSON.stringify(book), wraps)
    const handle = new FakeBookFileHandle(envelope)
    handle.failWriteWith = new Error('disk full')

    await expect(writePlainBookFile(handle, book)).rejects.toThrow('disk full')
    expect(handle.contents).toBe(envelope)
  })

  it('idempotency: converting the same book twice produces identical content and stays readable each time', async () => {
    const handle = new FakeBookFileHandle()
    const book = newBook()

    const first = await writePlainBookFile(handle, book)
    const firstLoad = await readBookFile(handle, unexpectedGetDataKey)
    const second = await writePlainBookFile(handle, book)
    const secondLoad = await readBookFile(handle, unexpectedGetDataKey)

    expect(second).toBe(first)
    expect(firstLoad).toEqual(book)
    expect(secondLoad).toEqual(book)
  })
})
