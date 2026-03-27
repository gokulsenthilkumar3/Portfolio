'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, FolderGit2, Wrench, Briefcase, Link2, ChevronRight } from 'lucide-react'
import { useAdmin } from './AdminProvider'
import { PersonalEditor } from './editors/PersonalEditor'
import { ProjectEditor } from './editors/ProjectEditor'
import { SkillEditor } from './editors/SkillEditor'
import { ExperienceEditor } from './editors/ExperienceEditor'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: string
}

const tabs = [
  { id: 'personal', label: 'Personal', icon: User, description: 'Bio, contact, links' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, description: 'Add, edit, remove projects' },
  { id: 'skills', label: 'Skills', icon: Wrench, description: 'Tech stack & proficiency' },
  { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Work history & roles' },
]

export function AdminPanel({ isOpen, onClose, initialTab = 'personal' }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const { isSaving } = useAdmin()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990]"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 z-[9991] w-[480px] max-w-[95vw] flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(10,15,30,0.98) 0%, rgba(15,20,40,0.99) 100%)',
              borderLeft: '1px solid rgba(59,130,246,0.15)',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div>
                <h2 className="text-sm font-semibold text-white">Portfolio Editor</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Changes save automatically</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-3 py-2 gap-1 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all text-center"
                    style={{
                      background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                    }}
                  >
                    <Icon size={14} className={isActive ? 'text-blue-400' : 'text-gray-500'} />
                    <span className={`text-[10px] font-medium ${isActive ? 'text-blue-300' : 'text-gray-500'}`}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >
                  {activeTab === 'personal' && <PersonalEditor />}
                  {activeTab === 'projects' && <ProjectEditor />}
                  {activeTab === 'skills' && <SkillEditor />}
                  {activeTab === 'experience' && <ExperienceEditor />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
