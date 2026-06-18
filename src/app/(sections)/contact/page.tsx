import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { ContactForm } from '@/components/shared/ContactForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mail, MapPin, Clock, Github, Linkedin, Twitter } from 'lucide-react'
import { siteConfig, socialLinks, personal } from '@/lib/data/content'

export default function ContactPage() {
  const availabilityStatus = {
    available:      { color: 'bg-green-500',  text: 'Available for work'  },
    busy:           { color: 'bg-yellow-500', text: 'Currently busy'       },
    'open-to-offers':{ color: 'bg-blue-500',  text: 'Open to offers'      },
  }

  const status = availabilityStatus[siteConfig.availability]

  // Zoho email from personal config
  const emailZoho = (personal as any).emailZoho as string | undefined

  return (
    <Section id="contact" background="muted">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">Get In Touch</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            I\'m always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hi, feel free to reach out!
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <AnimatedSection animation="slideRight" delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Gmail */}
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium">Gmail</p>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                      >
                        {siteConfig.email}
                      </a>
                    </div>
                  </div>

                  {/* Zoho Mail */}
                  {emailZoho && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">Zoho Mail</p>
                        <a
                          href={`mailto:${emailZoho}`}
                          className="text-sm text-muted-foreground hover:text-orange-400 transition-colors truncate block"
                        >
                          {emailZoho}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <Badge variant="secondary" className="text-xs">
                          {status.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slideRight" delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle>Social Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map((link) => {
                    const Icon =
                      link.platform === 'github'   ? Github   :
                      link.platform === 'linkedin' ? Linkedin :
                      link.platform === 'twitter'  ? Twitter  : Mail

                    const label =
                      link.platform === 'email'    ? 'Gmail'     :
                      link.platform === 'zohomail' ? 'Zoho Mail' :
                      link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

                    const hoverClass =
                      link.platform === 'zohomail' ? 'group-hover:text-orange-400' : 'group-hover:text-primary'

                    return (
                      <Button
                        key={link.platform}
                        variant="outline"
                        className="w-full justify-start hover:bg-primary/5 group transition-all duration-300"
                        asChild
                      >
                        <a
                          href={link.url}
                          target={link.url.startsWith('mailto') ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className="flex items-center gap-3"
                        >
                          <Icon className={`h-4 w-4 text-muted-foreground ${hoverClass} transition-colors`} />
                          <span className="text-muted-foreground group-hover:text-foreground">
                            {label}
                          </span>
                        </a>
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slideRight" delay={0.6}>
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-sm">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I typically respond within 24–48 hours. For urgent matters,
                    please mention it in the subject.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="slideLeft" delay={0.3}>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>

        {/* CTA */}
        <AnimatedSection animation="slideUp" delay={0.8}>
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-primary/20 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 font-display">Let\'s Build Something Amazing Together</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm">
                  Whether you have a project in mind, need consultation, or want to collaborate on something exciting,
                  I\'m here to help bring your ideas to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="px-8 shadow-lg shadow-primary/20" asChild>
                    <a href={`mailto:${siteConfig.email}`}>Send an Email</a>
                  </Button>
                  <Button variant="outline" size="lg" className="px-8" asChild>
                    <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer">
                      Download Resume
                    </a>
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
