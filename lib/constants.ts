// TTL Defaults (in milliseconds)
export const DEFAULT_SOFT_TTL_MS = 4 * 60 * 60 * 1000 // 4 hours
export const DEFAULT_HARD_TTL_MS = 25 * 60 * 60 * 1000 // 25 hours
export const DEFAULT_GITHUB_HTTP_TTL_SEC = 5 * 60 // 5 minutes

// TTLs
export const SOFT_TTL_MS = Number(process.env.SOFT_TTL_MS || DEFAULT_SOFT_TTL_MS)
export const HARD_TTL_MS = Number(process.env.HARD_TTL_MS || DEFAULT_HARD_TTL_MS)

// Collection defaults
export const DEFAULT_MAX_PR_PAGES = Number(process.env.DEFAULT_MAX_PR_PAGES || '20')
export const DEFAULT_MAX_REVIEW_FETCHES = Number(process.env.DEFAULT_MAX_REVIEW_FETCHES || '200')

// Edge caching (seconds)
export const EDGE_S_MAXAGE_SEC = Number(process.env.EDGE_S_MAXAGE_SEC || '300')
export const EDGE_STALE_WHILE_REVALIDATE_SEC = Number(
  process.env.EDGE_STALE_WHILE_REVALIDATE_SEC || '86400'
)
