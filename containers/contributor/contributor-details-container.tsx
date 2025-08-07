'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { Contributor } from '@/constants/mockData'
import { ROUTES } from '@/constants/routes'
import { faker } from '@faker-js/faker'

interface ContributorDetailsContainerProps {
  contributor: Contributor
}

interface Contribution {
  id: string
  type: 'commit' | 'issue' | 'pull_request' | 'review' | 'translation'
  title: string
  repository: string
  date: string
  url: string
}

const generateMockContributions = (contributor: Contributor): Contribution[] => {
  const types: Contribution['type'][] = ['commit', 'issue', 'pull_request', 'review', 'translation']
  const repos = [
    'logos-core',
    'logos-ui',
    'logos-docs',
    'logos-cli',
    'logos-api',
    'logos-utils',
    'logos-theme',
  ]

  return Array.from({ length: contributor.contributions }, (_, index) => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(types),
    title: faker.git.commitMessage(),
    repository: faker.helpers.arrayElement(repos),
    date: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
    url: faker.internet.url(),
  }))
}

export default function ContributorDetailsContainer({
  contributor,
}: ContributorDetailsContainerProps) {
  const t = useTranslations('contributor')
  const contributions = generateMockContributions(contributor)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getContributionIcon = (type: Contribution['type']) => {
    switch (type) {
      case 'commit':
        return 'Commit'
      case 'issue':
        return 'Issue'
      case 'pull_request':
        return 'Pull Request'
      case 'review':
        return 'Review'
      case 'translation':
        return 'Translation'
      default:
        return 'Contribution'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 xl:px-0">
        <div className="mb-8">
          <Link href={ROUTES.home}>
            <Button variant="outlined">{t('backToContributors')}</Button>
          </Link>
        </div>

        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border-primary border p-8">
              <div className="mb-6 flex items-center space-x-6">
                <img
                  src={contributor.avatarUrl}
                  alt={`${contributor.username} avatar`}
                  className="h-24 w-24 rounded-full"
                />
                <div>
                  <Typography variant="h1" className="mb-2">
                    {contributor.username}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600">
                    {contributor.contributions} {t('contributionsToEcosystem')}
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="border-primary border p-6 text-center">
                  <Typography variant="h2" className="mb-2">
                    {contributor.contributions}
                  </Typography>
                  <Typography variant="body2">{t('totalContributions')}</Typography>
                </div>
                <div className="border-primary border p-6 text-center">
                  <Typography variant="h2" className="mb-2">
                    {contributor.latestRepo}
                  </Typography>
                  <Typography variant="body2">{t('latestRepository')}</Typography>
                </div>
                <div className="border-primary border p-6 text-center">
                  <Typography variant="h2" className="mb-2">
                    {formatDate(contributor.latestContribution)}
                  </Typography>
                  <Typography variant="body2">{t('latestContribution')}</Typography>
                </div>
              </div>

              <div className="mt-8">
                <a href={contributor.profileUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outlined">{t('viewGithubProfile')}</Button>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border-primary border p-6">
              <Typography variant="h3" className="mb-4">
                Quick Stats
              </Typography>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography variant="body2">Total Contributions</Typography>
                  <Typography variant="body2" className="font-medium">
                    {contributor.contributions}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Latest Repository</Typography>
                  <Typography variant="body2" className="font-medium">
                    {contributor.latestRepo}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Last Contribution</Typography>
                  <Typography variant="body2" className="font-medium">
                    {formatDate(contributor.latestContribution)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-primary border">
          <div className="border-primary border-b px-8 py-6">
            <Typography variant="h2">{t('contributionHistory')}</Typography>
          </div>
          <div className="divide-primary divide-y">
            {contributions.map((contribution) => (
              <div key={contribution.id} className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="border-primary flex h-12 items-center justify-center border px-4">
                    <Typography variant="body2" className="font-medium">
                      {getContributionIcon(contribution.type)}
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography variant="body1" className="mb-2 font-medium">
                      {contribution.title}
                    </Typography>
                    <div className="flex flex-wrap items-center gap-4">
                      <Typography variant="body2" className="text-gray-600">
                        {contribution.repository}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {formatDate(contribution.date)}
                      </Typography>
                    </div>
                  </div>
                  <a href={contribution.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outlined" size="small">
                      {t('view')}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
