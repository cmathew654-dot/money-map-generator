import type { StorageLike } from './browserStore'

export const PROTECTION_ENABLED_KEY = 'money-map-generator:protection-enabled:v1'

/**
 * Plain is the default: a never-set key, an unreadable storage, or any
 * unrecognized stored value all fail safe to "off" rather than silently
 * turning on a ceremony the advisor never asked for.
 */
export function protectionEnabled(storage: StorageLike = localStorage): boolean {
  try {
    return storage.getItem(PROTECTION_ENABLED_KEY) === 'on'
  } catch {
    return false
  }
}

export function setProtectionEnabled(
  enabled: boolean,
  storage: StorageLike = localStorage,
): void {
  try {
    storage.setItem(PROTECTION_ENABLED_KEY, enabled ? 'on' : 'off')
  } catch {
    // Best-effort; a failed write leaves the previous preference in place.
  }
}
