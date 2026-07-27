import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addClient,
  deleteClient,
  duplicateClient,
  emptyHistory,
  newBook,
  parseBook,
  pushHistory,
  redoHistory,
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
import type { MoneyMapFile } from './model/types'
import {
  exportPng,
  loadBookFromFile,
  mapFileName,
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
import { Dialog } from './ui/Dialog'
import {
  applyMapTextEdit,
  mapTextEditRawValue,
  MapTextEditor,
  type ActiveMapTextEdit,
} from './ui/MapTextEditor'
import { Mark } from './ui/Mark'
import { Toast, type ToastMessage } from './ui/Toast'
import './styles/print.css'

const STORAGE_KEY = 'money-map-book:v1'
const FORM_MODE_STORAGE_KEY = 'money-map-form-mode:v1'

type FormMode = 'guided' | 'full'
type FileSaveStatus = 'saved' | 'saving'
type AppDialog =
  | { kind: 'delete'; clientId: string; name: string }
  | { kind: 'error'; title: string; message: string }
  | { kind: 'resetLayout' }

function initialBook(): MoneyMapFile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseBook(saved) : newBook()
  } catch {
    return newBook()
  }
}

function initialFormMode(): FormMode {
  try {
    return localStorage.getItem(FORM_MODE_STORAGE_KEY) === 'full'
      ? 'full'
      : 'guided'
  } catch {
    return 'guided'
  }
}

export default function App() {
  const [snapshot, setSnapshot] = useState<BookSnapshot>(() => {
    const book = initialBook()
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
  const [dialog, setDialog] = useState<AppDialog | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [connectedFile, setConnectedFile] =
    useState<BookFileHandle | null>(null)
  const [reconnectFile, setReconnectFile] =
    useState<BookFileHandle | null>(null)
  const [fileSaveStatus, setFileSaveStatus] =
    useState<FileSaveStatus>('saved')
  const [presentMode, setPresentMode] = useState(false)
  const [fileStoreSupported] = useState(() =>
    supportsFileStore(window as unknown as FileStoreApi),
  )
  const focusRequestCounter = useRef(0)
  const toastCounter = useRef(0)
  const fileSaveRevision = useRef(0)
  const fileWriteQueue = useRef<Promise<void>>(Promise.resolve())
  const snapshotRef = useRef(snapshot)
  const historyRef = useRef(history)
  const appShellRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewPaneRef = useRef<HTMLElement>(null)
  const printMapRef = useRef<HTMLDivElement>(null)
  const { book, activeClientId } = snapshot
  const activeClient =
    book.clients.find((client) => client.id === activeClientId) ??
    book.clients[0]
  const hasLayoutOverrides =
    Object.keys(activeClient.layoutOverrides ?? {}).length > 0

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
    [showHistory, showSnapshot],
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
    const result = undoHistory(historyRef.current)
    if (!result.snapshot) return false
    showHistory(result.history)
    restoreHistorySnapshot(result.snapshot)
    return true
  }, [restoreHistorySnapshot, showHistory])

  const handleRedo = useCallback(() => {
    const result = redoHistory(historyRef.current)
    if (!result.snapshot) return false
    showHistory(result.history)
    restoreHistorySnapshot(result.snapshot)
    return true
  }, [restoreHistorySnapshot, showHistory])

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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(book))
      } catch {
        // Storage can be unavailable or full; the in-memory book remains usable.
      }
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [book])

  useEffect(() => {
    if (!connectedFile) return
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
            `Could not save ${connectedFile.name}; browser copy kept`,
          )
        },
      )
    }, 800)
    return () => window.clearTimeout(timeout)
  }, [addToast, book, connectedFile])

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
      if (changed) event.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRedo, handleUndo])

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
        addToast('Connected, but this file cannot be remembered')
      })
    },
    [addToast],
  )

  const replaceBookFromFile = useCallback(
    async (handle: BookFileHandle, isReconnect: boolean) => {
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
      addToast(isReconnect ? 'Book restored from file' : 'Book loaded from file')
    },
    [addToast, commitSnapshot, rememberConnectedFile, resetWizard],
  )

  const handleCreateConnectedFile = async () => {
    try {
      const handle = await chooseNewBookFile()
      await writeBookFile(handle, snapshotRef.current.book)
      rememberConnectedFile(handle)
      addToast('Book file connected')
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
    addToast('Book file disconnected')
  }

  const handlePresent = async () => {
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
    const nextClient = { ...activeClient }
    delete nextClient.layoutOverrides
    handleClientChange(nextClient)
    setDialog(null)
    addToast('Layout reset')
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
      message: error instanceof Error ? error.message : fallback,
    })
  }

  const handleLoad = async (file: File) => {
    try {
      const nextBook = await loadBookFromFile(file)
      commitSnapshot(
        {
          book: nextBook,
          activeClientId: nextBook.clients[0].id,
        },
        null,
      )
      setMapTextEdit(null)
      resetWizard()
      addToast('Book loaded')
    } catch (error) {
      showError('Could not load book', error, 'The book could not be loaded.')
    }
  }

  const handleExportPng = async () => {
    const svg = printMapRef.current?.querySelector('svg')
    if (!svg) {
      showError(
        'Could not export PNG',
        new Error('The Money Map is not ready to export.'),
        'The PNG could not be exported.',
      )
      return
    }

    try {
      await exportPng(
        svg,
        mapFileName(
          activeClient.client.title,
          activeClient.client.year,
        ),
      )
      addToast('PNG exported')
    } catch (error) {
      showError(
        'Could not export PNG',
        error,
        'The PNG could not be exported.',
      )
    }
  }

  const handleMapElementClick = (target: MapElementTarget) => {
    if (target.kind === 'edit') {
      setMapTextEdit({
        target: target.edit,
        rect: target.rect,
        rawValue: mapTextEditRawValue(activeClient, target.edit),
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

  return (
    <main
      ref={appShellRef}
      className={`app-shell${presentMode ? ' is-presenting' : ''}`}
    >
      <header className="app-header">
        <div className="header-left">
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
            <button className="quiet-button" type="button" onClick={handleNew}>
              New
            </button>
            <button
              className="quiet-button"
              type="button"
              onClick={handleDuplicate}
            >
              Duplicate
            </button>
            <button
              className="quiet-button header-delete"
              type="button"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          <div className="header-history-actions">
            <button
              aria-label="Undo"
              className="quiet-button history-button"
              disabled={history.past.length === 0}
              title="Undo (Ctrl+Z)"
              type="button"
              onClick={handleUndo}
            >
              ↶
            </button>
            <button
              aria-label="Redo"
              className="quiet-button history-button"
              disabled={history.future.length === 0}
              title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
              type="button"
              onClick={handleRedo}
            >
              ↷
            </button>
          </div>
        </div>
        <div className="header-spacer" />
        <div className="header-right">
          <div className="header-book-actions">
            <button
              className="quiet-button"
              type="button"
              onClick={() => {
                saveBookToFile(book)
                addToast('Book saved')
              }}
            >
              Save book
            </button>
            {fileStoreSupported && !connectedFile && (
              <>
                <button
                  className="quiet-button"
                  type="button"
                  onClick={() => void handleCreateConnectedFile()}
                >
                  Keep in a file…
                </button>
                <button
                  className="quiet-button"
                  type="button"
                  onClick={() => void handleOpenConnectedFile()}
                >
                  Open existing
                </button>
              </>
            )}
            {fileStoreSupported && reconnectFile && !connectedFile && (
              <button
                className="quiet-button reconnect-button"
                type="button"
                onClick={() =>
                  void replaceBookFromFile(reconnectFile, true)
                }
              >
                Reconnect {reconnectFile.name}
              </button>
            )}
            {connectedFile && (
              <div className="file-connection" title={connectedFile.name}>
                <span className="file-connection-name">
                  {connectedFile.name}
                </span>
                <span>
                  {fileSaveStatus === 'saving' ? 'Saving…' : 'Saved'}
                </span>
                <button
                  className="file-disconnect"
                  type="button"
                  onClick={handleDisconnectFile}
                >
                  Disconnect
                </button>
              </div>
            )}
            <button
              className="quiet-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Load book
            </button>
          </div>
          <span aria-hidden="true" className="header-divider" />
          <div className="header-payoff-actions">
            <button
              className="quiet-button"
              type="button"
              onClick={() => void handlePresent()}
            >
              Present
            </button>
            <button
              className="quiet-button"
              disabled={!hasLayoutOverrides}
              type="button"
              onClick={() => setDialog({ kind: 'resetLayout' })}
            >
              Reset layout
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => window.print()}
            >
              Print
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => void handleExportPng()}
            >
              Export PNG
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          accept=".json"
          className="visually-hidden"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void handleLoad(file)
            event.target.value = ''
          }}
        />
      </header>
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
          {formMode === 'guided' ? (
            <Wizard
              currentStep={wizardStep}
              data={activeClient}
              done={wizardDone}
              focusRequest={focusRequest}
              onChange={handleClientChange}
              onCurrentStepChange={setWizardStep}
              onDoneChange={setWizardDone}
              onExportPng={() => void handleExportPng()}
              onFullForm={() => setFormMode('full')}
              onHoverAccount={setHighlightId}
              onPrint={() => window.print()}
            />
          ) : (
            <Form
              data={activeClient}
              focusRequest={focusRequest}
              onChange={handleClientChange}
              onHoverAccount={setHighlightId}
            />
          )}
        </aside>
        <section
          ref={previewPaneRef}
          className="preview-pane"
          aria-label="Money Map preview"
        >
          <div className="map-page">
            <MapSvg
              data={activeClient}
              highlightId={highlightId}
              onChange={handleClientChange}
              onElementClick={handleMapElementClick}
            />
          </div>
          {mapTextEdit && (
            <MapTextEditor
              containerRef={previewPaneRef}
              edit={mapTextEdit}
              key={JSON.stringify(mapTextEdit.target)}
              onCancel={() => setMapTextEdit(null)}
              onCommit={(rawValue) => {
                handleClientChange(
                  applyMapTextEdit(
                    activeClient,
                    mapTextEdit.target,
                    rawValue,
                  ),
                )
                setMapTextEdit(null)
              }}
            />
          )}
          {presentMode && (
            <div className="present-hint">Esc to exit</div>
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
          confirmLabel="OK"
          open
          title={dialog.title}
          onClose={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
        >
          {dialog.message}
        </Dialog>
      )}
      {dialog?.kind === 'resetLayout' && (
        <Dialog
          confirmLabel="Reset"
          danger
          open
          title="Reset layout"
          onClose={() => setDialog(null)}
          onConfirm={handleResetLayout}
        >
          Restore the generated layout for this client?
        </Dialog>
      )}
      <Toast messages={toasts} onDismiss={dismissToast} />
    </main>
  )
}
