import { useQuery } from '@tanstack/react-query'
import type { SocialProofData } from '@/types'
import { getTodayISODateDaysAgo } from '@/lib/utils'

const HASURA_BI_API_BASE = 'https://hasura.bi.status.im'
const REVALIDATE_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours
const STALE_TIME_MS = REVALIDATE_INTERVAL_MS
const GC_TIME_MS = REVALIDATE_INTERVAL_MS
const RETRY_COUNT = 3
const RETRY_DELAY_BASE_MS = 1000 // 1 second
const RETRY_DELAY_MAX_MS = 30000 // 30 seconds

interface ContributionsApiResponse {
  stg_external_contributors_agg_total_ext_contributions: Array<{
    total_commits: number
    total_external_collaborators: number
    total_issues: number
    total_prs: number
    total_repositories: number
  }>
}

interface CirclesApiResponse {
  data: {
    stg_external_circle_circle_event_aggregate: {
      aggregate: { count: number }
    }
  }
}

const getActiveCirclesCountQuery = (sinceDate: string) => `query CountDistinctCities {
  stg_external_circle_circle_event_aggregate(where: { end_at: { _gte: "${sinceDate}" } }) {
    aggregate {
      count(distinct: true, columns: location_city)
    }
  }
}`

async function fetchSocialProofData(): Promise<SocialProofData> {
  const sinceDate = getTodayISODateDaysAgo(120)
  const [contributionsRes, circlesRes] = await Promise.all([
    fetch(`${HASURA_BI_API_BASE}/api/rest/contributions/count_all`),
    fetch(`${HASURA_BI_API_BASE}/v1/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: getActiveCirclesCountQuery(sinceDate) }),
    }),
  ])

  if (!contributionsRes.ok) throw new Error(`Contributions: ${contributionsRes.status}`)
  if (!circlesRes.ok) throw new Error(`Circles: ${circlesRes.status}`)

  const contributions = (await contributionsRes.json()) as ContributionsApiResponse
  const circles = (await circlesRes.json()) as CirclesApiResponse
  const agg = contributions.stg_external_contributors_agg_total_ext_contributions[0]

  if (!agg) throw new Error('Missing contributions aggregate')

  return {
    activeContributorsCount: agg.total_external_collaborators,
    totalContributionsCount: agg.total_commits,
    totalRepositoriesCount: agg.total_repositories,
    activeCirclesCount:
      circles.data?.stg_external_circle_circle_event_aggregate?.aggregate?.count ?? 0,
  }
}

export const useSocialProofData = () => {
  return useQuery({
    queryKey: ['socialProofData'],
    queryFn: fetchSocialProofData,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    retry: RETRY_COUNT,
    retryDelay: (attemptIndex) =>
      Math.min(RETRY_DELAY_BASE_MS * 2 ** attemptIndex, RETRY_DELAY_MAX_MS),
  })
}
