import { Section } from '@/components/shared/Section'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { TextReveal } from '@/components/effects/TextReveal'
import { MagneticButton } from '@/components/effects/MagneticButton'
import { FloatingModels } from '@/components/3d/FloatingModels'
import { projects, siteConfig, skills } from '@/lib/data/content'
import { getFeaturedProjects, getTopSkills } from '@/lib/utils/content-helpers'
import type { Project } from '@/lib/types/portfolio'
import Link from 'next/link'

export default function Home() {
  const featuredProjects = getFeaturedProjects(projects as Project[])
  const topSkills = getTopSkills(skills, 6)

  return (
    <>
      {/* Hero Section */}
      <Section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 opacity-30">
          <FloatingModels className="w-full h-full" />
        </div>
        
        <div className="text-center space-y-6 relative z-10">
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <TextReveal 
              text="Welcome to My Portfolio" 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              animation="wave"
            />
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.5}>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
              {siteConfig.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
              {siteConfig.bio}
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#projects">
                <MagneticButton>
                  <Button size="lg">View Projects</Button>
                </MagneticButton>
              </Link>
              <Link href="#contact">
                <MagneticButton>
                  <Button variant="outline" size="lg">Contact Me</Button>
                </MagneticButton>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* About Preview */}
      <Section id="about" background="muted">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="slideDown">
            <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
          </AnimatedSection>
          
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

          <AnimatedSection animation="slideUp" delay={0.6}>
            <div className="text-center mt-8">
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More About Me
                </Button>
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

          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="text-center">
              <Link href="/skills">
                <Button variant="outline" size="lg">
                  View All Skills
                </Button>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <AnimatedSection 
                key={project.id} 
                animation="scaleIn" 
                delay={0.1 * index}
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="capitalize">{project.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <MagneticButton strength={0.2}>
                        <Button size="sm">View Live</Button>
                      </MagneticButton>
                      <MagneticButton strength={0.2}>
                        <Button variant="outline" size="sm">GitHub</Button>
                      </MagneticButton>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="slideUp" delay={0.8}>
            <div className="text-center mt-8">
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  View All Projects
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Contact Preview */}
      <Section id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold text-center mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground mb-8">
              I'm always interested in hearing about new projects and opportunities.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Contact Me</Button>
              </Link>
              <Link href={`mailto:${siteConfig.email}`}>
                <Button variant="outline" size="lg">
                  Email Directly
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>
    </>
  )
}
