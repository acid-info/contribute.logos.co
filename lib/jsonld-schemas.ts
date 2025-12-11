import { type LeaderboardEntry } from '@/components/leaderboard/leaderboard-table'

interface LeaderboardJsonLdProps {
  title: string
  description: string
  url: string
  entries: LeaderboardEntry[]
  type: 'seasonal' | 'historical'
  locale: string
}

export function generateLeaderboardJsonLd({
  title,
  description,
  url,
  entries,
  type,
  locale,
}: LeaderboardJsonLdProps) {
  const topEntries = entries.slice(0, 5) // Top 5 only

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: description,
    url: url,
    inLanguage: locale,
    numberOfItems: entries.length,
    itemListElement: topEntries.map((entry) => ({
      '@type': 'ListItem',
      position: entry.rank,
      item: {
        '@type': 'Person',
        name: entry.username,
        url: `https://github.com/${entry.username}`,
        description: `#${entry.rank} with ${entry.score} points`,
      },
    })),
    provider: {
      '@type': 'Organization',
      name: 'Logos',
      url: 'https://logos.co',
    },
  }
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Logos',
    url: 'https://logos.co',
    logo: 'https://contribute.logos.co/brand/logos-black.svg',
    description: 'Decentralized autonomous organization focused on privacy and freedom',
    foundingDate: '2023',
    sameAs: ['https://github.com/logos-co', 'https://twitter.com/logosnetwork'],
  }
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Logos Contribute',
    url: 'https://contribute.logos.co',
    description:
      'Celebrating open source contributors and helping new developers make their first contributions.',
    publisher: {
      '@type': 'Organization',
      name: 'Logos',
      url: 'https://logos.co',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://contribute.logos.co/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}
