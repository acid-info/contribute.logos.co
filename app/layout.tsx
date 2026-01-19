import 'css/tailwind.css'
import '@acid-info/lsd-react/css'
import { LsdThemeStyles, createTheme, defaultThemes } from '@acid-info/lsd-react/theme'
import { themeInitScript } from '@/lib/theme'
import Script from 'next/script'
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/jsonld-schemas'
import * as fonts from '@/app/fonts'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import siteConfig from '@/config/site'
import UmamiInit from '@/components/umami-init'

const customLightTheme = createTheme(
  {
    breakpoints: defaultThemes.light.breakpoints,
    typography: defaultThemes.light.typography,
    typographyGlobal: {
      genericFontFamily: 'monospace',
    },
    palette: defaultThemes.light.palette,
    spacing: defaultThemes.light.spacing,
  },
  defaultThemes.light
)

const customDarkTheme = createTheme(
  {
    breakpoints: defaultThemes.dark.breakpoints,
    typography: defaultThemes.dark.typography,
    typographyGlobal: {
      genericFontFamily: 'monospace',
    },
    palette: defaultThemes.dark.palette,
    spacing: defaultThemes.dark.spacing,
  },
  defaultThemes.dark
)

export const dynamic = 'force-static'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: `@${siteConfig.name}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = generateOrganizationJsonLd()
  const websiteSchema = generateWebSiteJsonLd()

  return (
    <html
      lang="en"
      className={cn('scroll-smooth', fonts.mainFont.variable, fonts.secondaryFont.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <LsdThemeStyles
          customThemes={{
            light: customLightTheme,
            dark: customDarkTheme,
          }}
          initialTheme="light"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
        <Script
          strategy="afterInteractive"
          src="https://umami.bi.status.im/script.js"
          data-website-id="92fb3459-5270-4ce8-a81b-70bee39fbdfe"
          data-domains="contribute.logos.co"
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
      <body className={fonts.mainFont.className}>
        <UmamiInit />
        {children}
      </body>
    </html>
  )
}
