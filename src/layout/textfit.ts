const SAFETY_FACTOR = 1.08

function characterWidth(character: string): number {
  if (character === ' ') return 0.34
  if ("iljtf.,'|`!:;".includes(character)) return 0.34
  if ('MWm@%&'.includes(character)) return 0.96
  if (/[A-Z]/.test(character)) return 0.72
  if (/[0-9]/.test(character)) return 0.62
  if (/[()[\]{}\-–—/+=$]/.test(character)) return 0.48
  return 0.57
}

/** Conservative Literata width estimate, including tabular-width digits. */
export function textWidth(text: string, size: number): number {
  return (
    [...text].reduce(
      (width, character) => width + characterWidth(character),
      0,
    ) *
    size *
    SAFETY_FACTOR
  )
}

function hardBreakWord(
  word: string,
  maxWidth: number,
  size: number,
): string[] {
  const fragments: string[] = []
  let fragment = ''

  for (const character of word) {
    const candidate = `${fragment}${character}`
    if (fragment && textWidth(candidate, size) > maxWidth) {
      fragments.push(fragment)
      fragment = character
    } else {
      fragment = candidate
    }
  }

  if (fragment) fragments.push(fragment)
  return fragments
}

/** Greedy measured wrapping. Words wider than the row are split mid-word. */
export function fitLines(
  text: string,
  maxWidth: number,
  size: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  const lines: string[] = []
  let line = ''

  const pushWord = (word: string) => {
    const candidate = line ? `${line} ${word}` : word
    if (textWidth(candidate, size) <= maxWidth) {
      line = candidate
      return
    }

    if (line) {
      lines.push(line)
      line = ''
    }

    if (textWidth(word, size) <= maxWidth) {
      line = word
      return
    }

    const fragments = hardBreakWord(word, maxWidth, size)
    lines.push(...fragments.slice(0, -1))
    line = fragments.at(-1) ?? ''
  }

  words.forEach(pushWord)
  if (line) lines.push(line)
  return lines
}
