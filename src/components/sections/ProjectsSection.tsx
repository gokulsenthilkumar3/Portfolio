'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { Github, ExternalLink, ArrowRight } from 'lucide-react'
import type { Project } from '@/lib/types/portfolio'

// Color accent per project category — no filter chips, just visual labelling
const CATEGORY_COLORS: Record<string, string> = {
  fullstack: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  web:       'bg-blue-500/15   text-blue-400   border-blue-500/30',
  testing:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  ai:        'bg-amber-500/15  text-amber-400  border-amber-500/30',
  iot:       'bg-rose-500/15   text-rose-400   border-rose-500/30',
  other:     'bg-gray-500/15   text-gray-400   border-gray-500/30',
}

const CATEGORY_LABELS: Record<string, string> = {
  fullstack: 'Full-Stack',
  web:       'Web',
  testing:   'Testing',
  ai:        'AI / ML',
  iot:       'IoT',
  other:     'Other',
}

interface Props {
  projects: Project[]
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accentClass = CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS.other
  const categoryLabel = CATEGORY_LABELS[project.category] ?? project.category

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
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
          {/* Tech stack */}
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
          {/* Links */}
          <div className="flex gap-2 mt-auto">
            {project.links?.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 text-xs flex-1 justify-center')}
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
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
  // Only featured projects on home — sorted newest first
  const featured = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 6),
    [projects]
  )

  return (
    <section id="projects" className="py-20">
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
            <Link
              href="/projects"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground'
              )}
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>

        {/* Project Grid — no filter chips */}
        <AnimatePresence mode="wait">
          <motion.div
            key="grid"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mobile CTA */}
        <AnimatedSection animation="slideUp" delay={0.4}>
          <div className="mt-10 flex justify-center sm:hidden">
            <Link
              href="/projects"
              className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
            >
              View All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
