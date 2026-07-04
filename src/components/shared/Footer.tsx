// Footer is a pure display component with no state/effects.
// Keeping it as a Server Component by omitting 'use client'.
import { Github, Linkedin, Twitter, Mail, MapPin, Code2, Heart, Zap, ExternalLink } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'

const { personal } = portfolioConfig

const SOCIAL_LINKS = [
  { icon: Github,   href: personal.github   || 'https://github.com/gokulsenthilkumar3',           label: 'GitHub',     hoverColor: 'hover:text-foreground' },
  { icon: Linkedin, href: personal.linkedin || 'https://www.linkedin.com/in/gokulsenthilkumar3/', label: 'LinkedIn',   hoverColor: 'hover:text-blue-400'   },
  { icon: Twitter,  href: personal.twitter  || 'https://x.com/GokulKangeyanS',                   label: 'X/Twitter',  hoverColor: 'hover:text-sky-400'    },
  { icon: Mail,     href: `mailto:${personal.email}`,                                              label: 'Email',      hoverColor: 'hover:text-primary'    },
]

const NAV_LINKS = [
  { label: 'Home',     href: '/#home'     },
  { label: 'About',    href: '/#about'    },
  { label: 'Skills',   href: '/#skills'   },
  { label: 'Projects', href: '/#projects' },
  { label: 'GitHub',   href: '/#github'   },
  { label: 'Insights', href: '/#insights' },
  { label: 'Contact',  href: '/#contact'  },
]

const TECH_STACK = [
  { label: 'Next.js 15',   href: 'https://nextjs.org'           },
  { label: 'TypeScript',   href: 'https://typescriptlang.org'   },
  { label: 'Tailwind CSS', href: 'https://tailwindcss.com'      },
  { label: 'Framer Motion',href: 'https://www.framer.com/motion' },
  { label: 'Three.js',     href: 'https://threejs.org'          },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/40 bg-background/95 backdrop-blur-xl mt-auto overflow-hidden">
      {/* Ambient gradient — decorative */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 pt-14 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl font-display tracking-tight">Gokul S</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              SDET &amp; Full-Stack Developer crafting reliable, scalable software from Tamil Nadu, India.
              Passionate about testing, DevOps, and building delightful user experiences.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
              <span>{personal.location}</span>
            </div>
            <div className="flex items-center gap-2 pt-1" role="list" aria-label="Social links">
              {SOCIAL_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  role="listitem"
                  className={`w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:border-border hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${link.hoverColor}`}
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <nav aria-label="Footer navigation">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80 mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Built with */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80 mb-4">Built with</h4>
            <ul className="space-y-2.5">
              {TECH_STACK.map(tech => (
                <li key={tech.label}>
                  <a
                    href={tech.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                  >
                    <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
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
            &copy; {year} Gokul S. Made with
            <Heart className="h-3 w-3 text-red-400 fill-red-400 mx-0.5" aria-hidden="true" />
            from Tamil Nadu.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3 text-primary" aria-hidden="true" />
            Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
