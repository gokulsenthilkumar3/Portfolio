'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Languages } from 'lucide-react'
import { languages } from '@/lib/data/content'

export function LanguagesSection() {
  if (!languages || languages.length === 0) return null

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Languages size={20} className="text-primary" />
        <h3 className="text-xl font-bold font-display">Languages</h3>
      </div>

      <div className="space-y-4">
        {languages.map((lang, index) => (
          <AnimatedSection key={lang.id} animation="slideUp" delay={0.1 * index}>
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-card/30 to-card/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]">
              {/* Subtle side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary/40 opacity-80" />
              
              <div className="p-5 pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">{lang.name}</h4>
                    <p className="text-sm font-medium text-foreground/80">{lang.proficiency}</p>
                  </div>
                </div>
                {lang.info && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{lang.info}</span>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
