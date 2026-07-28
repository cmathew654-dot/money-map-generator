import { Children, type ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import {
  WIZARD_STEPS,
  WizardProgress,
  wizardStepNumberForMapTarget,
} from '../src/form/Wizard'

describe('WIZARD_STEPS', () => {
  it('defines the five guided categories in order', () => {
    expect(WIZARD_STEPS).toHaveLength(5)
    expect(WIZARD_STEPS.map((step) => step.id)).toEqual([
      'client',
      'income',
      'accounts',
      'need',
      'notes',
    ])
  })

  it.each([
    ['account', 3],
    ['income', 2],
    ['need', 4],
  ] as const)('maps %s clicks to step %i', (target, stepNumber) => {
    expect(wizardStepNumberForMapTarget(target)).toBe(stepNumber)
  })

  it('renders labeled step buttons and marks the current step', () => {
    const progress = WizardProgress({
      currentStep: 2,
      onCurrentStepChange: () => undefined,
      onDoneChange: () => undefined,
    })
    const buttons = Children.toArray(progress.props.children) as ReactElement<{
      'aria-current'?: string
      children: string
    }>[]

    expect(buttons.map((button) => button.props.children)).toEqual([
      'Client',
      'Income',
      'Accounts',
      'Need',
      'Notes',
    ])
    expect(
      buttons.map((button) => button.props['aria-current']),
    ).toEqual([undefined, undefined, 'step', undefined, undefined])
  })

  it('jumps to a clicked step and exits the done panel', () => {
    const stepChanges: number[] = []
    const doneChanges: boolean[] = []
    const progress = WizardProgress({
      currentStep: 4,
      onCurrentStepChange: (step) => stepChanges.push(step),
      onDoneChange: (done) => doneChanges.push(done),
    })
    const buttons = Children.toArray(progress.props.children) as ReactElement<{
      onClick(): void
    }>[]

    buttons[1].props.onClick()

    expect(stepChanges).toEqual([1])
    expect(doneChanges).toEqual([false])
  })
})
