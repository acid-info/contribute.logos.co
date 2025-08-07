import { Doc } from 'content-collections'

import { resourcesConfig } from '@/config/resources'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'

interface DocsPagerProps {
  doc: Doc
  locale: string
}

export function DocNavigation({ doc, locale }: DocsPagerProps) {
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
          className="border-border flex w-[200px] justify-center gap-2 border px-2 py-1 text-center"
          title={pager.prev.title}
        >
          <span>{'←'}</span>
          <span className="truncate">{pager.prev.title}</span>
        </Link>
      )}
      {hasNext && pager.next && (
        <Link
          href={pager.next.href}
          className="border-border flex w-[200px] justify-center gap-2 border px-2 py-1 text-center"
          title={pager.next.title}
        >
          <span className="truncate">{pager.next.title}</span>
          <span>{'→'}</span>
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

export function getPagerForDoc(doc: Doc, locale: string) {
  const flattenedLinks = [null, ...flatten(resourcesConfig.sidebarNav), null]

  const normalizedSlug = doc.slug.replace(/\/index$/, '')
  const docSlugWithoutLocale = normalizedSlug.replace(`/docs/${locale}`, '') || '/docs'
  const fullDocSlug = docSlugWithoutLocale === '/docs' ? '/docs' : `/docs${docSlugWithoutLocale}`

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
    prev: prev ? { ...prev, href: `/${locale}${prev.href}` } : null,
    next: next ? { ...next, href: `/${locale}${next.href}` } : null,
  }
}
