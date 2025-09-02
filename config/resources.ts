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
        { title: 'For Developers', href: '/resources/developers', items: [] },
        { title: 'For Writers', href: '/resources/writers', items: [] },
        { title: 'For Event Organizers', href: '/resources/event-organizers', items: [] },
        { title: 'For Translators', href: '/resources/translators', items: [] },
        { title: 'For Designers', href: '/resources/designers', items: [] },
      ],
    },
  ],
}

export const RESOURCES_LANGUAGES = ['en', 'fr', 'ko'] as const
