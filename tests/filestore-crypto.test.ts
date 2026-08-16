import { beforeAll, describe, expect, it, vi } from 'vitest'
import { newBook } from '../src/model/book'
import {
  deriveKey,
  kekFromPassphrase,
  newDataKey,
  newSalt,
  readWraps,
  seal,
  unwrapDataKey,
  wrapDataKey,
  type Wrap,
} from '../src/model/crypto'
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
  let dek: CryptoKey
  let passphraseKek: CryptoKey
  let wrongPassphraseKek: CryptoKey
  let v1Key: CryptoKey
  let wraps: Wrap[]

  book.clients[0].client.title = clientName

  beforeAll(async () => {
    ;[dek, passphraseKek, wrongPassphraseKek, v1Key] = await Promise.all([
      newDataKey(),
      kekFromPassphrase('correct passphrase', salt),
      kekFromPassphrase('wrong passphrase', salt),
      deriveKey('correct passphrase', salt),
    ])
    wraps = [
      await wrapDataKey(dek, passphraseKek, {
        type: 'passphrase',
        label: 'Passphrase',
        salt: btoa(String.fromCharCode(...salt)),
        iter: 600_000,
      }),
    ]
  })

  it('round-trips an encrypted book with the right passphrase', async () => {
    const handle = new FakeBookFileHandle()
    let requestedEnvelope = ''

    const envelope = await writeBookFile(handle, book, dek, wraps)
    const loaded = await readBookFile(handle, async (fileEnvelope) => {
      requestedEnvelope = fileEnvelope
      return unwrapDataKey(readWraps(fileEnvelope)[0], passphraseKek)
    })

    expect(envelope).toBe(handle.contents)
    expect(requestedEnvelope).toBe(envelope)
    expect(loaded).toEqual(book)
  })

  it('reads legacy plaintext without requesting a key', async () => {
    const handle = new FakeBookFileHandle(JSON.stringify(book))
    const getKey = vi.fn(async (_envelope: string) => dek)

    await expect(readBookFile(handle, getKey)).resolves.toEqual(book)
    expect(getKey).not.toHaveBeenCalled()
  })

  it('reads a v1 envelope with the callback-provided data key', async () => {
    const envelope = await seal(v1Key, JSON.stringify(book), salt)
    const handle = new FakeBookFileHandle(envelope)
    const getDataKey = vi.fn(async (_envelope: string) => v1Key)

    await expect(readBookFile(handle, getDataKey)).resolves.toEqual(book)
    expect(getDataKey).toHaveBeenCalledWith(envelope)
  })

  it('rejects a wrong passphrase', async () => {
    const handle = new FakeBookFileHandle()

    await writeBookFile(handle, book, dek, wraps)

    await expect(
      readBookFile(handle, async (envelope) =>
        unwrapDataKey(readWraps(envelope)[0], wrongPassphraseKek),
      ),
    ).rejects.toThrow()
  })

  it('does not write client names in plaintext', async () => {
    const handle = new FakeBookFileHandle()

    await writeBookFile(handle, book, dek, wraps)

    expect(handle.contents).not.toContain(clientName)
  })
})
