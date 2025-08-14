'use client'

import { useTranslations } from 'next-intl'
import { Button, Typography } from '@acid-info/lsd-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/constants/routes'
import { useEffect, useMemo, useState } from 'react'
import { ORGS_PARAM, ONLY_EXCLUDE_ORGS_PARAM } from '@/constants/orgs'

interface ContributorDetailsContainerProps {
  username: string
}

type ApiItemType = 'PR' | 'REVIEW' | 'COMMIT'
type ApiItem = { date: string; repo: string; repoUrl: string; type: ApiItemType; link: string }

export default function ContributorDetailsContainer({
  username,
}: ContributorDetailsContainerProps) {
  const t = useTranslations('contributor')
  const [items, setItems] = useState<ApiItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const until = new Date()
        const since = new Date()
        since.setFullYear(until.getFullYear() - 1)
        const qs = new URLSearchParams({
          orgs: ORGS_PARAM,
          onlyExcludeOrgs: ONLY_EXCLUDE_ORGS_PARAM,
          since: since.toISOString(),
          until: until.toISOString(),
        })
        const res = await fetch(
          `/api/contributors/${encodeURIComponent(username)}?${qs.toString()}`
        )
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const json = (await res.json()) as {
          login: string
          total: number
          items: ApiItem[]
          nextCursor?: string
        }
        setItems(json.items || [])
        setTotal(json.total || 0)
      } catch (e: any) {
        setError(e?.message || 'Failed to load contributions')
        setItems([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [username])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getContributionLabel = (type: ApiItemType) =>
    type === 'COMMIT'
      ? 'Commit'
      : type === 'PR'
        ? 'Pull Request'
        : type === 'REVIEW'
          ? 'Review'
          : 'Contribution'

  const avatarUrl = useMemo(() => `https://github.com/${username}.png`, [username])
  const profileUrl = useMemo(() => `https://github.com/${username}`, [username])
  const latest = items[0]

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
                  src={avatarUrl}
                  alt={`${username} avatar`}
                  className="h-24 w-24 rounded-full"
                />
                <div>
                  <Typography variant="h1" className="mb-2">
                    {username}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600">
                    {total} {t('contributionsToEcosystem')}
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="border-primary border p-6 text-center">
                  <Typography variant="h2" className="mb-2">
                    {total}
                  </Typography>
                  <Typography variant="body2">{t('totalContributions')}</Typography>
                </div>
                <div className="border-primary border p-6 text-center">
                  <Typography variant="h2" className="mb-2">
                    {latest?.repo || '-'}
                  </Typography>
                  <Typography variant="body2">{t('latestRepository')}</Typography>
                </div>
                <div className="border-primary border p-6 text-center">
                  <Typography variant="h2" className="mb-2">
                    {latest ? formatDate(latest.date) : '-'}
                  </Typography>
                  <Typography variant="body2">{t('latestContribution')}</Typography>
                </div>
              </div>

              <div className="mt-8">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
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
                    {total}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Latest Repository</Typography>
                  <Typography variant="body2" className="font-medium">
                    {latest?.repo || '-'}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="body2">Last Contribution</Typography>
                  <Typography variant="body2" className="font-medium">
                    {latest ? formatDate(latest.date) : '-'}
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
            {loading && (
              <div className="p-8">
                <Typography variant="body2">Loading…</Typography>
              </div>
            )}
            {!loading && error && (
              <div className="p-8">
                <Typography variant="body2">{error}</Typography>
              </div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="p-8">
                <Typography variant="body2">No contributions in the last year.</Typography>
              </div>
            )}
            {!loading &&
              !error &&
              items.map((it) => (
                <div key={it.link} className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="border-primary flex h-12 items-center justify-center border px-4">
                      <Typography variant="body2" className="font-medium">
                        {getContributionLabel(it.type)}
                      </Typography>
                    </div>
                    <div className="flex-1">
                      <Typography variant="body1" className="mb-2 font-medium">
                        {it.repo}
                      </Typography>
                      <div className="flex flex-wrap items-center gap-4">
                        <Typography variant="body2" className="text-gray-600">
                          {it.repo}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {formatDate(it.date)}
                        </Typography>
                      </div>
                    </div>
                    <a href={it.link} target="_blank" rel="noopener noreferrer">
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
