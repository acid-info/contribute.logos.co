'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography, Badge } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useContributorDetails, type ApiItemType } from '@/hooks/useContributorDetails'
import { formatNumber } from '@/lib/utils'

export default function ContributorDetailsContainer() {
  const t = useTranslations('contributor')
  const tc = useTranslations('common')
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''

  const { data, isLoading: loading, error } = useContributorDetails(username)

  const items = data?.items || []
  const total = data?.total || 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getContributionLabel = (type: ApiItemType) =>
    type === 'COMMIT'
      ? 'Commit'
      : type === 'PR'
        ? 'Pull Request'
        : type === 'REVIEW'
          ? 'Review'
          : 'Contribution'

  const avatarUrl = useMemo(
    () => (username ? `https://github.com/${username}.png` : ''),
    [username]
  )
  const profileUrl = useMemo(() => (username ? `https://github.com/${username}` : '#'), [username])
  const latest = items[0]

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 xl:px-0">
        <div className="mb-8">
          <Link href={ROUTES.home}>
            <Button variant="outlined">{t('backToContributors')}</Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border-primary border p-8">
              <div className="mb-6 flex items-center space-x-6">
                <img
                  src={avatarUrl}
                  alt={`${username} avatar`}
                  className="h-24 w-24 rounded-full"
                />
                <div>
                  <Typography variant="h1" className="mb-2">
                    {username || '-'}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600">
                    {loading || error ? (
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-gray-900"></div>
                    ) : (
                      `${total} ${t('contributionsToEcosystem')}`
                    )}
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="border-primary border p-6 text-center">
                  <Typography component="h3" variant="h6" className="pb-2 !font-semibold">
                    {t('totalContributions')}
                  </Typography>
                  <Typography variant="body2">
                    {loading || error ? (
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                    ) : (
                      formatNumber(total)
                    )}
                  </Typography>
                </div>
                <div className="border-primary border p-6 text-center">
                  <Typography component="h3" variant="h6" className="pb-2 !font-semibold">
                    {t('latestRepository')}
                  </Typography>
                  <Typography variant="body2">
                    {loading || error ? (
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                    ) : (
                      latest?.repo || '-'
                    )}
                  </Typography>
                </div>
                <div className="border-primary border p-6 text-center">
                  <Typography component="h3" variant="h6" className="pb-2 !font-semibold">
                    {t('latestContribution')}
                  </Typography>
                  <Typography variant="body2">
                    {loading || error ? (
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                    ) : latest ? (
                      formatDate(latest.date)
                    ) : (
                      '-'
                    )}
                  </Typography>
                </div>
              </div>

              <div className="mt-8">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outlined">{t('viewGithubProfile')}</Button>
                </a>
              </div>
            </div>
          </div>

          {/* <div className="lg:col-span-1">
            <div className="border-primary border p-6">
              <Typography variant="h3" className="mb-4">
                Quick Stats
              </Typography>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography variant="body2">Total Contributions</Typography>
                  <Typography variant="body2" className="font-medium">
                    {loading || error ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-gray-900"></div>
                    ) : (
                      total
                    )}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Latest Repository</Typography>
                  <Typography variant="body2" className="font-medium">
                    {loading || error ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-gray-900"></div>
                    ) : (
                      latest?.repo || '-'
                    )}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Last Contribution</Typography>
                  <Typography variant="body2" className="font-medium">
                    {loading || error ? (
                      <div className="h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-gray-900"></div>
                    ) : latest ? (
                      formatDate(latest.date)
                    ) : (
                      '-'
                    )}
                  </Typography>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="border-primary border">
          <div className="border-primary border-b px-8 py-6">
            <div className="flex items-center gap-3">
              <Typography variant="h2">{t('contributionHistory')}</Typography>
              <Badge className="!cursor-default !no-underline hover:!no-underline">
                {tc('contribute.timePeriod')}
              </Badge>
            </div>
          </div>
          <div className="divide-primary divide-y">
            {loading && (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                  <Typography variant="body2" className="text-gray-600">
                    Loading contributions...
                  </Typography>
                </div>
              </div>
            )}
            {!loading && error && (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <Typography variant="body2" className="text-red-600">
                    {error instanceof Error ? error.message : 'Failed to load contributions'}
                  </Typography>
                </div>
              </div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="p-8">
                <Typography variant="body2">No contributions in the last year.</Typography>
              </div>
            )}
            {!loading &&
              !error &&
              items.map((it) => (
                <div key={it.link} className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="border-primary flex h-12 items-center justify-center border px-4">
                      <Typography variant="body2" className="font-medium">
                        {getContributionLabel(it.type)}
                      </Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="body1" className="mb-2 font-medium">
                        {it.repo}
                      </Typography>
                      <div className="flex flex-wrap items-center gap-4">
                        <Typography variant="body2" className="text-gray-600">
                          {it.repo}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(it.date)}
                        </Typography>
                      </div>
                    </div>
                    <a href={it.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outlined" size="small">
                        {t('view')}
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
