import 'css/tailwind.css'
import '@acid-info/lsd-react/css'
import { LsdThemeStyles, createTheme, defaultThemes } from '@acid-info/lsd-react/theme'
import { themeInitScript } from '@/lib/theme'
import Script from 'next/script'
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from '@/lib/jsonld-schemas'
import * as fonts from '@/app/fonts'
import { cn } from '@/lib/utils'

const customLightTheme = createTheme(
  {
    breakpoints: defaultThemes.light.breakpoints,
    typography: defaultThemes.light.typography,
    typographyGlobal: {
      genericFontFamily: 'serif',
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
      genericFontFamily: 'serif',
    },
    palette: defaultThemes.dark.palette,
    spacing: defaultThemes.dark.spacing,
  },
  defaultThemes.dark
)

export const dynamic = 'force-static'

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
      <body className={fonts.mainFont.className}>{children}</body>
    </html>
  )
}
