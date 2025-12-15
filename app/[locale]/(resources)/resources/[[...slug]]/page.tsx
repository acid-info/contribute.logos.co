import { cn } from '@/lib/utils'

import type { Metadata } from 'next'
import { allResources } from 'content-collections'
import { routing } from '@/i18n/routing'

import { DocNavigation } from '@/components/pager'
import { Mdx } from '@/components/mdx-components'

import '@/css/mdx.css'
import { absoluteUrl } from '@/lib/metadata'
import { ROUTES } from '@/constants/routes'

async function getDocFromParams({ params }: any) {
  const _params = await params
  const locale = _params.locale || 'en'
  const slugPath = _params.slug?.join('/') || ''
  const slugA = `${ROUTES.resources}/${locale}${slugPath ? `/${slugPath}` : ''}`
  const slugB = `${ROUTES.resources}/${locale}${slugPath ? `/${slugPath}` : '/index'}`

  const slugAsParamsA = `${locale}${slugPath ? `/${slugPath}` : ''}`
  const slugAsParamsB = `${locale}${slugPath ? `/${slugPath}` : '/index'}`

  const doc =
    allResources.find((d) => d.locale === locale && (d.slug === slugA || d.slug === slugB)) ||
    allResources.find(
      (d) =>
        d.locale === locale &&
        (d.slugAsParams === slugAsParamsA || d.slugAsParams === slugAsParamsB)
    )

  return doc || null
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const _params = await params
  const doc = await getDocFromParams({ params: _params })

  if (!doc) return {}

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: 'article',
      url: absoluteUrl(`/${_params.locale}${ROUTES.resources}/${doc.slugAsParams}`),
      images: [`/og.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [doc.image],
      creator: '@logosnetwork',
    },
  }
}

export default async function Page({ params }: any) {
  const _params = await params
  const locale = _params.locale || 'en'

  const doc = await getDocFromParams({ params: _params })

  return (
    doc && (
      <main className="relative mb-24 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full max-w-3xl min-w-0 py-6 lg:py-8">
          <div className="space-y-2">
            <h1 className={cn('scroll-m-20 !text-3xl font-medium tracking-tight sm:text-4xl')}>
              {doc.title}
            </h1>
            {/* {doc.description && (
              <p className="text-lg text-muted-foreground text-balance">{doc.description}</p>
            )} */}
          </div>

          <div className="pt-4 pb-12">
            <Mdx code={doc.body.code} />
          </div>
          <div className="pt-8 pb-12"></div>
          <DocNavigation doc={doc} locale={locale} />
        </div>
      </main>
    )
  )
}

export function generateStaticParams() {
  const locales = routing.locales
  const paths = allResources
    .map((doc) => {
      const parts = doc.slugAsParams.split('/')
      const [_locale, ...rest] = parts
      // Exclude explicit index slugs; root per-locale is handled by indexParams
      if (rest.length === 1 && rest[0] === 'index') return null
      return { locale: doc.locale, slug: rest }
    })
    .filter(Boolean) as { locale: string; slug: string[] }[]
  // Ensure index pages per locale are included
  const indexParams = locales.map((locale) => ({ locale, slug: [] as string[] }))
  return [...paths, ...indexParams]
}
