'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Contributor } from '@/types'
import Pagination from '@/components/pagination'
import ContributorsHeader from './contributors-header'
import ContributorsList from './contributors-list'
import ContributorsTable from './contributors-table'

interface ContributorsSectionProps {
  contributors: Contributor[]
  isLoading: boolean
  error: boolean
  showTier?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  showPagination?: boolean
  variant?: 'list' | 'table'
  showHeader?: boolean
}

export default function ContributorDirectory({
  contributors,
  isLoading,
  error,
  currentPage = 1,
  totalPages: externalTotalPages,
  totalItems: externalTotalItems,
  itemsPerPage = 10,
  onPageChange,
  showTier = false,
  showPagination = true,
  variant = 'list',
  showHeader = variant === 'list',
}: ContributorsSectionProps) {
  const t = useTranslations('home')
  const tl = useTranslations('leaderboard')

  const totalItems = externalTotalItems ?? contributors.length
  const totalPages = externalTotalPages ?? Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const rankOffset = showPagination ? (currentPage - 1) * itemsPerPage : 0

  const displayedContributors = useMemo(() => {
    if (!showPagination) {
      return contributors.slice(0, itemsPerPage)
    }
    const start = (currentPage - 1) * itemsPerPage
    return contributors.slice(start, start + itemsPerPage)
  }, [contributors, currentPage, showPagination, itemsPerPage])

  return (
    <div className="border-primary border">
      {showHeader && <ContributorsHeader />}
      {variant === 'table' ? (
        <ContributorsTable
          contributors={displayedContributors}
          isLoading={isLoading}
          error={error}
          rankOffset={rankOffset}
        />
      ) : (
        <div className="divide-primary divide-y">
          <ContributorsList
            contributors={displayedContributors}
            isLoading={isLoading}
            error={error}
            showTier={showTier}
          />
        </div>
      )}
      {showPagination && !isLoading && !error && totalPages > 1 && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          showingText={
            variant === 'table'
              ? tl('pagination.showing', {
                  start: '{start}',
                  end: '{end}',
                  total: '{total}',
                })
              : t('contributors.pagination.showing', {
                  start: '{start}',
                  end: '{end}',
                  total: '{total}',
                })
          }
          previousText={
            variant === 'table' ? tl('pagination.previous') : t('contributors.pagination.previous')
          }
          nextText={variant === 'table' ? tl('pagination.next') : t('contributors.pagination.next')}
        />
      )}
    </div>
  )
}
