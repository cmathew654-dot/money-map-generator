import { isRotatableTextKey } from '../layout/layout'
import type { MoneyMapData } from '../model/types'
import { isCompatibleMapItemKey } from './mapInteraction'

/**
 * Map selection, owned by one reducer.
 *
 * Selection used to be one value written by three unrelated authorities in the
 * same DOM event — the map click, App commands, and panel focus echoes — so
 * every fix was a fix to the *ordering* between writers. Here there is one
 * writer and two event classes: PRIMARY events (the user positively acted) may
 * move the anchor; SUBORDINATE events (focus echoes) can only speak into an
 * empty selection and are otherwise a no-op returning `state` by identity.
 *
 * `anchor` is the item the user last positively acted on. It replaces the old
 * `keys.at(-1)`, where array *position* stood in for "primary" — which let any
 * appending writer repoint the inspector and the on-canvas rotate handle.
 */
export interface SelectionState {
  /** Selection set, insertion-ordered. */
  keys: string[]
  /** The item the user last positively acted on. */
  anchor: string | null
}

export type ClearReason =
  | 'escape'
  | 'deleted'
  | 'clientChange'
  | 'placementArmed'
  | 'inspectorClose'

export type SelectionEvent =
  // PRIMARY — user intent, may move the anchor
  | {
      type: 'canvas/click'
      key: string | null
      textKey: string | null
      modified: boolean
    }
  | { type: 'panel/rowClick'; accountId: string; modified: boolean }
  /** Enter/Space on a connect endpoint. */
  | { type: 'key/activate'; key: string }
  /** Programmatic replace (quick-add, paste, duplicate, commit). */
  | { type: 'select'; keys: string[] }
  | { type: 'clear'; reason: ClearReason }
  // SUBORDINATE — never mutates a non-empty selection, never moves the anchor
  /** arrow / note / supporting-text onFocus. */
  | { type: 'focus/reveal'; key: string }
  /** Form/Wizard onFocusCapture echo. */
  | { type: 'panel/rowFocus'; accountId: string }
  // HOUSEKEEPING
  | { type: 'prune'; exists: (key: string) => boolean }

export const EMPTY_SELECTION: SelectionState = { keys: [], anchor: null }

const replace = (key: string): SelectionState => ({ keys: [key], anchor: key })

const cleared = (state: SelectionState) =>
  state.keys.length === 0 ? state : EMPTY_SELECTION

/**
 * Accounts and notes toggle in and out of the set; everything else (the
 * as-needed chip, arrows, income, need) cannot be held by `MapItemKey`, so a
 * non-empty selection is preserved rather than silently dropped.
 */
function toggle(state: SelectionState, key: string): SelectionState {
  if (!isCompatibleMapItemKey(key)) {
    return state.keys.length > 0 ? state : replace(key)
  }
  const compatible = state.keys.filter(isCompatibleMapItemKey)
  const index = compatible.indexOf(key)
  if (index < 0) return { keys: [...compatible, key], anchor: key }
  const keys: string[] = compatible.filter((item) => item !== key)
  // The anchor survives only if the user's last positive act survived — and
  // `compatible` may itself have dropped it.
  return {
    keys,
    anchor:
      state.anchor && state.anchor !== key && keys.includes(state.anchor)
        ? state.anchor
        : (keys.at(-1) ?? null),
  }
}

/**
 * Click-again promotion: account text only claims a click once the selection is
 * already "inside" its account and nothing else — the account itself, this
 * text, or a sibling text of the same account (drill-in). A modifier-click
 * never promotes, because modifier-clicks build item selections and text keys
 * cannot join one.
 */
function promotedTextKey(
  state: SelectionState,
  textKey: string | null,
  modified: boolean,
): string | null {
  if (!textKey || modified) return null
  if (state.keys.includes(textKey)) return textKey
  if (state.keys.length !== 1) return null
  const [sole] = state.keys
  const owner = textKey.split(':')[1]
  return sole === `account:${owner}` || sole.startsWith(`text:${owner}:`)
    ? textKey
    : null
}

function primary(
  state: SelectionState,
  key: string | null,
  modified: boolean,
  textKey: string | null = null,
): SelectionState {
  // A modifier-click that lands on nothing is a miss, not a "clear"; a plain
  // click on nothing still deselects.
  if (modified) return key ? toggle(state, key) : state
  if (!key) return cleared(state)
  return replace(promotedTextKey(state, textKey, modified) ?? key)
}

export function selectionReducer(
  state: SelectionState,
  event: SelectionEvent,
): SelectionState {
  switch (event.type) {
    case 'canvas/click':
      return primary(state, event.key, event.modified, event.textKey)
    case 'panel/rowClick':
      return primary(state, `account:${event.accountId}`, event.modified)
    case 'key/activate':
      return replace(event.key)
    case 'select':
      return event.keys.length === 0
        ? cleared(state)
        : { keys: event.keys, anchor: event.keys.at(-1) ?? null }
    case 'clear':
      return cleared(state)
    case 'focus/reveal':
      return state.keys.length === 0 ? replace(event.key) : state
    case 'panel/rowFocus':
      return state.keys.length === 0
        ? replace(`account:${event.accountId}`)
        : state
    case 'prune': {
      const keys = state.keys.filter(event.exists)
      // Identity on a no-op is load-bearing: the App effect that prunes has the
      // selection in its deps and would otherwise loop.
      if (keys.length === state.keys.length) return state
      return {
        keys,
        anchor:
          state.anchor && keys.includes(state.anchor)
            ? state.anchor
            : (keys.at(-1) ?? null),
      }
    }
  }
}

/**
 * The whole selection decision for one map click. Returns `null` to mean
 * "leave the selection exactly as it is".
 *
 * A modifier-click must never replace a non-empty selection. Accounts and
 * notes toggle in and out of it; everything else (the as-needed chip, arrows,
 * income, need) cannot be held by `MapItemKey`, so it is preserved rather than
 * silently dropped.
 */
export function nextSelectedTargetKeys(
  selectedTargetKeys: readonly string[],
  targetKey: string | null,
  modified: boolean,
): string[] | null {
  // A modifier-click that lands on nothing is a miss, not a "clear"; a plain
  // click on nothing still deselects.
  if (!targetKey) return modified ? null : []
  if (!modified) return [targetKey]
  if (!isCompatibleMapItemKey(targetKey)) {
    return selectedTargetKeys.length > 0 ? null : [targetKey]
  }
  const compatible = selectedTargetKeys.filter(isCompatibleMapItemKey)
  const index = compatible.indexOf(targetKey)
  return index < 0
    ? [...compatible, targetKey]
    : compatible.filter((key) => key !== targetKey)
}

/**
 * Click-again promotion for account text (`text:<accountId>:label|caption|value`).
 * The text only claims a click once the selection is already "inside" its
 * account and nothing else: the account itself, this text, or a sibling text of
 * the same account (drill-in — rotating label then value must not cost an extra
 * click). A first click, a click landing in a multi-selection, and every
 * modifier-click all fall through to the account underneath — modifier-clicks
 * build item selections, which text keys cannot join. Returns the key to
 * select, or `null` to let the account win.
 */
export function accountTextClickKey(
  data: MoneyMapData,
  textKey: string | undefined,
  selectedTargetKeys: readonly string[],
  modified: boolean,
): string | null {
  if (!textKey || modified || !isRotatableTextKey(data, textKey)) return null
  return promotedTextKey(
    { keys: [...selectedTargetKeys], anchor: null },
    textKey,
    modified,
  )
}

/**
 * Focus alone still selects, but only when the focus came from the keyboard.
 * Pointer focus fires before the click and would clobber a modifier-click that
 * is meant to extend the selection; the click handler selects on a plain click
 * anyway. `:focus-visible` is the platform's own keyboard-modality signal — the
 * stylesheet already leans on it for map focus rings. Fails open so keyboard
 * selection can never go missing.
 */
export function shouldFocusSelect(element: Element | null | undefined): boolean {
  if (!element) return true
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}
