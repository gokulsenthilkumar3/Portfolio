import React from 'react'
import { cn } from '@/lib/utils/cn'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  background?: 'default' | 'muted' | 'accent' | 'gradient'
  pattern?: boolean
}

export function Section({ 
  children, 
  className, 
  id, 
  background = 'default',
  pattern = false 
}: SectionProps) {
  const backgroundStyles = {
    default: 'bg-background',
    muted: 'bg-muted',
    accent: 'bg-accent',
    gradient: 'bg-gradient-to-br from-background via-muted to-background'
  }

  return (
    <section 
      id={id}
      className={cn(
        'relative py-20 md:py-32',
        backgroundStyles[background],
        className
      )}
    >
      {pattern && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        {children}
      </div>
    </section>
  )
}
