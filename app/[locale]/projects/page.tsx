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
  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-7xl flex-col px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <ProjectsContainer />
    </div>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
