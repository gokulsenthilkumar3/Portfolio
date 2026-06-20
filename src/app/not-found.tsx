'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function NotFound() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // Game state
  const carRef = useRef<HTMLDivElement>(null)
  const obstacleRef = useRef<HTMLDivElement>(null)
  const [isJumping, setIsJumping] = useState(false)

  // Start game
  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
  }

  // Handle Jump
  const jump = () => {
    if (isJumping || gameOver || !isPlaying) return
    setIsJumping(true)
    setTimeout(() => {
      setIsJumping(false)
    }, 500)
  }

  // Game Loop for collision and scoring
  useEffect(() => {
    if (!isPlaying || gameOver) return

    let scoreInterval: NodeJS.Timeout
    let checkInterval: NodeJS.Timeout

    if (isPlaying && !gameOver) {
      scoreInterval = setInterval(() => {
        setScore(s => s + 1)
      }, 100)

      checkInterval = setInterval(() => {
        const car = carRef.current
        const obstacle = obstacleRef.current

        if (car && obstacle) {
          const carRect = car.getBoundingClientRect()
          const obsRect = obstacle.getBoundingClientRect()

          // Simple AABB Collision
          if (
            carRect.right > obsRect.left &&
            carRect.left < obsRect.right &&
            carRect.bottom > obsRect.top &&
            carRect.top < obsRect.bottom
          ) {
            setGameOver(true)
            setIsPlaying(false)
            setHighScore(prev => Math.max(prev, score))
          }
        }
      }, 20)
    }

    return () => {
      clearInterval(scoreInterval)
      clearInterval(checkInterval)
    }
  }, [isPlaying, gameOver, score])

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (!isPlaying && !gameOver) startGame()
        else if (gameOver) startGame()
        else jump()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, gameOver, isJumping])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden relative selection:bg-primary/20">
      
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        {!isPlaying && !gameOver && (
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-8xl md:text-[10rem] font-black font-display leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary to-indigo-600 mb-2">
              404
            </h1>
            <h2 className="text-2xl font-bold mb-4">You&apos;ve wandered off the map.</h2>
            <p className="text-muted-foreground mb-6">Play a round of <span className="text-indigo-500 font-bold">Commit City</span> while you&apos;re here! Jump over the Merge Conflicts.</p>
            <button 
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 transition-transform"
            >
              Start Game
            </button>
          </div>
        )}

        {(isPlaying || gameOver) && (
          <div className="w-full relative">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-lg font-bold font-mono">Score: {score}</span>
              <span className="text-sm font-mono text-muted-foreground">HI: {highScore}</span>
            </div>

            {/* Game Screen */}
            <div 
              className="w-full h-64 border-2 border-border/60 rounded-2xl relative overflow-hidden bg-background shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-[0_0_40px_rgba(99,102,241,0.05)]"
              onClick={jump}
            >
              {/* Sky/Background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
              
              {/* Ground */}
              <div className="absolute bottom-0 w-full h-12 bg-border/40 border-t-2 border-primary/50" />

              {/* Player (Designer Toy / Car) */}
              <motion.div
                ref={carRef}
                className="absolute left-10 w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 border border-white/20 shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_10px_20px_rgba(79,70,229,0.4)]"
                animate={{
                  y: isJumping ? -100 : 0,
                  rotate: isJumping ? 180 : 0,
                  scale: isJumping ? 1.1 : 1
                }}
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 20 },
                  rotate: { type: "spring", stiffness: 200, damping: 20 }
                }}
                style={{ bottom: '48px' }}
              >
                {/* Eyes/Visor */}
                <div className="absolute top-3 right-2 w-6 h-3 bg-white/90 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" />
                {/* Wheels/Hover pads */}
                <div className="absolute -bottom-2 left-1 w-4 h-4 bg-zinc-800 rounded-full shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)]" />
                <div className="absolute -bottom-2 right-1 w-4 h-4 bg-zinc-800 rounded-full shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)]" />
              </motion.div>

              {/* Obstacle */}
              <motion.div
                ref={obstacleRef}
                className="absolute bottom-12 w-10 h-14 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-t-xl shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_10px_20px_rgba(225,29,72,0.4)]"
                initial={{ x: '100vw' }}
                animate={isPlaying ? { x: '-20vw' } : { x: '100vw' }}
                transition={{
                  x: {
                    repeat: isPlaying ? Infinity : 0,
                    duration: Math.max(0.8, 1.5 - score * 0.05), // Speeds up as score increases
                    ease: "linear"
                  }
                }}
              />

              {gameOver && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                  <h3 className="text-3xl font-black mb-2 text-rose-500">GAME OVER</h3>
                  <p className="text-muted-foreground mb-6">You scored {score}</p>
                  <button 
                    onClick={startGame}
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Press SPACE or tap the screen to jump.
            </p>
          </div>
        )}

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 z-10">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl border border-border/60 bg-card/40 text-sm font-semibold hover:bg-card/70 transition-colors"
          >
            ← Return Home
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes moveLeft {
          0% { right: -50px; }
          100% { right: 100%; }
        }
      `}} />
    </main>
  )
}
