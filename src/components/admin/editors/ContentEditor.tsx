'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../AdminProvider'

interface FieldConfig {
  key: string
  label: string
  type?: 'text' | 'textarea'
}

const FIELDS: FieldConfig[] = [
  { key: 'title', label: 'About Title', type: 'text' },
  { key: 'subtitle', label: 'About Subtitle', type: 'text' },
  { key: 'featuredTitle', label: 'Featured Section Title', type: 'text' },
  { key: 'featuredDesc', label: 'Featured Section Desc (Short)', type: 'text' },
  { key: 'featuredLong', label: 'Featured Section Content (Long)', type: 'textarea' },
  { key: 'secondaryTitle', label: 'Secondary Section Title', type: 'text' },
  { key: 'secondarySkills', label: 'Secondary Skills (Comma separated)', type: 'text' },
  { key: 'contactHeading', label: 'Contact Heading', type: 'text' },
  { key: 'contactDesc', label: 'Contact Description', type: 'textarea' },
]

export function ContentEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const [form, setForm] = useState({ 
    ...portfolioData.about,
    secondarySkills: portfolioData.about.secondarySkills.join(', ')
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm({ 
      ...portfolioData.about,
      secondarySkills: portfolioData.about.secondarySkills.join(', ')
    })
  }, [portfolioData.about])

  const handleSave = async () => {
    const formattedData = {
      ...form,
      secondarySkills: form.secondarySkills.split(',').map(s => s.trim()).filter(Boolean)
    }
    await updateSection('about', formattedData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">Edit custom text blocks used throughout the landing page.</p>
      
      {FIELDS.map(field => (
        <div key={field.key}>
          <label htmlFor={`content-${field.key}`} className="block text-[11px] text-gray-400 mb-1.5 font-medium">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              id={`content-${field.key}`}
              value={(form as Record<string, string>)[field.key] || ''}
              placeholder={field.label}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none focus:bg-white/8 transition-all resize-none font-sans"
            />
          ) : (
            <input
              id={`content-${field.key}`}
              type="text"
              value={(form as Record<string, string>)[field.key] || ''}
              placeholder={field.label}
              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none focus:bg-white/8 transition-all"
            />
          )}
        </div>
      ))}

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
        {saved ? '✓ Saved!' : 'Save Content'}
      </motion.button>
    </div>
  )
}
