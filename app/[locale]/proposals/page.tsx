import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import ContactForm from '@/components/form/contact-form'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const metadata = await createDefaultMetadata({
    title: 'Contact Form - Logos Contribute',
    description: 'Send us a message to contribute or get in touch.',
    locale,
    path: ROUTES.form,
  })

  return metadata
}

export default function Page() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] flex-col items-center px-4 pt-10 pb-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="mb-6 text-2xl font-semibold">Proposals</h1>
        <p className="mb-8 text-base">Submit your proposal for Logos.</p>
      </div>
      <div className="w-full max-w-2xl">
        <ContactForm />
        <div className="mt-12">
          <Link href="/resources/how-to-contribute" className="underline">
            How to contribute
          </Link>
        </div>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
