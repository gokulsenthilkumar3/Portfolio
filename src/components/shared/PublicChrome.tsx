'use client'

import { usePathname } from 'next/navigation'
import { ExperienceShell } from '@/components/portfolio/ExperienceShell'
import { Navigation } from '@/components/shared/Navigation'

/** Public-only motion and navigation chrome. Admin has its own focused shell. */
export function PublicChrome() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <ExperienceShell />
      <Navigation />
    </>
  )
}
