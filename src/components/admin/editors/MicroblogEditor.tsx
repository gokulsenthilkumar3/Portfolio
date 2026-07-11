'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { Microblog } from '@/lib/types/portfolio'

export function MicroblogEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const microblogs = (portfolioData.microblogs as Microblog[]) || []
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const save = async (updated: Microblog[]) => {
    await updateSection('microblogs', updated)
  }

  const updateMicroblog = (id: string, changes: Partial<Microblog>) => {
    const updated = microblogs.map(p => p.id === id ? { ...p, ...changes } : p)
    save(updated)
  }

  const deleteMicroblog = (id: string) => {
    save(microblogs.filter(p => p.id !== id))
  }

  const addMicroblog = () => {
    const newMicroblog: Microblog = {
      id: `insight-${Date.now()}`,
      text: 'Start writing your microblog insight here...',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    save([newMicroblog, ...microblogs])
    setExpandedId(newMicroblog.id)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <AnimatePresence>
          {microblogs.map(microblog => (
            <motion.div
              key={microblog.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
            >
              <div 
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setExpandedId(expandedId === microblog.id ? null : microblog.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{microblog.text.substring(0, 50) || 'New Insight'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{microblog.date}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteMicroblog(microblog.id) }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete microblog"
                >
                  <Trash2 size={12} />
                </button>
                {expandedId === microblog.id ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
              </div>

              <AnimatePresence>
                {expandedId === microblog.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.06] p-3 space-y-3"
                  >
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Date</label>
                      <input
                        value={microblog.date}
                        onChange={e => updateMicroblog(microblog.id, { date: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                        title="Date"
                        placeholder="Date"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Text</label>
                      <textarea
                        value={microblog.text}
                        onChange={e => updateMicroblog(microblog.id, { text: e.target.value })}
                        rows={4}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors resize-none"
                        title="Insight Text"
                        placeholder="Write your short insight here..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addMicroblog}
        className="w-full py-2 rounded-xl text-xs font-medium border border-dashed border-blue-500/30 text-blue-400 hover:bg-blue-500/5 transition-colors"
      >
        <Plus size={12} className="inline mr-1" />
        Add Quick Insight
      </motion.button>
    </div>
  )
}
