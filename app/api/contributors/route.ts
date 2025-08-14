import {
  clampWindow,
  getAuth,
  ghFetch,
  graphql,
  makeLimiter,
  paginate,
  prQuery,
  uniqBy,
  parsePrUrl,
  GITHUB_API_BASE,
  GITHUB_PER_PAGE,
  DEFAULT_CONCURRENCY,
  GITHUB_WEB_BASE,
  GITHUB_ACCEPT_PREVIEW,
} from '@/lib/github'

type Latest = { date: string; type: 'PR' | 'REVIEW' | 'COMMIT'; link: string; repo: string }
type PersonAgg = {
  login: string
  profileUrl: string
  contributionCount: number
  latest: Latest
  internalFilter: 'public-membership-only'
}

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orgs = (searchParams.get('orgs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (orgs.length === 0) return Response.json({ error: 'orgs required' }, { status: 400 })

    const { since, until } = clampWindow(searchParams.get('since'), searchParams.get('until'))
    const auth = getAuth()
    const limit = makeLimiter(DEFAULT_CONCURRENCY)
    const limitReposPerOrg = Number(searchParams.get('limitReposPerOrg') || '0') || undefined
    const maxPrPages = Number(searchParams.get('maxPrPages') || '20')
    const maxReviewFetches = Number(searchParams.get('maxReviewFetches') || '200')
    const commitStrategy = (searchParams.get('commitStrategy') || 'list') as 'list' | 'search'
    const onlyExcludeOrgs = (searchParams.get('onlyExcludeOrgs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const orgsForMembership = Array.from(new Set([...orgs, ...onlyExcludeOrgs]))

    // 1 list public repos per org
    const reposPerOrg = await Promise.all(
      orgs.map((org) =>
        limit(async () => {
          const url = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}/repos?type=public&per_page=${GITHUB_PER_PAGE}&sort=updated`
          const repos = await paginate<any>(url, auth)
          const mapped = repos.map((r) => ({ owner: org, name: r.name, full: r.full_name }))
          return limitReposPerOrg ? mapped.slice(0, limitReposPerOrg) : mapped
        })
      )
    )
    const repos = reposPerOrg.flat()

    // 2 org members set
    const internalPublic = new Set<string>()
    await Promise.all(
      orgsForMembership.map((org) =>
        limit(async () => {
          const base = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}`
          const members = await paginate<any>(`${base}/members?per_page=${GITHUB_PER_PAGE}`, auth)
          for (const m of members) if (m.login) internalPublic.add(m.login)
        })
      )
    )

    // 3 collect contributions
    type Row = { login: string; date: string; type: Latest['type']; link: string; repo: string }
    const rows: Row[] = []
    const started = Date.now()
    let prCount = 0
    let reviewCount = 0
    let commitCount = 0
    const errors: string[] = []

    // PRs
    await Promise.all(
      repos.map((r) =>
        limit(async () => {
          const [owner, name] = r.full.split('/')
          let after: string | null = null
          try {
            for (let i = 0; i < maxPrPages; i++) {
              const data = await graphql<any>(prQuery, { owner, name, after }, auth)
              const repo = data.repository
              const prs = repo.pullRequests.nodes as any[]
              for (const pr of prs) {
                const createdAt = pr.createdAt as string
                if (until && new Date(createdAt) > new Date(until)) continue
                if (since && new Date(createdAt) < new Date(since)) {
                  after = null
                  break
                }
                const login = pr.author?.login
                if (!login) continue
                rows.push({
                  login,
                  date: createdAt,
                  type: 'PR',
                  link: pr.url,
                  repo: repo.nameWithOwner,
                })
                prCount++
              }
              if (!repo.pullRequests.pageInfo.hasNextPage) break
              after = repo.pullRequests.pageInfo.endCursor
              if (!after) break
            }
          } catch (e: any) {
            errors.push(`PRs ${owner}/${name}: ${e?.message || String(e)}`)
          }
        })
      )
    )

    // Reviews - fetch for recent PRs found above
    const prLinks = rows.filter((r) => r.type === 'PR').map((r) => r.link)
    const prUnique = Array.from(new Set(prLinks)).slice(0, Math.max(0, maxReviewFetches))
    await Promise.all(
      prUnique.map((urlStr) =>
        limit(async () => {
          const parsed = parsePrUrl(urlStr)
          if (!parsed) return
          const { owner, repo, number } = parsed
          try {
            const api = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${number}/reviews?per_page=${GITHUB_PER_PAGE}`
            const reviews = await paginate<any>(api, auth)
            for (const rv of reviews) {
              const login = rv.user?.login
              if (!login) continue
              const date = rv.submitted_at || rv.submittedAt
              if (since && date && new Date(date) < new Date(since)) continue
              if (until && date && new Date(date) > new Date(until)) continue
              rows.push({
                login,
                date,
                type: 'REVIEW',
                link: rv.html_url,
                repo: `${owner}/${repo}`,
              })
              reviewCount++
            }
          } catch (e: any) {
            errors.push(`Reviews ${owner}/${repo}#${number}: ${e?.message || String(e)}`)
          }
        })
      )
    )

    if (commitStrategy === 'search') {
      await Promise.all(
        orgs.map((org) =>
          limit(async () => {
            const q = `org:${encodeURIComponent(org)}+author:*+committer-date:${encodeURIComponent(
              `${since}..${until}`
            )}`
            const url = `${GITHUB_API_BASE}/search/commits?q=${q}&per_page=${GITHUB_PER_PAGE}`
            try {
              const res = await ghFetch(url, auth, {
                headers: {
                  Accept: GITHUB_ACCEPT_PREVIEW,
                },
              })
              if (res.ok) {
                const json = await res.json()
                for (const it of json.items || []) {
                  const repo = it.repository?.full_name
                  const login = it.author?.login
                  const date = it.commit?.author?.date || it.commit?.committer?.date
                  if (!repo || !login || !date) continue
                  rows.push({ login, date, type: 'COMMIT', link: it.html_url, repo })
                  commitCount++
                }
              } else {
                errors.push(`CommitSearch org:${org}: ${res.status}`)
              }
            } catch (e: any) {
              errors.push(`CommitSearch org:${org}: ${e?.message || String(e)}`)
            }
          })
        )
      )
    } else {
      // Commits per repo within window
      await Promise.all(
        repos.map((r) =>
          limit(async () => {
            const api = `${GITHUB_API_BASE}/repos/${encodeURIComponent(r.owner)}/${encodeURIComponent(
              r.name
            )}/commits?per_page=${GITHUB_PER_PAGE}&since=${encodeURIComponent(since)}&until=${encodeURIComponent(until)}`
            try {
              const commits = await paginate<any>(api, auth)
              for (const c of commits) {
                const login = c.author?.login
                const date = c.commit?.author?.date
                if (!login || !date) continue
                rows.push({ login, date, type: 'COMMIT', link: c.html_url, repo: r.full })
                commitCount++
              }
            } catch (e: any) {
              const msg = e?.message || String(e)
              if (msg.includes('409') || msg.includes('Git Repository is empty')) return
              errors.push(`Commits ${r.full}: ${msg}`)
            }
          })
        )
      )
    }

    // 4 aggregate & filter
    const byLogin = new Map<string, Row[]>()
    for (const r of rows) {
      if (!r.login) continue
      if (!byLogin.has(r.login)) byLogin.set(r.login, [])
      byLogin.get(r.login)!.push(r)
    }

    const people: PersonAgg[] = []
    for (const [login, list] of byLogin) {
      if (internalPublic.has(login)) continue
      const dedup = uniqBy(list, (x) => x.link)
      const latest = dedup.reduce((a, b) => (new Date(a.date) > new Date(b.date) ? a : b))
      people.push({
        login,
        profileUrl: `${GITHUB_WEB_BASE}/${login}`,
        contributionCount: dedup.length,
        latest: { date: latest.date, type: latest.type, link: latest.link, repo: latest.repo },
        internalFilter: 'public-membership-only',
      })
    }

    people.sort(
      (a, b) =>
        b.contributionCount - a.contributionCount ||
        new Date(b.latest.date).getTime() - new Date(a.latest.date).getTime()
    )

    const durationMs = Date.now() - started
    const headers = new Headers()
    headers.set(
      'x-meta',
      JSON.stringify({
        since,
        until,
        orgs,
        repos: repos.length,
        prCount,
        reviewCount,
        commitCount,
        durationMs,
        errors,
      })
    )
    return Response.json(people, { headers })
  } catch (e: any) {
    return Response.json({ error: e?.message || String(e) }, { status: 500 })
  }
}
