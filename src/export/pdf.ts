const PAGE_WIDTH = 792
const PAGE_HEIGHT = 612

const encoder = new TextEncoder()

function text(value: string): Uint8Array {
  return encoder.encode(value)
}

function join(parts: Uint8Array[]): Uint8Array {
  const length = parts.reduce((total, part) => total + part.length, 0)
  const result = new Uint8Array(length)
  let offset = 0

  for (const part of parts) {
    result.set(part, offset)
    offset += part.length
  }

  return result
}

function object(
  number: number,
  body: Uint8Array | string,
): Uint8Array {
  return join([
    text(`${number} 0 obj\n`),
    typeof body === 'string' ? text(body) : body,
    text('\nendobj\n'),
  ])
}

function stream(dictionary: string, bytes: Uint8Array): Uint8Array {
  return join([
    text(`<< ${dictionary} /Length ${bytes.length} >>\nstream\n`),
    bytes,
    text('\nendstream'),
  ])
}

function xrefEntry(offset: number): string {
  return `${String(offset).padStart(10, '0')} 00000 n \n`
}

export function buildPdf(
  jpegBytes: Uint8Array,
  pixelWidth: number,
  pixelHeight: number,
): Uint8Array {
  if (jpegBytes.length === 0) {
    throw new Error('The PDF image is empty.')
  }
  if (
    !Number.isInteger(pixelWidth) ||
    pixelWidth <= 0 ||
    !Number.isInteger(pixelHeight) ||
    pixelHeight <= 0
  ) {
    throw new Error('The PDF image dimensions are invalid.')
  }

  const content = text(
    `q\n${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm\n/Im0 Do\nQ\n`,
  )
  const objects = [
    object(1, '<< /Type /Catalog /Pages 2 0 R >>'),
    object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>'),
    object(
      3,
      [
        '<< /Type /Page /Parent 2 0 R',
        ` /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}]`,
        ' /Resources << /XObject << /Im0 4 0 R >> >>',
        ' /Contents 5 0 R >>',
      ].join(''),
    ),
    object(
      4,
      stream(
        [
          '/Type /XObject /Subtype /Image',
          `/Width ${pixelWidth} /Height ${pixelHeight}`,
          '/ColorSpace /DeviceRGB /BitsPerComponent 8',
          '/Filter /DCTDecode',
        ].join(' '),
        jpegBytes,
      ),
    ),
    object(5, stream('', content)),
  ]

  const header = join([
    text('%PDF-1.4\n%'),
    new Uint8Array([0xe2, 0xe3, 0xcf, 0xd3]),
    text('\n'),
  ])
  const offsets: number[] = []
  let position = header.length

  for (const pdfObject of objects) {
    offsets.push(position)
    position += pdfObject.length
  }

  const xrefOffset = position
  const xref = text(
    [
      'xref',
      '0 6',
      '0000000000 65535 f ',
      ...offsets.map(xrefEntry).map((entry) => entry.trimEnd()),
      'trailer',
      '<< /Size 6 /Root 1 0 R >>',
      'startxref',
      String(xrefOffset),
      '%%EOF',
      '',
    ].join('\n'),
  )

  return join([header, ...objects, xref])
}
