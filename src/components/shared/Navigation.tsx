'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const links = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Work', id: 'projects' },
  { label: 'Journey', id: 'experience' },
  { label: 'Contact', id: 'contact' },
] as const

export function Navigation() {
  const [visible, setVisible] = useState(false)
  const [bordered, setBordered] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const heroBoundary = window.innerHeight * 0.72
      const delta = y - lastY.current
      setBordered(y > 100)

      if (y < heroBoundary) {
        setVisible(false)
      } else if (lastY.current < heroBoundary || delta < -5) {
        setVisible(true)
      } else if (delta > 7) {
        setVisible(false)
      }

      lastY.current = y
    }

    lastY.current = window.scrollY
    setBordered(window.scrollY > 100)
    if (window.scrollY >= window.innerHeight * 0.72) setVisible(true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = ['home', ...links.map((link) => link.id)]
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)
        if (!visibleEntries.length) return
        const current = visibleEntries.reduce((best, entry) =>
          entry.intersectionRatio > best.intersectionRatio ? entry : best
        )
        setActive(current.target.id)
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.4] }
    )

    ids.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const shown = visible || menuOpen

  return (
    <header
      className="minimal-nav"
      data-visible={shown}
      data-bordered={bordered}
      onFocusCapture={() => setVisible(true)}
    >
      <nav aria-label="Primary navigation" className="minimal-nav__inner">
        <Link href="/#home" className="minimal-nav__identity" data-cursor="link" data-magnetic>
          Gokul S.
        </Link>

        <div className="minimal-nav__links">
          {links.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              aria-current={active === link.id ? 'location' : undefined}
              data-cursor="link"
              data-magnetic
            >
              <span className="minimal-nav__dot" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="minimal-nav__menu"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          data-cursor="link"
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="minimal-nav__mobile"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.035 }}
              >
                <Link href={`/#${link.id}`} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
