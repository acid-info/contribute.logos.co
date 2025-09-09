import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import { routing } from '@/i18n/routing'
import IssuesContainer from '@/containers/issues/issues-container'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const metadata = await createDefaultMetadata({
    title: 'Issues - Logos Contribute',
    description: 'Open issues for contribute.logos.co',
    locale,
    path: ROUTES.issues,
  })
  return metadata
}

export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-5xl flex-col px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <IssuesContainer />
    </div>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
