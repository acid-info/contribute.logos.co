import { createDefaultMetadata } from '@/utils/metadata'
import { ROUTES } from '@/constants/routes'
import { MOCK_CONTRIBUTORS } from '@/constants/mockData'
import { notFound } from 'next/navigation'
import ContributorDetailsContainer from '@/containers/contributor/contributor-details-container'

interface PageProps {
  params: Promise<{ locale: string; username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, username } = await params

  const contributor = MOCK_CONTRIBUTORS.find((c) => c.username === username)
  if (!contributor) {
    return createDefaultMetadata({
      title: 'Contributor Not Found',
      description: 'The requested contributor could not be found',
      locale,
      path: `/contributors/${username}`,
    })
  }

  const metadata = await createDefaultMetadata({
    title: `${contributor.username} - Contributor Profile`,
    description: `${contributor.username} has made ${contributor.contributions} contributions to the Logos ecosystem`,
    locale,
    path: `/contributors/${username}`,
  })

  return metadata
}

export default async function ContributorPage({ params }: PageProps) {
  const { username } = await params

  const contributor = MOCK_CONTRIBUTORS.find((c) => c.username === username)

  if (!contributor) {
    notFound()
  }

  return <ContributorDetailsContainer contributor={contributor} />
}
