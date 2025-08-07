import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import HomeContainer from '@/containers/home/home-container'

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
