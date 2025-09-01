'use client'

import { useState } from 'react'
import { SidebarNavItem } from '@/types'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import LocaleSwitcher from '@/components/locale/locale-switcher'
import ThemeToggle from '@/components/theme-toggle'

export interface MobileNavProps {
  items: SidebarNavItem[]
}

const HamburgerIcon = () => (
  <div className="flex h-6 w-6 flex-col items-center justify-center">
    <div className="mb-1 h-0.5 w-5 bg-current"></div>
    <div className="mb-1 h-0.5 w-5 bg-current"></div>
    <div className="h-0.5 w-5 bg-current"></div>
  </div>
)

const CloseIcon = () => (
  <div className="relative flex h-6 w-6 items-center justify-center">
    <div className="absolute h-0.5 w-5 rotate-45 transform bg-current"></div>
    <div className="absolute h-0.5 w-5 -rotate-45 transform bg-current"></div>
  </div>
)

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('common')

  const getPathWithoutLocale = (path: string | null) => {
    if (!path) return ''
    const pathSegments = path.split('/')
    if (pathSegments.length > 1 && pathSegments[1].length === 2) {
      return '/' + pathSegments.slice(2).join('/')
    }
    return path
  }

  const currentPath = getPathWithoutLocale(pathname)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const mainNavItems = [
    { title: t('nav.directory'), href: ROUTES.home },
    { title: t('nav.resources'), href: ROUTES.resources },
    { title: t('nav.proposals'), href: ROUTES.proposals },
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="fixed top-2 right-4 z-50 cursor-pointer p-2"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {isOpen && (
        <>
          <div className="bg-opacity-20 fixed inset-0 z-40" onClick={closeMenu} />

          <div className="e bg-primary text-primary fixed top-0 right-0 z-50 h-full w-80 max-w-[80vw] border-l">
            <div className="bg-whit flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="cursor-pointer !text-lg font-medium">Menu</h2>
                <button onClick={closeMenu} className="p-1" aria-label="Close navigation menu">
                  <CloseIcon />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="mb-6">
                  <div className="flex flex-col gap-1">
                    {mainNavItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          'group relative flex h-10 w-fit cursor-pointer items-center px-3 py-2 font-normal transition-colors'
                        )}
                      >
                        <span className="shrink-0">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {items.length ? (
                  <div className="mb-6">
                    <h3 className="mb-3 !text-base">Resources</h3>
                    <div className="flex flex-col gap-6">
                      {items.map((item, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          {item?.items?.length && (
                            <MobileNavItems
                              items={item.items}
                              pathname={pathname}
                              onItemClick={closeMenu}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="border-t pt-4">
                  <h3 className="pb-4 text-sm font-medium">Settings</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="block pb-2 text-sm">Language</span>
                      <LocaleSwitcher />
                    </div>
                    <div>
                      <span className="block pb-2 text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

interface MobileNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
  onItemClick: () => void
}

function MobileNavItems({ items, pathname, onItemClick }: MobileNavItemsProps) {
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
    <div className="relative grid grid-flow-row auto-rows-max gap-1 text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'group relative flex h-10 w-full items-center px-3 py-2 font-normal transition-colors',
              item.disabled && 'cursor-not-allowed opacity-60',
              currentPath === item.href ? 'font-medium' : 'hover:text-primary'
            )}
            target={item.external ? '_blank' : ''}
            rel={item.external ? 'noreferrer' : ''}
          >
            <span className="shrink-0">{item.title}</span>
            {item.label && (
              <span className={cn('ml-2 px-1.5 py-0.5 text-xs leading-none')}>{item.label}</span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              'flex w-full cursor-not-allowed items-center px-3 py-2',
              item.disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 px-1.5 py-0.5 text-xs leading-none">{item.label}</span>
            )}
          </span>
        )
      )}
    </div>
  ) : null
}
