'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'

export default function ContributorsHeader() {
  const t = useTranslations('home')

  return (
    <div className="border-primary border-b px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Typography variant="h3" className="!text-lg sm:!text-xl">
          {t('contributors.title')}
        </Typography>
      </div>
    </div>
  )
}
