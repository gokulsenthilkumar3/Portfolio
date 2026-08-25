'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, ChevronUp, ImageOff, BookOpen, Car, Factory, Wallet, TestTube, ShieldCheck, AppWindow, Code2 } from 'lucide-react'
import Link from 'next/link'

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Car,
  Factory,
  Wallet,
  TestTube,
  ShieldCheck,
  AppWindow,
  Code2
}
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types/portfolio'

const categoryColors: Record<string, { bg: string; border: string }> = {
  web: { bg: 'from-blue-500/20 to-cyan-500/10', border: 'bg-blue-500' },
  fullstack: { bg: 'from-purple-500/20 to-fuchsia-500/10', border: 'bg-purple-500' },
  testing: { bg: 'from-emerald-500/20 to-teal-500/10', border: 'bg-emerald-500' },
  tools: { bg: 'from-orange-500/20 to-amber-500/10', border: 'bg-orange-500' },
  other: { bg: 'from-gray-500/20 to-slate-500/10', border: 'bg-gray-500' },
}

const getCategoryColor = (category?: string) => {
  return category && categoryColors[category] ? categoryColors[category] : categoryColors.other
}

interface Props {
  projects: Project[]
}

// FIX: typed inline shape instead of `repo: any`
interface GitHubRepo {
  id: number
  name: string
  description: string | null
  url: string
  language: string | null
  topics: string[]
  updatedAt: string
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10deg', '10deg'])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.4 }}
      layout
      style={{ perspective: 1200 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        <Card className="h-full flex flex-col group transition-all duration-500 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_30px_60px_-15px_rgba(139,92,246,0.3)] hover:-translate-y-2 relative">
          {/* Left accent border */}
          <div className={cn(
            "absolute inset-y-0 left-0 w-1 opacity-70 group-hover:opacity-100 transition-opacity z-20",
            getCategoryColor(project.category).border
          )} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

          {/* Thumbnail */}
          <div className={cn(
            "relative w-full aspect-video overflow-hidden shrink-0 border-b border-border/40 flex items-center justify-center transition-colors duration-500",
            "bg-gradient-to-br", getCategoryColor(project.category).bg
          )}>
            {project.icon && iconMap[project.icon] ? (
              <div className="p-4 rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                {(() => {
                  const Icon = iconMap[project.icon as string] as any;
                  return <Icon className="w-12 h-12" />;
                })()}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-muted text-muted-foreground/40 transition-transform duration-500 group-hover:scale-110">
                <Code2 className="w-12 h-12" />
              </div>
            )}
          </div>

          <CardContent className="flex flex-col h-full pt-6 px-6 relative z-10" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h3>
                {project.featured && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">Featured</Badge>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-muted-foreground">{project.description}</p>
              )}
              {project.problem && (
                <div className="text-[11px] text-muted-foreground mt-2">
                  <strong className="text-foreground/80">Problem:</strong> {project.problem}
                </div>
              )}
              {project.responsibility && (
                <div className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground/80">Responsibility:</strong> {project.responsibility}
                </div>
              )}
              {project.evidence && (
                <div className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground/80">Evidence:</strong> {project.evidence}
                </div>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map(tech => (
                    <Badge key={tech} variant="outline" className="text-[10px] bg-background/50">{tech}</Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge variant="outline" className="text-[10px] bg-background/50">+{project.technologies.length - 4}</Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-border/40">
              {project.links?.github && (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex-1 gap-1.5 text-xs')}
                >
                  <Github className="w-3.5 h-3.5" /> Source
                </a>
              )}
              {project.links?.live && (
                <a href={project.links.live} target="_blank" rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex-1 gap-1.5 text-xs')}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export function ProjectsSection({ projects }: Props) {
  const [githubProjects, setGithubProjects] = useState<Project[]>([])
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const showLessRef = useRef<HTMLDivElement>(null)
  const [showStickyBtn, setShowStickyBtn] = useState(false)

  useEffect(() => {
    fetch('/api/github')
      .then(res => res.json())
      .then((data: { allRepos?: GitHubRepo[] }) => {
        if (data?.allRepos) {
          // FIX: typed repo parameter instead of `repo: any`
          const mapped: Project[] = data.allRepos.map((repo: GitHubRepo) => ({
            id: repo.id.toString(),
            title: repo.name,
            description: repo.description ?? 'GitHub Repository',
            technologies: [repo.language, ...(repo.topics ?? [])].filter((t): t is string => !!t),
            category: 'other' as const,
            links: { github: repo.url },
            featured: false,
            date: repo.updatedAt,
            images: [],
            icon: 'Code2'
          }))
          setGithubProjects(mapped)
        }
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!showAll) { setShowStickyBtn(false); return }
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0.5 }
    )
    if (showLessRef.current) observer.observe(showLessRef.current)
    return () => observer.disconnect()
  }, [showAll])

  const allProjects = useMemo(() => {
    const staticUrls = new Set(projects.map(p => p.links?.github).filter(Boolean))
    const uniqueGithub = githubProjects.filter(p => !staticUrls.has(p.links?.github))
    return [...projects, ...uniqueGithub]
  }, [projects, githubProjects])

  const displayProjects = showAll ? allProjects : allProjects.slice(0, 9)

  const handleShowLess = () => {
    setShowAll(false)
    setShowStickyBtn(false)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={sectionRef} id="projects" className="scroll-mt-20">
      <AnimatedSection className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <p className="text-muted-foreground text-sm mt-1">
            A selection of projects I&apos;ve built — from full-stack apps to test automation frameworks.
          </p>
        </div>
        <button
          onClick={() => showAll ? handleShowLess() : setShowAll(true)}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer shrink-0'
          )}
        >
          {showAll ? 'Show less' : 'View all projects'}
        </button>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.id || project.title} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>

      <div ref={showLessRef} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {allProjects.length > 9 && (
          <button
            onClick={() => showAll ? handleShowLess() : setShowAll(true)}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 cursor-pointer')}
          >
            {showAll ? 'Show less' : `View all ${allProjects.length} projects`}
            {!showAll && <ArrowRight className="w-4 h-4" />}
            {showAll && <ChevronUp className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="mt-4 flex sm:hidden justify-center">
        <button
          onClick={() => showAll ? handleShowLess() : setShowAll(true)}
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
        >
          {showAll ? 'Show Less' : 'View All Projects'}
        </button>
      </div>

      <AnimatePresence>
        {showStickyBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            onClick={handleShowLess}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground shadow-2xl text-sm font-medium hover:bg-primary/90 transition-colors border border-primary-foreground/10"
          >
            <ChevronUp className="w-4 h-4" />
            Show Less
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
