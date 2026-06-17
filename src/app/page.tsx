'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { TextReveal } from '@/components/effects/TextReveal'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { projects as staticProjects, siteConfig, skills as staticSkills, about as staticAbout } from '@/lib/data/content'
import { getFeaturedProjects, getTopSkills, getTechIcon } from '@/lib/utils/content-helpers'
import type { Project } from '@/lib/types/portfolio'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useAdmin } from '@/components/admin/AdminProvider'
import { EditableSection } from '@/components/admin/EditableSection'
import { AdminPanel } from '@/components/admin/AdminPanel'

// ─── FIX: Dynamic import with ssr:false is REQUIRED for any component that
// imports Three.js / @react-three/fiber. Without this, Next.js attempts to
// render the canvas on the server where WebGL APIs don't exist, throwing:
//   "Application error: a client-side exception has occurred"
// The FloatingModelsSection wrapper already handles IntersectionObserver
// gating and the use3DGate WebGL/reduced-motion check internally.
const FloatingModelsSection = dynamic(
  () =>
    import('@/components/3d/FloatingModelsSection').then((m) => ({
      default: m.FloatingModelsSection,
    })),
  { ssr: false }
)

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
      <Section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-20">
        {/* Background 3D elements — rendered client-only via dynamic import */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <FloatingModelsSection className="w-full h-full" heightClass="h-full" />
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
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </EditableSection>
        </div>
      </Section>

      {/* ─── PROJECTS ─────────────────────────────────────────────────────────── */}
      <Section id="projects">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold mb-2 font-display">Featured Projects</h2>
            <p className="text-muted-foreground mb-10">A selection of things I&apos;ve built</p>
          </AnimatedSection>

          <EditableSection label="Projects" onEdit={() => openPanel('projects')}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <AnimatedSection key={project.id} animation="scaleIn" delay={index * 0.1}>
                  <Card className="h-full hover:border-primary/30 transition-colors group">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-display group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {project.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tech.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {project.links?.github && (
                          <Link
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'text-xs')}
                          >
                            GitHub
                          </Link>
                        )}
                        {project.links?.live && (
                          <Link
                            href={project.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ size: 'sm' }), 'text-xs')}
                          >
                            Live Demo
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </EditableSection>
        </div>
      </Section>

      {/* ─── SKILLS ───────────────────────────────────────────────────────────── */}
      <Section id="skills" background="muted">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold mb-2 font-display">Skills</h2>
            <p className="text-muted-foreground mb-10">Technologies I work with</p>
          </AnimatedSection>
          <div className="flex flex-wrap gap-3">
            {topSkills.map((skill, index) => (
              <AnimatedSection key={(skill as any).id || index} animation="scaleIn" delay={index * 0.05}>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  {(skill as any).name || skill}
                </Badge>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── EXPERIENCE ───────────────────────────────────────────────────────── */}
      <Section id="experience">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold mb-2 font-display">Experience</h2>
            <p className="text-muted-foreground mb-10">Where I&apos;ve worked</p>
          </AnimatedSection>

          <EditableSection label="Experience" onEdit={() => openPanel('experience')}>
            <div className="space-y-6">
              {portfolioData.experiences.map((exp, index) => (
                <AnimatedSection key={exp.id} animation="slideLeft" delay={index * 0.15}>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <CardTitle className="font-display">{exp.role}</CardTitle>
                        <span className="text-xs text-muted-foreground">
                          {exp.period.start.slice(0, 7)} – {exp.period.present ? 'Present' : exp.period.end?.slice(0, 7)}
                        </span>
                      </div>
                      <CardDescription>{exp.company} · {exp.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3 leading-relaxed">{exp.description}</p>
                      <ul className="text-sm space-y-1 mb-4">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="flex gap-2 text-muted-foreground">
                            <span className="text-primary mt-0.5">▸</span>{a}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </EditableSection>
        </div>
      </Section>

      {/* ─── CONTACT ──────────────────────────────────────────────────────────── */}
      <Section id="contact" background="muted">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold mb-2 font-display">Get In Touch</h2>
            <p className="text-muted-foreground mb-8">Open to interesting conversations and opportunities</p>
          </AnimatedSection>
          <AnimatedSection animation="scaleIn" delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`mailto:${currentPersonal.email}`}
                className={cn(buttonVariants({ size: 'lg' }), 'px-8 h-12 rounded-xl')}
              >
                Send Email
              </Link>
              <Link
                href={currentPersonal.linkedin || 'https://www.linkedin.com/in/gokulsenthilkumar3/'}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'px-8 h-12 rounded-xl border-white/10 bg-white/5')}
              >
                LinkedIn
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>
    </>
  )
}
