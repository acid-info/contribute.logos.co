'use client'

import { Button, Typography } from '@acid-info/lsd-react'
import { useTranslations } from 'next-intl'
import Pagination from '@/components/pagination'
import type { ApiItem, ApiItemType } from '@/hooks/useContributorDetails'

interface ContributionHistorySectionProps {
  items: ApiItem[]
  isLoading: boolean
  error: boolean
  errorMessage?: string
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', {
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

export default function ContributionHistorySection({
  items,
  isLoading,
  error,
  errorMessage,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: ContributionHistorySectionProps) {
  const t = useTranslations('contributor')
  const tp = useTranslations('leaderboard')

  return (
    <div className="border-primary border">
      <div className="border-primary border-b px-4 py-2 sm:px-8 sm:py-6">
        <div className="flex items-center gap-3">
          <h2 className="!text-lg sm:!text-2xl">{t('contributionHistory')}</h2>
        </div>
      </div>
      <div className="divide-primary divide-y">
        {isLoading && (
          <div className="flex justify-center p-8 sm:p-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
              <Typography variant="body2" className="text-gray-600">
                Loading contributions...
              </Typography>
            </div>
          </div>
        )}
        {!isLoading && error && (
          <div className="flex justify-center p-8 sm:p-12">
            <div className="flex flex-col items-center space-y-4">
              <Typography variant="body2" className="text-red-600">
                {errorMessage || 'Failed to load contributions'}
              </Typography>
            </div>
          </div>
        )}
        {!isLoading && !error && items.length === 0 && (
          <div className="p-8">
            <Typography variant="body2">No contributions in the last year.</Typography>
          </div>
        )}
        {!isLoading &&
          !error &&
          items.map((item, idx) => (
            <div key={`${item.link || item.repo || item.date}-${idx}`} className="p-4 sm:p-8">
              <div className="flex items-start space-x-4">
                <div className="border-primary flex items-center justify-center border p-2 sm:px-4">
                  <Typography variant="body2" className="font-medium">
                    {getContributionLabel(item.type)}
                  </Typography>
                </div>
                <div className="flex-1">
                  <Typography variant="body1" className="mb-2 font-medium">
                    {item.repo || '-'}
                  </Typography>
                  <div className="flex flex-wrap items-center gap-4">
                    <Typography variant="body2" className="text-gray-600">
                      {item.repo || '-'}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {formatDate(item.date)}
                    </Typography>
                  </div>
                </div>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outlined" size="small">
                      {t('view')}
                    </Button>
                  </a>
                ) : (
                  <Button variant="outlined" size="small" disabled>
                    {t('view')}
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          showingText={tp('pagination.showing', {
            start: '{start}',
            end: '{end}',
            total: '{total}',
          })}
          previousText={tp('pagination.previous')}
          nextText={tp('pagination.next')}
        />
      )}
    </div>
  )
}
