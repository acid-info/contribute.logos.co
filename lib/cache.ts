import { logger } from '@/lib/logger'
import { createHash } from 'crypto'
import { DEFAULT_SOFT_TTL_MS, DEFAULT_HARD_TTL_MS } from './constants'

type Snapshot = { people: any[]; meta: any }
type Status = { lastUpdated: number; softTtlMs: number; hardTtlMs: number; version: string }

export const keyOf = (params: Record<string, any>) => {
  const normalizedParams = { ...params }

  if (normalizedParams.since) {
    const sinceDate = new Date(normalizedParams.since)
    // Round down to start of day (midnight UTC)
    const roundedSince = new Date(
      Date.UTC(sinceDate.getUTCFullYear(), sinceDate.getUTCMonth(), sinceDate.getUTCDate())
    )
    normalizedParams.since = roundedSince.toISOString()
  }

  if (normalizedParams.until) {
    const untilDate = new Date(normalizedParams.until)
    // Round down to start of day (midnight UTC)
    const roundedUntil = new Date(
      Date.UTC(untilDate.getUTCFullYear(), untilDate.getUTCMonth(), untilDate.getUTCDate())
    )
    normalizedParams.until = roundedUntil.toISOString()
  }

  const norm = JSON.stringify(normalizedParams, Object.keys(normalizedParams).sort())
  const SNAPSHOT_VERSION = process.env.SNAPSHOT_VERSION || 'v2'
  const key = 'gh:agg:' + SNAPSHOT_VERSION + ':' + createHash('sha1').update(norm).digest('hex')

  logger.debug(
    {
      snapshotVersion: SNAPSHOT_VERSION,
      generatedKey: key,
      params: Object.keys(params),
      originalSince: params.since,
      normalizedSince: normalizedParams.since,
      originalUntil: params.until,
      normalizedUntil: normalizedParams.until,
    },
    'keyOf debug'
  )

  return key
}

let kvGet: (k: string) => Promise<any | null>
let kvSet: (k: string, v: any, ttlSec?: number) => Promise<void>
let kvMGet: (keys: string[]) => Promise<(any | null)[]>
let redisClient: any = null

async function initCache() {
  if (kvGet !== undefined && kvSet !== undefined && kvMGet !== undefined) return

  let CACHE_PROVIDER = process.env.CACHE_PROVIDER || 'redis'

  logger.info({ provider: CACHE_PROVIDER }, 'initCache: using provider')

  if (CACHE_PROVIDER === 'upstash') {
    const { Redis } = await import('@upstash/redis')
    const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
    const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required when CACHE_PROVIDER is upstash'
      )
    }

    logger.info('Connecting to Upstash Redis')
    const upstashRedis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    })

    kvGet = async (k) => upstashRedis.get(k)
    kvSet = async (k, v, ttlSec) => {
      if (ttlSec) {
        await upstashRedis.set(k, v, { ex: ttlSec })
      } else {
        await upstashRedis.set(k, v)
      }
    }
    kvMGet = async (keys) => upstashRedis.mget(keys)
  } else {
    const { createClient } = await import('redis')
    const REDIS_URL = process.env.REDIS_URL
    if (!REDIS_URL) {
      throw new Error('REDIS_URL is required when CACHE_PROVIDER is not upstash')
    }

    logger.info('Connecting to Redis')
    redisClient = createClient({ url: REDIS_URL })
    await redisClient.connect()

    redisClient.on('error', (err: any) => logger.error({ err }, 'Redis Client Error'))
    redisClient.on('connect', () => logger.info('Redis Client Connected'))
    redisClient.on('ready', () => logger.info('Redis Client Ready'))

    kvGet = async (k) => {
      logger.debug({ key: k }, 'Redis GET')
      const s = await redisClient.get(k)
      logger.debug({ result: s ? 'found' : 'null' }, 'Redis GET result')
      return s ? JSON.parse(s) : null
    }
    kvSet = async (k, v, ttlSec) => {
      const s = JSON.stringify(v)
      if (ttlSec) {
        await redisClient.set(k, s, { EX: ttlSec })
      } else {
        await redisClient.set(k, s)
      }
    }
    kvMGet = async (keys) => {
      const arr = await redisClient.mGet(keys)
      return arr.map((s) => (s ? JSON.parse(s) : null))
    }
  }
}

export async function getSnapshot(params: Record<string, any>) {
  await initCache()

  const base = keyOf(params)
  const payloadKey = base + ':payload'
  const statusKey = base + ':status'

  logger.debug(
    {
      base,
      payloadKey,
      statusKey,
      cacheProvider: process.env.CACHE_PROVIDER,
    },
    'getSnapshot debug'
  )

  const [payload, status] = await kvMGet([payloadKey, statusKey])

  logger.debug(
    {
      payloadFound: !!payload,
      statusFound: !!status,
      payloadKeys: payload ? Object.keys(payload) : null,
    },
    'getSnapshot result'
  )

  return { base, payload: payload as Snapshot | null, status: status as Status | null }
}

export async function setSnapshot(base: string, snap: Snapshot) {
  await initCache()
  const now = Date.now()
  const SOFT_TTL_MS = Number(process.env.SOFT_TTL_MS || DEFAULT_SOFT_TTL_MS)
  const HARD_TTL_MS = Number(process.env.HARD_TTL_MS || DEFAULT_HARD_TTL_MS)
  const SNAPSHOT_VERSION = process.env.SNAPSHOT_VERSION || 'v2'

  const status: Status = {
    lastUpdated: now,
    softTtlMs: SOFT_TTL_MS,
    hardTtlMs: HARD_TTL_MS,
    version: SNAPSHOT_VERSION,
  }

  const payloadKey = base + ':payload'
  const statusKey = base + ':status'

  logger.debug(
    {
      base,
      payloadKey,
      statusKey,
      cacheProvider: process.env.CACHE_PROVIDER,
      snapshotVersion: SNAPSHOT_VERSION,
      peopleCount: snap.people?.length || 0,
    },
    'setSnapshot debug'
  )

  await kvSet(payloadKey, snap, Math.ceil(HARD_TTL_MS / 1000))
  await kvSet(statusKey, status, Math.ceil(HARD_TTL_MS / 1000))
}
