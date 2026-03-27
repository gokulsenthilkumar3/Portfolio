'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, LogOut, Loader2, Download, Edit3 } from 'lucide-react'
import { useAdmin } from './AdminProvider'

interface AdminToolbarProps {
  onOpenPanel?: () => void
}

export function AdminToolbar({ onOpenPanel }: AdminToolbarProps) {
  const { isAdmin, deactivate, isSaving, exportConfig, persistData } = useAdmin()
  const [exported, setExported] = useState(false)

  const handleExport = () => {
    const config = exportConfig()
    const blob = new Blob([config], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio-data.json'
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <AnimatePresence>
      {isAdmin && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between px-5 py-2.5"
          style={{
            background: 'linear-gradient(90deg, rgba(10,15,30,0.95) 0%, rgba(20,30,50,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(59,130,246,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {/* Left: Mode indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Pulsing dot */}
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-60" />
              </div>
              <span className="text-xs font-semibold text-blue-300" style={{ letterSpacing: '0.05em' }}>
                ADMIN MODE
              </span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <span className="text-xs text-gray-500">Hover any section to edit</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isSaving && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-1.5 text-xs text-blue-400 px-2"
                >
                  <Loader2 size={11} className="animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={persistData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#93c5fd',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              <Download size={11} />
              Save to Server
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={deactivate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={11} />
              Exit
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
