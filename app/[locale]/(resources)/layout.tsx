import { DocsSidebarNav } from '@/components/resources/sidebar-nav'
import { resourcesConfig } from '@/config/resources'

type Props = {
  params: Promise<{ locale: string }>
  children: React.ReactNode
}

export default async function DocsLayout({ children }: Props) {
  return (
    <div className="container-wrapper mt-8">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
          <div className="no-scrollbar h-full overflow-auto py-6 pr-4 lg:py-8">
            <DocsSidebarNav items={resourcesConfig.sidebarNav} />
          </div>
        </aside>
        <div className="px-4 md:px-0">{children}</div>
      </div>
    </div>
  )
}
