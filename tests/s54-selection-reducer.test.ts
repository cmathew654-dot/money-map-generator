import { describe, expect, it } from 'vitest'

import {
  EMPTY_SELECTION,
  selectionReducer,
  type SelectionEvent,
  type SelectionState,
} from '../src/render/selection'

const KEYS = [
  'account:a',
  'account:b',
  'note:n',
  'asNeededChip',
  'text:a:label',
]

/** PRIMARY events: the user positively acted, so the anchor may move. */
const PRIMARY: SelectionEvent[] = [
  ...[...KEYS, null].flatMap((key) =>
    [null, 'text:a:label'].flatMap((textKey) =>
      [true, false].map(
        (modified): SelectionEvent => ({
          type: 'canvas/click',
          key,
          textKey,
          modified,
        }),
      ),
    ),
  ),
  ...['a', 'b'].flatMap((accountId) =>
    [true, false].map(
      (modified): SelectionEvent => ({
        type: 'panel/rowClick',
        accountId,
        modified,
      }),
    ),
  ),
  { type: 'key/activate', key: 'account:a' },
  { type: 'clear', reason: 'escape' },
  { type: 'select', keys: ['account:a', 'asNeededChip'] },
  { type: 'select', keys: [] },
  // Keyboard-only (every sender is shouldFocusSelect-gated), so it is a
  // positive user act: primary, not an echo. Ruled 2026-08-05 — an existing
  // green spec pins Tab-to-select (s51-selection-context "keyboard focus
  // still reaches and selects a note").
  ...KEYS.map((key): SelectionEvent => ({ type: 'focus/reveal', key })),
]

/** SUBORDINATE + housekeeping: must be unobservable on a non-empty selection. */
const SUBORDINATE: SelectionEvent[] = [
  ...['a', 'b'].map(
    (accountId): SelectionEvent => ({ type: 'panel/rowFocus', accountId }),
  ),
  { type: 'prune', exists: () => true },
]

/** Every primary sequence up to length 2, exhaustively. */
function primarySequences(): SelectionEvent[][] {
  const sequences: SelectionEvent[][] = PRIMARY.map((event) => [event])
  for (const first of PRIMARY) {
    for (const second of PRIMARY) sequences.push([first, second])
  }
  return sequences
}

// Hand-rolled rather than `expect` per state: this runs ~25k times and the
// matcher overhead alone would push the case past a second.
function assertInvariants(state: SelectionState, where: string) {
  // I1 — the anchor is always part of the selection.
  if (state.anchor !== null && !state.keys.includes(state.anchor)) {
    throw new Error(`I1 ${where}: anchor ${state.anchor} not in [${state.keys}]`)
  }
  // I2 — no duplicates.
  if (new Set(state.keys).size !== state.keys.length) {
    throw new Error(`I2 ${where}: duplicate in [${state.keys}]`)
  }
  // I3 — empty selection <=> no anchor.
  if ((state.keys.length === 0) !== (state.anchor === null)) {
    throw new Error(`I3 ${where}: [${state.keys}] vs anchor ${state.anchor}`)
  }
}

const same = (a: SelectionState, b: SelectionState) =>
  a.anchor === b.anchor &&
  a.keys.length === b.keys.length &&
  a.keys.every((key, index) => key === b.keys[index])

/** Applies a sequence, checking the invariants at every intermediate state. */
function run(events: SelectionEvent[], label: string): SelectionState {
  let state = EMPTY_SELECTION
  assertInvariants(state, `${label} @0`)
  events.forEach((event, index) => {
    state = selectionReducer(state, event)
    assertInvariants(state, `${label} @${index + 1} after ${event.type}`)
  })
  return state
}

/**
 * The multi-writer defect, restated as a law.
 *
 * Selection used to be written by the map, by App commands, and by panel focus
 * echoes in the same DOM event, so every fix was a fix to the ordering between
 * them. The reducer splits the alphabet into PRIMARY (user acted) and
 * SUBORDINATE (an echo) events, and the whole guarantee is that a subordinate
 * event is *unobservable* once anything is selected.
 */
describe('s54 selection reducer', () => {
  it('is invariant under subordinate events on a non-empty selection', () => {
    let checked = 0
    for (const sequence of primarySequences()) {
      // The state after each prefix — a subordinate event may only be inserted
      // where the selection was non-empty; on an empty one it is ALLOWED to
      // select, which is how keyboard focus reaches the map at all.
      const trace: SelectionState[] = [EMPTY_SELECTION]
      let state = EMPTY_SELECTION
      for (const event of sequence) {
        state = selectionReducer(state, event)
        trace.push(state)
      }
      const expected = run(sequence, 'primaries')

      for (let at = 0; at < trace.length; at += 1) {
        if (trace[at].keys.length === 0) continue
        for (const echo of SUBORDINATE) {
          // I4 — reference identity, not deep equality. The App effect that
          // prunes dead keys has the selection in its deps; a fresh object
          // here would loop it forever.
          if (selectionReducer(trace[at], echo) !== trace[at]) {
            expect(selectionReducer(trace[at], echo)).toBe(trace[at])
          }
          const mixed = [...sequence]
          mixed.splice(at, 0, echo)
          const label = `echo ${echo.type} at ${at}`
          const actual = run(mixed, label)
          if (!same(actual, expected)) expect({ label, actual }).toEqual(expected)
          checked += 1
        }
      }
    }
    // Guards against the enumeration silently collapsing to nothing.
    expect(checked).toBeGreaterThan(1000)
  })

  it('anchors on the item the user last acted on, never on array position', () => {
    const clickA: SelectionEvent = {
      type: 'canvas/click',
      key: 'account:a',
      textKey: null,
      modified: false,
    }
    const addB: SelectionEvent = {
      type: 'canvas/click',
      key: 'account:b',
      textKey: null,
      modified: true,
    }
    const state = [clickA, addB].reduce(selectionReducer, EMPTY_SELECTION)
    expect(state).toEqual({ keys: ['account:a', 'account:b'], anchor: 'account:b' })

    // Toggling OFF a non-anchor item leaves the anchor where the user put it,
    // where `keys.at(-1)` used to slide it onto whatever remained last.
    const removeA = selectionReducer(state, { ...clickA, modified: true })
    expect(removeA).toEqual({ keys: ['account:b'], anchor: 'account:b' })
  })

  it('promotes account text only on a repeat plain click of its sole account', () => {
    const click: SelectionEvent = {
      type: 'canvas/click',
      key: 'account:a',
      textKey: 'text:a:label',
      modified: false,
    }
    const first = selectionReducer(EMPTY_SELECTION, click)
    expect(first.keys).toEqual(['account:a'])
    const second = selectionReducer(first, click)
    expect(second.keys).toEqual(['text:a:label'])
    expect(selectionReducer(second, click).keys).toEqual(['text:a:label'])
  })

  it('treats a panel row click exactly like a canvas click', () => {
    const canvas = [
      { type: 'canvas/click', key: 'account:a', textKey: null, modified: false },
      { type: 'canvas/click', key: 'account:b', textKey: null, modified: true },
    ] as SelectionEvent[]
    const panel = [
      { type: 'panel/rowClick', accountId: 'a', modified: false },
      { type: 'panel/rowClick', accountId: 'b', modified: true },
    ] as SelectionEvent[]
    expect(panel.reduce(selectionReducer, EMPTY_SELECTION)).toEqual(
      canvas.reduce(selectionReducer, EMPTY_SELECTION),
    )
  })

  it('keeps a modifier-click on blank canvas from clearing the selection', () => {
    const selected = selectionReducer(EMPTY_SELECTION, {
      type: 'canvas/click',
      key: 'account:a',
      textKey: null,
      modified: false,
    })
    expect(
      selectionReducer(selected, {
        type: 'canvas/click',
        key: null,
        textKey: null,
        modified: true,
      }),
    ).toBe(selected)
  })

  it('returns the same state when a prune removes nothing', () => {
    const selected = selectionReducer(EMPTY_SELECTION, {
      type: 'select',
      keys: ['account:a', 'note:n'],
    })
    expect(
      selectionReducer(selected, { type: 'prune', exists: () => true }),
    ).toBe(selected)
    expect(
      selectionReducer(selected, {
        type: 'prune',
        exists: (key) => key !== 'note:n',
      }),
    ).toEqual({ keys: ['account:a'], anchor: 'account:a' })
  })
})
