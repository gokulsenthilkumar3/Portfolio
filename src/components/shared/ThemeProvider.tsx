'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/hooks/use-theme'
import { themes, Theme } from '@/lib/design-system'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    
    // Remove all theme classes
    Object.keys(themes).forEach((themeName) => {
      root.classList.remove(themeName)
    })
    
    // Add current theme class
    root.classList.add(theme)
    
    // Update CSS custom properties
    const themeColors = themes[theme]
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
    })
  }, [theme])

  return <>{children}</>
}
