'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Text, Line, Float } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'
import { ThreeGate } from './ThreeGate'

interface SkillNodeProps {
  skill: Skill
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onClick: (skill: Skill) => void
  onHover: (skill: Skill | null) => void
}

function SkillNode({
  skill,
  position,
  isSelected,
  isHovered,
  onClick,
  onHover,
}: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const color = useMemo(() => {
    if (isSelected) return '#ffffff'
    if (isHovered) return skill.color || '#6366f1'
    return skill.color ? skill.color : '#6366f1'
  }, [isSelected, isHovered, skill.color])

  const scale = useMemo(() => {
    const baseScale = 0.4 + skill.proficiency * 0.08
    return isSelected ? baseScale * 1.5 : isHovered ? baseScale * 1.2 : baseScale
  }, [isSelected, isHovered, skill.proficiency])

  useFrame((state) => {
    if (meshRef.current && !isSelected) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation()
            onClick(skill)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(skill)
          }}
          onPointerOut={() => onHover(null)}
          scale={scale}
        >
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={isHovered || isSelected ? 0.6 : 0.1}
            wireframe={!isSelected && !isHovered}
          />
        </mesh>
        
        <Text
          position={[0, isSelected || isHovered ? -0.8 : -0.6, 0]}
          fontSize={isSelected ? 0.4 : isHovered ? 0.35 : 0.25}
          color={isSelected ? '#ffffff' : (skill.color || '#ffffff')}
          anchorX="center"
          anchorY="middle"
          fillOpacity={isSelected || isHovered ? 1 : 0.7}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {skill.name}
        </Text>
      </Float>
    </group>
  )
}

function ConstellationLines({ 
  positions, 
  hoveredIndex, 
  selectedIndex 
}: { 
  positions: [number, number, number][]
  hoveredIndex: number | null
  selectedIndex: number | null
}) {
  const lines = useMemo(() => {
    const l = []
    // Create random connections
    for (let i = 0; i < positions.length; i++) {
      // Connect each node to 2-3 other close nodes
      for (let j = i + 1; j < positions.length; j++) {
        // Distance check to avoid lines across the whole sphere
        const dx = positions[i][0] - positions[j][0]
        const dy = positions[i][1] - positions[j][1]
        const dz = positions[i][2] - positions[j][2]
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < 8) { // Only connect if relatively close
          l.push({ start: i, end: j })
        }
      }
    }
    // Thin out lines randomly to avoid clutter
    return l.filter(() => Math.random() > 0.6)
  }, [positions])

  return (
    <group>
      {lines.map((line, idx) => {
        const isHighlighted = 
          line.start === hoveredIndex || line.end === hoveredIndex ||
          line.start === selectedIndex || line.end === selectedIndex

        return (
          <Line
            key={idx}
            points={[positions[line.start], positions[line.end]]}
            color={isHighlighted ? '#ffffff' : '#4f46e5'}
            lineWidth={isHighlighted ? 2 : 0.5}
            transparent
            opacity={isHighlighted ? 0.8 : 0.15}
          />
        )
      })}
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
    if (!selectedCategory) return skills.slice(0, 25)
    return getSkillsByCategory(skills, selectedCategory as any).slice(0, 20)
  }, [selectedCategory])

  const skillPositions = useMemo(() => {
    // Fibonacci sphere distribution
    const radius = 9
    const samples = filteredSkills.length
    const offset = 2 / samples
    const increment = Math.PI * (3 - Math.sqrt(5)) // golden angle

    return filteredSkills.map((_, i) => {
      const y = ((i * offset) - 1) + (offset / 2)
      const r = Math.sqrt(1 - Math.pow(y, 2))
      const phi = ((i + 1) % samples) * increment

      return [
        Math.cos(phi) * r * radius,
        y * radius,
        Math.sin(phi) * r * radius
      ] as [number, number, number]
    })
  }, [filteredSkills])

  const hoveredIndex = hoveredSkill ? filteredSkills.findIndex(s => s.id === hoveredSkill.id) : null
  const selectedIndex = selectedSkill ? filteredSkills.findIndex(s => s.id === selectedSkill.id) : null

  return (
    <ThreeGate className={`relative ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, 0, 16], fov: 60 }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -5]} intensity={1.5} color="#ec4899" />
        <pointLight position={[10, -10, 5]} intensity={1.5} color="#6366f1" />

        <group>
          <ConstellationLines 
            positions={skillPositions} 
            hoveredIndex={hoveredIndex} 
            selectedIndex={selectedIndex} 
          />
          
          {filteredSkills.map((skill, index) => (
            <SkillNode
              key={skill.id}
              skill={skill}
              position={skillPositions[index]}
              isSelected={selectedSkill?.id === skill.id}
              isHovered={hoveredSkill?.id === skill.id}
              onClick={(s) => {
                setSelectedSkill(s)
                onSkillSelect?.(s)
              }}
              onHover={setHoveredSkill}
            />
          ))}
        </group>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={!selectedSkill && !hoveredSkill}
          autoRotateSpeed={0.8}
          minDistance={10}
          maxDistance={25}
        />
      </Canvas>
    </ThreeGate>
  )
}
