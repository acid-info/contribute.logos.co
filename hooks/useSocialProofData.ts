import { useQuery } from '@tanstack/react-query'
import type { SocialProofData } from '@/types'
import { getContributeApiBase } from '@/lib/utils'

const STALE_TIME_MS = 24 * 60 * 60 * 1000 // 24 hours
const GC_TIME_MS = STALE_TIME_MS

interface StatsApiResponse {
  totalContributions?: number
  activeContributors?: number
  totalRepositories?: number
  activeCircles?: number
  totalContributionsCount?: number
  activeContributorsCount?: number
  totalRepositoriesCount?: number
  activeCirclesCount?: number
}

interface WrappedStatsApiResponse {
  success?: boolean
  data?: {
    socialProof?: StatsApiResponse
  }
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

async function fetchSocialProofData(): Promise<SocialProofData> {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/contribute/stats`)

  if (!res.ok) {
    throw new Error(`Failed to fetch stats: ${res.status}`)
  }

  const raw = (await res.json()) as StatsApiResponse | WrappedStatsApiResponse
  const data =
    'data' in raw ? ((raw.data?.socialProof ?? {}) as StatsApiResponse) : (raw as StatsApiResponse)

  return {
    totalContributionsCount: toNumber(data.totalContributionsCount ?? data.totalContributions),
    activeContributorsCount: toNumber(data.activeContributorsCount ?? data.activeContributors),
    totalRepositoriesCount: toNumber(data.totalRepositoriesCount ?? data.totalRepositories),
    activeCirclesCount: toNumber(data.activeCirclesCount ?? data.activeCircles),
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
