'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ThemeSelector } from '@/components/shared/ThemeSelector'
import { useThemeStore } from '@/lib/hooks/use-theme'
import { cn } from '@/lib/utils/cn'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useThemeStore()

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <nav className={cn(
      'sticky top-0 z-50 w-full border-b transition-all duration-300',
      scrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm' : 'bg-background'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="font-bold text-xl">Portfolio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Selector */}
            <ThemeSelector />
            
            {/* Quick Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="flex flex-col space-y-4 pb-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium transition-colors hover:text-primary text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
