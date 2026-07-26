import { parseBook } from '../model/book'
import type { MoneyMapFile } from '../model/types'

export function saveBookToFile(book: MoneyMapFile): void {
  const blob = new Blob([JSON.stringify(book, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'money-map-book.json'
  link.click()
  URL.revokeObjectURL(url)
}

export async function loadBookFromFile(
  file: File,
): Promise<MoneyMapFile> {
  return parseBook(await file.text())
}
