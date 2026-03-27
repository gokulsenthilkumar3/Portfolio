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

      {/* Edit button */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 400 }}
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            className="absolute top-2 right-2 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium pointer-events-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.9), rgba(99,102,241,0.9))',
              boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
              backdropFilter: 'blur(8px)',
              color: 'white',
            }}
          >
            <Pencil size={10} />
            Edit {label}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
