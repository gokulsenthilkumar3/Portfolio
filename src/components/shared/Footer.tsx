'use client'

import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/lib/hooks/use-theme'

export function Footer() {
  const { theme } = useThemeStore()

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' }
  ]

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 Your Portfolio. Built with Next.js 15 and TypeScript.
          </div>
          
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                asChild
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Current theme: <span className="font-medium">{theme}</span>
        </div>
      </div>
    </footer>
  )
}
