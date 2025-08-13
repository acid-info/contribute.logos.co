import { describe, it, expect, vi } from 'vitest'
import mocks, { MOCK_LOGIN, MOCK_ORGS } from './mocks'

function windowIso(days: number) {
  const until = new Date('2025-08-12T00:00:00Z')
  const since = new Date(until.getTime() - days * 24 * 60 * 60 * 1000)
  return { since: since.toISOString(), until: until.toISOString() }
}

vi.mock('@/lib/github', () => mocks)

describe('GET /api/contributors/[login]', () => {
  it('returns a contribution ledger for a user (mocked)', async () => {
    const login = MOCK_LOGIN
    const orgs = MOCK_ORGS.join(',')
    const { since, until } = windowIso(365)
    const url = `http://localhost/api/contributors/${login}?orgs=${encodeURIComponent(
      orgs
    )}&since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}&debug=true`
    const req = new Request(url)
    const { GET: GETByLogin } = await import('../../app/api/contributors/[login]/route')
    const res = await GETByLogin(req)
    expect(res.status).toBe(200)
    const json = (await res.json()) as any
    expect(json).toMatchSnapshot('contributors-bylogin-response')
  })
})
