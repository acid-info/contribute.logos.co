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
        { title: 'resources.sidebar.index', href: '/resources', items: [] },
        {
          title: 'resources.sidebar.howToContribute',
          href: '/resources/how-to-contribute',
          items: [],
        },
        { title: 'resources.sidebar.activists', href: '/resources/activists', items: [] },
        { title: 'resources.sidebar.developers', href: '/resources/developers', items: [] },
        { title: 'resources.sidebar.writers', href: '/resources/writers', items: [] },
        {
          title: 'resources.sidebar.eventOrganisers',
          href: '/resources/event-organisers',
          items: [],
        },
        { title: 'resources.sidebar.translators', href: '/resources/translators', items: [] },
        { title: 'resources.sidebar.designers', href: '/resources/designers', items: [] },
      ],
    },
  ],
}

export const RESOURCES_LANGUAGES = ['en', 'fr', 'ko'] as const
