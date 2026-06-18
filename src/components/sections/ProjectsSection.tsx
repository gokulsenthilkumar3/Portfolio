'use client'

/**
 * ProjectsSection
 *
 * UI/UX overhaul:
 * - Category filter tabs (All / Fullstack / Web / Testing) with animated underline
 * - Project cards with: status badge, tech chip list, GitHub + Live links
 * - Animated card entrance with staggered delay via Framer Motion
 * - "View All" CTA at the bottom
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'

const CATEGORY_LABELS: Record<string, string> = {
  all:       'All',
  fullstack: 'Full-Stack',
  web:       'Web',
  testing:   'Testing',
}

const CATEGORY_COLORS: Record<string, string> = {
  fullstack: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  web:       'bg-blue-500/15 text-blue-400 border-blue-500/30',
  testing:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  category: string
  featured: boolean
  date: string
  links?: { github?: string; live?: string }
}

interface Props {
  projects: Project[]
  isAdmin?: boolean
  onEdit?: () => void
}

export function ProjectsSection({ projects, isAdmin, onEdit }: Props) {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)))
    return ['all', ...cats]
  }, [projects])

  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = useMemo(() =>
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter),
  [projects, activeFilter])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <AnimatedSection animation="slideDown">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display">Featured Projects</h2>
            <p className="text-muted-foreground mt-1">Things I&apos;ve built and shipped</p>
          </div>
          <Link
            href="/projects/"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs rounded-xl')}
          >
            View All Projects →
          </Link>
        </div>
      </AnimatedSection>

      {/* Filter Tabs */}
      <AnimatedSection animation="fadeIn" delay={0.1}>
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/50 w-fit mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={cn(
                'relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                activeFilter === cat
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {activeFilter === cat && (
                <motion.span
                  layoutId="pill"
                  className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border/50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{CATEGORY_LABELS[cat] ?? cat}</span>
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <CardTitle className="text-base font-display group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </CardTitle>
                    <span
                      className={cn(
                        'shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                        CATEGORY_COLORS[project.category] ?? 'bg-primary/10 text-primary border-primary/20'
                      )}
                    >
                      {CATEGORY_LABELS[project.category] ?? project.category}
                    </span>
                  </div>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col gap-4 flex-1 justify-end">
                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                      <Badge key={t} variant="outline" className="text-[11px] px-2 py-0.5">
                        {t}
                      </Badge>
                    ))}
                    {project.tech.length > 4 && (
                      <Badge variant="outline" className="text-[11px] px-2 py-0.5 text-muted-foreground">
                        +{project.tech.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2">
                    {project.links?.github && (
                      <Link
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          'text-xs h-7 px-3 rounded-lg flex items-center gap-1.5'
                        )}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        GitHub
                      </Link>
                    )}
                    {project.links?.live && (
                      <Link
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ size: 'sm' }),
                          'text-xs h-7 px-3 rounded-lg flex items-center gap-1.5'
                        )}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Live Demo
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
