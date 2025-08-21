import { ROUTES } from '@/constants/routes'
import { createDefaultMetadata } from '@/lib/metadata'
import ContactForm from '@/components/form/contact-form'
import ProposalGuidelines from '@/components/form/proposal-guidelines'

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
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="mb-6 text-2xl font-semibold">Proposals</h1>
        <p className="mb-8 text-base">Submit your proposal for Logos.</p>
      </div>
      <ContactForm />
      <ProposalGuidelines />
    </div>
  )
}
