type SiteConfig = {
  name: string
  title: string
  description: string
  url: string
  defaultLocale: string
  keywords: string[]
}

const siteConfig: SiteConfig = {
  name: 'Logos',
  title: 'Logos Contribute Portal',
  description:
    'Celebrating open source contributors and helping new developers make their first contributions.',
  url: 'https://logos.co',
  keywords: ['Logos', 'Web3'],
  defaultLocale: 'en',
}

export default siteConfig
