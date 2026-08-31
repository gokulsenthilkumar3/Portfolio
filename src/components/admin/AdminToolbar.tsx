'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Loader2, Download, Edit3 } from 'lucide-react'
import { useAdmin } from './AdminProvider'

interface AdminToolbarProps {
  onOpenPanel?: () => void
}

export function AdminToolbar({ onOpenPanel }: AdminToolbarProps) {
  const { isAdmin, deactivate, isSaving, isPublishing, hasUnsavedChanges, publishError, exportConfig, persistData } = useAdmin()
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
          className="fixed top-0 left-0 right-0 z-[9998] flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-[#0a0f1e]/95 to-[#141e32]/95 backdrop-blur-3xl border-b border-blue-500/20 shadow-2xl shadow-black/30"
        >
          {/* Left: Mode indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Pulsing dot */}
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-60" />
              </div>
              <span className="text-xs font-semibold text-blue-300 tracking-wider">
                ADMIN MODE
              </span>
            </div>
            <div className="h-3 w-px bg-white/10" />
            <span className="text-xs text-gray-500">Edit the curated draft</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {(isSaving || isPublishing) && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-1.5 text-xs text-blue-400 px-2"
                >
                  <Loader2 size={11} className="animate-spin" />
                  <span>{isPublishing ? 'Publishing…' : 'Draft saved locally'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {publishError && (
              <span className="max-w-48 truncate text-[11px] text-red-300" role="alert" title={publishError}>
                {publishError}
              </span>
            )}

            {onOpenPanel && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenPanel}
                className="flex min-h-11 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-white/10"
              >
                <Edit3 size={12} aria-hidden="true" />
                Open editor
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              className="flex min-h-11 items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10"
              title="Download a JSON backup of the draft"
            >
              <Download size={12} aria-hidden="true" />
              {exported ? 'Exported' : 'Export draft'}
            </motion.button>

            {/* Publish button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={persistData}
              disabled={isPublishing || isSaving || !hasUnsavedChanges}
              title={hasUnsavedChanges ? 'Publish draft to server' : 'No unpublished changes'}
              aria-label={hasUnsavedChanges ? 'Publish draft to server' : 'No unpublished changes'}
              className="flex min-h-11 items-center gap-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-blue-300 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={11} />
              {isPublishing ? 'Publishing…' : 'Publish changes'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={deactivate}
              className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
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
