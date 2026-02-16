'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'
import SortDropdown from '@/components/ui/sort-dropdown'
import LeaderboardTabs from '@/components/leaderboard/leaderboard-tabs'
import ContributorDirectory from '@/components/contributors/contributors-directory'
import TierSystemContainer from './tier-system-container'
import ScoringSystemContainer from './scoring-system-container'
import { useContributors } from '@/hooks/useContributors'
import { useSeasonalLeaderboard } from '@/hooks/useSeasonalLeaderboard'

type SortOption = 'points' | 'newest'

export default function LeaderboardContainer() {
  const t = useTranslations('leaderboard')
  const th = useTranslations('home')
  const [activeTab, setActiveTab] = useState<'seasonal' | 'historical'>('historical')
  const [sortBy, setSortBy] = useState<SortOption>('points')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const {
    data: seasonalData,
    isLoading: seasonalLoading,
    error: seasonalError,
  } = useSeasonalLeaderboard({ sort: sortBy })

  const {
    data: allTimeData = [],
    isLoading: allTimeLoading,
    error: allTimeError,
  } = useContributors({ sort: sortBy })

  const contributors = activeTab === 'seasonal' ? (seasonalData?.contributors ?? []) : allTimeData
  const isLoading = activeTab === 'seasonal' ? seasonalLoading : allTimeLoading
  const error = activeTab === 'seasonal' ? seasonalError : allTimeError
  const filteredContributors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (!normalizedSearch) return contributors

    return contributors.filter(
      (contributor) =>
        contributor.username.toLowerCase().includes(normalizedSearch) ||
        contributor.latestRepo.toLowerCase().includes(normalizedSearch)
    )
  }, [contributors, searchTerm])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, sortBy, searchTerm])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl py-10 sm:py-20">
        <div className="mb-12 text-center">
          <Typography variant="h1" className="pb-4 !text-3xl lg:!text-4xl">
            {t('title')}
          </Typography>
          <Typography variant="subtitle1" className="text-base sm:text-lg">
            {t('subtitle')}
          </Typography>
        </div>

        <div className="my-8 mb-16 sm:mt-12">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={th('search.placeholder')}
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

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <LeaderboardTabs
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
            }}
            seasonalLabel={t('tabs.seasonal')}
            historicalLabel={t('tabs.historical')}
          />
          <SortDropdown
            value={sortBy}
            onChange={(value) => setSortBy(value as SortOption)}
            options={[
              { value: 'points', label: t('table.point') },
              { value: 'newest', label: 'Newest' },
            ]}
          />
        </div>

        <div className="mb-6">
          {activeTab === 'seasonal' ? t('description.seasonal') : t('description.historical')}
        </div>

        <ContributorDirectory
          contributors={filteredContributors}
          isLoading={isLoading}
          error={!!error}
          variant="list"
          showHeader={false}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

        <TierSystemContainer />
        <ScoringSystemContainer />
      </div>
    </div>
  )
}
