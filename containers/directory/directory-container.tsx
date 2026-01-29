'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useContributors } from '@/hooks/useContributors'
import { useSocialProofData } from '@/hooks/useSocialProofData'
import StatsGrid from '@/components/stats/stats-grid'
import ContributorDirectory from '@/components/contributors/contributors-directory'

export default function DirectoryContainer() {
  const t = useTranslations('home')
  const tc = useTranslations('common')

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: contributors = [], isLoading, error } = useContributors()
  const {
    data: socialProof = {
      activeContributorsCount: 0,
      totalContributionsCount: 0,
      totalRepositoriesCount: 0,
      activeCirclesCount: 0,
    },
    isLoading: statsLoading,
    error: statsError,
  } = useSocialProofData()

  const filteredContributors = contributors.filter(
    (contributor) =>
      contributor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.latestRepo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 xl:px-0">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <h1 className="text-center">{tc('nav.directory')}</h1>
        </div>

        <div className="mb-12">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-primary w-full border px-3 py-2 pl-10 text-sm sm:text-base"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <StatsGrid data={socialProof} isLoading={statsLoading} error={!!statsError} />
        </section>

        <ContributorDirectory
          contributors={filteredContributors}
          isLoading={isLoading}
          error={!!error}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
