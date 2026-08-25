'use client'

import { useEffect, useMemo, useState } from 'react'
import { Github, Star, GitFork, Users, Activity, ExternalLink, RefreshCw, Code2, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const IsometricCommitGraph = dynamic(() => 
  import('@/components/effects/IsometricCommitGraph').then(mod => ({ default: mod.IsometricCommitGraph })),
  { ssr: false }
)

interface GitHubData {
  profile: {
    login: string
    name: string
    avatar_url: string
    bio: string
    public_repos: number
    followers: number
    following: number
    location: string
    blog: string
    created_at: string
  }
  stats: { totalRepos: number; totalStars: number; totalForks: number; followers: number }
  allRepos: Array<{
    id: number
    name: string
    description: string
    url: string
    stars: number
    forks: number
    language: string
    updatedAt: string
    topics: string[]
  }>
  languages: Array<{ name: string; count: number }>
  contributions: Record<string, number>
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Github }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  )
}

export function GitHubSection() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (bust = false) => {
    bust ? setRefreshing(true) : setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/github${bust ? `?bust=${Date.now()}` : ''}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load GitHub data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const topLanguages = useMemo(() => {
    if (!data) return []
    const total = data.languages.reduce((sum, lang) => sum + lang.count, 0) || 1
    return data.languages
      .map(lang => ({ ...lang, pct: Math.round((lang.count / total) * 100) }))
      .slice(0, 5)
  }, [data])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 animate-pulse h-60" />
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 animate-pulse h-60" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card/60 p-8 text-center">
        <Github className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground mb-4">GitHub data unavailable right now.</p>
        <button
          onClick={() => load(true)}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Retry
        </button>
      </div>
    )
  }

  const topRepos = [...data.allRepos]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">GitHub signal</p>
          <h2 className="text-3xl font-semibold tracking-tight">A quiet view of public work</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            A compact summary of repos, languages, and contribution rhythm without the heavy visual clutter.
          </p>
          
          <button
            onClick={() => load(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        <div className="shrink-0 relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center opacity-80 mix-blend-screen">
          <IsometricCommitGraph contributions={data.contributions} size={250} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Repos" value={data.stats.totalRepos} icon={Github} />
        <MetricCard label="Stars" value={data.stats.totalStars} icon={Star} />
        <MetricCard label="Forks" value={data.stats.totalForks} icon={GitFork} />
        <MetricCard label="Followers" value={data.stats.followers} icon={Users} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Code2 className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Top languages</h3>
          </div>
          <div className="space-y-4">
            {topLanguages.map(lang => (
              <div key={lang.name}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground tabular-nums">{lang.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Selected repositories</h3>
          </div>
          <div className="space-y-3">
            {topRepos.map(repo => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-border/60 bg-background/50 p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{repo.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>{repo.language || 'Mixed'}</span>
                  <span>{repo.stars} stars</span>
                  <span>{repo.forks} forks</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
