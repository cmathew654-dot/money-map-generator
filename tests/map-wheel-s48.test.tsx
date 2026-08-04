import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'

import { bindMapWheel, shouldZoomOnWheel } from '../src/App'

// Node's EventTarget honours the passive flag exactly like the DOM does:
// preventDefault() inside a passive listener leaves defaultPrevented false.
const wheelEvent = (init: { ctrlKey?: boolean; deltaY?: number }) =>
  Object.assign(new Event('wheel', { bubbles: true, cancelable: true }), {
    ctrlKey: false,
    metaKey: false,
    deltaY: -100,
    ...init,
  })

const scrollerWithMapWheel = () => {
  const el = new EventTarget() as unknown as HTMLDivElement
  let zooms = 0
  const cleanup = bindMapWheel(el, (event) => {
    if (!shouldZoomOnWheel(event)) return
    event.preventDefault()
    zooms += 1
  })
  return { el, cleanup, zoomed: () => zooms }
}

describe('ctrl+wheel map zoom does not leak to browser page zoom', () => {
  it('cancels the ctrl+wheel event so the page does not zoom', () => {
    const { el, zoomed } = scrollerWithMapWheel()
    const event = wheelEvent({ ctrlKey: true })

    el.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(zoomed()).toBe(1)
  })

  it('leaves a plain wheel alone so normal scrolling survives', () => {
    const { el, zoomed } = scrollerWithMapWheel()
    const event = wheelEvent({})

    el.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(zoomed()).toBe(0)
  })

  it('would not cancel if the listener were attached passively', () => {
    // Guards the assertion above: proves defaultPrevented actually tracks the
    // passive flag here, so the first test fails if bindMapWheel regresses.
    const el = new EventTarget()
    el.addEventListener('wheel', (event) => event.preventDefault(), {
      passive: true,
    })
    const event = wheelEvent({ ctrlKey: true })

    el.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
  })

  it('detaches on cleanup', () => {
    const { el, cleanup, zoomed } = scrollerWithMapWheel()
    cleanup!()

    el.dispatchEvent(wheelEvent({ ctrlKey: true }))

    expect(zoomed()).toBe(0)
  })

  it('no-ops when the scroller has not mounted', () => {
    expect(bindMapWheel(null, () => undefined)).toBeUndefined()
  })

  it('treats a zero-delta ctrl wheel as a non-gesture', () => {
    expect(shouldZoomOnWheel({ ctrlKey: true, metaKey: false, deltaY: 0 })).toBe(
      false,
    )
    expect(shouldZoomOnWheel({ ctrlKey: false, metaKey: true, deltaY: 5 })).toBe(
      true,
    )
  })
})

describe('App wires the map wheel natively', () => {
  it('no longer uses the passive React onWheel prop', () => {
    expect(appSource).not.toContain('onWheel=')
  })

  it('binds the scroller through bindMapWheel with the latest closure', () => {
    expect(appSource).toMatch(
      /handleMapWheelRef\.current = handleMapWheel[\s\S]{0,400}?bindMapWheel\(\s*previewPaneRef\.current,\s*\(event\) =>\s*handleMapWheelRef\.current\(event\),/,
    )
  })

  it('gates the handler on shouldZoomOnWheel before preventDefault', () => {
    expect(appSource).toMatch(
      /const handleMapWheel = \(event: WheelEvent\) => \{\s*if \(!shouldZoomOnWheel\(event\)\) return\s*event\.preventDefault\(\)/,
    )
  })

  it('anchors the zoom off the scroller ref now that currentTarget is gone', () => {
    expect(appSource).toMatch(/const scroller = previewPaneRef\.current/)
    expect(appSource).toMatch(/if \(!scroller \|\| !page\) \{/)
  })
})
