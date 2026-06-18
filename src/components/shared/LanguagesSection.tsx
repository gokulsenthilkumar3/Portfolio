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
        <h4 className="text-xl font-bold font-display">Languages</h4>
      </div>

      <div className="space-y-4">
        {languages.map((lang, index) => (
          <AnimatedSection key={lang.id} animation="slideUp" delay={0.1 * index}>
            <Card className="group relative overflow-hidden border-white/8 bg-white/3 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <div>
                <h5 className="font-bold text-base mb-1">{lang.name}</h5>
                <p className="text-sm font-medium text-muted-foreground">{lang.proficiency}</p>
                {lang.info && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {lang.info}
                  </p>
                )}
              </div>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
