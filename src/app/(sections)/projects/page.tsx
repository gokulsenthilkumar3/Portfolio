'use client'

import { useState, useMemo, useEffect } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/effects/MagneticButton'
import {
  Search, ExternalLink, Github, Filter, Terminal, Globe, Database,
  Cpu, Brain, Flame, Zap, Code2, RefreshCw, Star, GitFork,
  Clock, AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface DynamicProject {
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

const CATEGORIES = ['all', 'web', 'fullstack', 'ai', 'iot', 'other']

function getTechIcon(tech: string, className = 'h-4 w-4') {
  const t = tech.toLowerCase()
  if (t.includes('react') || t.includes('next')) return <Code2 className={cn(className, 'text-blue-400')} />
  if (t.includes('node') || t.includes('express')) return <Zap className={cn(className, 'text-green-400')} />
  if (t.includes('python') || t.includes('django') || t.includes('flask') || t.includes('fastapi')) return <Terminal className={cn(className, 'text-yellow-400')} />
  if (t.includes('php') || t.includes('laravel')) return <Globe className={cn(className, 'text-indigo-400')} />
  if (t.includes('sql') || t.includes('prisma') || t.includes('drizzle')) return <Database className={cn(className, 'text-orange-400')} />
  if (t.includes('mongo') || t.includes('supabase') || t.includes('firebase')) return <Database className={cn(className, 'text-green-500')} />
  if (t.includes('raspberry') || t.includes('iot') || t.includes('arduino')) return <Cpu className={cn(className, 'text-red-400')} />
  if (t.includes('ai') || t.includes('ml') || t.includes('learning') || t.includes('neural')) return <Brain className={cn(className, 'text-purple-400')} />
  if (t.includes('firebase')) return <Flame className={cn(className, 'text-orange-500')} />
  return <Code2 className={cn(className, 'text-muted-foreground')} />
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-500',
    completed: 'bg-blue-500',
    archived: 'bg-gray-500',
  }
  const label: Record<string, string> = {
    active: 'Active',
    completed: 'Completed',
    archived: 'Archived',
  }
  return (
    <Badge variant="secondary" className="text-[10px] bg-background/60 backdrop-blur-md border-white/5">
      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${map[status] ?? 'bg-gray-500'}`} />
      {label[status] ?? status}
    </Badge>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-background/40 overflow-hidden animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/8 rounded w-2/3" />
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="h-3 bg-white/5 rounded w-4/5" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-white/5 rounded w-16" />
          <div className="h-6 bg-white/5 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DynamicProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  async function load(bust = false) {
    bust ? setRefreshing(true) : setLoading(true)
    setError(null)
    try {
      const url = `/api/projects${bust ? `?bust=${Date.now()}` : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`GitHub API returned ${res.status}`)
      const data = await res.json()
      setProjects(data.projects ?? [])
      setFetchedAt(data.fetchedAt)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = [...projects]
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.some(t => t.toLowerCase().includes(q)) ||
          p.topics.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [projects, selectedCategory, searchQuery])

  return (
    <Section id="projects">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-bold mb-2">Projects</h2>
              <p className="text-muted-foreground max-w-xl text-sm">
                Live-synced from{' '}
                <a
                  href="https://github.com/gokulsenthilkumar3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
                . Every card is generated dynamically — no hardcoded data.
                {fetchedAt && (
                  <span className="ml-2 text-muted-foreground/60 text-xs">
                    · Synced {new Date(fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-input text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-all flex-shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Syncing…' : 'Refresh'}
            </button>
          </div>
        </AnimatedSection>

        {/* Search and Filter */}
        <AnimatedSection animation="slideUp" delay={0.15}>
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by project name, tech, topic…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Error state */}
        {error && (
          <AnimatedSection animation="fadeIn">
            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-sm">Could not load projects: {error}</p>
              <button onClick={() => load(true)} className="px-4 py-2 rounded-lg border border-input text-sm hover:border-primary transition-colors">
                Retry
              </button>
            </div>
          </AnimatedSection>
        )}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filtered.map((project, index) => (
              <AnimatedSection key={project.id} animation="scaleIn" delay={0.04 * index}>
                <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] overflow-hidden">
                  {/* Hero area */}
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                    <div className="relative z-10 p-4 rounded-full bg-background/50 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                      {getTechIcon(project.tech[0] ?? project.language ?? 'code', 'h-12 w-12')}
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                    </div>

                    {/* Stats overlay */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1 text-[10px] bg-background/70 backdrop-blur-sm border border-white/10 rounded-full px-2 py-0.5 text-yellow-400">
                          <Star className="h-2.5 w-2.5" />
                          {project.stars}
                        </span>
                      )}
                      {project.forks > 0 && (
                        <span className="flex items-center gap-1 text-[10px] bg-background/70 backdrop-blur-sm border border-white/10 rounded-full px-2 py-0.5 text-muted-foreground">
                          <GitFork className="h-2.5 w-2.5" />
                          {project.forks}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md text-[10px]">
                        {project.type}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <StatusDot status={project.status} />
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                      <Badge variant="outline" className="capitalize text-xs flex-shrink-0">
                        {project.category}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 6).map(tech => (
                        <div
                          key={tech}
                          className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/5 border border-primary/10 text-[10px] font-medium text-primary"
                        >
                          {getTechIcon(tech)}
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>

                    {/* Topics */}
                    {project.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.topics.slice(0, 4).map(t => (
                          <span key={t} className="text-[10px] text-muted-foreground/60 border border-white/5 rounded-full px-2 py-0.5">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Last pushed */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        Updated {new Date(project.pushedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      {project.links.live && (
                        <MagneticButton strength={0.2} className="flex-1">
                          <Link
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ size: 'sm' }), 'w-full')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Live
                          </Link>
                        </MagneticButton>
                      )}
                      <MagneticButton strength={0.2} className="flex-1">
                        <Link
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full')}
                        >
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </Link>
                      </MagneticButton>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && filtered.length === 0 && projects.length > 0 && (
          <AnimatedSection animation="fadeIn">
            <div className="text-center py-12">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-30 text-muted-foreground" />
              <p className="text-muted-foreground">No projects match your filter.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                className="mt-4 px-4 py-2 rounded-lg border border-input text-sm hover:border-primary transition-colors text-muted-foreground"
              >
                Clear filters
              </button>
            </div>
          </AnimatedSection>
        )}

        {/* Stats footer */}
        {!loading && !error && projects.length > 0 && (
          <AnimatedSection animation="fadeIn" delay={0.3}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>{projects.length} repos · {filtered.length} shown</span>
              <span>·</span>
              <span>{projects.filter(p => p.status === 'active').length} actively developed</span>
              <span>·</span>
              <span>{projects.filter(p => p.links.live).length} with live demos</span>
            </div>
          </AnimatedSection>
        )}
      </div>
    </Section>
  )
}
