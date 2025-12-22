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
        { title: 'To contribute locally', href: '/resources/activists', items: [] },
        { title: 'For developers', href: '/resources/developers', items: [] },
        { title: 'For writers', href: '/resources/writers', items: [] },
        { title: 'For event organisers', href: '/resources/event-organisers', items: [] },
        { title: 'For translators', href: '/resources/translators', items: [] },
        { title: 'For designers', href: '/resources/designers', items: [] },
      ],
    },
  ],
}

export const RESOURCES_LANGUAGES = ['en', 'fr', 'ko'] as const
