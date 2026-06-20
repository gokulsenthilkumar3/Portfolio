'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils/cn'
import { Clock, Calendar, ChevronRight, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { BlogPost } from '@/lib/types/portfolio'

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  return (
    <section id="insights" className="py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <AnimatedSection animation="fadeIn">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 font-display">Insights & Articles</h2>
            <p className="text-muted-foreground max-w-2xl">
              Thoughts, learnings, and deep dives into test engineering, automation frameworks, and CI/CD pipelines.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <AnimatedSection key={post.id} animation="slideUp" delay={0.1 * i}>
              <Card 
                className="relative h-full flex flex-col transition-all duration-300 group cursor-pointer overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.5)]"
                onClick={() => setSelectedPost(post)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 relative z-10">
                  <ChevronRight className="text-primary" />
                </div>
                
                <CardHeader className="pb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors pr-8">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-x-4 bottom-4 top-20 sm:inset-x-auto sm:right-4 sm:w-[600px] bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md">
                <Badge variant="outline">{selectedPost.category}</Badge>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <h2 className="text-3xl font-bold mb-4 font-display">{selectedPost.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
                  <span className="flex items-center gap-2"><Calendar size={16} /> {selectedPost.date}</span>
                  <span className="flex items-center gap-2"><Clock size={16} /> {selectedPost.readTime}</span>
                </div>
                
                <div className="prose prose-slate dark:prose-invert prose-headings:font-display prose-a:text-primary max-w-none">
                  <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
