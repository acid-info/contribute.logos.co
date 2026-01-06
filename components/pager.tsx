'use client'

import { Resource } from 'content-collections'
import { useLocale } from 'next-intl'

import { resourcesConfig } from '@/config/resources'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

interface DocsPagerProps {
  doc: Resource
}

export function DocNavigation({ doc }: DocsPagerProps) {
  const locale = useLocale()
  const pager = getPagerForDoc(doc, locale)

  if (!pager) {
    return null
  }

  const hasPrev = Boolean(pager?.prev?.href && pager.prev.title)
  const hasNext = Boolean(pager?.next?.href && pager.next.title)

  return (
    <div
      className={cn(
        'flex flex-row items-center gap-4',
        hasPrev && hasNext ? 'justify-between' : hasPrev ? 'justify-start' : 'justify-end'
      )}
    >
      {hasPrev && pager.prev && (
        <Link
          href={pager.prev.href}
          className="border-primary flex max-w-[50%] min-w-0 flex-1 items-center justify-start gap-2 border px-4 py-2 sm:w-[220px] sm:max-w-none sm:flex-none"
          title={pager.prev.title}
        >
          <span className="shrink-0">{'←'}</span>
          <span className="min-w-0 flex-1 truncate text-left text-sm">{pager.prev.title}</span>
        </Link>
      )}
      {hasNext && pager.next && (
        <Link
          href={pager.next.href}
          className="border-primary flex max-w-[50%] min-w-0 flex-1 items-center justify-start gap-2 border px-4 py-2 sm:w-[220px] sm:max-w-none sm:flex-none"
          title={pager.next.title}
        >
          <span className="min-w-0 flex-1 truncate text-left text-sm">{pager.next.title}</span>
          <span className="shrink-0">{'→'}</span>
        </Link>
      )}
    </div>
  )
}

export function flatten(links: any[]): any[] {
  return links
    .reduce<any[]>((flat, link) => {
      return flat.concat(link.items?.length ? flatten(link.items) : link)
    }, [])
    .filter((link) => !link?.disabled)
}

export function getPagerForDoc(doc: Resource, locale: string) {
  const flattenedLinks = [null, ...flatten(resourcesConfig.sidebarNav[0].items), null]

  const normalizedSlug = doc.slug.replace(/\/index$/, '')
  const docSlugWithoutLocale = normalizedSlug.replace(`/resources/${locale}`, '') || ''
  const fullDocSlug =
    docSlugWithoutLocale === '' ? '/resources' : `/resources${docSlugWithoutLocale}`

  const activeIndex = flattenedLinks.findIndex((link) => {
    if (!link) return false
    return link.href === fullDocSlug
  })

  if (activeIndex === -1) {
    return null
  }

  const prev = activeIndex > 0 ? flattenedLinks[activeIndex - 1] : null
  const next = activeIndex < flattenedLinks.length - 1 ? flattenedLinks[activeIndex + 1] : null

  return {
    prev: prev ? { ...prev, href: prev.href } : null,
    next: next ? { ...next, href: next.href } : null,
  }
}
