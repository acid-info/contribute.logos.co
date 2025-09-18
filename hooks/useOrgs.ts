import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

interface OrgsApiResponse {
  orgs: string[]
}

const fetchOrgs = async (): Promise<string[]> => {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/orgs`)

  if (!res.ok) {
    throw new Error(`Failed to fetch orgs: ${res.status}`)
  }

  const response = (await res.json()) as OrgsApiResponse

  if (!response.orgs) {
    throw new Error('Invalid orgs response')
  }

  return response.orgs
}

export const useOrgs = () => {
  return useQuery({
    queryKey: ['orgs'],
    queryFn: fetchOrgs,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
