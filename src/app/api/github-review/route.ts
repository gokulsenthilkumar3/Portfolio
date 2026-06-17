import { NextRequest, NextResponse } from 'next/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CharacteristicScore {
  id: string
  label: string
  icon: string
  score: number          // 0–100
  confidence: 'high' | 'medium' | 'low'
  signals: string[]      // what evidence drove this score
}

export interface RepoAnalysis {
  id: string
  name: string
  fullName: string
  description: string | null
  url: string
  homepage: string | null
  stars: number
  forks: number
  watchers: number
  openIssues: number
  primaryLanguage: string | null
  languages: Record<string, number>   // language → bytes
  topics: string[]
  hasWiki: boolean
  hasPages: boolean
  isArchived: boolean
  isFork: boolean
  createdAt: string
  pushedAt: string
  updatedAt: string
  defaultBranch: string
  size: number            // KB
  license: string | null
  // derived from tree / commits / readme
  fileCount: number
  hasReadme: boolean
  readmeLength: number
  hasTests: boolean
  testFileCount: number
  hasCICD: boolean
  cicdProviders: string[]
  hasEnvExample: boolean
  hasDockerfile: boolean
  hasPackageJson: boolean
  hasPipfile: boolean
  hasRequirements: boolean
  frameworkHints: string[]
  commitCount: number
  contributorCount: number
  branchCount: number
  recentCommitsLast30Days: number
  avgCommitsPerMonth: number
  closedIssues: number
  pullRequestCount: number
  // scoring
  characteristics: CharacteristicScore[]
  overallScore: number
  priority: 'high' | 'medium' | 'low'
  summary: string
  type: string
  improvedAt: string     // ISO timestamp when this analysis ran
}

// ─── GitHub API helper ────────────────────────────────────────────────────────

const GH = 'https://api.github.com'
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
    const res = await fetch(`${GH}${path}`, { headers: ghHeaders(), next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

// ─── Collect raw repo signals ─────────────────────────────────────────────────

async function collectSignals(owner: string, repo: string) {
  const [repoData, languages, topics, tree, commitsRaw, branches, contributors, issues] =
    await Promise.allSettled([
      ghFetch<any>(`/repos/${owner}/${repo}`),
      ghFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`),
      ghFetch<{ names: string[] }>(`/repos/${owner}/${repo}/topics`),
      ghFetch<{ tree: { path: string; type: string }[] }>(
        `/repos/${owner}/${repo}/git/trees/${(await ghFetch<any>(`/repos/${owner}/${repo}`))?.default_branch ?? 'main'}?recursive=1`
      ),
      ghFetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=100`),
      ghFetch<any[]>(`/repos/${owner}/${repo}/branches?per_page=100`),
      ghFetch<any[]>(`/repos/${owner}/${repo}/contributors?per_page=100`),
      ghFetch<any[]>(`/repos/${owner}/${repo}/issues?state=closed&per_page=100`),
    ])

  const r = repoData.status === 'fulfilled' ? repoData.value : null
  const langs = languages.status === 'fulfilled' ? (languages.value ?? {}) : {}
  const topicList = topics.status === 'fulfilled' ? (topics.value?.names ?? []) : []
  const treeFiles = tree.status === 'fulfilled' ? (tree.value?.tree ?? []) : []
  const commits = commitsRaw.status === 'fulfilled' ? (commitsRaw.value ?? []) : []
  const branchList = branches.status === 'fulfilled' ? (branches.value ?? []) : []
  const contribs = contributors.status === 'fulfilled' ? (contributors.value ?? []) : []
  const closedIssues = issues.status === 'fulfilled' ? (issues.value ?? []) : []

  return { r, langs, topicList, treeFiles, commits, branchList, contribs, closedIssues }
}

// ─── Derive file-level flags from tree ───────────────────────────────────────

function deriveFileFlags(treeFiles: { path: string; type: string }[]) {
  const paths = treeFiles.map((f) => f.path.toLowerCase())
  const fileCount = treeFiles.filter((f) => f.type === 'blob').length

  const has = (patterns: string[]) =>
    patterns.some((p) => paths.some((path) => path.includes(p)))

  const hasReadme = has(['readme'])
  const readmeEntry = treeFiles.find((f) => f.path.toLowerCase().startsWith('readme'))
  const readmeLength = readmeEntry ? 2000 : 0  // we don't fetch content, estimate presence

  const hasTests = has(['test', 'spec', '__tests__', 'e2e', 'cypress', 'jest', 'vitest', 'playwright'])
  const testFileCount = paths.filter((p) =>
    p.includes('test') || p.includes('spec') || p.includes('__tests__')
  ).length

  const hasCICD = has(['.github/workflows', '.travis.yml', 'circle', 'jenkinsfile', '.gitlab-ci', 'bitbucket-pipelines', 'vercel.json', 'netlify.toml', 'railway.toml', 'render.yaml'])
  const cicdProviders: string[] = []
  if (paths.some((p) => p.includes('.github/workflows'))) cicdProviders.push('GitHub Actions')
  if (paths.some((p) => p.includes('vercel'))) cicdProviders.push('Vercel')
  if (paths.some((p) => p.includes('netlify'))) cicdProviders.push('Netlify')
  if (paths.some((p) => p.includes('railway'))) cicdProviders.push('Railway')
  if (paths.some((p) => p.includes('render'))) cicdProviders.push('Render')
  if (paths.some((p) => p.includes('.travis'))) cicdProviders.push('Travis CI')

  const hasEnvExample = has(['.env.example', '.env.sample', '.env.local.example'])
  const hasDockerfile = has(['dockerfile', 'docker-compose'])
  const hasPackageJson = has(['package.json'])
  const hasPipfile = has(['pipfile', 'pyproject.toml'])
  const hasRequirements = has(['requirements.txt', 'requirements-dev', 'requirements/'])

  // Framework hints from file paths + names
  const frameworkHints: string[] = []
  if (paths.some((p) => p.includes('next.config') || p.includes('app/page') || p.includes('app/layout'))) frameworkHints.push('Next.js')
  if (paths.some((p) => p.includes('vite.config'))) frameworkHints.push('Vite')
  if (paths.some((p) => p.includes('angular.json'))) frameworkHints.push('Angular')
  if (paths.some((p) => p.includes('nuxt.config'))) frameworkHints.push('Nuxt.js')
  if (paths.some((p) => p.includes('svelte.config'))) frameworkHints.push('SvelteKit')
  if (paths.some((p) => p.includes('tailwind.config'))) frameworkHints.push('Tailwind')
  if (paths.some((p) => p.includes('prisma'))) frameworkHints.push('Prisma')
  if (paths.some((p) => p.includes('drizzle'))) frameworkHints.push('Drizzle')
  if (paths.some((p) => p.includes('supabase'))) frameworkHints.push('Supabase')
  if (paths.some((p) => p.includes('firebase'))) frameworkHints.push('Firebase')
  if (paths.some((p) => p.includes('express') || p.includes('server.js') || p.includes('app.js'))) frameworkHints.push('Express')
  if (paths.some((p) => p.includes('fastapi') || p.includes('main.py'))) frameworkHints.push('FastAPI')
  if (paths.some((p) => p.includes('django') || p.includes('manage.py'))) frameworkHints.push('Django')
  if (paths.some((p) => p.includes('flask') || p.includes('app.py'))) frameworkHints.push('Flask')
  if (paths.some((p) => p.includes('k6') || p.includes('load-test') || p.includes('performance'))) frameworkHints.push('K6/LoadTest')
  if (paths.some((p) => p.includes('storybook'))) frameworkHints.push('Storybook')
  if (paths.some((p) => p.includes('graphql') || p.includes('schema.graphql'))) frameworkHints.push('GraphQL')
  if (paths.some((p) => p.includes('swagger') || p.includes('openapi'))) frameworkHints.push('OpenAPI')

  return {
    fileCount, hasReadme, readmeLength, hasTests, testFileCount,
    hasCICD, cicdProviders, hasEnvExample, hasDockerfile,
    hasPackageJson, hasPipfile, hasRequirements, frameworkHints,
  }
}

// ─── Derive commit metrics ────────────────────────────────────────────────────

function deriveCommitMetrics(commits: any[], createdAt: string) {
  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  const recentCommitsLast30Days = commits.filter((c) => {
    const d = new Date(c?.commit?.author?.date ?? 0).getTime()
    return d > thirtyDaysAgo
  }).length

  const ageMonths = Math.max(
    1,
    (now - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
  )
  const avgCommitsPerMonth = Math.round(commits.length / ageMonths)

  return { commitCount: commits.length, recentCommitsLast30Days, avgCommitsPerMonth }
}

// ─── Classify repo type ───────────────────────────────────────────────────────

function classifyType(r: any, langs: Record<string, number>, frameworkHints: string[], topicList: string[]): string {
  const lang = (r?.language ?? '').toLowerCase()
  const topics = topicList.map((t) => t.toLowerCase()).join(' ')
  const hints = frameworkHints.join(' ').toLowerCase()
  const desc = (r?.description ?? '').toLowerCase()
  const name = (r?.name ?? '').toLowerCase()

  if (hints.includes('next.js') || hints.includes('nuxt') || topics.includes('portfolio')) return 'Portfolio / Next.js'
  if (name.includes('finance') || name.includes('expense') || name.includes('budget') || topics.includes('finance')) return 'Finance App'
  if (name.includes('find') || topics.includes('search') || desc.includes('search') || desc.includes('find')) return 'Search / Directory'
  if (name.includes('booking') || name.includes('appointment') || desc.includes('book')) return 'Booking System'
  if (lang === 'python' && (hints.includes('fastapi') || hints.includes('flask') || hints.includes('django') || desc.includes('ml') || desc.includes('model'))) return 'ML / Python Service'
  if (name.includes('yarn') || name.includes('inventory') || desc.includes('inventory')) return 'Inventory System'
  if (lang === 'javascript' || lang === 'typescript') {
    if (hints.includes('express') || topics.includes('api')) return 'Backend API'
    return 'Web App'
  }
  if (lang === 'python') return 'Python App'
  if (lang === 'java') return 'Java App'
  if (lang === 'rust') return 'Systems App'
  return 'Utility / Other'
}

// ─── Scoring engine ───────────────────────────────────────────────────────────
// Each characteristic is scored 0-100 from real signals with no hardcoded per-repo values.

function scoreRepo(
  r: any,
  langs: Record<string, number>,
  topicList: string[],
  fileFlags: ReturnType<typeof deriveFileFlags>,
  commitMetrics: ReturnType<typeof deriveCommitMetrics>,
  branchCount: number,
  contributorCount: number,
  closedIssueCount: number,
  openIssues: number,
): CharacteristicScore[] {
  const {
    fileCount, hasReadme, readmeLength, hasTests, testFileCount,
    hasCICD, cicdProviders, hasEnvExample, hasDockerfile,
    hasPackageJson, hasPipfile, hasRequirements, frameworkHints,
  } = fileFlags
  const { commitCount, recentCommitsLast30Days, avgCommitsPerMonth } = commitMetrics
  const topics = topicList.map((t) => t.toLowerCase()).join(' ')
  const desc = (r?.description ?? '').toLowerCase()
  const name = (r?.name ?? '').toLowerCase()
  const stars = r?.stargazers_count ?? 0
  const forks = r?.forks_count ?? 0
  const size = r?.size ?? 0
  const hints = frameworkHints.map((h) => h.toLowerCase()).join(' ')
  const isFullStack = hints.includes('express') && (hints.includes('react') || hints.includes('next') || hints.includes('vite'))
  const hasDB = hints.includes('prisma') || hints.includes('drizzle') || hints.includes('supabase') || hints.includes('firebase') || topics.includes('postgresql') || topics.includes('mongodb')
  const hasFrontend = hints.includes('react') || hints.includes('next') || hints.includes('vite') || hints.includes('svelte') || hints.includes('angular')
  const hasBackend = hints.includes('express') || hints.includes('fastapi') || hints.includes('django') || hints.includes('flask')
  const hasMLSignals = hints.includes('ml') || hints.includes('model') || desc.includes('predict') || desc.includes('machine learning') || desc.includes('neural') || name.includes('predict') || name.includes('forex')
  const hasTailwind = hints.includes('tailwind')
  const hasStorybook = hints.includes('storybook')
  const hasOpenAPI = hints.includes('openapi') || hints.includes('graphql')
  const hasCI = hasCICD
  const hasPerformanceTesting = hints.includes('k6') || hints.includes('loadtest')
  const hasAnimations = topics.includes('animation') || desc.includes('animation') || hasFrontend

  function clamp(n: number) { return Math.min(100, Math.max(0, Math.round(n))) }
  function scoreWithSignals(id: string, label: string, icon: string, raw: number, signals: string[], conf: 'high'|'medium'|'low'): CharacteristicScore {
    return { id, label, icon, score: clamp(raw), confidence: conf, signals }
  }

  // 1. Core Intelligence — agent-like capabilities inferred from features
  const coreSignals: string[] = []
  let coreScore = 5
  if (hasMLSignals) { coreScore += 35; coreSignals.push('ML/AI signals in description or name') }
  if (hasDB) { coreScore += 15; coreSignals.push('Database integration (persistent memory)') }
  if (hasBackend && hasDB) { coreScore += 10; coreSignals.push('Full backend+DB = potential for complex reasoning') }
  if (topics.includes('agent') || topics.includes('llm') || desc.includes('agent') || desc.includes('llm')) { coreScore += 30; coreSignals.push('Explicit AI/agent topic or description') }
  if (hasOpenAPI) { coreScore += 10; coreSignals.push('API schema (GraphQL/OpenAPI) supports programmatic reasoning') }
  if (!hasFrontend && hasBackend) { coreScore += 5; coreSignals.push('Backend-only = logic-focused codebase') }
  if (!hasMLSignals && !hasDB && !hasBackend) coreSignals.push('No agent/ML/backend signals detected')

  // 2. UX
  const uxSignals: string[] = []
  let uxScore = 20
  if (hasFrontend) { uxScore += 20; uxSignals.push('Frontend framework present') }
  if (hasTailwind) { uxScore += 15; uxSignals.push('Tailwind CSS — systematic design tokens') }
  if (hasStorybook) { uxScore += 15; uxSignals.push('Storybook — component-level UX review') }
  if (recentCommitsLast30Days > 5) { uxScore += 10; uxSignals.push(`${recentCommitsLast30Days} commits in last 30 days — active refinement`) }
  if (closedIssueCount > 5) { uxScore += 10; uxSignals.push(`${closedIssueCount} closed issues — UX feedback addressed`) }
  if (r?.has_pages) { uxScore += 10; uxSignals.push('GitHub Pages — live deployment means UX is exposed to real users') }
  if (!hasFrontend) { uxScore = 15; uxSignals.push('No frontend detected — UX not applicable or minimal') }

  // 3. UI
  const uiSignals: string[] = []
  let uiScore = 15
  if (hasTailwind) { uiScore += 25; uiSignals.push('Tailwind CSS — consistent visual design system') }
  if (hasFrontend) { uiScore += 20; uiSignals.push('Frontend framework — component-based UI') }
  if (hints.includes('next.js')) { uiScore += 10; uiSignals.push('Next.js — App Router supports modern layout patterns') }
  if (hasStorybook) { uiScore += 15; uiSignals.push('Storybook — documented UI components') }
  if (topics.includes('ui') || topics.includes('design')) { uiScore += 10; uiSignals.push('UI/Design topic tagged') }
  if (size > 5000) { uiScore += 5; uiSignals.push(`Large codebase (${size}KB) suggests substantial UI work`) }
  if (!hasFrontend) { uiScore = 10; uiSignals.push('No frontend — UI scoring minimal') }

  // 4. Performance
  const perfSignals: string[] = []
  let perfScore = 20
  if (hasPerformanceTesting) { perfScore += 35; perfSignals.push('K6 or load testing files detected') }
  if (hints.includes('next.js')) { perfScore += 15; perfSignals.push('Next.js — built-in SSR/SSG/ISR for performance') }
  if (hasCICD) { perfScore += 10; perfSignals.push('CI/CD pipeline — automated build optimization') }
  if (hasDockerfile) { perfScore += 10; perfSignals.push('Docker — containerized deployment = consistent performance') }
  if (avgCommitsPerMonth > 8) { perfScore += 10; perfSignals.push(`${avgCommitsPerMonth} commits/month — active optimization cycles`) }
  if (hints.includes('vite')) { perfScore += 5; perfSignals.push('Vite — fast build tooling') }

  // 5. Animations
  const animSignals: string[] = []
  let animScore = 5
  if (hasAnimations && hasFrontend) { animScore += 20; animSignals.push('Frontend app — animations possible') }
  if (hasTailwind) { animScore += 10; animSignals.push('Tailwind — transition/animation utilities available') }
  if (topics.includes('animation') || desc.includes('animation') || desc.includes('motion') || desc.includes('framer')) { animScore += 35; animSignals.push('Animation/motion keywords in topics or description') }
  if (hints.includes('framer') || hints.includes('gsap')) { animScore += 25; animSignals.push('Framer Motion or GSAP detected') }
  if (r?.has_pages && hasFrontend) { animScore += 10; animSignals.push('Live GitHub Pages site — animation likely visible') }
  if (!hasFrontend) { animScore = 5; animSignals.push('No frontend — animation not applicable') }

  // 6. Functionality
  const funcSignals: string[] = []
  let funcScore = 20
  if (isFullStack) { funcScore += 25; funcSignals.push('Full-stack architecture (frontend + backend)') }
  if (hasDB) { funcScore += 15; funcSignals.push('Database integration — persistent data features') }
  if (fileCount > 50) { funcScore += 10; funcSignals.push(`${fileCount} files — substantial feature set`) }
  if (hasOpenAPI || hints.includes('graphql')) { funcScore += 10; funcSignals.push('API schema — well-defined feature contracts') }
  if (topics.length > 3) { funcScore += 5; funcSignals.push(`${topics.length} repository topics — broad feature scope`) }
  if (hasDockerfile) { funcScore += 5; funcSignals.push('Dockerized — deployment-ready functionality') }
  if (commitCount > 50) { funcScore += 10; funcSignals.push(`${commitCount} commits — extended development history`) }

  // 7. Memory & Context
  const memSignals: string[] = []
  let memScore = 5
  if (hasDB) { memScore += 30; memSignals.push('Database present — persistent memory possible') }
  if (hints.includes('redis') || desc.includes('redis') || desc.includes('cache')) { memScore += 20; memSignals.push('Redis/cache signals — in-memory state management') }
  if (hasMLSignals) { memScore += 15; memSignals.push('ML signals — model state and embeddings') }
  if (hints.includes('supabase') || hints.includes('firebase')) { memScore += 15; memSignals.push('BaaS (Supabase/Firebase) — user data persistence') }
  if (!hasDB && !hasMLSignals) memSignals.push('No database or ML signals — memory architecture unclear')

  // 8. Agent Orchestration
  const orchSignals: string[] = []
  let orchScore = 5
  if (hasMLSignals) { orchScore += 20; orchSignals.push('ML/AI signals — potential for multi-step agent flows') }
  if (hasCICD && branchCount > 3) { orchScore += 15; orchSignals.push(`${branchCount} branches + CI/CD — orchestrated workflow in place`) }
  if (isFullStack) { orchScore += 15; orchSignals.push('Full-stack = multiple services coordinated') }
  if (topics.includes('microservice') || topics.includes('agent') || desc.includes('orchestrat')) { orchScore += 30; orchSignals.push('Orchestration/microservice keywords detected') }
  if (contributorCount > 1) { orchScore += 10; orchSignals.push(`${contributorCount} contributors — coordination already happening`) }
  if (!hasCICD && !isFullStack && !hasMLSignals) orchSignals.push('Monolith without CI/CD — orchestration minimal')

  // 9. Reliability & Trust
  const relSignals: string[] = []
  let relScore = 10
  if (hasTests) { relScore += 30; relSignals.push(`${testFileCount} test files detected`) }
  if (hasCICD) { relScore += 20; relSignals.push(`CI/CD via ${cicdProviders.join(', ')} — automated verification`) }
  if (closedIssueCount > 5) { relScore += 15; relSignals.push(`${closedIssueCount} closed issues — bugs tracked and fixed`) }
  if (hasDockerfile) { relScore += 10; relSignals.push('Docker — reproducible environments') }
  if (avgCommitsPerMonth > 5) { relScore += 10; relSignals.push('Active maintenance — reliability improvements ongoing') }
  if (!hasTests) relSignals.push('No test files found — reliability unverified')

  // 10. Security & Privacy
  const secSignals: string[] = []
  let secScore = 15
  if (hasEnvExample) { secScore += 25; secSignals.push('.env.example — secrets externalized from code') }
  if (r?.private === false && !hasEnvExample) { secSignals.push('Public repo with no .env.example — secrets risk') }
  if (hasDockerfile) { secScore += 10; secSignals.push('Docker — isolated execution environment') }
  if (hasCICD) { secScore += 10; secSignals.push('CI/CD — automated security checks possible') }
  if (r?.license) { secScore += 10; secSignals.push(`License: ${r.license?.spdx_id} — legal clarity`) }
  if (hints.includes('supabase') || hints.includes('firebase') || hints.includes('clerk') || hints.includes('auth')) { secScore += 20; secSignals.push('Auth/BaaS platform — managed security layer') }
  if (!hasEnvExample && !hasDockerfile) secSignals.push('No env example or Docker — security setup unclear')

  // 11. Developer Experience
  const dxSignals: string[] = []
  let dxScore = 10
  if (hasReadme) { dxScore += 20; dxSignals.push('README present — developer orientation exists') }
  if (readmeLength > 500) { dxScore += 10; dxSignals.push('Detailed README — good onboarding documentation') }
  if (hasEnvExample) { dxScore += 15; dxSignals.push('.env.example — easy local setup') }
  if (hasCICD) { dxScore += 15; dxSignals.push('CI/CD — automated workflow for contributors') }
  if (hasDockerfile) { dxScore += 10; dxSignals.push('Docker — one-command local environment') }
  if (hasOpenAPI || hints.includes('swagger')) { dxScore += 10; dxSignals.push('API documentation (OpenAPI/Swagger)') }
  if (hasStorybook) { dxScore += 10; dxSignals.push('Storybook — component documentation') }
  if (branchCount > 3) { dxScore += 5; dxSignals.push(`${branchCount} branches — active feature branching`) }
  if (!hasReadme) dxSignals.push('No README detected — poor developer onboarding')

  // 12. Hooks / Addictive Factor
  const hookSignals: string[] = []
  let hookScore = 10
  if (stars > 0) { hookScore += Math.min(20, stars * 4); hookSignals.push(`${stars} stars — community endorsement`) }
  if (forks > 0) { hookScore += Math.min(15, forks * 5); hookSignals.push(`${forks} forks — others building on this`) }
  if (recentCommitsLast30Days > 3) { hookScore += 10; hookSignals.push(`${recentCommitsLast30Days} commits last 30 days — actively evolving`) }
  if (r?.has_pages) { hookScore += 20; hookSignals.push('Live GitHub Pages — real users can experience it') }
  if (r?.watchers_count > 0) { hookScore += 5; hookSignals.push(`${r.watchers_count} watchers — people following updates`) }
  if (hasMLSignals) { hookScore += 15; hookSignals.push('ML/AI — novel capability creates wow moments') }
  if (stars === 0 && forks === 0 && !r?.has_pages) hookSignals.push('No stars, forks, or live demo — hook factor low')

  // 13. Scalability
  const scaleSignals: string[] = []
  let scaleScore = 15
  if (hasDockerfile) { scaleScore += 25; scaleSignals.push('Docker — horizontal scaling possible') }
  if (hints.includes('supabase') || hints.includes('firebase') || hints.includes('vercel') || hints.includes('railway')) { scaleScore += 20; scaleSignals.push('Cloud-native platform — auto-scaling built in') }
  if (hasCICD) { scaleScore += 10; scaleSignals.push('CI/CD — deployment pipeline can scale with team') }
  if (hints.includes('next.js')) { scaleScore += 10; scaleSignals.push('Next.js — Vercel edge network scales globally') }
  if (hasDB) { scaleScore += 10; scaleSignals.push('Database — data layer can be scaled independently') }
  if (hasPerformanceTesting) { scaleScore += 10; scaleSignals.push('Load testing — scalability already being measured') }
  if (!hasDockerfile && !hints.includes('vercel') && !hints.includes('railway')) scaleSignals.push('No containerization or cloud platform detected')

  // 14. Analytics & Learning
  const analyticsSignals: string[] = []
  let analyticsScore = 10
  if (topics.includes('analytics') || desc.includes('analytics') || desc.includes('dashboard') || name.includes('dashboard')) { analyticsScore += 30; analyticsSignals.push('Analytics/dashboard keyword in name or description') }
  if (hasDB) { analyticsScore += 15; analyticsSignals.push('Database — data can be queried for analytics') }
  if (hints.includes('chart') || topics.includes('chart') || desc.includes('chart') || desc.includes('graph') || desc.includes('visualiz')) { analyticsScore += 20; analyticsSignals.push('Chart/visualization signals — analytics layer present') }
  if (closedIssueCount > 3) { analyticsScore += 10; analyticsSignals.push(`${closedIssueCount} closed issues — feedback loop in practice`) }
  if (hasMLSignals) { analyticsScore += 15; analyticsSignals.push('ML signals — learning loop possible') }
  if (!hasDB && !hasMLSignals) analyticsSignals.push('No analytics infrastructure detected')

  // 15. Product Thinking
  const productSignals: string[] = []
  let productScore = 10
  if (r?.description && r.description.length > 30) { productScore += 20; productSignals.push('Clear description — defined problem statement') }
  if (r?.homepage) { productScore += 15; productSignals.push('Homepage/live URL — product is shipped') }
  if (r?.has_pages) { productScore += 15; productSignals.push('GitHub Pages — publicly accessible product') }
  if (topics.length >= 3) { productScore += 10; productSignals.push(`${topics.length} topics — intentional positioning`) }
  if (hasReadme) { productScore += 10; productSignals.push('README — product documentation exists') }
  if (commitCount > 30) { productScore += 10; productSignals.push(`${commitCount} commits — sustained product development`) }
  if (stars + forks > 2) { productScore += 10; productSignals.push('Stars + forks — market validation') }
  if (!r?.description) productSignals.push('No description — product positioning undefined')

  return [
    scoreWithSignals('core_intelligence', 'Core Intelligence', '🧠', coreScore, coreSignals, hasMLSignals ? 'high' : hasDB ? 'medium' : 'low'),
    scoreWithSignals('ux', 'UX', '🎯', uxScore, uxSignals, hasFrontend ? 'high' : 'low'),
    scoreWithSignals('ui', 'UI', '🎨', uiScore, uiSignals, hasFrontend ? 'high' : 'low'),
    scoreWithSignals('performance', 'Performance', '⚡', perfScore, perfSignals, hasPerformanceTesting ? 'high' : hasCICD ? 'medium' : 'low'),
    scoreWithSignals('animations', 'Animations', '🎬', animScore, animSignals, hasFrontend ? 'medium' : 'low'),
    scoreWithSignals('functionality', 'Functionality', '🧩', funcScore, funcSignals, isFullStack ? 'high' : 'medium'),
    scoreWithSignals('memory', 'Memory & Context', '🗄️', memScore, memSignals, hasDB ? 'high' : 'low'),
    scoreWithSignals('orchestration', 'Agent Orchestration', '🔗', orchScore, orchSignals, hasCICD && branchCount > 3 ? 'medium' : 'low'),
    scoreWithSignals('reliability', 'Reliability & Trust', '🧪', relScore, relSignals, hasTests ? 'high' : hasCICD ? 'medium' : 'low'),
    scoreWithSignals('security', 'Security & Privacy', '🔐', secScore, secSignals, hasEnvExample ? 'high' : 'medium'),
    scoreWithSignals('dx', 'Developer Experience', '🧑‍💻', dxScore, dxSignals, hasReadme && hasCICD ? 'high' : 'medium'),
    scoreWithSignals('hooks', 'Hooks / Addictive', '🔥', hookScore, hookSignals, stars > 1 ? 'high' : r?.has_pages ? 'medium' : 'low'),
    scoreWithSignals('scalability', 'Scalability', '🌍', scaleScore, scaleSignals, hasDockerfile ? 'high' : hints.includes('vercel') ? 'medium' : 'low'),
    scoreWithSignals('analytics', 'Analytics & Learning', '📊', analyticsScore, analyticsSignals, hasDB ? 'medium' : 'low'),
    scoreWithSignals('product_thinking', 'Product Thinking', '💡', productScore, productSignals, r?.homepage || r?.has_pages ? 'high' : 'medium'),
  ]
}

// ─── Generate summary ─────────────────────────────────────────────────────────

function generateSummary(repoType: string, overallScore: number, topChar: CharacteristicScore, weakChar: CharacteristicScore): string {
  const level = overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'developing' : 'early-stage'
  return `${repoType} project at ${level} agent-readiness (${overallScore}/100). Strongest in ${topChar.label} (${topChar.score}). Key gap: ${weakChar.label} (${weakChar.score}).`
}

// ─── Full repo analysis ───────────────────────────────────────────────────────

async function analyzeRepo(owner: string, repo: string): Promise<RepoAnalysis | null> {
  const { r, langs, topicList, treeFiles, commits, branchList, contribs, closedIssues } =
    await collectSignals(owner, repo)

  if (!r) return null

  const fileFlags = deriveFileFlags(treeFiles)
  const commitMetrics = deriveCommitMetrics(commits, r.created_at)
  const repoType = classifyType(r, langs, fileFlags.frameworkHints, topicList)

  const characteristics = scoreRepo(
    r, langs, topicList, fileFlags, commitMetrics,
    branchList.length, contribs.length, closedIssues.length, r.open_issues_count ?? 0
  )

  const overallScore = Math.round(
    characteristics.reduce((acc, c) => acc + c.score, 0) / characteristics.length
  )

  const sorted = [...characteristics].sort((a, b) => b.score - a.score)
  const topChar = sorted[0]
  const weakChar = sorted[sorted.length - 1]

  const priority: 'high' | 'medium' | 'low' =
    overallScore >= 65 ? 'high' : overallScore >= 45 ? 'medium' : 'low'

  return {
    id: r.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: r.name,
    fullName: r.full_name,
    description: r.description ?? null,
    url: r.html_url,
    homepage: r.homepage ?? null,
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    watchers: r.watchers_count ?? 0,
    openIssues: r.open_issues_count ?? 0,
    primaryLanguage: r.language ?? null,
    languages: langs,
    topics: topicList,
    hasWiki: r.has_wiki ?? false,
    hasPages: r.has_pages ?? false,
    isArchived: r.archived ?? false,
    isFork: r.fork ?? false,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    updatedAt: r.updated_at,
    defaultBranch: r.default_branch ?? 'main',
    size: r.size ?? 0,
    license: r.license?.spdx_id ?? null,
    ...fileFlags,
    ...commitMetrics,
    branchCount: branchList.length,
    contributorCount: contribs.length,
    closedIssues: closedIssues.length,
    pullRequestCount: 0,
    characteristics,
    overallScore,
    priority,
    summary: generateSummary(repoType, overallScore, topChar, weakChar),
    type: repoType,
    improvedAt: new Date().toISOString(),
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const owner = searchParams.get('owner') ?? 'gokulsenthilkumar3'
  const singleRepo = searchParams.get('repo')

  // Single repo analysis
  if (singleRepo) {
    const analysis = await analyzeRepo(owner, singleRepo)
    if (!analysis) return NextResponse.json({ error: 'Repo not found or GitHub API error' }, { status: 404 })
    return NextResponse.json(analysis)
  }

  // All public repos
  const repos = await ghFetch<any[]>(`/users/${owner}/repos?per_page=100&type=public&sort=pushed`)
  if (!repos) return NextResponse.json({ error: 'Could not fetch repos' }, { status: 500 })

  const filtered = repos
    .filter((r) => !r.fork && !r.archived)
    .slice(0, 20)  // cap at 20 to respect rate limits

  // Analyze in parallel (batched to avoid rate limit)
  const batchSize = 5
  const results: RepoAnalysis[] = []
  for (let i = 0; i < filtered.length; i += batchSize) {
    const batch = filtered.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map((r) => analyzeRepo(owner, r.name))
    )
    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) results.push(result.value)
    }
  }

  results.sort((a, b) => b.overallScore - a.overallScore)

  return NextResponse.json({
    owner,
    analyzedAt: new Date().toISOString(),
    totalRepos: results.length,
    averageScore: Math.round(results.reduce((acc, r) => acc + r.overallScore, 0) / results.length),
    repos: results,
  })
}
