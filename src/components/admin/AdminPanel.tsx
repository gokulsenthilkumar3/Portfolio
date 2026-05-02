'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminDashboard } from './editors/AdminDashboard'
import { ContentEditor } from './editors/ContentEditor'
import { PersonalEditor } from './editors/PersonalEditor'
import { ProjectEditor } from './editors/ProjectEditor'
import { SkillEditor } from './editors/SkillEditor'
import { ResumeEditor } from './editors/ResumeEditor'
import { useAdmin } from './AdminProvider'
import { X, User, FolderGit2, Wrench, Briefcase, LayoutDashboard, Save, FileText } from 'lucide-react'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: string
}

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, description: 'Stats & Activity' },
  { id: 'personal', label: 'Personal', icon: User, description: 'Bio, contact, links' },
  { id: 'content', label: 'Content', icon: FileText, description: 'Landing page text' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, description: 'Add, edit, remove projects' },
  { id: 'skills', label: 'Skills', icon: Wrench, description: 'Tech stack & proficiency' },
  { id: 'resume', label: 'Resume', icon: Briefcase, description: 'Work & Education' },
]

export function AdminPanel({ isOpen, onClose, initialTab = 'dashboard' }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const { isSaving, persistData } = useAdmin()

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
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Admin Panel</h2>
                {isSaving && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => persistData()}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-[11px] font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  <Save size={12} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button 
                  onClick={onClose}
                  title="Close editor"
                  className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-3 py-2 gap-1 border-b border-white/5">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all text-center border ${
                      isActive 
                        ? 'bg-blue-500/15 border-blue-500/25' 
                        : 'bg-transparent border-transparent'
                    }`}
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
                  {activeTab === 'dashboard' && <AdminDashboard />}
                  {activeTab === 'personal' && <PersonalEditor />}
                  {activeTab === 'content' && <ContentEditor />}
                  {activeTab === 'projects' && <ProjectEditor />}
                  {activeTab === 'skills' && <SkillEditor />}
                  {activeTab === 'resume' && <ResumeEditor />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
