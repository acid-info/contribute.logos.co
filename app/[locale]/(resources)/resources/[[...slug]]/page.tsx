import { cn } from '@/lib/utils'

import type { Metadata } from 'next'
import { allResources } from 'content-collections'

import { DocNavigation } from '@/components/pager'
import { Mdx } from '@/components/mdx-components'
import { getTranslations } from 'next-intl/server'

import '@/css/mdx.css'
import { absoluteUrl } from '@/lib/metadata'
import { ROUTES } from '@/constants/routes'

async function getDocFromParams({ params }: any) {
  const _params = await params
  const locale = _params.locale || 'en'
  const slugPath = _params.slug?.join('/') || ''
  const slug = `${ROUTES.resources}/${locale}${slugPath ? `/${slugPath}` : ''}`

  const doc = allResources.find((doc) => doc.slug === slug && doc.locale === locale)

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
      images: [
        `/api/og?title=${encodeURIComponent(doc.title)}&description=${encodeURIComponent(doc.description)}`,
      ],
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
  const t = await getTranslations()

  return (
    doc && (
      <main className="relative mb-24 lg:gap-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full max-w-3xl min-w-0 py-6 lg:py-8">
          <div className="space-y-2">
            <h1 className={cn('scroll-m-20 text-4xl font-medium tracking-tight')}>{doc.title}</h1>
            {/* {doc.description && (
              <p className="text-lg text-muted-foreground text-balance">{doc.description}</p>
            )} */}
          </div>

          <div className="pt-8 pb-12">
            <Mdx code={doc.body.code} />
          </div>
          <div className="pt-8 pb-12"></div>
          <DocNavigation doc={doc} locale={locale} />
        </div>
      </main>
    )
  )
}
