'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenWords?: number
  className?: string
}

export function TypewriterEffect({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  className = ''
}: TypewriterProps) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  // Blinking cursor effect
  useEffect(() => {
    const timeout = setTimeout(() => setBlink((prev) => !prev), 500)
    return () => clearTimeout(timeout)
  }, [blink])

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0)
      return
    }

    if (subIndex === words[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), delayBetweenWords)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [subIndex, index, isDeleting, words, typingSpeed, deletingSpeed, delayBetweenWords])

  return (
    <span className={className}>
      {words[index].substring(0, subIndex)}
      <motion.span
        animate={{ opacity: blink ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
      />
    </span>
  )
}
