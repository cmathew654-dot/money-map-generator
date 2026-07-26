import { useEffect, useRef, useState } from 'react'
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
import { MapSvg } from './render/MapSvg'
import './styles/print.css'

const STORAGE_KEY = 'money-map-book:v1'

function initialBook(): MoneyMapFile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseBook(saved) : newBook()
  } catch {
    return newBook()
  }
}

export default function App() {
  const [book, setBook] = useState<MoneyMapFile>(initialBook)
  const [activeClientId, setActiveClientId] = useState(
    () => book.clients[0].id,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const printMapRef = useRef<HTMLDivElement>(null)
  const activeClient =
    book.clients.find((client) => client.id === activeClientId) ??
    book.clients[0]

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

  const handleNew = () => {
    const result = addClient(book)
    setBook(result.book)
    setActiveClientId(result.id)
  }

  const handleDuplicate = () => {
    const result = duplicateClient(book, activeClient.id)
    setBook(result.book)
    setActiveClientId(result.id)
  }

  const handleDelete = () => {
    if (!window.confirm(`Delete ${activeClient.client.title || 'Untitled'}?`)) {
      return
    }
    const nextBook = deleteClient(book, activeClient.id)
    setBook(nextBook)
    setActiveClientId(nextBook.clients[0].id)
  }

  const handleLoad = async (file: File) => {
    try {
      const nextBook = await loadBookFromFile(file)
      setBook(nextBook)
      setActiveClientId(nextBook.clients[0].id)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The book could not be loaded.'
      window.alert(message)
    }
  }

  const handleExportPng = async () => {
    const svg = printMapRef.current?.querySelector('svg')
    if (!svg) {
      window.alert('The Money Map is not ready to export.')
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The PNG could not be exported.'
      window.alert(message)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="wordmark">Money Map</div>
        <select
          aria-label="Active client"
          className="client-select"
          value={activeClient.id}
          onChange={(event) => setActiveClientId(event.target.value)}
        >
          {book.clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.client.title || 'Untitled'}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleNew}>
          New
        </button>
        <button type="button" onClick={handleDuplicate}>
          Duplicate
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
        <button type="button" onClick={() => void handleExportPng()}>
          Export PNG
        </button>
        <div className="header-spacer" />
        <button type="button" onClick={() => saveBookToFile(book)}>
          Save book
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Load book
        </button>
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
          <Form
            data={activeClient}
            onChange={(next) =>
              setBook((current) =>
                updateClient(current, activeClient.id, next),
              )
            }
          />
        </aside>
        <section className="preview-pane" aria-label="Money Map preview">
          <div className="map-page">
            <MapSvg data={activeClient} />
          </div>
        </section>
      </div>
      <div ref={printMapRef} aria-hidden="true" className="print-map">
        <MapSvg data={activeClient} />
      </div>
    </main>
  )
}
