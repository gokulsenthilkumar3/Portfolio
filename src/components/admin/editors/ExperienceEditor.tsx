'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Pencil, X, Check, Building2, Calendar } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { portfolioConfig } from '@/config/portfolio.config'

type Experience = (typeof portfolioConfig.experiences)[0]

const BLANK: Experience = {
  id: '',
  role: '',
  company: '',
  period: { start: '', present: false },
  description: [],
  technologies: [],
  location: '',
  type: 'full-time',
}

export function ExperienceEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const experiences = (portfolioData.experiences as Experience[]) || []
  const [editing, setEditing] = useState<Experience | null>(null)
  const [saved, setSaved] = useState(false)

  const save = async (updated: Experience[]) => {
    await updateSection('experiences', updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleSave = async (exp: Experience) => {
    const exists = experiences.some(e => e.id === exp.id)
    const updated = exists
      ? experiences.map(e => e.id === exp.id ? exp : e)
      : [...experiences, exp]
    await save(updated)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    await save(experiences.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{experiences.length} entries</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditing({ ...BLANK, id: Date.now().toString() })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
        >
          <Plus size={12} /> Add Experience
        </motion.button>
      </div>

      {experiences.map(exp => (
        <motion.div
          key={exp.id}
          layout
          className="p-3 rounded-xl space-y-1 bg-white/[0.03] border border-white/[0.06]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{exp.role || 'Untitled Role'}</p>
              <p className="text-[10px] text-gray-500">{exp.company} · {exp.type}</p>
              <p className="text-[10px] text-gray-600">
                {exp.period.start} – {exp.period.present ? 'Present' : exp.period.end || ''}
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => setEditing(exp)}
                title="Edit experience"
                aria-label="Edit experience"
                className="p-1 rounded text-gray-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
              >
                <Pencil size={10} />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                title="Delete experience"
                aria-label="Delete experience"
                className="p-1 rounded text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Experience Form Modal */}
      <AnimatePresence>
        {editing && (
          <ExperienceForm
            experience={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: {
  experience: Experience
  onSave: (e: Experience) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...experience })
  const [descInput, setDescInput] = useState(experience.description?.join('\n') || '')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-[440px] max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-2xl p-5 space-y-4 bg-[#0a0f1e]/98 border border-blue-500/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {experience.id ? 'Edit Experience' : 'New Experience'}
          </h3>
          <button onClick={onCancel} title="Cancel" aria-label="Cancel" className="p-1 rounded text-gray-500 hover:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="grid gap-3">
          {[
            { key: 'role', label: 'Role / Position' },
            { key: 'company', label: 'Company Name' },
            { key: 'location', label: 'Location' },
          ].map(f => (
            <div key={f.key}>
              <label htmlFor={`exp-${f.key}`} className="block text-[11px] text-gray-400 mb-1">{f.label}</label>
              <input
                id={`exp-${f.key}`}
                value={(form as Record<string, string>)[f.key] || ''}
                placeholder={f.label}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="exp-start" className="block text-[11px] text-gray-400 mb-1">Start Date</label>
              <input
                id="exp-start"
                type="date"
                title="Start Date"
                value={form.period?.start || ''}
                onChange={e => setForm(prev => ({ ...prev, period: { ...prev.period, start: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="exp-end" className="block text-[11px] text-gray-400 mb-1">End Date</label>
              <input
                id="exp-end"
                type="date"
                title="End Date"
                value={form.period?.end || ''}
                disabled={form.period?.present}
                onChange={e => setForm(prev => ({ ...prev, period: { ...prev.period, end: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none disabled:opacity-40"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.period?.present || false}
              onChange={e => setForm(prev => ({ ...prev, period: { ...prev.period, present: e.target.checked, end: undefined } }))}
            />
            <span className="text-xs text-gray-300">Currently working here</span>
          </label>

          <div>
            <label htmlFor="exp-type" className="block text-[11px] text-gray-400 mb-1">Employment Type</label>
            <select
              id="exp-type"
              title="Employment Type"
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Experience['type'] }))}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
            >
              {['full-time', 'part-time', 'contract', 'freelance', 'internship'].map(t => (
                <option key={t} value={t} className="bg-gray-900 text-white">{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Description (one bullet per line)</label>
            <textarea
              value={descInput}
              onChange={e => {
                setDescInput(e.target.value)
                setForm(prev => ({
                  ...prev,
                  description: e.target.value.split('\n').filter(Boolean)
                }))
              }}
              rows={4}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none resize-none"
              placeholder="Led development of...&#10;Mentored junior devs...&#10;Improved performance by..."
            />
          </div>

          <div>
            <label htmlFor="exp-tech" className="block text-[11px] text-gray-400 mb-1">Technologies (comma-separated)</label>
            <input
              id="exp-tech"
              value={form.technologies?.join(', ') || ''}
              placeholder="e.g. React, TypeScript, Node.js"
              onChange={e => setForm(prev => ({
                ...prev,
                technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              }))}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 bg-white/5 hover:bg-white/8 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-blue-500 to-indigo-600"
          >
            Save Experience
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
