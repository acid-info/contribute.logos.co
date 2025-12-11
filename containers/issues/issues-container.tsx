'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useIssues } from '@/hooks/useIssues'
import Pagination from '@/components/pagination'
import IssuesHeader from '@/components/issues/issues-header'
import IssuesList from '@/components/issues/issues-list'
import IssuesLoading from '@/components/issues/issues-loading'
import IssuesError from '@/components/issues/issues-error'
import IssuesEmpty from '@/components/issues/issues-empty'

interface IssuesContainerProps {
  showPagination?: boolean
  itemsPerPage?: number
}

export default function IssuesContainer({
  showPagination = true,
  itemsPerPage = 10,
}: IssuesContainerProps) {
  const t = useTranslations('issues')
  const { data, isLoading, error } = useIssues()
  const [page, setPage] = useState(1)
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const issues = data?.issues || []

  // Filter issues by selected labels (must include all selected labels)
  const filteredIssues = useMemo(() => {
    if (selectedLabels.length === 0) return issues
    return issues.filter((issue) => {
      return selectedLabels.every((label) => issue.labels?.includes(label))
    })
  }, [issues, selectedLabels])

  const total = filteredIssues.length
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))

  const pagedIssues = useMemo(() => {
    if (!showPagination) {
      return filteredIssues.slice(0, itemsPerPage)
    }
    const start = (page - 1) * itemsPerPage
    return filteredIssues.slice(start, start + itemsPerPage)
  }, [filteredIssues, page, showPagination, itemsPerPage])

  // Toggle label selection
  const handleLabelToggle = (label: string) => {
    setSelectedLabels((prev) => {
      if (prev.includes(label)) {
        return prev.filter((l) => l !== label)
      } else {
        return [...prev, label]
      }
    })
    setPage(1)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedLabels([])
    setPage(1)
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-secondary text-center text-lg">{t('subtitle')}</p>
      </div>
      <div className="border-primary border">
        <IssuesHeader
          selectedLabels={selectedLabels}
          isDropdownOpen={isDropdownOpen}
          onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          onLabelToggle={handleLabelToggle}
          onClearFilters={handleClearFilters}
        />
        {isLoading ? (
          <IssuesLoading />
        ) : error ? (
          <IssuesError />
        ) : pagedIssues.length > 0 ? (
          <IssuesList issues={pagedIssues} />
        ) : (
          <IssuesEmpty selectedLabels={selectedLabels} />
        )}
        {showPagination && !isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            showingText={t('showing', {
              start: '{start}',
              end: '{end}',
              total: '{total}',
            })}
            previousText={t('previous')}
            nextText={t('next')}
          />
        )}
      </div>
    </>
  )
}
