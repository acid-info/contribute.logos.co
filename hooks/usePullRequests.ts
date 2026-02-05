import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'
import type { PullRequest } from '@/types'

interface PullRequestsApiResponse {
  repo: string
  since: string
  until: string
  count: number
  generatedAt: string
  pullRequests: PullRequest[]
}

const fetchPullRequests = async (org: string, repo: string): Promise<PullRequest[]> => {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/projects/${org}/${repo}/pull-requests`)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch pull requests for org "${org}" and repo "${repo}": ${res.status}`
    )
  }

  const response = (await res.json()) as PullRequestsApiResponse

  if (!response.pullRequests) {
    throw new Error('Invalid pull requests response')
  }

  return response.pullRequests
}

export const usePullRequests = (org: string | null, repo: string | null) => {
  return useQuery({
    queryKey: ['pullRequests', org, repo],
    queryFn: () => fetchPullRequests(`${org}`, `${repo}`),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!org && !!repo,
  })
}
