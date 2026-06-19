'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Star, GitFork, Users, BookOpen, Code2, Activity, ExternalLink, TrendingUp, Gamepad2, X } from 'lucide-react'
import { SnakeHeatmap } from './SnakeHeatmap'

interface GitHubData {
  profile: {
    login: string
    name: string
    avatar_url: string
    bio: string
    public_repos: number
    followers: number
    following: number
    location: string
    blog: string
    created_at: string
  }
  stats: {
    totalRepos: number
    totalStars: number
    totalForks: number
    followers: number
  }
  allRepos: Array<{
    id: number
    name: string
    description: string
    url: string
    stars: number
    forks: number
    language: string
    updatedAt: string
    topics: string[]
  }>
  languages: Array<{ name: string; count: number }>
  contributions: Record<string, number>
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  React: '#61dafb',
  PHP: '#777bb4',
  HTML: '#e34f26',
  CSS: '#1572b6',
  'Jupyter Notebook': '#f37626',
  Shell: '#89e051',
  Go: '#00add8',
}

/* ─── GTA-Style Mini Game ─────────────────────────────────────────────────── */
interface GTAGameProps {
  onClose: () => void
}

function GTAGame({ onClose }: GTAGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<{
    running: boolean
    animFrame: number
    player: { x: number; y: number; vx: number; vy: number; angle: number; speed: number; health: number; score: number }
    bullets: Array<{ x: number; y: number; vx: number; vy: number; life: number }>
    enemies: Array<{ x: number; y: number; vx: number; vy: number; health: number; type: string }>
    particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }>
    pickups: Array<{ x: number; y: number; type: string }>
    keys: Record<string, boolean>
    wave: number
    spawnTimer: number
    shootCooldown: number
    invincible: number
  }>({
    running: false,
    animFrame: 0,
    player: { x: 400, y: 300, vx: 0, vy: 0, angle: 0, speed: 3.5, health: 100, score: 0 },
    bullets: [],
    enemies: [],
    particles: [],
    pickups: [],
    keys: {},
    wave: 1,
    spawnTimer: 0,
    shootCooldown: 0,
    invincible: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const g = gameRef.current

    g.running = true
    g.player = { x: W / 2, y: H / 2, vx: 0, vy: 0, angle: 0, speed: 3.5, health: 100, score: 0 }
    g.bullets = []
    g.enemies = []
    g.particles = []
    g.pickups = []
    g.wave = 1
    g.spawnTimer = 0
    g.shootCooldown = 0
    g.invincible = 0

    // Road tiles
    const TILE = 60
    const drawCity = () => {
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, W, H)
      // Road grid
      ctx.strokeStyle = '#16213e'
      ctx.lineWidth = TILE
      for (let x = TILE * 2; x < W; x += TILE * 4) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = TILE * 2; y < H; y += TILE * 4) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      // Road markings
      ctx.strokeStyle = '#f59e0b33'
      ctx.lineWidth = 2
      ctx.setLineDash([20, 15])
      for (let x = TILE * 2; x < W; x += TILE * 4) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = TILE * 2; y < H; y += TILE * 4) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      ctx.setLineDash([])
      // Buildings
      const buildings = [
        {x:20,y:20,w:80,h:80},{x:120,y:20,w:60,h:70},{x:220,y:20,w:90,h:85},
        {x:20,y:130,w:70,h:60},{x:20,y:220,w:75,h:80},{x:W-100,y:20,w:80,h:90},
        {x:W-180,y:20,w:60,h:65},{x:W-100,y:140,w:80,h:70},{x:20,y:H-100,w:90,h:80},
        {x:W-100,y:H-100,w:80,h:80},{x:W-100,y:H-200,w:70,h:80},
        {x:150,y:H-100,w:80,h:80},{x:W-250,y:H-100,w:70,h:75},
      ]
      buildings.forEach(b => {
        ctx.fillStyle = '#0f3460'
        ctx.fillRect(b.x, b.y, b.w, b.h)
        ctx.strokeStyle = '#e94560'
        ctx.lineWidth = 1
        ctx.strokeRect(b.x, b.y, b.w, b.h)
        // Windows
        ctx.fillStyle = '#f59e0b44'
        for (let wy = b.y + 8; wy < b.y + b.h - 8; wy += 14) {
          for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 14) {
            ctx.fillRect(wx, wy, 8, 8)
          }
        }
      })
    }

    const spawnParticles = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const speed = 2 + Math.random() * 4
        g.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 40, color, size: 2 + Math.random() * 3 })
      }
    }

    const spawnEnemy = () => {
      const side = Math.floor(Math.random() * 4)
      let x = 0, y = 0
      if (side === 0) { x = Math.random() * W; y = -20 }
      else if (side === 1) { x = W + 20; y = Math.random() * H }
      else if (side === 2) { x = Math.random() * W; y = H + 20 }
      else { x = -20; y = Math.random() * H }
      const type = g.wave >= 3 ? (Math.random() > 0.7 ? 'tank' : 'car') : 'car'
      const speed = (1.5 + g.wave * 0.3 + Math.random()) * (type === 'tank' ? 0.6 : 1)
      g.enemies.push({ x, y, vx: 0, vy: 0, health: type === 'tank' ? 3 : 1, type })
    }

    const spawnPickup = (x: number, y: number) => {
      if (Math.random() > 0.7) {
        g.pickups.push({ x, y, type: Math.random() > 0.5 ? 'health' : 'ammo' })
      }
    }

    const drawCar = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string, w = 22, h = 34) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(-w/2, -h/2, w, h, 4)
      ctx.fill()
      ctx.fillStyle = '#ffffff33'
      ctx.fillRect(-w/2 + 3, -h/2 + 4, w - 6, 8) // windshield
      ctx.fillStyle = '#ff000066'
      ctx.fillRect(-w/2 + 2, h/2 - 6, 7, 4)
      ctx.fillRect(w/2 - 9, h/2 - 6, 7, 4)
      // Glow
      ctx.shadowBlur = 10
      ctx.shadowColor = color
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
    }

    const shoot = () => {
      if (g.shootCooldown > 0) return
      const p = g.player
      const speed = 9
      g.bullets.push({ x: p.x + Math.sin(p.angle) * 20, y: p.y - Math.cos(p.angle) * 20, vx: Math.sin(p.angle) * speed, vy: -Math.cos(p.angle) * speed, life: 60 })
      g.shootCooldown = 8
      spawnParticles(p.x + Math.sin(p.angle) * 22, p.y - Math.cos(p.angle) * 22, '#f59e0b', 3)
    }

    let gameOver = false
    const loop = () => {
      if (!g.running) return
      const p = g.player

      // Input
      const acc = 0.3
      if (g.keys['ArrowUp'] || g.keys['w'] || g.keys['W']) { p.vx += Math.sin(p.angle) * acc; p.vy -= Math.cos(p.angle) * acc }
      if (g.keys['ArrowDown'] || g.keys['s'] || g.keys['S']) { p.vx -= Math.sin(p.angle) * acc * 0.6; p.vy += Math.cos(p.angle) * acc * 0.6 }
      if (g.keys['ArrowLeft'] || g.keys['a'] || g.keys['A']) p.angle -= 0.07
      if (g.keys['ArrowRight'] || g.keys['d'] || g.keys['D']) p.angle += 0.07
      if (g.keys[' '] || g.keys['f'] || g.keys['F']) shoot()

      // Friction
      p.vx *= 0.88; p.vy *= 0.88
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      if (speed > p.speed) { p.vx = (p.vx / speed) * p.speed; p.vy = (p.vy / speed) * p.speed }
      p.x = Math.max(20, Math.min(W - 20, p.x + p.vx))
      p.y = Math.max(20, Math.min(H - 20, p.y + p.vy))

      // Cooldown
      if (g.shootCooldown > 0) g.shootCooldown--
      if (g.invincible > 0) g.invincible--

      // Bullets
      g.bullets = g.bullets.filter(b => {
        b.x += b.vx; b.y += b.vy; b.life--
        return b.life > 0 && b.x > 0 && b.x < W && b.y > 0 && b.y < H
      })

      // Enemy spawn
      g.spawnTimer++
      const spawnRate = Math.max(40, 120 - g.wave * 15)
      if (g.spawnTimer >= spawnRate) { spawnEnemy(); g.spawnTimer = 0 }
      if (g.enemies.length === 0 && g.spawnTimer > 60) { g.wave++; spawnEnemy(); spawnEnemy() }

      // Enemies
      g.enemies.forEach(e => {
        const dx = p.x - e.x, dy = p.y - e.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0) { e.vx = (dx / dist) * (e.type === 'tank' ? 1.2 : 1.8 + g.wave * 0.1); e.vy = (dy / dist) * (e.type === 'tank' ? 1.2 : 1.8 + g.wave * 0.1) }
        e.x += e.vx; e.y += e.vy

        // Bullet collision
        g.bullets.forEach((b, bi) => {
          const bdx = b.x - e.x, bdy = b.y - e.y
          if (Math.sqrt(bdx * bdx + bdy * bdy) < 18) {
            e.health--
            g.bullets.splice(bi, 1)
            spawnParticles(e.x, e.y, e.type === 'tank' ? '#ef4444' : '#f59e0b')
            if (e.health <= 0) { p.score += e.type === 'tank' ? 50 : 10; spawnPickup(e.x, e.y); spawnParticles(e.x, e.y, '#e94560', 20) }
          }
        })

        // Player collision
        if (g.invincible === 0 && dist < 22) {
          p.health -= 15
          g.invincible = 60
          spawnParticles(p.x, p.y, '#ef4444', 12)
          if (p.health <= 0) gameOver = true
        }
      })
      g.enemies = g.enemies.filter(e => e.health > 0)

      // Pickups
      g.pickups = g.pickups.filter(pk => {
        const dx = p.x - pk.x, dy = p.y - pk.y
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          if (pk.type === 'health') p.health = Math.min(100, p.health + 25)
          spawnParticles(pk.x, pk.y, pk.type === 'health' ? '#10b981' : '#3b82f6', 10)
          return false
        }
        return true
      })

      // Particles
      g.particles.forEach(pt => { pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.9; pt.vy *= 0.9; pt.life-- })
      g.particles = g.particles.filter(pt => pt.life > 0)

      // ─── DRAW ───────────────────────────────────────────────────────────────
      drawCity()

      // Pickups
      g.pickups.forEach(pk => {
        ctx.save()
        ctx.shadowBlur = 15
        ctx.shadowColor = pk.type === 'health' ? '#10b981' : '#3b82f6'
        ctx.fillStyle = pk.type === 'health' ? '#10b981' : '#3b82f6'
        ctx.beginPath(); ctx.arc(pk.x, pk.y, 8, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(pk.type === 'health' ? '♥' : '★', pk.x, pk.y)
        ctx.restore()
      })

      // Enemies
      g.enemies.forEach(e => {
        drawCar(ctx, e.x, e.y, Math.atan2(p.x - e.x, -(p.y - e.y)), e.type === 'tank' ? '#7f1d1d' : '#e94560', e.type === 'tank' ? 28 : 20, e.type === 'tank' ? 42 : 32)
        // Health bar
        if (e.health > 1) {
          ctx.fillStyle = '#374151'
          ctx.fillRect(e.x - 15, e.y - 28, 30, 4)
          ctx.fillStyle = '#ef4444'
          ctx.fillRect(e.x - 15, e.y - 28, 30 * (e.health / 3), 4)
        }
      })

      // Bullets
      g.bullets.forEach(b => {
        ctx.save()
        ctx.shadowBlur = 8; ctx.shadowColor = '#f59e0b'
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      })

      // Particles
      g.particles.forEach(pt => {
        ctx.save()
        ctx.globalAlpha = pt.life / 40
        ctx.shadowBlur = 6; ctx.shadowColor = pt.color
        ctx.fillStyle = pt.color
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      })

      // Player car (flicker when invincible)
      if (g.invincible === 0 || Math.floor(g.invincible / 5) % 2 === 0) {
        drawCar(ctx, p.x, p.y, p.angle, '#6366f1', 22, 34)
        // Headlights
        ctx.save()
        ctx.translate(p.x, p.y); ctx.rotate(p.angle)
        ctx.shadowBlur = 20; ctx.shadowColor = '#ffffffaa'
        ctx.fillStyle = '#ffffffaa'
        ctx.fillRect(-7, -18, 5, 5); ctx.fillRect(2, -18, 5, 5)
        ctx.restore()
      }

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.roundRect(10, 10, 200, 70, 8)
      ctx.fill()
      ctx.fillStyle = '#6366f1'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`★ ${p.score}`, 20, 32)
      ctx.fillText(`🌊 Wave ${g.wave}`, 20, 52)
      ctx.fillText(`⚡ Enemies: ${g.enemies.length}`, 20, 70)
      // Health bar
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.roundRect(W - 160, 10, 150, 30, 8)
      ctx.fill()
      ctx.fillStyle = '#374151'
      ctx.fillRect(W - 150, 18, 130, 12)
      const hpColor = p.health > 50 ? '#10b981' : p.health > 25 ? '#f59e0b' : '#ef4444'
      ctx.fillStyle = hpColor
      ctx.fillRect(W - 150, 18, 130 * (p.health / 100), 12)
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`HP ${p.health}%`, W - 85, 28)

      // Controls hint
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.roundRect(10, H - 35, 280, 24, 6)
      ctx.fill()
      ctx.fillStyle = '#9ca3af'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('WASD/Arrows: Move  |  Space/F: Shoot', 16, H - 19)

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#e94560'
        ctx.font = 'bold 48px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('WASTED', W / 2, H / 2 - 40)
        ctx.fillStyle = '#f59e0b'
        ctx.font = 'bold 24px monospace'
        ctx.fillText(`Score: ${p.score}`, W / 2, H / 2 + 10)
        ctx.fillStyle = '#9ca3af'
        ctx.font = '14px monospace'
        ctx.fillText('Close and reopen to play again', W / 2, H / 2 + 50)
        g.running = false
      }

      if (g.running) g.animFrame = requestAnimationFrame(loop)
    }

    const onKey = (e: KeyboardEvent, down: boolean) => {
      g.keys[e.key] = down
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault()
    }
    window.addEventListener('keydown', e => onKey(e, true))
    window.addEventListener('keyup', e => onKey(e, false))

    g.animFrame = requestAnimationFrame(loop)
    return () => {
      g.running = false
      cancelAnimationFrame(g.animFrame)
      window.removeEventListener('keydown', e => onKey(e, true))
      window.removeEventListener('keyup', e => onKey(e, false))
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="relative">
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between px-2">
          <span className="text-sm font-bold text-[#e94560] font-mono tracking-wider">⚡ GTA: DEV CITY</span>
          <button onClick={onClose} className="text-white hover:text-red-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={520}
          className="rounded-xl border-2 border-[#e94560]/50 shadow-[0_0_60px_rgba(233,69,96,0.4)]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Contribution Heatmap (synced from account start) ────────────────────── */
function ContributionHeatmap({ contributions, createdAt }: { contributions: Record<string, number>, createdAt?: string }) {
  const [viewMode, setViewMode] = useState<'12weeks' | 'alltime'>('12weeks')
  
  const buildCells = useCallback(() => {
    const today = new Date()
    const cells: { date: string; count: number }[] = []
    
    if (viewMode === '12weeks') {
      const days = 84
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().substring(0, 10)
        cells.push({ date: key, count: contributions[key] || 0 })
      }
    } else {
      // From account creation date or 2020 as fallback
      const startDate = createdAt ? new Date(createdAt) : new Date('2020-01-01')
      const diffTime = today.getTime() - startDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      for (let i = Math.min(diffDays, 1825); i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().substring(0, 10)
        cells.push({ date: key, count: contributions[key] || 0 })
      }
    }
    return cells
  }, [viewMode, contributions, createdAt])

  const cells = buildCells()
  const max = Math.max(...cells.map(c => c.count), 1)
  const totalContribs = cells.reduce((a, c) => a + c.count, 0)
  const WEEK_SIZE = 7

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(99,102,241,0.08)'
    const intensity = count / max
    if (intensity < 0.25) return 'rgba(99,102,241,0.25)'
    if (intensity < 0.5) return 'rgba(99,102,241,0.5)'
    if (intensity < 0.75) return 'rgba(99,102,241,0.75)'
    return 'rgba(99,102,241,1)'
  }

  const weeks: { date: string; count: number }[][] = []
  for (let i = 0; i < cells.length; i += WEEK_SIZE) {
    weeks.push(cells.slice(i, i + WEEK_SIZE))
  }

  // Month labels
  const monthLabels: { label: string; weekIndex: number }[] = []
  weeks.forEach((week, wi) => {
    if (week.length > 0) {
      const d = new Date(week[0].date)
      if (d.getDate() <= 7) {
        monthLabels.push({ label: d.toLocaleString('default', { month: 'short' }), weekIndex: wi })
      }
    }
  })

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{totalContribs.toLocaleString()}</span> contributions
          {viewMode === 'alltime' && createdAt && (
            <span> since {new Date(createdAt).getFullYear()}</span>
          )}
        </div>
        <div className="flex rounded-lg border border-white/10 overflow-hidden text-[10px]">
          <button
            onClick={() => setViewMode('12weeks')}
            className={`px-3 py-1 transition-colors ${viewMode === '12weeks' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >Last 12 Weeks</button>
          <button
            onClick={() => setViewMode('alltime')}
            className={`px-3 py-1 transition-colors ${viewMode === 'alltime' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >All Time</button>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto relative group pb-4">
        {/* Month labels */}
        {viewMode === 'alltime' && monthLabels.length > 0 && (
          <div className="flex gap-1 min-w-max mb-1">
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.weekIndex === wi)
              return (
                <div key={wi} className="w-3 text-[8px] text-muted-foreground/60 text-center overflow-visible whitespace-nowrap">
                  {label ? label.label : ''}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex gap-1 min-w-max relative z-10">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) => (
                <motion.div
                  key={cell.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min((wi * 7 + di) * 0.002, 0.8), duration: 0.3 }}
                  title={`${cell.date}: ${cell.count} contributions`}
                  className="w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125 hover:z-20 relative"
                  style={{ backgroundColor: getColor(cell.count) }}
                />
              ))}
            </div>
          ))}
        </div>
                    {/* Snake animation - slithers across contribution grid */}
            {viewMode === '12weeks' && (
              <SnakeHeatmap
                contributions={contributions}
                cols={weeks.length}
                rows={7}
                cellSize={12}
                gap={3}
              />
            )}

        {/* Snake hover overlay (12 weeks mode only) */}
        {viewMode === '12weeks' && (
          <div className="absolute inset-0 z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <motion.div
              className="absolute w-3 h-3 rounded-sm bg-primary blur-[2px] shadow-[0_0_15px_rgba(99,102,241,0.8)]"
              animate={{ x: [0, 200, 200, 400, 400, 600, 600, 0], y: [0, 0, 40, 40, 80, 80, 0, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          {[0.08, 0.25, 0.5, 0.75, 1].map((o, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(99,102,241,${o})` }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, delay }: {
  icon: any
  label: string
  value: string | number
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="relative group overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}15 0%, transparent 70%)` }} />
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-black font-display" style={{ color }}>{value}</p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function GitHubSection() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameOpen, setGameOpen] = useState(false)

  useEffect(() => {
    fetch('/api/github')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setData(d)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <Github size={20} className="absolute inset-0 m-auto text-primary" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <div className="text-center">
          <Github size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">GitHub data unavailable</p>
        </div>
      </div>
    )
  }

  const totalLang = data.languages.reduce((a, l) => a + l.count, 0)

  return (
    <>
      <AnimatePresence>
        {gameOpen && <GTAGame onClose={() => setGameOpen(false)} />}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={BookOpen} label="Public Repos" value={data.stats.totalRepos} color="#6366f1" delay={0.1} />
          <StatCard icon={Star} label="Total Stars" value={data.stats.totalStars} color="#f59e0b" delay={0.2} />
          <StatCard icon={GitFork} label="Total Forks" value={data.stats.totalForks} color="#10b981" delay={0.3} />
          <StatCard icon={Users} label="Followers" value={data.stats.followers} color="#ec4899" delay={0.4} />
        </div>

        {/* Language Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Code2 size={16} className="text-primary" />
            <h4 className="font-semibold text-sm">Languages Used</h4>
          </div>
          <div className="space-y-3">
            {data.languages.map((lang, i) => {
              const pct = Math.round((lang.count / totalLang) * 100)
              const color = LANG_COLORS[lang.name] || '#6366f1'
              return (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs font-medium">{lang.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Contribution Heatmap — synced from account start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              <h4 className="font-semibold text-sm">Activity</h4>
              {data.profile.created_at && (
                <span className="text-[10px] text-muted-foreground/60 font-mono">
                  synced since {new Date(data.profile.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            {/* GTA Game Easter Egg Button */}
            <motion.button
              onClick={() => setGameOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Play GTA: Dev City"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e94560]/40 bg-[#e94560]/10 text-[#e94560] text-[10px] font-bold font-mono tracking-wider hover:bg-[#e94560]/20 transition-all"
            >
              <Gamepad2 size={12} />
              GTA MODE
            </motion.button>
                {/* GTA How To Play - collapsible details */}
                <details className="text-[10px] text-[#e94560]/70 cursor-pointer">
                  <summary className="flex items-center gap-1 px-2 py-1 rounded border border-[#e94560]/20 hover:border-[#e94560]/50 hover:text-[#e94560] transition-all list-none">
                    ❓ How to Play
                  </summary>
                  <div className="mt-2 p-3 rounded-lg bg-black/60 border border-[#e94560]/30 text-left space-y-1">
                    <p className="font-bold text-[#e94560] text-[11px] mb-2">🎮 GTA: Dev City - Controls</p>
                    <p>🔼 <span className="text-white">WASD / Arrow Keys</span> — Move your car</p>
                    <p>💥 <span className="text-white">Space / F</span> — Shoot</p>
                    <p>⭐ <span className="text-white">Eliminate enemies</span> to gain score</p>
                    <p>❤️ <span className="text-white">Red pickups</span> restore health</p>
                    <p>🔫 <span className="text-white">Yellow pickups</span> give ammo</p>
                    <p>🌊 <span className="text-white">Survive waves</span> to level up</p>
                    <p>💀 <span className="text-white">HP hits 0</span> — WASTED!</p>
                  </div>
                </details>          </div>
          <ContributionHeatmap
            contributions={data.contributions}
            createdAt={data.profile.created_at}
          />
        </motion.div>
      </div>
    </>
  )
}
