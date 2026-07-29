import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  mapFileName,
  serializeMapSvg,
} from '../src/export/export'

afterEach(() => vi.unstubAllGlobals())

describe('mapFileName', () => {
  it('strips Windows-illegal characters and collapses whitespace', () => {
    expect(mapFileName('  Sam\\ / Priya:*? "Venkat" <Family>|  ', '2026')).toBe(
      'Sam Priya Venkat Family — Money Map 2026.png',
    )
  })

  it('uses Client when the title is empty', () => {
    expect(mapFileName('  ', '2026')).toBe(
      'Client — Money Map 2026.png',
    )
    expect(mapFileName(undefined, '2026')).toBe(
      'Client — Money Map 2026.png',
    )
  })

  it('trims a long title to a filename no longer than 120 characters', () => {
    const fileName = mapFileName('A very long client title '.repeat(10), '2026')

    expect(fileName.length).toBeLessThanOrEqual(120)
    expect(fileName).toMatch(/ — Money Map 2026\.png$/)
  })

  it('uses the requested export extension', () => {
    expect(mapFileName('Avery', '2026', 'pdf')).toBe(
      'Avery — Money Map 2026.pdf',
    )
    expect(mapFileName('Avery', '2026', 'svg')).toBe(
      'Avery — Money Map 2026.svg',
    )
  })
})

describe('serializeMapSvg', () => {
  it('writes a complete SVG with embedded fonts and no editor chrome', async () => {
    const style = { textContent: '' }
    const defs = {
      prepend: (node: typeof style) => {
        style.textContent = node.textContent
      },
    }
    const attributes = new Map<string, string>()
    const clone = {
      firstChild: null,
      insertBefore: vi.fn(),
      querySelector: (selector: string) =>
        selector === 'defs' ? defs : null,
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
    }

    vi.stubGlobal('document', {
      createElementNS: () => style,
    })
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
        ok: true,
      })),
    )
    vi.stubGlobal(
      'XMLSerializer',
      class {
        serializeToString() {
          return [
            '<svg xmlns="http://www.w3.org/2000/svg"',
            ` width="${attributes.get('width')}"`,
            ` height="${attributes.get('height')}">`,
            `<defs><style>${style.textContent}</style></defs>`,
            '<rect class="map-content"/></svg>',
          ].join('')
        }
      },
    )

    const serialized = await serializeMapSvg({
      cloneNode: () => clone,
    } as unknown as SVGSVGElement)

    expect(serialized.startsWith('<svg')).toBe(true)
    expect(serialized).toContain('width="1320" height="1020"')
    expect(serialized).toContain('@font-face')
    expect(serialized).toContain('data:font/woff2;base64,AQID')
    expect(serialized).not.toMatch(
      /map-interactive|map-editable|map-arrow-editor/,
    )
  })
})
