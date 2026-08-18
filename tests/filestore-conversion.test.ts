import { describe, expect, it } from 'vitest'
import { newBook } from '../src/model/book'
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
})
