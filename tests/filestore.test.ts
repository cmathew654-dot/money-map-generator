import { describe, expect, it } from 'vitest'
import {
  resolveFileConnection,
  supportsFileStore,
} from '../src/model/filestore'
import type { MoneyMapFile } from '../src/model/types'

function book(label: string): MoneyMapFile {
  return { label } as unknown as MoneyMapFile
}

describe('file store decisions', () => {
  it('requires both file pickers to expose the feature', () => {
    const save = async () => {
      throw new Error('not called')
    }
    const open = async () => {
      throw new Error('not called')
    }

    expect(
      supportsFileStore({
        showSaveFilePicker: save,
        showOpenFilePicker: open,
      }),
    ).toBe(true)
    expect(supportsFileStore({ showSaveFilePicker: save })).toBe(false)
    expect(supportsFileStore({ showOpenFilePicker: open })).toBe(false)
    expect(supportsFileStore({})).toBe(false)
  })

  it('lets a valid file replace the local fallback copy', () => {
    const localBook = book('local')
    const fileBook = book('file')

    expect(
      resolveFileConnection(localBook, {
        status: 'success',
        book: fileBook,
      }),
    ).toEqual({ book: fileBook, connected: true })
  })

  it('keeps the local copy when reading or validating the file fails', () => {
    const localBook = book('local')
    const error = new Error('file missing')

    expect(
      resolveFileConnection(localBook, { status: 'failure', error }),
    ).toEqual({ book: localBook, connected: false, error })
  })
})
