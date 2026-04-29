'use client'

import { useAdmin } from '../AdminProvider'
import { motion } from 'framer-motion'
import { LayoutDashboard, FolderGit2, Wrench, Briefcase, Activity, Clock, ShieldCheck } from 'lucide-react'

export function AdminDashboard() {
  const { portfolioData } = useAdmin()

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
            <h4 className="text-sm font-bold text-white">System Status</h4>
            <p className="text-[10px] text-gray-400">All modules synchronized</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500 font-medium">Session Stability</span>
            <span className="text-green-400 font-bold">99.9%</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '99.9%' }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={14} className="text-gray-500" />
          <h4 className="text-xs font-bold text-gray-300">Recent Activity</h4>
        </div>
        <div className="space-y-3">
          {[
            { action: 'Updated project "OxFin"', time: '2h ago' },
            { action: 'Added "Next.js" to skills', time: '5h ago' },
            { action: 'Modified bio in Personal', time: '1d ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-l-2 border-primary/20 pl-3">
              <span className="text-[11px] text-gray-400">{item.action}</span>
              <span className="text-[9px] text-gray-600 font-mono">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
