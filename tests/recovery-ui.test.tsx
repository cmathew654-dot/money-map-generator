import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RecoveryCodeDialog } from '../src/ui/RecoveryCodeDialog'

const CODE = 'K4M2X-9PQR7-L8N3V-T6W5Y-J2H9C-R4D7F-B8S6A-Q3Z1E'
const FILE_NAME = 'Morgan-family.moneymap'

type TestElement = ReactElement<{
  children?: ReactNode
  [name: string]: unknown
}>

function findElement(
  node: ReactNode,
  predicate: (element: TestElement) => boolean,
): TestElement | undefined {
  if (!isValidElement(node)) return undefined
  const element = node as TestElement
  if (predicate(element)) return element
  for (const child of Children.toArray(element.props.children)) {
    const match = findElement(child, predicate)
    if (match) return match
  }
  return undefined
}

function dialog(onConfirm = vi.fn()) {
  return {
    onConfirm,
    tree: RecoveryCodeDialog({ code: CODE, fileName: FILE_NAME, onConfirm }),
  }
}

function namedControl(tree: ReactNode, name: string) {
  const control = findElement(tree, (element) => element.props.name === name)
  if (!control) throw new Error(`Missing recovery control: ${name}`)
  return control
}

function formControls(acknowledged = false) {
  const controls: Record<string, unknown> = {}
  const form = {
    elements: { namedItem: (name: string) => controls[name] ?? null },
  } as unknown as HTMLFormElement
  const acknowledgement = { checked: acknowledged, form } as HTMLInputElement
  const confirmation = { disabled: true, form } as HTMLButtonElement
  controls['recovery-acknowledgement'] = acknowledgement
  controls['recovery-confirm'] = confirmation
  return { acknowledgement, confirmation }
}

function buttonWithStatus() {
  const status = { textContent: '' }
  const currentTarget = {
    closest: () => ({ querySelector: () => status }),
  } as unknown as HTMLButtonElement
  return { currentTarget, status }
}

afterEach(() => vi.unstubAllGlobals())

describe('recovery code dialog', () => {
  it('renders the recovery code on screen', () => {
    const markup = renderToStaticMarkup(
      createElement(RecoveryCodeDialog, {
        code: CODE,
        fileName: FILE_NAME,
        onConfirm: () => undefined,
      }),
    )

    expect(markup).toContain(CODE)
  })

  it('keeps confirmation disabled until the acknowledgement is ticked', () => {
    const { tree } = dialog()
    const checkbox = namedControl(tree, 'recovery-acknowledgement')
    const confirm = namedControl(tree, 'recovery-confirm')
    const controls = formControls()
    controls.confirmation.disabled = confirm.props.disabled === true

    expect(controls.confirmation.disabled).toBe(true)

    const onChange = checkbox.props.onChange as (event: {
      currentTarget: HTMLInputElement
    }) => void
    controls.acknowledgement.checked = true
    onChange({ currentTarget: controls.acknowledgement })

    expect(controls.confirmation.disabled).toBe(false)
  })

  it('fires onConfirm only after acknowledgement', () => {
    const { tree, onConfirm } = dialog()
    const confirm = namedControl(tree, 'recovery-confirm')
    const controls = formControls()
    const onClick = confirm.props.onClick as (event: {
      currentTarget: HTMLButtonElement
    }) => void

    onClick({ currentTarget: controls.confirmation })
    expect(onConfirm).not.toHaveBeenCalled()

    controls.acknowledgement.checked = true
    onClick({ currentTarget: controls.confirmation })
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('prevents Escape from dismissing the dialog', () => {
    const { tree, onConfirm } = dialog()
    const nativeDialog = findElement(tree, (element) => element.type === 'dialog')
    const preventDefault = vi.fn()

    const onCancel = nativeDialog?.props.onCancel as (event: {
      preventDefault(): void
    }) => void
    onCancel({ preventDefault })

    expect(preventDefault).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('copies the exact recovery code and confirms it visibly', async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue()
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const { tree } = dialog()
    const copy = namedControl(tree, 'recovery-copy')
    const { currentTarget, status } = buttonWithStatus()
    const onClick = copy.props.onClick as (event: {
      currentTarget: HTMLButtonElement
    }) => Promise<void>

    const event = { currentTarget } as { currentTarget: HTMLButtonElement | null }
    const copying = onClick(event as { currentTarget: HTMLButtonElement })
    event.currentTarget = null
    await copying

    expect(writeText).toHaveBeenCalledWith(CODE)
    expect(status.textContent).toMatch(/copied/i)
  })
})
