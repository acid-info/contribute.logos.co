import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import { routing } from '@/i18n/routing'
import ProposalsSection from '@/components/proposals/proposals-section'
import { getServerTranslations } from '@/lib/server-translations'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Contact Form - Logos Contribute',
    description: 'Send us a message to contribute or get in touch.',
    locale,
    path: ROUTES.form,
  })

  return metadata
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getServerTranslations(locale, 'proposals')

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] flex-col items-center px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <h1 className="pb-2 text-center">{t('title')}</h1>
      <ProposalsSection description={t('description')} showHowToContributeLink={true} />
    </div>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
