import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import ProjectsContainer from '@/containers/projects/projects-container'

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
