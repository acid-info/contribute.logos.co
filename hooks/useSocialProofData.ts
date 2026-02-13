import { useQuery } from '@tanstack/react-query'
import type { SocialProofData } from '@/types'
import { getContributeApiBase } from '@/lib/utils'

const STALE_TIME_MS = 24 * 60 * 60 * 1000 // 24 hours
const GC_TIME_MS = STALE_TIME_MS

interface StatsApiResponse {
  totalContributions: number
  activeContributors: number
  totalRepositories: number
  activeCircles: number
}

async function fetchSocialProofData(): Promise<SocialProofData> {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/contribute/stats`)

  if (!res.ok) {
    throw new Error(`Failed to fetch stats: ${res.status}`)
  }

  const data = (await res.json()) as StatsApiResponse

  return {
    totalContributionsCount: data.totalContributions,
    activeContributorsCount: data.activeContributors,
    totalRepositoriesCount: data.totalRepositories,
    activeCirclesCount: data.activeCircles,
  }
}

export const useSocialProofData = () => {
  return useQuery({
    queryKey: ['socialProofData'],
    queryFn: fetchSocialProofData,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
