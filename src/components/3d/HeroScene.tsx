'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'

function DNAStrand() {
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

  return (
    <group ref={groupRef} position={[5, 0, -3]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#6366f1' : '#ec4899'}
            emissive={i % 2 === 0 ? '#6366f1' : '#ec4899'}
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function CentralOrb() {
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
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#a78bfa"
          emissive="#a78bfa"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[3.0, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  )
}

function TechCube({ position, color, scale = 1, speed = 1 }: {
  position: [number, number, number]
  color: string
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
          emissiveIntensity={0.4}
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
          opacity={0.2}
        />
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 2000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const palette = [
      [0.39, 0.4, 0.95],
      [0.92, 0.28, 0.6],
      [0.67, 0.55, 0.98],
      [0.06, 0.73, 0.51],
    ]
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }
    return { positions, colors }
  }, [])

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
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
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
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <DynamicLights />
        <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        <ParticleField />
        <CentralOrb />
        <DNAStrand />
        <TechCube position={[-5, 2, -1]} color="#6366f1" scale={0.4} speed={0.8} />
        <TechCube position={[-4, -2, -2]} color="#ec4899" scale={0.6} speed={1.2} />
        <TechCube position={[4, 3, -2]} color="#10b981" scale={0.35} speed={0.6} />
        <TechCube position={[-6, 0, -3]} color="#f59e0b" scale={0.5} speed={1.4} />
        <TechCube position={[2, -3, -1]} color="#a78bfa" scale={0.45} speed={0.9} />
        <Sparkles count={120} scale={12} size={1.5} speed={0.3} color="#a78bfa" opacity={0.6} />
        <Sparkles count={60} scale={8} size={2} speed={0.5} color="#ec4899" opacity={0.4} />
      </Canvas>
    </div>
  )
}
