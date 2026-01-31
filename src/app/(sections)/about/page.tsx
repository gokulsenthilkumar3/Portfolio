import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Timeline } from '@/components/shared/Timeline'
import { StatsCounter } from '@/components/shared/StatsCounter'
import { siteConfig, stats } from '@/lib/data/content'
import { ExternalLink, User, Award, Target, Calendar } from 'lucide-react'

export default function AboutPage() {
  return (
    <Section id="about">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">About Me</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Passionate full-stack developer with a love for creating exceptional digital experiences
          </p>
        </AnimatedSection>

        {/* Stats Counter */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <StatsCounter stats={stats} className="mb-16" />
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
                <Button>Download Resume</Button>
                <Button variant="outline">View GitHub</Button>
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
                    <div className="text-lg font-semibold">Frontend</div>
                    <div className="text-sm text-muted-foreground">React, Next.js, TypeScript</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">Backend</div>
                    <div className="text-sm text-muted-foreground">Node.js, Python, PostgreSQL</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">Tools</div>
                    <div className="text-sm text-muted-foreground">Git, Docker, AWS</div>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold">Experience</div>
                    <div className="text-sm text-muted-foreground">5+ Years</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

        {/* Skills Overview */}
        <AnimatedSection animation="slideUp" delay={0.5}>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Technical Expertise</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Frontend Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Tailwind CSS</Badge>
                    <Badge>Vue.js</Badge>
                    <Badge>HTML/CSS</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backend Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Node.js</Badge>
                    <Badge>Python</Badge>
                    <Badge>PostgreSQL</Badge>
                    <Badge>MongoDB</Badge>
                    <Badge>Express.js</Badge>
                    <Badge>FastAPI</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tools & Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Git</Badge>
                    <Badge>Docker</Badge>
                    <Badge>AWS</Badge>
                    <Badge>Vercel</Badge>
                    <Badge>Figma</Badge>
                    <Badge>CI/CD</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>

        {/* Experience Timeline */}
        <AnimatedSection animation="fadeIn" delay={0.6}>
          <div>
            <h3 className="text-2xl font-bold text-center mb-12">Professional Journey</h3>
            <Timeline />
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection animation="slideUp" delay={0.8}>
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  I'm always excited to take on new challenges and collaborate on innovative projects. 
                  If you're looking for a dedicated developer who can bring your ideas to life, 
                  let's get in touch!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Projects
                  </Button>
                  <Button variant="outline" size="lg">
                    Contact Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </Section>
  )
}
