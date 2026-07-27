import { useEffect } from 'react'

export interface ToastMessage {
  id: number
  message: string
}

interface ToastProps {
  messages: ToastMessage[]
  onDismiss(id: number): void
}

export function Toast({ messages, onDismiss }: ToastProps) {
  useEffect(() => {
    const timers = messages.map(({ id }) =>
      window.setTimeout(() => onDismiss(id), 3500),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [messages, onDismiss])

  return (
    <div
      aria-atomic="false"
      aria-live="polite"
      className="toast-region"
    >
      {messages.map((toast) => (
        <div className="toast" key={toast.id}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
