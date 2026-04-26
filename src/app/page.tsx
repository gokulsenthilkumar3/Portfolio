'use client'

import { Suspense, useState } from 'react'
import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { TextReveal } from '@/components/effects/TextReveal'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { FloatingModels } from '@/components/3d/FloatingModels'
import { projects as staticProjects, siteConfig, skills as staticSkills } from '@/lib/data/content'
import { getFeaturedProjects, getTopSkills } from '@/lib/utils/content-helpers'
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

  const featuredProjects = getFeaturedProjects(currentProjects)
  const topSkills = getTopSkills(currentSkills as typeof staticSkills, 8)

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
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Suspense fallback={null}>
            <FloatingModels className="w-full h-full" />
          </Suspense>
        </div>

        <EditableSection label="Hero" onEdit={() => openPanel('personal')} className="relative z-10 w-full">
          <div className="max-w-4xl mx-auto px-4">
            {/* Availability badge */}
            <AnimatedSection animation="fadeIn" delay={0.1}>
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  Currently not available for new roles
                </span>
              </div>
            </AnimatedSection>

            {/* Name + Title — display font territory */}
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                Gokul S
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground mb-4">
                {currentPersonal.title}
              </p>
            </AnimatedSection>

            {/* Tagline */}
            <AnimatedSection animation="slideUp" delay={0.4}>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                {currentPersonal.bio}
              </p>
            </AnimatedSection>

            {/* Single primary CTA + secondary */}
            <AnimatedSection animation="slideUp" delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <Link href="#projects" className={cn(buttonVariants({ size: 'lg' }), "px-8")}>
                    View My Work
                  </Link>
                </MagneticButton>
                <Link
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "px-8")}
                >
                  Download Résumé
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </EditableSection>
      </Section>

      {/* ─── ABOUT ────────────────────────────────────────────────────────────── */}
      <Section id="about" background="muted">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>About Me</h2>
            <p className="text-muted-foreground mb-10">SDET by day, builder by night.</p>
          </AnimatedSection>

          <EditableSection label="About" onEdit={() => openPanel('personal')}>
            {/* Asymmetric layout: large card + two smaller cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Large featured card */}
              <AnimatedSection animation="slideLeft" delay={0.2} className="md:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'var(--font-display)' }}>Quality Engineering</CardTitle>
                    <CardDescription>Automated testing, load testing, CI/CD quality gates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed mb-4">
                      At CloudAssert I design automated test frameworks, run performance tests with K6, and integrate
                      quality gates into Azure DevOps pipelines — making sure software ships without surprises.
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
                      <CardTitle className="text-base" style={{ fontFamily: 'var(--font-display)' }}>Full-Stack Dev</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Next.js</Badge>
                        <Badge variant="secondary">PERN</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>

                <AnimatedSection animation="slideRight" delay={0.4}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-base" style={{ fontFamily: 'var(--font-display)' }}>Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">MS Software Systems</p>
                      <p className="text-xs font-medium mt-0.5">Kongu Engineering College</p>
                      <p className="text-xs text-muted-foreground mt-1">2020 – 2025</p>
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
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Core Skills</h2>
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
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: skill.color || '#6366f1' }}
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
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Featured Projects</h2>
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
                  <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {project.images && project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={`${project.title} preview`}
                          width={800}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-secondary/20">
                          {project.title}
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="capitalize text-[10px] opacity-90 backdrop-blur-sm border-none">
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1" style={{ fontFamily: 'var(--font-display)' }}>{project.title}</CardTitle>
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
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Not currently looking for new roles, but I&apos;m always happy to chat about interesting projects, open source, or just tech in general.
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
