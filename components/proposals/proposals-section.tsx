'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ContactForm from '@/components/form/contact-form'

interface ProposalsSectionProps {
  description?: string
  showHowToContributeLink?: boolean
}

export default function ProposalsSection({
  description,
  showHowToContributeLink = true,
}: ProposalsSectionProps) {
  const t = useTranslations('proposals')

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
      {description && (
        <div className="mb-8 flex flex-col items-center gap-2">
          {description && <p className="mb-8 text-base">{description}</p>}
        </div>
      )}
      <div className="w-full">
        <ContactForm />
        {showHowToContributeLink && (
          <div className="mt-8">
            <Link href="/resources/how-to-contribute" className="underline">
              {t('howToContribute')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
