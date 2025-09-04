import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContributeApiBase() {
  return 'https://dev-admin-acid.logos.co/api'
}
