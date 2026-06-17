import { NextRequest, NextResponse } from 'next/server'

const GH = 'https://api.github.com'
const OWNER = process.env.GITHUB_USERNAME ?? 'gokulsenthilkumar3'
const TOKEN = process.env.GITHUB_TOKEN ?? ''

function ghHeaders() {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (TOKEN) h['Authorization'] = `Bearer ${TOKEN}`
  return h
}

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GH}${path}`, {
      headers: ghHeaders(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

interface GHRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  topics: string[]
  pushed_at: string
  created_at: string
  updated_at: string
  size: number
  fork: boolean
  archived: boolean
  has_pages: boolean
  default_branch: string
  license: { spdx_id: string } | null
}

const CATEGORY_MAP: Record<string, string> = {
  'Portfolio / Next.js': 'web',
  'Finance App': 'fullstack',
  'Search / Directory': 'fullstack',
  'Booking System': 'fullstack',
  'ML / Python Service': 'ai',
  'Inventory System': 'fullstack',
  'Backend API': 'fullstack',
  'IoT System': 'iot',
  'Web App': 'web',
  'Python App': 'ai',
  'Multi-Utility': 'web',
  'Utility / Other': 'other',
}

function classifyType(repo: GHRepo, frameworkHints: string[]): string {
  const hints = frameworkHints.join(' ').toLowerCase()
  const desc = (repo.description ?? '').toLowerCase()
  const name = repo.name.toLowerCase()
  const topics = repo.topics.map(t => t.toLowerCase()).join(' ')

  if (hints.includes('next.js') || topics.includes('portfolio')) return 'Portfolio / Next.js'
  if (name.includes('finance') || name.includes('expense') || name.includes('budget') || topics.includes('finance')) return 'Finance App'
  if (name.includes('find') || name.includes('search') || topics.includes('search')) return 'Search / Directory'
  if (name.includes('booking') || name.includes('appointment') || desc.includes('book')) return 'Booking System'
  if (name.includes('yarn') || name.includes('inventory') || desc.includes('inventory')) return 'Inventory System'
  if (repo.language === 'Python' && (hints.includes('fastapi') || hints.includes('flask') || hints.includes('django') || desc.includes('model') || desc.includes('predict'))) return 'ML / Python Service'
  if (name.includes('iot') || name.includes('raspberry') || desc.includes('raspberry') || desc.includes('iot')) return 'IoT System'
  if (name.includes('ultimate') || name.includes('toolkit') || name.includes('utility')) return 'Multi-Utility'
  if (repo.language === 'JavaScript' || repo.language === 'TypeScript') return 'Web App'
  if (repo.language === 'Python') return 'Python App'
  return 'Utility / Other'
}

function detectFrameworks(paths: string[], lang: string | null): string[] {
  const fw: string[] = []
  const has = (p: RegExp) => paths.some(f => p.test(f))

  if (has(/next\.config/)) fw.push('Next.js')
  if (has(/vite\.config/)) fw.push('Vite')
  if (has(/tailwind\.config/)) fw.push('Tailwind')
  if (has(/prisma/)) fw.push('Prisma')
  if (has(/drizzle/)) fw.push('Drizzle')
  if (has(/supabase/)) fw.push('Supabase')
  if (has(/firebase/)) fw.push('Firebase')
  if (has(/express|server\.js|app\.js/)) fw.push('Express')
  if (has(/django|manage\.py/)) fw.push('Django')
  if (has(/flask|app\.py/)) fw.push('Flask')
  if (has(/fastapi|main\.py/)) fw.push('FastAPI')
  if (has(/angular\.json/)) fw.push('Angular')
  if (has(/nuxt\.config/)) fw.push('Nuxt.js')
  if (has(/svelte\.config/)) fw.push('SvelteKit')
  if (has(/k6|load.?test|performance\.js/)) fw.push('K6')
  if (lang) fw.push(lang)
  return [...new Set(fw)].slice(0, 8)
}

export interface DynamicProject {
  id: string
  title: string
  description: string
  category: string
  type: string
  tech: string[]
  links: { github: string; live: string | null }
  stars: number
  forks: number
  language: string | null
  topics: string[]
  pushedAt: string
  createdAt: string
  size: number
  hasPages: boolean
  status: 'active' | 'completed' | 'archived'
}

async function enrichRepo(repo: GHRepo): Promise<DynamicProject> {
  // Fetch file tree for framework detection
  const tree = await ghFetch<{ tree: { path: string }[] }>(
    `/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`
  )
  const paths = (tree?.tree ?? []).map(f => f.path.toLowerCase())
  const frameworks = detectFrameworks(paths, repo.language)
  const type = classifyType(repo, frameworks)
  const category = CATEGORY_MAP[type] ?? 'other'

  // Status based on recent activity
  const daysSincePush = (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  const status: DynamicProject['status'] = repo.archived
    ? 'archived'
    : daysSincePush < 60
    ? 'active'
    : 'completed'

  const live = repo.homepage || (repo.has_pages ? `https://${repo.full_name.split('/')[0]}.github.io/${repo.name}` : null)

  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: repo.description ?? `A ${type.toLowerCase()} built with ${frameworks.slice(0, 3).join(', ') || repo.language || 'modern tech'}.`,
    category,
    type,
    tech: frameworks,
    links: { github: repo.html_url, live },
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    size: repo.size,
    hasPages: repo.has_pages,
    status,
  }
}

export async function GET(req: NextRequest) {
  const owner = new URL(req.url).searchParams.get('owner') ?? OWNER

  const repos = await ghFetch<GHRepo[]>(
    `/users/${owner}/repos?per_page=100&type=owner&sort=pushed`
  )

  if (!repos) {
    return NextResponse.json({ error: 'Could not fetch repos from GitHub' }, { status: 500 })
  }

  const eligible = repos.filter(r => !r.fork && !r.archived)

  // Enrich in batches of 6
  const results: DynamicProject[] = []
  const CHUNK = 6
  for (let i = 0; i < eligible.length; i += CHUNK) {
    const batch = eligible.slice(i, i + CHUNK)
    const done = await Promise.allSettled(batch.map(r => enrichRepo(r)))
    for (const d of done) {
      if (d.status === 'fulfilled') results.push(d.value)
    }
  }

  results.sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime())

  return NextResponse.json({
    owner,
    fetchedAt: new Date().toISOString(),
    total: results.length,
    projects: results,
  })
}
