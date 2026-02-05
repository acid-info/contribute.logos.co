'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Typography, Badge } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { useContributors } from '@/hooks/useContributors'

export default function HomeContainer() {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: contributors = [], isLoading, error } = useContributors()

  const filteredContributors = contributors.filter(
    (contributor) =>
      contributor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contributor.latestRepo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredContributors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContributors = filteredContributors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-20 text-center sm:px-6 xl:px-0">
        <Typography variant="h1" className="mb-12 !text-3xl lg:!text-4xl">
          {t('title')}
        </Typography>
        <Typography variant="subtitle1" className="mb-6 text-base sm:text-lg">
          {t('subtitle')}
        </Typography>

        <div className="mx-auto mb-12 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={t('search.placeholder')}
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

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border-primary border p-4 sm:p-6">
            <Typography variant="h2" className="text-2xl sm:text-3xl">
              {isLoading || error ? (
                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              ) : (
                contributors.length
              )}
            </Typography>
            <Typography variant="body2" className="text-sm sm:text-base">
              {t('stats.activeContributors')}
            </Typography>
          </div>
          <div className="border-primary border p-4 sm:p-6">
            <Typography variant="h2" className="text-2xl sm:text-3xl">
              {isLoading || error ? (
                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              ) : (
                contributors.reduce((sum, c) => sum + c.contributions, 0)
              )}
            </Typography>
            <Typography variant="body2" className="text-sm sm:text-base">
              {t('stats.totalContributions')}
            </Typography>
          </div>
          <div className="border-primary border p-4 sm:col-span-2 sm:p-6 lg:col-span-1">
            <Typography variant="h2" className="text-2xl sm:text-3xl">
              {isLoading || error ? (
                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              ) : (
                new Set(contributors.map((c) => c.latestRepo)).size
              )}
            </Typography>
            <Typography variant="body2" className="text-sm sm:text-base">
              {t('stats.repositories')}
            </Typography>
          </div>
        </div>

        <div className="border-primary border">
          <div className="border-primary border-b px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Typography variant="h3" className="!text-lg sm:!text-xl">
                {t('contributors.title')}
              </Typography>
              <Badge size="small" className="!cursor-default !no-underline hover:!no-underline">
                {tc('contribute.timePeriod')}
              </Badge>
            </div>
          </div>
          <div className="divide-primary divide-y">
            {isLoading ? (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                  <Typography variant="body2" className="text-gray-600">
                    Loading contributors...
                  </Typography>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center p-8 sm:p-12">
                <div className="flex flex-col items-center space-y-4">
                  <Typography variant="body2" className="text-red-600">
                    Failed to load contributors. Please try again later.
                  </Typography>
                </div>
              </div>
            ) : currentContributors.length > 0 ? (
              currentContributors.map((contributor) => (
                <div key={contributor.id} className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <img
                      src={contributor.avatarUrl}
                      alt={`${contributor.username} avatar`}
                      className="h-10 w-10 rounded-full sm:h-12 sm:w-12"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
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
                      </div>
                      <div className="mt-1 text-xs sm:text-sm">
                        {t('contributors.latest')}: {contributor.latestRepo} •{' '}
                        {formatDate(contributor.latestContribution)}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <a href={contributor.profileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outlined" size="small" className="w-full sm:w-auto">
                          {t('contributors.viewGithubProfile')}
                        </Button>
                      </a>
                      <Link
                        href={`${ROUTES.contributors}?username=${encodeURIComponent(contributor.username)}`}
                      >
                        <Button size="small" className="w-full sm:w-auto">
                          {t('contributors.viewDetails')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Typography variant="body2" className="p-4 text-center sm:p-6">
                {t('contributors.noResults')}
              </Typography>
            )}
          </div>

          {!isLoading && !error && totalPages > 1 && (
            <div className="border-primary border-t px-4 py-4 sm:px-6">
              <div className="flex flex-col items-center gap-3 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <Typography variant="body2" className="text-center text-xs sm:text-left sm:text-sm">
                  {t('contributors.pagination.showing', {
                    start: startIndex + 1,
                    end: Math.min(endIndex, filteredContributors.length),
                    total: filteredContributors.length,
                  })}
                </Typography>
                <div className="flex w-full flex-col items-center space-y-3 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2">
                  <div className="flex items-center justify-center gap-2 sm:hidden">
                    <Button
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="!h-9 !px-3 !text-sm"
                    >
                      {t('contributors.pagination.previous')}
                    </Button>
                    <span className="px-3 py-2 text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outlined"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="!h-9 !px-3 !text-sm"
                    >
                      {t('contributors.pagination.next')}
                    </Button>
                  </div>

                  <div className="hidden sm:flex sm:flex-row sm:space-x-2">
                    <Button
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="!h-10"
                    >
                      {t('contributors.pagination.previous')}
                    </Button>
                    <div className="flex justify-center space-x-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1
                        const isCurrentPage = page === currentPage
                        const isNearCurrent = Math.abs(page - currentPage) <= 2
                        const isFirstOrLast = page === 1 || page === totalPages

                        if (isFirstOrLast || isNearCurrent) {
                          return (
                            <Button
                              key={page}
                              variant={isCurrentPage ? 'filled' : 'outlined'}
                              onClick={() => handlePageChange(page)}
                              className="!h-10 !w-10 !p-0"
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === currentPage - 3 || page === currentPage + 3) {
                          return (
                            <span key={page} className="px-2 py-2">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>
                    <Button
                      variant="outlined"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="!h-10"
                    >
                      {t('contributors.pagination.next')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-primary mt-8 flex flex-col gap-4 border p-4 text-center sm:mt-12 sm:p-8">
          <Typography variant="h3" className="mb-4 text-lg sm:text-xl">
            {t('cta.title')}
          </Typography>
          <Typography variant="body1" className="mb-6 text-sm sm:text-base">
            {t('cta.description')}
          </Typography>
          <div className="flex justify-center">
            <Link href={ROUTES.resources}>
              <Button variant="outlined" size="small" className="w-full sm:w-auto">
                {t('cta.viewGuidelines')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
