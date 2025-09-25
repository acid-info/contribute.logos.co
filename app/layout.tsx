import 'css/tailwind.css'
import '@acid-info/lsd-react/css'
import { LsdThemeStyles } from '@acid-info/lsd-react/theme'
import { themeInitScript } from '@/lib/theme'
import Script from 'next/script'
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/jsonld-schemas'

export const dynamic = 'force-static'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = generateOrganizationJsonLd()
  const websiteSchema = generateWebSiteJsonLd()

  return (
    <html lang="en" className={`scroll-smooth`} suppressHydrationWarning>
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

        {/* Schema.org JSON-LD */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
