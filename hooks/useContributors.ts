import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'
import { Contributor } from '@/types'

interface ContributorApiResponse {
  login: string
  profileUrl: string
  contributionCount: number
  latest: {
    date: string
    type: 'PR' | 'REVIEW' | 'COMMIT'
    link: string
    repo: string
  }
}

const fetchContributors = async (): Promise<Contributor[]> => {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/contribute/contributors`)

  if (!res.ok) {
    throw new Error(`Failed to fetch contributors: ${res.status}`)
  }

  const data = (await res.json()) as ContributorApiResponse[]

  return data.map((contributor, idx) => ({
    id: idx + 1,
    username: contributor.login,
    profileUrl: contributor.profileUrl,
    contributions: contributor.contributionCount,
    latestContribution: contributor.latest.date,
    latestRepo: contributor.latest.repo,
    avatarUrl: `https://github.com/${contributor.login}.png`,
  }))
}

export const useContributors = () => {
  return useQuery({
    queryKey: ['contributors'],
    queryFn: fetchContributors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
