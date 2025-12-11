'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'

export default function ContributorsEmpty() {
  const t = useTranslations('home')

  return (
    <div className="p-4 text-center sm:p-6">
      <Typography variant="body2">{t('contributors.noResults')}</Typography>
    </div>
  )
}
