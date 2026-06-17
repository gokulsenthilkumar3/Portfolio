import { NextResponse } from 'next/server'

const GITHUB_USERNAME = 'gokulsenthilkumar3'
const GITHUB_API = 'https://api.github.com'

// Cache for 10 minutes
let cache: { data: any; ts: number } | null = null
const CACHE_TTL = 10 * 60 * 1000

async function fetchGitHub(path: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'portfolio-app',
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  const res = await fetch(`${GITHUB_API}${path}`, { headers, next: { revalidate: 600 } })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json(cache.data)
    }

    const [user, repos, events] = await Promise.all([
      fetchGitHub(`/users/${GITHUB_USERNAME}`),
      fetchGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
      fetchGitHub(`/users/${GITHUB_USERNAME}/events/public?per_page=100`),
    ])

    // Top repos by stars
    const topRepos = [...repos]
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updatedAt: r.updated_at,
        topics: r.topics || [],
      }))

    // Contribution data from events (last 90 days)
    const now = new Date()
    const contributionMap: Record<string, number> = {}
    events.forEach((event: any) => {
      const date = event.created_at?.substring(0, 10)
      if (date) {
        contributionMap[date] = (contributionMap[date] || 0) + 1
      }
    })

    // Language stats
    const langMap: Record<string, number> = {}
    repos.forEach((r: any) => {
      if (r.language) {
        langMap[r.language] = (langMap[r.language] || 0) + 1
      }
    })
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    const data = {
      profile: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        location: user.location,
        blog: user.blog,
        created_at: user.created_at,
      },
      stats: {
        totalRepos: user.public_repos,
        totalStars: repos.reduce((a: number, r: any) => a + r.stargazers_count, 0),
        totalForks: repos.reduce((a: number, r: any) => a + r.forks_count, 0),
        followers: user.followers,
      },
      topRepos,
      languages,
      contributions: contributionMap,
    }

    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
  }
}
