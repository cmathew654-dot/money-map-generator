import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
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
import { layoutMap, NOTE_WIDTH } from './layout/layout'
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
import { Form } from './form/Form'
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
  pannedScrollPosition,
  restoreGeneratedArrows,
} from './render/mapInteraction'
import { ARTBOARD } from './render/tokens'
import { Dialog } from './ui/Dialog'
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

const FORM_MODE_STORAGE_KEY = 'money-map-form-mode:v1'
const WRITER_TAKEOVER_REQUEST_KEY = 'money-map-generator:writer-takeover-request'
const WRITER_TAKEOVER_POLL_MS = 250

type FormMode = 'guided' | 'full'
type FileSaveStatus = 'saved' | 'saving'
type BrowserSaveStatus = 'saved' | 'saving' | 'error'
type MapZoom = 'fit' | number

export function canMutateBook(dataMode: 'demo' | 'real', isWriter: boolean, recovering: boolean) {
  return !recovering && (dataMode === 'demo' || isWriter)
}

export function canWriteConnectedBook(canMutate: boolean, connected: boolean) {
  return canMutate && connected
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
  | { kind: 'clearMap'; clientId: string; name: string }

function initialBrowserBook(): BrowserBookLoad { return loadBrowserBook(localStorage) }

function initialFormMode(): FormMode {
  try {
    return localStorage.getItem(FORM_MODE_STORAGE_KEY) === 'full'
      ? 'full'
      : 'guided'
  } catch {
    return 'guided'
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

export default function App() {
  const [initialLoad] = useState(initialBrowserBook)
  const [snapshot, setSnapshot] = useState<BookSnapshot>(() => {
    const book = initialLoad.book
    return { book, activeClientId: book.clients[0].id }
  })
  const [history, setHistory] = useState<BookHistory>(emptyHistory)
  const [formMode, setFormMode] = useState<FormMode>(initialFormMode)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardDone, setWizardDone] = useState(false)
  const [focusRequest, setFocusRequest] = useState<{
    id: string
    at: number
  }>()
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [mapTextEdit, setMapTextEdit] =
    useState<ActiveMapTextEdit | null>(null)
  const [selectedMapTargetKey, setSelectedMapTargetKey] = useState<
    string | null
  >(null)
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
  const [tabId] = useState(() => newId('tab'))
  const [isWriter, setIsWriter] = useState(() => DATA_MODE === 'real' && acquireBrowserWriter(localStorage, tabId).status === 'acquired')
  const [writerTakeoverPending, setWriterTakeoverPending] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [mapZoom, setMapZoom] = useState<MapZoom>('fit')
  const [fitZoom, setFitZoom] = useState(100)
  const [isMapPanning, setIsMapPanning] = useState(false)
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
  const writerFocusRequestedRef = useRef(false)
  const writerFocusInitializedRef = useRef(false)
  const exportInFlightRef = useRef<'png' | 'pdf' | 'svg' | null>(null)
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
  } | null>(null)
  const shapePopoverRef = useRef<HTMLDivElement>(null)
  const printMapRef = useRef<HTMLDivElement>(null)
  const { book, activeClientId } = snapshot
  const canMutate = canMutateBook(DATA_MODE, isWriter, Boolean(recovery))
  const vocabulary = useMemo(() => buildVocabulary(book), [book])
  const activeClient =
    book.clients.find((client) => client.id === activeClientId) ??
    book.clients[0]
  const hasLayoutOverrides =
    Object.keys(activeClient.layoutOverrides ?? {}).length > 0
  const hasHiddenArrows = (activeClient.hiddenArrows?.length ?? 0) > 0
  const mapWarnings = layoutMap(activeClient).warnings
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
    setSelectedMapTargetKey(null)
  }, [activeClient.id])

  useEffect(() => {
    if (!selectedMapTargetKey) return
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedMapTargetKey(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedMapTargetKey])

  useEffect(() => {
    if (!shapePopoverOpen) return
    const closeOnPointerDown = (event: globalThis.PointerEvent) => {
      if (!shapePopoverRef.current?.contains(event.target as Node)) {
        setShapePopoverOpen(false)
      }
    }
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setShapePopoverOpen(false)
    }
    window.addEventListener('pointerdown', closeOnPointerDown)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnPointerDown)
      window.removeEventListener('keydown', closeOnEscape)
    }
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
      showSnapshot(next)
      setMapTextEdit(null)
      setDialog(null)
      resetWizard()
    },
    [resetWizard, showSnapshot],
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
    ])
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
    if (DATA_MODE !== 'real' || !isWriter || recovery || currentBrowserWriter(localStorage) !== tabId) return
    const error = saveBrowserBook(localStorage, snapshotRef.current.book)
    setBrowserSaveStatus(error ? 'error' : 'saved'); setBrowserSaveError(error ?? '')
  }, [isWriter, recovery, tabId])
  const clearWriterTakeoverTimer = useCallback(() => {
    if (writerTakeoverTimerRef.current === null) return
    window.clearTimeout(writerTakeoverTimerRef.current)
    writerTakeoverTimerRef.current = null
  }, [])
  const adoptLatestBrowserBook = useCallback(() => {
    const latest = loadBrowserBook(localStorage)
    if (latest.status === 'ready') {
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
  }, [showHistory, showSnapshot])
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
    writerFocusInitializedRef.current = true
    const requestOnFocus = () => {
      if (
        document.visibilityState !== 'visible' ||
        !document.hasFocus() ||
        isWriter ||
        writerTakeoverPending ||
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
    }
  }, [isWriter, requestBrowserWriterTakeover, writerTakeoverPending])
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
    const flush = () => flushBrowserSave(); const hidden = () => { if (document.visibilityState === 'hidden') flush() }
    const handlePageHide = () => { flushBrowserSave(); releaseBrowserWriter(localStorage, tabId) }
    const handlePageShow = () => {
      if (acquireBrowserWriter(localStorage, tabId).status === 'acquired') {
        finishBrowserWriterTakeover()
      } else {
        setIsWriter(false)
      }
    }
    const storage = (event: StorageEvent) => {
      if (event.key === WRITER_TAKEOVER_REQUEST_KEY && event.newValue && isWriter && currentBrowserWriter(localStorage) === tabId) {
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
  }, [finishBrowserWriterTakeover, flushBrowserSave, isWriter, showHistory, showSnapshot, tabId])

  useEffect(
    () => () => {
      if (writerTakeoverTimerRef.current !== null) window.clearTimeout(writerTakeoverTimerRef.current)
      if (DATA_MODE === 'real') releaseBrowserWriter(localStorage, tabId)
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
    try {
      localStorage.setItem(FORM_MODE_STORAGE_KEY, formMode)
    } catch {
      // The selected mode remains usable for this session.
    }
  }, [formMode])

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

  const exitPresentMode = useCallback(() => {
    setPresentMode(false)
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
        setPresentMode(false)
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

      commitSnapshot(
        {
          book: resolution.book,
          activeClientId: resolution.book.clients[0].id,
        },
        null,
      )
      setMapTextEdit(null)
      resetWizard()
      rememberConnectedFile(handle)
      addToast(isReconnect ? 'Saving to this file again' : 'Changes will now save to this file')
    },
    [addToast, canMutate, commitSnapshot, rememberConnectedFile, resetWizard],
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
    setMapTextEdit(null)
    setShapePopoverOpen(false)
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
    setMapTextEdit(null)
    showSnapshot({ ...snapshotRef.current, activeClientId: id })
    resetWizard()
  }

  const handleNew = () => {
    const result = addClient(snapshotRef.current.book)
    commitSnapshot(
      { book: result.book, activeClientId: result.id },
      result.id,
    )
    setMapTextEdit(null)
    resetWizard()
  }

  const handleDuplicate = () => {
    const result = duplicateClient(
      snapshotRef.current.book,
      activeClient.id,
    )
    commitSnapshot(
      { book: result.book, activeClientId: result.id },
      result.id,
    )
    setMapTextEdit(null)
    resetWizard()
  }

  const handleDelete = () => {
    setDialog({
      kind: 'delete',
      clientId: activeClient.id,
      name: activeClient.client.title || 'Untitled',
    })
  }

  const handleResetLayout = () => {
    handleClientChange(resetArrangement(activeClient))
    setDialog(null)
    addToast('Arrangement reset')
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
    commitSnapshot(
      { book: nextBook, activeClientId: nextBook.clients[0].id },
      clientId,
    )
    setMapTextEdit(null)
    resetWizard()
    setDialog(null)
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
    commitSnapshot({ book: nextBook, activeClientId: nextBook.clients[0].id }, null)
    setMapTextEdit(null)
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

  const handleMapElementClick = (target: MapElementTarget) => {
    if (target.kind === 'edit') {
      setMapTextEdit({
        color: target.color,
        target: target.edit,
        rect: target.rect,
        rawValue: mapTextEditRawValue(activeClient, target.edit),
        ...mapTextEditFontState(activeClient, target.edit),
      })
      return
    }
    setMapTextEdit(null)
    if (formMode === 'guided') {
      const stepNumber = wizardStepNumberForMapTarget(target.kind)
      if (stepNumber !== null) {
        setWizardStep(stepNumber - 1)
        setWizardDone(false)
      }
    }
    const id = target.kind === 'account' ? target.id : target.kind
    if (!id) return
    focusRequestCounter.current += 1
    setFocusRequest({ id, at: focusRequestCounter.current })
  }

  const handleClientChange = (next: typeof activeClient) => {
    const current = snapshotRef.current
    commitSnapshot(
      {
        book: updateClient(current.book, next.id, next),
        activeClientId: next.id,
      },
      next.id,
    )
  }

  const handleMapChange = (next: typeof activeClient) => {
    const current = snapshotRef.current
    commitSnapshot(
      {
        book: updateClient(current.book, next.id, next),
        activeClientId: next.id,
      },
      null,
    )
  }

  const changeZoom = (change: number) => {
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

  const handleMapWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if ((!event.ctrlKey && !event.metaKey) || event.deltaY === 0) return
    event.preventDefault()
    const currentLevel =
      mapZoom === 'fit' ? Math.round(fitZoom / 10) * 10 : mapZoom
    const nextLevel = Math.min(
      200,
      Math.max(50, currentLevel + (event.deltaY < 0 ? 10 : -10)),
    )
    if (nextLevel === currentLevel && mapZoom !== 'fit') return

    const scroller = event.currentTarget
    const page = mapPageRef.current
    if (!page) {
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

  const beginMapPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      mapZoom === 'fit' ||
      event.button !== 0 ||
      !(event.target instanceof Element) ||
      !event.target.closest('[data-map-background]')
    ) {
      return
    }
    const scroller = event.currentTarget
    mapPanRef.current = {
      pointerId: event.pointerId,
      startPointer: { x: event.clientX, y: event.clientY },
      startScroll: { x: scroller.scrollLeft, y: scroller.scrollTop },
    }
    scroller.setPointerCapture(event.pointerId)
    setIsMapPanning(true)
    event.preventDefault()
  }

  const continueMapPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = mapPanRef.current
    if (!session || session.pointerId !== event.pointerId) return
    const next = pannedScrollPosition(
      session.startPointer,
      { x: event.clientX, y: event.clientY },
      session.startScroll,
    )
    event.currentTarget.scrollLeft = next.x
    event.currentTarget.scrollTop = next.y
    event.preventDefault()
  }

  const finishMapPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    const session = mapPanRef.current
    if (!session || session.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    mapPanRef.current = null
    setIsMapPanning(false)
  }

  const handleQuickAdd = (bucket: Bucket) => {
    const nextClient = appendBlankAccount(activeClient, bucket)
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
  }

  const handleAddNote = () => {
    const svg = mapPageRef.current?.querySelector('svg')
    if (!svg) return
    const svgRect = svg.getBoundingClientRect()
    const scale = svgRect.width / ARTBOARD.width
    const x = (ARTBOARD.width - NOTE_WIDTH) / 2
    const y = ARTBOARD.height / 2
    const target = { kind: 'noteText' as const, noteId: newId('note'), x, y }
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
          <select
            aria-label="Active client"
            className="client-select"
            value={activeClient.id}
            onChange={(event) => selectClient(event.target.value)}
          >
            {book.clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client.title || 'Untitled'}
              </option>
            ))}
          </select>
          <button
            className="quiet-button compact-button"
            disabled={!canMutate}
            type="button"
            onClick={handleNew}
          >
            New
          </button>
          <Menu
            ariaLabel="Client menu"
            trigger={<span aria-hidden="true">⋯</span>}
            triggerClassName="client-menu-trigger"
          >
            <MenuItem disabled={!canMutate} onClick={handleDuplicate}>Duplicate</MenuItem>
            <MenuItem danger disabled={!canMutate} onClick={handleDelete}>
              Delete
            </MenuItem>
          </Menu>
        </div>
        <div className="header-history-actions">
          <button
            aria-label="Undo"
            className="quiet-button history-button"
            disabled={!canMutate || history.past.length === 0}
            title="Undo (Ctrl+Z)"
            type="button"
            onClick={handleUndo}
          >
            ↶
          </button>
          <button
            aria-label="Redo"
            className="quiet-button history-button"
            disabled={!canMutate || history.future.length === 0}
            title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
            type="button"
            onClick={handleRedo}
          >
            ↷
          </button>
        </div>
        <Menu
          ariaLabel="Book menu"
          trigger={
            <>
              <span>Book</span>
              <span aria-hidden="true" className="menu-caret">
                ▾
              </span>
              {connectedFile && (
                <span className="book-connection-summary">
                  <span aria-hidden="true" className="connection-dot" />
                  <span className="book-connection-name">
                    {connectedFile.name}
                  </span>
                </span>
              )}
            </>
          }
          triggerClassName="book-menu-trigger"
        >
          <MenuItem onClick={handleSaveBook}>
            Download book backup
          </MenuItem>
          <MenuItem disabled={!canMutate} onClick={() => fileInputRef.current?.click()}>
            Open book backup
          </MenuItem>
          {fileStoreSupported && <MenuSeparator />}
          {fileStoreSupported && !connectedFile && (
            <>
              <MenuItem onClick={() => void handleCreateConnectedFile()}>
                Save changes to a file…
              </MenuItem>
              <MenuItem onClick={() => void handleOpenConnectedFile()}>
                Open and keep saving…
              </MenuItem>
            </>
          )}
          {fileStoreSupported && reconnectFile && !connectedFile && (
            <MenuItem
              className="reconnect-menu-item"
              title={reconnectFile.name}
              onClick={() => void replaceBookFromFile(reconnectFile, true)}
            >
              Resume saving to {reconnectFile.name}
            </MenuItem>
          )}
          {connectedFile && (
            <>
              <div className="menu-file-connection" title={connectedFile.name}>
                <span className="menu-file-name">{connectedFile.name}</span>
                <span className="menu-file-status">
                  {fileSaveStatus === 'saving' ? 'Saving…' : 'Saved'}
                </span>
              </div>
              <MenuItem onClick={handleDisconnectFile}>Stop saving to this file</MenuItem>
            </>
          )}
        </Menu>
        <div className="header-spacer" />
        <div className="header-payoff-actions">
          <Menu
            ariaLabel="Reset menu"
            trigger={
              <>
                <span>Reset</span>
                <span aria-hidden="true" className="menu-caret">
                  ▾
                </span>
              </>
            }
            triggerClassName="reset-menu-trigger"
          >
            <MenuItem
              disabled={!canMutate || !hasLayoutOverrides}
              onClick={() => setDialog({ kind: 'resetLayout' })}
            >
              Reset arrangement
            </MenuItem>
            {hasHiddenArrows && (
              <MenuItem disabled={!canMutate} onClick={handleRestoreGeneratedArrows}>
                Restore automatic flows
              </MenuItem>
            )}
            <MenuItem
              danger
              disabled={!canMutate}
              onClick={() =>
                setDialog({
                  kind: 'clearMap',
                  clientId: activeClient.id,
                  name: activeClient.client.title || 'Untitled',
                })
              }
            >
              Clear map…
            </MenuItem>
          </Menu>
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
                PDF snapshot
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
        {mapWarnings.length > 0 && <details className="app-status-banner is-danger"><summary>Map needs attention</summary>{mapWarnings.map((warning, index) => {
          const targetKey = warning.targetKey
          const key = `${warning.code}:${targetKey ?? index}`
          return targetKey && targetKey !== 'client'
            ? <button key={key} type="button" onClick={() => setSelectedMapTargetKey(targetKey)}>{warning.message}</button>
            : <span key={key}>{warning.message}</span>
        })}</details>}
        {recovery && <section className="app-status-banner is-danger"><strong>Saved copy needs recovery</strong><span>{recovery.message} Nothing was overwritten.</span><button type="button" onClick={downloadRecoveryCopy}>Download damaged copy</button><button type="button" onClick={() => { const next=newBook(); const error=saveBrowserBook(localStorage,next); if(error){setBrowserSaveError(error);setBrowserSaveStatus('error')}else{setRecovery(null);showSnapshot({book:next,activeClientId:next.clients[0].id})} }}>Start fresh</button></section>}
        {browserSaveStatus === 'error' && <section className="app-status-banner is-danger"><strong>Changes are not being saved</strong><span>{browserSaveError}</span><button type="button" onClick={flushBrowserSave}>Try again</button></section>}
      </div>}
      <div className="workspace">
        <aside className="form-pane" aria-label="Client editor">
          <div className="form-mode-toggle" aria-label="Form mode">
            <button
              aria-pressed={formMode === 'guided'}
              className={formMode === 'guided' ? 'is-active' : ''}
              type="button"
              onClick={() => setFormMode('guided')}
            >
              Guide me
            </button>
            <button
              aria-pressed={formMode === 'full'}
              className={formMode === 'full' ? 'is-active' : ''}
              type="button"
              onClick={() => setFormMode('full')}
            >
              Full form
            </button>
          </div>
          <fieldset className="mutation-fieldset" disabled={!canMutate}>
          {formMode === 'guided' ? (
            <Wizard
              currentStep={wizardStep}
              data={activeClient}
              done={wizardDone}
              hasWarnings={mapWarnings.length > 0}
              focusRequest={focusRequest}
              onChange={handleClientChange}
              onCurrentStepChange={setWizardStep}
              onDoneChange={setWizardDone}
              onExportPng={() => void handleExportPng()}
              onFullForm={() => setFormMode('full')}
              onHoverAccount={setHighlightId}
              onPrint={handlePrint}
              vocabulary={vocabulary}
            />
          ) : (
            <Form
              data={activeClient}
              focusRequest={focusRequest}
              onChange={handleClientChange}
              onHoverAccount={setHighlightId}
              vocabulary={vocabulary}
            />
          )}
          </fieldset>
        </aside>
        <section
          className={`preview-pane${selectedMapTargetKey && !mapTextEdit && !presentMode && canMutate ? ' has-map-inspector' : ''}`}
          aria-label="Money Map preview"
        >
          {selectedMapTargetKey && !mapTextEdit && !presentMode && canMutate && (
            <MapInspector
              data={activeClient}
              selectedTargetKey={selectedMapTargetKey}
              onChange={handleMapChange}
              onClose={() => setSelectedMapTargetKey(null)}
            />
          )}
          <div
            ref={previewPaneRef}
            className={`map-scroller${
              mapZoom === 'fit' ? '' : ' is-pan-enabled'
            }${isMapPanning ? ' is-panning' : ''}`}
            onPointerCancel={finishMapPan}
            onPointerDown={beginMapPan}
            onPointerMove={continueMapPan}
            onPointerUp={finishMapPan}
            onWheel={handleMapWheel}
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
                }`}
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
                  onElementClick={
                    presentMode || !canMutate ? undefined : handleMapElementClick
                  }
                  onSelectedTargetChange={setSelectedMapTargetKey}
                  selectedTargetKey={selectedMapTargetKey}
                />
              </div>
            </div>
            {mapTextEdit && !presentMode && canMutate && (
              <MapTextEditor
                containerRef={previewPaneRef}
                edit={mapTextEdit}
                key={JSON.stringify(mapTextEdit.target)}
                onCancel={() => setMapTextEdit(null)}
                onCommit={(rawValue) => {
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
              <button type="button" onClick={handleAddNote}>
                + Note
              </button>
              <div ref={shapePopoverRef} className="shape-quick-add">
                <button
                  aria-expanded={shapePopoverOpen}
                  type="button"
                  onClick={() => setShapePopoverOpen((open) => !open)}
                >
                  + Account
                </button>
                {shapePopoverOpen && (
                  <div className="shape-popover" aria-label="Add account">
                    {ACCOUNT_PRESETS.map((preset) => (
                      <button
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
