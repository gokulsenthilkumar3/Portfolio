'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Code2, Sun, Moon, Download,
  LayoutGrid, Cpu, Briefcase, Github, Lightbulb, Mail, Home, MessageSquare
} from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { useThemeStore } from '@/lib/hooks/use-theme'

const { personal } = portfolioConfig

// ── Links now match the reordered page: Projects → Skills → About → GitHub → Blog → Contact
const NAV_LINKS = [
  { label: 'Home',     href: '/#home',     Icon: Home      },
  { label: 'Projects', href: '/#projects', Icon: LayoutGrid },
  { label: 'Skills',   href: '/#skills',   Icon: Cpu       },
  { label: 'About',    href: '/#about',    Icon: Briefcase  },
  { label: 'GitHub',   href: '/#github',   Icon: Github    },
  { label: 'Insights', href: '/#insights', Icon: Lightbulb },
  { label: 'Guestbook',href: '/guestbook', Icon: MessageSquare },
  { label: 'Contact',  href: '/#contact',  Icon: Mail      },
] as const

export function Navigation() {
  const [open, setOpen]            = useState(false)
  const [scrolled, setScrolled]    = useState(false)
  const [activeSection, setActive] = useState('home')
  const { theme, setTheme }        = useThemeStore()

  // Throttled scroll — passive, zero forced-reflow
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
    const ids = NAV_LINKS.map(l => l.href.split('#')[1]).filter(Boolean)
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (!visible.length) return
        const best = visible.reduce((a, b) =>
          a.intersectionRatio >= b.intersectionRatio ? a : b
        )
        setActive(best.target.id)
      },
      { threshold: 0.25, rootMargin: '-60px 0px 0px 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  // ESC closes mobile drawer
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open])

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const toggleTheme = useCallback(() =>
    setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme])

  const isActive = (href: string) => href.split('#')[1] === activeSection

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-[0_1px_24px_rgba(0,0,0,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="container mx-auto px-4 h-16 flex items-center justify-between gap-4"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Go to home">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
            >
              <Code2 className="h-4 w-4 text-primary" />
            </motion.div>
            <span className="font-bold text-base font-display tracking-tight">
              Gokul<span className="text-primary">.</span>dev
            </span>
          </Link>

          {/* ── Desktop links ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.07] rounded-2xl px-2 py-1.5 backdrop-blur-sm">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/12 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              )
            })}
          </div>

          {/* ── Right actions ─────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Resume download */}
            <a
              href={personal.resume || '/Gokul_S_Resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Resume
            </a>

            {/* Hire Me CTA — only shows on large screens */}
            <Link
              href="/#contact"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_16px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Hire Me
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="md:hidden w-9 h-9 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
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

      {/* ── Mobile drawer ──────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-background/96 backdrop-blur-2xl border-l border-border/50 md:hidden flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.25)]"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-bold font-display text-sm">Gokul<span className="text-primary">.</span>dev</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_LINKS.map(({ label, href, Icon }, i) => {
                  const active = isActive(href)
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                          active
                            ? 'bg-primary/12 text-primary border border-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.15)]'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${active ? 'text-primary' : 'text-muted-foreground/60'}`}
                          aria-hidden="true"
                        />
                        {label}
                        {active && (
                          <motion.span
                            layoutId="mobile-indicator"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 pb-6 pt-4 border-t border-border/40 space-y-2">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[0_0_16px_hsl(var(--primary)/0.3)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Hire Me
                </Link>
                <a
                  href={personal.resume || '/Gokul_S_Resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-muted/60 border border-border/50 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
