'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { useContributors } from '@/hooks/useContributors'
import { useSocialProofData } from '@/hooks/useSocialProofData'
import StatsGrid from '@/components/stats/stats-grid'
import IssuesContainer from '../issues/issues-container'
import ContributorDirectory from '@/components/contributors/contributors-directory'
import ProposalsSection from '@/components/proposals/proposals-section'

export default function HomeContainer() {
  const t = useTranslations('home')
  const tp = useTranslations('proposals')

  const { data: contributors = [], isLoading, error } = useContributors()
  const {
    data: socialProof = {
      activeContributorsCount: 0,
      totalContributionsCount: 0,
      totalRepositoriesCount: 0,
      activeCirclesCount: 0,
    },
    isLoading: statsLoading,
    error: statsError,
  } = useSocialProofData()

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-8 pb-10 sm:gap-20 sm:px-6 sm:py-20 xl:px-0">
        <section className="flex flex-col gap-3 text-center">
          <h1 className="text-center max-sm:!text-3xl">{t('title')}</h1>
          <Typography variant="subtitle1" className="!text-base">
            {t('subtitle')}
          </Typography>
        </section>

        <section>
          <StatsGrid data={socialProof} isLoading={statsLoading} error={!!statsError} />
        </section>

        <section className="">
          <h2 className="pb-2 text-center max-sm:!text-2xl">{t('issues.title')}</h2>
          <div className="mb-4">
            <IssuesContainer showPagination={false} itemsPerPage={5} />
          </div>
          <Link href={ROUTES.issues}>
            <Button variant="outlined" size="small" className="w-full sm:w-auto">
              {t('issues.viewAll')}
            </Button>
          </Link>
        </section>

        <section>
          <h2 className="pb-2 text-center max-sm:!text-2xl">{t('directory.title')}</h2>
          <p className="pb-12 text-center">{t('directory.description')}</p>
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
              {t('directory.viewAll')}
            </Button>
          </Link>
        </section>

        <section className="text-center">
          <div className="border-primary flex flex-col gap-4 border p-4 sm:p-8">
            <h3 className="mb-4 !text-lg sm:!text-xl">{t('cta.title')}</h3>
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
          <h2 className="pb-2 text-center max-sm:!text-2xl">{tp('title')}</h2>
          <ProposalsSection description={tp('description')} showHowToContributeLink={true} />
        </section>
      </div>
    </div>
  )
}
