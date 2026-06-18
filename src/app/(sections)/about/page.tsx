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

export const dynamic = 'force-dynamic'

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
          <p className="text-center text-muted-foreground mb-8">
            SDET &amp; Full-Stack Developer based in {siteConfig.location} &mdash; building reliable software with clean code and a test-first mindset.
          </p>
        </AnimatedSection>

        {/* Live Stats */}
        <StatsCounter stats={liveStats} />

        {/* Bio + Core Competencies */}
        <AnimatedSection animation="slideUp" className="grid md:grid-cols-2 gap-8 mt-10">
          <div>
            <h3 className="text-2xl font-semibold mb-3">{siteConfig.tagline}</h3>
            <p className="text-muted-foreground mb-4">{siteConfig.bio}</p>
            <p className="text-muted-foreground mb-6">
              I specialize in end-to-end test automation (Playwright, Selenium, K6) and modern full-stack development with React, Next.js, and Node.js. Every project I ship is backed by robust automated test coverage.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href={siteConfig.resume}
                target="_blank"
                className={cn(buttonVariants({ variant: 'default' }))}
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Download Resume
              </Link>
              <Link
                href={siteConfig.github}
                target="_blank"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                View GitHub
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Core Competencies</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                { icon: User, title: 'QA / SDET', sub: 'Test Automation' },
                { icon: Target, title: 'Full-Stack', sub: 'React & Node.js' },
                { icon: Award, title: 'Performance', sub: 'K6 Load Testing' },
                { icon: Calendar, title: 'CI/CD', sub: 'Azure DevOps' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Education */}
        <AnimatedSection animation="slideUp" className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" /> Education
          </h3>
          <div className="space-y-4">
            {(education as any[]).map((edu: any, i: number) => (
              <Card key={edu.id ?? i}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-lg">{edu.institution}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {edu.grade && (
                        <Badge variant="secondary" className="mb-1">{edu.grade}</Badge>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.period?.start)} &ndash; {edu.period?.present ? 'Present' : edu.period?.end ? formatDate(edu.period.end) : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {edu.achievements && edu.achievements.length > 0 && (
                  <CardContent>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Achievements</p>
                    <ul className="space-y-1">
                      {edu.achievements.map((ach: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Experience */}
        <AnimatedSection animation="slideUp" className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Experience
          </h3>
          <div className="space-y-4">
            {(experiences as any[]).map((exp: any, i: number) => (
              <Card key={exp.id ?? i}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-lg">{exp.role ?? exp.position ?? exp.title}</CardTitle>
                      <p className="text-muted-foreground text-sm font-medium mt-1">{exp.company}</p>
                      {exp.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{exp.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {exp.type && (
                        <Badge variant="outline" className="mb-1 capitalize">{exp.type.replace('-', ' ')}</Badge>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {formatDate(exp.period?.start)} &ndash; {exp.period?.present ? 'Present' : exp.period?.end ? formatDate(exp.period.end) : ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((ach: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

      </div>
    </Section>
  )
}
