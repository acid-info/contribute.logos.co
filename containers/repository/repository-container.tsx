'use client'

import { Button, Typography } from '@acid-info/lsd-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo, useRef } from 'react'
import { ROUTES } from '@/constants/routes'
import { useOrgProjects } from '@/hooks/useOrgProjects'
import type { PullRequestContributor } from '@/hooks/usePullRequests'
import { usePullRequests } from '@/hooks/usePullRequests'
import { Link } from '@/i18n/navigation'

export default function RepositoryContainer() {
  const t = useTranslations('repository')
  const params = useParams()
  const { org, repo } = params as { org: string; repo: string }
  const timelineContainerRef = useRef<HTMLDivElement>(null)

  const {
    data: repos = [],
    isLoading: reposLoading = true,
    error: reposError,
  } = useOrgProjects(org)
  const {
    data: pullRequests = [],
    isLoading: pullRequestsLoading = true,
    error: pullRequestsError,
  } = usePullRequests(org, repo)

  const repoData = useMemo(
    () => repos.find((r) => r.full_name === `${org}/${repo}`),
    [repos, org, repo]
  )

  if (reposLoading) {
    return (
      <Typography variant="body2" className="flex min-h-screen items-center justify-center">
        {t('loading')}
      </Typography>
    )
  }

  if (!repoData) {
    return null // Redirecting is handled by the hook
  }

  if (reposError && !repoData) {
    return (
      <Typography
        variant="body2"
        className="flex min-h-screen items-center justify-center text-red-500"
      >
        Error loading repository data: {reposError.message}
      </Typography>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const filterHumanContrib = (contributors: PullRequestContributor[]) =>
    contributors.filter((contrib) => contrib.__typename === 'User')

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 xl:px-0">
        <div className="mb-8">
          <Link href={ROUTES.projects}>
            <Button variant="outlined">{t('backToProjects')}</Button>
          </Link>
        </div>
        {repoData && (
          <div className="mb-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="border-primary border p-8">
                <div className="mb-6">
                  <Typography variant="h1" className="mb-2">
                    {repoData.full_name}
                  </Typography>
                  {repoData.description && (
                    <Typography variant="body1" className="text-gray-600">
                      {repoData.description}
                    </Typography>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="border-primary border p-6 text-center">
                    <Typography variant="h2" className="mb-2">
                      {pullRequests.filter((pr) => !!pr.mergedAt).length}
                    </Typography>
                    <Typography variant="body2">Merged Pull Requests</Typography>
                  </div>
                  <div className="border-primary border p-6 text-center">
                    <Typography variant="h2" className="mb-2">
                      {repoData.stargazers_count}
                    </Typography>
                    <Typography variant="body2">Stars</Typography>
                  </div>
                  <div className="border-primary border p-6 text-center">
                    <Typography variant="h2" className="mb-2">
                      {repoData.forks_count}
                    </Typography>
                    <Typography variant="body2">Forks</Typography>
                  </div>
                </div>

                <div className="mt-8">
                  <a href={repoData.html_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outlined">View on GitHub</Button>
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
                    <Typography variant="body2">Language</Typography>
                    <Typography variant="body2" className="font-medium">
                      {repoData.language || 'N/A'}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Open Issues</Typography>
                    <Typography variant="body2" className="font-medium">
                      {repoData.open_issues_count}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="body2">Last Updated</Typography>
                    <Typography variant="body2" className="font-medium">
                      {formatDate(repoData.updated_at)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main Content Area for Timeline */}
        <div className="border-primary border">
          <div className="border-primary border-b px-8 py-6">
            <Typography variant="h2">{t('pullRequestTimeline')}</Typography>
          </div>
          <div ref={timelineContainerRef} className="overflow-x-auto py-8">
            {' '}
            {/* Added padding for the timeline content */}
            {pullRequestsError && (
              <Typography variant="body2" className="text-center text-red-500">
                {t('errorLoadingPullRequests', { error: pullRequestsError.message })}
              </Typography>
            )}
            {pullRequestsLoading && (
              <Typography variant="body2" className="flex justify-center py-10">
                {' '}
                {/* Added py-10 for better spacing */}
                {t('loadingPullRequests')}
              </Typography>
            )}
            {!pullRequestsLoading && !pullRequestsError && pullRequests.length > 0 && (
              <div className="w-fit px-8">
                <div>
                  <div
                    className="grid auto-cols-max grid-flow-col"
                    style={{
                      gridTemplateRows: 'auto 3rem 1fr 3rem auto', // Added padding rows
                      gridAutoFlow: 'column',
                    }}
                  >
                    {pullRequests
                      .map((pr) => ({ ...pr, contributors: filterHumanContrib(pr.contributors) }))
                      .filter((pr) => !!pr.contributors.length)
                      .map((pr, index) => {
                        const isEven = index % 2 === 0
                        // Use pr.url for the key, as it provides a globally unique identifier for each pull request.
                        // This directly addresses the "Encountered two children with the same key" error.
                        const itemKey = `pr-item-${pr.url}`

                        return (
                          // Use a wrapper div to group the three parts of a single PR item.
                          // This wrapper gets the unique key.
                          <div key={itemKey} style={{ display: 'contents' }}>
                            {/* Card */}
                            <div
                              className="flex w-64"
                              style={{
                                gridRowStart: isEven ? '1' : '5',
                                gridColumnStart: index * 2 + 1,
                                alignItems: isEven ? 'self-end' : 'self-start',
                              }}
                            >
                              <a
                                href={pr.url ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-primary bg-background block rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
                              >
                                <Typography
                                  variant="body1" // Changed from h3 to body1 for smaller text
                                  className="!text-sm leading-tight font-semibold" // Adjusted text size
                                >
                                  #{pr.number} {pr.title}
                                </Typography>
                                {/* Contributors Avatars */}
                                <div className="mt-3 flex items-center">
                                  <div className="flex -space-x-2">
                                    {pr.contributors.slice(0, 10).map((contributor) => (
                                      <Image
                                        key={contributor.login}
                                        src={`https://github.com/${contributor.login}.png`}
                                        width={32}
                                        height={32}
                                        alt={contributor.login}
                                        title={`${contributor.login}`}
                                        className="border-background rounded-full border-2" // Increased avatar size
                                      />
                                    ))}
                                  </div>
                                  {pr.contributors.length > 10 && (
                                    <Typography variant="body2" className="ml-2 text-xs">
                                      +{pr.contributors.length - 10}
                                    </Typography>
                                  )}
                                </div>
                              </a>
                            </div>
                            {/* Date */}
                            <div
                              className="flex justify-self-center py-1 text-sm"
                              style={{
                                gridRowStart: isEven ? '2' : '4',
                                gridColumnStart: index * 2 + 1,
                                alignItems: isEven ? 'self-end' : 'self-start',
                              }}
                            >
                              <Typography
                                variant="body2"
                                className="text-gray-600 dark:text-gray-400"
                              >
                                {formatDate(pr.mergedAt || pr.createdAt)}
                              </Typography>
                            </div>
                            {/* Dot */}
                            <div
                              className="relative flex items-center justify-center self-center"
                              style={{
                                gridRowStart: '3',
                                gridColumnStart: index * 2 + 1,
                              }}
                            >
                              <div
                                className="absolute top-1/2 right-0 left-0 z-0 h-0.5 bg-gray-300 dark:bg-gray-700"
                                style={{ transform: 'translateY(-50%)' }}
                              ></div>
                              <div className="border-primary bg-background z-10 h-6 w-6 rounded-full border-4"></div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            )}
            {!pullRequestsLoading && !pullRequestsError && pullRequests.length === 0 && (
              <Typography variant="body2" className="text-center">
                {t('noPullRequests')}
              </Typography>
            )}
          </div>{' '}
          {/* End of p-8 padding div */}
        </div>{' '}
        {/* End of border-primary border div for timeline */}
      </div>
    </div>
  )
}
