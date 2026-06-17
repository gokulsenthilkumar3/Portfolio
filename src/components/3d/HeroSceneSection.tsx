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

import { useEffect, useState } from 'react'
import { HeroScene } from '@/components/3d/HeroScene'

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

interface Props {
  className?: string
}

export function HeroSceneSection({ className }: Props) {
  const [allow3D, setAllow3D] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setAllow3D(!reduced && canUseWebGL())
  }, [])

  if (!allow3D) return null

  return <HeroScene className={className} />
}
