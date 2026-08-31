'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import { navigation } from '@/lib/data/content'
import { useFocusTrap } from '@/lib/hooks/use-focus-trap'

const links = navigation

export function Navigation() {
  const { portfolioData } = useAdmin()
  const { personal } = portfolioData
  const identity = personal.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part, index) => index === 0 ? part : part[0])
    .join(' ')
  const resumeHref = personal.resume

  // Keep the primary wayfinding visible at the top of the page. Once the
  // reader moves beyond the hero it follows the original quiet interaction:
  // hide while scrolling down, reveal on scroll-up.
  const [visible, setVisible] = useState(true)
  const [bordered, setBordered] = useState(false)
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useFocusTrap(menuOpen, mobileMenuRef, {
    initialFocusRef: firstMobileLinkRef,
    onClose: closeMenu,
  })

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
    const media = window.matchMedia('(min-width: 901px)')
    const closeAtDesktop = () => {
      if (media.matches) setMenuOpen(false)
    }
    closeAtDesktop()
    media.addEventListener?.('change', closeAtDesktop)
    return () => media.removeEventListener?.('change', closeAtDesktop)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
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
          {identity}
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
          {resumeHref && (
            <a href={resumeHref} download className="minimal-nav__resume" data-cursor="link" data-no-transition>
              ↓ Resume
            </a>
          )}
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
          ref={menuButtonRef}
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
            ref={mobileMenuRef}
            id="mobile-navigation"
            className="minimal-nav__mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
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
                <Link
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={`/#${link.id}`}
                  onClick={closeMenu}
                >
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
              {resumeHref && (
                <a href={resumeHref} download className="minimal-nav__resume" onClick={closeMenu}>
                  ↓ Resume
                </a>
              )}
              <a
                href="/#contact"
                className="minimal-nav__hire"
                onClick={closeMenu}
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
