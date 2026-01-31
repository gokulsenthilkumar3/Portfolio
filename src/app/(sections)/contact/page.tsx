import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { ContactForm } from '@/components/shared/ContactForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mail, MapPin, Clock, Github, Linkedin, Twitter } from 'lucide-react'
import { siteConfig, socialLinks } from '@/lib/data/content'

export default function ContactPage() {
  const availabilityStatus = {
    available: { color: 'bg-green-500', text: 'Available for work' },
    busy: { color: 'bg-yellow-500', text: 'Currently busy' },
    'open-to-offers': { color: 'bg-blue-500', text: 'Open to offers' }
  }

  const status = availabilityStatus[siteConfig.availability]

  return (
    <Section id="contact" background="muted">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-bold text-center mb-4">Get In Touch</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
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
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{siteConfig.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{siteConfig.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
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
                    const Icon = link.platform === 'github' ? Github : 
                                link.platform === 'linkedin' ? Linkedin : 
                                link.platform === 'twitter' ? Twitter : Mail
                    
                    return (
                      <Button
                        key={link.id}
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3"
                        >
                          <Icon className="h-4 w-4" style={{ color: link.color }} />
                          <span className="capitalize">
                            {link.platform === 'email' ? 'Email' : link.platform}
                          </span>
                        </a>
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slideRight" delay={0.6}>
              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    I typically respond to messages within 24-48 hours. For urgent matters, please mention it in your message subject.
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

        {/* Call to Action */}
        <AnimatedSection animation="slideUp" delay={0.8}>
          <div className="text-center mt-16">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Let's Build Something Amazing Together</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Whether you have a project in mind, need consultation, or want to collaborate on something exciting, I'm here to help bring your ideas to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    Start a Project
                  </Button>
                  <Button variant="outline" size="lg">
                    Download Resume
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
