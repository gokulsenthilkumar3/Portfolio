'use client'

import { Github, Linkedin, Twitter, Mail, MapPin, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Footer() {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/gokulsenthilkumar3',
      label: 'GitHub',
      hoverColor: 'hover:text-white'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/gokulsenthilkumar3/',
      label: 'LinkedIn',
      hoverColor: 'hover:text-blue-400'
    },
    {
      icon: Twitter,
      href: 'https://x.com/GokulKangeyanS',
      label: 'X / Twitter',
      hoverColor: 'hover:text-sky-400'
    },
    {
      icon: Mail,
      href: 'mailto:gokulsenthilkumar3@gmail.com',
      label: 'Email',
      hoverColor: 'hover:text-primary'
    },
  ]

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                Gokul S
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              SDET & Full-Stack Developer building reliable software
              from Tamil Nadu, India.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>Sivanmalai, Tamil Nadu</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm text-muted-foreground transition-colors ${link.hoverColor}`}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            &copy; {new Date().getFullYear()} Gokul S. Built with Next.js 15 &amp; TypeScript.
          </span>
          <div className="flex items-center gap-4">
            {socialLinks.slice(0, 4).map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                asChild
              >
                <a
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
