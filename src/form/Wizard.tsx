import { useEffect, useRef } from 'react'
import type { MapElementTarget } from '../render/MapSvg'
import {
  AccountsSection,
  ClientSection,
  IncomeSection,
  NeedSection,
  NotesSection,
  handleFormKeyDown,
  type FormProps,
} from './Form'

export const WIZARD_STEPS = [
  {
    id: 'client',
    label: 'Client',
    title: 'Who is this map for?',
    mapTargets: [],
  },
  {
    id: 'income',
    label: 'Income',
    title: 'What income comes in?',
    mapTargets: ['income'],
  },
  {
    id: 'accounts',
    label: 'Accounts',
    title: 'What accounts hold the money?',
    mapTargets: ['account'],
  },
  {
    id: 'need',
    label: 'Need',
    title: 'How much is needed each month?',
    mapTargets: ['need'],
  },
  {
    id: 'notes',
    label: 'Notes',
    title: 'Notes',
    mapTargets: [],
  },
] as const

export function wizardStepNumberForMapTarget(
  target: MapElementTarget['kind'],
) {
  const index = WIZARD_STEPS.findIndex((step) =>
    step.mapTargets.some((mapTarget) => mapTarget === target),
  )
  return index === -1 ? null : index + 1
}

interface WizardProgressProps {
  currentStep: number
  onCurrentStepChange(step: number): void
  onDoneChange(done: boolean): void
}

export function WizardProgress({
  currentStep,
  onCurrentStepChange,
  onDoneChange,
}: WizardProgressProps) {
  return (
    <div className="wizard-progress" aria-label="Setup progress">
      {WIZARD_STEPS.map((item, index) => (
        <button
          aria-current={index === currentStep ? 'step' : undefined}
          aria-label={
            index < currentStep ? `${item.label}, completed` : item.label
          }
          className={
            index < currentStep
              ? 'wizard-step-button is-done'
              : index === currentStep
                ? 'wizard-step-button is-current'
                : 'wizard-step-button'
          }
          key={item.id}
          type="button"
          onClick={() => {
            onCurrentStepChange(index)
            onDoneChange(false)
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

interface WizardProps extends FormProps {
  currentStep: number
  done: boolean
  hasWarnings?: boolean
  onCurrentStepChange(step: number): void
  onDoneChange(done: boolean): void
  onExportPng(): void
  onFullForm(): void
  onPrint(): void
}

export function Wizard({
  currentStep,
  data,
  done,
  hasWarnings = false,
  focusRequest,
  onChange,
  onCurrentStepChange,
  onDoneChange,
  onExportPng,
  onFullForm,
  onHoverAccount,
  selectedAccountId,
  onSelectAccount,
  onPrint,
  vocabulary,
}: WizardProps) {
  const step = WIZARD_STEPS[currentStep] ?? WIZARD_STEPS[0]
  const printButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (done) {
      printButtonRef.current?.focus()
    }
  }, [done])

  const renderStep = () => {
    switch (step.id) {
      case 'client':
        return <ClientSection data={data} onChange={onChange} />
      case 'income':
        return (
          <IncomeSection
            data={data}
            includeNeed={false}
            onChange={onChange}
            vocabulary={vocabulary}
          />
        )
      case 'need':
        return <NeedSection data={data} onChange={onChange} />
      case 'accounts':
        return (
          <AccountsSection
            data={data}
            focusRequest={focusRequest}
            onChange={onChange}
            onHoverAccount={onHoverAccount}
            selectedAccountId={selectedAccountId}
            onSelectAccount={onSelectAccount}
            presetLabel="Tap to add:"
            vocabulary={vocabulary}
          />
        )
      case 'notes':
        return <NotesSection data={data} onChange={onChange} />
    }
  }

  if (done) {
    return (
      <div className="wizard wizard-done" aria-live="polite">
        <header className="wizard-header">
          <p className="wizard-step-count">
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </p>
          <WizardProgress
            currentStep={currentStep}
            onCurrentStepChange={onCurrentStepChange}
            onDoneChange={onDoneChange}
          />
        </header>
        <div className="wizard-done-content">
          <h1>{hasWarnings ? 'Review the map before sharing.' : 'The map is ready.'}</h1>
          <div className="wizard-done-primary">
            <button
              className="primary-button"
              ref={printButtonRef}
              type="button"
              onClick={onPrint}
            >
              Print
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={onExportPng}
            >
              Export PNG
            </button>
          </div>
          <div className="wizard-done-secondary">
            <button
              className="quiet-button"
              type="button"
              onClick={onFullForm}
            >
              Review all details
            </button>
            <button
              className="text-button wizard-start-over"
              type="button"
              onClick={() => {
                onCurrentStepChange(0)
                onDoneChange(false)
              }}
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      className="client-form wizard"
      onKeyDown={handleFormKeyDown}
      onSubmit={(event) => event.preventDefault()}
    >
      <header className="wizard-header">
        <p className="wizard-step-count">
          Step {currentStep + 1} of {WIZARD_STEPS.length}
        </p>
        <h1>{step.title}</h1>
        <WizardProgress
          currentStep={currentStep}
          onCurrentStepChange={onCurrentStepChange}
          onDoneChange={onDoneChange}
        />
      </header>
      <div className="wizard-step-content" key={step.id}>
        {renderStep()}
      </div>
      <footer className="wizard-footer">
        {currentStep > 0 && (
          <button
            className="wizard-back"
            type="button"
            onClick={() => onCurrentStepChange(currentStep - 1)}
          >
            Back
          </button>
        )}
        <button
          className="primary-button wizard-next"
          type="button"
          onClick={() => {
            if (currentStep === WIZARD_STEPS.length - 1) {
              onDoneChange(true)
              return
            }
            onCurrentStepChange(currentStep + 1)
          }}
        >
          {currentStep === WIZARD_STEPS.length - 1 ? 'Finish' : 'Next'}
        </button>
      </footer>
    </form>
  )
}
