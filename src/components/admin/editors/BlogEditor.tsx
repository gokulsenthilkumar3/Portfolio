'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { BlogPost } from '@/lib/types/portfolio'

export function BlogEditor() {
  const { portfolioData, updateSection } = useAdmin()
  const posts = (portfolioData.blog as BlogPost[]) || []
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const save = async (updated: BlogPost[]) => {
    await updateSection('blog', updated)
  }

  const updatePost = (id: string, changes: Partial<BlogPost>) => {
    const updated = posts.map(p => p.id === id ? { ...p, ...changes } : p)
    save(updated)
  }

  const deletePost = (id: string) => {
    save(posts.filter(p => p.id !== id))
  }

  const addPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Insight',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '3 min read',
      category: 'General',
      excerpt: 'Brief summary of the post...',
      content: '### New Post\n\nStart writing here...',
      slug: 'new-insight',
      readingTime: 3,
      tags: [],
      featured: false
    }
    save([...posts, newPost])
    setExpandedId(newPost.id)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <AnimatePresence>
          {posts.map(post => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
            >
              <div 
                className="flex items-center gap-2 p-3 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{post.title || 'Untitled'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{post.category} • {post.date}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deletePost(post.id) }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
                {expandedId === post.id ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
              </div>

              <AnimatePresence>
                {expandedId === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.06] p-3 space-y-3"
                  >
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Title</label>
                      <input
                        value={post.title}
                        onChange={e => updatePost(post.id, { title: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-medium text-gray-400 mb-1 block">Category</label>
                        <input
                          value={post.category || ''}
                          onChange={e => updatePost(post.id, { category: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-gray-400 mb-1 block">Date</label>
                        <input
                          value={post.date}
                          onChange={e => updatePost(post.id, { date: e.target.value })}
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Excerpt</label>
                      <textarea
                        value={post.excerpt}
                        onChange={e => updatePost(post.id, { excerpt: e.target.value })}
                        rows={2}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Content (Markdown)</label>
                      <textarea
                        value={post.content}
                        onChange={e => updatePost(post.id, { content: e.target.value })}
                        rows={6}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors resize-none font-mono"
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
        onClick={addPost}
        className="w-full py-2 rounded-xl text-xs font-medium border border-dashed border-blue-500/30 text-blue-400 hover:bg-blue-500/5 transition-colors"
      >
        <Plus size={12} className="inline mr-1" />
        Add New Insight
      </motion.button>
    </div>
  )
}
