'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkillSphereSection } from '@/components/3d/SkillSphereSection'
import { skills } from '@/lib/data/content'
import { getTopSkills, getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'
import { ArrowLeft } from 'lucide-react'

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
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('2d')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') return skills as Skill[]
    return getSkillsByCategory(skills as Skill[], selectedCategory) as Skill[]
  }, [selectedCategory])

  const topSkills = getTopSkills(skills as Skill[], 8)

  const handleSkillSelect = (skill: Skill) => setSelectedSkill(skill)

  return (
    <main className="min-h-screen bg-background pt-20 pb-16">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-primary/50 rounded-full px-4 py-2 hover:bg-primary/5 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </div>

      {/* Header */}
      <AnimatedSection className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Technical proficiency across testing, frontend, backend, and DevOps — built through
          real projects at CloudAssert and open-source work.
        </p>
      </AnimatedSection>

      {/* View Toggle */}
      <div className="container mx-auto px-4 flex justify-center gap-2 mb-8">
        <Button
          variant={viewMode === '2d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('2d')}
          className="min-w-[90px]"
        >
          Grid View
        </Button>
        <Button
          variant={viewMode === '3d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('3d')}
          className="min-w-[90px]"
        >
          3D Sphere
        </Button>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 flex flex-wrap justify-center gap-2 mb-8">
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
              <span className="ml-1.5 opacity-60 text-xs">
                ({getSkillsByCategory(skills as Skill[], cat).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* 3D View */}
      {viewMode === '3d' && (
        <div className="container mx-auto px-4">
          {selectedSkill && (
            <div className="text-center mb-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{selectedSkill.name}</span>
              {' — '}
              <span>{getProficiencyLabel(selectedSkill.proficiency)} ({selectedSkill.proficiency}/5)</span>
            </div>
          )}
          <SkillSphereSection skills={skills as Skill[]} onSkillSelect={handleSkillSelect} />
          <p className="text-center text-xs text-muted-foreground mt-4">
            Click a node to inspect · Drag to rotate · Scroll to zoom
          </p>
        </div>
      )}

      {/* 2D Grid View */}
      {viewMode === '2d' && (
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, index) => (
            <Card
              key={skill.id}
              className={`cursor-pointer border bg-gradient-to-br ${CATEGORY_COLORS[skill.category as Category] ?? CATEGORY_COLORS.all} hover:scale-[1.02] transition-transform ${
                selectedSkill?.id === skill.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{skill.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] capitalize">{skill.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{getProficiencyLabel(skill.proficiency)}</span>
                  <span className="text-xs font-mono">{skill.proficiency}/5</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getProficiencyColor(skill.proficiency)} transition-all`}
                    style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                  />
                </div>
                {skill.yearsOfExperience && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'yr' : 'yrs'} experience
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Core Competencies */}
      <div className="container mx-auto px-4 mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Core Competencies</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {topSkills.map((skill) => (
            <Badge key={skill.id} variant="outline" className="capitalize">
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="container mx-auto px-4 mt-12 flex justify-center">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-primary/50 rounded-full px-5 py-2.5 hover:bg-primary/5 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Portfolio
        </button>
      </div>
    </main>
  )
}
