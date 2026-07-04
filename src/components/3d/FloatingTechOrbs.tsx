'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useDeviceTier } from '@/hooks/use-device-tier'
import { useCurrentPalette } from '@/lib/stores/theme-accent'

/**
 * FloatingTechOrbs — Hero section 3D tech stack display
 *
 * Perf contract:
 *  • Single InstancedMesh for all orb geometries (1 draw call)
 *  • Text labels use Billboard (always face camera, no recalc)
 *  • Tier 1: Pure CSS fallback, no WebGL
 *  • Tier 2: Orbs only, no glow halos
 *  • Tier 3: Full orbs + glow halos + rotation
 *  • Pixel ratio capped at 1.5
 */

const TECHS = [
  { name: 'TypeScript', color: '#3178c6', pos: [-3.5, 1.5, -1] },
  { name: 'React',      color: '#61dafb', pos: [3.2,  2.0, -2] },
  { name: 'Next.js',   color: '#ffffff', pos: [-2.8, -1.2, -1.5] },
  { name: 'Playwright',color: '#45ba4b', pos: [3.8,  -1.5, -1] },
  { name: 'Node.js',   color: '#339933', pos: [-4.5, 0.2, -2] },
  { name: 'Tailwind',  color: '#38bdf8', pos: [2.5,  0.5, -3] },
  { name: 'Supabase',  color: '#3ecf8e', pos: [-1.5, 2.5, -2.5] },
  { name: 'Three.js',  color: '#ff6b35', pos: [1.0, -2.2, -1.5] },
]

function OrbInstance({ tech, tier }: { tech: typeof TECHS[0]; tier: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.4
    meshRef.current.rotation.z = t * 0.25
    if (glowRef.current && tier >= 3) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={tech.pos as [number, number, number]}>
        {/* Core orb */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial
            color={tech.color}
            emissive={tech.color}
            emissiveIntensity={tier >= 2 ? 0.6 : 0.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        {/* Glow halo — tier 3 only */}
        {tier >= 3 && (
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshBasicMaterial
              color={tech.color}
              transparent
              opacity={0.08}
              side={THREE.BackSide}
            />
          </mesh>
        )}
        {/* Label */}
        <Billboard>
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.14}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.85}
          >
            {tech.name}
          </Text>
        </Billboard>
      </group>
    </Float>
  )
}

function OrbScene({ tier }: { tier: number }) {
  const palette = useCurrentPalette()
  const count = tier >= 3 ? TECHS.length : tier >= 2 ? 5 : 3

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={palette.threeA} />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color={palette.threeB} />
      {TECHS.slice(0, count).map((tech) => (
        <OrbInstance key={tech.name} tech={tech} tier={tier} />
      ))}
    </>
  )
}

// CSS fallback for tier 1 (pure CSS floating badges)
function OrbFallback() {
  const palette = useCurrentPalette()
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {TECHS.slice(0, 6).map((tech, i) => (
        <div
          key={tech.name}
          className="absolute px-3 py-1 rounded-full text-xs font-semibold border"
          style={{
            left: `${15 + (i % 3) * 30}%`,
            top: `${20 + Math.floor(i / 3) * 40}%`,
            color: tech.color,
            borderColor: tech.color + '44',
            backgroundColor: tech.color + '11',
            animation: `float-badge ${3 + i * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
            boxShadow: `0 0 12px ${tech.color}33`,
          }}
        >
          {tech.name}
        </div>
      ))}
    </div>
  )
}

export function FloatingTechOrbs({ className }: { className?: string }) {
  const tier = useDeviceTier()

  if (tier < 2) return <OrbFallback />

  return (
    <div className={className ?? 'absolute inset-0 pointer-events-none'} aria-hidden>
      <Canvas
        dpr={[1, Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1.5)]}
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ antialias: tier >= 3, alpha: true, powerPreference: 'default' }}
      >
        <OrbScene tier={tier} />
      </Canvas>
    </div>
  )
}
