import { useCallback, useEffect, useRef, useState } from 'react'
import {
  addClient,
  deleteClient,
  duplicateClient,
  newBook,
  parseBook,
  updateClient,
} from './model/book'
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
  const [book, setBook] = useState<MoneyMapFile>(initialBook)
  const [formMode, setFormMode] = useState<FormMode>(initialFormMode)
  const [activeClientId, setActiveClientId] = useState(
    () => book.clients[0].id,
  )
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
  const focusRequestCounter = useRef(0)
  const toastCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewPaneRef = useRef<HTMLElement>(null)
  const printMapRef = useRef<HTMLDivElement>(null)
  const activeClient =
    book.clients.find((client) => client.id === activeClientId) ??
    book.clients[0]
  const hasLayoutOverrides =
    Object.keys(activeClient.layoutOverrides ?? {}).length > 0

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
    try {
      localStorage.setItem(FORM_MODE_STORAGE_KEY, formMode)
    } catch {
      // The selected mode remains usable for this session.
    }
  }, [formMode])

  const resetWizard = () => {
    setWizardStep(0)
    setWizardDone(false)
  }

  const selectClient = (id: string) => {
    setMapTextEdit(null)
    setActiveClientId(id)
    resetWizard()
  }

  const handleNew = () => {
    const result = addClient(book)
    setBook(result.book)
    selectClient(result.id)
  }

  const handleDuplicate = () => {
    const result = duplicateClient(book, activeClient.id)
    setBook(result.book)
    selectClient(result.id)
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
    const nextBook = deleteClient(book, clientId)
    setBook(nextBook)
    selectClient(nextBook.clients[0].id)
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
      setBook(nextBook)
      selectClient(nextBook.clients[0].id)
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

  const handleClientChange = (next: typeof activeClient) =>
    setBook((current) => updateClient(current, activeClient.id, next))

  return (
    <main className="app-shell">
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
          Delete {dialog.name}? This cannot be undone.
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
