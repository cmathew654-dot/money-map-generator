import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'
import { leaseAnnouncement } from '../src/App'

describe('Session 49 lease announcements', () => {
  it('announces the read-only and writer-restored transitions in real mode', () => {
    expect(leaseAnnouncement('real', false, false)).toMatch(/^View only/)
    expect(leaseAnnouncement('real', true, false)).toMatch(/this tab/)
    expect(leaseAnnouncement('real', false, false)).not.toBe(leaseAnnouncement('real', true, false))
  })

  it('stays silent while a takeover is mid-flight and in the public demo', () => {
    expect(leaseAnnouncement('real', false, true)).toMatch(/ready to edit/)
    expect(leaseAnnouncement('demo', true, false)).toBe('')
    expect(leaseAnnouncement('demo', false, true)).toBe('')
  })

  it('renders the announcement in a visually hidden live region', () => {
    const region = appSource.match(/<div[^>]*role="status"[^>]*>\{leaseAnnouncement\([^)]*\)\}<\/div>/)
    expect(region).not.toBeNull()
    expect(region![0]).toContain('visually-hidden')
  })
})
