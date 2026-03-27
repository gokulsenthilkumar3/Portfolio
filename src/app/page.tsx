'use client'

import { useState } from 'react'
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

  // Use live admin data if in admin mode, otherwise use static config
  const currentProjects = (isAdmin && portfolioData.projects?.length > 0
    ? portfolioData.projects
    : staticProjects) as Project[]

  const currentSkills = isAdmin && portfolioData.skills?.length > 0
    ? portfolioData.skills
    : staticSkills

  const currentPersonal = isAdmin ? portfolioData.personal : siteConfig

  const featuredProjects = getFeaturedProjects(currentProjects)
  const topSkills = getTopSkills(currentSkills as typeof staticSkills, 6)

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

      {/* Hero Section */}
      <Section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <FloatingModels className="w-full h-full" />
        </div>
        
        <EditableSection label="Hero" onEdit={() => openPanel('personal')} className="text-center space-y-6 relative z-10 w-full">
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <TextReveal 
              text="Welcome to My Portfolio" 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2"
              animation="wave"
            />
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.5}>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
              {currentPersonal.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4 px-4">
              {currentPersonal.bio}
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <MagneticButton>
                <Link href="#projects" className={cn(buttonVariants({ size: 'lg' }), "px-8")}>
                  View Projects
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="#contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "px-8")}>
                  Contact Me
                </Link>
              </MagneticButton>
            </div>
          </AnimatedSection>
        </EditableSection>
      </Section>

      {/* About Preview */}
      <Section id="about" background="muted">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
          </AnimatedSection>
          
          <EditableSection label="About" onEdit={() => openPanel('personal')}>
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedSection animation="slideLeft" delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>Frontend Development</CardTitle>
                    <CardDescription>React, Next.js, TypeScript, Tailwind CSS</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Building responsive, accessible, and performant user interfaces with modern frameworks and best practices.</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge>React</Badge>
                      <Badge>Next.js</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>Tailwind CSS</Badge>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
              
              <AnimatedSection animation="slideRight" delay={0.4}>
                <Card>
                  <CardHeader>
                    <CardTitle>Backend Development</CardTitle>
                    <CardDescription>Node.js, Python, PostgreSQL, MongoDB</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Creating robust APIs and scalable server-side applications with focus on security and performance.</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge>Node.js</Badge>
                      <Badge>Python</Badge>
                      <Badge>PostgreSQL</Badge>
                      <Badge>MongoDB</Badge>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.6}>
            <div className="text-center mt-8">
              <Link href="/about" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Learn More About Me
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Skills Preview */}
      <Section id="skills">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold text-center mb-8">Core Skills</h2>
          </AnimatedSection>
          
          <EditableSection label="Skills" onEdit={() => openPanel('skills')}>
            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {topSkills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    variant="outline" 
                    className="text-sm py-2 px-4 capitalize"
                    style={{ 
                      borderColor: skill.color || '#3b82f6',
                      color: skill.color || '#3b82f6'
                    }}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </AnimatedSection>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="text-center">
              <Link href="/skills" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                View All Skills
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Projects Preview */}
      <Section id="projects" background="muted">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
          </AnimatedSection>
          
          <EditableSection label="Projects" onEdit={() => openPanel('projects')}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <AnimatedSection 
                  key={project.id} 
                  animation="scaleIn" 
                  delay={0.1 * index}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden h-full flex flex-col">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {project.images && project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground italic bg-secondary/20">
                          No image preview
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground opacity-90 backdrop-blur-sm">
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="capitalize text-[10px] opacity-90 backdrop-blur-sm border-none">
                          {project.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
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
                      </div>
                      <div className="flex gap-2 pt-2">
                        <MagneticButton strength={0.2} className="flex-1">
                          <Link 
                            href={`/projects#${project.id}`} 
                            className={cn(buttonVariants({ size: 'sm' }), "w-full")}
                          >
                            View Details
                          </Link>
                        </MagneticButton>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </EditableSection>

          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="text-center mt-8">
              <Link href="/projects" className={buttonVariants({ variant: "outline", size: "lg" })}>
                View All Projects
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Contact Preview */}
      <Section id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <EditableSection label="Contact" onEdit={() => openPanel('personal')}>
            <AnimatedSection animation="fadeIn">
              <h2 className="text-3xl font-bold text-center mb-4">Get In Touch</h2>
              <p className="text-xl text-muted-foreground mb-8">
                I&apos;m always interested in hearing about new projects and opportunities.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className={buttonVariants({ size: 'lg' })}>
                  Contact Me
                </Link>
                <Link href={`mailto:${currentPersonal.email}`} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                  Email Directly
                </Link>
              </div>
            </AnimatedSection>
          </EditableSection>
        </div>
      </Section>
    </>
  )
}
