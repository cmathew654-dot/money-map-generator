import { parseBook } from './book'
import type { MoneyMapFile } from './types'

const DATABASE_NAME = 'money-map-filestore'
const HANDLE_STORE = 'handles'
const BOOK_HANDLE_KEY = 'book'

interface WritableBookFile {
  write(data: string): Promise<void>
  close(): Promise<void>
}

export interface BookFileHandle {
  readonly kind: 'file'
  readonly name: string
  getFile(): Promise<File>
  createWritable(): Promise<WritableBookFile>
  queryPermission(descriptor: { mode: 'readwrite' }): Promise<PermissionState>
  requestPermission(descriptor: { mode: 'readwrite' }): Promise<PermissionState>
}

interface PickerOptions {
  types: {
    description: string
    accept: Record<string, string[]>
  }[]
}

export interface FileStoreApi {
  showSaveFilePicker?: (
    options: PickerOptions & { suggestedName: string },
  ) => Promise<BookFileHandle>
  showOpenFilePicker?: (
    options: PickerOptions & { multiple: false },
  ) => Promise<BookFileHandle[]>
}

export type FileReadResult =
  | { status: 'success'; book: MoneyMapFile }
  | { status: 'failure'; error: unknown }

const JSON_FILE_TYPE = {
  description: 'Money Map book',
  accept: { 'application/json': ['.json'] },
}

export function supportsFileStore(api: FileStoreApi): boolean {
  return (
    typeof api.showSaveFilePicker === 'function' &&
    typeof api.showOpenFilePicker === 'function'
  )
}

export function resolveFileConnection(
  localBook: MoneyMapFile,
  fileResult: FileReadResult,
): { book: MoneyMapFile; connected: boolean; error?: unknown } {
  return fileResult.status === 'success'
    ? { book: fileResult.book, connected: true }
    : { book: localBook, connected: false, error: fileResult.error }
}

function browserFileStoreApi(): FileStoreApi {
  return window as unknown as FileStoreApi
}

export async function chooseNewBookFile(): Promise<BookFileHandle> {
  const api = browserFileStoreApi()
  if (!api.showSaveFilePicker) {
    throw new Error('Saving to a connected file is not supported.')
  }
  return api.showSaveFilePicker({
    suggestedName: 'money-map-book.json',
    types: [JSON_FILE_TYPE],
  })
}

export async function chooseExistingBookFile(): Promise<BookFileHandle> {
  const api = browserFileStoreApi()
  if (!api.showOpenFilePicker) {
    throw new Error('Opening a connected file is not supported.')
  }
  const [handle] = await api.showOpenFilePicker({
    multiple: false,
    types: [JSON_FILE_TYPE],
  })
  if (!handle) throw new Error('No book file was selected.')
  return handle
}

export async function readBookFile(
  handle: BookFileHandle,
): Promise<MoneyMapFile> {
  return parseBook(await (await handle.getFile()).text())
}

export async function writeBookFile(
  handle: BookFileHandle,
  book: MoneyMapFile,
): Promise<void> {
  const writable = await handle.createWritable()
  try {
    await writable.write(JSON.stringify(book, null, 2))
  } finally {
    await writable.close()
  }
}

export async function requestBookFilePermission(
  handle: BookFileHandle,
): Promise<boolean> {
  const descriptor = { mode: 'readwrite' } as const
  return (
    (await handle.queryPermission(descriptor)) === 'granted' ||
    (await handle.requestPermission(descriptor)) === 'granted'
  )
}

function openHandleDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(HANDLE_STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('Could not open file storage.'))
  })
}

async function useHandleStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openHandleDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(HANDLE_STORE, mode)
      const request = operation(transaction.objectStore(HANDLE_STORE))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onerror = () =>
        reject(transaction.error ?? new Error('Could not update file storage.'))
    })
  } finally {
    database.close()
  }
}

export async function getStoredBookFileHandle():
Promise<BookFileHandle | null> {
  const handle = await useHandleStore(
    'readonly',
    (store) => store.get(BOOK_HANDLE_KEY),
  )
  return (handle as BookFileHandle | undefined) ?? null
}

export async function storeBookFileHandle(
  handle: BookFileHandle,
): Promise<void> {
  await useHandleStore('readwrite', (store) =>
    store.put(handle, BOOK_HANDLE_KEY))
}

export async function clearStoredBookFileHandle(): Promise<void> {
  await useHandleStore('readwrite', (store) =>
    store.delete(BOOK_HANDLE_KEY))
}
