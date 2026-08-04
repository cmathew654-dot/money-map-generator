import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import {
  ACCOUNT_PRESETS,
  BookValidationError,
  addClient,
  appendBlankAccount,
  clearedClient,
  deleteClient,
  duplicateClient,
  emptyHistory,
  newBook,
  pushHistory,
  redoHistory,
  resetArrangement,
  tidyArrangement,
  undoHistory,
  updateClient,
  type BookHistory,
  type BookSnapshot,
} from './model/book'
import {
  chooseExistingBookFile,
  chooseNewBookFile,
  getStoredBookFileHandle,
  readBookFile,
  requestBookFilePermission,
  resolveFileConnection,
  storeBookFileHandle,
  supportsFileStore,
  writeBookFile,
  clearStoredBookFileHandle,
  type BookFileHandle,
  type FileReadResult,
  type FileStoreApi,
} from './model/filestore'
import type { Bucket, MoneyMapData, MoneyMapFile } from './model/types'
import { newId } from './model/types'
import { buildVocabulary } from './model/vocab'
import { asNeededChipCenter, buildTidyAnchors, layoutMap, layoutOverrideRect, NOTE_WIDTH, OVERRIDE_BOUNDS, rotatedBounds } from './layout/layout'
import { acquireBrowserWriter, BOOK_STORAGE_KEY, currentBrowserWriter, DATA_MODE, loadBrowserBook, publishBrowserWriterTakeoverRequest, releaseBrowserWriter, saveBrowserBook, WRITER_HEARTBEAT_MS, WRITER_STORAGE_KEY, type BrowserBookLoad } from './model/browserStore'
import {
  exportPdf,
  exportPng,
  exportSvg,
  loadBookFromFile,
  mapFileName,
  moneyMapAlternativeText,
  saveBookToFile,
} from './export/export'
import { addIncomeSource, Form, type FormSection } from './form/Form'
import {
  Wizard,
  wizardStepNumberForMapTarget,
} from './form/Wizard'
import {
  MapSvg,
  type MapElementTarget,
} from './render/MapSvg'
import { MapInspector } from './render/MapInspector'
import {
  addCustomArrow,
  deleteMapAccount,
  deleteMapNote,
  duplicateMapAccount,
  duplicateMapNote,
  isCompatibleMapItemKey,
  layoutRect,
  pannedScrollPosition,
  resetTextPositions,
  restoreGeneratedArrows,
  withOverride,
} from './render/mapInteraction'
import { ARTBOARD } from './render/tokens'
import { Dialog } from './ui/Dialog'
import { EditorPanels } from './ui/EditorPanels'
import { EditorRail } from './ui/EditorRail'
import { ClientCombobox } from './ui/ClientCombobox'
import {
  applyMapTextEdit,
  applyMapTextFontSize,
  adjustMapTextFontSize,
  mapTextEditFsInfo,
  mapTextEditRawValue,
  MapTextEditor,
  type ActiveMapTextEdit,
  type MapTextEditTarget,
} from './ui/MapTextEditor'
import { Mark } from './ui/Mark'
import { Menu, MenuItem, MenuSeparator } from './ui/Menu'
import { Toast, type ToastMessage } from './ui/Toast'
import './styles/print.css'

const PAN_ZOOM_HINT_STORAGE_KEY = 'money-map-generator:pan-zoom-hint:v1'
const WRITER_TAKEOVER_REQUEST_KEY = 'money-map-generator:writer-takeover-request'
const WRITER_TAKEOVER_POLL_MS = 250

export type EditorPanel = 'add' | 'data' | 'contents' | 'help'
type FileSaveStatus = 'saved' | 'saving'
type BrowserSaveStatus = 'saved' | 'saving' | 'error'
type MapZoom = 'fit' | number

export function canMutateBook(dataMode: 'demo' | 'real', isWriter: boolean, recovering: boolean) {
  return !recovering && (dataMode === 'demo' || isWriter)
}

export function canWriteConnectedBook(canMutate: boolean, connected: boolean) {
  return canMutate && connected
}

/** Selection keys name accounts, notes and custom arrows by id; the rest of the map is always there. */
export function mapTargetKeyStillExists(
  key: string,
  client:
    | {
        accounts: { id: string }[]
        notes?: { id: string }[]
        customArrows?: { id: string }[]
      }
    | undefined,
) {
  const has = (items: { id: string }[] | undefined, prefix: string) =>
    items?.some((item) => item.id === key.slice(prefix.length)) ?? false
  if (key.startsWith('account:')) return has(client?.accounts, 'account:')
  if (key.startsWith('note:')) return has(client?.notes, 'note:')
  if (key.startsWith('arrow:custom:')) return has(client?.customArrows, 'arrow:custom:')
  return true
}

export function canStartMapPan(state: {
  mapZoom: MapZoom
  button: number
  presentMode: boolean
  onBackground: boolean
}) {
  if (state.mapZoom === 'fit' || state.button !== 0) return false
  // Presenting has no map furniture to grab, so the whole surface pans.
  return state.presentMode || state.onBackground
}

export function presentExitZoom(stashed: MapZoom | null, current: MapZoom) {
  return stashed ?? current
}

export function browserPersistenceLabel(dataMode: 'demo' | 'real', isWriter: boolean, status: BrowserSaveStatus, switching = false) {
  if (dataMode === 'demo') return 'Public demo — changes are temporary'
  if (switching) return 'Getting this tab ready to edit…'
  if (!isWriter) return 'View only — editing is active in another Money Map tab.'
  if (status === 'saving') return 'Saving in this browser…'
  if (status === 'error') return 'Changes could not be saved in this browser.'
  return 'Saved in this browser'
}

export function appMapFileName(
  title: string,
  year: string,
  format: 'png' | 'pdf' | 'svg',
) {
  const cleanYear = year.trim()
  const fileName = mapFileName(title, cleanYear, format)
  return cleanYear ? fileName : fileName.replace(/\s+\.([^.]*)$/, '.$1')
}
type AppDialog =
  | { kind: 'delete'; clientId: string; name: string }
  | { kind: 'error'; title: string; message: string }
  | { kind: 'loadBook'; book: MoneyMapFile }
  | { kind: 'resetLayout' }
  | { kind: 'resetTextPositions' }
  | { kind: 'clearMap'; clientId: string; name: string }

function initialBrowserBook(): BrowserBookLoad { return loadBrowserBook(localStorage) }

export function artboardPointFromClient(
  point: { x: number; y: number },
  mapRect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
) {
  return {
    x: ((point.x - mapRect.left) / mapRect.width) * ARTBOARD.width,
    y: ((point.y - mapRect.top) / mapRect.height) * ARTBOARD.height,
  }
}

export function isEditingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement &&
    (target.matches('input, textarea, select, [contenteditable=true]') ||
      Boolean(target.closest('[data-map-text-editor], .map-text-editor')))
}

function initialPanZoomHintVisible(): boolean {
  try {
    return localStorage.getItem(PAN_ZOOM_HINT_STORAGE_KEY) !== 'dismissed'
  } catch {
    return true
  }
}

function mapTextEditFontState(
  data: MoneyMapData,
  target: MapTextEditTarget,
): Pick<ActiveMapTextEdit, 'fontSize' | 'fontSizeMax'> {
  const fsInfo = mapTextEditFsInfo(data, target)
  if (!fsInfo) return {}
  const storedFontSize =
    fsInfo.key === undefined
      ? fsInfo.fallback
      : data.layoutOverrides?.[fsInfo.key]?.fs ?? fsInfo.fallback
  return {
    fontSize: adjustMapTextFontSize(
      storedFontSize,
      0,
      fsInfo.max,
    ),
    fontSizeMax: fsInfo.max,
  }
}

/**
 * Arm the "swallow the next commit" flag only when an editor is actually open.
 * Callers close the editor defensively (client switch, undo, dialogs); arming
 * with nothing open leaves the flag stuck and eats a later real commit.
 */
export function armMapTextDiscard(discard: boolean, editorOpen: boolean) {
  return discard && editorOpen
}

/** Ctrl/Cmd + wheel is the zoom gesture; a plain wheel must scroll normally. */
export function shouldZoomOnWheel(event: {
  ctrlKey: boolean
  metaKey: boolean
  deltaY: number
}) {
  return (event.ctrlKey || event.metaKey) && event.deltaY !== 0
}

/**
 * React attaches wheel listeners passively, so an onWheel handler's
 * preventDefault() is a no-op and the browser zooms the whole page on
 * ctrl+wheel. The listener has to be attached natively with passive: false.
 */
export function bindMapWheel(
  el: HTMLElement | null,
  handler: (event: WheelEvent) => void,
) {
  if (!el) return undefined
  const listener = (event: Event) => handler(event as WheelEvent)
  el.addEventListener('wheel', listener, { passive: false })
  return () => el.removeEventListener('wheel', listener)
}

/**
 * The as-needed chip's default anchor is a stateless scored pick, so it can
 * teleport when unrelated items move. A chip WITH an override rides the frozen
 * legacy base instead. So on the first map edit of any kind, materialize the
 * current scored position as an override: the chip does not move now, and from
 * then on it behaves as placed. Fresh maps keep the smart initial placement.
 */
export function freezeAsNeededChip(
  before: MoneyMapData,
  after: MoneyMapData,
): MoneyMapData {
  if (before.layoutOverrides?.asNeededChip) return after
  const scored = asNeededChipCenter(before)
  // The override rides the frozen legacy base, so measure that base under the
  // edited geometry and fold in whatever chip delta the edit itself wrote.
  const base = asNeededChipCenter({
    ...after,
    layoutOverrides: {
      ...after.layoutOverrides,
      asNeededChip: { dx: 0, dy: 0 },
    },
  })
  if (!scored || !base) return after
  const edit = after.layoutOverrides?.asNeededChip ?? {}
  return {
    ...after,
    layoutOverrides: {
      ...after.layoutOverrides,
      asNeededChip: {
        ...edit,
        dx: scored.x - base.x + (edit.dx ?? 0),
        dy: scored.y - base.y + (edit.dy ?? 0),
      },
    },
  }
}

export default function App() {
  const [initialLoad] = useState(initialBrowserBook)
  const [snapshot, setSnapshot] = useState<BookSnapshot>(() => {
    const book = initialLoad.book
    return { book, activeClientId: book.clients[0].id }
  })
  const [history, setHistory] = useState<BookHistory>(emptyHistory)
  const [editorPanel, setEditorPanel] = useState<EditorPanel | null>(null)
  const [dataFilter, setDataFilter] = useState('')
  const [dataSection, setDataSection] = useState<FormSection>()
  const [formRevision, setFormRevision] = useState(0)
  const [guidedSetup, setGuidedSetup] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardDone, setWizardDone] = useState(false)
  const [focusRequest, setFocusRequest] = useState<{
    id: string
    at: number
  }>()
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [mapTextEdit, setMapTextEdit] =
    useState<ActiveMapTextEdit | null>(null)
  const [selectedMapTargetKeys, setSelectedMapTargetKeys] = useState<string[]>([])
  const selectedMapTargetKey = selectedMapTargetKeys.at(-1) ?? null
  const [dialog, setDialog] = useState<AppDialog | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [connectedFile, setConnectedFile] =
    useState<BookFileHandle | null>(null)
  const [reconnectFile, setReconnectFile] =
    useState<BookFileHandle | null>(null)
  const [fileSaveStatus, setFileSaveStatus] =
    useState<FileSaveStatus>('saved')
  const [browserSaveStatus, setBrowserSaveStatus] = useState<BrowserSaveStatus>(initialLoad.status === 'error' ? 'error' : 'saved')
  const [browserSaveError, setBrowserSaveError] = useState(initialLoad.status === 'error' ? initialLoad.message : '')
  const [recovery, setRecovery] = useState(initialLoad.status === 'recovery' ? { raw: initialLoad.raw, message: initialLoad.message } : null)
  // Tab ids must be unique across tabs minted in the same millisecond
  // (session restore opens siblings together); newId's realm-local counter
  // can't guarantee that, so add per-tab entropy.
  const [tabId] = useState(() => `${newId('tab')}-${Math.random().toString(36).slice(2, 6)}`)
  const [isWriter, setIsWriter] = useState(() => DATA_MODE === 'real' && acquireBrowserWriter(localStorage, tabId).status === 'acquired')
  const [writerTakeoverPending, setWriterTakeoverPending] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [mapZoom, setMapZoom] = useState<MapZoom>('fit')
  const presentZoomRef = useRef<MapZoom | null>(null)
  const [panZoomHintVisible, setPanZoomHintVisible] = useState(
    initialPanZoomHintVisible,
  )
  const [fitZoom, setFitZoom] = useState(100)
  const [isMapPanning, setIsMapPanning] = useState(false)
  const [placingTextNote, setPlacingTextNote] = useState(false)
  const [shapePopoverOpen, setShapePopoverOpen] = useState(false)
  const [exporting, setExporting] = useState<'png' | 'pdf' | 'svg' | null>(null)
  const [fileStoreSupported] = useState(() =>
    DATA_MODE === 'real' && supportsFileStore(window as unknown as FileStoreApi),
  )
  const focusRequestCounter = useRef(0)
  const toastCounter = useRef(0)
  const fileSaveRevision = useRef(0)
  const fileWriteQueue = useRef<Promise<void>>(Promise.resolve())
  const writerTakeoverTimerRef = useRef<number | null>(null)
  const releaseTimerRef = useRef<number | null>(null)
  const writerFocusRequestedRef = useRef(false)
  const writerFocusInitializedRef = useRef(false)
  const exportInFlightRef = useRef<'png' | 'pdf' | 'svg' | null>(null)
  const mapClipboardRef = useRef<Array<{ kind: 'account' | 'note'; id: string }>>([])
  const mapCommandFeedbackRef = useRef<string | null>(null)
  const discardMapTextCommitRef = useRef(false)
  const snapshotRef = useRef(snapshot)
  const historyRef = useRef(history)
  const appShellRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewPaneRef = useRef<HTMLDivElement>(null)
  const mapPageRef = useRef<HTMLDivElement>(null)
  const pendingZoomAnchorRef = useRef<{
    anchor: { x: number; y: number }
    pointer: { x: number; y: number }
    scroller: HTMLDivElement
  } | null>(null)
  const mapPanRef = useRef<{
    pointerId: number
    startPointer: { x: number; y: number }
    startScroll: { x: number; y: number }
    moved: boolean
  } | null>(null)
  const suppressNextTextPlacementRef = useRef(false)
  const shapePopoverRef = useRef<HTMLDivElement>(null)
  const shapePopoverButtonRef = useRef<HTMLButtonElement>(null)
  const firstShapePresetRef = useRef<HTMLButtonElement>(null)
  const printMapRef = useRef<HTMLDivElement>(null)
  const editorPanelHeadingRef = useRef<HTMLHeadingElement>(null)
  const { book, activeClientId } = snapshot
  const canMutate = canMutateBook(DATA_MODE, isWriter, Boolean(recovery))
  const vocabulary = useMemo(() => buildVocabulary(book), [book])
  const activeClient =
    book.clients.find((client) => client.id === activeClientId) ??
    book.clients[0]
  const setSelectedMapTargetKey = (key: string | null) =>
    setSelectedMapTargetKeys(key ? [key] : [])
  const closeMapTextEditor = useCallback((discard = false) => {
    if (armMapTextDiscard(discard, mapTextEdit !== null))
      discardMapTextCommitRef.current = true
    setMapTextEdit(null)
  }, [mapTextEdit])
  useEffect(() => {
    setDataFilter('')
    setDataSection(undefined)
    setFocusRequest(undefined)
  }, [activeClient.id])
  const hasLayoutOverrides =
    Object.keys(activeClient.layoutOverrides ?? {}).length > 0 ||
    activeClient.customArrows?.some(
      (arrow) => arrow.labelDx !== undefined || arrow.labelDy !== undefined,
    ) === true
  const hasTextPositionOverrides = Object.entries(activeClient.layoutOverrides ?? {}).some(
    ([key, override]) => key.startsWith('text:') && (override.dx !== undefined || override.dy !== undefined),
  )
  const hasHiddenArrows = (activeClient.hiddenArrows?.length ?? 0) > 0
  const mapLayout = layoutMap(activeClient)
  const asNeededChipRect = layoutOverrideRect(activeClient, 'asNeededChip')
  const tidyAnchors = buildTidyAnchors(mapLayout, asNeededChipRect)
  const tidiedClient = tidyArrangement(activeClient, tidyAnchors, OVERRIDE_BOUNDS)
  const canTidyMap = tidiedClient !== activeClient
  const previewClient = (() => {
    const fsInfo = mapTextEdit
      ? mapTextEditFsInfo(activeClient, mapTextEdit.target)
      : null
    if (
      !mapTextEdit?.fontSizeChanged ||
      mapTextEdit.fontSize === undefined ||
      !fsInfo
    ) {
      return activeClient
    }
    return applyMapTextFontSize(
      activeClient,
      mapTextEdit.target,
      mapTextEdit.fontSize,
    )
  })()
  useEffect(() => {
    setMapZoom('fit')
    setShapePopoverOpen(false)
    setPlacingTextNote(false)
    setSelectedMapTargetKey(null)
  }, [activeClient.id])

  useEffect(() => {
    if (mapTextEdit !== null || !discardMapTextCommitRef.current) return
    window.setTimeout(() => {
      discardMapTextCommitRef.current = false
    }, 0)
  }, [mapTextEdit])

  useEffect(() => {
    const nextKeys = selectedMapTargetKeys.filter((key) =>
      mapTargetKeyStillExists(key, activeClient),
    )
    if (nextKeys.length !== selectedMapTargetKeys.length) {
      setSelectedMapTargetKeys(nextKeys)
    }
  }, [activeClient, selectedMapTargetKeys])

  useEffect(() => {
    if (!shapePopoverOpen) return
    firstShapePresetRef.current?.focus()
  }, [shapePopoverOpen])

  useEffect(() => {
    if (!shapePopoverOpen) return
    const closeOnPointerDown = (event: globalThis.PointerEvent) => {
      if (!shapePopoverRef.current?.contains(event.target as Node)) {
        setShapePopoverOpen(false)
      }
    }
    window.addEventListener('pointerdown', closeOnPointerDown)
    return () => window.removeEventListener('pointerdown', closeOnPointerDown)
  }, [shapePopoverOpen])

  useEffect(() => {
    if (mapZoom !== 'fit' || !mapPageRef.current) return
    const page = mapPageRef.current
    const updateFitZoom = () =>
      setFitZoom(
        Math.round(
          (page.getBoundingClientRect().width / ARTBOARD.width) * 100,
        ),
      )
    updateFitZoom()
    const observer = new ResizeObserver(updateFitZoom)
    observer.observe(page)
    return () => observer.disconnect()
  }, [mapZoom])

  useLayoutEffect(() => {
    const pending = pendingZoomAnchorRef.current
    const page = mapPageRef.current
    if (!pending || !page) return
    pendingZoomAnchorRef.current = null
    const nextRect = page.getBoundingClientRect()
    pending.scroller.scrollLeft +=
      nextRect.left +
      pending.anchor.x * nextRect.width -
      pending.pointer.x
    pending.scroller.scrollTop +=
      nextRect.top +
      pending.anchor.y * nextRect.height -
      pending.pointer.y
  }, [mapZoom])

  const showSnapshot = useCallback((next: BookSnapshot) => {
    snapshotRef.current = next
    setSnapshot(next)
  }, [])

  const showHistory = useCallback((next: BookHistory) => {
    historyRef.current = next
    setHistory(next)
  }, [])

  const bumpFormRevision = useCallback(() => {
    setFormRevision((revision) => revision + 1)
    setFocusRequest(undefined)
  }, [])

  const closeDataPanel = useCallback(() => {
    setFocusRequest(undefined)
    setEditorPanel(null)
  }, [])

  const commitSnapshot = useCallback(
    (next: BookSnapshot, targetClientId: string | null) => {
      if (!canMutate) return
      const nextHistory = pushHistory(
        historyRef.current,
        snapshotRef.current,
        next,
        targetClientId,
        Date.now(),
      )
      showHistory(nextHistory)
      showSnapshot(next)
    },
    [canMutate, showHistory, showSnapshot],
  )

  const resetWizard = useCallback(() => {
    setWizardStep(0)
    setWizardDone(false)
  }, [])

  const restoreHistorySnapshot = useCallback(
    (next: BookSnapshot) => {
      bumpFormRevision()
      closeMapTextEditor(true)
      showSnapshot(next)
      const restoredClient = next.book.clients.find(
        (client) => client.id === next.activeClientId,
      )
      setSelectedMapTargetKeys((keys) => {
        const kept = keys.filter((key) =>
          mapTargetKeyStillExists(key, restoredClient),
        )
        return kept.length === keys.length ? keys : kept
      })
      setDialog(null)
      setGuidedSetup(false)
      resetWizard()
    },
    [bumpFormRevision, closeMapTextEditor, resetWizard, showSnapshot],
  )

  const handleUndo = useCallback(() => {
    if (!canMutate) return false
    const result = undoHistory(historyRef.current)
    if (!result.snapshot) return false
    showHistory(result.history)
    restoreHistorySnapshot(result.snapshot)
    return true
  }, [canMutate, restoreHistorySnapshot, showHistory])

  const handleRedo = useCallback(() => {
    if (!canMutate) return false
    const result = redoHistory(historyRef.current)
    if (!result.snapshot) return false
    showHistory(result.history)
    restoreHistorySnapshot(result.snapshot)
    return true
  }, [canMutate, restoreHistorySnapshot, showHistory])

  const addToast = useCallback((message: string) => {
    toastCounter.current += 1
    setToasts((current) => [
      ...current,
      { id: toastCounter.current, message },
    ].slice(-2))
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    if (!fileStoreSupported) return
    void getStoredBookFileHandle()
      .then(setReconnectFile)
      .catch(() => {
        // IndexedDB may be unavailable; the localStorage copy remains current.
      })
  }, [fileStoreSupported])

  const flushBrowserSave = useCallback(() => {
    if (DATA_MODE !== 'real' || recovery || currentBrowserWriter(localStorage) !== tabId) return
    const error = saveBrowserBook(localStorage, snapshotRef.current.book)
    setBrowserSaveStatus(error ? 'error' : 'saved'); setBrowserSaveError(error ?? '')
  }, [recovery, tabId])
  const clearWriterTakeoverTimer = useCallback(() => {
    if (writerTakeoverTimerRef.current === null) return
    window.clearTimeout(writerTakeoverTimerRef.current)
    writerTakeoverTimerRef.current = null
  }, [])
  const adoptLatestBrowserBook = useCallback(() => {
    const latest = loadBrowserBook(localStorage)
    if (latest.status === 'ready') {
      bumpFormRevision()
      showHistory(emptyHistory())
      showSnapshot({ book: latest.book, activeClientId: latest.book.clients[0].id })
      return true
    }
    if (latest.status === 'recovery') {
      setRecovery({ raw: latest.raw, message: latest.message })
    } else {
      setBrowserSaveStatus('error')
      setBrowserSaveError(latest.message)
    }
    return false
  }, [bumpFormRevision, showHistory, showSnapshot])
  const finishBrowserWriterTakeover = useCallback(() => {
    clearWriterTakeoverTimer()
    setWriterTakeoverPending(false)
    if (!adoptLatestBrowserBook()) {
      releaseBrowserWriter(localStorage, tabId)
      setIsWriter(false)
      return
    }
    setIsWriter(true)
  }, [adoptLatestBrowserBook, clearWriterTakeoverTimer, tabId])
  const requestBrowserWriterTakeover = useCallback(() => {
    if (writerTakeoverTimerRef.current !== null) return
    setWriterTakeoverPending(true)
    const tryTakeover = () => {
      const result = acquireBrowserWriter(localStorage, tabId, true)
      if (result.status === 'acquired') {
        try { localStorage.removeItem(WRITER_TAKEOVER_REQUEST_KEY) } catch { /* The acquired lease remains valid. */ }
        writerFocusInitializedRef.current = true
        finishBrowserWriterTakeover()
        return
      }
      if (result.status === 'error') {
        clearWriterTakeoverTimer()
        setWriterTakeoverPending(false)
        return
      }
      try { publishBrowserWriterTakeoverRequest(localStorage, tabId) } catch { /* Lease expiry remains the fallback. */ }
      writerTakeoverTimerRef.current = window.setTimeout(tryTakeover, WRITER_TAKEOVER_POLL_MS)
    }
    try {
      publishBrowserWriterTakeoverRequest(localStorage, tabId)
    } catch {
      // A later focus retries ownership.
    }
    writerTakeoverTimerRef.current = window.setTimeout(tryTakeover, WRITER_TAKEOVER_POLL_MS)
  }, [clearWriterTakeoverTimer, finishBrowserWriterTakeover, tabId])
  useEffect(() => {
    if (DATA_MODE !== 'real') return
    const checkInitialFocus = !writerFocusInitializedRef.current
    const requestOnFocus = () => {
      if (
        document.visibilityState !== 'visible' ||
        !document.hasFocus() ||
        currentBrowserWriter(localStorage) === tabId ||
        writerTakeoverTimerRef.current !== null ||
        writerFocusRequestedRef.current
      ) return
      writerFocusRequestedRef.current = true
      requestBrowserWriterTakeover()
    }
    const resetFocusRequest = () => {
      writerFocusRequestedRef.current = false
    }
    window.addEventListener('focus', requestOnFocus)
    window.addEventListener('blur', resetFocusRequest)
    if (checkInitialFocus) requestOnFocus()
    return () => {
      window.removeEventListener('focus', requestOnFocus)
      window.removeEventListener('blur', resetFocusRequest)
      writerFocusRequestedRef.current = false
    }
  }, [requestBrowserWriterTakeover, tabId])
  useEffect(() => {
    if (DATA_MODE !== 'real' || !isWriter || recovery) return
    setBrowserSaveStatus('saving'); const timeout = window.setTimeout(flushBrowserSave, 400)
    return () => window.clearTimeout(timeout)
  }, [book, flushBrowserSave, isWriter, recovery])
  useEffect(() => {
    if (DATA_MODE !== 'real' || !isWriter) return
    const heartbeat = window.setInterval(() => {
      if (acquireBrowserWriter(localStorage, tabId).status !== 'acquired') setIsWriter(false)
    }, WRITER_HEARTBEAT_MS)
    return () => window.clearInterval(heartbeat)
  }, [isWriter, tabId])
  useEffect(() => {
    if (DATA_MODE !== 'real') return
    // A StrictMode dev double-mount runs cleanup then setup synchronously;
    // cancel a pending deferred release if we're still here for the
    // remount, so the lease is never actually dropped for a fake unmount.
    if (releaseTimerRef.current !== null) {
      window.clearTimeout(releaseTimerRef.current)
      releaseTimerRef.current = null
    }
    const flush = () => flushBrowserSave()
    const hidden = () => {
      if (document.visibilityState === 'hidden') {
        flush()
        if (currentBrowserWriter(localStorage) === tabId) {
          releaseBrowserWriter(localStorage, tabId)
          setIsWriter(false)
        }
        return
      }
      // A tab returning to view re-requests the lease instead of staying
      // read-only forever (Slice 9: the missing 'visible' counterpart).
      if (document.visibilityState === 'visible' && !presentMode && currentBrowserWriter(localStorage) !== tabId) {
        requestBrowserWriterTakeover()
      }
    }
    const handlePageHide = () => { flushBrowserSave(); releaseBrowserWriter(localStorage, tabId) }
    const handlePageShow = () => {
      if (acquireBrowserWriter(localStorage, tabId).status === 'acquired') {
        finishBrowserWriterTakeover()
      } else {
        setIsWriter(false)
      }
    }
    const storage = (event: StorageEvent) => {
      if (event.key === WRITER_TAKEOVER_REQUEST_KEY && event.newValue && currentBrowserWriter(localStorage) === tabId) {
        try {
          const request = JSON.parse(event.newValue) as { requester?: unknown }
          if (typeof request.requester === 'string' && request.requester !== tabId) {
            flushBrowserSave()
            releaseBrowserWriter(localStorage, tabId)
            setIsWriter(false)
            localStorage.removeItem(WRITER_TAKEOVER_REQUEST_KEY)
          }
        } catch {
          // Malformed takeover requests never change writer ownership.
        }
      }
      if (event.key === WRITER_STORAGE_KEY) {
        const result = acquireBrowserWriter(localStorage, tabId)
        if (result.status === 'acquired') {
          finishBrowserWriterTakeover()
        } else {
          setIsWriter(false)
        }
      }
      if (event.key === BOOK_STORAGE_KEY && currentBrowserWriter(localStorage) !== tabId) {
        const latest = loadBrowserBook(localStorage)
        if (latest.status === 'ready') {
          showHistory(emptyHistory())
          showSnapshot({ book: latest.book, activeClientId: latest.book.clients[0].id })
        }
      }
    }
    window.addEventListener('pagehide', handlePageHide); window.addEventListener('beforeunload', handlePageHide); window.addEventListener('pageshow', handlePageShow); document.addEventListener('visibilitychange', hidden); window.addEventListener('storage', storage)
    return () => { window.removeEventListener('pagehide', handlePageHide); window.removeEventListener('beforeunload', handlePageHide); window.removeEventListener('pageshow', handlePageShow); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('storage', storage) }
  }, [finishBrowserWriterTakeover, flushBrowserSave, presentMode, requestBrowserWriterTakeover, showHistory, showSnapshot, tabId])

  useEffect(
    () => () => {
      if (writerTakeoverTimerRef.current !== null) {
        window.clearTimeout(writerTakeoverTimerRef.current)
        writerTakeoverTimerRef.current = null
      }
      if (DATA_MODE !== 'real') return
      // Deferred (not called directly) so a StrictMode dev double-mount can
      // cancel it in the effect above before it ever strands the tab.
      releaseTimerRef.current = window.setTimeout(() => {
        releaseTimerRef.current = null
        releaseBrowserWriter(localStorage, tabId)
      }, 0)
    },
    [tabId],
  )

  useEffect(() => {
    if (!connectedFile || !canWriteConnectedBook(canMutate, true)) return
    fileSaveRevision.current += 1
    const revision = fileSaveRevision.current
    setFileSaveStatus('saving')
    const timeout = window.setTimeout(() => {
      const write = fileWriteQueue.current
        .catch(() => undefined)
        .then(() => writeBookFile(connectedFile, book))
      fileWriteQueue.current = write
      void write.then(
        () => {
          if (fileSaveRevision.current === revision) {
            setFileSaveStatus('saved')
          }
        },
        () => {
          if (fileSaveRevision.current !== revision) return
          setConnectedFile(null)
          setReconnectFile(connectedFile)
          addToast(
            `Could not save to ${connectedFile.name}. Changes are still saved in this browser.`,
          )
        },
      )
    }, 800)
    return () => window.clearTimeout(timeout)
  }, [addToast, book, canMutate, connectedFile])

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey) return
      const key = event.key.toLowerCase()
      const isUndo = key === 'z' && !event.shiftKey
      const isRedo =
        (key === 'z' && event.shiftKey) ||
        (key === 'y' && !event.shiftKey)
      if (!isUndo && !isRedo) return

      const changed = isUndo ? handleUndo() : handleRedo()
      if (changed || canMutate) event.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canMutate, handleRedo, handleUndo])

  useEffect(() => {
    if (!editorPanel || guidedSetup || presentMode) return
    if (focusRequest) return
    window.requestAnimationFrame(() => editorPanelHeadingRef.current?.focus())
  }, [editorPanel, focusRequest, guidedSetup, presentMode])

  useEffect(() => {
    const handleEditorEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || presentMode || dialog) return
      if (placingTextNote) {
        setPlacingTextNote(false)
      } else if (mapTextEdit) {
        closeMapTextEditor(true)
      } else if (shapePopoverOpen) {
        setShapePopoverOpen(false)
        shapePopoverButtonRef.current?.focus()
      } else if (editorPanel) {
        closeDataPanel()
      } else if (selectedMapTargetKey) {
        setSelectedMapTargetKey(null)
      } else {
        return
      }
      event.preventDefault()
    }
    window.addEventListener('keydown', handleEditorEscape)
    return () => window.removeEventListener('keydown', handleEditorEscape)
  }, [closeDataPanel, closeMapTextEditor, dialog, editorPanel, mapTextEdit, placingTextNote, presentMode, selectedMapTargetKey, shapePopoverOpen])

  const exitPresentMode = useCallback(() => {
    setPresentMode(false)
    setMapZoom((current) => presentExitZoom(presentZoomRef.current, current))
    presentZoomRef.current = null
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined)
    }
  }, [])

  useEffect(() => {
    if (!presentMode) return
    const handlePresentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') exitPresentMode()
    }
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        exitPresentMode()
      }
    }
    window.addEventListener('keydown', handlePresentKeyDown)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      window.removeEventListener('keydown', handlePresentKeyDown)
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
      )
    }
  }, [exitPresentMode, presentMode])

  const rememberConnectedFile = useCallback(
    (handle: BookFileHandle) => {
      setConnectedFile(handle)
      setReconnectFile(null)
      setFileSaveStatus('saved')
      void storeBookFileHandle(handle).catch(() => {
        addToast('Saving to this file for this visit only')
      })
    },
    [addToast],
  )

  const replaceBookFromFile = useCallback(
    async (handle: BookFileHandle, isReconnect: boolean) => {
      if (!canMutate) return
      let result: FileReadResult
      try {
        if (!(await requestBookFilePermission(handle))) {
          throw new Error('File permission was not granted.')
        }
        result = { status: 'success', book: await readBookFile(handle) }
      } catch (error) {
        result = { status: 'failure', error }
      }

      const resolution = resolveFileConnection(
        snapshotRef.current.book,
        result,
      )
      if (!resolution.connected) {
        addToast(
          isReconnect
            ? `Could not reconnect ${handle.name}; browser copy kept`
            : `Could not open ${handle.name}; current book unchanged`,
        )
        return
      }

      closeMapTextEditor(true)
      commitSnapshot(
        {
          book: resolution.book,
          activeClientId: resolution.book.clients[0].id,
        },
        null,
      )
      resetWizard()
      rememberConnectedFile(handle)
      addToast(isReconnect ? 'Saving to this file again' : 'Changes will now save to this file')
    },
    [addToast, canMutate, closeMapTextEditor, commitSnapshot, rememberConnectedFile, resetWizard],
  )

  const handleCreateConnectedFile = async () => {
    try {
      const handle = await chooseNewBookFile()
      await writeBookFile(handle, snapshotRef.current.book)
      rememberConnectedFile(handle)
      addToast('Changes will now save to this file')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      addToast('Could not create the book file')
    }
  }

  const handleOpenConnectedFile = async () => {
    try {
      const handle = await chooseExistingBookFile()
      await replaceBookFromFile(handle, false)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      addToast('Could not open the book file')
    }
  }

  const handleDisconnectFile = () => {
    fileSaveRevision.current += 1
    setConnectedFile(null)
    setReconnectFile(null)
    setFileSaveStatus('saved')
    void clearStoredBookFileHandle().catch(() => undefined)
    addToast('Stopped saving to this file')
  }

  const handlePresent = async () => {
    closeMapTextEditor(true)
    setShapePopoverOpen(false)
    presentZoomRef.current = mapZoom
    setMapZoom('fit')
    setPresentMode(true)
    const shell = appShellRef.current
    if (!shell?.requestFullscreen) return
    try {
      await shell.requestFullscreen()
    } catch {
      // Present mode still works when fullscreen is unavailable or denied.
    }
  }

  const selectClient = (id: string) => {
    bumpFormRevision()
    closeMapTextEditor(true)
    setGuidedSetup(false)
    showSnapshot({ ...snapshotRef.current, activeClientId: id })
    resetWizard()
  }

  const handleNew = () => {
    const result = addClient(snapshotRef.current.book)
    closeMapTextEditor(true)
    commitSnapshot(
      { book: result.book, activeClientId: result.id },
      result.id,
    )
    setMapTextEdit(null)
    closeDataPanel()
    setGuidedSetup(true)
    resetWizard()
  }

  const handleDuplicate = () => {
    const result = duplicateClient(
      snapshotRef.current.book,
      activeClient.id,
    )
    closeMapTextEditor(true)
    commitSnapshot(
      { book: result.book, activeClientId: result.id },
      result.id,
    )
    setMapTextEdit(null)
    setGuidedSetup(false)
    resetWizard()
    addToast('Client duplicated')
  }

  const handleDelete = () => {
    setDialog({
      kind: 'delete',
      clientId: activeClient.id,
      name: activeClient.client.title || 'Untitled',
    })
  }

  const handleResetLayout = () => {
    bumpFormRevision()
    handleClientChange(resetArrangement(activeClient))
    setDialog(null)
    addToast('Arrangement reset')
  }

  const handleResetTextPositions = () => {
    const next = resetTextPositions(activeClient)
    closeMapTextEditor(true)
    if (next !== activeClient) handleMapChange(next)
    setDialog(null)
    addToast('Text positions reset')
  }

  const handleTidyMap = () => {
    if (!canTidyMap) return
    handleMapChange(tidiedClient, 'Map aligned to grid.')
  }

  const handleRestoreGeneratedArrows = () => {
    handleMapChange(restoreGeneratedArrows(activeClient))
    addToast('Automatic flows restored')
  }

  const confirmClearMap = (clientId: string) => {
    const current = snapshotRef.current
    const client = current.book.clients.find((item) => item.id === clientId)
    if (!client) {
      setDialog(null)
      return
    }
    bumpFormRevision()
    closeMapTextEditor(true)
    commitSnapshot(
      {
        book: updateClient(current.book, clientId, clearedClient(client)),
        activeClientId: clientId,
      },
      null,
    )
    setMapTextEdit(null)
    resetWizard()
    setDialog(null)
    addToast('Map cleared — Undo brings it back')
  }

  const confirmDelete = (clientId: string) => {
    const nextBook = deleteClient(snapshotRef.current.book, clientId)
    closeMapTextEditor(true)
    commitSnapshot(
      { book: nextBook, activeClientId: nextBook.clients[0].id },
      clientId,
    )
    setMapTextEdit(null)
    resetWizard()
    setDialog(null)
    addToast('Client deleted')
  }

  const showError = (title: string, error: unknown, fallback: string) => {
    setDialog({
      kind: 'error',
      title,
      message: error instanceof BookValidationError ? error.message : fallback,
    })
  }

  const applyLoadedBook = (nextBook: MoneyMapFile) => {
    if (!canMutate) return
    if (connectedFile) handleDisconnectFile()
    setRecovery(null)
    closeMapTextEditor(true)
    commitSnapshot({ book: nextBook, activeClientId: nextBook.clients[0].id }, null)
    resetWizard()
    setDialog(null)
    addToast('Book backup opened')
  }

  const handleLoad = async (file: File) => {
    try {
      const nextBook = await loadBookFromFile(file)
      if (connectedFile) setDialog({ kind: 'loadBook', book: nextBook })
      else applyLoadedBook(nextBook)
    } catch (error) {
      showError('Could not load book', error, 'The book could not be loaded.')
    }
  }

  const handleSaveBook = () => {
    try { saveBookToFile(book); addToast('Book backup downloaded') }
    catch (error) { showError('Could not save book', error, 'The book could not be saved.') }
  }

  const handleExport = async (format: 'png' | 'pdf' | 'svg') => {
    if (exportInFlightRef.current) return
    const label = format.toUpperCase()
    const svg = printMapRef.current?.querySelector('svg')
    if (!svg) {
      showError(
        `Could not export ${label}`,
        new Error('The Money Map is not ready to export.'),
        `The ${label} could not be exported.`,
      )
      return
    }

    exportInFlightRef.current = format
    setExporting(format)
    try {
      const fileName = appMapFileName(
        activeClient.client.title,
        activeClient.client.year,
        format,
      )
      if (format === 'pdf') {
        await exportPdf(svg, fileName, {
          title: `Money Map for ${activeClient.client.title || 'Untitled client'}, ${activeClient.client.year}`,
          language: 'en-US',
          alternativeText: moneyMapAlternativeText(activeClient),
        })
      } else if (format === 'png') await exportPng(svg, fileName)
      else await exportSvg(svg, fileName)
      addToast(`${label} exported`)
    } catch (error) {
      showError(
        `Could not export ${label}`,
        error,
        `The ${label} could not be exported.`,
      )
    } finally { exportInFlightRef.current = null; setExporting(null) }
  }

  const downloadRecoveryCopy = () => {
    if (!recovery) return
    let url: string | null = null; let link: HTMLAnchorElement | null = null
    try {
      url = URL.createObjectURL(new Blob([recovery.raw], { type: 'application/json' }))
      link = document.createElement('a'); link.href = url; link.download = 'money-map-recovery.json'
      document.body.append(link); link.click(); link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url!), 0)
    } catch (error) {
      link?.remove(); if (url) URL.revokeObjectURL(url)
      showError('Could not download recovery copy', error, 'The recovery copy could not be downloaded.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPng = () => handleExport('png')

  const focusDataTarget = (section: FormSection, id: string) => {
    setEditorPanel('data')
    setDataFilter('')
    setDataSection(section)
    focusRequestCounter.current += 1
    setFocusRequest({ id, at: focusRequestCounter.current })
  }

  const handleMapDetails = () => {
    const targetKey = selectedMapTargetKey
    if (!targetKey) return
    if (targetKey === 'income' || targetKey === 'need') {
      focusDataTarget(targetKey, targetKey)
      return
    }
    if (targetKey.startsWith('account:')) {
      focusDataTarget('accounts', targetKey.slice('account:'.length))
      return
    }
    if (targetKey.startsWith('note:')) {
      focusDataTarget('notes', targetKey.slice('note:'.length))
    }
  }

  const handleMapElementClick = (target: MapElementTarget) => {
    if (target.kind === 'edit') {
      setMapTextEdit({
        color: target.color,
        target: target.edit,
        rect: target.rect,
        anchorRect: target.anchorRect,
        rawValue: mapTextEditRawValue(activeClient, target.edit),
        ...mapTextEditFontState(activeClient, target.edit),
      })
      return
    }
    setMapTextEdit(null)
    if (guidedSetup) {
      const stepNumber = wizardStepNumberForMapTarget(target.kind)
      if (stepNumber !== null) {
        setWizardStep(stepNumber - 1)
        setWizardDone(false)
      }
      const id = target.kind === 'account' ? target.id : target.kind
      if (id) {
        focusRequestCounter.current += 1
        setFocusRequest({ id, at: focusRequestCounter.current })
      }
    } else if (editorPanel === 'data') {
      const section =
        target.kind === 'account'
          ? 'accounts'
          : target.kind === 'income'
            ? 'income'
            : 'need'
      const id = target.kind === 'account' ? target.id : target.kind
      if (id) focusDataTarget(section, id)
    }
  }

  const handleMapSelectionChange = (targetKey: string | null) => {
    setSelectedMapTargetKey(targetKey)
    setFocusRequest(undefined)
  }

  const handleMapSelectionKeysChange = (targetKeys: string[]) => {
    setSelectedMapTargetKeys(targetKeys)
    setFocusRequest(undefined)
  }

  const handleClientChange = (rawNext: typeof activeClient) => {
    const current = snapshotRef.current
    const before =
      current.book.clients.find((item) => item.id === rawNext.id) ?? activeClient
    const next = freezeAsNeededChip(before, rawNext)
    commitSnapshot(
      {
        book: updateClient(current.book, next.id, next),
        activeClientId: next.id,
      },
      next.id,
    )
  }

  /**
   * Pointer-down on the map, before the first preview frame: materialize the
   * chip's scored anchor so it stops re-picking per frame mid-drag. Position-
   * preserving and invisible, so it goes through showSnapshot — no undo step.
   */
  const handleMapGestureStart = () => {
    const current = snapshotRef.current
    const before =
      current.book.clients.find((item) => item.id === activeClient.id) ??
      activeClient
    const next = freezeAsNeededChip(before, before)
    if (next === before) return
    showSnapshot({
      book: updateClient(current.book, next.id, next),
      activeClientId: current.activeClientId,
    })
  }

  const handleMapChange = (rawNext: typeof activeClient, feedback?: string) => {
    bumpFormRevision()
    const current = snapshotRef.current
    const before =
      current.book.clients.find((item) => item.id === rawNext.id) ?? activeClient
    const next = freezeAsNeededChip(before, rawNext)
    commitSnapshot(
      {
        book: updateClient(current.book, next.id, next),
        activeClientId: next.id,
      },
      null,
    )
    const message = feedback ?? mapCommandFeedbackRef.current ?? (
      (next.customArrows?.length ?? 0) > (activeClient.customArrows?.length ?? 0)
        ? 'Flow added'
        : undefined
    )
    mapCommandFeedbackRef.current = null
    if (message) addToast(message)
  }

  const handleMapCommandCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const button = target.closest('button')
    if (!button) return
    const label = button.getAttribute('aria-label') ?? button.textContent?.trim()
    if (!label) return
    if (label.startsWith('Align ')) mapCommandFeedbackRef.current = 'Map items aligned'
    else if (label.startsWith('Distribute ')) mapCommandFeedbackRef.current = 'Map items distributed'
    else if (label === 'Duplicate') {
      mapCommandFeedbackRef.current = selectedMapTargetKey?.startsWith('note:')
        ? 'Note duplicated'
        : 'Account duplicated'
    } else if (label === 'Delete note') mapCommandFeedbackRef.current = 'Note deleted'
    else if (label === 'Delete flow') mapCommandFeedbackRef.current = 'Flow deleted'
    else if (label === 'Hide flow') mapCommandFeedbackRef.current = 'Flow hidden'
    else if (label === 'Reset flow') mapCommandFeedbackRef.current = 'Flow reset'
    else if (label === 'Reset note') mapCommandFeedbackRef.current = 'Note reset'
    else if (label === 'Reset text position') mapCommandFeedbackRef.current = 'Text position reset'
    else if (label === 'Reset item') mapCommandFeedbackRef.current = 'Map item reset'
  }

  const duplicateMapItem = (data: typeof activeClient, key: string) => {
    if (!isCompatibleMapItemKey(key)) return null
    const sourceId = key.slice(key.indexOf(':') + 1)
    const layout = layoutMap(data)
    const sourceRect = layoutRect(data, key)
    if (!sourceRect) return null
    const blockedRects = [
      layout.income,
      layout.need,
      ...layout.accounts
        .filter((placed) => placed.account.id !== sourceId)
        .map((placed) => rotatedBounds(placed, placed.rot)),
      ...layout.notes
        .filter((placed) => placed.note.id !== sourceId)
        .map((placed) => ({ x: placed.x, y: placed.y, w: placed.w, h: placed.h })),
      layoutOverrideRect(data, 'asNeededChip'),
    ].filter((rect): rect is { x: number; y: number; w: number; h: number } => Boolean(rect))
    if (key.startsWith('account:')) {
      const result = duplicateMapAccount(
        data,
        sourceId,
        sourceRect,
        blockedRects,
        OVERRIDE_BOUNDS,
      )
      if (!result) return null
      let next = result.data
      for (let pass = 0; pass < 8; pass += 1) {
        const copyRect = layoutRect(next, result.targetKey)
        if (!copyRect) break
        const dx = result.rect.x - copyRect.x
        const dy = result.rect.y - copyRect.y
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) break
        const copyId = result.targetKey.slice('account:'.length)
        const override = next.layoutOverrides?.[copyId]
        next = withOverride(next, copyId, {
          dx: (override?.dx ?? 0) + dx,
          dy: (override?.dy ?? 0) + dy,
        })
      }
      return { data: next, targetKey: result.targetKey }
    }
    const result = duplicateMapNote(
      data,
      sourceId,
      sourceRect,
      blockedRects,
      OVERRIDE_BOUNDS,
    )
    return result ? { data: result.data, targetKey: result.targetKey } : null
  }

  const copySelectedMapItems = () => {
    mapClipboardRef.current = selectedMapTargetKeys
      .filter(isCompatibleMapItemKey)
      .map((key) => ({
        kind: key.startsWith('account:') ? 'account' : 'note',
        id: key.slice(key.indexOf(':') + 1),
      }))
  }

  const pasteSelectedMapItems = () => {
    if (!canMutate || mapClipboardRef.current.length === 0) return false
    let next = activeClient
    const pastedKeys: string[] = []
    for (const entry of mapClipboardRef.current) {
      const result = duplicateMapItem(next, `${entry.kind}:${entry.id}`)
      if (!result) continue
      next = result.data
      pastedKeys.push(result.targetKey)
    }
    if (next === activeClient || pastedKeys.length === 0) return false
    handleMapChange(next)
    setSelectedMapTargetKeys(pastedKeys)
    addToast(pastedKeys.length === 1
      ? pastedKeys[0].startsWith('note:') ? 'Note duplicated' : 'Account duplicated'
      : 'Map items duplicated')
    return true
  }

  const deleteSelectedMapItems = () => {
    if (!canMutate) return false
    const deletable = selectedMapTargetKeys.filter(isCompatibleMapItemKey)
    if (deletable.length === 0) return false
    let next = activeClient
    for (const key of deletable) {
      const id = key.slice(key.indexOf(':') + 1)
      next = key.startsWith('account:')
        ? deleteMapAccount(next, id)
        : deleteMapNote(next, id)
    }
    if (next === activeClient) return false
    handleMapChange(next)
    setSelectedMapTargetKeys([])
    addToast(deletable.length === 1
      ? deletable[0].startsWith('note:') ? 'Note deleted' : 'Account deleted'
      : 'Map items deleted')
    return true
  }

  useEffect(() => {
    const handleMapShortcut = (event: globalThis.KeyboardEvent) => {
      if (presentMode || dialog || mapTextEdit || isEditingTarget(event.target)) return
      const command = event.ctrlKey || event.metaKey
      if (command && !event.altKey && event.key.toLowerCase() === 'c') {
        copySelectedMapItems()
        if (selectedMapTargetKeys.some(isCompatibleMapItemKey)) event.preventDefault()
        return
      }
      if (command && !event.altKey && event.key.toLowerCase() === 'v') {
        if (pasteSelectedMapItems()) event.preventDefault()
        return
      }
      if (command && !event.altKey && event.key.toLowerCase() === 'd') {
        copySelectedMapItems()
        if (pasteSelectedMapItems()) event.preventDefault()
        return
      }
      if (!command && !event.altKey && (event.key === 'Delete' || event.key === 'Backspace')) {
        if (deleteSelectedMapItems()) event.preventDefault()
      }
    }
    window.addEventListener('keydown', handleMapShortcut)
    return () => window.removeEventListener('keydown', handleMapShortcut)
  }, [activeClient, canMutate, dialog, mapTextEdit, presentMode, selectedMapTargetKeys])

  const dismissPanZoomHint = () => {
    setPanZoomHintVisible(false)
    try {
      localStorage.setItem(PAN_ZOOM_HINT_STORAGE_KEY, 'dismissed')
    } catch {
      // Dismissal still applies for this session when storage is unavailable.
    }
  }

  const changeZoom = (change: number) => {
    // Toolbar zoom doesn't demonstrate the wheel/pan gestures, so the hint
    // stays up and gains the pan wording once zoom leaves 'fit' (slice 12).
    const scroller = previewPaneRef.current
    const page = mapPageRef.current
    if (scroller && page) {
      const scrollerRect = scroller.getBoundingClientRect()
      const pointer = {
        x: scrollerRect.left + scrollerRect.width / 2,
        y: scrollerRect.top + scrollerRect.height / 2,
      }
      const pageRect = page.getBoundingClientRect()
      pendingZoomAnchorRef.current = {
        anchor: {
          x: (pointer.x - pageRect.left) / pageRect.width,
          y: (pointer.y - pageRect.top) / pageRect.height,
        },
        pointer,
        scroller,
      }
    }
    setMapZoom((current) => {
      const level =
        current === 'fit'
          ? Math.round(fitZoom / 10) * 10
          : current
      return Math.min(200, Math.max(50, level + change))
    })
  }

  const handleMapWheel = (event: WheelEvent) => {
    if (!shouldZoomOnWheel(event)) return
    event.preventDefault()
    const currentLevel =
      mapZoom === 'fit' ? Math.round(fitZoom / 10) * 10 : mapZoom
    const nextLevel = Math.min(
      200,
      Math.max(50, currentLevel + (event.deltaY < 0 ? 10 : -10)),
    )
    if (nextLevel === currentLevel && mapZoom !== 'fit') return
    dismissPanZoomHint()

    const scroller = previewPaneRef.current
    const page = mapPageRef.current
    if (!scroller || !page) {
      setMapZoom(nextLevel)
      return
    }
    const pageRect = page.getBoundingClientRect()
    pendingZoomAnchorRef.current = {
      anchor: {
        x: (event.clientX - pageRect.left) / pageRect.width,
        y: (event.clientY - pageRect.top) / pageRect.height,
      },
      pointer: { x: event.clientX, y: event.clientY },
      scroller,
    }
    setMapZoom(nextLevel)
  }

  const handleMapWheelRef = useRef(handleMapWheel)
  handleMapWheelRef.current = handleMapWheel
  // The scroller is rendered unconditionally, so a mount-once bind is enough.
  useEffect(
    () =>
      bindMapWheel(previewPaneRef.current, (event) =>
        handleMapWheelRef.current(event),
      ),
    [],
  )

  const beginMapPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const onBackground =
      event.target instanceof Element &&
      Boolean(event.target.closest('[data-map-background]'))
    if (
      !canStartMapPan({
        mapZoom,
        button: event.button,
        presentMode,
        onBackground,
      })
    ) {
      return
    }
    const scroller = event.currentTarget
    mapPanRef.current = {
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      startScroll: { x: scroller.scrollLeft, y: scroller.scrollTop },
      moved: false,
    }
    if (!placingTextNote) scroller.setPointerCapture(event.pointerId)
    setIsMapPanning(true)
    if (!placingTextNote) event.preventDefault()
  }

  const continueMapPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = mapPanRef.current
    if (!session || session.pointerId !== event.pointerId) return
    if (
      Math.hypot(
        event.clientX - session.startPointer.x,
        event.clientY - session.startPointer.y,
      ) >= 4
    ) {
      session.moved = true
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      dismissPanZoomHint()
    }
    const next = pannedScrollPosition(
      session.startPointer,
      { x: event.clientX, y: event.clientY },
      session.startScroll,
    )
    event.currentTarget.scrollLeft = next.x
    event.currentTarget.scrollTop = next.y
    if (session.moved || !placingTextNote) event.preventDefault()
  }

  const finishMapPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = mapPanRef.current
    if (!session || session.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (session.moved && placingTextNote) {
      suppressNextTextPlacementRef.current = true
    }
    mapPanRef.current = null
    setIsMapPanning(false)
  }

  const handleQuickAdd = (bucket: Bucket, select = false) => {
    if (!canMutate) return ''
    const nextClient = freezeAsNeededChip(
      activeClient,
      appendBlankAccount(activeClient, bucket),
    )
    const account = nextClient.accounts.at(-1)!
    const current = snapshotRef.current
    commitSnapshot(
      {
        book: updateClient(current.book, activeClient.id, nextClient),
        activeClientId: activeClient.id,
      },
      null,
    )
    setShapePopoverOpen(false)
    setSelectedMapTargetKey(`account:${account.id}`)
    addToast('Account added')
    if (select) return account.id
    window.requestAnimationFrame(() => {
      const label = previewPaneRef.current?.querySelector<SVGGraphicsElement>(
        `[data-account-id="${account.id}"] .map-editable-text`,
      )
      if (!label) return
      const { left, top, width, height } = label.getBoundingClientRect()
      setMapTextEdit({
        target: { kind: 'accountLabel', accountId: account.id },
        rect: { left, top, width, height },
        rawValue: '',
        ...mapTextEditFontState(nextClient, {
          kind: 'accountLabel',
          accountId: account.id,
        }),
      })
    })
    return account.id
  }

  const openTextNoteAt = (point: { x: number; y: number }) => {
    const svg = mapPageRef.current?.querySelector('svg')
    if (!svg) return
    const svgRect = svg.getBoundingClientRect()
    const scale = svgRect.width / ARTBOARD.width
    const x = Math.min(
      OVERRIDE_BOUNDS.right - NOTE_WIDTH,
      Math.max(OVERRIDE_BOUNDS.left, point.x - NOTE_WIDTH / 2),
    )
    const y = Math.min(
      OVERRIDE_BOUNDS.bottom - 28,
      Math.max(OVERRIDE_BOUNDS.top, point.y - 14),
    )
    const target = { kind: 'noteText' as const, noteId: newId('note'), x, y }
    setPlacingTextNote(false)
    setMapTextEdit({
      target,
      rect: {
        left: svgRect.left + x * scale,
        top: svgRect.top + y * scale,
        width: NOTE_WIDTH * scale,
        height: 28 * scale,
      },
      rawValue: '',
      ...mapTextEditFontState(activeClient, target),
    })
  }

  const beginTextNotePlacement = (keyboard: boolean) => {
    if (!canMutate) return
    if (!keyboard && placingTextNote) {
      setPlacingTextNote(false)
      return
    }
    suppressNextTextPlacementRef.current = false
    dismissPanZoomHint()
    setSelectedMapTargetKey(null)
    setMapTextEdit(null)
    if (!keyboard) {
      setPlacingTextNote(true)
      return
    }
    const svg = mapPageRef.current?.querySelector('svg')
    const scroller = previewPaneRef.current
    if (!svg || !scroller) return
    const mapRect = svg.getBoundingClientRect()
    const viewport = scroller.getBoundingClientRect()
    openTextNoteAt(artboardPointFromClient({
      x: (Math.max(mapRect.left, viewport.left) + Math.min(mapRect.right, viewport.right)) / 2,
      y: (Math.max(mapRect.top, viewport.top) + Math.min(mapRect.bottom, viewport.bottom)) / 2,
    }, mapRect))
  }

  const handlePanelAddIncome = () => {
    if (!canMutate) return
    const nextClient = {
      ...activeClient,
      incomeSources: addIncomeSource(activeClient.incomeSources, ''),
    }
    handleClientChange(nextClient)
    addToast('Income source added')
    setSelectedMapTargetKey('income')
    focusDataTarget('income', 'income')
  }

  const handlePanelAddAccount = (bucket: Bucket) => {
    if (!canMutate) return
    const id = handleQuickAdd(bucket, true)
    if (id) focusDataTarget('accounts', id)
  }

  const handlePanelAddFlow = (sourceId: string, targetId: string) => {
    if (!canMutate) return
    const nextClient = addCustomArrow(activeClient, sourceId, targetId)
    if (nextClient === activeClient) return
    const arrow = nextClient.customArrows?.at(-1)
    handleMapChange(nextClient, 'Flow added')
    if (arrow) setSelectedMapTargetKey(`arrow:custom:${arrow.id}`)
  }

  const handleConnectorDrop = (sourceId: string, targetId: string) => {
    if (!canMutate) return
    const nextClient = addCustomArrow(activeClient, sourceId, targetId)
    if (nextClient === activeClient) return
    const arrow = nextClient.customArrows?.at(-1)
    handleMapChange(nextClient, 'Flow added')
    if (arrow) setSelectedMapTargetKey(`arrow:custom:${arrow.id}`)
  }

  const handlePanelAddFinePrint = () => {
    if (!canMutate) return
    const nextClient = {
      ...activeClient,
      footnotes: [
        ...activeClient.footnotes,
        { id: newId('footnote'), label: '', gross: null, net: null },
      ],
    }
    handleClientChange(nextClient)
    focusDataTarget('need', 'need')
    addToast('Fine print added')
  }

  const placeTextNote = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!placingTextNote) return
    if (suppressNextTextPlacementRef.current) {
      suppressNextTextPlacementRef.current = false
      return
    }
    const svg = mapPageRef.current?.querySelector('svg')
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      return
    }
    // Armed placement outranks whatever shape sits under the pointer.
    event.preventDefault()
    event.stopPropagation()
    openTextNoteAt(artboardPointFromClient(
      { x: event.clientX, y: event.clientY },
      rect,
    ))
  }

  const consumePanPlacementClick = () => {
    if (placingTextNote && suppressNextTextPlacementRef.current) {
      suppressNextTextPlacementRef.current = false
    }
  }

  const consumePanPlacementPointerDown = () => {
    if (placingTextNote && suppressNextTextPlacementRef.current) {
      suppressNextTextPlacementRef.current = false
    }
  }

  const zoomControls = (
    <div className="zoom-cluster" aria-label="Map zoom">
      <button
        aria-label="Zoom out"
        disabled={mapZoom === 50}
        type="button"
        onClick={() => changeZoom(-10)}
      >
        −
      </button>
      <output aria-label="Zoom level">
        {mapZoom === 'fit' ? `${fitZoom}%` : `${mapZoom}%`}
      </output>
      <button
        aria-label="Zoom in"
        disabled={mapZoom === 200}
        type="button"
        onClick={() => changeZoom(10)}
      >
        +
      </button>
      <button
        aria-pressed={mapZoom === 'fit'}
        type="button"
        onClick={() => setMapZoom('fit')}
      >
        Fit
      </button>
    </div>
  )

  return (
    <main
      ref={appShellRef}
      className={`app-shell${presentMode ? ' is-presenting' : ''}`}
    >
      <header className="app-header">
        <div className="wordmark">
          <Mark />
          <span>Money Map</span>
        </div>
        <div className="header-client-actions">
          <ClientCombobox
            clients={book.clients}
            value={activeClient.id}
            onChange={selectClient}
          />
          <Menu
            ariaLabel="More actions"
            trigger={<><span>More</span><span aria-hidden="true" className="menu-caret">&#x25BE;</span></>}
            triggerClassName="more-menu-trigger"
          >
            <MenuItem disabled={!canMutate} onClick={handleNew}>New client</MenuItem>
            <MenuItem disabled={!canMutate} onClick={handleDuplicate}>Duplicate client</MenuItem>
            <MenuItem danger disabled={!canMutate} onClick={handleDelete}>Delete client</MenuItem>
            <MenuSeparator />
            <div className="menu-section-label">Book</div>
            <MenuItem onClick={handleSaveBook}>Download book backup</MenuItem>
            <MenuItem disabled={!canMutate} onClick={() => fileInputRef.current?.click()}>Open book backup</MenuItem>
            {fileStoreSupported && <MenuSeparator />}
            {fileStoreSupported && !connectedFile && (
              <>
                <MenuItem onClick={() => void handleCreateConnectedFile()}>Save changes to a file...</MenuItem>
                <MenuItem onClick={() => void handleOpenConnectedFile()}>Open and keep saving...</MenuItem>
              </>
            )}
            {fileStoreSupported && reconnectFile && !connectedFile && (
              <MenuItem className="reconnect-menu-item" title={reconnectFile.name} onClick={() => void replaceBookFromFile(reconnectFile, true)}>
                Resume saving to {reconnectFile.name}
              </MenuItem>
            )}
            {connectedFile && (
              <>
                <div className="menu-file-connection" title={connectedFile.name}>
                  <span className="menu-file-name">{connectedFile.name}</span>
                  <span className="menu-file-status">{fileSaveStatus === 'saving' ? 'Saving...' : 'Saved'}</span>
                </div>
                <MenuItem onClick={handleDisconnectFile}>Stop saving to this file</MenuItem>
              </>
            )}
            <MenuSeparator />
            <div className="menu-section-label">Map</div>
            <MenuItem disabled={!canMutate || !hasLayoutOverrides} onClick={() => setDialog({ kind: 'resetLayout' })}>Reset arrangement</MenuItem>
            <MenuItem disabled={!canMutate || !hasTextPositionOverrides} onClick={() => setDialog({ kind: 'resetTextPositions' })}>Reset all text positions...</MenuItem>
            {hasHiddenArrows && <MenuItem disabled={!canMutate} onClick={handleRestoreGeneratedArrows}>Restore automatic flows</MenuItem>}
            <MenuItem danger disabled={!canMutate} onClick={() => setDialog({ kind: 'clearMap', clientId: activeClient.id, name: activeClient.client.title || 'Untitled' })}>Clear map...</MenuItem>
          </Menu>
        </div>
        <div className="header-history-actions">
          <button aria-label="Undo" className="quiet-button history-button" disabled={!canMutate || history.past.length === 0} title="Undo (Ctrl+Z)" type="button" onClick={handleUndo}>&#x21B6;</button>
          <button aria-label="Redo" className="quiet-button history-button" disabled={!canMutate || history.future.length === 0} title="Redo (Ctrl+Shift+Z or Ctrl+Y)" type="button" onClick={handleRedo}>&#x21B7;</button>
        </div>
        <div className="header-spacer" />
        <div className="header-payoff-actions">
          <button
            className="quiet-button"
            type="button"
            onClick={() => void handlePresent()}
          >
            Present
          </button>
          <div className="header-primary-actions">
            <button
              className="primary-button"
              type="button"
              onClick={handlePrint}
            >
              Print
            </button>
            <Menu
              ariaLabel="Export map"
              trigger={
                <>
                  <span>Export</span>
                  <span aria-hidden="true" className="menu-caret">
                    ▾
                  </span>
                </>
              }
              triggerClassName="primary-button save-menu-trigger"
            >
              <MenuItem disabled={Boolean(exporting)} onClick={() => void handleExportPng()}>
                PNG image
              </MenuItem>
              <MenuItem disabled={Boolean(exporting)} onClick={() => void handleExport('pdf')}>
                PDF image snapshot
              </MenuItem>
              <MenuItem disabled={Boolean(exporting)} onClick={() => void handleExport('svg')}>
                SVG image
              </MenuItem>
              <MenuSeparator />
              <div
                className="save-menu-status"
                title={connectedFile?.name}
              >
                {exporting ? `Exporting ${exporting.toUpperCase()}…` : connectedFile && canMutate
                  ? `${fileSaveStatus === 'saving' ? 'Saving to' : 'Saved to'} ${connectedFile.name}`
                  : browserPersistenceLabel(DATA_MODE, isWriter, browserSaveStatus, writerTakeoverPending)}
              </div>
            </Menu>
          </div>
        </div>
        <input
          ref={fileInputRef}
          accept=".json"
          aria-label="Open book backup file"
          disabled={!canMutate}
          className="visually-hidden"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void handleLoad(file)
            event.target.value = ''
          }}
        />
      </header>
      {!presentMode && <div className="app-status-stack" aria-live="polite">
        {DATA_MODE === 'demo' && <section className="app-status-banner is-demo"><strong>Public demo</strong><span>Changes disappear when you close this tab. Do not enter real client information.</span></section>}
        {recovery && <section className="app-status-banner is-danger"><strong>Saved copy needs recovery</strong><span>{recovery.message} Nothing was overwritten.</span><button type="button" onClick={downloadRecoveryCopy}>Download damaged copy</button><button type="button" onClick={() => { const next=newBook(); const error=saveBrowserBook(localStorage,next); if(error){setBrowserSaveError(error);setBrowserSaveStatus('error')}else{setRecovery(null);showSnapshot({book:next,activeClientId:next.clients[0].id})} }}>Start fresh</button></section>}
        {browserSaveStatus === 'error' && <section className="app-status-banner is-danger"><strong>Changes are not being saved</strong><span>{browserSaveError}</span><button type="button" onClick={flushBrowserSave}>Try again</button></section>}
      </div>}
      <div className={`workspace${editorPanel ? ' has-editor-panel' : ''}${guidedSetup ? ' is-guided-setup' : ''}`}>
        {guidedSetup ? (
          <aside className="form-pane" aria-label="Client editor">
            <fieldset className="mutation-fieldset" disabled={!canMutate}>
              <Wizard
                currentStep={wizardStep}
                data={activeClient}
                done={wizardDone}
                hasWarnings={false}
                focusRequest={focusRequest}
                onChange={handleClientChange}
                onCurrentStepChange={setWizardStep}
                onDoneChange={setWizardDone}
                onExportPng={() => void handleExportPng()}
                onFullForm={() => {
                  setGuidedSetup(false)
                  setFocusRequest(undefined)
                  setEditorPanel('data')
                }}
                onHoverAccount={setHighlightId}
                selectedAccountId={
                  selectedMapTargetKey?.startsWith('account:')
                    ? selectedMapTargetKey.slice('account:'.length)
                    : null
                }
                onSelectAccount={(id) =>
                  setSelectedMapTargetKey(`account:${id}`)
                }
                onPrint={handlePrint}
                vocabulary={vocabulary}
              />
            </fieldset>
          </aside>
        ) : (
          <>
            <EditorRail
              activePanel={editorPanel}
              onToggle={(panel) => {
                if (editorPanel === panel) closeDataPanel()
                else {
                  setFocusRequest(undefined)
                  setEditorPanel(panel)
                }
              }}
            />
            {(editorPanel === 'add' || editorPanel === 'contents' || editorPanel === 'help') && (
              <EditorPanels
                activePanel={editorPanel}
                canMutate={canMutate}
                data={activeClient}
                headingRef={editorPanelHeadingRef}
                onAddAccount={handlePanelAddAccount}
                onAddFinePrint={handlePanelAddFinePrint}
                onAddFlow={handlePanelAddFlow}
                onAddIncome={handlePanelAddIncome}
                onAddTextNote={() => beginTextNotePlacement(true)}
                onClose={closeDataPanel}
                onOpenData={(focusId) => {
                  if (focusId === 'income') {
                    focusDataTarget('income', 'income')
                  } else if (focusId === 'need') {
                    focusDataTarget('need', 'need')
                  } else if (focusId === 'accounts') {
                    setEditorPanel('data')
                    setDataFilter('')
                    setDataSection('accounts')
                    setFocusRequest(undefined)
                  } else {
                    setEditorPanel('data')
                    setDataFilter('')
                    setDataSection(undefined)
                    setFocusRequest(undefined)
                  }
                }}
                onRestoreGeneratedFlows={handleRestoreGeneratedArrows}
                onSelectTarget={handleMapSelectionChange}
                onSetNeed={() => focusDataTarget('need', 'need')}
                selectedTargetKey={selectedMapTargetKey}
              />
            )}
            {editorPanel === 'data' && (
              <aside
                aria-labelledby="editor-panel-title"
                className="editor-panel"
                role="dialog"
              >
                <h2 id="editor-panel-title" ref={editorPanelHeadingRef} tabIndex={-1}>
                  Data
                </h2>
                <fieldset className="mutation-fieldset" disabled={!canMutate}>
                  <Form
                    data={activeClient}
                    key={activeClient.id + ':' + formRevision}
                    filter={dataFilter}
                    focusRequest={focusRequest}
                    onChange={handleClientChange}
                    onFilterChange={setDataFilter}
                    onHoverAccount={setHighlightId}
                    activeSection={dataSection}
                    onSectionFocus={setDataSection}
                    selectedAccountId={
                      selectedMapTargetKey?.startsWith('account:')
                        ? selectedMapTargetKey.slice('account:'.length)
                        : null
                    }
                    onSelectAccount={(id) =>
                      setSelectedMapTargetKey(`account:${id}`)
                    }
                    vocabulary={vocabulary}
                  />
                </fieldset>
              </aside>
            )}
          </>
        )}
        <section
            className={`preview-pane${selectedMapTargetKey && !presentMode && canMutate ? ' has-map-inspector' : ''}`}
            aria-label="Money Map preview"
            onClickCapture={handleMapCommandCapture}
          >
          {DATA_MODE === 'real' && !presentMode && !canMutate && (
            <button
              type="button"
              className="map-readonly-banner"
              onClick={requestBrowserWriterTakeover}
            >
              View only — editing is active in another tab. Click to take over.
            </button>
          )}
          {selectedMapTargetKey && !presentMode && canMutate && (
            <MapInspector
              data={activeClient}
              selectedTargetKey={selectedMapTargetKey}
              selectedTargetKeys={selectedMapTargetKeys}
              onChange={handleMapChange}
              onClose={() => handleMapSelectionChange(null)}
              onDetails={handleMapDetails}
              onSelect={handleMapSelectionChange}
            />
          )}
          <div
            ref={previewPaneRef}
            className={`map-scroller${
              mapZoom === 'fit' ? '' : ' is-pan-enabled'
            }${isMapPanning ? ' is-panning' : ''}`}
            onClick={consumePanPlacementClick}
            onPointerCancel={finishMapPan}
            onPointerDown={(event) => {
              consumePanPlacementPointerDown()
              beginMapPan(event)
            }}
            onPointerMove={continueMapPan}
            onPointerUp={finishMapPan}
          >
            <div
              className={`map-stage${
                mapZoom === 'fit' ? '' : ' is-zoomed'
              }`}
            >
              <div
                ref={mapPageRef}
                className={`map-page${
                  mapZoom === 'fit' ? '' : ' is-zoomed'
                }${placingTextNote ? ' is-placing-text' : ''}`}
                onClickCapture={placeTextNote}
                style={
                  mapZoom === 'fit'
                    ? undefined
                    : { width: ARTBOARD.width * (mapZoom / 100) }
                }
              >
                <MapSvg
                  data={previewClient}
                  highlightId={presentMode ? undefined : highlightId}
                  onChange={presentMode || !canMutate ? undefined : handleMapChange}
                  onConnectorDrop={
                    presentMode || !canMutate
                      ? undefined
                      : handleConnectorDrop
                  }
                  onElementClick={
                    presentMode || !canMutate ? undefined : handleMapElementClick
                  }
                  onGestureStart={presentMode || !canMutate ? undefined : handleMapGestureStart}
                  onSelectedTargetKeysChange={handleMapSelectionKeysChange}
                  selectedTargetKey={selectedMapTargetKey}
                  selectedTargetKeys={selectedMapTargetKeys}
                />
              </div>
            </div>
            {mapTextEdit && !presentMode && canMutate && (
              <MapTextEditor
                containerRef={previewPaneRef}
                edit={mapTextEdit}
                key={JSON.stringify(mapTextEdit.target)}
                onCancel={() => closeMapTextEditor(true)}
                onCommit={(rawValue) => {
                  if (discardMapTextCommitRef.current) {
                    setMapTextEdit(null)
                    return
                  }
                  let nextClient = applyMapTextEdit(
                    activeClient,
                    mapTextEdit.target,
                    rawValue,
                  )
                  const fsInfo = mapTextEditFsInfo(
                    activeClient,
                    mapTextEdit.target,
                  )
                  if (
                    mapTextEdit.fontSizeChanged &&
                    mapTextEdit.fontSize !== undefined &&
                    fsInfo
                  ) {
                    nextClient = applyMapTextFontSize(
                      nextClient,
                      mapTextEdit.target,
                      mapTextEdit.fontSize,
                    )
                  }
                  if (nextClient !== activeClient) {
                    handleClientChange(nextClient)
                    if (mapTextEdit.target.kind === 'noteText') {
                      setSelectedMapTargetKey(
                        `note:${mapTextEdit.target.noteId}`,
                      )
                      addToast('Text note added')
                    }
                  }
                  setMapTextEdit(null)
                }}
                onFontSizeChange={(fontSize) =>
                  setMapTextEdit((current) =>
                    current
                      ? { ...current, fontSize, fontSizeChanged: true }
                      : current,
                  )
                }
              />
            )}
          </div>
          {!presentMode && (
            <div className="map-chrome">
              <button
                disabled={!canMutate || !canTidyMap}
                title={canTidyMap ? 'Align movable items to the grid' : 'Already aligned'}
                type="button"
                onClick={handleTidyMap}
              >
                Tidy map
              </button>
              <button
                aria-label="Add text note"
                aria-pressed={placingTextNote}
                type="button"
                onClick={(event) => beginTextNotePlacement(event.detail === 0)}
              >
                + Text note
              </button>
              <div ref={shapePopoverRef} className="shape-quick-add">
                <button
                  ref={shapePopoverButtonRef}
                  aria-expanded={shapePopoverOpen}
                  type="button"
                  onClick={() => {
                    if (!shapePopoverOpen) dismissPanZoomHint()
                    setShapePopoverOpen((open) => !open)
                  }}
                >
                  + Account
                </button>
                {shapePopoverOpen && (
                  <div className="shape-popover" aria-label="Add account">
                    {ACCOUNT_PRESETS.map((preset, index) => (
                      <button
                        ref={index === 0 ? firstShapePresetRef : undefined}
                        className={`account-preset-button bucket-${preset.bucket}`}
                        key={preset.bucket}
                        type="button"
                        onClick={() => handleQuickAdd(preset.bucket)}
                      >
                        <span aria-hidden="true" className="account-swatch" />
                        {preset.chipLabel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {placingTextNote && (
                <span className="text-placement-hint" role="status">
                  Click the map to place text. Escape cancels.
                </span>
              )}
              {panZoomHintVisible && (
                <aside className="pan-zoom-hint">
                  <span>
                    {mapZoom === 'fit'
                      ? 'Hold Ctrl (or ⌘ on Mac) while scrolling to zoom.'
                      : 'Hold Ctrl (or ⌘ on Mac) while scrolling to zoom. Drag the map background to pan.'}
                  </span>
                  <button type="button" onClick={dismissPanZoomHint}>Got it</button>
                </aside>
              )}
              {zoomControls}
            </div>
          )}
          {presentMode && (
            <>
              <div className="present-zoom">{zoomControls}</div>
              <div className="present-hint">Esc to exit</div>
            </>
          )}
        </section>
      </div>
      <div ref={printMapRef} aria-hidden="true" className="print-map">
        <MapSvg data={activeClient} />
      </div>
      {dialog?.kind === 'delete' && (
        <Dialog
          confirmLabel="Delete"
          danger
          open
          title="Delete client"
          onClose={() => setDialog(null)}
          onConfirm={() => confirmDelete(dialog.clientId)}
        >
          Delete {dialog.name}? You can undo this action.
        </Dialog>
      )}
      {dialog?.kind === 'error' && (
        <Dialog
          confirmLabel="Close"
          open
          title={dialog.title}
          onClose={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
        >
          {dialog.message}
        </Dialog>
      )}
      {dialog?.kind === 'loadBook' && (
        <Dialog
          confirmLabel="Stop saving and open"
          danger
          open
          title="Open another book?"
          onClose={() => setDialog(null)}
          onConfirm={() => applyLoadedBook(dialog.book)}
        >
          Opening another book stops saving changes to {connectedFile?.name}. That file will not be changed.
        </Dialog>
      )}
      {dialog?.kind === 'resetLayout' && (
        <Dialog
          confirmLabel="Reset"
          danger
          open
          title="Reset arrangement"
          onClose={() => setDialog(null)}
          onConfirm={handleResetLayout}
        >
          Return every map item to its automatic position?
        </Dialog>
      )}
      {dialog?.kind === 'resetTextPositions' && (
        <Dialog
          confirmLabel="Reset text positions"
          open
          title="Reset all text positions?"
          onClose={() => setDialog(null)}
          onConfirm={handleResetTextPositions}
        >
          Return all map text to its default position? You can undo this action.
        </Dialog>
      )}
      {dialog?.kind === 'clearMap' && (
        <Dialog
          confirmLabel="Clear map"
          danger
          open
          title="Clear map"
          onClose={() => setDialog(null)}
          onConfirm={() => confirmClearMap(dialog.clientId)}
        >
          Clear the map for {dialog.name}? This removes all accounts, income
          sources, monthly amount needed, account withdrawal, after-tax income, fine print, and
          arrangement. The client stays in your book. One Undo brings
          everything back.
        </Dialog>
      )}
      <Toast messages={toasts} onDismiss={dismissToast} />
    </main>
  )
}
