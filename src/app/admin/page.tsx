'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '@/components/admin/AdminProvider'
import { AdminDashboard } from '@/components/admin/editors/AdminDashboard'
import { PersonalEditor } from '@/components/admin/editors/PersonalEditor'
import { ProjectEditor } from '@/components/admin/editors/ProjectEditor'
import { SkillEditor } from '@/components/admin/editors/SkillEditor'
import { ResumeEditor } from '@/components/admin/editors/ResumeEditor'
import { PinModal } from '@/components/admin/PinModal'
import { 
  User, 
  FolderGit2, 
  Wrench, 
  Briefcase, 
  LayoutDashboard, 
  Save, 
  LogOut, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const tabs = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'resume', label: 'Resume', icon: Briefcase },
]

export default function AdminPage() {
  const { isAdmin, portfolioData, isSaving, persistData, deactivate } = useAdmin()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#141e32] border border-blue-500/20 rounded-3xl p-8 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 mb-8 text-sm">Please verify your identity to access the portfolio dashboard.</p>
          <PinModal 
            onClose={() => {}} 
            onSuccess={() => {}} 
          />
          <div className="mt-8 pt-8 border-t border-white/5">
            <Link href="/" className="text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={12} />
              Return to Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0f1e] border-r border-white/5 z-50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <LayoutDashboard className="text-blue-400" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Admin</h2>
              <p className="text-[10px] text-gray-500">v1.0.4 - Local Sync</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{tab.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={deactivate}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#050810]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white capitalize">{activeTab}</h1>
            <p className="text-xs text-gray-500">Managing your portfolio content</p>
          </div>

          <div className="flex items-center gap-4">
            {isSaving && (
              <span className="flex items-center gap-2 text-xs text-blue-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Auto-saving...
              </span>
            )}
            <Button
              onClick={persistData}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-blue-600/20"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save to Server'}
            </Button>
            <Link href="/" className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
              <LogOut size={20} />
            </Link>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'personal' && <PersonalEditor />}
            {activeTab === 'projects' && <ProjectEditor />}
            {activeTab === 'skills' && <SkillEditor />}
            {activeTab === 'resume' && <ResumeEditor />}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
