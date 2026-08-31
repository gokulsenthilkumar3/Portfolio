import { NextResponse } from 'next/server'
import { portfolioConfig } from '@/config/portfolio.config'

interface GitHubUser {
  login: string; name: string; avatar_url: string; bio: string;
  public_repos: number; followers: number; following: number;
  location: string; blog: string; created_at: string;
}

interface GitHubRepo {
  id: number; name: string; description: string; html_url: string;
  stargazers_count: number; forks_count: number; language: string;
  updated_at: string; topics: string[];
}

interface GitHubEvent {
  created_at: string;
}

const CONFIGURED_USERNAME = portfolioConfig.personal.github?.split('/').filter(Boolean).pop() ?? ''
const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? CONFIGURED_USERNAME
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
      fetchGitHub(`/users/${GITHUB_USERNAME}`) as Promise<GitHubUser>,
      fetchGitHub(`/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`) as Promise<GitHubRepo[]>,
      fetchGitHub(`/users/${GITHUB_USERNAME}/events/public?per_page=100`) as Promise<GitHubEvent[]>,
    ])

    const allRepos = [...repos]
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
    const contributionMap: Record<string, number> = {}
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
      events.forEach((event) => {
        const date = event.created_at?.substring(0, 10)
        if (date) contributionMap[date] = (contributionMap[date] ?? 0) + 1
      })
    }

    const langMap: Record<string, number> = {}
    repos.forEach((r) => {
      if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1
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
        totalStars: repos.reduce((a, r) => a + r.stargazers_count, 0),
        totalForks: repos.reduce((a, r) => a + r.forks_count, 0),
        followers: user.followers,
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
