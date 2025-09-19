'use client'

import { Button, TabItem, Tabs, Typography } from '@acid-info/lsd-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { ROUTES } from '@/constants/routes'
import { useOrgProjects } from '@/hooks/useOrgProjects'
import { useOrgs } from '@/hooks/useOrgs'

export default function ProjectsContainer() {
  const t = useTranslations('projects')
  const locale = useLocale()
  const router = useRouter()
  const [activeOrg, setActiveOrg] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const { data: repos = [], isLoading: reposLoading, error: reposError } = useOrgProjects(activeOrg)
  const { data: orgs = [], isLoading: orgsLoading, error: orgsError } = useOrgs()

  const totalPages = useMemo(() => Math.ceil(repos.length / itemsPerPage), [repos])
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRepositories = useMemo(
    () => repos.slice(startIndex, endIndex),
    [repos, startIndex, endIndex]
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    if (orgs.length > 0) {
      setActiveOrg(orgs[0])
    }
  }, [orgs])

  useEffect(() => {
    if (repos.length > 0) {
      console.log(repos)
    }
  }, [repos])

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-20 text-center sm:px-6 xl:px-0">
        <Typography variant="h1" className="mb-12 !text-3xl lg:!text-4xl">
          {t('title')}
        </Typography>
        <Typography variant="subtitle1" className="mb-6 text-base sm:text-lg">
          {t('subtitle')}
        </Typography>

        <div className="mx-auto max-w-4xl">
          <Tabs activeTab={activeOrg} onChange={(value) => setActiveOrg(value)}>
            {orgs.map((org) => (
              <TabItem key={org} name={org} value={org}>
                {org}
              </TabItem>
            ))}
          </Tabs>
        </div>

        {activeOrg && (
          <div className="border-primary border">
            <Typography
              variant="h3"
              className="border-primary border-b px-4 py-4 !text-lg sm:px-6 sm:!text-xl"
            >
              {activeOrg} Projects
            </Typography>
            <div className="p-4 sm:p-6">
              {reposLoading ? (
                <Typography variant="body2" className="p-8 text-center">
                  {t('loading')}
                </Typography>
              ) : repos.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {currentRepositories.map((repo) => (
                    <Button
                      key={repo.id}
                      variant="outlined"
                      className="h-auto p-4 text-left"
                      onClick={() =>
                        router.push(`/${locale}${ROUTES.projects}/${activeOrg}/${repo.name}`)
                      }
                    >
                      <div className="flex flex-col space-y-2">
                        <Typography variant="h4" className="!text-base font-medium">
                          {repo.name}
                        </Typography>
                        {repo.description && (
                          <Typography
                            variant="body2"
                            className="line-clamp-2 text-sm text-gray-600"
                          >
                            {repo.description}
                          </Typography>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {repo.language && <span>{repo.language}</span>}
                          <span>⭐ {repo.stargazers_count}</span>
                          <span>🍴 {repo.forks_count}</span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <Typography variant="body2" className="p-4 text-center sm:p-6">
                  No repositories found for {activeOrg}.
                </Typography>
              )}

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-3 space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:px-6">
                  <Typography variant="body2" className="text-center sm:text-left">
                    Showing {startIndex + 1}-{Math.min(endIndex, repos.length)} of {repos.length}{' '}
                    repositories
                  </Typography>
                  <div className="flex flex-row space-y-2 space-x-2 sm:space-y-0">
                    <Button
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="!h-10"
                    >
                      Previous
                    </Button>
                    <div className="flex justify-center space-x-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1
                        const isCurrentPage = page === currentPage
                        const isNearCurrent = Math.abs(page - currentPage) <= 2
                        const isFirstOrLast = page === 1 || page === totalPages

                        if (isFirstOrLast || isNearCurrent) {
                          return (
                            <Button
                              key={page}
                              variant={isCurrentPage ? 'filled' : 'outlined'}
                              onClick={() => handlePageChange(page)}
                              className="!h-10 !w-10 !p-0"
                            >
                              {page}
                            </Button>
                          )
                        } else if (page === currentPage - 3 || page === currentPage + 3) {
                          return (
                            <span key={page} className="px-2 py-2">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>
                    <Button
                      variant="outlined"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="!h-10"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
