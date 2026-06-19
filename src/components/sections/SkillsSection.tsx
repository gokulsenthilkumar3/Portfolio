'use client'

/**
 * SkillsSection — professional brand logos via Simple Icons CDN
 * Updated: back navigation button on "View all skills" expanded view
 */

import { useMemo, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import Image from 'next/image'
import { ArrowLeft, ChevronUp } from 'lucide-react'

const ICON_SLUG: Record<string, string> = {
  selenium:       'selenium',
  playwright:     '',
  k6:             'k6',
  jest:           'jest',
  cypress:        'cypress',
  react:          'react',
  nextjs:         'nextdotjs',
  typescript:     'typescript',
  tailwind:       'tailwindcss',
  javascript:     'javascript',
  html:           'html5',
  css:            'css3',
  nodejs:         'nodedotjs',
  postgresql:     'postgresql',
  mongodb:        'mongodb',
  express:        'express',
  python:         'python',
  java:           'openjdk',
  'azure-devops': '',
  git:            'git',
  docker:         'docker',
  github:         'github',
  nginx:          'nginx',
  linux:          'linux',
}

const CATEGORY_META: Record<string, { label: string; order: number; accent: string }> = {
  testing:  { label: 'Test Engineering', order: 0, accent: '#43B02A' },
  frontend: { label: 'Frontend',         order: 1, accent: '#61DAFB' },
  backend:  { label: 'Backend',          order: 2, accent: '#339933' },
  devops:   { label: 'DevOps & CI/CD',   order: 3, accent: '#0078D4' },
}

const PROFICIENCY_LABELS = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  color: string
  icon?: string
}

function SkillRow({ skill, delay }: { skill: Skill; delay: number }) {
  const [imgError, setImgError] = useState(false)
  const slug = ICON_SLUG[skill.id]
  const iconUrl = slug ? `https://cdn.simpleicons.org/${slug}/ffffff` : null
  const pct = (skill.proficiency / 5) * 100

  return (
    <div className="flex items-center gap-3 py-2.5 group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/10">
        {iconUrl && !imgError ? (
          <Image
            src={iconUrl}
            alt={`${skill.name} logo`}
            width={18}
            height={18}
            className="transition-all duration-300 opacity-70 group-hover:opacity-100"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <span className="text-[11px] font-bold leading-none select-none" style={{ color: skill.color }}>
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2 tabular-nums">
            {PROFICIENCY_LABELS[skill.proficiency]}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{ backgroundColor: skill.color }}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: `${pct}%`, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm opacity-60" style={{ backgroundColor: skill.color }} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ category, catSkills, groupIndex }: { category: string; catSkills: Skill[]; groupIndex: number }) {
  const meta = CATEGORY_META[category] ?? { label: category, order: 99, accent: '#6366f1' }
  return (
    <AnimatedSection animation={groupIndex % 2 === 0 ? 'slideLeft' : 'slideRight'} delay={groupIndex * 0.1}>
      <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-card/40 to-card/10 backdrop-blur-xl p-5 h-full hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" style={{ backgroundColor: meta.accent }} />
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: meta.accent, boxShadow: `0 0 8px ${meta.accent}66` }} />
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{meta.label}</h3>
          <span className="ml-auto text-xs text-muted-foreground/50 tabular-nums">{catSkills.length} skills</span>
        </div>
        <div className="divide-y divide-border/30">
          {catSkills.map((skill, i) => (
            <SkillRow key={skill.id} skill={skill} delay={groupIndex * 0.08 + i * 0.06} />
          ))}
        </div>
      </div>
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

  const handleBack = () => {
    setShowAll(false)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto scroll-mt-20">
      <AnimatedSection animation="slideDown">
        <div className="flex items-center gap-3 mb-1">
          <AnimatePresence>
            {showAll && (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full border border-border/60 hover:border-border px-3 py-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </motion.button>
            )}
          </AnimatePresence>
          <h2 className="text-3xl font-bold font-display">{showAll ? 'All Skills' : 'Skills'}</h2>
        </div>
        <p className="text-muted-foreground mb-10">
          {showAll ? `All ${skills.length} technologies across ${grouped.length} categories` : 'Technologies I work with every day'}
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6">
        {grouped.map(([category, catSkills], gi) => (
          <CategoryCard key={category} category={category} catSkills={catSkills} groupIndex={gi} />
        ))}
      </div>

      {/* View All / Back toggle */}
      <AnimatedSection animation="fadeIn" delay={0.5}>
        <div className="mt-8 text-center">
          <button
            onClick={showAll ? handleBack : () => setShowAll(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-border rounded-full px-5 py-2"
          >
            {showAll ? (
              <><ArrowLeft className="h-4 w-4" /> Back to overview</>
            ) : (
              <>View all skills <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            )}
          </button>
        </div>
      </AnimatedSection>
    </div>
  )
}
