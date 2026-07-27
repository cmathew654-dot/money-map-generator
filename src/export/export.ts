import literataItalic from '../fonts/literata-latin-wght-italic.woff2'
import literataNormal from '../fonts/literata-latin-wght-normal.woff2'
import publicSansItalic from '../fonts/public-sans-latin-wght-italic.woff2'
import publicSansNormal from '../fonts/public-sans-latin-wght-normal.woff2'
import { parseBook } from '../model/book'
import type { MoneyMapFile } from '../model/types'

const ARTBOARD_WIDTH = 1320
const ARTBOARD_HEIGHT = 1020
const PNG_SCALE = 2
const MAX_FILE_NAME_LENGTH = 120
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const FONT_FILES = {
  literataNormal,
  literataItalic,
  publicSansNormal,
  publicSansItalic,
} as const

function cleanFileNamePart(value: string): string {
  return value
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function mapFileName(
  title: string | undefined,
  year: string,
): string {
  const safeTitle = cleanFileNamePart(title ?? '') || 'Client'
  const suffixStart = ' — Money Map '
  const extension = '.png'
  const maxYearLength =
    MAX_FILE_NAME_LENGTH -
    1 -
    suffixStart.length -
    extension.length
  const safeYear = cleanFileNamePart(year)
    .slice(0, maxYearLength)
    .trim()
  const suffix = `${suffixStart}${safeYear}${extension}`
  const maxTitleLength = MAX_FILE_NAME_LENGTH - suffix.length
  const trimmedTitle = safeTitle.slice(0, maxTitleLength).trim()

  return `${trimmedTitle || safeTitle[0]}${suffix}`
}

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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunks: string[] = []
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    chunks.push(
      String.fromCharCode(...bytes.subarray(index, index + chunkSize)),
    )
  }

  return btoa(chunks.join(''))
}

async function fontDataUrl(path: string): Promise<string> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Could not load export font: ${path}`)
  }
  return `data:font/woff2;base64,${arrayBufferToBase64(
    await response.arrayBuffer(),
  )}`
}

function imageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The map image could not be drawn.'))
    image.src = url
  })
}

function pngBlobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('The PNG could not be created.'))
      }
    }, 'image/png')
  })
}

export async function exportPng(
  svg: SVGSVGElement,
  fileName: string,
): Promise<void> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('width', String(ARTBOARD_WIDTH))
  clone.setAttribute('height', String(ARTBOARD_HEIGHT))

  const fontEntries = await Promise.all(
    Object.entries(FONT_FILES).map(async ([name, path]) => [
      name,
      await fontDataUrl(path),
    ]),
  )
  const fonts = Object.fromEntries(fontEntries)
  const style = document.createElementNS(SVG_NAMESPACE, 'style')
  style.textContent = `
    @font-face {
      font-family: 'Literata';
      src: url('${fonts.literataNormal}') format('woff2');
      font-style: normal;
      font-weight: 100 900;
    }
    @font-face {
      font-family: 'Literata';
      src: url('${fonts.literataItalic}') format('woff2');
      font-style: italic;
      font-weight: 100 900;
    }
    @font-face {
      font-family: 'Public Sans';
      src: url('${fonts.publicSansNormal}') format('woff2');
      font-style: normal;
      font-weight: 100 900;
    }
    @font-face {
      font-family: 'Public Sans';
      src: url('${fonts.publicSansItalic}') format('woff2');
      font-style: italic;
      font-weight: 100 900;
    }
  `

  let defs = clone.querySelector('defs')
  if (!defs) {
    defs = document.createElementNS(SVG_NAMESPACE, 'defs')
    clone.insertBefore(defs, clone.firstChild)
  }
  defs.prepend(style)

  const serialized = new XMLSerializer().serializeToString(clone)
  const svgUrl = URL.createObjectURL(
    new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' }),
  )
  let pngUrl: string | undefined

  try {
    const image = await imageFromUrl(svgUrl)
    const canvas = document.createElement('canvas')
    canvas.width = ARTBOARD_WIDTH * PNG_SCALE
    canvas.height = ARTBOARD_HEIGHT * PNG_SCALE
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas drawing is not available.')
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const png = await pngBlobFromCanvas(canvas)
    pngUrl = URL.createObjectURL(png)
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = fileName
    document.body.append(link)
    link.click()
    link.remove()
  } finally {
    URL.revokeObjectURL(svgUrl)
    if (pngUrl) URL.revokeObjectURL(pngUrl)
  }
}
