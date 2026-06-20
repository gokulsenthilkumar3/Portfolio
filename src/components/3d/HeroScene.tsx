'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeGate } from './ThreeGate'
import { useThemeStore } from '@/lib/hooks/use-theme'

import { VolumetricEnvironment } from './VolumetricEnvironment'
import { MeshTransmissionMaterial, Text } from '@react-three/drei'

function DNAStrand({ theme }: { theme: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const count = 30
  
  const positions = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4
      pts.push([Math.sin(t) * 1.5, (i / count) * 10 - 5, Math.cos(t) * 1.5])
    }
    return pts
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  const color1 = theme === 'light' ? '#4338ca' : '#8b5cf6' 
  const color2 = theme === 'light' ? '#be185d' : '#ec4899' 

  return (
    <group ref={groupRef} position={[6, 0, -4]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color1 : color2}
            emissive={i % 2 === 0 ? color1 : color2}
            emissiveIntensity={1.2}
            metalness={0.9}
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
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[2.2, 16]} />
        <MeshTransmissionMaterial
          background={new THREE.Color(theme === 'light' ? '#f8fafc' : '#050510')}
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={1}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color={theme === 'light' ? '#a5b4fc' : '#c4b5fd'}
        />
      </mesh>
      {/* Inner energy core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <MeshDistortMaterial 
          color="#ec4899" 
          emissive="#ec4899" 
          emissiveIntensity={2} 
          distort={0.4} 
          speed={3} 
        />
      </mesh>
      {/* Orbiting rings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
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
    <Float speed={speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          samples={4}
          thickness={0.5}
          chromaticAberration={0.5}
          roughness={0.1}
          color={color}
        />
      </mesh>
      <mesh position={position} scale={scale * 0.5}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </Float>
  )
}

function ParticleField({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  
  const { positions, colors } = useMemo(() => {
    const count = 5000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    const palette = [
      [0.39, 0.4, 0.95],
      [0.92, 0.28, 0.6],
      [0.67, 0.55, 0.98],
      [0.06, 0.73, 0.51],
    ]
    
    const spreadX = Math.max(viewport.width * 2, 60)
    const spreadY = Math.max(viewport.height * 2, 40)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spreadX
      positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }
    return { positions, colors }
  }, [viewport.width, viewport.height])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
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
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <VolumetricEnvironment theme={theme} />
        <ParticleField theme={theme} />
        <CentralOrb theme={theme} />
        <DNAStrand theme={theme} />
        <TechCube theme={theme} position={[-5, 2, 2]} color="#8b5cf6" scale={0.8} speed={0.8} />
        <TechCube theme={theme} position={[-4, -3, -1]} color="#ec4899" scale={1.2} speed={1.2} />
        <TechCube theme={theme} position={[5, 4, -2]} color="#10b981" scale={0.7} speed={0.6} />
        <TechCube theme={theme} position={[-7, 0, -4]} color="#f59e0b" scale={1.0} speed={1.4} />
        <TechCube theme={theme} position={[3, -4, 1]} color="#0ea5e9" scale={0.9} speed={0.9} />
      </Canvas>
    </ThreeGate>
  )
}
