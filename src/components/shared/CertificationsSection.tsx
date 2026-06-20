'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Award, ExternalLink } from 'lucide-react'
import { certifications } from '@/lib/data/content'
import { motion } from 'framer-motion'

export function CertificationsSection() {
  if (!certifications || certifications.length === 0) return null

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Award size={20} className="text-primary" />
        <h3 className="text-xl font-bold font-display">Licenses & Certifications</h3>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <AnimatedSection key={cert.id} animation="slideUp" delay={0.1 * index}>
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-card/30 to-card/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]">
              {/* Subtle side accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary/40 opacity-80" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 pl-6">
                <div>
                  <h5 className="font-bold text-lg text-foreground tracking-tight mb-1 group-hover:text-primary transition-colors">{cert.name}</h5>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground/80">{cert.issuer}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span className="text-xs font-mono text-muted-foreground">
                      {cert.issued} {cert.expires ? `→ ${cert.expires}` : ''}
                    </span>
                  </div>
                </div>
                {cert.url && (
                  <div className="mt-2 sm:mt-0 flex-shrink-0">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white transition-colors bg-primary/10 hover:bg-primary px-4 py-2 rounded-full border border-primary/20 hover:border-primary"
                    >
                      Verify <ExternalLink size={12} />
                    </a>
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
