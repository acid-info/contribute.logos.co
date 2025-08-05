import { Metadata } from 'next'
import siteConfig from '@/data/siteConfig'

interface PageSEOProps {
  title?: string
  description?: string
  image?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  const pageDescription = description || siteConfig.description
  const pageTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title || siteConfig.title,
      template: `%s | ${siteConfig.title}`,
    },
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: './',
      siteName: siteConfig.title,
      images: image ? [image] : [siteConfig.socialBanner],
      locale: siteConfig.defaultLocale,
      type: 'website',
    },
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteConfig.url}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: siteConfig.favicon,
    },
    twitter: {
      title: pageTitle,
      card: 'summary_large_image',
      images: image ? [image] : [siteConfig.socialBanner],
    },
    ...rest,
  }
}
