import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

export type ApiItemType = 'PR' | 'REVIEW' | 'COMMIT'

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
  items: ApiItem[]
  nextCursor?: string
}

const fetchContributorDetails = async (
  username: string
): Promise<ContributorDetailsApiResponse> => {
  if (!username) {
    throw new Error('Missing username')
  }

  const base = getContributeApiBase()
  const res = await fetch(`${base}/contribute/contributors/${encodeURIComponent(username)}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch contributor details: ${res.status}`)
  }

  return res.json()
}

export const useContributorDetails = (username: string) => {
  return useQuery({
    queryKey: ['contributor-details', username],
    queryFn: () => fetchContributorDetails(username),
    enabled: !!username, // Only run query if username exists
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
