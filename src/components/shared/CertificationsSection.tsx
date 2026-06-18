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
        <h4 className="text-xl font-bold font-display">Licenses & Certifications</h4>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <AnimatedSection key={cert.id} animation="slideUp" delay={0.1 * index}>
            <Card className="group relative overflow-hidden border-white/8 bg-white/3 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h5 className="font-bold text-base mb-1">{cert.name}</h5>
                  <p className="text-sm font-medium text-muted-foreground">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Issued {cert.issued} {cert.expires ? `· Expires ${cert.expires}` : ''}
                  </p>
                </div>
                {cert.url && (
                  <div className="mt-4 sm:mt-0 flex-shrink-0">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                    >
                      Show credential <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
