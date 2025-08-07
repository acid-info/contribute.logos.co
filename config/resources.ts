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
      items: [
        { title: 'About Logos', href: '/resources', items: [] },
        { title: 'How to contribute', href: '/resources/how-to-contribute', items: [] },
      ],
    },
  ],
}

export const RESOURCES_LANGUAGES = ['en', 'fr', 'ko'] as const
