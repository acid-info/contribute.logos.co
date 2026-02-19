import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default function ProposalsPage() {
  redirect('https://forum.logos.co/c/proposals/9')
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
