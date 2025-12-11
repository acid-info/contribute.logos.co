'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'

interface IssuesEmptyProps {
  selectedLabels: string[]
}

export default function IssuesEmpty({ selectedLabels }: IssuesEmptyProps) {
  const t = useTranslations('issues')

  return (
    <div className="flex justify-center p-8 sm:p-12">
      <Typography variant="body2" className="text-gray-600">
        {selectedLabels.length > 0
          ? t('emptyFilteredMultiple', { labels: selectedLabels.join(', ') })
          : t('empty')}
      </Typography>
    </div>
  )
}
