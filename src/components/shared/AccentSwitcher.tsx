'use client'
/* eslint-disable react/forbid-dom-props */
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAccentStore, ACCENT_PALETTES, restoreAccent, applyAccentToDom, type AccentId } from '@/lib/stores/theme-accent'
import { useThemeStore } from '@/lib/hooks/use-theme'

const inlineStyle = (style: React.CSSProperties) => ({ style } as any)

export function AccentSwitcher() {
  const { accent, setAccent } = useAccentStore()
  const theme = useThemeStore(s => s.theme)
  const [open, setOpen] = useState(false)
  
  useEffect(() => { restoreAccent() }, [])
  
  // Re-sync CSS variables whenever the accent OR the light/dark theme changes
  useEffect(() => {
    applyAccentToDom(accent, theme)
  }, [accent, theme])

  const palettes = Object.values(ACCENT_PALETTES)
  const isLight = theme === 'light'
  const activePalette = ACCENT_PALETTES[accent]

  return (
    <div className="fixed bottom-6 left-6 z-[9990] flex flex-col items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            key="palette-panel"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2 p-3 rounded-2xl border border-white/10 dark:bg-background/80 bg-background/95 backdrop-blur-xl shadow-2xl"
            role="group"
            aria-label="Color theme options"
          >
            {palettes.map((p) => {
              const isActive = accent === p.id
              const colorA = isLight ? p.threeALight : p.threeA
              const colorB = isLight ? p.threeBLight : p.threeB
              const glow = isLight ? p.glowLight : p.glow
              return (
                <button
                  key={p.id}
                  {...(isActive ? { 'aria-pressed': true } : { 'aria-pressed': false })}
                  onClick={() => { setAccent(p.id as AccentId); setOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/8 transition-colors text-left w-full group"
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-6 h-6 rounded-full transition-transform group-hover:scale-110"
                      {...inlineStyle({ background: `linear-gradient(135deg, ${colorA}, ${colorB})`, boxShadow: isActive ? `0 0 12px ${glow}` : 'none' })}
                    />
                    {isActive && <motion.div layoutId="active-accent-ring" className="absolute -inset-1 rounded-full border-2 border-primary/60" />}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{p.name}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close theme picker' : 'Open theme picker'}
        aria-expanded={open}
        title="Switch color theme"
        className="w-10 h-10 rounded-full border border-black/10 dark:border-white/15 dark:bg-background/80 bg-background/95 backdrop-blur-xl shadow-lg flex items-center justify-center hover:border-black/20 dark:hover:border-white/30 transition-colors"
        {...inlineStyle({ boxShadow: `0 0 20px ${isLight ? activePalette.glowLight : activePalette.glow}` })}
      >
        <div className="w-5 h-5 rounded-full" {...inlineStyle({ background: `linear-gradient(135deg, ${isLight ? activePalette.threeALight : activePalette.threeA}, ${isLight ? activePalette.threeBLight : activePalette.threeB})` })} />
      </motion.button>
    </div>
  )
}
