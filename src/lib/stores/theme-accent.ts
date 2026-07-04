import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useThemeStore } from '../hooks/use-theme'

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
  
  // Dark mode values
  primary: string
  secondary: string
  glow: string
  glowAlt: string
  threeA: string
  threeB: string
  threeC: string
  
  // Light mode variants
  primaryLight: string
  secondaryLight: string
  glowLight: string
  glowAltLight: string
  threeALight: string
  threeBLight: string
  threeCLight: string
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
    
    primaryLight: '230 85% 54%',
    secondaryLight: '270 70% 50%',
    glowLight: 'rgba(59,130,246,0.25)',
    glowAltLight: 'rgba(147,51,234,0.15)',
    threeALight: '#3b82f6',
    threeBLight: '#9333ea',
    threeCLight: '#60a5fa',
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

    primaryLight: '270 70% 50%',
    secondaryLight: '330 75% 50%',
    glowLight: 'rgba(147,51,234,0.25)',
    glowAltLight: 'rgba(219,39,119,0.15)',
    threeALight: '#9333ea',
    threeBLight: '#db2777',
    threeCLight: '#a855f7',
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

    primaryLight: '185 80% 35%',
    secondaryLight: '142 75% 35%',
    glowLight: 'rgba(8,145,178,0.25)',
    glowAltLight: 'rgba(22,163,74,0.15)',
    threeALight: '#0891b2',
    threeBLight: '#16a34a',
    threeCLight: '#06b6d4',
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

    primaryLight: '25 90% 45%',
    secondaryLight: '45 90% 40%',
    glowLight: 'rgba(234,88,12,0.25)',
    glowAltLight: 'rgba(202,138,4,0.15)',
    threeALight: '#ea580c',
    threeBLight: '#ca8a04',
    threeCLight: '#f97316',
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
      setAccent: (id) => set({ accent: id }),
    }),
    { name: 'portfolio-accent' }
  )
)

/** Applies CSS custom properties directly to :root — zero React re-renders */
export function applyAccentToDom(id: AccentId, theme: string = 'dark') {
  if (typeof document === 'undefined') return
  const p = ACCENT_PALETTES[id]
  const isLight = theme === 'light'
  const root = document.documentElement
  
  root.style.setProperty('--accent-primary', isLight ? p.primaryLight : p.primary)
  root.style.setProperty('--accent-secondary', isLight ? p.secondaryLight : p.secondary)
  root.style.setProperty('--accent-glow', isLight ? p.glowLight : p.glow)
  root.style.setProperty('--accent-glow-alt', isLight ? p.glowAltLight : p.glowAlt)
  
  // Update --primary / --ring so all Tailwind components follow the accent
  root.style.setProperty('--primary', isLight ? p.primaryLight : p.primary)
  root.style.setProperty('--ring', isLight ? p.primaryLight : p.primary)
  root.setAttribute('data-accent', id)
}

/** Call once on mount to restore persisted accent */
export function restoreAccent() {
  if (typeof window === 'undefined') return
  try {
    let currentTheme = 'dark'
    const rawTheme = localStorage.getItem('theme-storage')
    if (rawTheme) {
      const { state } = JSON.parse(rawTheme)
      if (state?.theme) currentTheme = state.theme
    }
    
    const rawAccent = localStorage.getItem('portfolio-accent')
    if (rawAccent) {
      const { state } = JSON.parse(rawAccent)
      if (state?.accent) applyAccentToDom(state.accent, currentTheme)
    }
  } catch { /* ignore */ }
}

/** 
 * Gets the current palette resolved for light/dark mode.
 * Safe to use inside any React component (it reacts to both accent and theme changes).
 */
export function useCurrentPalette() {
  const accent = useAccentStore(s => s.accent)
  const theme = useThemeStore(s => s.theme)
  const p = ACCENT_PALETTES[accent]
  const isLight = theme === 'light'
  
  return {
    id: p.id,
    name: p.name,
    threeA: isLight ? p.threeALight : p.threeA,
    threeB: isLight ? p.threeBLight : p.threeB,
    threeC: isLight ? p.threeCLight : p.threeC,
    glow: isLight ? p.glowLight : p.glow,
  }
}
