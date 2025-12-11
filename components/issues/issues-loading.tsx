'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'

export default function IssuesLoading() {
  const t = useTranslations('issues')

  return (
    <div className="flex justify-center p-8 sm:p-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
        <Typography variant="body2" className="text-gray-600">
          {t('loading')}
        </Typography>
      </div>
    </div>
  )
}
