import { NextResponse } from 'next/server'

const GITHUB_USERNAME = 'gokulsenthilkumar3'
const GITHUB_API = 'https://api.github.com'

// Server-side in-memory cache — 5 min TTL (was 1 min, causing rate-limit hammering)
let cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

async function fetchGitHub(path: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'gokul-portfolio-app',
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  // next.revalidate aligns with our cache TTL
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers,
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`)
  return res.json()
}

export async function GET() {
  try {
    // Serve from cache if still fresh
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json(cache.data, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
      })
    }

    const [user, repos, events] = await Promise.all([
      fetchGitHub(`/users/${GITHUB_USERNAME}`),
      fetchGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
      fetchGitHub(`/users/${GITHUB_USERNAME}/events/public?per_page=100`),
    ])

    const allRepos = [...(repos as any[])]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updatedAt: r.updated_at,
        topics: r.topics ?? [],
      }))

    // Contribution heatmap via GitHub's public contribution HTML
    let contributionMap: Record<string, number> = {}
    try {
      const contribHtml = await fetch(
        `https://github.com/users/${GITHUB_USERNAME}/contributions`,
        { next: { revalidate: 3600 } }
      ).then((r) => r.text())
      const cellRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g
      let match
      while ((match = cellRegex.exec(contribHtml)) !== null) {
        const level = parseInt(match[2], 10)
        contributionMap[match[1]] = level === 0 ? 0 : level === 1 ? 2 : level === 2 ? 5 : level === 3 ? 10 : 20
      }
    } catch {
      // Fallback: derive from events
      ;(events as any[]).forEach((event) => {
        const date: string = event.created_at?.substring(0, 10)
        if (date) contributionMap[date] = (contributionMap[date] ?? 0) + 1
      })
    }

    const langMap: Record<string, number> = {}
    ;(repos as any[]).forEach((r) => {
      if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1
    })
    const languages = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    const data = {
      profile: {
        login: (user as any).login,
        name: (user as any).name,
        avatar_url: (user as any).avatar_url,
        bio: (user as any).bio,
        public_repos: (user as any).public_repos,
        followers: (user as any).followers,
        following: (user as any).following,
        location: (user as any).location,
        blog: (user as any).blog,
        created_at: (user as any).created_at,
      },
      stats: {
        totalRepos: (user as any).public_repos,
        totalStars: (repos as any[]).reduce((a, r) => a + r.stargazers_count, 0),
        totalForks: (repos as any[]).reduce((a, r) => a + r.forks_count, 0),
        followers: (user as any).followers,
      },
      allRepos,
      languages,
      contributions: contributionMap,
    }

    cache = { data, ts: Date.now() }
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
