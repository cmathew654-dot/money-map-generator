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

function dialog(acknowledged = false, onConfirm = vi.fn(), onAcknowledgedChange = vi.fn()) {
  return {
    onConfirm,
    onAcknowledgedChange,
    tree: RecoveryCodeDialog({
      acknowledged,
      code: CODE,
      fileName: FILE_NAME,
      onAcknowledgedChange,
      onConfirm,
    }),
  }
}

function namedControl(tree: ReactNode, name: string) {
  const control = findElement(tree, (element) => element.props.name === name)
  if (!control) throw new Error(`Missing recovery control: ${name}`)
  return control
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
        acknowledged: false,
        code: CODE,
        fileName: FILE_NAME,
        onAcknowledgedChange: () => undefined,
        onConfirm: () => undefined,
      }),
    )

    expect(markup).toContain(CODE)
  })

  it('keeps confirmation disabled until the acknowledgement is ticked', () => {
    expect(namedControl(dialog(false).tree, 'recovery-confirm').props.disabled).toBe(true)
    expect(namedControl(dialog(true).tree, 'recovery-confirm').props.disabled).toBe(false)
  })

  it('reports the acknowledgement to its parent', () => {
    const { tree, onAcknowledgedChange } = dialog(false)
    const checkbox = namedControl(tree, 'recovery-acknowledgement')
    const onChange = checkbox.props.onChange as (event: {
      currentTarget: { checked: boolean }
    }) => void

    onChange({ currentTarget: { checked: true } })

    expect(onAcknowledgedChange).toHaveBeenCalledWith(true)
  })

  /*
   * The earlier version of this test drove a hand-built fake of
   * form.elements.namedItem, so it verified the mechanism rather than the
   * behaviour and passed while the real button did nothing at all. Assert what
   * an advisor can actually do: the button is disabled until acknowledged, and
   * once enabled it confirms directly.
   */
  it('confirms directly once acknowledged, and cannot be clicked before', () => {
    const before = namedControl(dialog(false).tree, 'recovery-confirm')
    expect(before.props.disabled).toBe(true)

    const { tree, onConfirm } = dialog(true)
    const confirm = namedControl(tree, 'recovery-confirm')
    expect(confirm.props.disabled).toBe(false)

    ;(confirm.props.onClick as () => void)()
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
