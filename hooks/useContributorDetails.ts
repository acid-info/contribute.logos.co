import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

export type ApiItemType = 'PR' | 'REVIEW' | 'COMMIT' | 'OTHER'

export interface ApiItem {
  date: string
  repo: string
  repoUrl: string
  type: ApiItemType
  link: string
}

interface ContributorDetailsApiResponse {
  login: string
  total: number
  page: number
  limit: number
  totalPages: number
  latest?: ApiItem
  items: ApiItem[]
}

const fetchContributorDetails = async (
  username: string,
  page: number,
  limit: number
): Promise<ContributorDetailsApiResponse> => {
  if (!username) {
    throw new Error('Missing username')
  }

  const base = getContributeApiBase()
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  const res = await fetch(
    `${base}/contribute/contributors/${encodeURIComponent(username)}?${params.toString()}`
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch contributor details: ${res.status}`)
  }

  return res.json()
}

export const useContributorDetails = (username: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['contributor-details', username, page, limit],
    queryFn: () => fetchContributorDetails(username, page, limit),
    enabled: !!username, // Only run query if username exists
    placeholderData: (previousData) => previousData,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
