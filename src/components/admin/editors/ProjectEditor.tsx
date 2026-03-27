'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, ExternalLink, Github, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { portfolioConfig } from '@/config/portfolio.config'

type Project = (typeof portfolioConfig.projects)[0]

const BLANK_PROJECT: Project = {
  id: '',
  title: '',
  description: '',
  tech: [],
  images: [],
  links: { live: '', github: '' },
  featured: false,
  category: 'web',
  tags: [],
  date: new Date().toISOString().split('T')[0],
  status: 'in-progress',
}

export function ProjectEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const projects = (portfolioData.projects as Project[]) || []
  const [editing, setEditing] = useState<Project | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const save = async (updated: Project[]) => {
    await updateSection('projects', updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAdd = () => {
    const newProject = { ...BLANK_PROJECT, id: Date.now().toString() }
    setEditing(newProject)
  }

  const handleSaveProject = async (project: Project) => {
    const exists = projects.some(p => p.id === project.id)
    const updated = exists
      ? projects.map(p => p.id === project.id ? project : p)
      : [...projects, project]
    await save(updated)
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await save(projects.filter(p => p.id !== id))
  }

  const handleToggleFeatured = async (id: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, featured: !p.featured } : p)
    await save(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{projects.length} projects</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <Plus size={12} />
          Add Project
        </motion.button>
      </div>

      {/* Project list */}
      <div className="space-y-2">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/4 transition-colors"
              onClick={() => setExpanded(expanded === project.id ? null : project.id)}
            >
              {/* Image preview */}
              {project.images?.[0] ? (
                <img src={project.images[0]} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded bg-white/5 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{project.title || 'Untitled Project'}</p>
                <p className="text-[10px] text-gray-500">{project.category} · {project.status}</p>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setEditing(project) }}
                  className="p-1 rounded hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 transition-colors"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }}
                  className="p-1 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
                {expanded === project.id ? <ChevronUp size={11} className="text-gray-600" /> : <ChevronDown size={11} className="text-gray-600" />}
              </div>
            </div>

            <AnimatePresence>
              {expanded === project.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 text-[11px] text-gray-500 space-y-1 border-t border-white/5 pt-2">
                    <p className="line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech.slice(0, 4).map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleToggleFeatured(project.id)}
                        className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                          project.featured
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-white/5 text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {project.featured ? '⭐ Featured' : 'Mark Featured'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Project Form Modal */}
      <AnimatePresence>
        {editing && (
          <ProjectForm
            project={editing}
            onSave={handleSaveProject}
            onCancel={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project
  onSave: (p: Project) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...project })

  const handleTechChange = (value: string) => {
    setForm(prev => ({ ...prev, tech: value.split(',').map(t => t.trim()).filter(Boolean) }))
  }

  const handleTagsChange = (value: string) => {
    setForm(prev => ({ ...prev, tags: value.split(',').map(t => t.trim()).filter(Boolean) }))
  }

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
        className="w-[440px] max-w-[95vw] max-h-[85vh] overflow-y-auto rounded-2xl p-5 space-y-4"
        style={{
          background: 'rgba(10,15,30,0.98)',
          border: '1px solid rgba(59,130,246,0.2)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {project.id ? 'Edit Project' : 'New Project'}
          </h3>
          <button onClick={onCancel} className="p-1 rounded text-gray-500 hover:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="grid gap-3">
          {[
            { key: 'title', label: 'Project Title' },
            { key: 'description', label: 'Description', textarea: true },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[11px] text-gray-400 mb-1">{f.label}</label>
              {f.textarea ? (
                <textarea
                  value={(form as Record<string, string>)[f.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none resize-none"
                />
              ) : (
                <input
                  value={(form as Record<string, string>)[f.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
                />
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value as Project['category'] }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
              >
                {['web', 'mobile', '3d', 'ai', 'other'].map(c => (
                  <option key={c} value={c} className="bg-gray-900">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
              >
                {['completed', 'in-progress', 'planned'].map(s => (
                  <option key={s} value={s} className="bg-gray-900">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Tech Stack (comma-separated)</label>
            <input
              value={form.tech.join(', ')}
              onChange={e => handleTechChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Image URL</label>
            <input
              value={form.images?.[0] || ''}
              onChange={e => setForm(prev => ({ ...prev, images: [e.target.value] }))}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Live URL</label>
              <input
                value={form.links?.live || ''}
                onChange={e => setForm(prev => ({ ...prev, links: { ...prev.links, live: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">GitHub URL</label>
              <input
                value={form.links?.github || ''}
                onChange={e => setForm(prev => ({ ...prev, links: { ...prev.links, github: e.target.value } }))}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:border-blue-500/40 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded"
            />
            <span className="text-xs text-gray-300">Featured project (shown on homepage)</span>
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/8 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            Save Project
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
