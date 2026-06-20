'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

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
            <p className="text-muted-foreground mb-6">Press Space to play a mini-game while you&apos;re here!</p>
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

              {/* Player (Car/Cube) */}
              <div
                ref={carRef}
                className={`absolute left-10 w-10 h-10 bg-gradient-to-br from-primary to-indigo-500 rounded-md shadow-[0_0_20px_rgba(99,102,241,0.6)] ${isJumping ? 'bottom-[120px] transition-all duration-200 ease-out' : 'bottom-12 transition-all duration-300 ease-in'}`}
              >
                {/* Wheels */}
                <div className="absolute -bottom-1.5 left-1 w-3 h-3 bg-zinc-800 rounded-full" />
                <div className="absolute -bottom-1.5 right-1 w-3 h-3 bg-zinc-800 rounded-full" />
              </div>

              {/* Obstacle */}
              <div
                ref={obstacleRef}
                className="absolute bottom-12 w-8 h-12 bg-rose-500 rounded-t-md shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                style={{
                  animation: isPlaying ? 'moveLeft 1.5s infinite linear' : 'none',
                  right: isPlaying ? '-50px' : '20%',
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
