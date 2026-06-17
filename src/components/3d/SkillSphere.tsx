'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'

// NOTE: drei <Text> is removed. It requires fetching a font file at runtime
// (Inter_Regular.woff by default in drei v10) which fails in Vercel's edge
// network due to CORS / CSP restrictions, causing a client-side crash.
// Skill labels are now rendered as HTML overlays (see SkillLabel below),
// which are cheaper, accessible, and never block the canvas.

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
        {/* Reduced from sphereGeometry args=[1,32,32] to [1,16,16]
            ~4x fewer vertices per node; visually equivalent at this size. */}
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.3 : 0.1}
        />
      </mesh>
    </group>
  )
}

/** HTML overlay for the hovered/selected skill name — no font fetch needed. */
function SkillLabel({ skill }: { skill: Skill }) {
  return (
    <div
      className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-10
                 rounded-lg bg-slate-900/90 px-4 py-2 text-sm font-medium text-white
                 shadow-lg backdrop-blur-sm transition-opacity"
    >
      {skill.name} — {skill.proficiency}/5
    </div>
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
  const groupRef = useRef<THREE.Group>(null)

  const filteredSkills = useMemo(() => {
    if (!selectedCategory) return skills.slice(0, 20)
    return getSkillsByCategory(skills, selectedCategory as any).slice(0, 15)
  }, [selectedCategory])

  const skillPositions = useMemo(() => {
    return filteredSkills.map((_, index) => {
      const phi = Math.acos(-1 + (2 * index) / filteredSkills.length)
      const theta = Math.sqrt(filteredSkills.length * Math.PI) * phi
      return [
        Math.cos(theta) * Math.sin(phi) * 5,
        Math.sin(theta) * Math.sin(phi) * 5,
        Math.cos(phi) * 5,
      ] as [number, number, number]
    })
  }, [filteredSkills])

  useFrame(() => {
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
    <div className={`relative ${className ?? ''}`}>
      {/* HTML skill label — replaces drei <Text> to avoid runtime font fetch */}
      {(hoveredSkill || selectedSkill) && (
        <SkillLabel skill={(hoveredSkill || selectedSkill)!} />
      )}

      {/* frameloop="always" required — see comment in FloatingModels.tsx */}
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ background: 'transparent' }}
        frameloop="always"
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
      </Canvas>
    </div>
  )
}
