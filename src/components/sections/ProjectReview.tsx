'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Brain, Target, Palette, Zap, Sparkles, Layers, Database,
  GitBranch, ShieldCheck, Lock, Code2, Flame, Globe2, BarChart3,
  Lightbulb, Github, ExternalLink, Search, ChevronDown, ChevronUp,
  RefreshCw, Star, GitFork, Clock, ArrowUpRight, AlertCircle,
  CheckCircle2, TrendingUp, Eye, Package, Wifi, WifiOff
} from 'lucide-react'
import type { RepoAnalysis, CharacteristicScore } from '@/app/api/github-review/route'

// ─── Characteristic icon map ──────────────────────────────────────────────────

const CHAR_ICONS: Record<string, React.ReactNode> = {
  core_intelligence: <Brain className="h-3.5 w-3.5" />,
  ux: <Target className="h-3.5 w-3.5" />,
  ui: <Palette className="h-3.5 w-3.5" />,
  performance: <Zap className="h-3.5 w-3.5" />,
  animations: <Sparkles className="h-3.5 w-3.5" />,
  functionality: <Layers className="h-3.5 w-3.5" />,
  memory: <Database className="h-3.5 w-3.5" />,
  orchestration: <GitBranch className="h-3.5 w-3.5" />,
  reliability: <ShieldCheck className="h-3.5 w-3.5" />,
  security: <Lock className="h-3.5 w-3.5" />,
  dx: <Code2 className="h-3.5 w-3.5" />,
  hooks: <Flame className="h-3.5 w-3.5" />,
  scalability: <Globe2 className="h-3.5 w-3.5" />,
  analytics: <BarChart3 className="h-3.5 w-3.5" />,
  product_thinking: <Lightbulb className="h-3.5 w-3.5" />,
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-emerald-500'
    : score >= 45 ? 'bg-amber-400'
    : 'bg-rose-400'
  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#f43f5e'
  const r = (size / 2) - 5
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="rotate-90" fill={color}
        fontSize="13" fontWeight="700" fontFamily="monospace"
        transform={`rotate(90, ${size/2}, ${size/2})`}>
        {score}
      </text>
    </svg>
  )
}

function ConfidenceDot({ confidence }: { confidence: 'high' | 'medium' | 'low' }) {
  const map = {
    high: 'bg-emerald-500 title="High confidence"',
    medium: 'bg-amber-400',
    low: 'bg-white/20',
  }
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${map[confidence] ?? map.low} flex-shrink-0 mt-0.5`} title={`${confidence} confidence`} />
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    high: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    low: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[priority] ?? map.low} uppercase tracking-wide`}>
      {priority}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/[0.06]" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-white/[0.06] rounded-md w-1/3" />
          <div className="h-3 bg-white/[0.04] rounded-md w-2/3" />
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-5 w-16 bg-white/[0.04] rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-white/[0.04]" />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProjectReview() {
  const [repos, setRepos] = useState<RepoAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyzingRepo, setAnalyzingRepo] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'pushed' | 'stars' | 'name'>('score')
  const [activeChar, setActiveChar] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [summary, setSummary] = useState<{ totalRepos: number; averageScore: number; analyzedAt: string } | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/github-review')
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      setRepos(data.repos ?? [])
      setSummary({ totalRepos: data.totalRepos, averageScore: data.averageScore, analyzedAt: data.analyzedAt })
      setLastFetched(new Date())
    } catch (e: any) {
      setError(e.message ?? 'Failed to fetch repos')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshRepo = useCallback(async (name: string) => {
    setAnalyzingRepo(name)
    try {
      const res = await fetch(`/api/github-review?repo=${name}`)
      if (!res.ok) throw new Error('Failed')
      const updated: RepoAnalysis = await res.json()
      setRepos((prev) => prev.map((r) => (r.name === name ? updated : r)))
    } catch {}
    finally { setAnalyzingRepo(null) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Characteristic definitions (UI labels only — scoring is all server-side)
  const CHARS = [
    { id: 'core_intelligence', label: 'Intelligence' },
    { id: 'ux', label: 'UX' },
    { id: 'ui', label: 'UI' },
    { id: 'performance', label: 'Performance' },
    { id: 'animations', label: 'Animations' },
    { id: 'functionality', label: 'Functionality' },
    { id: 'memory', label: 'Memory' },
    { id: 'orchestration', label: 'Orchestration' },
    { id: 'reliability', label: 'Reliability' },
    { id: 'security', label: 'Security' },
    { id: 'dx', label: 'Dev Exp' },
    { id: 'hooks', label: 'Hooks' },
    { id: 'scalability', label: 'Scalability' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'product_thinking', label: 'Product' },
  ]

  const getScore = (repo: RepoAnalysis, charId: string) =>
    repo.characteristics.find((c) => c.id === charId)?.score ?? 0

  const filtered = repos
    .filter((r) => {
      if (search) {
        const q = search.toLowerCase()
        return (
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q) ||
          r.primaryLanguage?.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.overallScore - a.overallScore
      if (sortBy === 'stars') return b.stars - a.stars
      if (sortBy === 'pushed') return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
      return a.name.localeCompare(b.name)
    })

  const sortedByActiveChar = activeChar
    ? [...filtered].sort((a, b) => getScore(b, activeChar) - getScore(a, activeChar))
    : filtered

  return (
    <section id="project-review" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em]">
              Live GitHub Intelligence Review
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-3">Project Review</h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Every repo is analyzed live from GitHub — no hardcoded scores. The engine reads{' '}
            <strong className="text-foreground">commits, file structure, CI/CD, tests, frameworks, and metadata</strong>{' '}
            to rate each of <strong className="text-foreground">15 agent characteristics</strong> in real time.
          </p>
        </div>

        {/* Stats bar */}
        {summary && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Repos analyzed', value: summary.totalRepos, icon: <Package className="h-4 w-4" /> },
              { label: 'Portfolio score', value: `${summary.averageScore}/100`, icon: <TrendingUp className="h-4 w-4" /> },
              { label: 'High priority', value: repos.filter((r) => r.priority === 'high').length, icon: <Target className="h-4 w-4" /> },
              { label: 'Characteristics', value: 15, icon: <Layers className="h-4 w-4" /> },
            ].map((s) => (
              <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{s.icon}{s.label}</div>
                <div className="text-2xl font-bold font-mono">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Char filter pills */}
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Sort / Filter by Characteristic</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveChar(null)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                activeChar === null ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/8 text-muted-foreground hover:border-white/20'
              }`}
            >
              All
            </button>
            {CHARS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChar(activeChar === c.id ? null : c.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  activeChar === c.id ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/8 text-muted-foreground hover:border-white/20'
                }`}
              >
                {CHAR_ICONS[c.id]}
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search + Sort + Refresh */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repos, language, type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm"
            />
          </div>
          <div className="flex gap-2 items-center">
            {(['score', 'pushed', 'stars', 'name'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                  sortBy === s ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/8 text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-white/8 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
              title="Re-analyze all repos"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status line */}
        <div className="flex items-center gap-2 mb-6 text-[11px] text-muted-foreground">
          {loading ? (
            <><Wifi className="h-3.5 w-3.5 animate-pulse text-primary" /> Analyzing repos from GitHub…</>
          ) : error ? (
            <><WifiOff className="h-3.5 w-3.5 text-rose-400" /> <span className="text-rose-400">{error}</span></>
          ) : lastFetched ? (
            <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Last analyzed {lastFetched.toLocaleTimeString()} — {sortedByActiveChar.length} repos</>
          ) : null}
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-4 text-rose-400/50" />
            <p className="text-sm mb-4">{error}</p>
            <button onClick={fetchAll} className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">Retry</button>
          </div>
        )}

        {/* Skeleton loaders */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Repo cards */}
        {!loading && !error && (
          <div className="space-y-3">
            {sortedByActiveChar.map((repo) => {
              const isExpanded = expanded === repo.id
              const isRefreshing = analyzingRepo === repo.name

              return (
                <div
                  key={repo.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'border-primary/30 bg-white/[0.04]' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  {/* Card header — always visible */}
                  <button
                    className="w-full text-left p-5 flex items-start gap-4"
                    onClick={() => setExpanded(isExpanded ? null : repo.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex-shrink-0">
                      <ScoreRing score={repo.overallScore} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-semibold text-sm">{repo.name}</span>
                        <PriorityBadge priority={repo.priority} />
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/8 text-muted-foreground">
                          {repo.type}
                        </span>
                        {repo.primaryLanguage && (
                          <span className="text-[10px] text-muted-foreground">{repo.primaryLanguage}</span>
                        )}
                        {/* Live stats */}
                        <span className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stars}</span>
                          <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks}</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{repo.watchers}</span>
                          <span className="flex items-center gap-1 hidden sm:flex">
                            <Clock className="h-3 w-3" />
                            {new Date(repo.pushedAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                          </span>
                        </span>
                      </div>

                      {repo.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{repo.description}</p>
                      )}

                      {/* Mini characteristic bar strip */}
                      <div className="flex gap-0.5">
                        {CHARS.map((c) => {
                          const score = getScore(repo, c.id)
                          const col = score >= 70 ? 'bg-emerald-500' : score >= 45 ? 'bg-amber-400' : 'bg-rose-400'
                          const isActive = activeChar === c.id
                          return (
                            <div
                              key={c.id}
                              title={`${c.label}: ${score}`}
                              className={`flex-1 h-2 rounded-full overflow-hidden transition-all ${
                                isActive ? 'h-3 opacity-100' : 'bg-white/[0.06]'
                              }`}
                            >
                              <div
                                className={`h-full rounded-full ${col} ${!isActive ? '' : 'ring-1 ring-white/20'}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-center flex items-center gap-2">
                      {isRefreshing && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-white/5 px-5 pb-6">
                      <div className="pt-5 grid md:grid-cols-2 gap-6">

                        {/* Left: Characteristic breakdown */}
                        <div>
                          <h4 className="text-xs font-semibold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                            <BarChart3 className="h-3.5 w-3.5" /> Characteristics
                          </h4>
                          <div className="space-y-2.5">
                            {repo.characteristics
                              .sort((a, b) => b.score - a.score)
                              .map((c) => (
                                <div key={c.id}>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                      <ConfidenceDot confidence={c.confidence} />
                                      {CHAR_ICONS[c.id]}
                                      <span>{c.label}</span>
                                    </div>
                                    <span className={`text-[11px] font-bold tabular-nums ${
                                      c.score >= 70 ? 'text-emerald-400' : c.score >= 45 ? 'text-amber-400' : 'text-rose-400'
                                    }`}>
                                      {c.score}
                                    </span>
                                  </div>
                                  <ScoreBar score={c.score} />
                                  {/* Signals tooltip on hover — shown inline */}
                                  <div className="mt-0.5 flex flex-wrap gap-1">
                                    {c.signals.slice(0, 2).map((sig, i) => (
                                      <span key={i} className="text-[9px] text-muted-foreground/60 leading-tight">
                                        {i === 0 ? '↳' : '·'} {sig}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Right: Metadata + signals */}
                        <div className="space-y-5">
                          {/* Framework + tech signals */}
                          <div>
                            <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <Code2 className="h-3.5 w-3.5" /> Detected Stack
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {repo.frameworkHints.map((h) => (
                                <span key={h} className="px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-[10px] font-medium text-primary">
                                  {h}
                                </span>
                              ))}
                              {repo.primaryLanguage && (
                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium text-muted-foreground">
                                  {repo.primaryLanguage}
                                </span>
                              )}
                              {repo.frameworkHints.length === 0 && <span className="text-xs text-muted-foreground/60">No frameworks detected</span>}
                            </div>
                          </div>

                          {/* Infra flags */}
                          <div>
                            <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <ShieldCheck className="h-3.5 w-3.5" /> Infrastructure Signals
                            </h4>
                            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                              {[
                                { label: 'Tests', value: repo.hasTests, detail: repo.testFileCount > 0 ? `${repo.testFileCount} files` : undefined },
                                { label: 'CI/CD', value: repo.hasCICD, detail: repo.cicdProviders.join(', ') || undefined },
                                { label: 'README', value: repo.hasReadme },
                                { label: '.env example', value: repo.hasEnvExample },
                                { label: 'Docker', value: repo.hasDockerfile },
                                { label: 'Live URL', value: !!(repo.homepage || repo.hasPages) },
                              ].map((f) => (
                                <div key={f.label} className="flex items-center gap-1.5">
                                  {f.value
                                    ? <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                    : <AlertCircle className="h-3 w-3 text-white/20 flex-shrink-0" />
                                  }
                                  <span className={f.value ? 'text-foreground/80' : 'text-muted-foreground/50'}>
                                    {f.label}
                                    {f.detail && <span className="text-muted-foreground/60 ml-1">({f.detail})</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Commit activity */}
                          <div>
                            <h4 className="text-xs font-semibold mb-3 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                              <GitBranch className="h-3.5 w-3.5" /> Activity
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              {[
                                { label: 'Commits', value: repo.commitCount },
                                { label: 'Last 30d', value: repo.recentCommitsLast30Days },
                                { label: 'Avg/mo', value: repo.avgCommitsPerMonth },
                              ].map((s) => (
                                <div key={s.label} className="bg-white/[0.03] rounded-lg p-2 border border-white/5">
                                  <div className="text-lg font-bold font-mono tabular-nums">{s.value}</div>
                                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Summary */}
                          <p className="text-xs text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                            {repo.summary}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2 pt-1">
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                            >
                              <Github className="h-3.5 w-3.5" /> GitHub <ExternalLink className="h-3 w-3" />
                            </a>
                            {(repo.homepage || repo.hasPages) && (
                              <a
                                href={repo.homepage ?? `https://gokulsenthilkumar3.github.io/${repo.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs font-medium hover:text-foreground transition-colors"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5" /> Live
                              </a>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); refreshRepo(repo.name) }}
                              disabled={isRefreshing}
                              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-muted-foreground text-xs hover:text-foreground transition-colors disabled:opacity-50"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                              Re-analyze
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {sortedByActiveChar.length === 0 && (
              <div className="flex flex-col items-center py-16 text-muted-foreground">
                <Brain className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm">No repos match your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Legend + last analyzed */}
        {!loading && !error && (
          <div className="mt-8 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="flex flex-wrap items-center gap-5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 70–100 Strong</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 45–69 Developing</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> 0–44 Gap</span>
              <span className="flex items-center gap-1.5 ml-auto">
                <ConfidenceDot confidence="high" /> High · <ConfidenceDot confidence="medium" /> Medium · <ConfidenceDot confidence="low" /> Low confidence
              </span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3" />
                Scores computed live from GitHub API — no hardcoded values
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
