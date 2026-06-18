'use client'

import { useState, useMemo } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Github, ExternalLink, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { projects as allProjects } from '@/lib/data/content'
import type { Project } from '@/lib/types/portfolio'

// Only show categories that actually exist in the data
const CATEGORY_LABELS: Record<string, string> = {
  all:       'All',
  fullstack: 'Full-Stack',
  web:       'Web',
  testing:   'Testing',
}

const CATEGORY_COLORS: Record<string, string> = {
  fullstack: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  web:       'bg-blue-500/15   text-blue-400   border-blue-500/30',
  testing:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  ai:        'bg-amber-500/15  text-amber-400  border-amber-500/30',
  iot:       'bg-rose-500/15   text-rose-400   border-rose-500/30',
  other:     'bg-gray-500/15   text-gray-400   border-gray-500/30',
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accentClass = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS.other
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 group border-border/60 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <Badge
              variant="outline"
              className={cn('text-[10px] px-2 py-0 flex-shrink-0 capitalize', accentClass)}
            >
              {categoryLabel}
            </Badge>
          </div>
          {project.featured && (
            <Badge variant="secondary" className="w-fit text-[10px] px-2 py-0 mt-1">
              ★ Featured
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex flex-col flex-1 pt-0">
          <CardDescription className="text-sm leading-relaxed mb-4 flex-1">
            {project.description}
          </CardDescription>
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[10px] px-2 py-0">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="text-[10px] px-2 py-0">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-auto">
            {project.links?.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 text-xs flex-1 justify-center')}
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </Link>
            )}
            {project.links?.live && (
              <Link
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 text-xs flex-1 justify-center')}
              >
                <ExternalLink className="h-3.5 w-3.5" /> Live
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Derive categories that actually have projects
  const availableCategories = useMemo(() => {
    const cats = new Set((allProjects as Project[]).map((p) => p.category))
    // Always show 'all' first, then only fullstack/web/testing in that order
    const order = ['fullstack', 'web', 'testing']
    const filtered = order.filter((c) => cats.has(c))
    return ['all', ...filtered]
  }, [])

  const filtered = useMemo(() => {
    let list = allProjects as Project[]
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [selectedCategory, searchQuery])

  return (
    <Section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <AnimatedSection animation="fadeIn">
          <div className="mb-10">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mb-4 gap-1.5 text-muted-foreground')}
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <h2 className="text-4xl font-bold mb-3">All Projects</h2>
            <p className="text-muted-foreground max-w-2xl">
              {allProjects.length} projects across full-stack development, web apps, and test automation.
            </p>
          </div>
        </AnimatedSection>

        {/* Search + Filter row */}
        <AnimatedSection animation="slideUp" delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, tech..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {/* Category filter — only real categories */}
            <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/50 w-fit flex-wrap">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
                    selectedCategory === cat
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {selectedCategory === cat && (
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
          </div>
        </AnimatedSection>

        {/* Results count */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} of {allProjects.length} projects
          </p>
        </AnimatedSection>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchQuery}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project as Project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No projects found</p>
            <p className="text-sm">Try a different search term or category.</p>
          </div>
        )}

      </div>
    </Section>
  )
}
