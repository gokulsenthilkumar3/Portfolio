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
  const days = 119 // 17 weeks * 7 days
  const today = new Date()
  const cells: { date: string; count: number }[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().substring(0, 10)
    cells.push({ date: key, count: contributions[key] || 0 })
  }

  const max = Math.max(...cells.map(c => c.count), 1)

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-white/5 border-white/5'
    const intensity = count / max
    if (intensity < 0.25) return 'bg-primary/30 border-primary/20'
    if (intensity < 0.5) return 'bg-primary/50 border-primary/40'
    if (intensity < 0.75) return 'bg-primary/70 border-primary/60'
    return 'bg-primary border-primary/80 shadow-[0_0_8px_rgba(99,102,241,0.6)]'
  }

  const weeks = []
  for (let w = 0; w < 17; w++) {
    weeks.push(cells.slice(w * 7, w * 7 + 7))
  }

  // Snake path animation across the top of the grid
  const snakePathX = [0, 100, 100, 250, 250, 400, 400, 0]
  const snakePathY = [0, 0, 40, 40, 80, 80, 0, 0]

  return (
    <div className="overflow-hidden relative group pb-4">
      <div className="flex gap-[6px] relative z-10 p-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[6px]">
            {week.map((cell, di) => (
              <motion.div
                key={cell.date}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.002, duration: 0.4, type: "spring" }}
                title={`${cell.date}: ${cell.count} events`}
                className={`w-[14px] h-[14px] rounded-[3px] border ${getColorClass(cell.count)} cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20 relative`}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Sleek Snake Animation Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        {/* Snake Head */}
        <motion.div
          className="absolute w-[14px] h-[14px] rounded-[3px] bg-primary z-10 shadow-[0_0_20px_rgba(99,102,241,1)]"
          animate={{
            x: [0, 300, 300, 600, 600, 900, 900, 0],
            y: [0, 0, 60, 60, 120, 120, 0, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Snake Body Trail */}
        <motion.div
          className="absolute w-[100px] h-[14px] bg-gradient-to-r from-transparent via-primary/50 to-primary rounded-full blur-[2px]"
          animate={{
            x: [-100, 200, 200, 500, 500, 800, 800, -100],
            y: [0, 0, 60, 60, 120, 120, 0, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-[4px]">
          <div className="w-[14px] h-[14px] rounded-[3px] bg-white/5 border border-white/5" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-primary/30 border border-primary/20" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-primary/50 border border-primary/40" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-primary/70 border border-primary/60" />
          <div className="w-[14px] h-[14px] rounded-[3px] bg-primary border border-primary/80 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
        </div>
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

      {/* Repositories removed as requested */}
    </div>
  )
}
