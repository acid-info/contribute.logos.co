'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography, Badge } from '@acid-info/lsd-react'
import { IssueItem as IssueItemType } from '@/hooks/useIssues'

interface IssueItemProps {
  issue: IssueItemType
}

export default function IssueItem({ issue }: IssueItemProps) {
  const t = useTranslations('issues')

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="p-4 sm:p-6">
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
  )
}
