'use client'

import { Button } from '@acid-info/lsd-react'

interface LeaderboardTabsProps {
  activeTab: 'seasonal' | 'historical'
  onTabChange: (tab: 'seasonal' | 'historical') => void
  seasonalLabel: string
  historicalLabel: string
}

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
  seasonalLabel,
  historicalLabel,
}: LeaderboardTabsProps) {
  return (
    <div className="border-primary flex space-x-1 border p-1">
      <Button
        variant={activeTab === 'historical' ? 'filled' : 'outlined'}
        onClick={() => onTabChange('historical')}
        className="flex-1 !border-0"
      >
        {historicalLabel}
      </Button>
      <Button
        variant={activeTab === 'seasonal' ? 'filled' : 'outlined'}
        onClick={() => onTabChange('seasonal')}
        className="flex-1 !border-0"
      >
        {seasonalLabel}
      </Button>
    </div>
  )
}
