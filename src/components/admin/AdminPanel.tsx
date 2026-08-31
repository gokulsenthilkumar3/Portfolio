'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminDashboard } from './editors/AdminDashboard'
import { ContentEditor } from './editors/ContentEditor'
import { PersonalEditor } from './editors/PersonalEditor'
import { ProjectEditor } from './editors/ProjectEditor'
import { SkillEditor } from './editors/SkillEditor'
import { ResumeEditor } from './editors/ResumeEditor'
import { BlogEditor } from './editors/BlogEditor'
import { MicroblogEditor } from './editors/MicroblogEditor'
import { useAdmin } from './AdminProvider'
import { X, User, FolderGit2, Wrench, Briefcase, LayoutDashboard, Save, FileText, BookOpen, MessageSquare } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { useFocusTrap } from '@/lib/hooks/use-focus-trap'

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
  { id: 'blog', label: 'Blog', icon: BookOpen, description: 'Insights & articles' },
  { id: 'microblog', label: 'Insights', icon: MessageSquare, description: 'Quick micro-blogs' },
]

export function AdminPanel({ isOpen, onClose, initialTab = 'dashboard' }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const { isSaving, isPublishing, persistData, hasUnsavedChanges } = useAdmin()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        return
      }
    }
    onClose()
  }

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab)
  }, [initialTab, isOpen])

  useFocusTrap(isOpen, panelRef, { initialFocusRef: closeRef, onClose: handleClose })

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

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
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-panel-title"
            aria-describedby="admin-panel-description"
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
                <div>
                  <h2 id="admin-panel-title" className="text-sm font-bold text-white uppercase tracking-wider">Admin Panel</h2>
                  <p id="admin-panel-description" className="sr-only">Edit portfolio content and publish the current draft.</p>
                </div>
                {isSaving && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => persistData()}
                  disabled={isSaving || isPublishing}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-[11px] font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  <Save size={12} />
                  {isPublishing ? 'Publishing…' : isSaving ? 'Updating…' : 'Publish changes'}
                </button>
                
                <button 
                  ref={closeRef}
                  type="button"
                  onClick={handleClose}
                  title="Close editor"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-3 py-2 border-b border-white/5">
              <Tabs
                tabs={tabs.map(tab => ({
                  id: tab.id,
                  label: (
                    <div className="flex flex-col items-center gap-1">
                      <tab.icon size={14} className={activeTab === tab.id ? 'text-blue-400' : 'text-gray-500'} />
                      <span className={`text-[10px] font-medium ${activeTab === tab.id ? 'text-blue-300' : 'text-gray-500'}`}>
                        {tab.label}
                      </span>
                    </div>
                  )
                }))}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="bg-transparent border-none space-x-1"
                tabClassName="py-2 px-1"
              />
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
                  role="tabpanel"
                  id={`panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                >
                  {activeTab === 'dashboard' && <AdminDashboard />}
                  {activeTab === 'personal' && <PersonalEditor />}
                  {activeTab === 'content' && <ContentEditor />}
                  {activeTab === 'projects' && <ProjectEditor />}
                  {activeTab === 'skills' && <SkillEditor />}
                  {activeTab === 'resume' && <ResumeEditor />}
                  {activeTab === 'blog' && <BlogEditor />}
                  {activeTab === 'microblog' && <MicroblogEditor />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
