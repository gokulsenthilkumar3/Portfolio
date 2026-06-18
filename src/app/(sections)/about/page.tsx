import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatsCounter } from '@/components/shared/StatsCounter'
import { siteConfig, stats as staticStats, education, experiences } from '@/lib/data/content'
import { ExternalLink, User, Award, Target, Calendar, GraduationCap, Briefcase, MapPin, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

async function getLiveStats() {
  try {
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/stats`, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error(`/api/stats returned ${res.status}`)
    const data = await res.json()
    return data.stats as typeof staticStats
  } catch {
    return staticStats
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default async function AboutPage() {
  const liveStats = await getLiveStats()

  return (
    <Section id="about">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">About Me</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            SDET & Full-Stack Developer based in Erode, Tamil Nadu — building reliable software with clean code and a test-first mindset.
          </p>
        </AnimatedSection>

        {/* Live Stats */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <StatsCounter stats={liveStats} className="mb-16" />
        </AnimatedSection>

        {/* Bio + Core Competencies */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <AnimatedSection animation="slideRight" delay={0.3}>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">{siteConfig.tagline}</h3>
              <p className="text-muted-foreground leading-relaxed">{siteConfig.bio}</p>
              <p className="text-muted-foreground leading-relaxed">
                I specialize in end-to-end test automation (Playwright, Selenium, K6) and modern
                full-stack development with React, Next.js, and Node.js. Every project I ship is
                backed by robust automated test coverage.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={siteConfig.resume || '/Gokul_S_Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants(), 'gap-2')}
                >
                  Download Resume
                </Link>
                <Link
                  href="https://github.com/gokulsenthilkumar3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
                >
                  <ExternalLink className="h-4 w-4" />
                  View GitHub
                </Link>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slideLeft" delay={0.4}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Core Competencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: User, title: 'QA / SDET', sub: 'Test Automation' },
                    { icon: Target, title: 'Full-Stack', sub: 'React & Node.js' },
                    { icon: Award, title: 'Performance', sub: 'K6 Load Testing' },
                    { icon: Calendar, title: 'CI/CD', sub: 'Azure DevOps' },
                  ].map(({ icon: Icon, title, sub }) => (
                    <div key={title} className="text-center">
                      <div className="flex justify-center mb-2">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-lg font-semibold">{title}</div>
                      <div className="text-sm text-muted-foreground">{sub}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Education */}
        <AnimatedSection animation="slideUp" delay={0.5}>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <GraduationCap className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold">Education</h3>
            </div>
            <div className="space-y-4">
              {(education as any[]).map((edu: any, i: number) => (
                <Card key={i} className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-500/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold">{edu.institution}</h4>
                        <p className="text-primary font-medium">{edu.degree}</p>
                        {edu.gpa && (
                          <Badge variant="secondary" className="text-xs w-fit">
                            {edu.gpa}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                      </div>
                    </div>
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Achievements</p>
                        <ul className="space-y-1">
                          {edu.achievements.map((ach: string, j: number) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Experience */}
        <AnimatedSection animation="slideUp" delay={0.6}>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold">Experience</h3>
            </div>
            <div className="space-y-4">
              {(experiences as any[]).map((exp: any, i: number) => (
                <Card key={i} className="border-l-4 border-l-violet-500 bg-gradient-to-r from-violet-500/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold">{exp.position ?? exp.title}</h4>
                        <p className="text-primary font-medium flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          {exp.company}
                        </p>
                        {exp.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-shrink-0">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-xs px-2 py-0">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>

      </div>
    </Section>
  )
}
