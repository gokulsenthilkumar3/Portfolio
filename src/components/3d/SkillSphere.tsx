'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'

interface SkillNodeProps {
  skill: Skill
  position: [number, number, number]
  isSelected: boolean
  onClick: (skill: Skill) => void
  onHover: (skill: Skill | null) => void
}

function SkillNode({ skill, position, isSelected, onClick, onHover }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const color = useMemo(() => {
    if (isSelected) return '#ffffff'
    if (hovered) return skill.color || '#3b82f6'
    return skill.color ? skill.color + '80' : '#3b82f680'
  }, [isSelected, hovered, skill.color])

  const scale = useMemo(() => {
    const baseScale = 0.3 + (skill.proficiency * 0.1)
    return isSelected ? baseScale * 1.5 : hovered ? baseScale * 1.2 : baseScale
  }, [isSelected, hovered, skill.proficiency])

  useFrame((state) => {
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
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.3 : 0.1}
        />
      </mesh>
      
      {(hovered || isSelected) && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      )}
    </group>
  )
}

interface SkillSphereProps {
  onSkillSelect?: (skill: Skill) => void
  selectedCategory?: string
  className?: string
}

export function SkillSphere({ onSkillSelect, selectedCategory, className }: SkillSphereProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const groupRef = useRef<THREE.Group>(null)

  const filteredSkills = useMemo(() => {
    if (!selectedCategory) return skills.slice(0, 20) // Limit to 20 for performance
    return getSkillsByCategory(skills, selectedCategory as any).slice(0, 15)
  }, [selectedCategory])

  const skillPositions = useMemo(() => {
    return filteredSkills.map((skill, index) => {
      const phi = Math.acos(-1 + (2 * index) / filteredSkills.length)
      const theta = Math.sqrt(filteredSkills.length * Math.PI) * phi

      const x = Math.cos(theta) * Math.sin(phi) * 5
      const y = Math.sin(theta) * Math.sin(phi) * 5
      const z = Math.cos(phi) * 5

      return [x, y, z] as [number, number, number]
    })
  }, [filteredSkills])

  useFrame((state) => {
    if (groupRef.current && !selectedSkill) {
      groupRef.current.rotation.y += 0.002
    }
  })

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
    onSkillSelect?.(skill)
  }

  const handleSkillHover = (skill: Skill | null) => {
    setHoveredSkill(skill)
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <group ref={groupRef}>
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

        {/* Skill info panel */}
        {hoveredSkill && (
          <group position={[0, -6, 0]}>
            <mesh>
              <planeGeometry args={[8, 2]} />
              <meshStandardMaterial color="#1e293b" transparent opacity={0.9} />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={7}
            >
              {hoveredSkill.name} - Proficiency: {hoveredSkill.proficiency}/5
            </Text>
          </group>
        )}
      </Canvas>
    </div>
  )
}
