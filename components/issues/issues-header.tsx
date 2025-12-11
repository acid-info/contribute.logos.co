'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'
import LabelFilterDropdown from './label-filter-dropdown'

interface IssuesHeaderProps {
  selectedLabels: string[]
  isDropdownOpen: boolean
  onDropdownToggle: () => void
  onLabelToggle: (label: string) => void
  onClearFilters: () => void
}

export default function IssuesHeader({
  selectedLabels,
  isDropdownOpen,
  onDropdownToggle,
  onLabelToggle,
  onClearFilters,
}: IssuesHeaderProps) {
  const t = useTranslations('issues')

  return (
    <div className="border-primary flex items-center justify-between border-b px-4 py-4 sm:px-6">
      <Typography variant="h3" className="!text-lg sm:!text-xl">
        {t('title')}
      </Typography>
      <LabelFilterDropdown
        selectedLabels={selectedLabels}
        isOpen={isDropdownOpen}
        onToggle={onDropdownToggle}
        onLabelToggle={onLabelToggle}
        onClearFilters={onClearFilters}
      />
    </div>
  )
}
