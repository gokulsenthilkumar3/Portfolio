'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Linkedin, ExternalLink, Briefcase, MapPin, Building2, GraduationCap } from 'lucide-react'
import { experiences, education, personal } from '@/config/portfolio.config'
import { motion } from 'framer-motion'
import Link from 'next/link'

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function LinkedInSection() {
  return (
    <div className="space-y-8">
      {/* LinkedIn Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/8 bg-[#0a66c2]/5 backdrop-blur-xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Linkedin size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#0a66c2]/30 shadow-lg shrink-0">
            <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h3 className="text-2xl font-bold font-display">{personal.name}</h3>
              <Badge className="bg-[#0a66c2]/20 text-[#0a66c2] hover:bg-[#0a66c2]/30 border-none rounded-full px-3">
                <Linkedin size={12} className="mr-1.5 inline" /> Profile
              </Badge>
            </div>
            <p className="text-lg text-foreground/90 font-medium mb-3 max-w-2xl">{personal.title}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {personal.location}</span>
              <span className="flex items-center gap-1.5"><Building2 size={14} /> CloudAssert Technologies</span>
              <span className="flex items-center gap-1.5"><GraduationCap size={14} /> Kongu Engineering College</span>
            </div>
            <Link 
              href={personal.linkedin} 
              target="_blank" 
              className="inline-flex items-center gap-2 text-sm font-medium text-[#0a66c2] hover:text-[#0a66c2]/80 transition-colors bg-[#0a66c2]/10 px-4 py-2 rounded-lg"
            >
              Connect on LinkedIn <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Experience Timeline */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase size={20} className="text-[#0a66c2]" />
          <h4 className="text-xl font-bold font-display">Experience</h4>
        </div>
        
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <AnimatedSection key={exp.id} animation="slideUp" delay={0.1 * index}>
              <div className="relative pl-8 md:pl-0">
                {/* Timeline line - hidden on very small screens, visible on md+ */}
                <div className="hidden md:block absolute left-[8.5rem] top-2 bottom-[-24px] w-px bg-white/10 last:hidden"></div>
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  {/* Date - Left side on desktop */}
                  <div className="md:w-32 shrink-0 md:text-right pt-1 hidden md:block">
                    <p className="text-sm font-medium text-muted-foreground">
                      {formatDate(exp.period.start)} - 
                      {exp.period.present ? ' Present' : exp.period.end ? formatDate(exp.period.end) : ''}
                    </p>
                  </div>
                  
                  {/* Timeline node */}
                  <div className="absolute left-0 md:static mt-1 md:mt-0 z-10 w-4 h-4 rounded-full bg-[#0a66c2] border-4 border-background flex items-center justify-center shadow-[0_0_10px_rgba(10,102,194,0.5)] shrink-0" />
                  
                  {/* Content card */}
                  <Card className="flex-1 border-white/8 bg-white/3 backdrop-blur-sm hover:border-[#0a66c2]/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="md:hidden text-xs text-muted-foreground mb-2">
                        {formatDate(exp.period.start)} - 
                        {exp.period.present ? ' Present' : exp.period.end ? formatDate(exp.period.end) : ''}
                      </div>
                      <h5 className="text-lg font-bold">{exp.role}</h5>
                      <p className="text-[#0a66c2] font-medium text-sm mb-3">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="mb-4 space-y-1.5">
                          {exp.achievements.map((ach, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-[#0a66c2] mt-0.5">•</span>
                              <span className="text-foreground/80">{ach}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {exp.technologies?.map(tech => (
                          <Badge key={tech} variant="secondary" className="bg-white/5 text-xs font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      
      {/* Education Timeline */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap size={20} className="text-[#0a66c2]" />
          <h4 className="text-xl font-bold font-display">Education</h4>
        </div>
        
        <div className="space-y-6">
          {education.map((edu, index) => (
            <AnimatedSection key={edu.id} animation="slideUp" delay={0.1 * index}>
              <div className="relative pl-8 md:pl-0">
                <div className="hidden md:block absolute left-[8.5rem] top-2 bottom-[-24px] w-px bg-white/10 last:hidden"></div>
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="md:w-32 shrink-0 md:text-right pt-1 hidden md:block">
                    <p className="text-sm font-medium text-muted-foreground">
                      {edu.period.start} - {edu.period.end}
                    </p>
                  </div>
                  
                  <div className="absolute left-0 md:static mt-1 md:mt-0 z-10 w-4 h-4 rounded-full bg-muted-foreground border-4 border-background flex items-center justify-center shrink-0" />
                  
                  <Card className="flex-1 border-white/8 bg-white/3 backdrop-blur-sm">
                    <CardContent className="p-5">
                      <div className="md:hidden text-xs text-muted-foreground mb-2">
                        {edu.period.start} - {edu.period.end}
                      </div>
                      <h5 className="text-lg font-bold">{edu.degree} in {edu.field}</h5>
                      <p className="text-foreground/80 font-medium text-sm mb-2">{edu.institution}</p>
                      {edu.grade && <Badge variant="outline" className="text-xs">{edu.grade}</Badge>}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
