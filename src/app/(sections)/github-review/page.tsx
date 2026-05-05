'use client'

import { useState, useMemo, useEffect } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import {
  Brain, Target, Palette, Zap, Sparkles, Layers, Database,
  GitBranch, ShieldCheck, Lock, Code2, Flame, Globe2, BarChart3,
  Lightbulb, Github, ExternalLink, Search, ChevronDown, ChevronUp,
  RefreshCw, Star, GitFork, TrendingUp, CheckCircle2, XCircle,
  AlertCircle, GitCommit, Activity,
} from 'lucide-react'

const CHAR_ICONS: Record<string, React.ReactNode> = {
  core_intelligence: <Brain className="h-4 w-4" />,
  ux: <Target className="h-4 w-4" />,
  ui: <Palette className="h-4 w-4" />,
  performance: <Zap className="h-4 w-4" />,
  animations: <Sparkles className="h-4 w-4" />,
  functionality: <Layers className="h-4 w-4" />,
  memory: <Database className="h-4 w-4" />,
  orchestration: <GitBranch className="h-4 w-4" />,
  reliability: <ShieldCheck className="h-4 w-4" />,
  security: <Lock className="h-4 w-4" />,
  dx: <Code2 className="h-4 w-4" />,
  hooks: <Flame className="h-4 w-4" />,
  scalability: <Globe2 className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />,
  product_thinking: <Lightbulb className="h-4 w-4" />,
}

const CONF_COLOR: Record<string, string> = {
  high: 'text-green-400',
  medium: 'text-yellow-400',
  low: 'text-muted-foreground',
}

interface CharacteristicScore {
  id: string
  label: string
  icon: string
  score: number
  confidence: 'high' | 'medium' | 'low'
  signals: string[]
}

interface RepoAnalysis {
  id: string
  name: string
  fullName: string
  description: string | null
  url: string
  homepage: string | null
  stars: number
  forks: number
  openIssues: number
  primaryLanguage: string | null
  languages: Record<string, number>
  topics: string[]
  hasPages: boolean
  pushedAt: string
  size: number
  license: string | null
  hasTests: boolean
  hasCICD: boolean
  cicdProviders: string[]
  hasDockerfile: boolean
  hasReadme: boolean
  hasEnvExample: boolean
  frameworkHints: string[]
  commitCount: number
  recentCommitsLast30Days: number
  avgCommitsPerMonth: number
  contributorCount: number
  characteristics: CharacteristicScore[]
  overallScore: number
  priority: 'high' | 'medium' | 'low'
  summary: string
  type: string
  improvedAt: string
}

interface ReviewData {
  owner: string
  analyzedAt: string
  totalRepos: number
  averageScore: number
  repos: RepoAnalysis[]
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 45 ? 'bg-yellow-500' : 'bg-red-400'
  return (
    <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
    </div>
  )
}

function ScoreChip({ score }: { score: number }) {
  const color = score >= 70 ? 'text-green-400' : score >= 45 ? 'text-yellow-400' : 'text-red-400'
  return <span className={`font-bold tabular-nums ${color}`}>{score}</span>
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    high: 'bg-green-500/15 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    low: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  const labels: Record<string, string> = { high: 'Strong', medium: 'Developing', low: 'Early Stage' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${map[priority] ?? map.low}`}>
      {labels[priority] ?? priority}
    </span>
  )
}

function Signal({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${ok ? 'text-green-400' : 'text-muted-foreground/40'}`}>
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="border border-white/5 rounded-2xl bg-background/40 animate-pulse">
      <div className="p-5 flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/8" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/8 rounded w-1/3" />
          <div className="h-3 bg-white/5 rounded w-2/3" />
          <div className="flex gap-2 pt-1">
            <div className="h-5 bg-white/5 rounded w-16" />
            <div className="h-5 bg-white/5 rounded w-12" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <div className="h-1.5 bg-white/5 rounded" />
      </div>
    </div>
  )
}

export default function GithubReviewPage() {
  const [data, setData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'activity'>('score')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeChar, setActiveChar] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedSignals, setExpandedSignals] = useState<string | null>(null)

  async function load(bust = false) {
    bust ? setRefreshing(true) : setLoading(true)
    setError(null)
    try {
      const url = `/api/github-review${bust ? `?bust=${Date.now()}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const allChars = useMemo(() => {
    if (!data?.repos.length) return []
    return data.repos[0].characteristics.map(c => ({ id: c.id, label: c.label, icon: c.icon }))
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    let list = [...data.repos]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        r =>
          r.name.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.frameworkHints.some(f => f.toLowerCase().includes(q)) ||
          r.topics.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeChar) {
      list = [...list].sort(
        (a, b) =>
          (b.characteristics.find(c => c.id === activeChar)?.score ?? 0) -
          (a.characteristics.find(c => c.id === activeChar)?.score ?? 0)
      )
      return list
    }
    list.sort((a, b) => {
      if (sortBy === 'score') return b.overallScore - a.overallScore
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'activity') return b.recentCommitsLast30Days - a.recentCommitsLast30Days
      return 0
    })
    return list
  }, [data, search, sortBy, activeChar])

  // Loading
  if (loading) {
    return (
      <Section id="github-review">
        <div className="max-w-6xl mx-auto">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">AI Agent Intelligence Review</span>
          </div>
          <h2 className="text-4xl font-bold mb-8">GitHub Reviewer</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </Section>
    )
  }

  if (error || !data) {
    return (
      <Section id="github-review">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 py-24 text-muted-foreground">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm">Analysis failed: {error}</p>
          <button onClick={() => load(true)} className="px-4 py-2 rounded-lg border border-input text-sm hover:border-primary transition-colors">
            Retry
          </button>
        </div>
      </Section>
    )
  }

  return (
    <Section id="github-review">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <AnimatedSection animation="fadeIn">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Live GitHub Intelligence Review</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">GitHub Reviewer</h2>
              <p className="text-muted-foreground max-w-2xl text-sm">
                <strong className="text-foreground">{data.totalRepos} repos</strong> auto-analyzed across{' '}
                <strong className="text-foreground">15 AI agent characteristics</strong>.
                Scores computed live from GitHub signals — no hardcoded values.
              </p>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all flex-shrink-0"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Re-analyzing…' : 'Refresh'}
            </button>
          </div>
        </AnimatedSection>

        {/* Stats bar */}
        <AnimatedSection animation="slideUp" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Repos Analyzed', value: data.totalRepos, icon: <Github className="h-4 w-4" /> },
              { label: 'Avg Agent Score', value: `${data.averageScore}/100`, icon: <TrendingUp className="h-4 w-4" /> },
              { label: 'Strong Repos', value: data.repos.filter(r => r.overallScore >= 65).length, icon: <Target className="h-4 w-4" /> },
              { label: 'Analyzed At', value: new Date(data.analyzedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), icon: <Activity className="h-4 w-4" /> },
            ].map(s => (
              <div key={s.label} className="bg-background/40 backdrop-blur-md border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{s.icon}{s.label}</div>
                <div className="text-2xl font-bold font-mono">{s.value}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Characteristic filter pills */}
        <AnimatedSection animation="slideUp" delay={0.15}>
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Sort by Characteristic</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveChar(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeChar === null ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/8 text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              {allChars.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveChar(activeChar === c.id ? null : c.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeChar === c.id ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/8 text-muted-foreground hover:text-foreground hover:border-white/20'
                  }`}
                >
                  <span>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Search + Sort */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repos, frameworks, topics…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              {(['score', 'activity', 'name'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                    sortBy === s ? 'bg-primary/20 border-primary/40 text-primary' : 'border-input text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Repo Cards */}
        <div className="space-y-4">
          {filtered.map((repo, index) => {
            const isOpen = expanded === repo.name
            const totalLang = Object.values(repo.languages).reduce((a, b) => a + b, 0)

            return (
              <AnimatedSection key={repo.id} animation="slideUp" delay={0.04 * index}>
                <div
                  className={`bg-background/40 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-primary/30' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Card header */}
                  <button
                    className="w-full text-left p-5 flex items-start gap-4"
                    onClick={() => setExpanded(isOpen ? null : repo.name)}
                    aria-expanded={isOpen}
                  >
                    {/* Score circle */}
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center">
                      <ScoreChip score={repo.overallScore} />
                      <span className="text-[9px] text-muted-foreground mt-0.5">/ 100</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold">{repo.name}</h3>
                        <PriorityBadge priority={repo.priority} />
                        <span className="text-xs text-muted-foreground border border-white/8 px-2 py-0.5 rounded-full">{repo.type}</span>
                        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="h-3 w-3" />{repo.stars}
                          <GitFork className="h-3 w-3" />{repo.forks}
                          {repo.recentCommitsLast30Days > 0 && (
                            <><GitCommit className="h-3 w-3" />{repo.recentCommitsLast30Days}/mo</>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{repo.summary}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {repo.frameworkHints.slice(0, 6).map(f => (
                          <span key={f} className="px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-[10px] font-medium text-primary">{f}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-center text-muted-foreground">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {/* Mini score strip */}
                  {!isOpen && (
                    <div className="px-5 pb-4">
                      <div className="flex gap-0.5">
                        {repo.characteristics.map(c => {
                          const col = c.score >= 70 ? 'bg-green-500' : c.score >= 45 ? 'bg-yellow-500' : 'bg-red-400'
                          return (
                            <div key={c.id} className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden" title={`${c.label}: ${c.score}`}>
                              <div className={`h-full rounded-full ${col}`} style={{ width: `${c.score}%` }} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Expanded panel */}
                  {isOpen && (
                    <div className="px-5 pb-6 border-t border-white/5">
                      <div className="pt-5 grid md:grid-cols-2 gap-8">

                        {/* Left: scores */}
                        <div>
                          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            15 Characteristics
                          </h4>
                          <div className="space-y-2.5">
                            {repo.characteristics.map(c => (
                              <div key={c.id}>
                                <button
                                  className="w-full"
                                  onClick={e => { e.stopPropagation(); setExpandedSignals(expandedSignals === `${repo.id}-${c.id}` ? null : `${repo.id}-${c.id}`) }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      {CHAR_ICONS[c.id]}<span>{c.label}</span>
                                      <span className={`text-[10px] ${CONF_COLOR[c.confidence]}`}>
                                        ({c.confidence})
                                      </span>
                                    </div>
                                    <ScoreChip score={c.score} />
                                  </div>
                                  <ScoreBar score={c.score} />
                                </button>
                                {/* Signals dropdown */}
                                {expandedSignals === `${repo.id}-${c.id}` && c.signals.length > 0 && (
                                  <div className="mt-1.5 ml-5 space-y-1">
                                    {c.signals.map((sig, si) => (
                                      <p key={si} className="text-[10px] text-muted-foreground flex gap-1.5">
                                        <span className="text-primary mt-0.5">·</span>{sig}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: detail */}
                        <div className="space-y-5">
                          {repo.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{repo.description}</p>
                          )}

                          {/* Signals */}
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Repo Signals</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                              <Signal ok={repo.hasCICD} label="CI/CD" />
                              <Signal ok={repo.hasTests} label="Tests" />
                              <Signal ok={repo.hasDockerfile} label="Docker" />
                              <Signal ok={!!repo.license} label="License" />
                              <Signal ok={repo.hasReadme} label="README" />
                              <Signal ok={repo.hasEnvExample} label=".env.example" />
                              <Signal ok={repo.hasPages} label="Live Deploy" />
                            </div>
                            {repo.cicdProviders.length > 0 && (
                              <p className="text-[10px] text-muted-foreground mt-1.5">
                                CI: {repo.cicdProviders.join(', ')}
                              </p>
                            )}
                          </div>

                          {/* Language breakdown */}
                          {Object.keys(repo.languages).length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Languages</h4>
                              <div className="space-y-1.5">
                                {Object.entries(repo.languages)
                                  .sort(([, a], [, b]) => b - a)
                                  .slice(0, 5)
                                  .map(([lang, bytes]) => {
                                    const pct = totalLang ? Math.round((bytes / totalLang) * 100) : 0
                                    return (
                                      <div key={lang} className="flex items-center gap-2 text-xs">
                                        <span className="w-20 text-muted-foreground truncate">{lang}</span>
                                        <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                          <div className="h-full rounded-full bg-primary/60" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-muted-foreground w-8 text-right tabular-nums">{pct}%</span>
                                      </div>
                                    )
                                  })}
                              </div>
                            </div>
                          )}

                          {/* Commit stats */}
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span><strong className="text-foreground tabular-nums">{repo.commitCount}</strong> total commits</span>
                            <span><strong className="text-foreground tabular-nums">{repo.recentCommitsLast30Days}</strong> last 30d</span>
                            <span><strong className="text-foreground tabular-nums">{repo.avgCommitsPerMonth}</strong>/mo avg</span>
                          </div>

                          {/* Topics */}
                          {repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {repo.topics.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded-full border border-white/8 text-[10px] text-muted-foreground">#{t}</span>
                              ))}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex gap-3 pt-1 flex-wrap">
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                            >
                              <Github className="h-4 w-4" />GitHub<ExternalLink className="h-3 w-3" />
                            </a>
                            {repo.homepage && (
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors"
                              >
                                <ExternalLink className="h-4 w-4" />Live
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-4 opacity-30" />
            <p>No repos match your search.</p>
          </div>
        )}

        {/* Legend */}
        <AnimatedSection animation="fadeIn" delay={0.3}>
          <div className="mt-10 p-5 rounded-xl border border-white/5 bg-background/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">How Scores Work</p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" />70–100 · Strong</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500" />45–69 · Developing</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" />0–44 · Gap</span>
              <span className="ml-auto text-[10px] opacity-60">Signals: dependency graph · file tree · README · CI presence · commit velocity · language bytes · stars/forks · topics</span>
            </div>
            <p className="text-[10px] text-muted-foreground/50 mt-2">Click any characteristic bar to see the exact signals that drove that score.</p>
          </div>
        </AnimatedSection>
      </div>
    </Section>
  )
}
