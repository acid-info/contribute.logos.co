import siteConfig from '@/config/site'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'

type DefaultMetadataProps = {
  locale: string
  title?: string
  description?: string
  path?: string
}

const baseUrl = siteConfig.url

export function absoluteUrl(path: string, locale: string = siteConfig.defaultLocale) {
  return `${siteConfig.url}${locale === siteConfig.defaultLocale ? '' : `/${locale}`}${path}`
}

export async function createDefaultMetadata({
  title = '',
  description = '',
  locale,
  path = '',
}: DefaultMetadataProps): Promise<Metadata> {
  const _title = title || siteConfig.title
  const _description = description || siteConfig.description

  const fullUrl = absoluteUrl(path, locale)

  // Generate language alternates for all supported locales
  const languageAlternates = routing.locales.reduce(
    (acc, loc) => {
      acc[loc] = absoluteUrl(path, loc)
      return acc
    },
    {} as Record<string, string>
  )

  return {
    title: _title,
    description: _description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        ...languageAlternates,
        'x-default': absoluteUrl(path, siteConfig.defaultLocale),
      },
    },
    openGraph: {
      title: _title,
      description: _description,
      url: fullUrl,
      type: 'website',
      locale,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl('/opengraph-image', locale),
          width: 1200,
          height: 630,
          alt: _title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: _title,
      description: _description,
      images: [absoluteUrl('/opengraph-image', locale)],
      creator: `@${siteConfig.name}`,
    },
    icons: '/favicon.ico',
    creator: siteConfig.name,
    publisher: siteConfig.name,
    keywords: siteConfig.keywords,
    robots: {
      index: process.env.NEXT_PUBLIC_API_MODE === 'production',
      follow: true,
      googleBot: {
        index: process.env.NEXT_PUBLIC_API_MODE === 'production',
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // google: 'your-google-verification-id',
    },
  }
}
