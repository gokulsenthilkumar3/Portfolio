'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'
import { ThreeGate } from './ThreeGate'

interface SkillNodeProps {
  skill: Skill
  position: [number, number, number]
  isSelected: boolean
  onClick: (skill: Skill) => void
  onHover: (skill: Skill | null) => void
}

function SkillNode({
  skill,
  position,
  isSelected,
  onClick,
  onHover,
}: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const color = useMemo(() => {
    if (isSelected) return '#ffffff'
    if (hovered) return skill.color || '#3b82f6'
    return skill.color ? skill.color + '80' : '#3b82f680'
  }, [isSelected, hovered, skill.color])

  const scale = useMemo(() => {
    const baseScale = 0.3 + skill.proficiency * 0.1
    return isSelected ? baseScale * 1.5 : hovered ? baseScale * 1.2 : baseScale
  }, [isSelected, hovered, skill.proficiency])

  // NOTE: frameloop="always" is required — see FloatingModels.tsx for the
  // full explanation. useFrame imperatively mutates mesh.rotation; demand
  // mode never re-renders from these mutations.
  useFrame(() => {
    if (meshRef.current && !isSelected) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onClick(skill)
  }

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHovered(true)
    onHover(skill)
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover(null)
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={scale}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.2}
        />
      </mesh>
      
      <Html center className="pointer-events-none" zIndexRange={[100, 0]}>
        <div 
          className="whitespace-nowrap font-display font-medium tracking-wide transition-all duration-300 bg-slate-900/60 px-2 py-1 rounded backdrop-blur-sm border border-white/10"
          style={{ 
            color: isSelected ? '#ffffff' : (skill.color || '#ffffff'),
            fontSize: isSelected ? '1.25rem' : hovered ? '1.1rem' : '0.85rem',
            opacity: isSelected || hovered ? 1 : 0.7,
            transform: `translate3d(-50%, ${isSelected || hovered ? '-30px' : '-20px'}, 0)`
          }}
        >
          {skill.name}
        </div>
      </Html>
    </group>
  )
}



interface SkillSphereProps {
  onSkillSelect?: (skill: Skill) => void
  selectedCategory?: string
  className?: string
}

export function SkillSphere({
  onSkillSelect,
  selectedCategory,
  className,
}: SkillSphereProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  const filteredSkills = useMemo(() => {
    if (!selectedCategory) return skills.slice(0, 20)
    return getSkillsByCategory(skills, selectedCategory as any).slice(0, 15)
  }, [selectedCategory])

  const skillPositions = useMemo(() => {
    // Increase radius from 5 to 8 for better spacing
    const radius = 8
    return filteredSkills.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / filteredSkills.length)
      const theta = Math.sqrt(filteredSkills.length * Math.PI) * phi
      return [
        Math.cos(theta) * Math.sin(phi) * radius,
        Math.sin(theta) * Math.sin(phi) * radius,
        Math.cos(phi) * radius,
      ] as [number, number, number]
    })
  }, [filteredSkills])

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
    onSkillSelect?.(skill)
  }

  const handleSkillHover = (skill: Skill | null) => {
    setHoveredSkill(skill)
  }

  return (
    <ThreeGate className={`relative ${className ?? ''}`}>

      {/* frameloop="always" required — see comment in FloatingModels.tsx */}
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -5]} intensity={1} />

        <group>
          {filteredSkills.map((skill, index) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              position={skillPositions[index]}
              isSelected={selectedSkill?.id === skill.id}
              onClick={handleSkillClick}
              onHover={handleSkillHover}
            />
          ))}
        </group>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={!selectedSkill}
          autoRotateSpeed={0.5}
          minDistance={8}
          maxDistance={20}
        />
      </Canvas>
    </ThreeGate>
  )
}
