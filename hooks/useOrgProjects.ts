import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
}

interface OrgProjectsApiResponse {
  organization: string
  count: number
  repositories: Repository[]
}

const fetchOrgProjects = async (org: string): Promise<Repository[]> => {
  const base = getContributeApiBase()
  const res = await fetch(`${base}/projects/${org}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch projects for org "${org}": ${res.status}`)
  }

  const response = (await res.json()) as OrgProjectsApiResponse

  if (!response.repositories) {
    throw new Error('Invalid org projects response')
  }

  return response.repositories
}

export const useOrgProjects = (org: string | null) => {
  return useQuery({
    queryKey: ['orgProjects', org],
    queryFn: () => fetchOrgProjects(org as string),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!org, // Only run the query if org is provided
  })
}
