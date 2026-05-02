'use client'

import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { TextReveal } from '@/components/effects/TextReveal'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { FloatingModels } from '@/components/3d/FloatingModels'
import { projects as staticProjects, siteConfig, skills as staticSkills } from '@/lib/data/content'
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

  // Single source-of-truth hook pattern
  const currentProjects = (isAdmin && portfolioData.projects?.length > 0
    ? portfolioData.projects
    : staticProjects) as Project[]

  const currentSkills = isAdmin && portfolioData.skills?.length > 0
    ? portfolioData.skills
    : staticSkills

  const currentPersonal = isAdmin ? portfolioData.personal : siteConfig
  const currentAbout = isAdmin ? portfolioData.about : portfolioConfig.about

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
      <Section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
        {/* Background 3D elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <Suspense fallback={null}>
            <FloatingModels className="w-full h-full" />
          </Suspense>
        </div>

        <EditableSection label="Hero" onEdit={() => openPanel('personal')} className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Side: Avatar */}
            <AnimatedSection animation="scaleIn" delay={0.2} className="relative group">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 transition-all duration-500 group-hover:rounded-[2rem] group-hover:border-primary/40">
                <img 
                  src={currentPersonal.avatar || "/gokul-photo.jpg"} 
                  alt={currentPersonal.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {/* Decorative rings */}
              <div className="absolute -inset-4 border border-primary/10 rounded-[3.5rem] -z-10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute -inset-8 border border-primary/5 rounded-[4rem] -z-10 animate-[spin_30s_linear_infinite_reverse]" />
            </AnimatedSection>

            {/* Right Side: Content */}
            <div className="flex-1 text-center md:text-left">
              {/* Availability badge */}
              <AnimatedSection animation="fadeIn" delay={0.1}>
                <div className="mb-8 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {currentPersonal.availability === 'busy' ? 'Currently focusing on core projects' : 'Available for new opportunities'}
                </div>
              </AnimatedSection>

              {/* Name + Title */}
              <AnimatedSection animation="fadeIn" delay={0.3}>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-none font-display">
                  {currentPersonal.name.split(' ')[0]} <span className="text-primary">{currentPersonal.name.split(' ')[1]}</span>
                </h1>
                <p className="text-xl md:text-3xl font-bold text-muted-foreground/80 mb-6 tracking-tight">
                  {currentPersonal.title}
                </p>
              </AnimatedSection>

              {/* Tagline */}
              <AnimatedSection animation="slideUp" delay={0.5}>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed font-medium">
                  {currentPersonal.bio}
                </p>
              </AnimatedSection>

              {/* CTAs */}
              <AnimatedSection animation="slideUp" delay={0.7}>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <MagneticButton>
                    <Link href="#projects" className={cn(buttonVariants({ size: 'lg' }), "px-10 h-14 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]")}>
                      Explore Projects
                    </Link>
                  </MagneticButton>
                  <Link
                    href={currentPersonal.resume || "/Gokul_S_Resume.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "px-10 h-14 text-base font-bold rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10")}
                  >
                    Download CV
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </EditableSection>
      </Section>

      {/* ─── ABOUT ────────────────────────────────────────────────────────────── */}
      <Section id="about" background="muted">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold mb-2 font-display">{currentAbout.title}</h2>
            <p className="text-muted-foreground mb-10">{currentAbout.subtitle}</p>
          </AnimatedSection>

          <EditableSection label="About" onEdit={() => openPanel('personal')}>
            {/* Asymmetric layout: large card + two smaller cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Large featured card */}
              <AnimatedSection animation="slideLeft" delay={0.2} className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="font-display">{currentAbout.featuredTitle}</CardTitle>
                    <CardDescription>{currentAbout.featuredDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed mb-4">
                      {currentAbout.featuredLong}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>K6</Badge>
                      <Badge>Azure DevOps</Badge>
                      <Badge>Selenium</Badge>
                      <Badge>TypeScript</Badge>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Two stacked smaller cards */}
              <div className="flex flex-col gap-6">
                <AnimatedSection animation="slideRight" delay={0.3}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-base font-display">{currentAbout.secondaryTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        {currentAbout.secondarySkills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection animation="slideRight" delay={0.4}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-base font-display">Education</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {portfolioData.education.map((edu) => (
                        <div key={edu.id}>
                          <p className="text-xs text-muted-foreground">{edu.degree} {edu.field}</p>
                          <p className="text-xs font-medium mt-0.5">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground mt-1">{edu.period.start} – {edu.period.end}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.6}>
            <div className="mt-8">
              <Link href="/about" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Learn More About Me
              </Link>
            </div>
          </AnimatedSection>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {topSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
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
            <p className="text-muted-foreground mb-10">Things I&apos;ve built and shipped.</p>
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
              {/* Single primary action */}
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), "w-full sm:w-auto")}>
                Send Me a Message
              </Link>
            </AnimatedSection>
          </EditableSection>
        </div>
      </Section>
    </>
  )
}
