'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import dynamic from 'next/dynamic'
import { TextReveal } from '@/components/effects/TextReveal'
import { MagneticButton } from '@/components/effects/MagneticButton'

const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then(mod => mod.HeroScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
})

import { GitHubSection } from '@/components/shared/GitHubSection'
import { LinkedInSection } from '@/components/shared/LinkedInSection'
import { projects as staticProjects, siteConfig, skills as staticSkills, about as staticAbout } from '@/lib/data/content'
import { getFeaturedProjects, getTopSkills, getTechIcon } from '@/lib/utils/content-helpers'
import type { Project } from '@/lib/types/portfolio'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useAdmin } from '@/components/admin/AdminProvider'
import { EditableSection } from '@/components/admin/EditableSection'
import { AdminPanel } from '@/components/admin/AdminPanel'

export default function Home() {
  const { isAdmin, portfolioData } = useAdmin()
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminPanelTab, setAdminPanelTab] = useState('personal')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Single source-of-truth hook pattern
  const currentProjects = (isAdmin && portfolioData.projects?.length > 0
    ? portfolioData.projects
    : staticProjects) as Project[]

  const currentSkills = isAdmin && portfolioData.skills?.length > 0
    ? portfolioData.skills
    : staticSkills

  const currentPersonal = isAdmin ? portfolioData.personal : siteConfig
  const currentAbout = isAdmin ? portfolioData.about : staticAbout

  const featuredProjects = getFeaturedProjects(currentProjects)
  const topSkills = getTopSkills(currentSkills as any, 8)

  const openPanel = (tab: string) => {
    setAdminPanelTab(tab)
    setAdminPanelOpen(true)
  }

  return (
    <>
      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel
          isOpen={adminPanelOpen}
          onClose={() => setAdminPanelOpen(false)}
          initialTab={adminPanelTab}
        />
      )}

      {/* ─── HERO ──────────────────────────────────────────────────────────────── */}
      <Section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        {/* Spectacular 3D Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50 z-10" />
          <HeroScene className="w-full h-full" />
        </div>

        <EditableSection label="Hero" onEdit={() => openPanel('personal')} className="relative z-10 w-full pt-20">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
            
            {/* Availability badge */}
            <AnimatedSection animation="fadeIn" delay={0.1}>
              <div className="mb-8 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md text-primary uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {currentPersonal.availability === 'busy' ? 'Currently focusing on core projects' : 'Available for new opportunities'}
              </div>
            </AnimatedSection>

            {/* Name + Title */}
            <AnimatedSection animation="slideUp" delay={0.3}>
              <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-4 leading-none font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
                {currentPersonal.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-indigo-500 to-pink-500">{currentPersonal.name.split(' ').slice(1).join(' ')}</span>
              </h1>
            </AnimatedSection>

            {/* Bio */}
            <AnimatedSection animation="slideUp" delay={0.5}>
              <p className="text-xl md:text-3xl font-medium text-white/80 mb-6 tracking-tight max-w-3xl mx-auto drop-shadow-lg">
                {currentPersonal.title}
              </p>
              <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed backdrop-blur-sm p-4 rounded-2xl bg-white/5 border border-white/10">
                {currentPersonal.bio}
              </p>
            </AnimatedSection>

            {/* CTAs */}
            <AnimatedSection animation="slideUp" delay={0.7}>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton>
                  <Link href="#projects" className={cn(buttonVariants({ size: 'lg' }), "px-10 h-14 text-base font-bold rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:-translate-y-1 bg-gradient-to-r from-primary to-indigo-600 border-none")}>
                    Explore Projects
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link
                    href={currentPersonal.resume || "/Gokul_S_Resume.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "px-10 h-14 text-base font-bold rounded-2xl border-white/20 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1")}
                  >
                    Download CV
                  </Link>
                </MagneticButton>
              </div>
            </AnimatedSection>
          </div>
        </EditableSection>
      </Section>

      {/* ─── LIVE DATA: GITHUB & LINKEDIN ────────────────────────────────────── */}
      <Section id="live-data" background="muted" className="relative z-10 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8">
            
            {/* GitHub Stats */}
            <div className="space-y-6">
              <AnimatedSection animation="fadeIn">
                <h2 className="text-3xl font-bold mb-2 font-display flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  </div>
                  GitHub Activity
                </h2>
                <p className="text-muted-foreground">Real-time open source contributions & stats.</p>
              </AnimatedSection>
              
              <AnimatedSection animation="slideRight" delay={0.2}>
                <GitHubSection />
              </AnimatedSection>
            </div>

            {/* LinkedIn & Professional */}
            <div className="space-y-6">
              <AnimatedSection animation="fadeIn" delay={0.2}>
                <h2 className="text-3xl font-bold mb-2 font-display flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  Professional Sync
                </h2>
                <p className="text-muted-foreground">Experience & education timeline.</p>
              </AnimatedSection>
              
              <AnimatedSection animation="slideLeft" delay={0.4}>
                <LinkedInSection />
              </AnimatedSection>
            </div>

          </div>
        </div>
      </Section>

      {/* ─── SKILLS ────────────────────────────────────────────────────────────── */}
      <Section id="skills">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold mb-2 font-display">Core Skills</h2>
            <p className="text-muted-foreground mb-10">Tools and tech I work with every day.</p>
          </AnimatedSection>

          <EditableSection label="Skills" onEdit={() => openPanel('skills')}>
            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                {topSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-default"
                  >
                    <motion.span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      initial={false}
                      animate={{ backgroundColor: skill.color || '#6366f1' }}
                    />
                    <span className="text-sm font-medium truncate">{skill.name}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.4}>
            <Link href="/skills" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              View All Skills
            </Link>
          </AnimatedSection>
        </div>
      </Section>

      {/* ─── PROJECTS ─────────────────────────────────────────────────────────── */}
      <Section id="projects" background="muted">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold mb-2 font-display">Featured Projects</h2>
            <p className="text-muted-foreground mb-10">Things I've built and shipped.</p>
          </AnimatedSection>

          <EditableSection label="Projects" onEdit={() => openPanel('projects')}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <AnimatedSection
                  key={project.id}
                  animation="scaleIn"
                  delay={0.1 * index}
                >
                  <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-accent/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                      <div className="relative z-10 p-4 rounded-full bg-background/50 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                        {getTechIcon(project.tech[0] || 'code', "h-12 w-12")}
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
                      </div>
                      
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="capitalize text-[10px] bg-background/60 backdrop-blur-md border-white/5 opacity-90">
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1 font-display">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-auto">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-[10px] bg-muted/50">
                            {tech}
                          </Badge>
                        ))}
                        {project.tech.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] bg-muted/50">
                            +{project.tech.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {project.links?.github && (
                          <Link
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "flex-1")}
                          >
                            GitHub
                          </Link>
                        )}
                        {project.links?.live && (
                          <Link
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ size: 'sm' }), "flex-1")}
                          >
                            Live Demo
                          </Link>
                        )}
                        {!project.links?.live && !project.links?.github && (
                          <Link
                            href={`/projects#${project.id}`}
                            className={cn(buttonVariants({ size: 'sm' }), "flex-1")}
                          >
                            Details
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="mt-8">
               <Link href="/projects" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                View All Projects
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* ─── CONTACT ──────────────────────────────────────────────────────────── */}
      <Section id="contact">
        <div className="max-w-2xl mx-auto">
          <EditableSection label="Contact" onEdit={() => openPanel('personal')}>
            <AnimatedSection animation="fadeIn">
              <h2 className="text-3xl font-bold mb-2 font-display">{currentAbout.contactHeading}</h2>
              <p className="text-muted-foreground mb-8">
                {currentAbout.contactDesc}
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.3}>
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20")}>
                Send Me a Message
              </Link>
            </AnimatedSection>
          </EditableSection>
        </div>
      </Section>
    </>
  )
}
