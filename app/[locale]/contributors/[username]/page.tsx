import { createDefaultMetadata } from '@/lib/metadata'
import { ROUTES } from '@/constants/routes'
import ContributorDetailsContainer from '@/containers/contributor/contributor-details-container'

interface PageProps {
  params: Promise<{ locale: string; username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, username } = await params

  const metadata = await createDefaultMetadata({
    title: `${username} - Contributor Profile`,
    description: `${username} contributions in the Logos ecosystem`,
    locale,
    path: `${ROUTES.contributors}/${username}`,
  })

  return metadata
}

export default async function ContributorPage({ params }: PageProps) {
  const { username } = await params

  return <ContributorDetailsContainer username={username} />
}
