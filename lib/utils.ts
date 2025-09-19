import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContributeApiBase() {
  return 'https://dev-admin-acid.logos.co/api'
}

export function formatNumber(num: number | undefined | null): string {
  if (num == null) return '0'
  return num.toLocaleString()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
