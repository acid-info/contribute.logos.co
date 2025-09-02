import 'css/tailwind.css'
import Header from '@/components/site-headaer'
import Footer from '@/components/site-footer'
import QueryProvider from '@/components/providers/query-provider'
import { NextIntlClientProvider } from 'next-intl'

export const dynamic = 'force-static'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <QueryProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        <Header />
        <main>{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </QueryProvider>
  )
}
