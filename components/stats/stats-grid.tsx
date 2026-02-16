'use client'

import { useTranslations } from 'next-intl'
import StatCard from './stat-card'
import type { SocialProofData } from '@/types'

interface StatsGridProps {
  data: SocialProofData
  isLoading?: boolean
  error?: boolean
}

export default function StatsGrid({ data, isLoading, error }: StatsGridProps) {
  const t = useTranslations('home')

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value={data.totalContributionsCount}
        label={t('stats.totalContributions')}
        isLoading={isLoading}
        error={error}
      />
      <StatCard
        value={data.activeContributorsCount}
        label={t('stats.activeContributors')}
        isLoading={isLoading}
        error={error}
      />
      <StatCard
        value={data.totalRepositoriesCount}
        label={t('stats.repositories')}
        isLoading={isLoading}
        error={error}
        colSpan="sm:col-span-2 lg:col-span-1"
      />
      <StatCard
        value={data.activeCirclesCount}
        label={t('stats.activeCircles')}
        isLoading={isLoading}
        error={error}
        colSpan="sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
