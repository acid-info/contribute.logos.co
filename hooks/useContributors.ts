import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'
import { Contributor } from '@/types'

interface ContributorApiResponse {
  contributor_id: number | string
  total_points: number | string
  rank: number | string
  github_username: string | null
  alias: string
  rank_id: number | null
  rank_name: string | null
  rank_power: number | null
  contribution_count: number | string
  repository_count?: number | string | null
  repositories_count?: number | string | null
  latest_contribution_at: string | null
  latest_repo: string | null
}

interface UseContributorsOptions {
  sort?: 'points' | 'newest'
  limit?: number
}

const getTierName = (rankName: string | null, totalPoints: number): string | null => {
  if (rankName && rankName.trim().length > 0) return rankName
  if (totalPoints >= 30) return 'Builder'
  if (totalPoints > 0) return 'Explorer'
  return null
}

const toNumber = (value: number | string): number => {
  const parsed = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(parsed) ? parsed : 0
}

const toOptionalNumber = (value?: number | string | null): number | undefined => {
  if (value == null) return undefined
  return toNumber(value)
}

const fetchContributors = async ({ sort, limit }: UseContributorsOptions = {}): Promise<
  Contributor[]
> => {
  const base = getContributeApiBase()
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)
  if (limit) params.set('limit', String(limit))
  const query = params.toString()
  const res = await fetch(`${base}/contribute/contributors${query ? `?${query}` : ''}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch contributors: ${res.status}`)
  }

  const data = (await res.json()) as ContributorApiResponse[]

  return data.map((contributor) => {
    const points = toNumber(contributor.total_points)

    return {
      id: toNumber(contributor.contributor_id),
      username: contributor.github_username || contributor.alias,
      profileUrl: contributor.github_username
        ? `https://github.com/${contributor.github_username}`
        : '',
      rank: toNumber(contributor.rank),
      points,
      contributions: toNumber(contributor.contribution_count),
      repositories: toOptionalNumber(
        contributor.repository_count ?? contributor.repositories_count
      ),
      tier: getTierName(contributor.rank_name, points),
      latestContribution: contributor.latest_contribution_at || '',
      latestRepo: contributor.latest_repo || '',
      avatarUrl: contributor.github_username
        ? `https://github.com/${contributor.github_username}.png`
        : '',
    }
  })
}

export const useContributors = (options: UseContributorsOptions = {}) => {
  const { sort, limit } = options

  return useQuery({
    queryKey: ['contributors', { sort, limit }],
    queryFn: () => fetchContributors(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
