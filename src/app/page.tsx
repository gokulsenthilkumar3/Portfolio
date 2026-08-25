'use client'

import { useState, useEffect } from 'react'
import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import dynamic from 'next/dynamic'
import { MagneticButton } from '@/components/effects/MagneticButton'
import Image from 'next/image'
import { TypewriterEffect } from '@/components/effects/TypewriterEffect'
import { StatsCounter } from '@/components/effects/StatsCounter'

const MorphingBlob = dynamic(() =>
  import('@/components/effects/MorphingBlob').then(mod => ({ default: mod.MorphingBlob })),
  { ssr: false }
)

const ProjectsSection = dynamic(() =>
  import('@/components/sections/ProjectsSection').then(mod => ({ default: mod.ProjectsSection })),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-muted/40" /> }
)
const SkillsSection = dynamic(() =>
  import('@/components/sections/SkillsSection').then(mod => ({ default: mod.SkillsSection })),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-muted/40" /> }
)

const ContactSection = dynamic(() =>
  import('@/components/sections/ContactSection').then(mod => ({ default: mod.ContactSection })),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-muted/40" /> }
)

const BlogSection = dynamic<{ posts: import('@/lib/types/portfolio').BlogPost[] }>(() =>
  import('@/components/sections/BlogSection').then(mod => ({ default: mod.BlogSection })),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-muted/40" /> }
)

import { GitHubSection } from '@/components/shared/GitHubSection'
import { LinkedInSection } from '@/components/shared/LinkedInSection'
import { CertificationsSection } from '@/components/shared/CertificationsSection'
import { LanguagesSection } from '@/components/shared/LanguagesSection'
import { projects as staticProjects, siteConfig, skills as staticSkills, about as staticAbout, blog as staticBlog, stats as staticStats } from '@/lib/data/content'
import { getFeaturedProjects, getTopSkills, getTechIcon } from '@/lib/utils/content-helpers'
import type { Project, Skill } from '@/lib/types/portfolio'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import { useAdmin } from '@/components/admin/AdminProvider'
import { EditableSection } from '@/components/admin/EditableSection'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { TerminalModal } from '@/components/effects/TerminalModal'
import { Terminal } from 'lucide-react'

export default function Home() {
  const { isAdmin, portfolioData } = useAdmin()
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminPanelTab, setAdminPanelTab] = useState('personal')
  const [isClient, setIsClient] = useState(false)
  const [terminalOpen, setTerminalOpen] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  const currentProjects = (isAdmin && portfolioData.projects?.length > 0
    ? portfolioData.projects
    : staticProjects) as Project[]

  const currentSkills: Skill[] = (isAdmin && portfolioData.skills?.length > 0
    ? portfolioData.skills
    : staticSkills) as Skill[]

  const currentPersonal = isAdmin ? portfolioData.personal : siteConfig
  const currentAbout = isAdmin ? portfolioData.about : staticAbout
  const currentStats = (isAdmin && portfolioData.stats ? portfolioData.stats : staticStats) as any[]

  const featuredProjects = getFeaturedProjects(currentProjects)
  const topSkills = getTopSkills(currentSkills, 8)
  const heroNameParts = currentPersonal.name.split(' ')
  const heroPrimary = heroNameParts[0] ?? currentPersonal.name
  const heroSecondary = heroNameParts.slice(1).join(' ')
  const quickFacts = [
    { label: 'Focus', value: currentPersonal.title },
    { label: 'Location', value: currentPersonal.location },
    { label: 'Status', value: currentPersonal.availability === 'busy' ? 'Heads-down on core work' : 'Open for collaboration' },
  ]
  const spotlightSkills = topSkills.slice(0, 4)

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

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_35%),radial-gradient(circle_at_top_right,_hsl(var(--accent)/0.12),_transparent_30%),radial-gradient(circle_at_center,_hsl(var(--foreground)/0.04),_transparent_35%),linear-gradient(to_bottom,_transparent,_hsl(var(--background))_82%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none" />
        
        <div className="absolute left-1/2 top-24 -translate-x-1/2 pointer-events-none z-0">
          <MorphingBlob size={600} opacity={0.12} />
        </div>

        <EditableSection label="Hero" onEdit={() => openPanel('personal')} className="relative z-10 w-full pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
              <div className="max-w-3xl">
                <AnimatedSection animation="fadeIn" delay={0.08}>
                  <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 backdrop-blur-md px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]" />
                    {currentPersonal.availability === 'busy' ? 'Deep focus mode' : 'Available for select collaborations'}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.16}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-border/70 shadow-lg shrink-0 hidden sm:block">
                      <Image src={currentPersonal.avatar || "/gokul-photo.jpg"} alt={currentPersonal.name} fill className="object-cover" />
                    </div>
                    <div className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-muted-foreground flex-1 min-w-0">
                      <TypewriterEffect 
                        words={[
                          "Software Development Engineer in Test",
                          "Full-Stack Web Developer",
                          "Test Automation Architect",
                          "Product-Minded Engineer"
                        ]} 
                        className="font-medium"
                      />
                    </div>
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.8rem] font-black tracking-tighter mb-6 leading-[0.9] font-display flex flex-col items-start">
                    <span className="block text-foreground">{heroPrimary}</span>
                    <span className="flex items-center flex-wrap gap-4">
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-fuchsia-500">
                        {heroSecondary || 'Senthilkumar'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-widest shadow-sm shrink-0 mt-2 lg:mt-0">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        IEEE Published
                      </span>
                    </span>
                  </h1>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.28}>
                  <p className="text-lg md:text-2xl font-medium text-foreground/80 max-w-2xl leading-relaxed">
                    {currentPersonal.title}
                  </p>
                  <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-8">
                    {currentPersonal.bio}
                  </p>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.38}>
                  <div className="grid sm:grid-cols-3 gap-3 mt-10 max-w-3xl">
                    {quickFacts.map(fact => (
                      <div key={fact.label} className="rounded-3xl border border-border/70 bg-card/80 p-4 shadow-sm">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">{fact.label}</div>
                        <div className="text-sm md:text-base font-medium text-foreground leading-snug">{fact.value}</div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.5}>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-10">
                    <MagneticButton>
                      <Link
                        href="#contact"
                        className={cn(
                          buttonVariants({ size: 'lg' }),
                          'w-full sm:w-auto px-7 h-14 rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_40px_hsl(var(--primary)/0.28)] hover:shadow-[0_22px_65px_hsl(var(--primary)/0.38)] border-0'
                        )}
                      >
                        Start a conversation
                      </Link>
                    </MagneticButton>
                    <MagneticButton>
                      <Link
                        href="#projects"
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'lg' }),
                          'w-full sm:w-auto px-7 h-14 rounded-2xl border-border/70 bg-background/75 backdrop-blur-sm'
                        )}
                      >
                        View selected work
                      </Link>
                    </MagneticButton>
                    <MagneticButton>
                      <Link
                        href={currentPersonal.resume || '/Gokul_S_Resume.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'lg' }),
                          'w-full sm:w-auto px-7 h-14 rounded-2xl border-border/70 bg-background/75 backdrop-blur-sm'
                        )}
                      >
                        Download CV
                      </Link>
                    </MagneticButton>
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection animation="fadeIn" delay={0.22}>
                <div className="relative">
                  <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-fuchsia-500/10 blur-2xl" />
                  <div className="relative rounded-[2rem] border border-border/70 bg-card/80 backdrop-blur-2xl p-6 md:p-8 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.48)]">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">Portfolio summary</div>
                        <div className="text-2xl font-semibold">{currentPersonal.name}</div>
                      </div>
                      <button
                        onClick={() => setTerminalOpen(true)}
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border/70 bg-background/80 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                        title="Open Developer Terminal"
                      >
                        <Terminal className="w-4 h-4 text-primary" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {featuredProjects.slice(0, 4).map((project, index) => (
                        <div key={project.id} className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                                Featured {index + 1}
                              </div>
                              <div className="font-medium text-sm md:text-base">{project.title}</div>
                            </div>
                            <div className="text-[11px] text-muted-foreground capitalize">{project.category}</div>
                          </div>
                          {project.description && (
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {spotlightSkills.map(skill => (
                        <div key={skill.id} className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium text-sm">{skill.name}</div>
                            <div className="text-xs text-muted-foreground">{skill.proficiency}/5</div>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500" style={{ width: `${(skill.proficiency / 5) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </EditableSection>

        <TerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      </section>

      {/* ─── PROJECTS ─────────────────────────────────────────── */}
      {/* REORDER: Projects moved directly after Hero — visitors decide to keep scrolling
          based on proof of work, not career history. id="projects" is set inside ProjectsSection. */}
      <Section background="muted" className="pt-20">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <StatsCounter stats={currentStats} />
        </div>
        <EditableSection label="Projects" onEdit={() => openPanel('projects')}>
          <ProjectsSection projects={currentProjects} />
        </EditableSection>
      </Section>

      {/* ─── SKILLS ───────────────────────────────────────────── */}
      {/* id="skills" is already set inside SkillsSection — outer Section gets no id to avoid duplicates */}
      <Section>
        <EditableSection label="Skills" onEdit={() => openPanel('skills')}>
          <SkillsSection skills={currentSkills} />
        </EditableSection>
      </Section>

      {/* ─── ABOUT / LINKEDIN ─────────────────────────────────── */}
      {/* REORDER: experience/education timeline now comes after the proof-of-work sections */}
      <Section id="about" background="muted" className="relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="space-y-6">
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <h2 className="text-3xl font-bold mb-2 font-display flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
                Experience &amp; Education
              </h2>
              <p className="text-muted-foreground">Experience &amp; education timeline.</p>
            </AnimatedSection>
            <AnimatedSection animation="slideLeft" delay={0.4}>
              <LinkedInSection />
            </AnimatedSection>
            <AnimatedSection animation="slideLeft" delay={0.5}>
              <CertificationsSection />
            </AnimatedSection>
            <AnimatedSection animation="slideLeft" delay={0.6}>
              <LanguagesSection />
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* ─── GITHUB ───────────────────────────────────────────── */}
      <Section id="github" background="muted">
        <div className="max-w-6xl mx-auto px-4 pb-12 mt-10">
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <h2 className="text-3xl font-bold mb-8 font-display flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </div>
              GitHub Activity
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.3}>
            <GitHubSection />
          </AnimatedSection>
        </div>
      </Section>

      {/* ─── BLOG ─────────────────────────────────────────────── */}
      <Section id="insights">
        <EditableSection label="Blog" onEdit={() => openPanel('blog')}>
          <BlogSection posts={((isAdmin && (portfolioData?.blog?.length ?? 0) > 0) ? portfolioData.blog! : (staticBlog || [])) as import('@/lib/types/portfolio').BlogPost[]} />
        </EditableSection>
      </Section>

      {/* ─── CONTACT ──────────────────────────────────────────── */}
      <Section id="contact" background="muted">
        <EditableSection label="Contact" onEdit={() => openPanel('personal')}>
          <ContactSection
            heading={currentAbout.contactHeading}
            desc={currentAbout.contactDesc}
            email={currentPersonal.email}
            emailZoho={(currentPersonal as Record<string, unknown>).emailZoho as string | undefined}
            linkedin={currentPersonal.linkedin}
            github={currentPersonal.github}
            twitter={currentPersonal.twitter}
          />
        </EditableSection>
      </Section>
    </>
  )
}
