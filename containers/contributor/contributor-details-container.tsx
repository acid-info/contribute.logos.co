'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useContributorDetails } from '@/hooks/useContributorDetails'
import { formatNumber } from '@/lib/utils'
import ContributionHistorySection from '@/components/contributor/contribution-history-section'

export default function ContributorDetailsContainer() {
  const t = useTranslations('contributor')
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''
  const [historyPage, setHistoryPage] = useState(1)
  const historyItemsPerPage = 20

  const {
    data,
    isLoading: loading,
    error,
  } = useContributorDetails(username, historyPage, historyItemsPerPage)

  useEffect(() => {
    setHistoryPage(1)
  }, [username])

  const items = data?.items || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 1

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const avatarUrl = useMemo(
    () => (username ? `https://github.com/${username}.png` : ''),
    [username]
  )
  const profileUrl = useMemo(() => (username ? `https://github.com/${username}` : '#'), [username])
  const latest = data?.latest || items[0]

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 xl:px-0">
        <div className="mb-8">
          <Link href={ROUTES.leaderboard}>
            <Button variant="outlined">{t('backToContributors')}</Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="lg:col-span-2">
            <div className="border-primary border p-4 sm:p-8">
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
            <div className="p-6 border border-primary">
              <Typography variant="h3" className="mb-4">
                Quick Stats
              </Typography>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography variant="body2">Total Contributions</Typography>
                  <Typography variant="body2" className="font-medium">
                    {loading || error ? (
                      <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-gray-900"></div>
                    ) : (
                      total
                    )}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Latest Repository</Typography>
                  <Typography variant="body2" className="font-medium">
                    {loading || error ? (
                      <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-gray-900"></div>
                    ) : (
                      latest?.repo || '-'
                    )}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Last Contribution</Typography>
                  <Typography variant="body2" className="font-medium">
                    {loading || error ? (
                      <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-gray-900"></div>
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

        <ContributionHistorySection
          items={items}
          isLoading={loading}
          error={!!error}
          errorMessage={error instanceof Error ? error.message : undefined}
          currentPage={historyPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={historyItemsPerPage}
          onPageChange={setHistoryPage}
        />
      </div>
    </div>
  )
}
