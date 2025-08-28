import { createDefaultMetadata } from '@/lib/metadata'
import { ROUTES } from '@/constants/routes'
import ContributorDetailsContainer from '@/containers/contributor/contributor-details-container'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Contributor Profile',
    description: 'Contributions in the Logos ecosystem',
    locale,
    path: ROUTES.contributors,
  })

  return metadata
}

export default function ContributorsPage() {
  return <ContributorDetailsContainer />
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
