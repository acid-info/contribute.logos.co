import { loadEnvConfig } from '@next/env'
import { Worker } from 'bullmq'
import { collectContributors } from '@/lib/collectContributors'
import { setSnapshot, keyOf } from '@/lib/cache'

type JobData = import('@/lib/queue').RefreshJob

async function startWorker() {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
  const REDIS_URL = process.env.REDIS_URL

  console.log('Starting GitHub refresh worker...')

  if (!REDIS_URL) {
    console.error('REDIS_URL is not configured. Worker cannot start.')
    process.exit(1)
  }

  const worker = new Worker<JobData>(
    'gh-refresh',
    async (job) => {
      const startTime = Date.now()
      console.log(`Processing job ${job.id}...`)
      console.log(`Job data:`, JSON.stringify(job.data, null, 2))

      try {
        const { data } = job
        const { orgs, ...rest } = data

        console.log(`Organizations to process:`, orgs)
        console.log(`Additional params:`, rest)

        console.log(`Collecting contributors...`)
        const { people, meta } = await collectContributors({
          orgs,
          ...rest,
          githubToken: process.env.GITHUB_TOKEN,
        })

        console.log(`Collected ${people.length} contributors`)
        console.log(`Meta data:`, meta)

        const params = { orgs, ...rest }
        const base = keyOf(params)
        console.log(`Cache key:`, base)

        console.log(`Saving to cache...`)
        await setSnapshot(base, { people, meta })

        const duration = Date.now() - startTime
        console.log(`Job ${job.id} completed successfully in ${duration}ms`)

        return { peopleCount: people.length, meta, duration }
      } catch (error) {
        const duration = Date.now() - startTime
        console.error(`Job ${job.id} failed after ${duration}ms:`, error)
        throw error
      }
    },
    {
      connection: { url: REDIS_URL },
      concurrency: 1,
    }
  )

  console.log('Worker initialized successfully')
  console.log('Listening for jobs on queue: gh-refresh')

  worker.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result)
  })

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err)
    console.error(`Failed job data:`, job?.data)
  })

  worker.on('error', (err) => {
    console.error(`Worker error:`, err)
  })

  worker.on('stalled', (jobId) => {
    console.warn(`Job ${jobId} stalled`)
  })

  worker.on('active', (job) => {
    console.log(`Job ${job.id} started processing`)
  })

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...')
    await worker.close()
    console.log('Worker shut down successfully')
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...')
    await worker.close()
    console.log('Worker shut down successfully')
    process.exit(0)
  })
}

console.log('Initializing worker...')
startWorker().catch((error) => {
  console.error('Failed to start worker:', error)
  process.exit(1)
})
