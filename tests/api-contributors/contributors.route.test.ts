import { describe, it, expect, vi } from 'vitest'
import mocks, { MOCK_ORGS } from './mocks'

function windowIso(days: number) {
  const until = new Date('2025-08-12T00:00:00Z')
  const since = new Date(until.getTime() - days * 24 * 60 * 60 * 1000)
  return { since: since.toISOString(), until: until.toISOString() }
}

vi.mock('@/lib/github', () => mocks)

describe('GET /api/contributors', () => {
  it('returns external contributors with latest activity (mocked)', async () => {
    const orgs = MOCK_ORGS.join(',')
    const { since, until } = windowIso(192)
    const url = `http://localhost/api/contributors?orgs=${encodeURIComponent(
      orgs
    )}&since=${encodeURIComponent(since)}&until=${encodeURIComponent(
      until
    )}&limitReposPerOrg=2&maxPrPages=2&maxReviewFetches=10&commitStrategy=search&debug=true`
    const req = new Request(url)
    const { GET: GETContributors } = await import('../../app/api/contributors/route')
    const res = await GETContributors(req)
    expect(res.status).toBe(200)
    const meta = res.headers.get('x-meta')
    expect(meta).toBeTruthy()
    const json = (await res.json()) as any[]
    expect(json.slice(0, 2)).toMatchSnapshot('contributors-list-sample')
    expect(JSON.parse(meta!)).toMatchSnapshot('contributors-list-meta')
  })
})
