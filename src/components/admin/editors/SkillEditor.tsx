'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { portfolioConfig } from '@/config/portfolio.config'

type Skill = (typeof portfolioConfig.skills)[0]

const CATEGORIES = ['frontend', 'backend', 'tools', 'design', 'soft-skills'] as const

export function SkillEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const skills = (portfolioData.skills as Skill[]) || []
  const [activeCategory, setActiveCategory] = useState<string>('frontend')
  const [saved, setSaved] = useState(false)

  const categorySkills = skills.filter(s => s.category === activeCategory)

  const save = async (updated: Skill[]) => {
    await updateSection('skills', updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const updateSkill = (id: string, changes: Partial<Skill>) => {
    const updated = skills.map(s => s.id === id ? { ...s, ...changes } : s)
    save(updated)
  }

  const deleteSkill = (id: string) => {
    save(skills.filter(s => s.id !== id))
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: 'New Skill',
      category: activeCategory as Skill['category'],
      proficiency: 3,
      color: '#3b82f6',
      yearsOfExperience: 1,
    }
    save([...skills, newSkill])
  }

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all capitalize border ${
              activeCategory === cat 
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                : 'bg-white/5 text-gray-500 border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills in category */}
      <div className="space-y-2">
        <AnimatePresence>
          {categorySkills.map(skill => (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
            >
              {/* Color dot */}
              <motion.div
                className="w-3 h-3 rounded-full flex-shrink-0 border border-white/10 shadow-sm"
                initial={false}
                animate={{ backgroundColor: (skill as any).color || '#3b82f6' }}
              />

              {/* Name */}
              <input
                value={skill.name}
                aria-label="Skill name"
                title="Skill name"
                onChange={e => updateSkill(skill.id, { name: e.target.value })}
                className="flex-1 min-w-0 bg-transparent text-xs text-white border-none outline-none focus:ring-0"
              />

              {/* Proficiency stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => updateSkill(skill.id, { proficiency: star })}
                    title={`Set proficiency to ${star}`}
                    aria-label={`Set proficiency to ${star}`}
                    className={`transition-colors text-[10px] ${
                      star <= skill.proficiency ? 'text-amber-500' : 'text-gray-700'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteSkill(skill.id)}
                title="Delete skill"
                aria-label="Delete skill"
                className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {categorySkills.length === 0 && (
          <p className="text-center text-xs text-gray-600 py-4">No skills in this category</p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addSkill}
        className="w-full py-2 rounded-xl text-xs font-medium border border-dashed border-blue-500/30 text-blue-400 hover:bg-blue-500/5 transition-colors"
      >
        <Plus size={12} className="inline mr-1" />
        Add Skill to {activeCategory}
      </motion.button>

      <p className="text-[10px] text-gray-600 text-center">Changes save immediately on edit</p>
    </div>
  )
}
