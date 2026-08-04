import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'

import { armMapTextDiscard } from '../src/App'

describe('map text discard arming', () => {
  it('does not arm the discard flag when no editor is open', () => {
    // selectClient/handleNew/undo all call closeMapTextEditor(true) blindly;
    // arming there swallows the next real commit (the vanishing-note bug).
    expect(armMapTextDiscard(true, false)).toBe(false)
  })

  it('still arms a deliberate discard while an editor is open', () => {
    expect(armMapTextDiscard(true, true)).toBe(true)
  })

  it('never arms a plain close', () => {
    expect(armMapTextDiscard(false, true)).toBe(false)
    expect(armMapTextDiscard(false, false)).toBe(false)
  })

  it('routes every closeMapTextEditor caller through the guard', () => {
    expect(appSource).toMatch(
      /closeMapTextEditor = useCallback\(\(discard = false\) => \{\s*if \(armMapTextDiscard\(discard, mapTextEdit !== null\)\)/,
    )
  })
})
