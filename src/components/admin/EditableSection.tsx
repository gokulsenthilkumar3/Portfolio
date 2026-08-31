'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil } from 'lucide-react'
import { useAdmin } from './AdminProvider'

interface EditableSectionProps {
  children: React.ReactNode
  label: string
  onEdit: () => void
  className?: string
}

export function EditableSection({ children, label, onEdit, className = '' }: EditableSectionProps) {
  const { isAdmin } = useAdmin()
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  if (!isAdmin) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={ref}
      className={`relative group ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Edit overlay ring */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              outline: '2px dashed rgba(59,130,246,0.4)',
              outlineOffset: '4px',
            }}
          />
        )}
      </AnimatePresence>

      {/* Keep the control keyboard discoverable; hover only changes emphasis. */}
      <motion.button
        type="button"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0.78, scale: hovered ? 1 : 0.98, y: hovered ? 0 : -2 }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onEdit() }}
        aria-label={`Edit ${label} section`}
        className="absolute right-2 top-2 z-50 flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(99,102,241,0.9))',
          boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
          backdropFilter: 'blur(8px)',
          color: 'white',
        }}
      >
        <Pencil size={12} aria-hidden="true" />
        Edit {label}
      </motion.button>
    </div>
  )
}
