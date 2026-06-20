'use client'

import React, { useEffect, useRef, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { use3DGate } from '@/hooks/use3DGate'
import type { Skill } from '@/lib/types/portfolio'

// Dynamic import keeps the Three.js / R3F bundle out of the initial
// page JS entirely. ssr: false is required because WebGL APIs are
// browser-only and would crash during server rendering.
const SkillSphere = dynamic(
  () =>
    import('@/components/3d/SkillSphere').then((m) => ({
      default: m.SkillSphere,
    })),
  { ssr: false }
)

/** Lightweight skeleton that holds layout space while the canvas loads. */
function ThreeSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/5 ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}

/** Static poster shown before visibility or when 3D is disabled. */
function ThreePoster({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl bg-background/5 backdrop-blur-sm border border-border/10 ${
        className ?? ''
      }`}
      aria-hidden="true"
    />
  )
}

interface SkillSphereSectionProps {
  onSkillSelect?: (skill: Skill) => void
  className?: string
  heightClass?: string
}

export function SkillSphereSection({
  onSkillSelect,
  className,
  heightClass = 'h-[580px]',
}: SkillSphereSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const allow3D = use3DGate()
  const [nearViewport, setNearViewport] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill)
    onSkillSelect?.(skill)
  }

  const proficiencyPercent = (level: number | string) => {
    if (typeof level === 'number') {
      return (level / 5) * 100
    }
    switch (level?.toLowerCase()) {
      case 'expert': return 95
      case 'advanced': return 80
      case 'proficient': return 65
      case 'intermediate': return 50
      default: return 40
    }
  }

  return (
    <div ref={ref} className={className}>
      {!allow3D && <ThreePoster className={heightClass} />}
      {allow3D && nearViewport ? (
        <Suspense fallback={<ThreeSkeleton className={heightClass} />}>
          <SkillSphere
            className={heightClass}
            onSkillSelect={handleSkillSelect}
          />
        </Suspense>
      ) : allow3D ? (
        <ThreeSkeleton className={heightClass} />
      ) : null}

      {/* Selected Skill Info Panel */}
      {selectedSkill && (
        <div className="mt-4 p-4 rounded-xl bg-card/60 border border-primary/30 backdrop-blur-sm flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary font-semibold text-lg">{selectedSkill.name}</span>
              <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full capitalize">
                {typeof selectedSkill.proficiency === 'number' 
                  ? ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert'][selectedSkill.proficiency] || 'Unknown'
                  : selectedSkill.proficiency}
              </span>
              {selectedSkill.category && (
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted/30 capitalize">
                  {selectedSkill.category}
                </span>
              )}
            </div>
            {/* Proficiency bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                  style={{ width: `${proficiencyPercent(selectedSkill.proficiency)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground min-w-[2rem]">
                {proficiencyPercent(selectedSkill.proficiency)}%
              </span>
            </div>
            {selectedSkill.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {selectedSkill.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setSelectedSkill(null)}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg p-1"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Frontend</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Test Engineering</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Backend</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> DevOps &amp; Cloud</span>
        <span className="flex items-center gap-1 ml-2 text-primary/70">👮 Click a skill node to inspect</span>
      </div>
    </div>
  )
}
