import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'
import { Contributor } from '@/types'

interface SeasonApiResponse {
  data: Array<{
    season_id: number
    contributor_id: number
    season_points: number
    rank: number
    github_username: string | null
    alias: string
    rank_id: number | null
    rank_name: string | null
    rank_power: number | null
    contribution_count: number
    latest_contribution_at: string | null
    latest_repo: string | null
  }>
  season: {
    id: number
    code: string
    starts_at: string
    ends_at: string
  } | null
}

interface UseSeasonalLeaderboardOptions {
  sort?: 'points' | 'newest'
}

const fetchSeasonalLeaderboard = async ({ sort }: UseSeasonalLeaderboardOptions = {}): Promise<{
  contributors: Contributor[]
  season: SeasonApiResponse['season']
}> => {
  const base = getContributeApiBase()
  const params = new URLSearchParams()
  if (sort) params.set('sort', sort)
  const query = params.toString()
  const res = await fetch(`${base}/leaderboard/season/current${query ? `?${query}` : ''}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch seasonal leaderboard: ${res.status}`)
  }

  const json = (await res.json()) as SeasonApiResponse

  const contributors = json.data.map((entry) => ({
    id: entry.contributor_id,
    username: entry.github_username || entry.alias,
    profileUrl: entry.github_username ? `https://github.com/${entry.github_username}` : '',
    contributions: entry.contribution_count,
    latestContribution: entry.latest_contribution_at || '',
    latestRepo: entry.latest_repo || '',
    avatarUrl: entry.github_username ? `https://github.com/${entry.github_username}.png` : '',
  }))

  return { contributors, season: json.season }
}

export const useSeasonalLeaderboard = (options: UseSeasonalLeaderboardOptions = {}) => {
  const { sort } = options

  return useQuery({
    queryKey: ['seasonal-leaderboard', { sort }],
    queryFn: () => fetchSeasonalLeaderboard(options),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
