'use client'

import { useState, useEffect } from 'react'

interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

export const useProjectsData = (activeOrg: string) => {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true)
      try {
        const apiUrl = new URL(`${window.location.origin}/api/repositories`)
        apiUrl.searchParams.append('org', activeOrg)

        const response = await fetch(apiUrl.toString())
        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.statusText}`)
        }
        const data = await response.json()
        setRepositories(data.repositories || [])
      } catch (error: any) {
        console.error('Error fetching repositories:', error)
        setRepositories([])
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [activeOrg])

  return {
    repositories,
    loading,
  }
}
