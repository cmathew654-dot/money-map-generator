import { describe, expect, it } from 'vitest'
import {
  WIZARD_STEPS,
  wizardStepNumberForMapTarget,
} from '../src/form/Wizard'

describe('WIZARD_STEPS', () => {
  it('defines the five guided categories in order', () => {
    expect(WIZARD_STEPS).toHaveLength(5)
    expect(WIZARD_STEPS.map((step) => step.id)).toEqual([
      'client',
      'income',
      'need',
      'accounts',
      'footnotes',
    ])
  })

  it.each([
    ['account', 4],
    ['income', 2],
    ['need', 3],
  ] as const)('maps %s clicks to step %i', (target, stepNumber) => {
    expect(wizardStepNumberForMapTarget(target)).toBe(stepNumber)
  })
})
