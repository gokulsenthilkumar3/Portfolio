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
import { projects as staticProjects, siteConfig, skills as staticSkills, about as staticAbout } from '@/lib/data/content'
import { getFeaturedProjects, getTopSkills, getTechIcon } from '@/lib/utils/content-helpers'
import type { Project } from '@/lib/types/portfolio'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useAdmin } from '@/components/admin/AdminProvider'
import { EditableSection } from '@/components/admin/EditableSection'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { Github, ExternalLink, ArrowUpRight, Zap } from 'lucide-react'

// ─── Category accent colours ───────────────────────────────────────────────
const CATEGORY_ACCENT: Record<string, { from: string; to: string; badge: string }> = {
  ai:        { from: 'from-violet-600/25', to: 'to-indigo-900/30',  badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20' },
  fullstack: { from: 'from-cyan-600/20',   to: 'to-blue-900/30',    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20' },
  web:       { from: 'from-emerald-600/20',to: 'to-teal-900/30',    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
  iot:       { from: 'from-orange-600/20', to: 'to-amber-900/30',   badge: 'bg-orange-500/15 text-orange-300 border-orange-500/20' },
  other:     { from: 'from-rose-600/20',   to: 'to-pink-900/30',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20' },
}
const accent = (cat: string) => CATEGORY_ACCENT[cat] ?? CATEGORY_ACCENT.other

export default function Home() {
  const { isAdmin, portfolioData } = useAdmin()
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminPanelTab, setAdminPanelTab] = useState('personal')

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

  // Separate highlight (hero) project from regular grid
  const heroProject = featuredProjects.find((p: any) => p.highlight) ?? featuredProjects[0]
  const gridProjects = featuredProjects.filter((p: Project) => p.id !== heroProject?.id)

  const openPanel = (tab: string) => {
    setAdminPanelTab(tab)
    setAdminPanelOpen(true)
  }

  return (
    <>
      {isAdmin && (
        <AdminPanel
          isOpen={adminPanelOpen}
          onClose={() => setAdminPanelOpen(false)}
          initialTab={adminPanelTab}
        />
      )}

      {/* ─── HERO ──────────────────────────────────────────────────────────────── */}
      <Section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <Suspense fallback={null}>
            <FloatingModels className="w-full h-full" />
          </Suspense>
        </div>

        <EditableSection label="Hero" onEdit={() => openPanel('personal')} className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
            <AnimatedSection animation="scaleIn" delay={0.2} className="relative group">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 transition-all duration-500 group-hover:rounded-[2rem] group-hover:border-primary/40">
                <img
                  src={currentPersonal.avatar || "/gokul-photo.jpg"}
                  alt={currentPersonal.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute -inset-4 border border-primary/10 rounded-[3.5rem] -z-10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute -inset-8 border border-primary/5 rounded-[4rem] -z-10 animate-[spin_30s_linear_infinite_reverse]" />
            </AnimatedSection>

            <div className="flex-1 text-center md:text-left">
              <AnimatedSection animation="fadeIn" delay={0.1}>
                <div className="mb-8 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  {currentPersonal.availability === 'busy' ? 'Currently focusing on core projects' : 'Available for new opportunities'}
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeIn" delay={0.3}>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 leading-none font-display">
                  {currentPersonal.name.split(' ')[0]} <span className="text-primary">{currentPersonal.name.split(' ')[1]}</span>
                </h1>
                <p className="text-xl md:text-3xl font-bold text-muted-foreground/80 mb-6 tracking-tight">
                  {currentPersonal.title}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="slideUp" delay={0.5}>
                <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed font-medium">
                  {currentPersonal.bio}
                </p>
              </AnimatedSection>

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
            <div className="grid md:grid-cols-3 gap-6">
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
                      {portfolioData.education.map((edu: any) => (
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
                {topSkills.map((skill: any) => (
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

      {/* ─── FEATURED PROJECTS ────────────────────────────────────────────────── */}
      <Section id="projects" background="muted">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fadeIn">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2 font-display">Featured Projects</h2>
                <p className="text-muted-foreground">Things I&apos;ve built and shipped.</p>
              </div>
              <Link
                href="/projects"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground')}
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AnimatedSection>

          <EditableSection label="Projects" onEdit={() => openPanel('projects')}>
            <div className="space-y-6">

              {/* ── Hero card (highlight project) ─────────────────────────────── */}
              {heroProject && (
                <AnimatedSection animation="slideUp" delay={0.1}>
                  <div className={cn(
                    'group relative rounded-2xl border border-white/5 overflow-hidden',
                    'bg-gradient-to-br',
                    accent((heroProject as any).category).from,
                    accent((heroProject as any).category).to,
                    'hover:border-white/15 transition-all duration-500',
                    'hover:shadow-[0_0_60px_rgba(139,92,246,0.08)]'
                  )}>
                    {/* Subtle grid overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
                      {/* Left: icon */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        {getTechIcon((heroProject as any).tech[0] || 'code', 'h-8 w-8')}
                      </div>

                      {/* Middle: content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide', accent((heroProject as any).category).badge)}>
                            {(heroProject as any).category}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wide">
                            ★ Highlight
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold font-display mb-2">
                          {heroProject.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl">
                          {heroProject.description}
                        </p>

                        {/* Impact chips */}
                        {(heroProject as any).impact?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(heroProject as any).impact.map((item: string) => (
                              <span key={item} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 border border-white/8 text-foreground/80">
                                <Zap className="h-3 w-3 text-primary" />
                                {item}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tech stack */}
                        <div className="flex flex-wrap gap-1.5">
                          {(heroProject as any).tech.slice(0, 5).map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[10px] bg-white/5 border-white/10">{t}</Badge>
                          ))}
                          {(heroProject as any).tech.length > 5 && (
                            <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">+{(heroProject as any).tech.length - 5}</Badge>
                          )}
                        </div>
                      </div>

                      {/* Right: CTA */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {(heroProject as any).links?.live && (
                          <Link
                            href={(heroProject as any).links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
                          >
                            <ExternalLink className="h-3.5 w-3.5" /> Live / Paper
                          </Link>
                        )}
                        {(heroProject as any).links?.github && (
                          <Link
                            href={(heroProject as any).links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 border-white/10 bg-white/5')}
                          >
                            <Github className="h-3.5 w-3.5" /> GitHub
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* ── Regular project grid ───────────────────────────────────────── */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridProjects.map((project: Project, index: number) => (
                  <AnimatedSection
                    key={project.id}
                    animation="scaleIn"
                    delay={0.1 + 0.08 * index}
                  >
                    <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/5 hover:border-white/15 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden">

                      {/* Thumbnail strip */}
                      <div className={cn(
                        'relative h-2 w-full bg-gradient-to-r',
                        accent((project as any).category).from.replace('from-', 'from-').replace('/25', '/60').replace('/20', '/60'),
                        'via-transparent',
                        accent((project as any).category).to.replace('to-', 'to-').replace('/30', '/40')
                      )} />

                      <div className="p-5 flex-1 flex flex-col">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
                            {getTechIcon((project as any).tech[0] || 'code', 'h-5 w-5')}
                          </div>
                          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize tracking-wide flex-shrink-0', accent((project as any).category).badge)}>
                            {(project as any).category}
                          </span>
                        </div>

                        <h3 className="font-semibold text-base font-display mb-1.5 line-clamp-1">{project.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1 leading-relaxed">{project.description}</p>

                        {/* Impact chips (compact) */}
                        {(project as any).impact?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {(project as any).impact.slice(0, 2).map((item: string) => (
                              <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] border border-white/8 text-foreground/70">
                                <Zap className="h-2.5 w-2.5 text-primary" />{item}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tech badges */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {(project as any).tech.slice(0, 4).map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-[10px] bg-muted/50">{tech}</Badge>
                          ))}
                          {(project as any).tech.length > 4 && (
                            <Badge variant="secondary" className="text-[10px] bg-muted/50">+{(project as any).tech.length - 4}</Badge>
                          )}
                        </div>

                        {/* Action row */}
                        <div className="flex gap-2 mt-auto pt-1">
                          {(project as any).links?.github && (
                            <Link
                              href={(project as any).links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 gap-1.5 text-[11px]')}
                            >
                              <Github className="h-3 w-3" /> GitHub
                            </Link>
                          )}
                          {(project as any).links?.live ? (
                            <Link
                              href={(project as any).links.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(buttonVariants({ size: 'sm' }), 'flex-1 gap-1.5 text-[11px]')}
                            >
                              <ExternalLink className="h-3 w-3" /> Live
                            </Link>
                          ) : (
                            <Link
                              href={`/projects#${project.id}`}
                              className={cn(buttonVariants({ size: 'sm' }), 'flex-1 gap-1.5 text-[11px]')}
                            >
                              Details
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="mt-8 sm:hidden">
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
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
                Send Me a Message
              </Link>
            </AnimatedSection>
          </EditableSection>
        </div>
      </Section>
    </>
  )
}
