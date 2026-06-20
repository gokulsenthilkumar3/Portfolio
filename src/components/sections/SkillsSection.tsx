'use client'

/**
 * SkillsSection — inline expand/collapse with 3D sphere in expanded view
 * Bugs fixed:
 * 1. showAll toggle buttons now properly toggle (not always set true)
 * 2. Back button works correctly
 * 3. 3D Sphere shown in expanded view
 */

import { useMemo, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import Image from 'next/image'
import { ArrowLeft, ChevronUp } from 'lucide-react'
import type { Skill } from '@/lib/types/portfolio'



const ICON_SLUG: Record<string, string> = {
  selenium:      'selenium',
  playwright:    '',
  k6:            'k6',
  jest:          'jest',
  cypress:       'cypress',
  react:         'react',
  nextjs:        'nextdotjs',
  typescript:    'typescript',
  tailwind:      'tailwindcss',
  javascript:    'javascript',
  html:          'html5',
  css:           'css3',
  nodejs:        'nodedotjs',
  postgresql:    'postgresql',
  mongodb:       'mongodb',
  express:       'express',
  python:        'python',
  java:          'openjdk',
  'azure-devops': '',
  git:           'git',
  docker:        'docker',
  github:        'github',
  nginx:         'nginx',
  linux:         'linux',
}

const CATEGORY_META: Record<string, { label: string; order: number; accent: string }> = {
  testing:  { label: 'Test Engineering', order: 0, accent: '#43B02A' },
  frontend: { label: 'Frontend',          order: 1, accent: '#61DAFB' },
  backend:  { label: 'Backend',           order: 2, accent: '#339933' },
  devops:   { label: 'DevOps & CI/CD',    order: 3, accent: '#0078D4' },
}

const PROFICIENCY_LABELS = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

function SkillRow({ skill, delay }: { skill: Skill; delay: number }) {
  const [imgError, setImgError] = useState(false)
  const slug = ICON_SLUG[skill.id]
  // Use default brand color
  const iconUrl = slug ? `https://cdn.simpleicons.org/${slug}` : null
  const pct = (skill.proficiency / 5) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0 group"
    >
      {/* Brand logo container */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                   border border-black/10 dark:border-white/10 bg-white dark:bg-white/5
                   transition-all duration-300
                   group-hover:border-black/20 dark:group-hover:border-white/25 group-hover:bg-gray-50 dark:group-hover:bg-white/10"
      >
        {iconUrl && !imgError ? (
          <Image
            src={iconUrl}
            alt={`${skill.name} icon`}
            width={18}
            height={18}
            className="transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-110"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <span className="text-[9px] font-bold text-muted-foreground">
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium truncate">{skill.name}</span>
          <span className="text-[10px] text-muted-foreground ml-2 flex-shrink-0">
            {PROFICIENCY_LABELS[skill.proficiency]}
          </span>
        </div>
        <div className="h-1 rounded-full bg-border/30 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/80 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function CategoryCard({
  category,
  catSkills,
  groupIndex,
}: {
  category: string
  catSkills: Skill[]
  groupIndex: number
}) {
  const meta = CATEGORY_META[category] ?? { label: category, order: 99, accent: '#6366f1' }
  return (
    <AnimatedSection
      delay={groupIndex * 0.08}
      className="relative rounded-3xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: meta.accent }}>
          {meta.label}
        </h3>
        <span className="text-[10px] text-muted-foreground">{catSkills.length} skills</span>
      </div>
      {catSkills.map((skill, i) => (
        <SkillRow key={skill.id} skill={skill} delay={groupIndex * 0.08 + i * 0.04} />
      ))}
    </AnimatedSection>
  )
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [showAll, setShowAll] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const skill of skills) {
      if (!map.has(skill.category)) map.set(skill.category, [])
      map.get(skill.category)!.push(skill)
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      const ao = CATEGORY_META[a]?.order ?? 99
      const bo = CATEGORY_META[b]?.order ?? 99
      return ao - bo
    })
  }, [skills])

  // In collapsed view show only 2 categories; in expanded view show all
  const visibleGroups = showAll ? grouped : grouped.slice(0, 2)

  const handleBack = () => {
    setShowAll(false)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={sectionRef} id="skills" className="scroll-mt-20">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {showAll && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-primary/50 rounded-full px-3 py-1.5 hover:bg-primary/5 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back
            </motion.button>
          )}
          <div>
            <h2 className="text-2xl font-bold">{showAll ? 'All Skills' : 'Skills'}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {showAll
                ? `All ${skills.length} technologies across ${grouped.length} categories`
                : 'Technologies I work with every day'}
            </p>
          </div>
        </div>


      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleGroups.map(([category, catSkills], gi) => (
          <CategoryCard
            key={category}
            category={category}
            catSkills={catSkills}
            groupIndex={gi}
          />
        ))}
      </div>

      {/* View All / Back toggle */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            if (showAll) {
              handleBack()
            } else {
              setShowAll(true)
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-border rounded-full px-5 py-2"
        >
          {showAll ? (
            <>
              <ArrowLeft className="w-4 h-4" />
              Back to overview
            </>
          ) : (
            <>View all skills &rarr;</>
          )}
        </button>
      </div>
    </div>
  )
}
