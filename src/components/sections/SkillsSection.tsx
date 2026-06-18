'use client'

/**
 * SkillsSection
 *
 * UI/UX overhaul:
 * - Skills grouped by category in a 2-column layout (Testing | Frontend | Backend | DevOps)
 * - Each skill shows: icon, name, proficiency bar (animated on entry)
 * - Proficiency dots (1-5) shown under each bar
 * - Subtle glow on the bar using the skill's brand color
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils/cn'

const CATEGORY_META: Record<string, { label: string; emoji: string; order: number }> = {
  testing:  { label: 'Test Engineering', emoji: '🧪', order: 0 },
  frontend: { label: 'Frontend',         emoji: '🎨', order: 1 },
  backend:  { label: 'Backend',          emoji: '⚡',    order: 2 },
  devops:   { label: 'DevOps & CI/CD',   emoji: '⚙️',    order: 3 },
}

const PROFICIENCY_LABELS = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number  // 1-5
  color: string
  icon?: string
}

interface Props {
  skills: Skill[]
}

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  const pct = (skill.proficiency / 5) * 100

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Icon */}
      <span className="text-lg w-7 text-center shrink-0" aria-hidden="true">
        {skill.icon ?? '🔧'}
      </span>

      {/* Name + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground truncate">{skill.name}</span>
          <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
            {PROFICIENCY_LABELS[skill.proficiency]}
          </span>
        </div>
        {/* Track */}
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: skill.color }}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      </div>
    </div>
  )
}

export function SkillsSection({ skills }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const skill of skills) {
      if (!map.has(skill.category)) map.set(skill.category, [])
      map.get(skill.category)!.push(skill)
    }
    // Sort by meta order
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

      <div className="grid md:grid-cols-2 gap-8">
        {grouped.map(([category, catSkills], gi) => {
          const meta = CATEGORY_META[category] ?? { label: category, emoji: '🔧', order: 99 }
          return (
            <AnimatedSection
              key={category}
              animation={gi % 2 === 0 ? 'slideLeft' : 'slideRight'}
              delay={gi * 0.1}
            >
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
                {/* Category heading */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
                  <span className="text-xl" aria-hidden="true">{meta.emoji}</span>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    {meta.label}
                  </h3>
                </div>

                {/* Skills list */}
                <div className="divide-y divide-border/30">
                  {catSkills.map((skill, i) => (
                    <SkillBar key={skill.id} skill={skill} delay={gi * 0.08 + i * 0.06} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </div>
  )
}
