/* Logo option 2d, "Hard offset" (Money Map logo options, 2026-08-10):
   green tile, hard ink offset, serif M. Drawn in a 26-unit box so the
   glyph's 24px tile carries an exact 2px shadow at the header's 26px
   render size — the 1/12 offset ratio of the source mark, pixel-snapped. */
export function Mark() {
  return (
    <svg
      aria-hidden="true"
      className="wordmark-glyph"
      viewBox="0 0 26 26"
    >
      <rect fill="#16211d" height="24" width="24" x="2" y="2" />
      <rect fill="#0c7a4e" height="24" width="24" x="0" y="0" />
      <text
        dominantBaseline="central"
        fill="#fcfcfa"
        fontFamily="Literata, Georgia, serif"
        fontSize="13.5"
        fontWeight="600"
        textAnchor="middle"
        x="12"
        y="12"
      >
        M
      </text>
    </svg>
  )
}
