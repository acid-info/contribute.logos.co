import 'css/tailwind.css'

import Header from '@/components/site-headaer'
import Footer from '@/components/site-footer'
import { themeInitScript } from '@/utils/theme'

import { LsdThemeStyles } from '@acid-info/lsd-react/theme'
import '@acid-info/lsd-react/css'
import { NextIntlClientProvider } from 'next-intl'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <NextIntlClientProvider>
      <html lang={locale} className={`scroll-smooth`} suppressHydrationWarning>
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
    </NextIntlClientProvider>
  )
}
