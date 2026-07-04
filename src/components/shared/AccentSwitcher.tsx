'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAccentStore, ACCENT_PALETTES, restoreAccent, type AccentId } from '@/lib/stores/theme-accent'

export function AccentSwitcher() {
  const { accent, setAccent } = useAccentStore()
  const [open, setOpen] = useState(false)
  useEffect(() => { restoreAccent() }, [])
  const palettes = Object.values(ACCENT_PALETTES)
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
            className="flex flex-col gap-2 p-3 rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl"
            role="menu"
            aria-label="Color theme options"
          >
            {palettes.map((p) => {
              const isActive = accent === p.id
              return (
                <button
                  key={p.id}
                  role="menuitem"
                  aria-pressed={isActive}
                  onClick={() => { setAccent(p.id as AccentId); setOpen(false) }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors text-left w-full group"
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-6 h-6 rounded-full transition-transform group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${p.threeA}, ${p.threeB})`, boxShadow: isActive ? `0 0 12px ${p.glow}` : 'none' }}
                    />
                    {isActive && <motion.div layoutId="active-accent-ring" className="absolute -inset-1 rounded-full border-2 border-white/60" />}
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
        className="w-10 h-10 rounded-full border border-white/15 bg-background/80 backdrop-blur-xl shadow-lg flex items-center justify-center hover:border-white/30 transition-colors"
        style={{ boxShadow: `0 0 20px ${ACCENT_PALETTES[accent].glow}` }}
      >
        <div className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg, ${ACCENT_PALETTES[accent].threeA}, ${ACCENT_PALETTES[accent].threeB})` }} />
      </motion.button>
    </div>
  )
}
