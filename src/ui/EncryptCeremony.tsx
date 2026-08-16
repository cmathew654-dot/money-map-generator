import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * The one-time payoff when a book is first sealed to a file.
 *
 * It renders the *real* ciphertext from the envelope that was just written —
 * not a decorative stand-in — wiping down over the map, then clearing to a
 * confirmation line. The motion conveys a state change (readable -> sealed)
 * rather than celebrating one.
 */

/**
 * Enough characters to cover a large display. The block wraps in CSS rather
 * than being split here, so it fills whatever width it is given.
 */
const FILL_LENGTH = 14_000

/** Pull the base64 payload out of the envelope for display. */
function ciphertextBody(envelope: string): string {
  try {
    const parsed = JSON.parse(envelope) as { ct?: unknown }
    return typeof parsed.ct === 'string' ? parsed.ct : envelope
  } catch {
    return envelope
  }
}

/** Short books repeat rather than leaving the panel half empty. */
function toFill(payload: string): string {
  if (!payload) return ''
  let filled = payload
  while (filled.length < FILL_LENGTH) filled += payload
  return filled.slice(0, FILL_LENGTH)
}

interface EncryptCeremonyProps {
  /** The envelope string that was just written to disk. */
  envelope: string
  /** File the book was sealed to, e.g. "money-map-book.json". */
  fileName: string
  onDone: () => void
}

export function EncryptCeremony({ envelope, fileName, onDone }: EncryptCeremonyProps) {
  const [phase, setPhase] = useState<'sealing' | 'sealed' | 'clearing'>('sealing')
  const fill = useMemo(() => toFill(ciphertextBody(envelope)), [envelope])
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const sealedAt = reduced ? 0 : 640
    const clearAt = sealedAt + (reduced ? 900 : 1100)
    const doneAt = clearAt + (reduced ? 0 : 320)

    const timers = [
      window.setTimeout(() => setPhase('sealed'), sealedAt),
      window.setTimeout(() => setPhase('clearing'), clearAt),
      window.setTimeout(() => doneRef.current(), doneAt),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [envelope])

  return (
    <div className={`encrypt-ceremony is-${phase}`} aria-hidden="true">
      <pre className="encrypt-ceremony-cipher">{fill}</pre>
      <p className="encrypt-ceremony-caption">
        <span className="encrypt-ceremony-mark" />
        Encrypted to {fileName}
      </p>
    </div>
  )
}

/**
 * The announcement is separate from the visual so assistive technology gets
 * one clean message instead of narrating an animation.
 */
export function EncryptAnnouncement({ fileName }: { fileName: string }) {
  return (
    <p role="status" aria-live="polite" className="visually-hidden">
      Book encrypted with AES-256 and saved to {fileName}.
    </p>
  )
}
