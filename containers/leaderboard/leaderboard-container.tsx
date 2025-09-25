'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'
import LeaderboardTabs from '@/components/leaderboard/leaderboard-tabs'
import LeaderboardTable, {
  type LeaderboardEntry,
  type TierType,
} from '@/components/leaderboard/leaderboard-table'
import Pagination from '@/components/pagination'

const calculateTier = (score: number, contributions: number): TierType => {
  // Council tier (highest tier - special appointment/election)
  if (score >= 15000 && contributions >= 100) return 'Council'

  // Governor tier (high impact contributors)
  if (score >= 8000 && contributions >= 50) return 'Governor'

  // Champion tier (area reviewers/content leads)
  if (score >= 3000 && contributions >= 25) return 'Champion'

  // Builder tier (50+ points and 3+ contributions)
  if (score >= 50 && contributions >= 3) return 'Builder'

  // Explorer tier (first accepted contribution)
  return 'Explorer'
}

const generateMockData = (type: 'seasonal' | 'historical'): LeaderboardEntry[] => {
  const users = [
    'alice',
    'bob',
    'charlie',
    'diana',
    'eve',
    'frank',
    'grace',
    'henry',
    'iris',
    'jack',
    'kate',
    'liam',
    'maya',
    'noah',
    'olivia',
    'paul',
    'quinn',
    'ruby',
    'sam',
    'tina',
    'victor',
    'wendy',
    'xander',
    'yuki',
    'zoe',
  ]

  return users
    .map((username, index) => {
      const baseScore =
        type === 'historical' ? 5000 + Math.random() * 15000 : 1000 + Math.random() * 4000
      const multiplier = Math.max(0.1, 1 - index * 0.05)

      const score = Math.floor(baseScore * multiplier)
      const contributions = Math.floor((50 + Math.random() * 200) * multiplier)

      const entry: LeaderboardEntry = {
        rank: index + 1,
        username,
        score,
        contributions,
        repositories: Math.floor((3 + Math.random() * 12) * multiplier),
        avatarUrl: `https://github.com/${username}.png`,
      }

      // Only add tier for historical data
      if (type === 'historical') {
        entry.tier = calculateTier(score, contributions)
      }

      return entry
    })
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}

const TierSystemInfo = () => {
  return (
    <div className="mt-12 space-y-6">
      <div className="mb-8 text-center">
        <Typography variant="h2" className="mb-2 !text-2xl">
          Contributor Tier System
        </Typography>
        <Typography variant="body2">
          <em>Note: Tiers are only applicable to All-Time Rankings</em>
        </Typography>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Explorer */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              1) Explorer
            </Typography>
            <Typography variant="body2" className="italic">
              (onboarded contributor)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> first accepted contribution in <em>any</em> track.
            </div>
            <div>
              <strong>Privileges:</strong> profile on the leaderboard; access to contributor
              channels.
            </div>
            <div>
              <strong>Expectations:</strong> follow CoC, ship at least 1 contribution/month.
            </div>
          </div>
        </div>

        {/* Builder */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              2) Builder
            </Typography>
            <Typography variant="body2" className="italic">
              (consistent contributor)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> 50+ points and 3+ accepted contributions
            </div>
            <div>
              <strong>Privileges:</strong> Receive Logos SWAG, can co-host community calls, can
              mentor Explorers.
            </div>
            <div>
              <strong>Expectations:</strong> quality, responsiveness in reviews/issues.
            </div>
          </div>
        </div>

        {/* Champion */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              3) Champion
            </Typography>
            <Typography variant="body2" className="italic">
              (area reviewer / content or design lead)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> appointed by maintainers(CCs + Governors) after showing
              review maturity.
            </div>
            <div>
              <strong>Privileges:</strong> reviewer permissions (approve PRs/docs in scoped areas);
              run working groups.
            </div>
            <div>
              <strong>Expectations:</strong> active reviewing; uphold standards; guide roadmaps.
            </div>
          </div>
        </div>

        {/* Governor */}
        <div className="border-primary border p-6">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              4) Governor
            </Typography>
            <Typography variant="body2" className="italic">
              (approver/maintainer equivalent)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> nominated by Councils after sustained impact and
              reliability.
            </div>
            <div>
              <strong>Privileges:</strong> merge/approve in scope, start initiatives, snapshot
              proposals access.
            </div>
            <div>
              <strong>Expectations:</strong> governance participation, succession planning, incident
              stewardship.
            </div>
          </div>
        </div>

        {/* Council */}
        <div className="border-primary border p-6 md:col-span-2 lg:col-span-1">
          <div className="mb-4">
            <Typography variant="h3" className="!text-lg font-bold">
              5) Council
            </Typography>
            <Typography variant="body2" className="italic">
              (core decision-maker)
            </Typography>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <strong>How to earn:</strong> elected from the community, time-boxed term
            </div>
            <div>
              <strong>Privileges:</strong> final say on tier promotions, sets seasonal themes and
              weighting, convenes town halls.
            </div>
            <div>
              <strong>Expectations:</strong> transparency, publish quarterly contributor report
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
        <TierSystemInfo />
      </div>
    </div>
  )
}
