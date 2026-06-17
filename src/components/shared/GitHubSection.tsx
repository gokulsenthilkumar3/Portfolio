'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Star, GitFork, Users, BookOpen, Code2, Activity, ExternalLink, TrendingUp } from 'lucide-react'

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
  stats: {
    totalRepos: number
    totalStars: number
    totalForks: number
    followers: number
  }
  topRepos: Array<{
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

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  React: '#61dafb',
  PHP: '#777bb4',
  HTML: '#e34f26',
  CSS: '#1572b6',
  'Jupyter Notebook': '#f37626',
  Shell: '#89e051',
  Go: '#00add8',
}

function ContributionHeatmap({ contributions }: { contributions: Record<string, number> }) {
  const days = 84 // 12 weeks
  const today = new Date()
  const cells: { date: string; count: number }[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().substring(0, 10)
    cells.push({ date: key, count: contributions[key] || 0 })
  }

  const max = Math.max(...cells.map(c => c.count), 1)

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(99,102,241,0.08)'
    const intensity = count / max
    if (intensity < 0.25) return 'rgba(99,102,241,0.25)'
    if (intensity < 0.5) return 'rgba(99,102,241,0.5)'
    if (intensity < 0.75) return 'rgba(99,102,241,0.75)'
    return 'rgba(99,102,241,1)'
  }

  const weeks = []
  for (let w = 0; w < 12; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7))
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell, di) => (
              <motion.div
                key={cell.date}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.004, duration: 0.3 }}
                title={`${cell.date}: ${cell.count} events`}
                className="w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125"
                style={{ backgroundColor: getColor(cell.count) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <span>Less</span>
        {[0.08, 0.25, 0.5, 0.75, 1].map((o, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(99,102,241,${o})` }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: any
  label: string
  value: string | number
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="relative group overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 70%)` }} />
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-black font-display" style={{ color }}>{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function GitHubSection() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/github')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <Github size={20} className="absolute inset-0 m-auto text-primary" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <div className="text-center">
          <Github size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">GitHub data unavailable</p>
        </div>
      </div>
    )
  }

  const totalLang = data.languages.reduce((a, l) => a + l.count, 0)

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={BookOpen} label="Public Repos" value={data.stats.totalRepos} color="#6366f1" delay={0.1} />
        <StatCard icon={Star} label="Total Stars" value={data.stats.totalStars} color="#f59e0b" delay={0.2} />
        <StatCard icon={GitFork} label="Total Forks" value={data.stats.totalForks} color="#10b981" delay={0.3} />
        <StatCard icon={Users} label="Followers" value={data.stats.followers} color="#ec4899" delay={0.4} />
      </div>

      {/* Language Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Code2 size={16} className="text-primary" />
          <h4 className="font-semibold text-sm">Languages Used</h4>
        </div>
        <div className="space-y-3">
          {data.languages.map((lang, i) => {
            const pct = Math.round((lang.count / totalLang) * 100)
            const color = LANG_COLORS[lang.name] || '#6366f1'
            return (
              <div key={lang.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-medium">{lang.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Contribution Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Activity size={16} className="text-primary" />
          <h4 className="font-semibold text-sm">Activity (Last 12 Weeks)</h4>
        </div>
        <ContributionHeatmap contributions={data.contributions} />
      </motion.div>

      {/* Top Repos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-primary" />
          <h4 className="font-semibold text-sm">Top Repositories</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {data.topRepos.map((repo, i) => {
            const color = LANG_COLORS[repo.language] || '#6366f1'
            return (
              <motion.a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/3 backdrop-blur-xl p-4 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{repo.name}</p>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{repo.description}</p>
                    )}
                  </div>
                  <ExternalLink size={12} className="text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star size={10} />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={10} />
                    {repo.forks}
                  </span>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
