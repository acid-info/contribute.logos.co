'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Typography } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { Contributor, MOCK_CONTRIBUTORS } from '@/constants/mockData'
import { ROUTES } from '@/constants/routes'

export default function HomeContainer() {
  const t = useTranslations('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setContributors(MOCK_CONTRIBUTORS)
  }, [])

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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Typography variant="h1" className="mb-4">
            {t('title')}
          </Typography>
          <Typography variant="body1" className="mb-8">
            {t('subtitle')}
          </Typography>
        </div>

        <div className="mb-8">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-primary w-full border px-4 py-3 pl-10"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
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
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border-primary border p-6">
            <Typography variant="h2">{contributors.length}</Typography>
            <Typography variant="body2">{t('stats.activeContributors')}</Typography>
          </div>
          <div className="border-primary border p-6">
            <Typography variant="h2">
              {contributors.reduce((sum, c) => sum + c.contributions, 0)}
            </Typography>
            <Typography variant="body2">{t('stats.totalContributions')}</Typography>
          </div>
          <div className="border-primary border p-6">
            <Typography variant="h2">
              {new Set(contributors.map((c) => c.latestRepo)).size}
            </Typography>
            <Typography variant="body2">{t('stats.repositories')}</Typography>
          </div>
        </div>

        <div className="border-primary border">
          <div className="border-primary border-b px-6 py-4">
            <Typography variant="h3">{t('contributors.title')}</Typography>
          </div>
          <div className="divide-primary divide-y">
            {currentContributors.length > 0 ? (
              currentContributors.map((contributor) => (
                <div key={contributor.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={contributor.avatarUrl}
                      alt={`${contributor.username} avatar`}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <a
                          href={contributor.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium hover:underline"
                        >
                          {contributor.username}
                        </a>
                        <span className="border-primary inline-flex items-center border px-2.5 py-0.5 text-xs font-medium">
                          {contributor.contributions} {t('contributors.contributions')}
                        </span>
                      </div>
                      <div className="mt-1 text-sm">
                        {t('contributors.latest')}: {contributor.latestRepo} •{' '}
                        {formatDate(contributor.latestContribution)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a href={contributor.profileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outlined">{t('contributors.viewGithubProfile')}</Button>
                      </a>
                      <Link href={`${ROUTES.contributors}/${contributor.username}`}>
                        <Button>{t('contributors.viewDetails')}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <Typography variant="body2">{t('contributors.noResults')}</Typography>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="border-primary border-t px-6 py-4">
              <div className="flex items-center justify-between">
                <Typography variant="body2">
                  {t('contributors.pagination.showing', {
                    start: startIndex + 1,
                    end: Math.min(endIndex, filteredContributors.length),
                    total: filteredContributors.length,
                  })}
                </Typography>
                <div className="flex space-x-2">
                  <Button
                    variant="outlined"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    {t('contributors.pagination.previous')}
                  </Button>
                  <div className="flex space-x-1">
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
                            className="h-10 w-10"
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
                  >
                    {t('contributors.pagination.next')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="border-primary flex flex-col gap-4 border p-8">
            <Typography variant="h3" className="mb-4">
              {t('cta.title')}
            </Typography>
            <Typography variant="body1" className="mb-6">
              {t('cta.description')}
            </Typography>
            <div className="flex justify-center space-x-4">
              <Link href={ROUTES.resources}>
                <Button variant="outlined">{t('cta.viewGuidelines')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
