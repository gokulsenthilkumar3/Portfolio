import { Section } from '@/components/shared/Section'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { ContactForm } from '@/components/shared/ContactForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Mail, MapPin, Clock, Github, Linkedin, Twitter,
  Copy, Send, ArrowRight, CheckCircle, MessageSquare
} from 'lucide-react'
import { siteConfig, socialLinks, personal } from '@/lib/data/content'

export default function ContactPage() {
  const availabilityStatus = {
    available:       { color: 'bg-green-500',  dot: 'bg-green-400',  text: 'Available for work' },
    busy:            { color: 'bg-yellow-500', dot: 'bg-yellow-400', text: 'Currently busy' },
    'open-to-offers':{ color: 'bg-blue-500',   dot: 'bg-blue-400',   text: 'Open to offers' },
  }
  const status = availabilityStatus[siteConfig.availability as keyof typeof availabilityStatus]
  const emailZoho = (personal as any).emailZoho as string | undefined

  const contactCards = [
    {
      icon: Mail,
      label: 'Gmail',
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      accent: 'text-red-400',
      bg: 'from-red-500/5 to-transparent border-l-red-500',
    },
    ...(emailZoho ? [{
      icon: Mail,
      label: 'Zoho Mail',
      value: emailZoho,
      href: `mailto:${emailZoho}`,
      accent: 'text-orange-400',
      bg: 'from-orange-500/5 to-transparent border-l-orange-500',
    }] : []),
    {
      icon: MapPin,
      label: 'Location',
      value: siteConfig.location,
      href: null,
      accent: 'text-emerald-400',
      bg: 'from-emerald-500/5 to-transparent border-l-emerald-500',
    },
  ]

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    email: Mail,
  }

  return (
    <Section id="contact">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <AnimatedSection animation="fadeIn">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-4">
              <MessageSquare className="h-3.5 w-3.5" />
              Open to conversations
            </div>
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              I'm always interested in new projects, opportunities, and collaborations.
              Whether it's a quick question or a long-term project, feel free to reach out.
            </p>
            {/* Availability badge */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5">
                <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
                <span className="text-sm font-medium">{status.text}</span>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Left: Contact Info + Socials */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Cards */}
            <AnimatedSection animation="slideRight" delay={0.2}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contactCards.map((card) => (
                    <div
                      key={card.label}
                      className={`flex items-center gap-3 rounded-lg border-l-4 bg-gradient-to-r ${card.bg} p-3`}
                    >
                      <card.icon className={`h-4 w-4 flex-shrink-0 ${card.accent}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{card.label}</p>
                        {card.href ? (
                          <a
                            href={card.href}
                            className={`text-sm font-medium ${card.accent} hover:underline truncate block`}
                          >
                            {card.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium truncate">{card.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Response time */}
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
                    <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Response Time</p>
                      <p className="text-sm">Usually within 24–48 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Social Links */}
            <AnimatedSection animation="slideRight" delay={0.35}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Find Me Online</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {socialLinks.map((link) => {
                    const Icon = socialIcons[link.platform] ?? Mail
                    const label =
                      link.platform === 'email'    ? 'Gmail' :
                      link.platform === 'zohomail' ? 'Zoho Mail' :
                      link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
                    const accentHover =
                      link.platform === 'github'   ? 'hover:border-gray-400/40 hover:bg-gray-400/5' :
                      link.platform === 'linkedin' ? 'hover:border-blue-400/40 hover:bg-blue-400/5' :
                      link.platform === 'twitter'  ? 'hover:border-sky-400/40  hover:bg-sky-400/5'  :
                      link.platform === 'zohomail' ? 'hover:border-orange-400/40 hover:bg-orange-400/5' :
                      'hover:border-red-400/40 hover:bg-red-400/5'
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target={link.url.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between rounded-lg border border-border/50 px-4 py-2.5 transition-all duration-200 group ${accentHover}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </a>
                    )
                  })}
                </CardContent>
              </Card>
            </AnimatedSection>

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <AnimatedSection animation="slideLeft" delay={0.25}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Send a Message
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Fill in the form and I'll get back to you soon.</p>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

        </div>

        {/* CTA Footer */}
        <AnimatedSection animation="slideUp" delay={0.5}>
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Let's Build Something Amazing Together</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm">
                  Whether you have a project in mind, need consultation, or want to collaborate —
                  I'm here to help bring ideas to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Email Me
                  </a>
                  <a
                    href={siteConfig.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Download Resume
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

      </div>
    </Section>
  )
}
