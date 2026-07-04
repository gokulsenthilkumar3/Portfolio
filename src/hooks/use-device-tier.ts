'use client'
import { useState, useEffect } from 'react'

/**
 * Device performance tiers:
 * 3 = High-end   — Full 3D WebGL, particles, shaders, cursor trail
 * 2 = Mid-range  — Simplified WebGL, reduced particles, no heavy shaders
 * 1 = Low-end    — Zero WebGL, pure CSS animations only
 *
 * Detection strategy (runs once, client-side only):
 *  1. navigator.deviceMemory   (Chrome/Android: memory in GB)
 *  2. navigator.hardwareConcurrency (CPU thread count)
 *  3. Quick GPU probe via WebGL renderer string
 *  4. prefers-reduced-motion (always forces tier 1)
 */

export type DeviceTier = 1 | 2 | 3

export function detectTier(): DeviceTier {
  // Reduced motion always wins
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 1

  const cores = navigator.hardwareConcurrency ?? 2
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

  // Immediately low-end if very constrained
  if (cores <= 2 || memory < 2) return 1

  // GPU probe — read renderer string from WebGL
  let gpuTier: 1 | 2 | 3 = 2
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      if (ext) {
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string
        const r = renderer.toLowerCase()
        // Integrated / low-end GPU keywords
        if (
          r.includes('intel hd') ||
          r.includes('intel uhd') ||
          r.includes('mesa') ||
          r.includes('swiftshader') ||
          r.includes('llvm') ||
          r.includes('mali-4') ||
          r.includes('adreno 3') ||
          r.includes('adreno 4')
        ) {
          gpuTier = cores >= 4 ? 2 : 1
        } else if (
          r.includes('nvidia') ||
          r.includes('geforce') ||
          r.includes('radeon') ||
          r.includes('apple m') ||
          r.includes('adreno 6') ||
          r.includes('mali-g7') ||
          r.includes('mali-g8')
        ) {
          gpuTier = 3
        } else {
          gpuTier = 2
        }
      }
    }
  } catch {
    gpuTier = 1
  }

  // Combine signals
  if (cores >= 8 && memory >= 8 && gpuTier === 3) return 3
  if (cores >= 4 && memory >= 4 && gpuTier >= 2) return 2
  if (cores >= 4 && memory >= 4) return 2
  return 1
}

let cachedTier: DeviceTier | null = null

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(3) // Optimistic default (SSR)

  useEffect(() => {
    if (cachedTier !== null) {
      setTier(cachedTier)
      return
    }
    const t = detectTier()
    cachedTier = t
    setTier(t)
  }, [])

  return tier
}

/** Convenience boolean helpers */
export function useCanWebGL() { return useDeviceTier() >= 2 }
export function useCanFullFX() { return useDeviceTier() >= 3 }
export function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])
  return mobile
}
