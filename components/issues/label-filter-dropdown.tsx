'use client'

import { useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { AVAILABLE_LABELS } from './constants'

interface LabelFilterDropdownProps {
  selectedLabels: string[]
  isOpen: boolean
  onToggle: () => void
  onLabelToggle: (label: string) => void
  onClearFilters: () => void
}

export default function LabelFilterDropdown({
  selectedLabels,
  isOpen,
  onToggle,
  onLabelToggle,
  onClearFilters,
}: LabelFilterDropdownProps) {
  const t = useTranslations('issues')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="border-primary flex items-center gap-2 border px-3 py-1.5 text-sm transition-colors"
      >
        <span>
          {selectedLabels.length === 0
            ? t('filterLabels')
            : selectedLabels.length === 1
              ? selectedLabels[0]
              : t('filterLabelsSelected', { count: selectedLabels.length })}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={clsx('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06 0L10 10.44l3.71-3.23a.75.75 0 111.06 1.06l-4 3.5a.75.75 0 01-1.06 0l-4-3.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="border-primary bg-primary absolute top-full right-0 z-50 mt-1 min-w-[200px] border shadow-lg">
          {selectedLabels.length > 0 && (
            <div className="border-primary border-b">
              <button onClick={onClearFilters} className="w-full px-3 py-2 text-left text-sm">
                {t('clearFilters')}
              </button>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {AVAILABLE_LABELS.map((label) => {
              const isSelected = selectedLabels.includes(label)
              return (
                <label
                  key={label}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onLabelToggle(label)}
                    className="border-primary h-4 w-4 cursor-pointer border"
                  />
                  <span>{label}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
