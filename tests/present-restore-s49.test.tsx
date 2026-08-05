import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'

import { applyPresentScroll, canStartMapPan } from '../src/App'

const sliceBetween = (start: string, end: string) =>
  appSource.slice(appSource.indexOf(start), appSource.indexOf(end))

describe('Session 49 present exit restores the view, not just the zoom', () => {
  it('puts the stashed scroll back on the scroller', () => {
    const scroller = { scrollLeft: 0, scrollTop: 0 }

    expect(applyPresentScroll(scroller, { left: 420, top: 130 })).toBe(true)
    expect(scroller).toEqual({ scrollLeft: 420, scrollTop: 130 })
  })

  it('leaves the scroller alone when nothing was stashed', () => {
    const scroller = { scrollLeft: 77, scrollTop: 12 }

    expect(applyPresentScroll(scroller, null)).toBe(false)
    expect(scroller).toEqual({ scrollLeft: 77, scrollTop: 12 })
  })

  it('is a no-op when the scroller is gone', () => {
    expect(applyPresentScroll(null, { left: 420, top: 130 })).toBe(false)
  })

  it('stashes the scroll position when Present starts', () => {
    const enter = sliceBetween('const handlePresent = async ()', 'const selectClient =')
    expect(enter).toContain('presentZoomRef.current = mapZoom')
    expect(enter).toContain('presentScrollRef.current =')
    expect(enter).toContain('scrollLeft')
    expect(enter).toContain('scrollTop')
  })

  it('restores the scroll after the zoom relayout, never on a timer', () => {
    // The restore has to ride the existing post-layout mechanism: the
    // useLayoutEffect that already runs after a mapZoom-driven relayout.
    const layoutEffect = sliceBetween(
      '  useLayoutEffect(() => {',
      '  const showSnapshot =',
    )
    expect(layoutEffect).toContain('applyPresentScroll(previewPaneRef.current, presentScrollRef.current)')
    expect(layoutEffect).toContain('}, [mapZoom, presentMode])')

    const exit = sliceBetween('const exitPresentMode = useCallback', 'const rememberConnectedFile')
    expect(exit).not.toContain('setTimeout')
    expect(exit).not.toContain('requestAnimationFrame')
  })

  it('keeps ctrl+wheel zoom live while presenting, so pan-from-anywhere is reachable', () => {
    // No presentMode gate on the wheel handler, and the wheel binding is a
    // mount-once bind on the always-rendered scroller.
    const wheel = sliceBetween('const handleMapWheel = (event: WheelEvent)', 'const beginMapPan =')
    expect(wheel).not.toContain('presentMode')
    expect(wheel).toContain('bindMapWheel(previewPaneRef.current')
    // Once the wheel leaves 'fit', dragging anywhere pans while presenting.
    expect(
      canStartMapPan({ mapZoom: 150, button: 0, presentMode: true, onBackground: false }),
    ).toBe(true)
  })
})
