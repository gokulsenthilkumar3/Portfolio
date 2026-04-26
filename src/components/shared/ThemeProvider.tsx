'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/hooks/use-theme'
import { themes } from '@/lib/design-system'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    // 1. Remove all known theme classes
    Object.keys(themes).forEach((t) => {
      root.classList.remove(t)
    })
    root.classList.remove('light', 'dark')

    // 2. Add the active theme class (e.g. 'dark', 'light', 'neon')
    root.classList.add(theme)

    // 3. Also set data-theme for CSS [data-theme] selectors
    root.setAttribute('data-theme', theme)

    // 4. Apply design-system token overrides as CSS custom properties
    const themeColors = themes[theme]
    if (themeColors) {
      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(
          `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
          value as string
        )
      })
    }
  }, [theme])

  return <>{children}</>
}
