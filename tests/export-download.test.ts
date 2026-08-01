import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob, saveBookToFile } from '../src/export/export'
import { newBook } from '../src/model/book'

describe('Save Book download lifecycle', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('attaches and removes the anchor, then revokes the URL after the click task', () => {
    vi.useFakeTimers()
    const events: string[] = []
    const link = {
      href: '',
      download: '',
      click: vi.fn(() => events.push('click')),
      remove: vi.fn(() => events.push('remove')),
    }
    const createObjectURL = vi.fn(() => 'blob:book')
    const revokeObjectURL = vi.fn(() => events.push('revoke'))
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    vi.stubGlobal('document', {
      createElement: vi.fn(() => link),
      body: { append: vi.fn(() => events.push('append')) },
    })

    saveBookToFile(newBook())

    expect(link.download).toBe('money-map-book.json')
    expect(events).toEqual(['append', 'click', 'remove'])
    expect(revokeObjectURL).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(events).toEqual(['append', 'click', 'remove', 'revoke'])
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:book')
  })

  it('also defers URL revocation for generic PNG, PDF, and SVG downloads', () => {
    vi.useFakeTimers()
    const events: string[] = []
    const link = {
      href: '',
      download: '',
      click: vi.fn(() => events.push('click')),
      remove: vi.fn(() => events.push('remove')),
    }
    const revokeObjectURL = vi.fn(() => events.push('revoke'))
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:export'),
      revokeObjectURL,
    })
    vi.stubGlobal('document', {
      createElement: vi.fn(() => link),
      body: { append: vi.fn(() => events.push('append')) },
    })

    downloadBlob(new Blob(['map']), 'client-map.svg')

    expect(link.download).toBe('client-map.svg')
    expect(events).toEqual(['append', 'click', 'remove'])
    expect(revokeObjectURL).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(events).toEqual(['append', 'click', 'remove', 'revoke'])
  })})