'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeGate } from './ThreeGate'
import { useThemeStore } from '@/lib/hooks/use-theme'

function DNAStrand({ theme }: { theme: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const count = 30
  
  const positions = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4
      pts.push([Math.sin(t) * 1.2, (i / count) * 8 - 4, Math.cos(t) * 1.2])
    }
    return pts
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  // In light mode, use deeper, bolder colors
  const color1 = theme === 'light' ? '#4338ca' : '#6366f1' // Deeper indigo
  const color2 = theme === 'light' ? '#be185d' : '#ec4899' // Deeper pink

  return (
    <group ref={groupRef} position={[5, 0, -3]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color1 : color2}
            emissive={i % 2 === 0 ? color1 : color2}
            emissiveIntensity={theme === 'light' ? 0.3 : 0.8}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function CentralOrb({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.8, 4]} />
        <MeshDistortMaterial
          color={theme === 'light' ? '#3730a3' : '#6366f1'}
          emissive={theme === 'light' ? '#312e81' : '#4338ca'}
          emissiveIntensity={theme === 'light' ? 0.2 : 0.5}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
          transparent
          opacity={theme === 'light' ? 0.6 : 0.85}
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.03, 16, 100]} />
        <meshStandardMaterial
          color={theme === 'light' ? '#5b21b6' : '#a78bfa'}
          emissive={theme === 'light' ? '#5b21b6' : '#a78bfa'}
          emissiveIntensity={theme === 'light' ? 0.5 : 2}
          transparent
          opacity={theme === 'light' ? 0.4 : 0.6}
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[3.0, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={theme === 'light' ? '#9d174d' : '#ec4899'}
          emissive={theme === 'light' ? '#9d174d' : '#ec4899'}
          emissiveIntensity={theme === 'light' ? 0.5 : 1.5}
          transparent
          opacity={theme === 'light' ? 0.3 : 0.4}
        />
      </mesh>
    </Float>
  )
}

function TechCube({ position, color, theme, scale = 1, speed = 1 }: {
  position: [number, number, number]
  color: string
  theme: string
  scale?: number
  speed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.4
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.6
    }
  })

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={theme === 'light' ? 0.1 : 0.4}
          metalness={0.9}
          roughness={0.05}
        />
      </mesh>
      <mesh position={position} scale={scale * 1.05}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={theme === 'light' ? 0.4 : 0.2}
        />
      </mesh>
    </Float>
  )
}

function ParticleField({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  
  const { positions, colors } = useMemo(() => {
    const count = 3000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    // Use darker palette for light mode to improve visibility
    const palette = theme === 'light' ? [
      [0.2, 0.2, 0.7],  // Darker indigo
      [0.7, 0.1, 0.4],  // Darker pink
      [0.4, 0.3, 0.7],  // Darker purple
      [0.0, 0.4, 0.3],  // Darker green
    ] : [
      [0.39, 0.4, 0.95],
      [0.92, 0.28, 0.6],
      [0.67, 0.55, 0.98],
      [0.06, 0.73, 0.51],
    ]
    
    // Calculate dynamic spread based on viewport. Multiply by 1.5 to ensure it spans off-screen edges
    const spreadX = Math.max(viewport.width * 1.5, 40)
    const spreadY = Math.max(viewport.height * 1.5, 30)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spreadX
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }
    return { positions, colors }
  }, [theme, viewport.width, viewport.height])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={theme === 'light' ? 0.09 : 0.06} // slightly larger particles in light mode
        vertexColors
        transparent
        opacity={theme === 'light' ? 0.9 : 0.8}
        sizeAttenuation
      />
    </points>
  )
}

function DynamicLights() {
  const light1 = useRef<THREE.PointLight>(null)
  const light2 = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (light1.current) {
      light1.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 1.5) * 1
      light1.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
      light1.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 3
    }
    if (light2.current) {
      light2.current.intensity = 1.5 + Math.cos(state.clock.elapsedTime * 2) * 0.8
      light2.current.position.x = Math.cos(state.clock.elapsedTime * 0.4) * -5
      light2.current.position.z = Math.sin(state.clock.elapsedTime * 0.6) * 3
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={light1} position={[5, 5, 5]} color="#6366f1" intensity={3} />
      <pointLight ref={light2} position={[-5, -3, 3]} color="#ec4899" intensity={2} />
      <pointLight position={[0, 8, -2]} color="#10b981" intensity={1.5} />
      <pointLight position={[0, -8, -2]} color="#f59e0b" intensity={1} />
    </>
  )
}

export interface HeroSceneProps {
  className?: string
}

export function HeroScene({ className }: HeroSceneProps) {
  const { theme } = useThemeStore()

  return (
    <ThreeGate className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <DynamicLights />
        <Stars radius={120} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} color={theme === 'light' ? '#333333' : '#ffffff'} />
        <ParticleField theme={theme} />
        <CentralOrb theme={theme} />
        <DNAStrand theme={theme} />
        <TechCube theme={theme} position={[-5, 2, -1]} color={theme === 'light' ? '#3730a3' : '#6366f1'} scale={0.4} speed={0.8} />
        <TechCube theme={theme} position={[-4, -2, -2]} color={theme === 'light' ? '#be185d' : '#ec4899'} scale={0.6} speed={1.2} />
        <TechCube theme={theme} position={[4, 3, -2]} color={theme === 'light' ? '#047857' : '#10b981'} scale={0.35} speed={0.6} />
        <TechCube theme={theme} position={[-6, 0, -3]} color={theme === 'light' ? '#b45309' : '#f59e0b'} scale={0.5} speed={1.4} />
        <TechCube theme={theme} position={[2, -3, -1]} color={theme === 'light' ? '#5b21b6' : '#a78bfa'} scale={0.45} speed={0.9} />
        <Sparkles count={120} scale={12} size={1.5} speed={0.3} color={theme === 'light' ? '#5b21b6' : '#a78bfa'} opacity={theme === 'light' ? 0.9 : 0.6} />
        <Sparkles count={60} scale={8} size={2} speed={0.5} color={theme === 'light' ? '#be185d' : '#ec4899'} opacity={theme === 'light' ? 0.8 : 0.4} />
      </Canvas>
    </ThreeGate>
  )
}
