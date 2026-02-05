import { ROUTES } from '@/constants/routes'
import RepositoryContainer from '@/containers/repository/repository-container'
import { createDefaultMetadata } from '@/lib/metadata'
import { routing } from '@/i18n/routing'
import { getContributeApiBase } from '@/lib/utils'

interface OrgsApiResponse {
  orgs: string[]
}

interface OrgProjectsApiResponse {
  organization: string
  count: number
  repositories: { full_name: string }[]
}

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

export async function generateStaticParams() {
  const base = getContributeApiBase()

  try {
    // Fetch all orgs
    const orgsRes = await fetch(`${base}/orgs`)
    if (!orgsRes.ok) {
      console.warn('Failed to fetch orgs for static params')
      return []
    }

    const orgsResponse = (await orgsRes.json()) as OrgsApiResponse
    if (!orgsResponse.orgs) {
      return []
    }

    const params: { locale: string; org: string; repo: string }[] = []

    // Fetch projects for each org
    for (const org of orgsResponse.orgs) {
      const projectsRes = await fetch(`${base}/projects/${org}`)
      if (!projectsRes.ok) {
        console.warn(`Failed to fetch projects for org "${org}"`)
        continue
      }

      const projectsResponse = (await projectsRes.json()) as OrgProjectsApiResponse
      if (!projectsResponse.repositories) {
        continue
      }

      // Generate params for each repo in each locale
      for (const repo of projectsResponse.repositories) {
        const [orgName, repoName] = repo.full_name.split('/')
        for (const locale of routing.locales) {
          params.push({ locale, org: orgName, repo: repoName })
        }
      }
    }

    return params
  } catch (error) {
    console.warn('Error generating static params:', error)
    return []
  }
}
