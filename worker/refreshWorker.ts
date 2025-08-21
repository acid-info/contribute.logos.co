import { loadEnvConfig } from '@next/env'
import { Worker } from 'bullmq'
import { collectContributors } from '@/lib/collectContributors'
import { setSnapshot, keyOf } from '@/lib/cache'
import { logger } from '@/lib/logger'

type JobData = import('@/lib/queue').RefreshJob

async function startWorker() {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
  const REDIS_URL = process.env.REDIS_URL

  logger.info('Starting GitHub refresh worker...')

  if (!REDIS_URL) {
    logger.error('REDIS_URL is not configured. Worker cannot start.')
    process.exit(1)
  }

  const worker = new Worker<JobData>(
    'gh-refresh',
    async (job) => {
      const startTime = Date.now()
      logger.info({ jobId: job.id }, 'Processing job')
      logger.debug({ jobData: job.data }, 'Job data')

      try {
        const { data } = job
        const { orgs, ...rest } = data

        logger.info({ orgs }, 'Organizations to process')
        logger.debug({ params: rest }, 'Additional params')

        logger.debug('Collecting contributors...')
        const { people, meta } = await collectContributors({
          orgs,
          ...rest,
          githubToken: process.env.GITHUB_TOKEN,
        })

        logger.debug({ count: people.length }, 'Collected contributors')
        logger.debug({ meta }, 'Meta data')

        const params = { orgs, ...rest }
        const base = keyOf(params)
        logger.debug({ cacheKey: base }, 'Cache key')

        logger.debug('Saving to cache...')
        await setSnapshot(base, { people, meta })

        const duration = Date.now() - startTime
        return { peopleCount: people.length, meta, duration }
      } catch (error) {
        throw error
      }
    },
    {
      connection: { url: REDIS_URL },
      concurrency: 1,
    }
  )

  logger.info('Worker initialized successfully')
  logger.info('Listening for jobs on queue: gh-refresh')

  worker.on('completed', (job, result) => {
    logger.info({ jobId: job.id, result }, 'Job completed')
  })

  worker.on('failed', (job, err) => {
    logger.error({ err, jobId: job?.id }, 'Job failed')
    logger.error({ jobData: job?.data }, 'Failed job data')
  })

  worker.on('error', (err) => {
    logger.error({ err }, 'Worker error')
  })

  worker.on('stalled', (jobId) => {
    logger.warn({ jobId }, 'Job stalled')
  })

  worker.on('active', (job) => {
    logger.debug({ jobId: job.id }, 'Job started processing')
  })

  // Graceful shutdown handler
  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`)
    await worker.close()
    logger.info('Worker shut down successfully')
    process.exit(0)
  }

  process.on('SIGTERM', () => handleShutdown('SIGTERM'))
  process.on('SIGINT', () => handleShutdown('SIGINT'))
}

logger.info('Initializing worker...')
startWorker().catch((error) => {
  logger.error({ err: error }, 'Failed to start worker')
  process.exit(1)
})
