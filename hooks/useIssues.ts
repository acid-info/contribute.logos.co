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

interface GithubApiIssue {
  _airbyte_extracted_at: string
  assignee_login: string | null
  assignee_login_id: string | null
  author_association: string
  body: string
  closed_at: string | null
  created_at: string
  draft: boolean | null
  id: number
  labels_array: string[]
  locked: boolean
  login_id: string
  milestone: string | null
  nb_comments: number
  number: number
  program: string
  repo_private: boolean
  repository: string
  state: 'open' | 'closed'
  state_reason: string | null
  title: string
  updated_at: string
  user_login: string
  user_view_type: string
  url?: string
}

interface ContributeApiResponse {
  success: boolean
  data: GithubApiIssue[]
}

const transformApiIssue = (apiIssue: GithubApiIssue): IssueItem => {
  return {
    id: apiIssue.id,
    number: apiIssue.number,
    title: apiIssue.title,
    state: apiIssue.state,
    url: apiIssue.url || '',
    createdAt: apiIssue.created_at,
    updatedAt: apiIssue.updated_at,
    author: apiIssue.user_login || '',
    labels: apiIssue.labels_array || [],
    assignees: apiIssue.assignee_login ? [apiIssue.assignee_login] : [],
    comments: apiIssue.nb_comments || 0,
  }
}

const fetchIssues = async (): Promise<IssuesApiResponse> => {
  // Fetch from both APIs in parallel
  const [previousRes, contributeRes] = await Promise.allSettled([
    fetch(
      `${getContributeApiBase()}/projects/${encodeURIComponent('acid-info')}/${encodeURIComponent('contribute.logos.co')}/issues`,
      { next: { revalidate: 60 } }
    ),
    fetch(`${getContributeApiBase()}/contribute/issues`, {
      next: { revalidate: 60 },
    }),
  ])

  // Handle previous API response
  let previousIssues: IssueItem[] = []
  if (previousRes.status === 'fulfilled' && previousRes.value.ok) {
    try {
      const previousData: IssuesApiResponse = await previousRes.value.json()
      previousIssues = previousData.issues || []
    } catch (error) {
      console.error('Failed to parse previous API response:', error)
    }
  } else if (previousRes.status === 'rejected') {
    console.error('Failed to fetch from previous API:', previousRes.reason)
  }

  // Handle contribute API response
  let contributeIssues: IssueItem[] = []
  if (contributeRes.status === 'fulfilled' && contributeRes.value.ok) {
    try {
      const contributeData: ContributeApiResponse = await contributeRes.value.json()
      if (contributeData.success && contributeData.data) {
        contributeIssues = contributeData.data.map(transformApiIssue)
      }
    } catch (error) {
      console.error('Failed to parse contribute API response:', error)
    }
  } else if (contributeRes.status === 'rejected') {
    console.error('Failed to fetch from contribute API:', contributeRes.reason)
  }

  // Merge both results, removing duplicates by issue ID
  const allIssues = [...previousIssues, ...contributeIssues]
  const uniqueIssues = Array.from(new Map(allIssues.map((issue) => [issue.id, issue])).values())

  // Sort by updated date (latest first)
  const sortedIssues = uniqueIssues.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime()
    const dateB = new Date(b.updatedAt).getTime()
    return dateB - dateA // Descending order (latest first)
  })

  return {
    owner: '',
    repo: '',
    count: sortedIssues.length,
    issues: sortedIssues,
  }
}

export const useIssues = () => {
  return useQuery({
    queryKey: ['issues', 'acid-info', 'contribute.logos.co', 'contribute'],
    queryFn: fetchIssues,
    staleTime: 60_000,
    gcTime: 300_000,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 10_000),
  })
}
