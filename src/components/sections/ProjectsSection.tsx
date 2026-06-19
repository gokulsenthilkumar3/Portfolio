'use client'

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
                  <Badge key={tech} variant="outline" className="text-[10px] py-0">{tech}</Badge>
                ))}
                {project.technologies.length > 4 && (
                  <Badge variant="outline" className="text-[10px] py-0">+{project.technologies.length - 4}</Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4 pt-3 border-t border-border/40">
            {project.links?.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 text-xs flex-1 justify-center')}
              >
                <Github className="h-3.5 w-3.5" />
                Code
              </Link>
            )}
            {project.links?.live && (
              <Link
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 text-xs flex-1 justify-center')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Live
              </Link>
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
  const sectionRef = useRef<HTMLElement>(null)
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
    if (!showAll) { setShowStickyBtn(false); return }
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0.5 }
    )
    if (showLessRef.current) observer.observe(showLessRef.current)
    return () => observer.disconnect()
  }, [showAll])

  const displayProjects = useMemo(() => {
    const staticUrls = new Set(projects.map(p => p.links?.github).filter(Boolean))
    const uniqueGithub = githubProjects.filter(p => !staticUrls.has(p.links?.github))
    const combined = [...projects, ...uniqueGithub]
    return showAll ? combined : combined.slice(0, 9)
  }, [projects, githubProjects, showAll])

  const handleShowLess = () => {
    setShowAll(false)
    setShowStickyBtn(false)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="projects" ref={sectionRef} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <AnimatedSection animation="fadeIn">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Projects</h2>
              <p className="text-muted-foreground max-w-xl">
                A selection of projects I've built — from full-stack apps to test automation frameworks.
              </p>
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer'
              )}
            >
              {showAll ? 'Show less' : 'View all'} <ArrowRight className={cn('h-4 w-4 transition-transform', showAll && '-rotate-90')} />
            </button>
          </div>
        </AnimatedSection>

        {/* Project Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA — this is the ref target for intersection observer */}
        <div ref={showLessRef}>
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <div className="mt-8 hidden sm:flex justify-center">
              <button
                onClick={showAll ? handleShowLess : () => setShowAll(true)}
                className={cn(buttonVariants({ variant: 'outline' }), 'gap-2 cursor-pointer')}
              >
                {showAll ? 'Show less' : 'View all'} <ArrowRight className={cn('h-4 w-4 transition-transform', showAll && '-rotate-90')} />
              </button>
            </div>
          </AnimatedSection>

          {/* Mobile CTA */}
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="mt-10 flex justify-center sm:hidden">
              <button
                onClick={showAll ? handleShowLess : () => setShowAll(true)}
                className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
              >
                {showAll ? 'Show Less' : 'View All Projects'} <ArrowRight className={cn('h-4 w-4 transition-transform', showAll && '-rotate-90')} />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Sticky 'Show Less' — appears when bottom btn is off-screen while viewing expanded list */}
      <AnimatePresence>
        {showStickyBtn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={handleShowLess}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <ChevronUp className="h-4 w-4" />
              Show Less
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
