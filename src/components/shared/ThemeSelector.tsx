'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useThemeStore } from '@/lib/hooks/use-theme'
import { themes, Theme } from '@/lib/design-system'
import { Palette, Check } from 'lucide-react'

interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useThemeStore()

  const themeColors = {
    dark: 'bg-gray-900',
    light: 'bg-white border',
    neon: 'bg-purple-900',
    pastel: 'bg-pink-100',
    cyberpunk: 'bg-green-900'
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Palette className="h-4 w-4" />
        <span className="capitalize">{theme}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <Card className="w-64 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Choose Theme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(Object.keys(themes) as Theme[]).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => handleThemeChange(themeName)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-full ${themeColors[themeName]} border-2 border-muted-foreground/20`} />
                    <span className="flex-1 text-left capitalize">{themeName}</span>
                    {theme === themeName && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
