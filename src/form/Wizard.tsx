import type { MapElementTarget } from '../render/MapSvg'
import {
  AccountsSection,
  ClientSection,
  FootnotesSection,
  IncomeSection,
  NeedSection,
  handleFormKeyDown,
  type FormProps,
} from './Form'

export const WIZARD_STEPS = [
  {
    id: 'client',
    title: 'Who is this map for?',
    mapTargets: [],
  },
  {
    id: 'income',
    title: 'What income comes in?',
    mapTargets: ['income'],
  },
  {
    id: 'need',
    title: 'What does the month need to cover?',
    mapTargets: ['need'],
  },
  {
    id: 'accounts',
    title: 'What accounts hold the money?',
    mapTargets: ['account'],
  },
  {
    id: 'footnotes',
    title: 'Footnotes (optional)',
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

interface WizardProps extends FormProps {
  currentStep: number
  done: boolean
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
  focusRequest,
  onChange,
  onCurrentStepChange,
  onDoneChange,
  onExportPng,
  onFullForm,
  onHoverAccount,
  onPrint,
}: WizardProps) {
  const step = WIZARD_STEPS[currentStep] ?? WIZARD_STEPS[0]

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
            presetLabel="Tap to add:"
          />
        )
      case 'footnotes':
        return (
          <>
            <p className="wizard-subtitle">
              Skip this unless the plan states required distributions.
            </p>
            <FootnotesSection data={data} onChange={onChange} />
          </>
        )
    }
  }

  if (done) {
    return (
      <div className="wizard wizard-done" aria-live="polite">
        <h1>The map is ready.</h1>
        <div className="wizard-done-actions">
          <button type="button" onClick={onPrint}>
            Print
          </button>
          <button type="button" onClick={onExportPng}>
            Export PNG
          </button>
          <button type="button" onClick={onFullForm}>
            Fine-tune in full form
          </button>
        </div>
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
        <div className="wizard-progress" aria-label="Wizard progress">
          {WIZARD_STEPS.map((item, index) => (
            <span
              aria-label={
                index < currentStep
                  ? `${item.title}: done`
                  : index === currentStep
                    ? `${item.title}: current`
                    : item.title
              }
              className={
                index < currentStep
                  ? 'wizard-dot is-done'
                  : index === currentStep
                    ? 'wizard-dot is-current'
                    : 'wizard-dot'
              }
              key={item.id}
            />
          ))}
        </div>
      </header>
      <div className="wizard-step-content">{renderStep()}</div>
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
          className="wizard-next"
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
