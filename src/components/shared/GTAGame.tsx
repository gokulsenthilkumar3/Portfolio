'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface GTAGameProps {
  onClose: () => void
}

/**
 * Commit City — extracted out of GitHubSection so it is only downloaded
 * when the player clicks the button (lazy dynamic import).
 */
export function GTAGame({ onClose }: GTAGameProps) {
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
    running: false, animFrame: 0,
    player: { x: 400, y: 300, vx: 0, vy: 0, angle: 0, speed: 3.5, health: 100, score: 0 },
    bullets: [], enemies: [], particles: [], pickups: [],
    keys: {}, wave: 1, spawnTimer: 0, shootCooldown: 0, invincible: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const g = gameRef.current

    g.running = true
    g.player = { x: W / 2, y: H / 2, vx: 0, vy: 0, angle: 0, speed: 3.5, health: 100, score: 0 }
    g.bullets = []; g.enemies = []; g.particles = []; g.pickups = []
    g.wave = 1; g.spawnTimer = 0; g.shootCooldown = 0; g.invincible = 0

    const TILE = 60
    const drawCity = () => {
      ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#16213e'; ctx.lineWidth = TILE
      for (let x = TILE * 2; x < W; x += TILE * 4) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = TILE * 2; y < H; y += TILE * 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
      ctx.strokeStyle = '#f59e0b33'; ctx.lineWidth = 2; ctx.setLineDash([20, 15])
      for (let x = TILE * 2; x < W; x += TILE * 4) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = TILE * 2; y < H; y += TILE * 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
      ctx.setLineDash([])
      const buildings = [
        {x:20,y:20,w:80,h:80},{x:120,y:20,w:60,h:70},{x:220,y:20,w:90,h:85},
        {x:20,y:130,w:70,h:60},{x:20,y:220,w:75,h:80},{x:W-100,y:20,w:80,h:90},
        {x:W-180,y:20,w:60,h:65},{x:W-100,y:140,w:80,h:70},{x:20,y:H-100,w:90,h:80},
        {x:W-100,y:H-100,w:80,h:80},{x:W-100,y:H-200,w:70,h:80},
        {x:150,y:H-100,w:80,h:80},{x:W-250,y:H-100,w:70,h:75},
      ]
      buildings.forEach(b => {
        ctx.fillStyle = '#0f3460'; ctx.fillRect(b.x, b.y, b.w, b.h)
        ctx.strokeStyle = '#e94560'; ctx.lineWidth = 1; ctx.strokeRect(b.x, b.y, b.w, b.h)
        ctx.fillStyle = '#f59e0b44'
        for (let wy = b.y + 8; wy < b.y + b.h - 8; wy += 14)
          for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 14)
            ctx.fillRect(wx, wy, 8, 8)
      })
    }

    const spawnParticles = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const s = 2 + Math.random() * 4
        g.particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 40, color, size: 2+Math.random()*3 })
      }
    }

    const spawnEnemy = () => {
      const side = Math.floor(Math.random() * 4)
      const x = side === 1 ? W+20 : side === 3 ? -20 : Math.random() * W
      const y = side === 0 ? -20  : side === 2 ? H+20 : Math.random() * H
      const type = g.wave >= 3 && Math.random() > 0.7 ? 'tank' : 'car'
      g.enemies.push({ x, y, vx: 0, vy: 0, health: type === 'tank' ? 3 : 1, type })
    }

    const drawCar = (x: number, y: number, angle: number, color: string, w = 22, h = 34) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle)
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(-w/2, -h/2, w, h, 4); ctx.fill()
      ctx.fillStyle = '#ffffff33'; ctx.fillRect(-w/2+3, -h/2+4, w-6, 8)
      ctx.fillStyle = '#ff000066'; ctx.fillRect(-w/2+2, h/2-6, 7, 4); ctx.fillRect(w/2-9, h/2-6, 7, 4)
      ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke()
      ctx.restore()
    }

    const shoot = () => {
      if (g.shootCooldown > 0) return
      const p = g.player, speed = 9
      g.bullets.push({ x: p.x+Math.sin(p.angle)*20, y: p.y-Math.cos(p.angle)*20, vx: Math.sin(p.angle)*speed, vy: -Math.cos(p.angle)*speed, life: 60 })
      g.shootCooldown = 8
    }

    let gameOver = false
    const loop = () => {
      if (!g.running) return
      const p = g.player, acc = 0.3
      if (g.keys['ArrowUp']||g.keys['w']||g.keys['W'])    { p.vx+=Math.sin(p.angle)*acc;    p.vy-=Math.cos(p.angle)*acc }
      if (g.keys['ArrowDown']||g.keys['s']||g.keys['S'])  { p.vx-=Math.sin(p.angle)*acc*.6; p.vy+=Math.cos(p.angle)*acc*.6 }
      if (g.keys['ArrowLeft']||g.keys['a']||g.keys['A'])  p.angle-=0.07
      if (g.keys['ArrowRight']||g.keys['d']||g.keys['D']) p.angle+=0.07
      if (g.keys[' ']||g.keys['f']||g.keys['F'])          shoot()
      p.vx*=0.88; p.vy*=0.88
      const spd = Math.sqrt(p.vx*p.vx+p.vy*p.vy)
      if (spd>p.speed) { p.vx=(p.vx/spd)*p.speed; p.vy=(p.vy/spd)*p.speed }
      p.x=Math.max(20,Math.min(W-20,p.x+p.vx)); p.y=Math.max(20,Math.min(H-20,p.y+p.vy))
      if (g.shootCooldown>0) g.shootCooldown--
      if (g.invincible>0)    g.invincible--
      g.bullets = g.bullets.filter(b => { b.x+=b.vx; b.y+=b.vy; b.life--; return b.life>0&&b.x>0&&b.x<W&&b.y>0&&b.y<H })
      g.spawnTimer++
      const spawnRate = Math.max(40, 120 - g.wave * 15)
      if (g.spawnTimer>=spawnRate) { spawnEnemy(); g.spawnTimer=0 }
      if (!g.enemies.length && g.spawnTimer>60) { g.wave++; spawnEnemy(); spawnEnemy() }
      g.enemies.forEach(e => {
        const dx=p.x-e.x, dy=p.y-e.y, dist=Math.sqrt(dx*dx+dy*dy)
        if (dist>0) { const s=e.type==='tank'?1.2:1.8+g.wave*0.1; e.vx=(dx/dist)*s; e.vy=(dy/dist)*s }
        e.x+=e.vx; e.y+=e.vy
        g.bullets.forEach((b,bi) => {
          if (Math.hypot(b.x-e.x,b.y-e.y)<18) {
            e.health--; g.bullets.splice(bi,1)
            spawnParticles(e.x,e.y,e.type==='tank'?'#ef4444':'#f59e0b')
            if (e.health<=0) { p.score+=e.type==='tank'?50:10; spawnParticles(e.x,e.y,'#e94560',20) }
          }
        })
        if (g.invincible===0 && dist<22) { p.health-=15; g.invincible=60; spawnParticles(p.x,p.y,'#ef4444',12); if (p.health<=0) gameOver=true }
      })
      g.enemies = g.enemies.filter(e => e.health>0)
      g.pickups = g.pickups.filter(pk => {
        if (Math.hypot(p.x-pk.x,p.y-pk.y)<20) {
          if (pk.type==='health') p.health=Math.min(100,p.health+25)
          spawnParticles(pk.x,pk.y,pk.type==='health'?'#10b981':'#3b82f6',10)
          return false
        }
        return true
      })
      g.particles.forEach(pt => { pt.x+=pt.vx; pt.y+=pt.vy; pt.vx*=0.9; pt.vy*=0.9; pt.life-- })
      g.particles = g.particles.filter(pt => pt.life>0)

      drawCity()
      g.pickups.forEach(pk => {
        ctx.save(); ctx.shadowBlur=15; ctx.shadowColor=pk.type==='health'?'#10b981':'#3b82f6'
        ctx.fillStyle=pk.type==='health'?'#10b981':'#3b82f6'
        ctx.beginPath(); ctx.arc(pk.x,pk.y,8,0,Math.PI*2); ctx.fill()
        ctx.fillStyle='#fff'; ctx.font='bold 10px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText(pk.type==='health'?'♥':'★',pk.x,pk.y); ctx.restore()
      })
      g.enemies.forEach(e => {
        drawCar(e.x,e.y,Math.atan2(p.x-e.x,-(p.y-e.y)),e.type==='tank'?'#7f1d1d':'#e94560',e.type==='tank'?28:20,e.type==='tank'?42:32)
        if (e.health>1) {
          ctx.fillStyle='#374151'; ctx.fillRect(e.x-15,e.y-28,30,4)
          ctx.fillStyle='#ef4444'; ctx.fillRect(e.x-15,e.y-28,30*(e.health/3),4)
        }
      })
      g.bullets.forEach(b => {
        ctx.save(); ctx.shadowBlur=8; ctx.shadowColor='#f59e0b'; ctx.fillStyle='#fbbf24'
        ctx.beginPath(); ctx.arc(b.x,b.y,3,0,Math.PI*2); ctx.fill(); ctx.restore()
      })
      g.particles.forEach(pt => {
        ctx.save(); ctx.globalAlpha=pt.life/40; ctx.shadowBlur=6; ctx.shadowColor=pt.color
        ctx.fillStyle=pt.color; ctx.beginPath(); ctx.arc(pt.x,pt.y,pt.size,0,Math.PI*2); ctx.fill(); ctx.restore()
      })
      if (g.invincible===0||Math.floor(g.invincible/5)%2===0) {
        drawCar(p.x,p.y,p.angle,'#6366f1')
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle)
        ctx.shadowBlur=20; ctx.shadowColor='#ffffffaa'; ctx.fillStyle='#ffffffaa'
        ctx.fillRect(-7,-18,5,5); ctx.fillRect(2,-18,5,5); ctx.restore()
      }
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.roundRect(10,10,200,70,8); ctx.fill()
      ctx.fillStyle='#6366f1'; ctx.font='bold 14px monospace'; ctx.textAlign='left'
      ctx.fillText(`★ ${p.score}`,20,32); ctx.fillText(`🌊 Wave ${g.wave}`,20,52); ctx.fillText(`⚡ Enemies: ${g.enemies.length}`,20,70)
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.roundRect(W-160,10,150,30,8); ctx.fill()
      ctx.fillStyle='#374151'; ctx.fillRect(W-150,18,130,12)
      const hpColor=p.health>50?'#10b981':p.health>25?'#f59e0b':'#ef4444'
      ctx.fillStyle=hpColor; ctx.fillRect(W-150,18,130*(p.health/100),12)
      ctx.fillStyle='#fff'; ctx.font='10px monospace'; ctx.textAlign='center'; ctx.fillText(`HP ${p.health}%`,W-85,28)
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.roundRect(10,H-35,280,24,6); ctx.fill()
      ctx.fillStyle='#9ca3af'; ctx.font='10px monospace'; ctx.textAlign='left'
      ctx.fillText('WASD/Arrows: Move  |  Space/F: Shoot',16,H-19)
      if (gameOver) {
        ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillRect(0,0,W,H)
        ctx.fillStyle='#e94560'; ctx.font='bold 48px monospace'; ctx.textAlign='center'; ctx.fillText('WASTED',W/2,H/2-40)
        ctx.fillStyle='#f59e0b'; ctx.font='bold 24px monospace'; ctx.fillText(`Score: ${p.score}`,W/2,H/2+10)
        ctx.fillStyle='#9ca3af'; ctx.font='14px monospace'; ctx.fillText('Close and reopen to play again',W/2,H/2+50)
        g.running=false
      }
      if (g.running) g.animFrame=requestAnimationFrame(loop)
    }

    const onKey = (e: KeyboardEvent, down: boolean) => {
      g.keys[e.key]=down
      if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault()
    }
    const kd = (e: KeyboardEvent) => onKey(e, true)
    const ku = (e: KeyboardEvent) => onKey(e, false)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    g.animFrame=requestAnimationFrame(loop)
    return () => {
      g.running=false
      cancelAnimationFrame(g.animFrame)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
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
          <span className="text-sm font-bold text-[#e94560] font-mono tracking-wider">⚡ COMMIT CITY</span>
          <button onClick={onClose} aria-label="Close game" className="text-white hover:text-red-400 transition-colors">
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
        <p className="absolute -bottom-8 left-0 right-0 text-center text-[10px] text-muted-foreground/60 font-mono">
          WASD / Arrows: Move &nbsp;|&nbsp; Space / F: Shoot
        </p>
      </div>
    </motion.div>
  )
}
