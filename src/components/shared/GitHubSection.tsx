'use client'
/* eslint-disable react/forbid-dom-props, react/forbid-component-props */

import { useEffect, useState, useCallback, memo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Star, GitFork, Users, BookOpen, Code2, Activity, Gamepad2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const GTAGame = dynamic(() => import('./GTAGame').then(m => ({ default: m.GTAGame })), {
  ssr: false,
  loading: () => null,
})

interface GitHubData {
  profile: {
    login: string; name: string; avatar_url: string; bio: string
    public_repos: number; followers: number; following: number
    location: string; blog: string; created_at: string
  }
  stats: { totalRepos: number; totalStars: number; totalForks: number; followers: number }
  allRepos: Array<{
    id: number; name: string; description: string; url: string
    stars: number; forks: number; language: string; updatedAt: string; topics: string[]
  }>
  languages: Array<{ name: string; count: number }>
  contributions: Record<string, number>
}

// Extend CSSProperties to allow CSS custom properties
type CSSWithVars = React.CSSProperties & Record<`--${string}`, string | number>

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3776ab',
  React: '#61dafb', PHP: '#777bb4', HTML: '#e34f26', CSS: '#1572b6',
  'Jupyter Notebook': '#f37626', Shell: '#89e051', Go: '#00add8',
}

const ContributionHeatmap = memo(function ContributionHeatmap({
  contributions, createdAt,
}: { contributions: Record<string, number>; createdAt?: string }) {
  const [viewMode, setViewMode] = useState<'12weeks' | 'alltime'>('12weeks')

  const cells = useCallback(() => {
    const today = new Date()
    const result: { date: string; count: number }[] = []
    const days = viewMode === '12weeks' ? 84
      : Math.min(
          Math.ceil((today.getTime() - (createdAt ? new Date(createdAt) : new Date('2020-01-01')).getTime()) / 86400000),
          1825
        )
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().substring(0, 10)
      result.push({ date: key, count: contributions[key] ?? 0 })
    }
    return result
  }, [viewMode, contributions, createdAt])()

  const max   = Math.max(...cells.map(c => c.count), 1)
  const total = cells.reduce((a, c) => a + c.count, 0)

  const getColor = (count: number) => {
    if (!count) return 'rgba(150,150,150,0.1)'
    const t = count / max
    if (t < 0.25) return 'rgba(52,199,89,0.4)'
    if (t < 0.50) return 'rgba(52,199,89,0.6)'
    if (t < 0.75) return 'rgba(52,199,89,0.8)'
    return 'rgba(52,199,89,1)'
  }

  const weeks: { date: string; count: number }[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{total.toLocaleString()}</span> contributions
          {viewMode === 'alltime' && createdAt && <span> since {new Date(createdAt).getFullYear()}</span>}
        </div>
        <div className="flex rounded-lg border border-white/10 overflow-hidden text-[10px]">
          {(['12weeks', 'alltime'] as const).map(m => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1 transition-colors ${viewMode === m ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {m === '12weeks' ? 'Last 12 Weeks' : 'All Time'}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  title={`${cell.date}: ${cell.count} contributions`}
                  className="w-3 h-3 rounded-[3px] cursor-pointer transition-transform hover:scale-125"
                  style={{ backgroundColor: getColor(cell.count) }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          {['rgba(150,150,150,0.1)','rgba(52,199,89,0.4)','rgba(52,199,89,0.6)','rgba(52,199,89,0.8)','rgba(52,199,89,1)'].map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
})

// FIX: replace `icon: any` with proper `icon: LucideIcon` type
const StatCard = memo(function StatCard({
  icon: Icon, label, value, color, delay,
}: { icon: LucideIcon; label: string; value: string | number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="relative group overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 70%)` }}
      />
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color } as React.CSSProperties} />
        </div>
        <div>
          <p className="text-2xl font-black font-display" style={{ color } as React.CSSProperties}>{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  )
})

export function GitHubSection() {
  const [data, setData]       = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [gameOpen, setGameOpen] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch('/api/github', { signal: ctrl.signal })
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d) })
      .catch(e => { if (e.name !== 'AbortError') setError(e.message) })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [])

  if (loading) return (
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

  if (error || !data) return (
    <div className="flex items-center justify-center py-12 text-muted-foreground">
      <div className="text-center">
        <Github size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">GitHub data unavailable</p>
      </div>
    </div>
  )

  const totalLang = data.languages.reduce((a, l) => a + l.count, 0)

  return (
    <>
      <AnimatePresence>
        {gameOpen && <GTAGame onClose={() => setGameOpen(false)} />}
      </AnimatePresence>

      <div className="space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={BookOpen} label="Public Repos"  value={data.stats.totalRepos}  color="#6366f1" delay={0.1} />
          <StatCard icon={Star}     label="Total Stars"   value={data.stats.totalStars}   color="#f59e0b" delay={0.2} />
          <StatCard icon={GitFork}  label="Total Forks"   value={data.stats.totalForks}   color="#10b981" delay={0.3} />
          <StatCard icon={Users}    label="Followers"      value={data.stats.followers}    color="#ec4899" delay={0.4} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Code2 size={16} className="text-primary" />
            <h3 className="font-semibold text-sm">Languages Used</h3>
          </div>
          <div className="space-y-3">
            {data.languages.map((lang, i) => {
              const pct   = Math.round((lang.count / totalLang) * 100)
              const color = LANG_COLORS[lang.name] ?? '#6366f1'
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative rounded-3xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h3 className="font-semibold text-sm">Activity</h3>
              {data.profile.created_at && (
                <span className="text-[10px] text-muted-foreground/60 font-mono">
                  synced since {new Date(data.profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            <motion.button
              onClick={() => setGameOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Play Commit City"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e94560]/40 bg-[#e94560]/10 text-[#e94560] text-[10px] font-bold font-mono tracking-wider hover:bg-[#e94560]/20 transition-all"
            >
              <Gamepad2 size={12} />
              COMMIT CITY
            </motion.button>
          </div>
          <ContributionHeatmap contributions={data.contributions} createdAt={data.profile.created_at} />
        </motion.div>
      </div>
    </>
  )
}
