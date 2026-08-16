const DATABASE_NAME = 'money-map-generator'
const STORE_NAME = 'browser-data'
const KEY_NAME = 'encryption-key'

let cachedKey: Promise<CryptoKey> | null = null

function request<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function readBrowserDataKey(): Promise<CryptoKey> {
  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  const transaction = database.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  const existing = await request(store.get(KEY_NAME)) as CryptoKey | undefined
  if (existing) return existing
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  ) as CryptoKey
  await request(store.put(key, KEY_NAME))
  return key
}

/**
 * TODO(feat/aes-encryption): replace this IndexedDB key with the Windows Hello
 * unlock factor when the file-crypto branch is merged.
 */
export function getBrowserDataKey(): Promise<CryptoKey> {
  cachedKey ??= readBrowserDataKey().catch((error: unknown) => {
    cachedKey = null
    throw error
  })
  return cachedKey
}
