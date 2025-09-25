'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'
import LeaderboardTabs from '@/components/leaderboard/leaderboard-tabs'
import LeaderboardTable from '@/components/leaderboard/leaderboard-table'
import Pagination from '@/components/pagination'
import TierSystemContainer from './tier-system-container'
import ScoringSystemContainer from './scoring-system-container'
import { generateMockData } from '@/lib/leaderboard-utils'

export default function LeaderboardContainer() {
  const t = useTranslations('leaderboard')
  const tc = useTranslations('common')
  const [activeTab, setActiveTab] = useState<'seasonal' | 'historical'>('seasonal')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const seasonalData = useMemo(() => generateMockData('seasonal'), [])
  const historicalData = useMemo(() => generateMockData('historical'), [])

  const currentData = activeTab === 'seasonal' ? seasonalData : historicalData
  const totalPages = Math.ceil(currentData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentEntries = currentData.slice(startIndex, startIndex + itemsPerPage)

  const handleTabChange = (tab: 'seasonal' | 'historical') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl py-20">
        <div className="mb-12 text-center">
          <Typography variant="h1" className="pb-4 !text-3xl lg:!text-4xl">
            {t('title')}
          </Typography>
          <Typography variant="subtitle1" className="mb-6 text-base sm:text-lg">
            {t('subtitle')}
          </Typography>
        </div>

        <div className="mb-8">
          <LeaderboardTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            seasonalLabel={t('tabs.seasonal')}
            historicalLabel={t('tabs.historical')}
          />
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Typography variant="h2" className="!text-xl">
              {activeTab === 'seasonal' ? t('tabs.seasonal') : t('tabs.historical')}
            </Typography>
            <Typography variant="body2">
              {activeTab === 'seasonal' ? t('description.seasonal') : t('description.historical')}
            </Typography>
          </div>

          <LeaderboardTable
            entries={currentEntries}
            rankLabel={t('table.rank')}
            contributorLabel={t('table.contributor')}
            tierLabel={t('table.tier')}
            scoreLabel={t('table.score')}
            contributionsLabel={t('table.contributions')}
            repositoriesLabel={t('table.repositories')}
            showTier={activeTab === 'historical'}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={currentData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          showingText={t('pagination.showing', {
            start: '{start}',
            end: '{end}',
            total: '{total}',
          })}
          previousText={t('pagination.previous')}
          nextText={t('pagination.next')}
        />

        {/* Tier System Information */}
        <TierSystemContainer />

        {/* Scoring System Information */}
        <ScoringSystemContainer />
      </div>
    </div>
  )
}
