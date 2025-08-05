import 'css/tailwind.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteConfig from '@/data/siteConfig'
import { genPageMetadata } from '@/app/seo'
import { themeInitScript } from '@/utils/theme'

import { LsdThemeStyles } from '@acid-info/lsd-react/theme'
import '@acid-info/lsd-react/css'

export const metadata = genPageMetadata({})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.defaultLocale} className={`scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <LsdThemeStyles />
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
