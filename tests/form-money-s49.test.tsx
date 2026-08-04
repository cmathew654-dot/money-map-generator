import { describe, expect, it } from 'vitest'
import { formatMoneyDraft } from '../src/form/Form'
import { parseMoneyInput } from '../src/model/format'

/** caret marked with "|" for readability: "1,2|34" */
function at(marked: string) {
  return { text: marked.replace('|', ''), caret: marked.indexOf('|') }
}
function mark({ text, caret }: { text: string; caret: number }) {
  return text.slice(0, caret) + '|' + text.slice(caret)
}
function format(marked: string) {
  const { text, caret } = at(marked)
  return mark(formatMoneyDraft(text, caret))
}

describe('formatMoneyDraft', () => {
  it('groups digits as they are typed at the end', () => {
    expect(format('1234567|')).toBe('1,234,567|')
  })

  it('keeps the caret put when inserting mid-value', () => {
    // typed "9" after the leading 1 of "1,234"
    expect(format('19|234')).toBe('19|,234')
  })

  it('keeps the caret put when deleting a digit next to a comma', () => {
    // backspaced the "2" out of "1,234"
    expect(format('1,|34')).toBe('1|34')
  })

  it('drops leading zeros and clamps the caret', () => {
    expect(format('0001234|')).toBe('1,234|')
  })

  it('leaves an empty draft alone', () => {
    expect(format('|')).toBe('|')
  })

  it('keeps a partial decimal typable', () => {
    expect(format('1234.|')).toBe('1,234.|')
    expect(format('1234.50|')).toBe('1,234.50|')
  })

  it('regroups a pasted messy value', () => {
    expect(format('$1,2,3,4,5,6|')).toBe('$123,456|')
  })

  it('leaves shorthand and other non-plain drafts untouched', () => {
    expect(format('1.5m|')).toBe('1.5m|')
    expect(format('abc|')).toBe('abc|')
  })

  it('produces text parseMoneyInput still reads', () => {
    const { text } = formatMoneyDraft('1234567', 7)
    expect(parseMoneyInput(text)).toBe(1_234_567)
  })
})
