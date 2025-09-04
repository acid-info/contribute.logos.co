import siteConfig from '@/config/site'

export interface HomePageSchemaProps {
  locale: string
  path?: string
}

export function generateHomePageSchema({ locale, path = '' }: HomePageSchemaProps) {
  const baseUrl = siteConfig.url
  const fullUrl = `${baseUrl}${locale === siteConfig.defaultLocale ? '' : `/${locale}`}${path}`

  // Organization schema for Logos
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${baseUrl}/brand/logo.svg`,
    sameAs: [
      // Add social media URLs if available
    ],
  }

  // WebSite schema for the contribute platform
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Logos Contribute',
    url: fullUrl,
    description:
      'Open Source Contribution Hub - Celebrating open source contributors and helping new developers make their first contributions',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${baseUrl}/brand/logo.svg`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${fullUrl}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // CollectionPage schema for the contributors list
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Open Source Contributors',
    url: fullUrl,
    description: 'A curated list of active open source contributors',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Open Source Contributors',
      description: 'List of active contributors to open source projects',
    },
  }

  // Dataset schema for the statistics
  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Logos Contribute Statistics',
    description: 'Statistics about open source contributors and their contributions',
    url: fullUrl,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    distribution: {
      '@type': 'DataDownload',
      contentUrl: fullUrl,
      encodingFormat: 'application/json',
    },
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'Active Contributors',
        description: 'Number of active open source contributors',
        unitText: 'contributors',
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Contributions',
        description: 'Total number of contributions made',
        unitText: 'contributions',
      },
      {
        '@type': 'PropertyValue',
        name: 'Repositories',
        description: 'Number of repositories with contributions',
        unitText: 'repositories',
      },
    ],
  }

  // SoftwareApplication schema for the platform
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Logos Contribute Platform',
    url: fullUrl,
    description: 'A platform for discovering and celebrating open source contributors',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    featureList: [
      'Contributor Discovery',
      'Contribution Statistics',
      'Repository Tracking',
      'Contribution Guidelines',
    ],
  }

  return [
    organizationSchema,
    websiteSchema,
    collectionPageSchema,
    datasetSchema,
    softwareApplicationSchema,
  ]
}
