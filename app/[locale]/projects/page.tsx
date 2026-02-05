import { ROUTES } from '@/constants/routes'
import ProjectsContainer from '@/containers/projects/projects-container'
import { createDefaultMetadata } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Logos Contribute - Projects',
    description: 'Explore open source projects and their pull requests',
    locale,
    path: ROUTES.projects,
  })

  return metadata
}

export default function Page() {
  return <ProjectsContainer />
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
