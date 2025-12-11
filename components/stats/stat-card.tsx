'use client'

import { Typography } from '@acid-info/lsd-react'
import { formatNumber } from '@/lib/utils'

interface StatCardProps {
  value: number | null
  label: string
  isLoading?: boolean
  error?: boolean
  colSpan?: string
}

export default function StatCard({ value, label, isLoading, error, colSpan }: StatCardProps) {
  return (
    <div className={`border-primary border p-4 sm:p-6 ${colSpan || ''}`}>
      <Typography variant="h2" className="text-2xl sm:text-3xl">
        {isLoading || error ? (
          <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
        ) : (
          formatNumber(value ?? 0)
        )}
      </Typography>
      <Typography variant="body2" className="text-sm sm:text-base">
        {label}
      </Typography>
    </div>
  )
}
