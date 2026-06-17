'use client'

import React, { useEffect, useRef, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { use3DGate } from '@/hooks/use3DGate'

// Dynamic import keeps the Three.js / R3F bundle out of the initial
// page JS entirely. ssr: false is required because WebGL APIs are
// browser-only and would crash during server rendering.
const FloatingModels = dynamic(
  () =>
    import('@/components/3d/FloatingModels').then((m) => ({
      default: m.FloatingModels,
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
      className={`rounded-xl bg-gradient-to-br from-blue-950/40 to-purple-950/40 ${
        className ?? ''
      }`}
      aria-hidden="true"
    />
  )
}

interface FloatingModelsSectionProps {
  className?: string
  theme?: 'dark' | 'light' | 'neon' | 'pastel' | 'cyberpunk'
  /** Minimum height class, e.g. "h-[320px]" */
  heightClass?: string
}

/**
 * Section wrapper for <FloatingModels />.
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
 */
export function FloatingModelsSection({
  className,
  theme = 'dark',
  heightClass = 'h-[320px]',
}: FloatingModelsSectionProps) {
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
          <FloatingModels className="absolute inset-0" theme={theme} />
        </Suspense>
      ) : allow3D ? (
        <ThreePoster className={`absolute inset-0 ${heightClass}`} />
      ) : null}
    </div>
  )
}
