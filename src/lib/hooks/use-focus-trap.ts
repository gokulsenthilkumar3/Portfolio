'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')
const DEFAULT_INERT_SELECTORS = ['#main-content', '.minimal-nav']

interface FocusTrapOptions {
  onClose?: () => void
  initialFocusRef?: React.RefObject<HTMLElement | null>
  inertSelectors?: string[]
}

/**
 * Keeps keyboard focus inside an open overlay and restores it to the trigger
 * when the overlay closes. The public page is made inert while it is active,
 * so screen readers and keyboard users cannot accidentally work behind a modal.
 */
export function useFocusTrap(
  open: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  { onClose, initialFocusRef, inertSelectors = DEFAULT_INERT_SELECTORS }: FocusTrapOptions = {},
) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const container = containerRef.current
    if (!container) return

    const inertState = inertSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)))
      .filter((element, index, elements) =>
        elements.indexOf(element) === index &&
        !container.contains(element) &&
        !element.contains(container),
      )
      .map((element) => ({ element, hadAttribute: element.hasAttribute('inert'), hadProperty: element.inert }))

    inertState.forEach(({ element }) => {
      element.inert = true
      element.setAttribute('inert', '')
    })

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))

    const focusInitial = () => {
      const target = initialFocusRef?.current ?? getFocusable()[0]
      target?.focus({ preventScroll: true })
    }

    const frame = window.requestAnimationFrame(focusInitial)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      if (!focusable.length) {
        event.preventDefault()
        container.focus({ preventScroll: true })
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      inertState.forEach(({ element, hadAttribute, hadProperty }) => {
        element.inert = hadProperty
        if (hadAttribute) element.setAttribute('inert', '')
        else element.removeAttribute('inert')
      })
      if (triggerRef.current?.isConnected) triggerRef.current.focus({ preventScroll: true })
    }
  }, [containerRef, inertSelectors, initialFocusRef, open])
}
