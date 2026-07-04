'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2, Sun, Moon, ExternalLink, Download } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { useThemeStore } from '@/lib/hooks/use-theme'

const { personal } = portfolioConfig

const NAV_LINKS = [
  { label: 'Home',     href: '/#home'     },
  { label: 'About',    href: '/#about'    },
  { label: 'Skills',   href: '/#skills'   },
  { label: 'Projects', href: '/#projects' },
  { label: 'GitHub',   href: '/#github'   },
  { label: 'Insights', href: '/#insights' },
  { label: 'Contact',  href: '/#contact'  },
]

export function Navigation() {
  const [open, setOpen]               = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [activeSection, setActive]    = useState('home')
  const pathname = usePathname()
  const { theme, setTheme }           = useThemeStore()

  // Throttled scroll listener — passive, no forced reflow
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Single IntersectionObserver for all sections
  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.split('#')[1]).filter(Boolean)
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) {
          // Pick the one with the largest visible ratio
          const best = visible.reduce((a, b) =>
            a.intersectionRatio >= b.intersectionRatio ? a : b
          )
          setActive(best.target.id)
        }
      },
      { threshold: 0.3 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Close mobile drawer on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme])
  const isActive    = (href: string) => href.split('#')[1] === activeSection

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/85 backdrop-blur-xl border-b border-border/50 shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav
          className="container mx-auto px-4 h-16 flex items-center justify-between"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Go to home">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center"
            >
              <Code2 className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="font-bold text-base font-display tracking-tight">
              Gokul<span className="text-primary">.</span>dev
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                role="menuitem"
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  isActive(link.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/8 rounded-full border border-border/60"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a
              href={personal.resume || '/Gokul_S_Resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Resume
            </a>

            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              className="md:hidden w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />
            <motion.div
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-background/95 backdrop-blur-xl border-l border-border/60 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/40">
                <span className="font-bold font-display">Gokul<span className="text-primary">.</span>dev</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                        isActive(link.href)
                          ? 'bg-primary/15 text-primary border border-primary/25'
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive(link.href) ? 'bg-primary' : 'bg-muted-foreground/40'}`} aria-hidden="true" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="px-4 pb-6 border-t border-border/40 pt-4">
                <a
                  href={personal.resume || '/Gokul_S_Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Resume
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
