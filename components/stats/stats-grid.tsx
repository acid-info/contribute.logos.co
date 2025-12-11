'use client'

import { useTranslations } from 'next-intl'
import StatCard from './stat-card'

interface Contributor {
  contributions: number
  latestRepo: string
}

interface StatsGridProps {
  contributors: Contributor[]
  isLoading?: boolean
  error?: boolean
}

export default function StatsGrid({ contributors, isLoading, error }: StatsGridProps) {
  const t = useTranslations('home')

  const activeContributors = contributors.length
  const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0)
  const repositories = new Set(contributors.map((c) => c.latestRepo)).size

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        value={activeContributors}
        label={t('stats.activeContributors')}
        isLoading={isLoading}
        error={error}
      />
      <StatCard
        value={totalContributions}
        label={t('stats.totalContributions')}
        isLoading={isLoading}
        error={error}
      />
      <StatCard
        value={repositories}
        label={t('stats.repositories')}
        isLoading={isLoading}
        error={error}
        colSpan="sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
