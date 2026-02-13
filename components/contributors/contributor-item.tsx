'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { Contributor } from '@/types'

interface ContributorItemProps {
  contributor: Contributor
  showTier?: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ContributorItem({ contributor, showTier = false }: ContributorItemProps) {
  const t = useTranslations('home')
  const tl = useTranslations('leaderboard')

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <img
          src={contributor.avatarUrl}
          alt={`${contributor.username} avatar`}
          className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
            <a
              href={contributor.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium hover:underline sm:text-lg"
            >
              {contributor.username}
            </a>
            <span className="inline-flex items-center text-xs font-medium">
              {contributor.contributions} {t('contributors.contributions')}
            </span>
            {showTier && (
              <span className="border-primary inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium">
                {tl('table.tier')}: {contributor.tier || '-'}
              </span>
            )}
          </div>
          {formatDate(contributor.latestContribution) && (
            <div className="mt-1 text-xs sm:text-sm">
              {t('contributors.latest')}:{' '}
              {[contributor.latestRepo, formatDate(contributor.latestContribution)]
                .filter(Boolean)
                .join(' • ')}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <a href={contributor.profileUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outlined" size="small">
              {t('contributors.viewGithubProfile')}
            </Button>
          </a>
          <Link
            href={`${ROUTES.contributors}?username=${encodeURIComponent(contributor.username)}`}
          >
            <Button size="small">{t('contributors.viewDetails')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
