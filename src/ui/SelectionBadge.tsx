/**
 * Selected-count chip shown over the map canvas. Nothing selected, nothing rendered.
 */
export function SelectionBadge({ count }: { count: number }) {
  if (count < 1) return null
  return (
    <p aria-live="polite" className="selection-badge" role="status">
      {`${count} selected`}
      {count === 1 && (
        <span className="selection-badge-hint">{' — shift-click adds'}</span>
      )}
    </p>
  )
}
