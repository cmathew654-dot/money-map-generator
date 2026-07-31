import { describe, expect, it } from 'vitest'
import { resolveDataMode } from '../src/model/browserStore'

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
