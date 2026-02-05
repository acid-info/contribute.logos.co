'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PullRequest } from '@/lib/github'

interface RepositoryData {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  updated_at: string
  html_url: string
}

export const useRepositoryData = (org: string, repo: string) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [prsLoading, setPrsLoading] = useState(false)
  const [prsError, setPrsError] = useState<string | null>(null)
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([])
  const [repoData, setRepoData] = useState<RepositoryData | null>(null)
  const [repoDataLoading, setRepoDataLoading] = useState(true)
  const [repoDataError, setRepoDataError] = useState<string | null>(null)
  const [totalPullRequests, setTotalPullRequests] = useState<number>(0)

  useEffect(() => {
    const fetchTotalPullRequestsCount = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/search/issues?q=repo:${org}/${repo}+is:pr+is:merged&per_page=1`
        )
        if (!response.ok) {
          // Non-critical error, don't block the whole UI
          console.error(`Failed to fetch total PR count: ${response.statusText}`)
          return
        }
        const data = await response.json()
        setTotalPullRequests(data.total_count || 0)
      } catch (error: any) {
        console.error('Error fetching total PR count:', error)
      }
    }

    const fetchRepositoryData = async () => {
      if (!org || !repo) return

      setRepoDataLoading(true)
      setRepoDataError(null)
      try {
        const response = await fetch(`https://api.github.com/repos/${org}/${repo}`)
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true)
          }
          throw new Error(`Failed to fetch repository: ${response.statusText}`)
        }
        const data: RepositoryData = await response.json()
        setRepoData(data)
        fetchTotalPullRequestsCount() // Fetch PR count after repo data is successfully fetched
      } catch (error: any) {
        console.error('Error fetching repository data:', error)
        setRepoDataError(error.message || 'Failed to load repository details')
        if (error.message.includes('404')) {
          setNotFound(true)
        }
      } finally {
        setRepoDataLoading(false)
        setLoading(false)
      }
    }

    fetchRepositoryData()
  }, [org, repo])

  const fetchPullRequestsData = async () => {
    if (!org || !repo || prsLoading) return

    setPrsLoading(true)
    setPullRequests([])
    setPrsError(null)

    try {
      const apiUrl = new URL(`${window.location.origin}/api/pull-requests`)
      apiUrl.searchParams.append('owner', org)
      apiUrl.searchParams.append('repo', repo)
      apiUrl.searchParams.append('page', '1')
      apiUrl.searchParams.append('per_page', '1000')

      const response = await fetch(apiUrl.toString())
      if (!response.ok) {
        throw new Error(`Failed to fetch pull requests: ${response.statusText}`)
      }
      const data = await response.json()
      let incomingPrs = data.pullRequests || []

      incomingPrs.sort((a: PullRequest, b: PullRequest) => {
        const dateA = new Date(a.mergedAt || a.closedAt || a.createdAt).getTime()
        const dateB = new Date(b.mergedAt || b.closedAt || b.createdAt).getTime()
        return dateB - dateA
      })

      setPullRequests(incomingPrs)
    } catch (error: any) {
      console.error('Error fetching pull requests:', error)
      setPrsError(error.message || 'An unknown error occurred')
    } finally {
      setPrsLoading(false)
    }
  }

  useEffect(() => {
    if (repoData && org && repo && pullRequests.length === 0 && !prsLoading) {
      fetchPullRequestsData()
    }
  }, [repoData, org, repo])

  useEffect(() => {
    if (notFound) {
      router.push('/projects') // TODO: Replace with ROUTES.projects if available in hook context or pass it
    }
  }, [notFound, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return {
    loading,
    notFound,
    prsLoading,
    prsError,
    pullRequests,
    repoData,
    repoDataLoading,
    repoDataError,
    totalPullRequests,
    formatDate,
  }
}
