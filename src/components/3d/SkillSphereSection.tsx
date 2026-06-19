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
  selectedCategory?: string
  className?: string
  /** Minimum height class, e.g. "h-[480px]" */
  heightClass?: string
}

/**
 * Section wrapper for <SkillSphere />.
 *
 * Optimisation layers:
 * 1. Dynamic import – Three.js bundle is a separate chunk, never
 *    included in the initial page load.
 * 2. IntersectionObserver – canvas is not even requested until
 *    this section is 300 px away from the viewport.
 * 3. use3DGate – skips the canvas entirely for reduced-motion
 *    users and devices without WebGL support.
 * 4. Suspense skeleton – preserves layout height to prevent CLS
 *    while the chunk downloads.
 *
 * Note: The SkillSphere geometry uses 16-segment spheres (down from
 * 32) which is visually identical at this display size but cuts
 * vertex count ~4x per skill node. Update the source in SkillSphere.tsx
 * if you want to centralise that change too.
 */
export function SkillSphereSection({
  onSkillSelect,
  selectedCategory,
  className,
  heightClass = 'h-[480px]',
}: SkillSphereSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const allow3D = use3DGate()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`relative ${heightClass} ${className ?? ''}`}>
      {!allow3D && <ThreePoster className={`absolute inset-0 ${heightClass}`} />}

      {allow3D && nearViewport ? (
        <Suspense
          fallback={
            <ThreeSkeleton className={`absolute inset-0 ${heightClass}`} />
          }
        >
          <SkillSphere
            className="absolute inset-0"
            onSkillSelect={onSkillSelect}
            selectedCategory={selectedCategory}
          />
        </Suspense>
      ) : allow3D ? (
        <ThreePoster className={`absolute inset-0 ${heightClass}`} />
      ) : null}
    </div>
  )
}
