'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../AdminProvider'

interface FieldConfig {
  key: string
  label: string
  type?: 'text' | 'email' | 'url' | 'textarea'
  placeholder?: string
}

const FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'title', label: 'Professional Title', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'github', label: 'GitHub URL', type: 'url' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
  { key: 'twitter', label: 'Twitter URL', type: 'url' },
  { key: 'avatar', label: 'Avatar Image URL', type: 'url' },
]

export function PersonalEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const [form, setForm] = useState({ ...portfolioData.personal })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({ ...portfolioData.personal })
  }, [portfolioData.personal])

  const handleSave = async () => {
    await updateSection('personal', form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Edit your personal information and contact details.</p>
      
      {FIELDS.map(field => (
        <div key={field.key}>
          <label htmlFor={`personal-${field.key}`} className="block text-[11px] text-gray-400 mb-1.5 font-medium">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={`personal-${field.key}`}
              value={(form as Record<string, string>)[field.key] || ''}
              placeholder={field.label}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none focus:bg-white/8 transition-all resize-none"
            />
          ) : (
            <input
              id={`personal-${field.key}`}
              type={field.type || 'text'}
              value={(form as Record<string, string>)[field.key] || ''}
              placeholder={field.label}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none focus:bg-white/8 transition-all"
            />
          )}
        </div>
      ))}

      {/* Availability */}
      <div>
        <label htmlFor="personal-availability" className="block text-[11px] text-gray-400 mb-1.5 font-medium">Availability Status</label>
        <select
          id="personal-availability"
          title="Availability Status"
          value={form.availability}
          onChange={e => setForm(prev => ({ ...prev, availability: e.target.value as typeof form.availability }))}
          className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none transition-all"
        >
          <option value="available" className="bg-gray-900 text-white">✅ Available for hire</option>
          <option value="busy" className="bg-gray-900 text-white">🔴 Busy / Not available</option>
          <option value="open-to-offers" className="bg-gray-900 text-white">🟡 Open to offers</option>
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all mt-2 shadow-xl ${
          saved 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20'
        }`}
      >
        {saved ? '✓ Saved!' : 'Save Changes'}
      </motion.button>
    </div>
  )
}
