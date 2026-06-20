'use client'

import { Github, Linkedin, Twitter, Mail, MapPin, Code2, Heart, Zap, ExternalLink } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'

const { personal } = portfolioConfig

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github,   href: personal.github || 'https://github.com/gokulsenthilkumar3', label: 'GitHub',    hoverColor: 'hover:text-foreground' },
    { icon: Linkedin, href: personal.linkedin || 'https://www.linkedin.com/in/gokulsenthilkumar3/', label: 'LinkedIn',  hoverColor: 'hover:text-blue-400' },
    { icon: Twitter,  href: personal.twitter || 'https://x.com/GokulKangeyanS', label: 'X / Twitter', hoverColor: 'hover:text-sky-400' },
    { icon: Mail,     href: `mailto:${personal.email}`, label: 'Gmail',     hoverColor: 'hover:text-primary' },
    { icon: Mail,     href: `mailto:${(personal as any).emailZoho || 'gokulsenthilkumar3@zohomail.in'}`, label: 'Zoho Mail', hoverColor: 'hover:text-orange-400' },
  ]

  const navLinks = [
    { label: 'Home',     href: '/#home'     },
    { label: 'About',    href: '/#about'    },
    { label: 'Skills',   href: '/#skills'   },
    { label: 'Projects', href: '/#projects' },
    { label: 'GitHub',   href: '/#github'   },
    { label: 'Insights', href: '/#insights' },
    { label: 'Contact',  href: '/#contact'  },
  ]

  const techStack = [
    { label: 'Next.js 15', href: 'https://nextjs.org' },
    { label: 'TypeScript', href: 'https://typescriptlang.org' },
    { label: 'Tailwind CSS', href: 'https://tailwindcss.com' },
    { label: 'Three.js', href: 'https://threejs.org' },
  ]

  return (
    <footer className="relative border-t border-border/40 bg-background/95 backdrop-blur-xl mt-auto overflow-hidden">
      {/* Subtle gradient orb */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Code2 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-xl font-display tracking-tight">Gokul S</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              SDET &amp; Full-Stack Developer crafting reliable, scalable software from Tamil Nadu, India. Passionate about testing, DevOps, and building delightful user experiences.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary/70" />
              <span>{personal.location}</span>
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:border-border hover:bg-white/5 ${link.hoverColor}`}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Navigate</h4>
            <ul className="space-y-2.5">
              {navLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Built with */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">Built with</h4>
            <ul className="space-y-2.5">
              {techStack.map(tech => (
                <li key={tech.label}>
                  <a
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                    {tech.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            &copy; {currentYear} Gokul S. Made with
            <Heart className="h-3 w-3 text-red-400 fill-red-400 inline mx-0.5" />
            from Tamil Nadu.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" />
            Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
