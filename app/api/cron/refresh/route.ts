import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { triggerRefresh, DEFAULT_CRON_CONFIG } from '@/lib/cron'

function safeEq(a: string, b: string) {
  const A = Buffer.from(a)
  const B = Buffer.from(b)
  return A.length === B.length && crypto.timingSafeEqual(A, B)
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : ''

  const CRON_SECRET = process.env.CRON_SECRET

  if (!CRON_SECRET || !safeEq(provided, CRON_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const config = {
      ...DEFAULT_CRON_CONFIG,
      params: {
        ...DEFAULT_CRON_CONFIG.params,
        orgs: body.orgs?.split(',') || DEFAULT_CRON_CONFIG.params.orgs,
        since: body.since || DEFAULT_CRON_CONFIG.params.since,
        until: body.until || DEFAULT_CRON_CONFIG.params.until,
        maxPrPages: Number(body.maxPrPages) || DEFAULT_CRON_CONFIG.params.maxPrPages,
        maxReviewFetches:
          Number(body.maxReviewFetches) || DEFAULT_CRON_CONFIG.params.maxReviewFetches,
        onlyExcludeOrgs:
          body.onlyExcludeOrgs?.split(',') || DEFAULT_CRON_CONFIG.params.onlyExcludeOrgs,
        githubToken: body.githubToken || undefined,
      },
    }

    const result = await triggerRefresh(config)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
