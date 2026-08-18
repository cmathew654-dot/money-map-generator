/**
 * Per-machine persistence for the office KEK. No crypto here — derivation
 * lives in officeKey.ts. Structured-clones CryptoKey objects directly into
 * IndexedDB (same mechanism as browserDataKey.ts); never exports key bytes.
 */

const DATABASE_NAME = 'money-map-office-key'
const STORE_NAME = 'office-keks'
const POINTER_KEY = 'current-office-salt'

export interface CachedOfficeRecovery {
  saltBase64: string
  kek: CryptoKey
}

type StoreValue = CryptoKey | string | CachedOfficeRecovery

// vitest runs in Node, which has no indexedDB global and no fake-indexeddb
// dependency (RESEARCH.md). Fall back to an in-memory map so the model layer
// stays unit-testable; Task 3's Playwright spec proves the real IndexedDB path.
const memoryStore = new Map<string, StoreValue>()

function hasIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined'
}

function request<T>(idbRequest: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    idbRequest.onsuccess = () => resolve(idbRequest.result)
    idbRequest.onerror = () => reject(idbRequest.error)
  })
}

async function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DATABASE_NAME, 1)
    openRequest.onupgradeneeded = () => openRequest.result.createObjectStore(STORE_NAME)
    openRequest.onsuccess = () => resolve(openRequest.result)
    openRequest.onerror = () => reject(openRequest.error)
  })
}

async function readValue<T extends StoreValue>(key: string): Promise<T | null> {
  if (!hasIndexedDb()) return (memoryStore.get(key) as T | undefined) ?? null
  const database = await openDb()
  const store = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME)
  const existing = await request<T | undefined>(store.get(key))
  return existing ?? null
}

async function writeValue(key: string, value: StoreValue): Promise<void> {
  if (!hasIndexedDb()) {
    memoryStore.set(key, value)
    return
  }
  const database = await openDb()
  const store = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME)
  await request(store.put(value, key))
}

export async function readCachedOfficeKek(saltBase64: string): Promise<CryptoKey | null> {
  return readValue<CryptoKey>(saltBase64)
}

export async function cacheOfficeKek(saltBase64: string, kek: CryptoKey): Promise<void> {
  await writeValue(saltBase64, kek)
}

export async function readCurrentOfficeSalt(): Promise<string | null> {
  return readValue<string>(POINTER_KEY)
}

export async function setCurrentOfficeSalt(saltBase64: string): Promise<void> {
  await writeValue(POINTER_KEY, saltBase64)
}

export async function readCachedOfficeRecovery(
  officeSaltBase64: string,
): Promise<CachedOfficeRecovery | null> {
  return readValue<CachedOfficeRecovery>(`recovery:${officeSaltBase64}`)
}

export async function cacheOfficeRecovery(
  officeSaltBase64: string,
  recovery: CachedOfficeRecovery,
): Promise<void> {
  await writeValue(`recovery:${officeSaltBase64}`, recovery)
}
