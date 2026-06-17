import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Timeline } from '@/components/shared/Timeline'
import { StatsCounter } from '@/components/shared/StatsCounter'
import { siteConfig, stats as staticStats } from '@/lib/data/content'
import { ExternalLink, User, Award, Target, Calendar } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

/**
 * Fetch live stats from our /api/stats route.
 * - GitHub Repos: pulled live from GitHub public API (revalidates every 24h)
 * - Years Experience: calculated from portfolioConfig.personal.careerStart
 * - Projects Built: live count of portfolioConfig.projects array
 * - Tests Written: manual value from config
 *
 * Falls back to staticStats if the fetch fails (network error, cold start timeout).
 */
async function getLiveStats() {
  try {
    // In Next.js App Router, fetch() on the same origin uses the internal
    // function call path during SSR — no actual HTTP round-trip.
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 86400 }, // 24h ISR
    })

    if (!res.ok) throw new Error(`/api/stats returned ${res.status}`)
    const data = await res.json()
    return data.stats as typeof staticStats
  } catch (err) {
    console.warn('[about] Failed to fetch live stats, using static fallback:', err)
    return staticStats
  }
}

export default async function AboutPage() {
  const liveStats = await getLiveStats()

  return (
    <Section id="about">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">About Me</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Passionate full-stack developer with a love for creating exceptional digital experiences
          </p>
        </AnimatedSection>

        {/* Stats — live data from GitHub API + careerStart date */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <StatsCounter stats={liveStats} className="mb-16" />
        </AnimatedSection>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <AnimatedSection animation="slideRight" delay={0.3}>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">{siteConfig.tagline}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {siteConfig.bio}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I specialize in building modern web applications using cutting-edge technologies. 
                My approach combines technical expertise with creative problem-solving to deliver 
                solutions that not only work flawlessly but also provide exceptional user experiences.
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
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">QA / SDET</div>
                    <div className="text-sm text-muted-foreground">Test Automation</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">Full-Stack</div>
                    <div className="text-sm text-muted-foreground">React & Node.js</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">Performance</div>
                    <div className="text-sm text-muted-foreground">K6 Load Testing</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">CI/CD</div>
                    <div className="text-sm text-muted-foreground">Azure DevOps</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </Section>
  )
}
