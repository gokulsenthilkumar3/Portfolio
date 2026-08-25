'use client'

import { useMemo, useState } from 'react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import dynamic from 'next/dynamic'
import type { Skill } from '@/lib/types/portfolio'

const GeometricGrid = dynamic(() => 
  import('@/components/effects/GeometricGrid').then(mod => ({ default: mod.GeometricGrid })),
  { ssr: false }
)

const CATEGORY_META: Record<string, { label: string; tone: string; order: number }> = {
  testing: { label: 'Test Engineering', tone: 'from-emerald-500/10 to-emerald-500/5', order: 0 },
  frontend: { label: 'Frontend', tone: 'from-cyan-500/10 to-cyan-500/5', order: 1 },
  backend: { label: 'Backend', tone: 'from-orange-500/10 to-orange-500/5', order: 2 },
  devops: { label: 'DevOps & CI/CD', tone: 'from-violet-500/10 to-violet-500/5', order: 3 },
  'soft-skills': { label: 'Collaboration', tone: 'from-pink-500/10 to-pink-500/5', order: 4 },
  design: { label: 'Design', tone: 'from-rose-500/10 to-rose-500/5', order: 5 },
  tools: { label: 'Tools', tone: 'from-slate-500/10 to-slate-500/5', order: 6 },
}

function proficiencyLabel(level: number) {
  return ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert'][level] ?? 'Unknown'
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [showAll, setShowAll] = useState(false)

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const skill of skills) {
      const next = map.get(skill.category) ?? []
      next.push(skill)
      map.set(skill.category, next)
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      const ao = CATEGORY_META[a]?.order ?? 99
      const bo = CATEGORY_META[b]?.order ?? 99
      return ao - bo
    })
  }, [skills])

  const visibleGroups = showAll ? grouped : grouped.slice(0, 3)
  const topSkills = [...skills].sort((a, b) => b.proficiency - a.proficiency).slice(0, 6)

  return (
    <div className="relative space-y-8">
      <GeometricGrid className="absolute inset-[-10%] z-[-1] opacity-30 pointer-events-none" />
      <AnimatedSection className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Skills designed for delivery, not decoration.</h2>
          <p className="mt-3 text-muted-foreground leading-7">
            A curated skill set focused on test automation, modern web delivery, reliability, and practical engineering depth.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topSkills.map(skill => (
            <Badge key={skill.id} variant="outline" className="rounded-full px-3 py-1.5 bg-background/60">
              {skill.name}
            </Badge>
          ))}
        </div>
      </AnimatedSection>

      <div className="grid gap-4 lg:grid-cols-3">
        {visibleGroups.map(([category, catSkills], index) => {
          const meta = CATEGORY_META[category] ?? { label: category, tone: 'from-slate-500/10 to-slate-500/5', order: 99 }
          return (
            <AnimatedSection
              key={category}
              delay={index * 0.06}
              className={`rounded-3xl border border-border/70 bg-gradient-to-br ${meta.tone} p-6`}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Category</p>
                  <h3 className="text-xl font-semibold">{meta.label}</h3>
                </div>
                <span className="text-xs text-muted-foreground">{catSkills.length} skills</span>
              </div>

              <div className="space-y-3">
                {catSkills
                  .sort((a, b) => b.proficiency - a.proficiency)
                  .map(skill => {
                    const pct = Math.max(0, Math.min(100, (skill.proficiency / 5) * 100))
                    return (
                      <div key={skill.id} className="rounded-2xl border border-border/60 bg-background/60 p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div>
                            <div className="font-medium">{skill.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{proficiencyLabel(skill.proficiency)}</div>
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500" style={{ width: `${pct}%` }} />
                        </div>
                        {skill.yearsOfExperience && (
                          <p className="mt-2 text-[11px] text-muted-foreground">
                            {skill.yearsOfExperience}+ years in practice
                          </p>
                        )}
                      </div>
                    )
                  })}
              </div>
            </AnimatedSection>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowAll(v => !v)}
          className="rounded-full border border-border/70 bg-background/70 px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAll ? 'Show fewer categories' : 'Show all categories'}
        </button>
      </div>
    </div>
  )
}
