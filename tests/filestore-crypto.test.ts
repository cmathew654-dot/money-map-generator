import { beforeAll, describe, expect, it, vi } from 'vitest'
import { newBook } from '../src/model/book'
import { deriveKey, newSalt } from '../src/model/crypto'
import {
  readBookFile,
  writeBookFile,
  type BookFileHandle,
} from '../src/model/filestore'

class FakeBookFileHandle implements BookFileHandle {
  readonly kind = 'file' as const
  readonly name = 'money-map-book.json'

  constructor(public contents = '') {}

  async getFile(): Promise<File> {
    return { text: async () => this.contents } as File
  }

  async createWritable() {
    return {
      write: async (data: string) => {
        this.contents = data
      },
      close: async () => undefined,
    }
  }

  async queryPermission(): Promise<PermissionState> {
    return 'granted'
  }

  async requestPermission(): Promise<PermissionState> {
    return 'granted'
  }
}

describe('encrypted book files', () => {
  const salt = newSalt()
  const book = newBook()
  const clientName = 'Private Client Name'
  let key: CryptoKey
  let wrongKey: CryptoKey

  book.clients[0].client.title = clientName

  beforeAll(async () => {
    ;[key, wrongKey] = await Promise.all([
      deriveKey('correct passphrase', salt),
      deriveKey('wrong passphrase', salt),
    ])
  })

  it('round-trips an encrypted book with the right passphrase', async () => {
    const handle = new FakeBookFileHandle()
    let embeddedSalt: Uint8Array | undefined

    await writeBookFile(handle, book, key, salt)
    const loaded = await readBookFile(handle, async (fileSalt) => {
      embeddedSalt = fileSalt
      return key
    })

    expect(embeddedSalt).toEqual(salt)
    expect(loaded).toEqual(book)
  })

  it('reads legacy plaintext without requesting a key', async () => {
    const handle = new FakeBookFileHandle(JSON.stringify(book))
    const getKey = vi.fn(async (_salt: Uint8Array) => key)

    await expect(readBookFile(handle, getKey)).resolves.toEqual(book)
    expect(getKey).not.toHaveBeenCalled()
  })

  it('rejects a wrong passphrase', async () => {
    const handle = new FakeBookFileHandle()

    await writeBookFile(handle, book, key, salt)

    await expect(
      readBookFile(handle, async () => wrongKey),
    ).rejects.toThrow()
  })

  it('does not write client names in plaintext', async () => {
    const handle = new FakeBookFileHandle()

    await writeBookFile(handle, book, key, salt)

    expect(handle.contents).not.toContain(clientName)
  })
})
