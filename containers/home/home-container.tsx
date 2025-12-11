'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { useContributors } from '@/hooks/useContributors'
import StatsGrid from '@/components/stats/stats-grid'
import IssuesContainer from '../issues/issues-container'
import ContributorDirectory from '@/components/contributors/contributors-directory'
import ProposalsSection from '@/components/proposals/proposals-section'

export default function HomeContainer() {
  const t = useTranslations('home')

  const { data: contributors = [], isLoading, error } = useContributors()

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-20 sm:px-6 xl:px-0">
        <section className="flex flex-col gap-3 text-center">
          <h1 className="text-center">{t('title')}</h1>
          <Typography variant="subtitle1" className="text-base sm:text-lg">
            {t('subtitle')}
          </Typography>
        </section>

        <section>
          <StatsGrid contributors={contributors} isLoading={isLoading} error={!!error} />
        </section>

        <section className="">
          <h2 className="pb-4 text-center">Start Contributing</h2>
          <div className="mb-4">
            <IssuesContainer showPagination={false} itemsPerPage={5} />
          </div>
          <Link href={ROUTES.issues}>
            <Button variant="outlined" size="small" className="w-full sm:w-auto">
              View All Issues
            </Button>
          </Link>
        </section>

        <section>
          <h2 className="pb-2 text-center">Community Directory</h2>
          <p className="pb-12 text-center">
            Recognising our top contributors and their impact on the ecosystem
          </p>
          <div className="mb-4">
            <ContributorDirectory
              contributors={contributors}
              isLoading={isLoading}
              error={!!error}
              showPagination={false}
              itemsPerPage={5}
            />
          </div>
          <Link href={ROUTES.leaderboard}>
            <Button variant="outlined" size="small" className="w-full sm:w-auto">
              View All Contributors
            </Button>
          </Link>
        </section>

        <section className="text-center">
          <div className="border-primary flex flex-col gap-4 border p-4 sm:p-8">
            <Typography variant="h3" className="mb-4 text-lg sm:text-xl">
              {t('cta.title')}
            </Typography>
            <Typography variant="body1" className="mb-6 text-sm sm:text-base">
              {t('cta.description')}
            </Typography>
            <div className="flex justify-center">
              <Link href={ROUTES.resources}>
                <Button variant="outlined" size="small" className="w-full sm:w-auto">
                  {t('cta.viewGuidelines')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <h2 className="pb-2 text-center">Proposals</h2>
          <ProposalsSection
            description="Submit your proposal for Logos."
            showHowToContributeLink={true}
          />
        </section>
      </div>
    </div>
  )
}
