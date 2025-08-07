'use client'

import { useTranslations } from 'next-intl'
import { Typography } from '@acid-info/lsd-react'
import { Link, usePathname } from '@/i18n/navigation'
import LocaleSwitcher from '@/components/locale/locale-switcher'
import ThemeToggle from './theme-toggle'
import { ROUTES } from '@/constants/routes'

const Header = () => {
  const t = useTranslations('common')
  const pathname = usePathname()

  return (
    <header className="border-primary border-b px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href={ROUTES.home} className="flex items-center space-x-2">
            <img src="/brand/logo-black.svg" alt="Logos" className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center space-x-6 md:flex">
            <Link href={ROUTES.home}>
              <Typography
                variant="body1"
                className={`underline-offset-5 hover:underline ${pathname === ROUTES.home ? 'underline' : ''}`}
              >
                {t('nav.directory')}
              </Typography>
            </Link>
            <Link href={ROUTES.resources}>
              <Typography
                variant="body1"
                className={`underline-offset-5 hover:underline ${pathname === ROUTES.resources ? 'underline' : ''}`}
              >
                {t('nav.resources')}
              </Typography>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
