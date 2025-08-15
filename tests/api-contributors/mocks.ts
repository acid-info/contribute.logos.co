export const MOCK_ORGS = ['org-mock-c', 'org-mock-d']

const owners = ['contoso', 'fabrikam']
const repos = ['server', 'client']

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
  graphql: async (_q: string, _v: any) =>
    ({
      repository: {
        nameWithOwner: `${owners[0]}/${repos[0]}`,
        pullRequests: {
          nodes: [
            {
              createdAt: '2025-07-01T00:00:00Z',
              url: `https://github.com/${owners[0]}/${repos[0]}/pull/123`,
              author: { login: 'author-mock' },
              repository: { nameWithOwner: `${owners[0]}/${repos[0]}` },
            },
          ],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      },
    }) as any,
  ghFetch: async (url: string) => {
    if (url.includes('/repos?')) {
      return buildRes([
        { name: repos[0], full_name: `${owners[0]}/${repos[0]}` },
        { name: repos[1], full_name: `${owners[1]}/${repos[1]}` },
      ])
    }
    if (url.includes('/public_members')) {
      return buildRes([{ login: 'internal-user' }])
    }
    if (url.includes('/search/commits')) {
      return buildRes({
        items: [
          {
            html_url: `https://github.com/${owners[0]}/${repos[0]}/commit/abc`,
            repository: { full_name: `${owners[0]}/${repos[0]}` },
            author: { login: 'author-mock' },
            commit: { author: { date: '2025-07-02T00:00:00Z' } },
          },
        ],
      })
    }
    return buildRes({})
  },
  paginate: async (url: string) => {
    if (url.includes('/commits?')) {
      return [
        {
          html_url: `https://github.com/${owners[0]}/${repos[0]}/commit/abc`,
          author: { login: 'author-mock' },
          commit: { author: { date: '2025-07-02T00:00:00Z' } },
        },
      ]
    }
    if (url.includes('/pulls/') && url.endsWith('/reviews?per_page=100')) {
      return [
        {
          user: { login: 'reviewer-mock' },
          html_url: `https://github.com/${owners[0]}/${repos[0]}/pull/123#review-1`,
          submitted_at: '2025-07-03T00:00:00Z',
        },
      ]
    }
    return []
  },
  isBotAccount: (login: string) => false,
}

export default moduleShape
