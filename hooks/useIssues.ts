'use client'

import { useQuery } from '@tanstack/react-query'
import { getContributeApiBase } from '@/lib/utils'

export interface IssueItem {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  url: string
  createdAt: string
  updatedAt: string
  author: string
  labels: string[]
  assignees: string[]
  comments: number
}

export interface IssuesApiResponse {
  owner: string
  repo: string
  count: number
  issues: IssueItem[]
}

const fetchIssues = async (): Promise<IssuesApiResponse> => {
  const base = getContributeApiBase()
  const res = await fetch(
    `${base}/projects/${encodeURIComponent('acid-info')}/${encodeURIComponent('contribute.logos.co')}/issues`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error(`Failed to fetch issues: ${res.status}`)
  return res.json()
}

export const useIssues = () => {
  return useQuery({
    queryKey: ['issues', 'acid-info', 'contribute.logos.co'],
    queryFn: fetchIssues,
    staleTime: 60_000,
    gcTime: 300_000,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 10_000),
  })
}
