import { logger } from '@/lib/logger'
import pLimit from 'p-limit'
import { LRUCache } from 'lru-cache'
import { createHash } from 'crypto'
import { DEFAULT_GITHUB_HTTP_TTL_SEC } from './constants'

export type GitHubAuth = { token?: string | null }

export const getAuth = (): GitHubAuth => {
  return { token: process.env.GITHUB_TOKEN || null }
}

export const GITHUB_API_BASE = 'https://api.github.com'
export const GITHUB_WEB_BASE = 'https://github.com'
export const GITHUB_PER_PAGE = 100
export const DEFAULT_CONCURRENCY = Number(process.env.GITHUB_CONCURRENCY || '4')
export const DEFAULT_PAGINATE_LIMIT = 1000
export const DEFAULT_RETRIES = 2
export const RETRY_WAIT_RATELIMIT_MS = 60_000
export const RETRY_WAIT_DEFAULT_MS = 3_000
export const DEFAULT_WINDOW_DAYS = 365
export const GITHUB_ACCEPT_JSON = 'application/vnd.github+json'
export const GITHUB_ACCEPT_PREVIEW =
  'application/vnd.github.cloak-preview+json, application/vnd.github+json'

const baseHeaders = { Accept: GITHUB_ACCEPT_PREVIEW, 'X-GitHub-Api-Version': '2022-11-28' }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const makeLimiter = (concurrency = 3) => pLimit(concurrency)

// Simple in-memory cache for GraphQL responses
const enableCache = (process.env.GITHUB_CACHE_ENABLED ?? 'true') !== 'false'
const gqlCacheTtlMs = Number(process.env.GITHUB_GQL_CACHE_TTL_MS || String(60 * 1000))
const gqlCache = new LRUCache<string, any>({ max: 500, ttl: gqlCacheTtlMs })

// ETag-aware HTTP cache for cross-process caching
let etagGet: (k: string) => Promise<string | null> | undefined
let etagSet: (k: string, v: string, ttlSec: number) => Promise<void> | undefined
let bodyGet: (k: string) => Promise<string | null> | undefined
let bodySet: (k: string, v: string, ttlSec: number) => Promise<void> | undefined

async function initStore() {
  if (
    etagGet !== undefined &&
    etagSet !== undefined &&
    bodyGet !== undefined &&
    bodySet !== undefined
  )
    return

  const CACHE_PROVIDER = process.env.CACHE_PROVIDER || 'redis'

  if (CACHE_PROVIDER === 'upstash') {
    try {
      const { Redis } = await import('@upstash/redis')
      const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
      const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

      if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
        throw new Error(
          'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required when CACHE_PROVIDER is upstash'
        )
      }

      const upstashRedis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      })

      etagGet = async (k) => await upstashRedis.get(k)
      etagSet = async (k, v, ttl) => {
        await upstashRedis.set(k, v, { ex: ttl })
      }
      bodyGet = async (k) => await upstashRedis.get(k)
      bodySet = async (k, v, ttl) => {
        await upstashRedis.set(k, v, { ex: ttl })
      }
    } catch {
      // Fallback to in-memory if @upstash/redis not available
      etagGet = async () => null
      etagSet = async () => {}
      bodyGet = async () => null
      bodySet = async () => {}
    }
  } else {
    try {
      const { createClient } = await import('redis')
      const REDIS_URL = process.env.REDIS_URL
      if (!REDIS_URL) {
        throw new Error('REDIS_URL is required when CACHE_PROVIDER is not upstash')
      }

      const r = createClient({ url: REDIS_URL })
      await r.connect()

      r.on('error', (err) => logger.error({ err }, 'Redis Client Error'))

      etagGet = async (k) => await r.get(k)
      etagSet = async (k, v, ttl) => {
        await r.set(k, v, { EX: ttl })
      }
      bodyGet = async (k) => await r.get(k)
      bodySet = async (k, v, ttl) => {
        await r.set(k, v, { EX: ttl })
      }
    } catch {
      // Fallback to in-memory if redis not available
      etagGet = async () => null
      etagSet = async () => {}
      bodyGet = async () => null
      bodySet = async () => {}
    }
  }
}

const HTTP_TTL_SEC = Number(process.env.GITHUB_HTTP_TTL_SEC || DEFAULT_GITHUB_HTTP_TTL_SEC)

export async function ghFetch(
  url: string,
  auth: GitHubAuth,
  init: RequestInit = {},
  retries = DEFAULT_RETRIES
): Promise<Response> {
  await initStore()

  const headers: Record<string, string> = { ...baseHeaders, ...(init.headers as any) }
  if (auth.token) headers['Authorization'] = `Bearer ${auth.token}`
  const method = (init.method || 'GET').toUpperCase()

  const cacheKeyId = `${method}:${url}:${headers['Accept'] || ''}:${headers['X-GitHub-Api-Version'] || ''}`
  const cacheKey = 'gh:http:' + createHash('sha1').update(cacheKeyId).digest('hex')
  const etagKey = cacheKey + ':etag'

  // Try ETag
  if (method === 'GET' && etagGet) {
    const etag = await etagGet(etagKey)
    if (etag) headers['If-None-Match'] = etag
  }

  const res = await fetch(url, { ...init, headers })

  if (res.status === 304 && method === 'GET' && bodyGet) {
    const cached = await bodyGet(cacheKey)
    if (cached) {
      // synthesize a Response from cache
      const clonedHeaders: Record<string, string> = {}
      for (const [k, v] of res.headers.entries()) clonedHeaders[k] = v
      return new Response(cached, { status: 200, headers: clonedHeaders })
    }
  }

  if (res.status === 403 && retries > 0) {
    const ra = res.headers.get('retry-after')
    const rl = Number(res.headers.get('x-ratelimit-remaining') || '1')
    const wait = ra ? Number(ra) * 1000 : rl === 0 ? RETRY_WAIT_RATELIMIT_MS : RETRY_WAIT_DEFAULT_MS
    await sleep(wait)
    return ghFetch(url, auth, init, retries - 1)
  }

  if (method === 'GET') {
    const clonedHeaders: Record<string, string> = {}
    for (const [k, v] of res.headers.entries()) clonedHeaders[k] = v
    const body = await res.text()
    if (res.ok) {
      const etag = res.headers.get('etag')
      if (etag && etagSet) await etagSet(etagKey, etag, HTTP_TTL_SEC)
      if (bodySet) await bodySet(cacheKey, body, HTTP_TTL_SEC)
    }
    return new Response(body, { status: res.status, headers: clonedHeaders })
  }
  return res
}

export function parseLinkHeader(link: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!link) return out
  for (const part of link.split(',')) {
    const m = part.match(/<([^>]+)>;\s*rel="([^"]+)"/)
    if (m) out[m[2]] = m[1]
  }
  return out
}

export async function paginate<T = any>(
  url: string,
  auth: GitHubAuth,
  limit = DEFAULT_PAGINATE_LIMIT
): Promise<T[]> {
  let next: string | null = url,
    all: T[] = []
  while (next && all.length < limit) {
    const res = await ghFetch(next, auth)
    if (!res.ok) {
      let body = ''
      try {
        body = await res.clone().text()
      } catch {}
      throw new Error(`GitHub error ${res.status}${body ? `: ${body}` : ''}`)
    }
    const linkHeader = res.headers.get('link')
    const page = (await res.json()) as T[]
    all = all.concat(page)
    const links = parseLinkHeader(linkHeader)
    next = links.next || null
  }
  return all
}

export async function graphql<T = any>(
  query: string,
  variables: Record<string, any>,
  auth: GitHubAuth,
  retries = DEFAULT_RETRIES
): Promise<T> {
  const cacheKey = enableCache ? `gql:${JSON.stringify({ query, variables })}` : ''
  if (enableCache) {
    const hit = gqlCache.get(cacheKey)
    if (hit !== undefined) return hit as T
  }
  const res = await ghFetch(
    `${GITHUB_API_BASE}/graphql`,
    auth,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    },
    retries
  )
  if (!res.ok) {
    let body = ''
    try {
      body = await res.clone().text()
    } catch {}
    throw new Error(`GitHub GraphQL error ${res.status}${body ? `: ${body}` : ''}`)
  }
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  if (enableCache) gqlCache.set(cacheKey, json.data)
  return json.data as T
}

export const iso = (d?: string | null) => (d ? new Date(d).toISOString() : undefined)

export const defaultWindow = () => {
  const until = new Date()
  const since = new Date(until.getTime() - DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  return { since: since.toISOString(), until: until.toISOString() }
}

export const uniqBy = <T>(arr: T[], keyFn: (t: T) => string) => {
  const seen = new Set<string>()
  const out: T[] = []
  for (const it of arr) {
    const k = keyFn(it)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(it)
  }
  return out
}

export const clampWindow = (since?: string | null, until?: string | null) => {
  const w = defaultWindow()
  return { since: iso(since) || w.since, until: iso(until) || w.until }
}

export const prQuery = `
query RepoPRs($owner:String!,$name:String!,$after:String){
  repository(owner:$owner,name:$name){
    nameWithOwner url
    pullRequests(states:[OPEN,MERGED,CLOSED], first:100, orderBy:{field:CREATED_AT,direction:DESC}, after:$after){
      nodes{ number createdAt url author{ login __typename }
        repository{ nameWithOwner url }
      }
      pageInfo{ hasNextPage endCursor }
    }
  }
}`

export function parsePrUrl(url: string): { owner: string; repo: string; number: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  return m ? { owner: m[1], repo: m[2], number: m[3] } : null
}

export function parseCommitUrlToRepo(url: string): string | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/commit\//)
  return m ? `${m[1]}/${m[2]}` : null
}

export function isBotAccount(login: string): boolean {
  const botPatterns = [
    /^.*\[bot\]$/i, // ends with '[bot]'
    /^dependabot.*$/i, // dependabot variations
    /^renovate.*$/i, // renovate variations
    /^greenkeeper.*$/i, // greenkeeper variations
    /^snyk.*$/i, // snyk variations
    /^github-actions.*$/i, // github actions bot
  ]

  return botPatterns.some((pattern) => pattern.test(login))
}
