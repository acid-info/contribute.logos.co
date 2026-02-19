import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { ROUTES } from '@/constants/routes'

export default function ProposalsPage() {
  redirect(ROUTES.home)
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
