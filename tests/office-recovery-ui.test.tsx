import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { describe, expect, it, vi } from 'vitest'
import { RecoveryCodeDialog } from '../src/ui/RecoveryCodeDialog'

const CODE = 'K4M2X-9PQR7-L8N3V-T6W5Y-J2H9C-R4D7F-B8S6A-Q3Z1E'
const OFFICE_INTRO =
  "Store this code somewhere secure before continuing — it's the only way back into every client book in this office."

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

function officeDialog(acknowledged = false, onConfirm = vi.fn(), onAcknowledgedChange = vi.fn()) {
  return {
    onConfirm,
    onAcknowledgedChange,
    tree: RecoveryCodeDialog({
      acknowledged,
      code: CODE,
      fileName: 'This office',
      scopeLabel: 'Office',
      introText: OFFICE_INTRO,
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

describe('office recovery code dialog', () => {
  it('labels the details list scope as the office, and leaves the date row alone', () => {
    const { tree } = officeDialog()

    const scopeRow = findElement(tree, (element) => element.type === 'dt')
    expect(scopeRow?.props.children).toBe('Office')

    const dateRow = findElement(
      tree,
      (element) => element.type === 'dt' && element.props.children === 'Date',
    )
    expect(dateRow).toBeDefined()
  })

  it('keeps confirmation disabled until acknowledged, in office scope', () => {
    expect(namedControl(officeDialog(false).tree, 'recovery-confirm').props.disabled).toBe(true)
    expect(namedControl(officeDialog(true).tree, 'recovery-confirm').props.disabled).toBe(false)
  })

  it('confirms once acknowledged, in office scope', () => {
    const { tree, onConfirm } = officeDialog(true)
    const confirm = namedControl(tree, 'recovery-confirm')

    ;(confirm.props.onClick as () => void)()

    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('reports the acknowledgement to its parent, in office scope', () => {
    const { tree, onAcknowledgedChange } = officeDialog(false)
    const checkbox = namedControl(tree, 'recovery-acknowledgement')
    const onChange = checkbox.props.onChange as (event: {
      currentTarget: { checked: boolean }
    }) => void

    onChange({ currentTarget: { checked: true } })

    expect(onAcknowledgedChange).toHaveBeenCalledWith(true)
  })

  it('prevents Escape from dismissing the office dialog', () => {
    const { tree, onConfirm } = officeDialog()
    const nativeDialog = findElement(tree, (element) => element.type === 'dialog')
    const preventDefault = vi.fn()

    const onCancel = nativeDialog?.props.onCancel as (event: {
      preventDefault(): void
    }) => void
    onCancel({ preventDefault })

    expect(preventDefault).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('describes the code as covering the whole office, not one client book', () => {
    const { tree } = officeDialog()
    const intro = findElement(tree, (element) => element.props.id === 'recovery-dialog-intro')

    expect(intro?.props.children).toBe(OFFICE_INTRO)
    expect(intro?.props.children).toMatch(/office/i)
  })
})
