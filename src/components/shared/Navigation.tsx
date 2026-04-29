'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, Code2, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ThemeSelector } from '@/components/shared/ThemeSelector'
import { useThemeStore } from '@/lib/hooks/use-theme'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { theme, toggleTheme } = useThemeStore()
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Projects', href: '/#projects', id: 'projects' },
    { label: 'Skills', href: '/#skills', id: 'skills' },
    { label: 'Contact', href: '/#contact', id: 'contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      // Update active section based on scroll position
      const sections = navItems.map((item) => item.id)
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string, id: string) => {
    if (pathname !== '/') {
      router.push(href)
      return
    }
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(id)
    setIsOpen(false)
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/50 bg-background/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            href="/#home"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                scrollToSection('/#home', 'home')
              }
            }}
            className="flex items-center gap-2 group"
            aria-label="Go to top"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base font-display">Gokul S</span>
              <span className="text-[10px] text-muted-foreground font-mono tracking-wider">SDET & Dev</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href, item.id)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeSection === item.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-1.5">
            {/* Download Resume */}
            <a
              href="/Gokul_S_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </a>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Dark/Light Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-500" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border/50 pb-4 pt-2">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href, item.id)}
                  className={cn(
                    'text-sm font-medium px-3 py-2.5 rounded-md text-left transition-colors',
                    activeSection === item.id
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {item.label}
                </button>
              ))}
              <a
                href="/Gokul_S_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-3 py-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors mt-1 border-t border-border/30 pt-3"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
