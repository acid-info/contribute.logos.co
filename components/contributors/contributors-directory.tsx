'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Contributor } from '@/types'
import Pagination from '@/components/pagination'
import ContributorsHeader from './contributors-header'
import ContributorsList from './contributors-list'

interface ContributorsSectionProps {
  contributors: Contributor[]
  isLoading: boolean
  error: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  showPagination?: boolean
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
  showPagination = true,
}: ContributorsSectionProps) {
  const t = useTranslations('home')

  const totalItems = externalTotalItems ?? contributors.length
  const totalPages = externalTotalPages ?? Math.max(1, Math.ceil(totalItems / itemsPerPage))

  const displayedContributors = useMemo(() => {
    if (!showPagination) {
      return contributors.slice(0, itemsPerPage)
    }
    const start = (currentPage - 1) * itemsPerPage
    return contributors.slice(start, start + itemsPerPage)
  }, [contributors, currentPage, showPagination, itemsPerPage])

  return (
    <div className="border-primary border">
      <ContributorsHeader />
      <div className="divide-primary divide-y">
        <ContributorsList
          contributors={displayedContributors}
          isLoading={isLoading}
          error={error}
        />
      </div>
      {showPagination && !isLoading && !error && totalPages > 1 && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          showingText={t('contributors.pagination.showing', {
            start: '{start}',
            end: '{end}',
            total: '{total}',
          })}
          previousText={t('contributors.pagination.previous')}
          nextText={t('contributors.pagination.next')}
        />
      )}
    </div>
  )
}
