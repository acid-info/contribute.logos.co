import ThemeToggle from '@/components/theme-toggle'
import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/utils/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Test',
    description: 'Test page description ',
    locale,
    path: ROUTES.test,
  })

  return metadata
}

export default async function Page() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Test Page
        </h1>
        <br />
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Description</p>
        <br />
        <ThemeToggle />
      </div>
    </div>
  )
}
