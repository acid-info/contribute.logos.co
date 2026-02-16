import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayISODateDaysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

export function getContributeApiBase() {
  return process.env.NEXT_PUBLIC_API_MODE === 'development'
    ? 'http://localhost:3000/api'
    : process.env.NEXT_PUBLIC_API_MODE === 'staging'
      ? 'https://dev-admin-acid.logos.co/api'
      : 'https://admin-acid.logos.co/api'

  // Temporary base url for testing. Need to remove this and uncomment above later.
  // return 'https://logos-admin-git-leaderboard-backend-acidinfo.vercel.app/api'
}

export function formatNumber(num: number | undefined | null): string {
  if (num == null) return '0'
  return num.toLocaleString()
}
