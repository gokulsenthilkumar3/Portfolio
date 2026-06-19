'use client'

/**
 * ProjectsSection
 * Bugs fixed:
 * 1. Bottom CTA buttons now properly TOGGLE showAll (not always set to true)
 * 2. Sticky 'Show Less' button appears when bottom button is off-screen while in expanded view
 * 3. Clicking Show Less collapses and scrolls back to section top
 */

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ArrowRight, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types/portfolio'

interface Props {
  projects: Project[]
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: (index % 9) * 0.05, duration: 0.4 }}
      layout
    >
      <Card className="h-full flex flex-col group hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
        <CardContent className="flex flex-col h-full pt-5">
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
              <p className="text-xs text-muted-foreground line-clamp-3">{project.description}</p>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 4).map(tech => (
                  <Badge key={tech} variant="outline" className="text-[10px]">{tech}</Badge>
                ))}
                {project.technologies.length > 4 && (
                  <Badge variant="outline" className="text-[10px]">+{project.technologies.length - 4}</Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 pt-3 border-t border-border/40">
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex-1 gap-1.5 text-xs')}
              >
                <Github className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {project.links?.live && (
              <a href={project.links.live} target="_blank" rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex-1 gap-1.5 text-xs')}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Live
              </a>
            )}
          </div>
        </CardContent>
      </Card>
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
      .then(data => {
        if (data && data.allRepos) {
          const mapped = data.allRepos.map((repo: any) => ({
            id: repo.id.toString(),
            title: repo.name,
            description: repo.description || 'GitHub Repository',
            technologies: [repo.language, ...(repo.topics || [])].filter(Boolean),
            category: 'other',
            links: { github: repo.url },
            featured: false,
            date: repo.updatedAt
          }))
          setGithubProjects(mapped)
        }
      })
      .catch(console.error)
  }, [])

  // Show sticky 'Show Less' button when user has scrolled past the bottom button
  useEffect(() => {
    if (!showAll) {
      setShowStickyBtn(false)
      return
    }
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
      {/* Header */}
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
          {showAll ? 'Show less' : 'View all'}
        </button>
      </AnimatedSection>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.id || project.title} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom CTA - ref target for intersection observer */}
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

      {/* Mobile CTA */}
      <div className="mt-4 flex sm:hidden justify-center">
        <button
          onClick={() => showAll ? handleShowLess() : setShowAll(true)}
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
        >
          {showAll ? 'Show Less' : 'View All Projects'}
        </button>
      </div>

      {/* Sticky 'Show Less' — appears when bottom btn is off-screen while in expanded view */}
      <AnimatePresence>
        {showStickyBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleShowLess}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            Show Less
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
