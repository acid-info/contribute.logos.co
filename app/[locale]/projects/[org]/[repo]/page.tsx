import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import RepositoryContainer from '@/containers/repository/repository-container'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; org: string; repo: string }>
}) {
  const { locale, org, repo } = await params

  const metadata = await createDefaultMetadata({
    title: `${org}/${repo} - Repository Details`,
    description: `View details and pull requests for ${org}/${repo} repository`,
    locale,
    path: `${ROUTES.projects}/${org}/${repo}`,
  })

  return metadata
}

export default function Page() {
  return <RepositoryContainer />
}
