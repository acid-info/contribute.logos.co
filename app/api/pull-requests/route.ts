import {
  getAuth,
  ghFetch,
  GITHUB_API_BASE,
  fetchPullRequestContributors,
  makeLimiter,
  DEFAULT_CONCURRENCY,
} from '@/lib/github'
import { PullRequest } from '@/lib/github'

export const dynamic = 'force-dynamic'

// This function now fetches PRs using the REST API for simpler page/per_page handling
// and then fetches contributors for each PR.
async function fetchPullRequestsWithContributors(
  owner: string,
  repo: string,
  auth: { token?: string | null },
  page: number,
  per_page: number
): Promise<PullRequest[]> {
  const prsUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&page=${page}&per_page=${per_page}`

  const response = await ghFetch(prsUrl, auth)
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GitHub API error ${response.status}: ${body}`)
  }

  const data = await response.json() // Array of PR objects from REST API

  // Map basic PR data first
  const basicPrs: Omit<PullRequest, 'contributors'>[] = data.map((pr: any) => ({
    number: pr.number,
    title: pr.title,
    createdAt: pr.created_at,
    mergedAt: pr.merged_at,
    closedAt: pr.closed_at, // Added closedAt
    url: pr.html_url,
    author: {
      login: pr.user.login,
      __typename: 'User',
    },
    repository: {
      nameWithOwner: pr.base.repo.full_name,
      url: pr.base.repo.html_url,
    },
  }))

  // Now, fetch contributors for each PR in the current page
  const limiter = makeLimiter(DEFAULT_CONCURRENCY)
  const prsWithContributors = await Promise.all(
    basicPrs.map(async (pr) => {
      const contributors = await limiter(() =>
        fetchPullRequestContributors(owner, repo, pr.number, auth)
      )
      return { ...pr, contributors }
    })
  )

  return prsWithContributors
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const owner = searchParams.get('owner')
    const repo = searchParams.get('repo')
    const page = Number(searchParams.get('page')) || 1
    const per_page = Number(searchParams.get('per_page')) || 40 // Default to 40 as per frontend

    if (!owner || !repo) {
      return Response.json({ error: 'owner and repo parameters are required' }, { status: 400 })
    }

    const auth = getAuth()
    const pullRequests = await fetchPullRequestsWithContributors(owner, repo, auth, page, per_page)

    const responseHeaders = new Headers()
    responseHeaders.set('Content-Type', 'application/json')
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    responseHeaders.set('Pragma', 'no-cache')
    responseHeaders.set('Expires', '0')

    return new Response(
      JSON.stringify({
        repository: `${owner}/${repo}`,
        count: pullRequests.length, // This will be count for the current page
        pullRequests,
      }),
      {
        status: 200,
        headers: responseHeaders,
      }
    )
  } catch (e: any) {
    console.error('Error fetching pull requests:', e)
    return Response.json({ error: e?.message || String(e) }, { status: 500 })
  }
}
