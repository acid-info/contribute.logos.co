import { NextRequest } from 'next/server'
import { getSnapshot } from '@/lib/cache'
import { enqueueRefresh } from '@/lib/queue'
import { logger } from '@/lib/logger'
import {
  SOFT_TTL_MS,
  HARD_TTL_MS,
  EDGE_S_MAXAGE_SEC,
  EDGE_STALE_WHILE_REVALIDATE_SEC,
  DEFAULT_MAX_PR_PAGES,
  DEFAULT_MAX_REVIEW_FETCHES,
} from '@/lib/constants'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orgs = (searchParams.get('orgs') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (orgs.length === 0) return Response.json({ error: 'orgs required' }, { status: 400 })

  const params = {
    orgs,
    since: searchParams.get('since') || undefined,
    until: searchParams.get('until') || undefined,
    maxPrPages: Number(searchParams.get('maxPrPages') || String(DEFAULT_MAX_PR_PAGES)),
    maxReviewFetches: Number(
      searchParams.get('maxReviewFetches') || String(DEFAULT_MAX_REVIEW_FETCHES)
    ),
    onlyExcludeOrgs: (searchParams.get('onlyExcludeOrgs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }

  const { base, payload, status } = await getSnapshot(params)

  logger.debug(
    {
      base,
      payload,
      status,
      statusLastUpdated: status?.lastUpdated,
      cacheProvider: process.env.CACHE_PROVIDER,
      snapshotVersion: process.env.SNAPSHOT_VERSION,
      redisUrl: process.env.REDIS_URL ? 'configured' : 'not configured',
      upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN ? 'configured' : 'not configured',
    },
    'Cache debug'
  )

  const now = Date.now()
  const isStale = !status || now - status.lastUpdated > SOFT_TTL_MS
  const hardExpired = !status || now - status.lastUpdated > (status.hardTtlMs || HARD_TTL_MS)

  if (isStale) {
    enqueueRefresh(params).catch((err) => logger.error({ err }, 'enqueueRefresh failed'))
  }

  if (payload && !hardExpired) {
    const headers = new Headers()
    headers.set('x-data-stale', String(isStale))
    headers.set('x-cache-key', base)
    headers.set(
      'cache-control',
      `s-maxage=${EDGE_S_MAXAGE_SEC}, stale-while-revalidate=${EDGE_STALE_WHILE_REVALIDATE_SEC}`
    )
    headers.set('x-meta', JSON.stringify(payload.meta))
    return new Response(JSON.stringify(payload.people), { headers })
  }

  enqueueRefresh(params).catch((err) => logger.error({ err }, 'enqueueRefresh failed'))
  return Response.json([], {
    headers: {
      'x-data-stale': 'true',
      'x-cache-key': base,
      'cache-control': 'no-store',
      'x-meta': JSON.stringify({ ...params, cold: true }),
    },
  })
}
