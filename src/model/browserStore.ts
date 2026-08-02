import { newBook, parseBook } from './book'
import type { MoneyMapFile } from './types'

export const BOOK_STORAGE_KEY = 'money-map-generator:book'
export const LEGACY_BOOK_STORAGE_KEY = 'money-map-book:v1'
export const WRITER_STORAGE_KEY = 'money-map-generator:writer'
export const WRITER_LEASE_TTL_MS = 10_000
export const WRITER_HEARTBEAT_MS = 2_000
export const WRITER_TAKEOVER_REQUEST_KEY = 'money-map-generator:writer-takeover-request'

export function publishBrowserWriterTakeoverRequest(
  storage: StorageLike,
  tabId: string,
  now = Date.now(),
): void {
  storage.setItem(
    WRITER_TAKEOVER_REQUEST_KEY,
    JSON.stringify({ requester: tabId, requestedAt: now }),
  )
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export type DataMode = 'demo' | 'real'

export function resolveDataMode(env: { DEV?: boolean; VITE_DATA_MODE?: string }): DataMode {
  if (env.VITE_DATA_MODE === 'real') return 'real'
  if (env.VITE_DATA_MODE === 'demo') return 'demo'
  return 'real'
}

export const DATA_MODE = resolveDataMode(import.meta.env)

export type BrowserBookLoad =
  | { status: 'ready'; book: MoneyMapFile; raw: string | null }
  | { status: 'recovery'; book: MoneyMapFile; raw: string; message: string }
  | { status: 'error'; book: MoneyMapFile; raw: string | null; message: string }

export function loadBrowserBook(storage: StorageLike): BrowserBookLoad {
  let raw: string | null
  try {
    raw = storage.getItem(BOOK_STORAGE_KEY)
  } catch {
    return {
      status: 'error',
      book: newBook(),
      raw: null,
      message: 'Money Map could not read saved changes from this browser.',
    }
  }

  if (raw) {
    try {
      return { status: 'ready', book: parseBook(raw), raw }
    } catch {
      return {
        status: 'recovery',
        book: newBook(),
        raw,
        message: 'The saved Money Map could not be opened.',
      }
    }
  }

  let legacyRaw: string | null
  try {
    legacyRaw = storage.getItem(LEGACY_BOOK_STORAGE_KEY)
  } catch {
    return {
      status: 'error',
      book: newBook(),
      raw: null,
      message: 'Money Map could not read saved changes from this browser.',
    }
  }
  if (!legacyRaw) return { status: 'ready', book: newBook(), raw: null }

  let legacyBook: MoneyMapFile
  try {
    legacyBook = parseBook(legacyRaw)
  } catch {
    return {
      status: 'recovery',
      book: newBook(),
      raw: legacyRaw,
      message: 'The saved Money Map could not be opened.',
    }
  }

  try {
    storage.setItem(BOOK_STORAGE_KEY, legacyRaw)
    storage.removeItem(LEGACY_BOOK_STORAGE_KEY)
  } catch {
    return {
      status: 'error',
      book: legacyBook,
      raw: legacyRaw,
      message: 'Money Map could not save changes in this browser.',
    }
  }
  return { status: 'ready', book: legacyBook, raw: legacyRaw }
}

export function saveBrowserBook(storage: StorageLike, book: MoneyMapFile): string | null {
  try {
    storage.setItem(BOOK_STORAGE_KEY, JSON.stringify(book))
    return null
  } catch {
    return 'Money Map could not save changes in this browser.'
  }
}

interface WriterLease {
  tabId: string
  updatedAt: number
}

export function currentBrowserWriter(storage: StorageLike): string | null {
  try {
    return readLease(storage)?.tabId ?? null
  } catch {
    return null
  }
}
function readLease(storage: StorageLike): WriterLease | null {
  const raw = storage.getItem(WRITER_STORAGE_KEY)
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<WriterLease>
    return typeof value.tabId === 'string' && typeof value.updatedAt === 'number'
      ? { tabId: value.tabId, updatedAt: value.updatedAt }
      : null
  } catch {
    return null
  }
}

export type WriterAcquireResult =
  | { status: 'acquired' }
  | { status: 'blocked'; owner: string }
  | { status: 'error'; message: string }

export function acquireBrowserWriter(
  storage: StorageLike,
  tabId: string,
  force = false,
  now = Date.now(),
): WriterAcquireResult {
  try {
    const lease = readLease(storage)
    if (lease && lease.tabId !== tabId) {
      const expired = now - lease.updatedAt >= WRITER_LEASE_TTL_MS
      if (!force || !expired) return { status: 'blocked', owner: lease.tabId }
    }
    storage.setItem(WRITER_STORAGE_KEY, JSON.stringify({ tabId, updatedAt: now }))
    const verified = readLease(storage)
    return verified?.tabId === tabId
      ? { status: 'acquired' }
      : { status: 'blocked', owner: verified?.tabId ?? 'another tab' }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Writer ownership could not be established.',
    }
  }
}

export function releaseBrowserWriter(storage: StorageLike, tabId: string): void {
  try {
    if (readLease(storage)?.tabId === tabId) storage.removeItem(WRITER_STORAGE_KEY)
  } catch {
    // A failed release is harmless: the next explicit takeover replaces the lease.
  }
}
