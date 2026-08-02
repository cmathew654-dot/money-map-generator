import { describe, expect, it } from 'vitest'
import { loadBrowserBook, resolveDataMode, saveBrowserBook, type StorageLike } from '../src/model/browserStore'

describe('resolveDataMode', () => {
  it.each([
    [{ DEV: false }, 'real'],
    [{ DEV: true }, 'real'],
    [{ DEV: false, VITE_DATA_MODE: 'real' }, 'real'],
    [{ DEV: false, VITE_DATA_MODE: 'demo' }, 'demo'],
    [{ DEV: true, VITE_DATA_MODE: 'demo' }, 'demo'],
    [{ DEV: false, VITE_DATA_MODE: 'unexpected' }, 'real'],
  ] as const)(
    'uses %s as %s mode',
    (environment, expected) => {
      expect(resolveDataMode(environment)).toBe(expected)
    },
  )
})

describe('browser storage errors', () => {
  it('does not expose browser or parser internals', () => {
    const blocked: StorageLike = {
      getItem() { throw new DOMException('Access is denied for opaque origin') },
      setItem() { throw new DOMException('QuotaExceededError: internal path') },
      removeItem() {},
    }
    const blockedLoad = loadBrowserBook(blocked)
    expect(blockedLoad.status).toBe('error')
    expect(blockedLoad.status !== 'ready' && blockedLoad.message).toBe(
      'Money Map could not read saved changes from this browser.',
    )
    expect(saveBrowserBook(blocked, { fileType: 'money-map-book', version: 1, clients: [] })).toBe(
      'Money Map could not save changes in this browser.',
    )

    const malformed: StorageLike = {
      getItem() { return JSON.stringify({ fileType: 'money-map-book', version: 1, clients: {} }) },
      setItem() {},
      removeItem() {},
    }
    const malformedLoad = loadBrowserBook(malformed)
    expect(malformedLoad.status).toBe('recovery')
    expect(malformedLoad.status !== 'ready' && malformedLoad.message).toBe(
      'The saved Money Map could not be opened.',
    )
  })
})
