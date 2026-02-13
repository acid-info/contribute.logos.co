'use client'

import { useState, useEffect } from 'react'
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
  const [activeTab, setActiveTab] = useState<'seasonal' | 'historical'>('historical')
  const [sortBy, setSortBy] = useState<SortOption>('points')
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

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, sortBy])

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
              { value: 'points', label: t('table.score') },
              { value: 'newest', label: 'Newest' },
            ]}
          />
        </div>

        <Typography variant="body2" className="mb-6">
          {activeTab === 'seasonal' ? t('description.seasonal') : t('description.historical')}
        </Typography>

        <ContributorDirectory
          contributors={contributors}
          isLoading={isLoading}
          error={!!error}
          showTier={activeTab === 'historical'}
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
