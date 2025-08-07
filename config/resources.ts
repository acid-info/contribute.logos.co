interface ResourcesConfig {
  sidebarNav: {
    title: string
    items: any[]
  }[]
}

export const resourcesConfig: ResourcesConfig = {
  sidebarNav: [
    {
      title: 'common.sidebar.docs',
      items: [{ title: 'About Logos', href: '/', items: [] }],
    },
  ],
}

export const RESOURCES_LANGUAGES = ['en', 'fr', 'ko'] as const
