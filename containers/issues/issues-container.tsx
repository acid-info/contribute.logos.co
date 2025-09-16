'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Button, Typography, Badge } from '@acid-info/lsd-react'
import { useIssues } from '@/hooks/useIssues'
import Pagination from '@/components/pagination'

export default function IssuesContainer() {
  const t = useTranslations('issues')
  const { data, isLoading, error } = useIssues()
  const [page, setPage] = useState(1)
  const perPage = 10

  const issues = data?.issues || []
  const total = data?.count || 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const pagedIssues = useMemo(() => {
    const start = (page - 1) * perPage
    return issues.slice(start, start + perPage)
  }, [issues, page])

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-secondary text-base">{t('subtitle')}</p>
      </div>
      <div className="border-primary border">
        <div className="border-primary border-b px-4 py-4 sm:px-6">
          <Typography variant="h3" className="!text-lg sm:!text-xl">
            {t('title')}
          </Typography>
        </div>
        <div className="divide-primary divide-y">
          {isLoading ? (
            <div className="flex justify-center p-8 sm:p-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                <Typography variant="body2" className="text-gray-600">
                  {t('loading')}
                </Typography>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center p-8 sm:p-12">
              <div className="flex flex-col items-center space-y-4">
                <Typography variant="body2" className="text-red-600">
                  {t('error')}
                </Typography>
              </div>
            </div>
          ) : pagedIssues.length > 0 ? (
            pagedIssues.map((issue) => (
              <div key={issue.id} className="p-4 sm:p-6">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
                  <div className="min-w-0 flex-1">
                    <button
                      className="cursor-pointer text-left hover:underline"
                      onClick={() => openInNewTab(issue.url)}
                      aria-label="Open issue on GitHub"
                    >
                      <Typography variant="body1" className="font-medium">
                        #{issue.number} {issue.title}
                      </Typography>
                    </button>
                    <div className="text-secondary mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span>{t('by', { author: issue.author })}</span>
                      <span>•</span>
                      <span>{t('comments', { count: issue.comments })}</span>
                      <span>•</span>
                      <span>
                        {t('updated', {
                          date: new Date(issue.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }),
                        })}
                      </span>
                      {issue.labels?.length ? (
                        <span className="ml-2 flex flex-wrap gap-1">
                          {issue.labels.map((label) => (
                            <Badge key={label} size="small">
                              {label}
                            </Badge>
                          ))}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button onClick={() => openInNewTab(issue.url)} variant="outlined" size="small">
                      {t('view')}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center p-8 sm:p-12">
              <Typography variant="body2" className="text-gray-600">
                {t('empty')}
              </Typography>
            </div>
          )}
        </div>
        {!isLoading && !error && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={perPage}
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
