'use client'

import { SidebarNavItem } from '@/types'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export interface DocsSidebarNavProps {
  items: SidebarNavItem[]
}

export function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname()
  const t = useTranslations()

  return items.length ? (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col gap-1">
          {/* <h4 className="px-2 py-1 ml-1 text-sm font-semibold">
            {t(item.title)}{' '}
            {item.label && (
              <span className="ml-2 px-1.5 py-0.5 text-xs leading-none font-normal text-[#000000] no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </h4> */}
          {item?.items?.length && <DocsSidebarNavItems items={item.items} pathname={pathname} />}
        </div>
      ))}
    </div>
  ) : null
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
}

export function DocsSidebarNavItems({ items, pathname }: DocsSidebarNavItemsProps) {
  const getPathWithoutLocale = (path: string | null) => {
    if (!path) return ''
    const pathSegments = path.split('/')
    if (pathSegments.length > 1 && pathSegments[1].length === 2) {
      return '/' + pathSegments.slice(2).join('/')
    }
    return path
  }

  const currentPath = getPathWithoutLocale(pathname)

  return items?.length ? (
    <div className="relative grid grid-flow-row auto-rows-max gap-0.5 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'group relative flex h-8 w-full items-center border-l-2 px-2 font-normal transition-colors',
              item.disabled && 'cursor-not-allowed opacity-60',
              currentPath === item.href
                ? 'border-neutral-900 bg-neutral-100 font-medium text-neutral-900'
                : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            )}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            <span className="shrink-0">{item.title}</span>
            {item.label && (
              <span
                className={cn(
                  'ml-2 px-1.5 py-0.5 text-xs leading-none no-underline',
                  currentPath === item.href ? 'text-white' : 'bg-[#000000] text-[#000000]'
                )}
              >
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              'text-muted-foreground flex w-full cursor-not-allowed items-center p-2',
              item.disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            {item.title}
            {item.label && (
              <span className="bg-muted text-muted-foreground ml-2 px-1.5 py-0.5 text-xs leading-none no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
