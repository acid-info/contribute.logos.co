import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import HomeContainer from '@/containers/home/home-container'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Logos Contribute - Open Source Contribution Hub',
    description:
      'Celebrating open source contributors and helping new developers make their first contributions',
    locale,
    path: ROUTES.home,
  })

  return metadata
}

export default function Page() {
  return <HomeContainer />
}

export function generateStaticParams() {
  // SSG for locales at the root index
  return routing.locales.map((locale) => ({ locale }))
}
