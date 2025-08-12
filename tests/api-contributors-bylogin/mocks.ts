export const MOCK_LOGIN = 'user-mock-123'
export const MOCK_ORGS = ['org-mock-a', 'org-mock-b']

const owner = 'acme-co'
const repo = 'widget'

const buildRes = (obj: any, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  })

const moduleShape = {
  GITHUB_API_BASE: 'https://api.github.com',
  GITHUB_WEB_BASE: 'https://github.com',
  GITHUB_PER_PAGE: 100,
  DEFAULT_CONCURRENCY: 4,
  GITHUB_ACCEPT_JSON: 'application/vnd.github+json',
  GITHUB_ACCEPT_PREVIEW: 'application/vnd.github.cloak-preview+json, application/vnd.github+json',
  getAuth: () => ({ token: null }),
  makeLimiter: () => async (fn: any) => await fn(),
  clampWindow: (s?: string | null, u?: string | null) => ({ since: s!, until: u! }),
  uniqBy: <T>(arr: T[], keyFn: (t: T) => string) => {
    const seen = new Set<string>()
    const out: T[] = []
    for (const it of arr) {
      const k = keyFn(it)
      if (seen.has(k)) continue
      seen.add(k)
      out.push(it)
    }
    return out
  },
  prQuery: 'MOCK',
  parsePrUrl: (url: string) => {
    const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
    return m ? { owner: m[1], repo: m[2], number: m[3] } : null
  },
  parseCommitUrlToRepo: (url: string) => {
    const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/commit\//)
    return m ? `${m[1]}/${m[2]}` : null
  },
  ghFetch: async (url: string) => {
    if (url.includes('/search/issues')) {
      return buildRes({
        items: [
          {
            html_url: `https://github.com/${owner}/${repo}/pull/123`,
            created_at: '2025-07-01T00:00:00Z',
          },
        ],
      })
    }
    if (url.includes('/search/commits')) {
      return buildRes({
        items: [
          {
            html_url: `https://github.com/${owner}/${repo}/commit/abc`,
            repository: { full_name: `${owner}/${repo}` },
            commit: { author: { date: '2025-07-02T00:00:00Z' } },
          },
        ],
      })
    }
    return buildRes({})
  },
  paginate: async (url: string) => {
    if (url.includes('/pulls/') && url.endsWith('/reviews?per_page=100')) {
      return [
        {
          user: { login: MOCK_LOGIN },
          html_url: `https://github.com/${owner}/${repo}/pull/123#review-1`,
          submitted_at: '2025-07-03T00:00:00Z',
        },
      ]
    }
    return []
  },
  graphql: async (_q: string, _v: any) => ({}) as any,
}

export default moduleShape
