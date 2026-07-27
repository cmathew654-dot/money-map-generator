import { describe, expect, it } from 'vitest'
import {
  HISTORY_LIMIT,
  emptyHistory,
  pushHistory,
  redoHistory,
  undoHistory,
  type BookSnapshot,
} from '../src/model/book'
import type { MoneyMapFile } from '../src/model/types'

function snapshot(label: string, client = label): BookSnapshot {
  return {
    book: { label } as unknown as MoneyMapFile,
    activeClientId: client,
  }
}

describe('book history', () => {
  it('pushes and coalesces same-client commits through 800ms', () => {
    const before = snapshot('before', 'a')
    const middle = snapshot('middle', 'a')
    const after = snapshot('after', 'a')
    const first = pushHistory(emptyHistory(), before, middle, 'a', 100)
    const second = pushHistory(first, middle, after, 'a', 900)

    expect(second).toEqual({
      past: [{
        before,
        after,
        targetClientId: 'a',
        committedAt: 900,
      }],
      future: [],
    })
  })

  it('keeps separate steps outside the coalescing contract', () => {
    const before = snapshot('before', 'a')
    const middle = snapshot('middle', 'a')
    const after = snapshot('after', 'b')
    const first = pushHistory(emptyHistory(), before, middle, 'a', 100)

    expect(pushHistory(first, middle, after, 'b', 200).past).toHaveLength(2)
    expect(pushHistory(first, middle, after, 'a', 901).past).toHaveLength(2)
    expect(
      pushHistory(first, snapshot('unrelated', 'a'), after, 'a', 200).past,
    ).toHaveLength(2)
    const bookWide = pushHistory(emptyHistory(), before, middle, null, 100)
    expect(pushHistory(bookWide, middle, after, null, 200).past).toHaveLength(2)
  })

  it('undoes and redoes both book and active client', () => {
    const before = snapshot('before', 'a')
    const after = snapshot('after', 'b')
    const pushed = pushHistory(emptyHistory(), before, after, 'b', 100)
    const undone = undoHistory(pushed)
    const redone = redoHistory(undone.history)

    expect(undone.snapshot).toBe(before)
    expect(undone.history.past).toEqual([])
    expect(undone.history.future).toHaveLength(1)
    expect(redone.snapshot).toBe(after)
    expect(redone.history.past).toHaveLength(1)
    expect(redone.history.future).toEqual([])
  })

  it('clears redo when a new edit follows undo', () => {
    const one = snapshot('one', 'a')
    const two = snapshot('two', 'a')
    const three = snapshot('three', 'a')
    const pushed = pushHistory(emptyHistory(), one, two, 'a', 100)
    const undone = undoHistory(pushed)
    const edited = pushHistory(undone.history, one, three, 'a', 200)

    expect(edited.future).toEqual([])
    expect(redoHistory(edited).snapshot).toBeNull()
  })

  it('bounds undo at 50 entries and drops the oldest', () => {
    let history = emptyHistory()
    let before = snapshot('state-0')
    for (let index = 1; index <= HISTORY_LIMIT + 1; index += 1) {
      const after = snapshot(`state-${index}`)
      history = pushHistory(
        history,
        before,
        after,
        `client-${index}`,
        index,
      )
      before = after
    }

    expect(history.past).toHaveLength(HISTORY_LIMIT)
    expect(history.past[0].before.book).toEqual({ label: 'state-1' })
    expect(history.past.at(-1)?.after.book).toEqual({
      label: `state-${HISTORY_LIMIT + 1}`,
    })
  })

  it('leaves empty history unchanged when no direction is available', () => {
    const history = emptyHistory()
    expect(undoHistory(history)).toEqual({ history, snapshot: null })
    expect(redoHistory(history)).toEqual({ history, snapshot: null })
  })
})
