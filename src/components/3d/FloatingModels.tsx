'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({ position, color, geometry }: { 
  position: [number, number, number]
  color: string
  geometry: 'box' | 'sphere' | 'torus' | 'cone'
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001
      meshRef.current.rotation.y += 0.002
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
    }
  })

  const GeometryComponent = useMemo(() => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 32]} />
      case 'cone':
        return <coneGeometry args={[0.5, 1, 32]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }, [geometry])

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {GeometryComponent}
        <meshStandardMaterial 
          color={color} 
          metalness={0.4}
          roughness={0.5}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

interface FloatingModelsProps {
  className?: string
  theme?: 'dark' | 'light' | 'neon' | 'pastel' | 'cyberpunk'
}

export function FloatingModels({ className, theme = 'dark' }: FloatingModelsProps) {
  const shapes = useMemo(() => [
    { position: [-4, 2, -2] as [number, number, number], color: '#3b82f6', geometry: 'box' as const },
    { position: [4, -1, -3] as [number, number, number], color: '#8b5cf6', geometry: 'sphere' as const },
    { position: [0, 3, -1] as [number, number, number], color: '#ec4899', geometry: 'torus' as const },
    { position: [-2, -2, -2] as [number, number, number], color: '#10b981', geometry: 'cone' as const },
    { position: [3, 4, -4] as [number, number, number], color: '#f59e0b', geometry: 'box' as const },
  ], [])

  const getThemeColors = () => {
    switch (theme) {
      case 'neon':
        return { fog: '#1a0033', ambient: 0.2 }
      case 'pastel':
        return { fog: '#fef3c7', ambient: 0.6 }
      case 'cyberpunk':
        return { fog: '#0a0a0a', ambient: 0.3 }
      case 'light':
        return { fog: '#f8fafc', ambient: 0.7 }
      default:
        return { fog: '#0f172a', ambient: 0.4 }
    }
  }

  const themeColors = getThemeColors()

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={themeColors.ambient} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <fog attach="fog" args={[themeColors.fog, 10, 50]} />
        
        {shapes.map((shape, index) => (
          <FloatingShape
            key={index}
            position={shape.position}
            color={shape.color}
            geometry={shape.geometry}
          />
        ))}
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
