import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('public repository boundary', () => {
  it('does not track internal agent artifacts', () => {
    const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split(/\r?\n/)
    const forbidden = /^(?:\.agents|\.claude|\.codex|\.planning|\.ship|\.superpowers|docs\/(?:codex|superpowers))(?:\/|$)/

    expect(tracked.filter((path) => forbidden.test(path))).toEqual([])
  })

  it('keeps the README free of employer, deployment, agent, and time-savings claims', () => {
    const readme = readFileSync('README.md', 'utf8')
    const forbidden = [
      /Summit Financial Group/i,
      /AI Council/i,
      /\b(?:Claude|Codex|coding agents?|MCP-connected)\b/i,
      /\b(?:internally deployed|firm-approved|production-ready)\b/i,
      /\b15[–-]30 minutes?\b/i,
      /\b2[–-]3 hours?\b/i,
    ]

    for (const pattern of forbidden) expect(readme).not.toMatch(pattern)
  })
})
