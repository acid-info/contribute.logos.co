type SiteConfig = {
  name: string
  title: string
  description: string
  url: string
  defaultLocale: string
  keywords: string[]
}

const siteConfig: SiteConfig = {
  name: 'Logos Contribute Portal',
  title: 'Logos Contribute Portal',
  description:
    'Celebrating open source contributors and helping new developers make their first contributions.',
  url: 'https://contribute.logos.co',
  keywords: ['Logos', 'Web3', 'Contribute'],
  defaultLocale: 'en',
}

export default siteConfig
