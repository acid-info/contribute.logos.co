import { type LeaderboardEntry, type TierType } from '@/components/leaderboard/leaderboard-table'

export const calculateTier = (score: number, contributions: number): TierType => {
  // Council tier (highest tier - special appointment/election)
  if (score >= 15000 && contributions >= 100) return 'Council'

  // Governor tier (high impact contributors)
  if (score >= 8000 && contributions >= 50) return 'Governor'

  // Champion tier (area reviewers/content leads)
  if (score >= 3000 && contributions >= 25) return 'Champion'

  // Builder tier (50+ points and 3+ contributions)
  if (score >= 50 && contributions >= 3) return 'Builder'

  // Explorer tier (first accepted contribution)
  return 'Explorer'
}

export const generateMockData = (type: 'seasonal' | 'historical'): LeaderboardEntry[] => {
  const users = [
    'alice',
    'bob',
    'charlie',
    'diana',
    'eve',
    'frank',
    'grace',
    'henry',
    'iris',
    'jack',
    'kate',
    'liam',
    'maya',
    'noah',
    'olivia',
    'paul',
    'quinn',
    'ruby',
    'sam',
    'tina',
    'victor',
    'wendy',
    'xander',
    'yuki',
    'zoe',
  ]

  return users
    .map((username, index) => {
      const baseScore =
        type === 'historical' ? 5000 + Math.random() * 15000 : 1000 + Math.random() * 4000
      const multiplier = Math.max(0.1, 1 - index * 0.05)

      const score = Math.floor(baseScore * multiplier)
      const contributions = Math.floor((50 + Math.random() * 200) * multiplier)

      const entry: LeaderboardEntry = {
        rank: index + 1,
        username,
        score,
        contributions,
        repositories: Math.floor((3 + Math.random() * 12) * multiplier),
        avatarUrl: `https://github.com/${username}.png`,
      }

      // Only add tier for historical data
      if (type === 'historical') {
        entry.tier = calculateTier(score, contributions)
      }

      return entry
    })
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))
}
