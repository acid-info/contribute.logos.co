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
