'use client'

import { useState } from 'react'
import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkillSphere } from '@/components/3d/SkillSphere'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory, getTopSkills } from '@/lib/utils/content-helpers'

export default function SkillsPage() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('2d')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'frontend', 'backend', 'tools', 'soft-skills', 'design']
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : getSkillsByCategory(skills, selectedCategory as any)
  
  const topSkills = getTopSkills(skills, 8)

  const getProficiencyColor = (proficiency: number) => {
    switch (proficiency) {
      case 5: return 'bg-green-500'
      case 4: return 'bg-blue-500'
      case 3: return 'bg-yellow-500'
      case 2: return 'bg-orange-500'
      case 1: return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleSkillSelect = (skill: typeof skills[0]) => {
    console.log('Selected skill:', skill)
  }

  return (
    <Section id="skills" className="py-20">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">Skills & Expertise</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels across different domains.
          </p>
        </AnimatedSection>

        {/* View Mode Toggle */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border p-1">
              <Button
                variant={viewMode === '2d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('2d')}
              >
                2D View
              </Button>
              <Button
                variant={viewMode === '3d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('3d')}
              >
                3D View
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Category Filter */}
        {viewMode === '2d' && (
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* Skills Display */}
        {viewMode === '3d' ? (
          <AnimatedSection animation="scaleIn" delay={0.4}>
            <div className="h-96 md:h-[500px] bg-muted/20 rounded-lg overflow-hidden">
              <SkillSphere 
                onSkillSelect={handleSkillSelect}
                selectedCategory={selectedCategory === 'all' ? undefined : selectedCategory}
                className="w-full h-full"
              />
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <AnimatedSection 
                key={skill.id} 
                animation="scaleIn" 
                delay={0.1 * (index % 9)}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      <Badge variant="secondary" className="capitalize">
                        {skill.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Proficiency Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Proficiency</span>
                          <span>{skill.proficiency}/5</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getProficiencyColor(skill.proficiency)}`}
                            style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Years of Experience */}
                      {skill.yearsOfExperience && (
                        <div className="text-sm text-muted-foreground">
                          {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
                        </div>
                      )}
                      
                      {/* Description */}
                      {skill.description && (
                        <p className="text-sm text-muted-foreground">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Top Skills Summary */}
        <AnimatedSection animation="slideUp" delay={0.8}>
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Core Competencies</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {topSkills.map((skill) => (
                <Badge 
                  key={skill.id} 
                  variant="outline" 
                  className="text-sm py-2 px-4 capitalize"
                  style={{ 
                    borderColor: skill.color || '#3b82f6',
                    color: skill.color || '#3b82f6'
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
