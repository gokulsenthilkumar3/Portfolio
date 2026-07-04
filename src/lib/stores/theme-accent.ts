import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Theme Accent System — 4 palettes, user-selectable
 * Each accent sets CSS custom properties on :root so ALL
 * components (3D glows, CSS shadows, gradients) automatically
 * follow the chosen palette.
 */

export type AccentId = 'blue-purple' | 'purple-pink' | 'cyan-green' | 'orange-gold'

export interface AccentPalette {
  id: AccentId
  name: string
  emoji: string
  // HSL values used as CSS custom properties
  primary: string    // --accent-primary
  secondary: string  // --accent-secondary
  glow: string       // --accent-glow (rgba for box-shadow/bloom)
  glowAlt: string    // --accent-glow-alt
  // Three.js hex colors (used in WebGL components)
  threeA: string
  threeB: string
  threeC: string
}

export const ACCENT_PALETTES: Record<AccentId, AccentPalette> = {
  'blue-purple': {
    id: 'blue-purple',
    name: 'Blue · Purple',
    emoji: '🔵',
    primary: '220 90% 60%',
    secondary: '270 80% 65%',
    glow: 'rgba(99,102,241,0.35)',
    glowAlt: 'rgba(168,85,247,0.25)',
    threeA: '#6366f1',
    threeB: '#a855f7',
    threeC: '#818cf8',
  },
  'purple-pink': {
    id: 'purple-pink',
    name: 'Purple · Pink',
    emoji: '💜',
    primary: '270 75% 62%',
    secondary: '330 85% 65%',
    glow: 'rgba(168,85,247,0.35)',
    glowAlt: 'rgba(236,72,153,0.25)',
    threeA: '#a855f7',
    threeB: '#ec4899',
    threeC: '#c084fc',
  },
  'cyan-green': {
    id: 'cyan-green',
    name: 'Cyan · Green',
    emoji: '🟢',
    primary: '185 85% 50%',
    secondary: '142 70% 50%',
    glow: 'rgba(6,182,212,0.35)',
    glowAlt: 'rgba(34,197,94,0.25)',
    threeA: '#06b6d4',
    threeB: '#22c55e',
    threeC: '#67e8f9',
  },
  'orange-gold': {
    id: 'orange-gold',
    name: 'Orange · Gold',
    emoji: '🌅',
    primary: '25 95% 58%',
    secondary: '45 95% 55%',
    glow: 'rgba(249,115,22,0.35)',
    glowAlt: 'rgba(234,179,8,0.25)',
    threeA: '#f97316',
    threeB: '#eab308',
    threeC: '#fb923c',
  },
}

interface AccentStore {
  accent: AccentId
  setAccent: (id: AccentId) => void
}

export const useAccentStore = create<AccentStore>()(
  persist(
    (set) => ({
      accent: 'blue-purple',
      setAccent: (id) => {
        set({ accent: id })
        applyAccentToDom(id)
      },
    }),
    { name: 'portfolio-accent' }
  )
)

/** Applies CSS custom properties directly to :root — zero React re-renders */
export function applyAccentToDom(id: AccentId) {
  if (typeof document === 'undefined') return
  const p = ACCENT_PALETTES[id]
  const root = document.documentElement
  root.style.setProperty('--accent-primary', p.primary)
  root.style.setProperty('--accent-secondary', p.secondary)
  root.style.setProperty('--accent-glow', p.glow)
  root.style.setProperty('--accent-glow-alt', p.glowAlt)
  root.setAttribute('data-accent', id)
}

/** Call once on mount to restore persisted accent */
export function restoreAccent() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('portfolio-accent')
    if (raw) {
      const { state } = JSON.parse(raw) as { state: { accent: AccentId } }
      if (state?.accent) applyAccentToDom(state.accent)
    }
  } catch { /* ignore */ }
}

/** Convenience: get current palette object */
export function useCurrentPalette(): AccentPalette {
  const accent = useAccentStore(s => s.accent)
  return ACCENT_PALETTES[accent]
}
