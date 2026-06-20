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

    // All repos by stars
    const allRepos = [...repos]
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
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

    // Contribution data from GitHub HTML (full year)
    let contributionMap: Record<string, number> = {}
    try {
      const contribHtml = await fetch(`https://github.com/${GITHUB_USERNAME}/contributions`).then(r => r.text())
      // Use data-date and data-level directly from the td elements
      const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g
      let match
      while ((match = cellRegex.exec(contribHtml)) !== null) {
        const date = match[1]
        const level = parseInt(match[2], 10)
        // Map levels to approximate counts to simulate the heatmap intensity
        contributionMap[date] = level === 0 ? 0 : level === 1 ? 2 : level === 2 ? 5 : level === 3 ? 10 : 20
      }
    } catch (err) {
      console.error('Error fetching contributions HTML', err)
      // Fallback to events
      events.forEach((event: any) => {
        const date = event.created_at?.substring(0, 10)
        if (date) {
          contributionMap[date] = (contributionMap[date] || 0) + 1
        }
      })
    }

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
      allRepos,
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
