import { enqueueRefresh } from './queue'
import type { CollectParams } from './collectContributors'
import { clampWindow } from './github'
import { ORGS, ONLY_EXCLUDE_ORGS } from '@/constants/orgs'

export type CronConfig = {
  schedule?: string
  params: CollectParams
}

export async function triggerRefresh(config: CronConfig) {
  await enqueueRefresh(config.params)

  return {
    ok: true,
    message: `Enqueued refresh for ${config.params.orgs.join(', ')}`,
    timestamp: new Date().toISOString(),
    params: config.params,
  }
}

export const DEFAULT_CRON_CONFIG: CronConfig = {
  schedule: '0 0 * * *', // every 24 hours
  params: {
    orgs: [...ORGS],
    ...clampWindow(),
    maxPrPages: 20,
    maxReviewFetches: 200,
    onlyExcludeOrgs: [...ONLY_EXCLUDE_ORGS],
  },
}
