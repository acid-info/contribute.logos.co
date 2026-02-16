'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { formatNumber } from '@/lib/utils'
import { Contributor } from '@/types'
import ContributorsLoading from './contributors-loading'
import ContributorsError from './contributors-error'
import ContributorsEmpty from './contributors-empty'

interface ContributorsTableProps {
  contributors: Contributor[]
  isLoading: boolean
  error: boolean
  rankOffset?: number
}

export default function ContributorsTable({
  contributors,
  isLoading,
  error,
  rankOffset = 0,
}: ContributorsTableProps) {
  const t = useTranslations('leaderboard')

  if (isLoading) {
    return <ContributorsLoading />
  }

  if (error) {
    return <ContributorsError />
  }

  if (contributors.length === 0) {
    return <ContributorsEmpty />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] table-fixed">
        <thead className="border-primary border-b text-left">
          <tr>
            <th className="px-6 py-4 font-medium">{t('table.rank')}</th>
            <th className="px-6 py-4 font-medium">{t('table.contributor')}</th>
            <th className="px-6 py-4 font-medium">{t('table.point')}</th>
            <th className="px-6 py-4 font-medium">{t('table.contributions')}</th>
            <th className="px-6 py-4 font-medium">{t('table.repositories')}</th>
          </tr>
        </thead>
        <tbody className="divide-primary divide-y">
          {contributors.map((contributor, index) => {
            const rank =
              contributor.rank && contributor.rank > 0 ? contributor.rank : rankOffset + index + 1
            const repositories =
              typeof contributor.repositories === 'number'
                ? formatNumber(contributor.repositories)
                : '-'
            const points = contributor.points ?? 0

            return (
              <tr key={`${contributor.id}-${contributor.username}`}>
                <td className="px-6 py-5">{formatNumber(rank)}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={contributor.avatarUrl}
                      alt={`${contributor.username} avatar`}
                      className="h-12 w-12 rounded-full"
                    />
                    <Link
                      href={`${ROUTES.contributors}?username=${encodeURIComponent(contributor.username)}`}
                      className="truncate text-lg hover:underline"
                    >
                      {contributor.username}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="border-primary inline-flex min-w-[4.5rem] justify-center rounded-full border px-3 py-1">
                    {formatNumber(points)}
                  </span>
                </td>
                <td className="px-6 py-5">{formatNumber(contributor.contributions)}</td>
                <td className="px-6 py-5">{repositories}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
