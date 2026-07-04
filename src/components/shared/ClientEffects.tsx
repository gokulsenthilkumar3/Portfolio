'use client'
import dynamic from 'next/dynamic'

const CursorTrail = dynamic(
  () => import('@/components/effects/CursorTrail').then(m => ({ default: m.CursorTrail })),
  { ssr: false }
)
const AccentSwitcher = dynamic(
  () => import('@/components/shared/AccentSwitcher').then(m => ({ default: m.AccentSwitcher })),
  { ssr: false }
)
const GeometricGrid = dynamic(
  () => import('@/components/effects/GeometricGrid').then(m => ({ default: m.GeometricGrid })),
  { ssr: false }
)

export function ClientEffects() {
  return (
    <>
      <CursorTrail />
      <AccentSwitcher />
      <GeometricGrid className="fixed inset-0 z-[1] pointer-events-none" />
    </>
  )
}
