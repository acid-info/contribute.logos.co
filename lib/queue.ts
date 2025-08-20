export type RefreshJob = {
  orgs: string[]
  since?: string
  until?: string
  maxPrPages?: number
  maxReviewFetches?: number
  onlyExcludeOrgs?: string[]
}

export async function enqueueRefresh(job: RefreshJob) {
  console.log('enqueueRefresh debug:', {
    jobData: job,
    redisUrl: process.env.REDIS_URL ? 'configured' : 'not configured',
    cacheProvider: process.env.CACHE_PROVIDER,
  })

  const { Queue } = await import('bullmq')

  const REDIS_URL = process.env.REDIS_URL

  const queue = new Queue<RefreshJob>('gh-refresh', { connection: { url: REDIS_URL } })
  await queue.add('refresh', job, { removeOnComplete: true, removeOnFail: 100 })
}
