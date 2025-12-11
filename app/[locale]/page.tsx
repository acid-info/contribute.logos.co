import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import { generateHomePageSchema } from '@/lib/schema'
import HomeContainer from '@/containers/home/home-container'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Logos Contribute - Open Source Contribution Hub',
    description:
      'Celebrating open source contributors and helping new developers make their first contribution.',
    locale,
    path: ROUTES.home,
  })

  return metadata
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const schemas = generateHomePageSchema({
    locale,
    path: ROUTES.home,
  })

  return (
    <>
      {/* JSON-LD Schema */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
      <HomeContainer />
    </>
  )
}

export function generateStaticParams() {
  // SSG for locales at the root index
  return routing.locales.map((locale) => ({ locale }))
}
