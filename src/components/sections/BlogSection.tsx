'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Calendar, Clock, ChevronRight, PencilLine, MessageSquareQuote } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { BlogPost } from '@/lib/types/portfolio'
import { giscus, microblogs } from '@/lib/data/content'
import Giscus from '@giscus/react'

type BlogSectionProps = {
  posts: BlogPost[]
  editable?: boolean
  onEdit?: () => void
}

export function BlogSection({ posts, editable = false, onEdit }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  return (
    <div className="space-y-8">
      <AnimatedSection className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">Insights</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Writing that stays close to the work.</h2>
          <p className="mt-3 text-muted-foreground leading-7">
            Short notes, deeper articles, and practical reflections on automation, engineering quality, and delivery.
          </p>
        </div>

        {editable && onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <PencilLine className="h-4 w-4" />
            Edit insights
          </button>
        )}
      </AnimatedSection>

      {microblogs && microblogs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Quick notes</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {microblogs.map((mb, i) => (
              <AnimatedSection key={mb.id} animation="fadeIn" delay={0.05 * i}>
                <div className="rounded-3xl border border-border/70 bg-card/70 p-5 h-full">
                  <p className="text-sm leading-7 text-foreground/90">{mb.text}</p>
                  <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{mb.date}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {posts.map((post, i) => (
          <AnimatedSection key={post.id} animation="slideUp" delay={0.08 * i}>
            <button
              onClick={() => setSelectedPost(post)}
              className="group w-full text-left rounded-3xl border border-border/70 bg-card/70 p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-0">
                  {post.category}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <h3 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
            </button>
          </AnimatedSection>
        ))}
      </div>

      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 32 }}
              className="fixed inset-x-4 top-20 bottom-4 z-50 mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-border/70 bg-background/95 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <Badge variant="outline" className="rounded-full">
                  {selectedPost.category}
                </Badge>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Close
                </button>
              </div>

              <div className="h-full overflow-y-auto px-5 py-6 md:px-8 md:py-8">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">Insight detail</p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{selectedPost.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pb-6 border-b border-border/60">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {selectedPost.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {selectedPost.readTime}
                  </span>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary mt-6">
                  <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                </div>

                <div className="mt-10 pt-8 border-t border-border/60">
                  <h3 className="text-lg font-semibold mb-5">Comments</h3>
                  <Giscus
                    id="comments"
                    repo={giscus.repo as `${string}/${string}`}
                    repoId={giscus.repoId}
                    category={giscus.category}
                    categoryId={giscus.categoryId}
                    mapping="specific"
                    term={selectedPost.id}
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="top"
                    theme={typeof window !== 'undefined' ? `${window.location.origin}/giscus-theme.css` : 'preferred_color_scheme'}
                    lang="en"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
