'use client'

/**
 * HeroSceneSection
 *
 * SSR-safe wrapper for HeroScene.
 * Imported via dynamic({ ssr: false }) in page.tsx.
 * Handles:
 *   - WebGL availability check
 *   - prefers-reduced-motion gate
 *   - Immediate mount (hero is above fold, no IntersectionObserver delay needed)
 */

import { HeroScene } from '@/components/3d/HeroScene'
import { use3DGate } from '@/hooks/use3DGate'

interface Props {
  className?: string
}

export function HeroSceneSection({ className }: Props) {
  const allow3D = use3DGate()

  if (!allow3D) return null

  return <HeroScene className={className} />
}
