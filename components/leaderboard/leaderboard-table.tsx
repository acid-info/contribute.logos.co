import { Typography, Badge } from '@acid-info/lsd-react'

export interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  contributions: number
  repositories: number
  avatarUrl: string
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  rankLabel: string
  contributorLabel: string
  scoreLabel: string
  contributionsLabel: string
  repositoriesLabel: string
}

export default function LeaderboardTable({
  entries,
  rankLabel,
  contributorLabel,
  scoreLabel,
  contributionsLabel,
  repositoriesLabel,
}: LeaderboardTableProps) {
  const getRankDisplay = (rank: number) => {
    // TBD: Featuring #1, #2, #3?
    // if (rank === 1) return '🥇'
    // if (rank === 2) return '🥈'
    // if (rank === 3) return '🥉'
    return rank.toString()
  }

  const handleContributorClick = (username: string) => {
    window.open(`https://github.com/${username}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="border-primary overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="divide-primary min-w-full divide-y">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                {rankLabel}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                {contributorLabel}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                {scoreLabel}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                {contributionsLabel}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                {repositoriesLabel}
              </th>
            </tr>
          </thead>
          <tbody className="divide-primary divide-y">
            {entries.map((entry) => (
              <tr key={entry.username}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm">{getRankDisplay(entry.rank)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="flex cursor-pointer items-center hover:opacity-70"
                    onClick={() => handleContributorClick(entry.username)}
                  >
                    <img
                      className="h-10 w-10 rounded-full"
                      src={entry.avatarUrl}
                      alt={`${entry.username} avatar`}
                    />
                    <div className="ml-4">
                      <Typography variant="body1" className="font-medium">
                        {entry.username}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outlined" className="font-mono">
                    {entry.score.toLocaleString()}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Typography variant="body2">{entry.contributions.toLocaleString()}</Typography>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Typography variant="body2">{entry.repositories}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
