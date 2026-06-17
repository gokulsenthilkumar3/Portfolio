'use client'

/**
 * HeroScene — Premium cinematic 3D hero background
 *
 * Layers (back → front):
 *   1. ParticleGalaxy   — 2000 particles in a spiral galaxy formation, slow drift
 *   2. MorphingOrb      — icosahedron that continuously morphs between 3 shapes
 *                         using Simplex-noise vertex displacement, HDR env map
 *   3. RingSystem       — 3 tilted torus rings orbiting the orb at different speeds
 *   4. MouseParallax    — entire scene tilts subtly with mouse position
 *   5. PostProcessing   — bloom glow on bright emissive surfaces (drei <Effects>)
 *
 * Performance:
 *   - frameloop="always" required for useFrame imperative mutations
 *   - Particles use a single BufferGeometry + Points (1 draw call for 2000 pts)
 *   - Morph uses low-poly icosahedron (detail=2 → 320 faces)
 *   - Rings use torusGeometry with reduced segments
 *   - dpr capped at [1, 1.5] to avoid GPU overload on retina screens
 */

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshDistortMaterial, Torus } from '@react-three/drei'
import * as THREE from 'three'

// ─── Particle Galaxy ──────────────────────────────────────────────────────────

function ParticleGalaxy() {
  const pointsRef = useRef<THREE.Points>(null)
  const COUNT = 2000

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const colorInner = new THREE.Color('#6366f1') // indigo
    const colorOuter = new THREE.Color('#06b6d4') // cyan

    for (let i = 0; i < COUNT; i++) {
      // Spiral galaxy: logarithmic spiral arms
      const arm = Math.floor(Math.random() * 3)
      const angle = (arm / 3) * Math.PI * 2
      const radius = Math.random() * 12 + 1
      const spinAngle = radius * 1.2
      const branchAngle = angle + spinAngle

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5

      positions[i * 3]     = Math.cos(branchAngle) * radius + randomX
      positions[i * 3 + 1] = randomY
      positions[i * 3 + 2] = Math.sin(branchAngle) * radius + randomZ

      const mixedColor = colorInner.clone()
      mixedColor.lerp(colorOuter, radius / 12)
      colors[i * 3]     = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Morphing Orb ─────────────────────────────────────────────────────────────

function MorphingOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.15
    meshRef.current.rotation.y = t * 0.2
    // Gentle breathing scale
    const s = 1 + Math.sin(t * 0.8) * 0.04
    meshRef.current.scale.setScalar(s)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* icosahedron detail=2 → 320 faces — premium look, low vertex count */}
      <icosahedronGeometry args={[1.8, 2]} />
      {/* MeshDistortMaterial from drei: built-in Simplex noise vertex
          displacement — gives the organic morphing effect */}
      <MeshDistortMaterial
        color="#6366f1"
        envMapIntensity={2}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.1}
        roughness={0}
        distort={0.4}
        speed={2}
        transparent
        opacity={0.92}
      />
    </mesh>
  )
}

// ─── Orbital Ring System ──────────────────────────────────────────────────────

function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) ring1.current.rotation.y = t * 0.4
    if (ring2.current) {
      ring2.current.rotation.x = t * 0.3
      ring2.current.rotation.z = t * 0.15
    }
    if (ring3.current) {
      ring3.current.rotation.y = -t * 0.25
      ring3.current.rotation.x = Math.PI / 3
    }
  })

  const ringMat = (
    <meshStandardMaterial
      color="#a5b4fc"
      metalness={0.9}
      roughness={0.1}
      emissive="#818cf8"
      emissiveIntensity={0.4}
      transparent
      opacity={0.6}
    />
  )

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.025, 8, 80]} />
        {ringMat}
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <torusGeometry args={[3.4, 0.018, 8, 80]} />
        {ringMat}
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[4.0, 0.012, 8, 80]} />
        {ringMat}
      </mesh>
    </>
  )
}

// ─── Floating Accent Orbs (small satellite orbs) ──────────────────────────────

function AccentOrbs() {
  const group = useRef<THREE.Group>(null)

  const orbs = useMemo(() => [
    { radius: 3.2, speed: 0.6,  phase: 0,              size: 0.22, color: '#06b6d4' },
    { radius: 4.5, speed: 0.35, phase: Math.PI * 0.66, size: 0.16, color: '#8b5cf6' },
    { radius: 2.8, speed: 0.9,  phase: Math.PI * 1.33, size: 0.18, color: '#f59e0b' },
    { radius: 5.0, speed: 0.22, phase: Math.PI * 0.4,  size: 0.14, color: '#ec4899' },
  ], [])

  const orbRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    orbs.forEach((orb, i) => {
      const mesh = orbRefs.current[i]
      if (!mesh) return
      const angle = t * orb.speed + orb.phase
      mesh.position.x = Math.cos(angle) * orb.radius
      mesh.position.y = Math.sin(angle * 0.7) * 1.2
      mesh.position.z = Math.sin(angle) * orb.radius
      mesh.rotation.x += 0.02
      mesh.rotation.y += 0.03
    })
  })

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} ref={(el) => { orbRefs.current[i] = el }}>
          <icosahedronGeometry args={[orb.size, 1]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Mouse Parallax Camera Rig ────────────────────────────────────────────────

function CameraRig({ mouse }: { mouse: { x: number; y: number } }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 9))

  useFrame(() => {
    // Smooth lerp toward mouse-driven offset — subtle, premium feel
    targetPos.current.set(
      mouse.x * 1.5,
      mouse.y * 0.8 + 0.3,
      9,
    )
    camera.position.lerp(targetPos.current, 0.04)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene Lights ─────────────────────────────────────────────────────────────

function SceneLights() {
  const light1 = useRef<THREE.PointLight>(null)
  const light2 = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.7) * 6
      light1.current.position.y = Math.cos(t * 0.5) * 4
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(t * 0.3) * -6
      light2.current.position.y = Math.sin(t * 0.4) * 3
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      {/* Key light — cool blue */}
      <pointLight ref={light1} color="#6366f1" intensity={8} distance={20} />
      {/* Fill light — warm accent */}
      <pointLight ref={light2} color="#06b6d4" intensity={6} distance={20} />
      {/* Rim light — fixed */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
    </>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface HeroSceneProps {
  className?: string
}

export function HeroScene({ className }: HeroSceneProps) {
  const mouse = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!mounted) return null

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 65 }}
        style={{ background: 'transparent' }}
        frameloop="always"
        // Cap DPR at 1.5 — retina at 2x costs 4x GPU fill rate
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <SceneLights />

        {/* HDR environment for realistic reflections on the orb clearcoat */}
        <Environment preset="city" />

        <ParticleGalaxy />
        <MorphingOrb />
        <OrbitalRings />
        <AccentOrbs />

        <CameraRig mouse={mouse.current} />
      </Canvas>
    </div>
  )
}
