'use client'

/**
 * SkillsSection — professional brand logos via Simple Icons CDN
 *
 * Each skill renders:
 *  - Real SVG brand logo (white, brightens to brand color on hover)
 *  - Skill name + proficiency label
 *  - Animated proficiency bar with brand color glow
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import Image from 'next/image'
import Link from 'next/link'

/* ─── Simple Icons slug map ────────────────────────────────────────────────────
   Keys match the `id` in portfolio.config.ts.
   Values are the exact slug used at cdn.simpleicons.org/<slug>/<color>
   ──────────────────────────────────────────────────────────────────────────── */
const ICON_SLUG: Record<string, string> = {
  // Testing
  selenium:       'selenium',
  playwright:     'playwright',
  k6:             'k6',
  jest:           'jest',
  cypress:        'cypress',
  // Frontend
  react:          'react',
  nextjs:         'nextdotjs',
  typescript:     'typescript',
  tailwind:       'tailwindcss',
  javascript:     'javascript',
  html:           'html5',
  css:            'css3',
  // Backend
  nodejs:         'nodedotjs',
  postgresql:     'postgresql',
  mongodb:        'mongodb',
  express:        'express',
  python:         'python',
  java:           'openjdk',
  // DevOps
  'azure-devops': 'azuredevops',
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
  proficiency: number  // 1–5
  color: string
  icon?: string
}

/* ─── Single skill row ──────────────────────────────────────────────────────── */
function SkillRow({ skill, delay }: { skill: Skill; delay: number }) {
  const [imgError, setImgError] = useState(false)
  const slug = ICON_SLUG[skill.id]
  // White by default; switches to brand color on hover via filter in CSS
  const iconUrl = slug ? `https://cdn.simpleicons.org/${slug}/ffffff` : null
  const pct = (skill.proficiency / 5) * 100

  return (
    <div className="flex items-center gap-3 py-2.5 group">
      {/* Brand logo container */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                   border border-white/10 bg-white/5
                   transition-all duration-300
                   group-hover:border-white/25 group-hover:bg-white/10"
      >
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
          /* Fallback: 2-letter monogram in brand color */
          <span
            className="text-[11px] font-bold leading-none select-none"
            style={{ color: skill.color }}
          >
            {skill.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name + proficiency bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2 tabular-nums">
            {PROFICIENCY_LABELS[skill.proficiency]}
          </span>
        </div>

        {/* Progress track */}
        <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{ backgroundColor: skill.color }}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: `${pct}%`, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Glow dot at bar tip */}
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm opacity-60"
              style={{ backgroundColor: skill.color }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ─── Category card ─────────────────────────────────────────────────────────── */
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
      animation={groupIndex % 2 === 0 ? 'slideLeft' : 'slideRight'}
      delay={groupIndex * 0.1}
    >
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 h-full">
        {/* Category header — accent dot instead of emoji */}
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border/50">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
            style={{ backgroundColor: meta.accent, boxShadow: `0 0 8px ${meta.accent}66` }}
          />
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            {meta.label}
          </h3>
          <span className="ml-auto text-xs text-muted-foreground/50 tabular-nums">
            {catSkills.length} skills
          </span>
        </div>

        {/* Skill rows */}
        <div className="divide-y divide-border/30">
          {catSkills.map((skill, i) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              delay={groupIndex * 0.08 + i * 0.06}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

/* ─── Main export ───────────────────────────────────────────────────────────── */
export function SkillsSection({ skills }: { skills: Skill[] }) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatedSection animation="slideDown">
        <h2 className="text-3xl font-bold font-display mb-1">Skills</h2>
        <p className="text-muted-foreground mb-10">Technologies I work with every day</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6">
        {grouped.map(([category, catSkills], gi) => (
          <CategoryCard
            key={category}
            category={category}
            catSkills={catSkills}
            groupIndex={gi}
          />
        ))}
      </div>

      {/* View All link */}
      <AnimatedSection animation="fadeIn" delay={0.5}>
        <div className="mt-8 text-center">
          <Link
            href="/skills"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground
                       hover:text-foreground transition-colors
                       border border-border/60 hover:border-border
                       rounded-full px-5 py-2"
          >
            View all skills
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}
