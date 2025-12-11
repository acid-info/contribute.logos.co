'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'

export default function IssuesError() {
  const t = useTranslations('issues')

  return (
    <div className="flex justify-center p-8 sm:p-12">
      <div className="flex flex-col items-center space-y-4">
        <Typography variant="body2" className="text-red-600">
          {t('error')}
        </Typography>
      </div>
    </div>
  )
}
