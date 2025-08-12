import {
  clampWindow,
  getAuth,
  ghFetch,
  makeLimiter,
  paginate,
  parsePrUrl,
  parseCommitUrlToRepo,
  GITHUB_API_BASE,
  GITHUB_PER_PAGE,
  DEFAULT_CONCURRENCY,
  GITHUB_WEB_BASE,
  GITHUB_ACCEPT_JSON,
  GITHUB_ACCEPT_PREVIEW,
} from '@/lib/github'

type Item = {
  date: string
  repo: string
  repoUrl: string
  type: 'PR' | 'REVIEW' | 'COMMIT'
  link: string
}

export const dynamic = 'force-dynamic'

export async function GET(req: Request, context: { params: { login: string } }) {
  try {
    const login = context?.params?.login as string
    const { searchParams } = new URL(req.url)
    const orgs = (searchParams.get('orgs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (!login) return Response.json({ error: 'login required' }, { status: 400 })
    if (orgs.length === 0) return Response.json({ error: 'orgs required' }, { status: 400 })
    const cursor = searchParams.get('cursor') || undefined
    const { since, until } = clampWindow(searchParams.get('since'), searchParams.get('until'))
    const auth = getAuth()
    const limit = makeLimiter(DEFAULT_CONCURRENCY)
    const debug = searchParams.get('debug') === 'true'
    const started = Date.now()

    const items: Item[] = []

    // 1 PRs authored by user per org
    await Promise.all(
      orgs.map((org) =>
        limit(async () => {
          const q = `is:pr+org:${encodeURIComponent(org)}+author:${encodeURIComponent(login)}+created:${encodeURIComponent(
            `${since}..${until}`
          )}`
          const url = `${GITHUB_API_BASE}/search/issues?q=${q}&per_page=${GITHUB_PER_PAGE}`
          const res = await ghFetch(url, auth, {
            headers: { Accept: GITHUB_ACCEPT_JSON },
          })
          if (!res.ok) throw new Error(`GitHub search error ${res.status}: ${await res.text()}`)
          const json = await res.json()
          for (const it of json.items || []) {
            const html = it.html_url as string
            const m = html.match(/github.com\/([^/]+)\/([^/]+)\/pull\//)
            if (!m) continue
            const repo = `${m[1]}/${m[2]}`
            items.push({
              date: it.created_at,
              repo,
              repoUrl: `${GITHUB_WEB_BASE}/${repo}`,
              type: 'PR',
              link: html,
            })
          }
        })
      )
    )

    // 2 PR reviews - derive from PRs we already have
    const prLinks = Array.from(new Set(items.filter((i) => i.type === 'PR').map((i) => i.link)))
    await Promise.all(
      prLinks.map((urlStr) =>
        limit(async () => {
          const parsed = parsePrUrl(urlStr)
          if (!parsed) return
          const { owner, repo, number } = parsed
          const api = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=${GITHUB_PER_PAGE}`
          const reviews = await paginate<any>(api, auth)
          for (const rv of reviews) {
            const u = rv.user?.login
            if (u !== login) continue
            const date = rv.submitted_at || rv.submittedAt
            if (!date) continue
            if (since && new Date(date) < new Date(since)) continue
            if (until && new Date(date) > new Date(until)) continue
            items.push({
              date,
              repo: `${owner}/${repo}`,
              repoUrl: `${GITHUB_WEB_BASE}/${owner}/${repo}`,
              type: 'REVIEW',
              link: rv.html_url,
            })
          }
        })
      )
    )

    // 3 Commits authored by user by org
    await Promise.all(
      orgs.map((org) =>
        limit(async () => {
          const q = `org:${encodeURIComponent(org)}+author:${encodeURIComponent(login)}+committer-date:${encodeURIComponent(
            `${since}..${until}`
          )}`
          const url = `${GITHUB_API_BASE}/search/commits?q=${q}&per_page=${GITHUB_PER_PAGE}`
          const res = await ghFetch(url, auth, {
            headers: { Accept: GITHUB_ACCEPT_PREVIEW },
          })
          // commit search may be limited - skip silently
          if (!res.ok) return
          const json = await res.json()
          for (const it of json.items || []) {
            const html = it.html_url as string
            const repo = it.repository?.full_name || parseCommitUrlToRepo(html) || ''
            if (!repo) continue
            const date = it.commit?.author?.date || it.commit?.committer?.date || it.score?.date
            if (!date) continue
            items.push({
              date,
              repo,
              repoUrl: `${GITHUB_WEB_BASE}/${repo}`,
              type: 'COMMIT',
              link: html,
            })
          }
        })
      )
    )

    // 4 merge, sort, paginate (cursor = [date]__[url])
    const dedupMap = new Map<string, Item>()
    for (const it of items) dedupMap.set(it.link, it)
    const dedup = Array.from(dedupMap.values())
    dedup.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime() || b.link.localeCompare(a.link)
    )

    let start = 0
    if (cursor) {
      const [cDate, cUrl] = cursor.split('__')
      start = dedup.findIndex((it) => it.date === cDate && it.link === cUrl) + 1
      if (start < 0) start = 0
    }

    const pageSize = 100
    const slice = dedup.slice(start, start + pageSize)
    const next =
      start + pageSize < dedup.length
        ? `${slice[slice.length - 1].date}__${slice[slice.length - 1].link}`
        : undefined

    const durationMs = Date.now() - started
    const headers = new Headers()
    headers.set(
      'x-meta',
      JSON.stringify({ login, orgs, since, until, total: dedup.length, pageSize, durationMs })
    )
    return Response.json(
      { login, total: dedup.length, items: slice, nextCursor: next },
      { headers }
    )
  } catch (e: any) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 })
  }
}
