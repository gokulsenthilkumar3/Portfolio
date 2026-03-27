'use client'

import { useEffect, useRef, useState } from 'react'
import { useAdmin } from './AdminProvider'
import { PinModal } from './PinModal'

const SECRET_KEYS = ['ControlLeft', 'ShiftLeft', 'KeyE']
const HOLD_DURATION = 1500 // 1.5s

export function SecretActivator() {
  const { isAdmin } = useAdmin()
  const [showPinModal, setShowPinModal] = useState(false)
  const pressedKeys = useRef<Set<string>>(new Set())
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isAdmin) return // Already admin, no need to listen

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.current.add(e.code)
      
      const allPressed = SECRET_KEYS.every(key => pressedKeys.current.has(key))
      
      if (allPressed && !holdTimer.current) {
        holdTimer.current = setTimeout(() => {
          setShowPinModal(true)
          holdTimer.current = null
        }, HOLD_DURATION)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.code)
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
        holdTimer.current = null
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (holdTimer.current) clearTimeout(holdTimer.current)
    }
  }, [isAdmin])

  if (showPinModal) {
    return <PinModal onClose={() => setShowPinModal(false)} onSuccess={() => setShowPinModal(false)} />
  }

  return null
}
