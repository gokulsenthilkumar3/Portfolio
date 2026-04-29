'use client'

import { useState } from 'react'
import { ExperienceEditor } from './ExperienceEditor'
import { Plus, GraduationCap, Briefcase } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { portfolioConfig } from '@/config/portfolio.config'
import { motion } from 'framer-motion'

type Education = (typeof portfolioConfig.education)[0]

export function ResumeEditor() {
  const [mode, setMode] = useState<'experience' | 'education'>('experience')
  const { portfolioData, updateSection } = useAdmin()
  const education = (portfolioData.education as Education[]) || []

  return (
    <div className="space-y-6">
      {/* Switcher */}
      <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
        <button
          onClick={() => setMode('experience')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'experience' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Briefcase size={14} /> Experience
        </button>
        <button
          onClick={() => setMode('education')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'education' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <GraduationCap size={14} /> Education
        </button>
      </div>

      {mode === 'experience' ? (
        <ExperienceEditor />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">{education.length} education entries</p>
            <button 
              className="text-[10px] uppercase tracking-widest font-bold text-blue-400 hover:text-blue-300 transition-colors"
              onClick={() => {
                const newEd: Education = {
                  id: Date.now().toString(),
                  degree: 'Degree Name',
                  field: 'Field of Study',
                  institution: 'University Name',
                  period: { start: '2020', end: '2024' },
                  location: 'City, Country',
                  grade: 'GPA/Grade'
                }
                updateSection('education', [...education, newEd])
              }}
            >
              + Add Education
            </button>
          </div>
          
          {education.map((ed, idx) => (
            <motion.div 
              key={ed.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3"
            >
              <div className="grid gap-3">
                <input 
                  value={ed.degree}
                  title="Degree"
                  placeholder="Degree (e.g. Master of Science)"
                  className="bg-transparent text-sm font-bold text-white border-none focus:ring-0 p-0 w-full"
                  onChange={e => {
                    const updated = [...education]
                    updated[idx] = { ...ed, degree: e.target.value }
                    updateSection('education', updated)
                  }}
                />
                <input 
                  value={ed.institution}
                  title="Institution"
                  placeholder="Institution (e.g. University Name)"
                  className="bg-transparent text-xs text-gray-400 border-none focus:ring-0 p-0 w-full"
                  onChange={e => {
                    const updated = [...education]
                    updated[idx] = { ...ed, institution: e.target.value }
                    updateSection('education', updated)
                  }}
                />
              </div>
              <button 
                className="text-[10px] text-red-500/50 hover:text-red-500 transition-colors"
                onClick={() => {
                  updateSection('education', education.filter(item => item.id !== ed.id))
                }}
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
