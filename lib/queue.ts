import { logger } from '@/lib/logger'
export type RefreshJob = {
  orgs: string[]
  since?: string
  until?: string
  maxPrPages?: number
  maxReviewFetches?: number
  onlyExcludeOrgs?: string[]
}

export async function enqueueRefresh(job: RefreshJob) {
  logger.debug({ jobData: job }, 'enqueueRefresh debug')

  const { Queue } = await import('bullmq')

  const REDIS_URL = process.env.REDIS_URL

  const queue = new Queue<RefreshJob>('gh-refresh', { connection: { url: REDIS_URL } })
  await queue.add('refresh', job, { removeOnComplete: true, removeOnFail: 100 })
}
