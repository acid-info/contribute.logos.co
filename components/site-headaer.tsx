'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'
import { Link, usePathname } from '@/i18n/navigation'
import LocaleSwitcher from '@/components/locale/locale-switcher'
import ThemeToggle from './theme-toggle'
import { ROUTES } from '@/constants/routes'
import { MobileNav } from '@/components/resources/mobile-nav'
import { resourcesConfig } from '@/config/resources'

const Header = () => {
  const t = useTranslations('common')
  const pathname = usePathname()
  const currentPath = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav items={resourcesConfig.sidebarNav} />

      <header className="bg-primary text-primary fixed top-0 right-0 left-0 z-40 border-b px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href={ROUTES.home} className="flex items-center space-x-2">
              <img src="/brand/logo-black.svg" alt="Logos" className="logo-light h-8 w-auto" />
              <img src="/brand/logo.svg" alt="Logos" className="logo-dark h-8 w-auto" />
            </Link>

            <nav className="hidden items-center space-x-6 md:flex">
              <Link href={ROUTES.home}>
                <Typography
                  variant="body1"
                  className={`underline-offset-5 hover:underline ${currentPath === ROUTES.home ? 'underline' : ''}`}
                >
                  {t('nav.directory')}
                </Typography>
              </Link>
              <Link href={ROUTES.resources}>
                <Typography
                  variant="body1"
                  className={`underline-offset-5 hover:underline ${currentPath === ROUTES.resources ? 'underline' : ''}`}
                >
                  {t('nav.resources')}
                </Typography>
              </Link>
              <Link href={ROUTES.proposals}>
                <Typography
                  variant="body1"
                  className={`underline-offset-5 hover:underline ${currentPath === ROUTES.proposals ? 'underline' : ''}`}
                >
                  {t('nav.proposals')}
                </Typography>
              </Link>
            </nav>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
