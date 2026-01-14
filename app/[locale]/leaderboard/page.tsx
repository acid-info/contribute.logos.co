import DirectoryContainer from '@/containers/directory/directory-container'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { createDefaultMetadata } from '@/lib/metadata'
import { ROUTES } from '@/constants/routes'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const metadata = await createDefaultMetadata({
    title: 'Leaderboard',
    description: 'View top contributors in our community leaderboard',
    locale,
    path: ROUTES.leaderboard,
  })
  return metadata
}

export default function LeaderboardPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-7xl flex-col px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <DirectoryContainer />
    </div>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
