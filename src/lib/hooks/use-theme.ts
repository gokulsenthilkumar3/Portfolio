import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Theme } from '../design-system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  layout: {
    compactMode: boolean
    showIndicators: boolean
    progressBar: boolean
  }
  updateLayout: (settings: Partial<ThemeStore['layout']>) => void
  performance: {
    reduceAnimations: boolean
    disable3D: boolean
    simplifiedTheme: boolean
  }
  updatePerformance: (settings: Partial<ThemeStore['performance']>) => void
  accessibility: {
    highContrast: boolean
    largerClickTargets: boolean
    focusIndicators: boolean
  }
  updateAccessibility: (settings: Partial<ThemeStore['accessibility']>) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      layout: { compactMode: false, showIndicators: true, progressBar: true },
      updateLayout: (s) => set((state) => ({ layout: { ...state.layout, ...s } })),
      performance: { reduceAnimations: false, disable3D: false, simplifiedTheme: false },
      updatePerformance: (s) => set((state) => ({ performance: { ...state.performance, ...s } })),
      accessibility: { highContrast: false, largerClickTargets: false, focusIndicators: true },
      updateAccessibility: (s) => set((state) => ({ accessibility: { ...state.accessibility, ...s } }))
    }),
    {
      name: 'theme-storage',
    }
  )
)
