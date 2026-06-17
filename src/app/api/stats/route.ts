import { NextResponse } from 'next/server'
import { portfolioConfig } from '@/config/portfolio.config'

/**
 * GET /api/stats
 *
 * Returns live stats for the About section:
 *
 * - GitHub Repos   → fetched from GitHub public API (no token needed for public data)
 * - Years Experience → calculated from portfolioConfig.personal.careerStart date
 * - Projects Built  → count of portfolioConfig.projects array (source of truth)
 * - Tests Written   → from config (no public API for this; kept as a manual signal)
 *
 * LinkedIn does not offer a public API for profile stats. "Years Experience"
 * is derived from the careerStart date in portfolio.config.ts, which matches
 * what your LinkedIn profile shows as your earliest role start date.
 *
 * Revalidates every 24 hours so the deploy is fast but numbers stay fresh.
 */
export const revalidate = 86400 // 24 hours

interface GitHubUser {
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
}

async function fetchGitHubStats(username: string): Promise<{ repos: number } | null> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
    // Use GITHUB_TOKEN if available for higher rate limits (60/hr anon → 5000/hr authed)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      console.error(`[stats] GitHub API error: ${res.status} ${res.statusText}`)
      return null
    }

    const data: GitHubUser = await res.json()
    return { repos: data.public_repos }
  } catch (err) {
    console.error('[stats] Failed to fetch GitHub stats:', err)
    return null
  }
}

function calcYearsExperience(careerStart: string): number {
  const start = new Date(careerStart)
  const now = new Date()
  const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  return Math.max(1, Math.floor(years))
}

export async function GET() {
  const { personal, projects } = portfolioConfig

  // Extract GitHub username from the profile URL in config
  // e.g. "https://github.com/gokulsenthilkumar3" → "gokulsenthilkumar3"
  const githubUsername = personal.github?.split('/').pop() ?? ''

  // Fetch live GitHub data
  const github = await fetchGitHubStats(githubUsername)

  // Years of experience: calculated from careerStart date in config
  // This is the same date shown on LinkedIn as your first role start date.
  const yearsExperience = calcYearsExperience(personal.careerStart)

  // Projects count: live count from the config array (single source of truth)
  const projectsBuilt = projects.length

  const stats = [
    {
      label: 'Years Experience',
      // Live value from careerStart date; fallback to config static value
      value: yearsExperience,
      suffix: '+',
      duration: 2000,
      source: 'calculated',
    },
    {
      label: 'Projects Built',
      value: projectsBuilt,
      suffix: '+',
      duration: 2200,
      source: 'config',
    },
    {
      label: 'GitHub Repos',
      // Live from GitHub API; fallback to config static value if API fails
      value: github?.repos ?? portfolioConfig.stats.find(s => s.label === 'GitHub Repos')?.value ?? 13,
      suffix: '+',
      duration: 2400,
      source: github ? 'github_api' : 'config_fallback',
    },
    {
      label: 'Tests Written',
      // No public API for this — kept as a manually curated signal
      value: portfolioConfig.stats.find(s => s.label === 'Tests Written')?.value ?? 100,
      suffix: '+',
      duration: 2600,
      source: 'config',
    },
  ]

  return NextResponse.json({
    stats,
    meta: {
      generatedAt: new Date().toISOString(),
      sources: {
        yearsExperience: `Calculated from careerStart: ${personal.careerStart}`,
        projectsBuilt: `Count of projects[] array (${projectsBuilt} total)`,
        githubRepos: github ? `Live from GitHub API (user: ${githubUsername})` : 'Fallback from config',
        testsWritten: 'Manual config value',
      },
    },
  })
}
