'use client'

import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import Giscus from '@giscus/react'
import { giscus } from '@/lib/data/content'
import { GuestbookScene } from '@/components/3d/GuestbookScene'

export default function GuestbookPage() {
  return (
    <Section id="guestbook" className="min-h-[90vh] flex flex-col justify-center relative">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: 3D Scene */}
        <div className="h-[400px] lg:h-[600px] w-full relative order-2 lg:order-1">
          <AnimatedSection animation="fadeIn" className="w-full h-full">
            <GuestbookScene className="w-full h-full" />
          </AnimatedSection>
        </div>

        {/* Right Column: Content & Guestbook Form */}
        <div className="order-1 lg:order-2 flex flex-col justify-center">
          <AnimatedSection animation="slideLeft">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-display">
              Guestbook
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Leave a comment, say hello, or share your thoughts on my portfolio. 
              Sign in with GitHub to leave a permanent mark below!
            </p>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={0.2}>
            <div className="bg-card/40 rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              {/* Subtle glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <Giscus
                  id="guestbook-comments"
                  repo={giscus.repo as `${string}/${string}`}
                  repoId={giscus.repoId}
                  category={giscus.category}
                  categoryId={giscus.categoryId}
                  mapping="specific"
                  term="guestbook"
                  reactionsEnabled="1"
                  emitMetadata="0"
                  inputPosition="top"
                  theme={typeof window !== 'undefined' ? `${window.location.origin}/giscus-theme.css` : 'preferred_color_scheme'}
                  lang="en"
                  loading="lazy"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </Section>
  )
}
