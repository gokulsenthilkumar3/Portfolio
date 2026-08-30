'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navigation } from '@/lib/data/content'

const links = navigation

export function Navigation() {
  // Keep the primary wayfinding visible at the top of the page. Once the
  // reader moves beyond the hero it follows the original quiet interaction:
  // hide while scrolling down, reveal on scroll-up.
  const [visible, setVisible] = useState(true)
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
        setVisible(true)
      } else if (lastY.current < heroBoundary || delta < -5) {
        setVisible(true)
      } else if (delta > 7) {
        setVisible(false)
      }

      lastY.current = y
    }

    lastY.current = window.scrollY
    setBordered(window.scrollY > 100)
    setVisible(true)
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
        {/* Logo / Identity */}
        <Link href="/#home" className="minimal-nav__identity" data-cursor="link" data-magnetic>
          <span className="minimal-nav__logo-icon" aria-hidden="true">&lt;/&gt;</span>
          Gokul S.
        </Link>

        {/* Center links */}
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

        {/* Right-side CTAs */}
        <div className="minimal-nav__actions">
          <a
            href="/Gokul_S_Resume.pdf"
            download
            className="minimal-nav__resume"
            data-cursor="link"
            data-no-transition
          >
            ↓ Resume
          </a>
          <a
            href="/#contact"
            className="minimal-nav__hire"
            data-cursor="link"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile hamburger */}
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
            {/* Mobile CTAs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: links.length * 0.035 + 0.05 }}
              style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}
            >
              <a
                href="/Gokul_S_Resume.pdf"
                download
                className="minimal-nav__resume"
                onClick={() => setMenuOpen(false)}
              >
                ↓ Resume
              </a>
              <a
                href="/#contact"
                className="minimal-nav__hire"
                onClick={() => setMenuOpen(false)}
              >
                Hire Me
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
