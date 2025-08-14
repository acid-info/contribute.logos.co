import { GITHUB_API_BASE, GITHUB_PER_PAGE, paginate, getAuth } from '@/lib/github'

interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const org = searchParams.get('org')

    if (!org) {
      return Response.json({ error: 'org parameter is required' }, { status: 400 })
    }

    const auth = getAuth()
    const url = `${GITHUB_API_BASE}/orgs/${encodeURIComponent(org)}/repos?type=public&per_page=${GITHUB_PER_PAGE}&sort=updated`
    const repos = await paginate<Repository>(url, auth)
    // Sort by stars (stargazers_count) in descending order
    const sortedByStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)

    return Response.json({
      organization: org,
      count: sortedByStars.length,
      repositories: sortedByStars,
    })
  } catch (e: any) {
    console.error('Error fetching repositories:', e)
    return Response.json({ error: e?.message || String(e) }, { status: 500 })
  }
}
