'use client'

import { useAdmin } from '../AdminProvider'
import { motion } from 'framer-motion'
import { FolderGit2, Wrench, Briefcase, Activity, ShieldCheck } from 'lucide-react'

export function AdminDashboard() {
  const { portfolioData, sourceSync } = useAdmin()
  const sourceLabel = (status: typeof sourceSync.github) => {
    if (status === 'ok') return 'Connected'
    if (status === 'loading') return 'Syncing…'
    if (status === 'not_configured') return 'Token required'
    return 'Unavailable'
  }

  const stats = [
    { label: 'Projects', value: portfolioData.projects?.length || 0, icon: FolderGit2, color: 'text-blue-400' },
    { label: 'Skills', value: portfolioData.skills?.length || 0, icon: Wrench, color: 'text-green-400' },
    { label: 'Experiences', value: portfolioData.experiences?.length || 0, icon: Briefcase, color: 'text-purple-400' },
    { label: 'Education', value: portfolioData.education?.length || 0, icon: Activity, color: 'text-orange-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={16} />
                </div>
                <span className="text-2xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Online sources</h4>
            <p className="text-[10px] text-gray-400">Live status from connected profiles</p>
          </div>
        </div>
        
        <div className="space-y-2 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">GitHub</span>
            <span className={sourceSync.github === 'ok' ? 'text-green-400 font-bold' : 'text-gray-400 font-bold'}>{sourceLabel(sourceSync.github)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium">LinkedIn</span>
            <span className={sourceSync.linkedIn === 'ok' ? 'text-green-400 font-bold' : 'text-gray-400 font-bold'}>{sourceLabel(sourceSync.linkedIn)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
