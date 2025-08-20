import {
  clampWindow,
  getAuth,
  graphql,
  makeLimiter,
  paginate,
  prQuery,
  uniqBy,
  parsePrUrl,
  isBotAccount,
  GITHUB_API_BASE,
  GITHUB_PER_PAGE,
  DEFAULT_CONCURRENCY,
  GITHUB_WEB_BASE,
} from '@/lib/github'

export type Latest = { date: string; type: 'PR' | 'REVIEW' | 'COMMIT'; link: string; repo: string }
export type PersonAgg = {
  login: string
  profileUrl: string
  contributionCount: number
  latest: Latest
  internalFilter: 'public-membership-only'
}

export type CollectParams = {
  orgs: string[]
  since?: string
  until?: string
  maxPrPages?: number
  maxReviewFetches?: number
  onlyExcludeOrgs?: string[]
  githubToken?: string
}

export async function collectContributors(
  p: CollectParams
): Promise<{ people: PersonAgg[]; meta: any }> {
  console.log('Starting collectContributors with params:', {
    orgs: p.orgs,
    since: p.since,
    until: p.until,
  })
  const { since, until } = clampWindow(p.since, p.until)
  console.log('Clamped window:', { since, until })

  const auth = p.githubToken ? { token: p.githubToken } : getAuth()
  const limit = makeLimiter(DEFAULT_CONCURRENCY)
  const maxPrPages = p.maxPrPages ?? 20
  const maxReviewFetches = p.maxReviewFetches ?? 200
  const onlyExcludeOrgs = p.onlyExcludeOrgs || []
  const orgsForMembership = Array.from(new Set([...p.orgs, ...onlyExcludeOrgs]))

  console.log('Configuration:', {
    maxPrPages,
    maxReviewFetches,
    orgsForMembership,
  })

  // 1 list public repos per org
  console.log('Step 1: Fetching public repos for orgs:', p.orgs)
  const reposPerOrg = await Promise.all(
    p.orgs.map((org) =>
      limit(async () => {
        console.log(`Fetching repos for org: ${org}`)
        const url = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}/repos?type=public&per_page=${GITHUB_PER_PAGE}&sort=updated`
        const repos = await paginate<any>(url, auth)
        const mapped = repos.map((r) => ({ owner: org, name: r.name, full: r.full_name }))
        console.log(`Found ${mapped.length} repos for org: ${org}`)
        return mapped
      })
    )
  )
  const repos = reposPerOrg.flat()
  console.log(`Total repos found: ${repos.length}`)

  // 2 org members set
  console.log('Step 2: Fetching org members for:', orgsForMembership)
  const internalPublic = new Set<string>()
  await Promise.all(
    orgsForMembership.map((org) =>
      limit(async () => {
        console.log(`Fetching members for org: ${org}`)
        const base = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}`
        const members = await paginate<any>(`${base}/members?per_page=${GITHUB_PER_PAGE}`, auth)
        for (const m of members) if (m.login) internalPublic.add(m.login)
        console.log(`Found ${members.length} members for org: ${org}`)
      })
    )
  )
  console.log(`Total internal members found: ${internalPublic.size}`)

  // 3 collect contributions
  type Row = {
    login: string
    date: string
    type: Latest['type']
    link: string
    repo: string
    userType?: string
  }
  const rows: Row[] = []
  const started = Date.now()
  let prCount = 0
  let reviewCount = 0
  let commitCount = 0
  const errors: string[] = []
  const prAuthorByLink = new Map<string, string>()

  // PRs
  console.log('Step 3a: Fetching PRs for repos:', repos.length)
  await Promise.all(
    repos.map((r) =>
      limit(async () => {
        const [owner, name] = r.full.split('/')
        let after: string | null = null
        try {
          console.log(`Fetching PRs for repo: ${r.full}`)
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
                userType: pr.author?.__typename,
              })
              prAuthorByLink.set(pr.url, login)
              prCount++
            }
            if (!repo.pullRequests.pageInfo.hasNextPage) break
            after = repo.pullRequests.pageInfo.endCursor
            if (!after) break
          }
          console.log(`Found ${prCount} PRs for repo: ${r.full}`)
        } catch (e: any) {
          const errorMsg = `PRs ${owner}/${name}: ${e?.message || String(e)}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      })
    )
  )
  console.log(`Total PRs collected: ${prCount}`)

  // Reviews - fetch for recent PRs found above
  console.log('Step 3b: Fetching reviews for PRs')
  const prLinks = rows.filter((r) => r.type === 'PR').map((r) => r.link)
  const prUnique = Array.from(new Set(prLinks)).slice(0, Math.max(0, maxReviewFetches))
  console.log(`Fetching reviews for ${prUnique.length} unique PRs`)
  await Promise.all(
    prUnique.map((urlStr) =>
      limit(async () => {
        const parsed = parsePrUrl(urlStr)
        if (!parsed) return
        const { owner, repo, number } = parsed
        try {
          console.log(`Fetching reviews for PR: ${owner}/${repo}#${number}`)
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
              userType: rv.user?.type,
            })
            reviewCount++
          }
          console.log(`Found ${reviews.length} reviews for PR: ${owner}/${repo}#${number}`)
        } catch (e: any) {
          const errorMsg = `Reviews ${owner}/${repo}#${number}: ${e?.message || String(e)}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      })
    )
  )
  console.log(`Total reviews collected: ${reviewCount}`)

  // PR commits: attribute contributions to non-author external committers
  console.log('Step 3c: Fetching commits for PRs to attribute external committers')
  await Promise.all(
    prUnique.map((urlStr) =>
      limit(async () => {
        const parsed = parsePrUrl(urlStr)
        if (!parsed) return
        const { owner, repo, number } = parsed
        const prAuthor = prAuthorByLink.get(urlStr)
        try {
          console.log(`Fetching commits for PR: ${owner}/${repo}#${number}`)
          const api = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls/${number}/commits?per_page=${GITHUB_PER_PAGE}`
          const commits = await paginate<any>(api, auth)
          for (const c of commits) {
            const login = c.author?.login
            const date = c.commit?.author?.date
            if (!login || !date) continue
            if (prAuthor && login === prAuthor) continue
            if (since && new Date(date) < new Date(since)) continue
            if (until && new Date(date) > new Date(until)) continue
            if (internalPublic.has(login)) continue
            rows.push({ login, date, type: 'COMMIT', link: c.html_url, repo: `${owner}/${repo}` })
            commitCount++
          }
          console.log(`Found ${commits.length} commits for PR: ${owner}/${repo}#${number}`)
        } catch (e: any) {
          const errorMsg = `PRCommits ${owner}/${repo}#${number}: ${e?.message || String(e)}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      })
    )
  )
  console.log(`Total PR commit contributions collected: ${commitCount}`)

  // 4 aggregate & filter
  console.log('Step 4: Aggregating and filtering contributors')
  const byLogin = new Map<string, Row[]>()
  for (const r of rows) {
    if (!r.login) continue
    if (!byLogin.has(r.login)) byLogin.set(r.login, [])
    byLogin.get(r.login)!.push(r)
  }
  console.log(`Unique contributors found: ${byLogin.size}`)

  const people: PersonAgg[] = []
  let filteredInternal = 0
  let filteredBots = 0

  for (const [login, list] of byLogin) {
    if (internalPublic.has(login)) {
      filteredInternal++
      continue
    }

    const hasExplicitBotType = list.some((row) => row.userType === 'Bot')
    if (hasExplicitBotType || isBotAccount(login)) {
      filteredBots++
      continue
    }

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

  console.log(`Filtered out ${filteredInternal} internal members and ${filteredBots} bots`)
  console.log(`Final contributors: ${people.length}`)

  people.sort(
    (a, b) =>
      b.contributionCount - a.contributionCount ||
      new Date(b.latest.date).getTime() - new Date(a.latest.date).getTime()
  )

  const duration = Date.now() - started
  console.log(`collectContributors completed in ${duration}ms`)
  console.log('Summary:', { prCount, reviewCount, commitCount, errors: errors.length })

  return {
    people,
    meta: {
      since,
      until,
      orgs: p.orgs,
      repos: repos.length,
      prCount,
      reviewCount,
      commitCount,
      durationMs: duration,
      errors,
    },
  }
}
