'use client'
import { useState, useMemo } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkillSphereSection } from '@/components/3d/SkillSphereSection'
import { skills } from '@/lib/data/content'
import { getTopSkills, getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'

// Real categories from portfolio.config.ts skills data
const CATEGORIES = ['all', 'testing', 'frontend', 'backend', 'devops'] as const
type Category = typeof CATEGORIES[number]

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'All Skills',
  testing: 'Testing',
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
}

const CATEGORY_COLORS: Record<Category, string> = {
  all: 'from-violet-500/20 to-indigo-500/20 border-violet-500/30',
  testing: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  frontend: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
  backend: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  devops: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
}

function getProficiencyLabel(p: number) {
  return ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][p] ?? ''
}

function getProficiencyColor(p: number) {
  return [
    'bg-gray-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ][p] ?? 'bg-gray-500'
}

export default function SkillsPage() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('2d')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const filteredSkills = useMemo<Skill[]>(() => {
    if (selectedCategory === 'all') return skills as Skill[]
    // Use the correct helper that filters by skill.category
    return getSkillsByCategory(skills as Skill[], selectedCategory) as Skill[]
  }, [selectedCategory])

  const topSkills = getTopSkills(skills as Skill[], 8)

  const handleSkillSelect = (skill: Skill) => setSelectedSkill(skill)

  return (
    <Section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <AnimatedSection animation="fadeIn">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Skills & Expertise</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Technical proficiency across testing, frontend, backend, and DevOps — built through real projects at CloudAssert and open-source work.
            </p>
          </div>
        </AnimatedSection>

        {/* View Toggle */}
        <AnimatedSection animation="slideUp" delay={0.15}>
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-border bg-muted/30 p-1 gap-1">
              <Button
                variant={viewMode === '2d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('2d')}
                className="min-w-[90px]"
              >
                Grid View
              </Button>
              <Button
                variant={viewMode === '3d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('3d')}
                className="min-w-[90px]"
              >
                3D Sphere
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection animation="slideUp" delay={0.25}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {CATEGORY_LABELS[cat]}
                {cat !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({getSkillsByCategory(skills as Skill[], cat).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        </AnimatedSection>

        {/* 3D View */}
        {viewMode === '3d' && (
          <AnimatedSection animation="scaleIn" delay={0.3}>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-blue-950/40 overflow-hidden">
              <SkillSphereSection
                onSkillSelect={handleSkillSelect}
                selectedCategory={selectedCategory === 'all' ? undefined : selectedCategory}
                heightClass="h-[520px]"
                className="w-full"
              />
            </div>
            {selectedSkill && (
              <div className="mt-4 flex justify-center">
                <div
                  className="flex items-center gap-3 rounded-xl border bg-card px-5 py-3 shadow-lg"
                  style={{ borderColor: selectedSkill.color ?? '#3b82f6' }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: selectedSkill.color ?? '#3b82f6' }}
                  />
                  <span className="font-semibold">{selectedSkill.name}</span>
                  <span className="text-muted-foreground text-sm">—</span>
                  <span className="text-sm" style={{ color: selectedSkill.color ?? '#3b82f6' }}>
                    {getProficiencyLabel(selectedSkill.proficiency)} ({selectedSkill.proficiency}/5)
                  </span>
                </div>
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground mt-3">
              Click a node to inspect · Drag to rotate · Scroll to zoom
            </p>
          </AnimatedSection>
        )}

        {/* 2D Grid View */}
        {viewMode === '2d' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill, index) => (
              <AnimatedSection
                key={skill.id}
                animation="scaleIn"
                delay={0.05 * (index % 12)}
              >
                <Card
                  className={`hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br ${
                    CATEGORY_COLORS[skill.category as Category] ?? CATEGORY_COLORS.all
                  } border`}
                  onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: skill.color ?? '#3b82f6' }}
                        />
                        {skill.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="text-[10px] capitalize px-2 py-0"
                      >
                        {skill.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{getProficiencyLabel(skill.proficiency)}</span>
                        <span>{skill.proficiency}/5</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-700 ${getProficiencyColor(skill.proficiency)}`}
                          style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                        />
                      </div>
                      {skill.yearsOfExperience && (
                        <p className="text-xs text-muted-foreground">
                          {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'} experience
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Core Competencies */}
        <AnimatedSection animation="slideUp" delay={0.6}>
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">Core Competencies</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {topSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className="text-sm py-2 px-4 capitalize font-medium"
                  style={{
                    borderColor: skill.color ?? '#3b82f6',
                    color: skill.color ?? '#3b82f6',
                  }}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </AnimatedSection>

      </div>
    </Section>
  )
}
