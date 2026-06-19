'use client'

import React, { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Text, Line, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'
import { ThreeGate } from './ThreeGate'

// ─── Neon Ring ──────────────────────────────────────────────────────
function NeonRing({ radius, color, tiltX = 0, tiltZ = 0, speed = 0.3 }: {
  radius: number; color: string; tiltX?: number; tiltZ?: number; speed?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * speed
  })
  const pts = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius])
    }
    return pts
  }, [radius])

  return (
    <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
      <Line points={pts} color={color} lineWidth={1.5} transparent opacity={0.35} />
    </group>
  )
}

// ─── Core Sphere ────────────────────────────────────────────────
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.15
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.05
    }
  })
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.4, 32, 32]} />
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.9}
        roughness={0.1}
        emissive="#3730a3"
        emissiveIntensity={0.6}
        wireframe
      />
    </mesh>
  )
}

// ─── Skill Node ────────────────────────────────────────────────
function SkillNode({
  skill, position, isSelected, isHovered, onClick, onHover
}: {
  skill: Skill
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onClick: (s: Skill) => void
  onHover: (s: Skill | null) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const baseSize = 0.22 + skill.proficiency * 0.08
  const nodeColor = skill.color || '#6366f1'

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    const targetScale = isSelected ? baseSize * 1.8 : isHovered ? baseSize * 1.4 : baseSize
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.12))
    if (!isSelected) {
      meshRef.current.rotation.x = t * 0.8
      meshRef.current.rotation.y = t * 0.6
    }
    if (glowRef.current) {
      const glowTarget = isSelected || isHovered ? baseSize * 3.5 : baseSize * 2.2
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(glowRef.current.scale.x, glowTarget, 0.1))
    }
  })

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh ref={glowRef} scale={baseSize * 2.2}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={isHovered || isSelected ? 0.18 : 0.07} />
      </mesh>

      {/* Main geometry */}
      <mesh
        ref={meshRef}
        scale={baseSize}
        onClick={e => { e.stopPropagation(); onClick(skill) }}
        onPointerOver={e => { e.stopPropagation(); onHover(skill) }}
        onPointerOut={() => onHover(null)}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={isSelected ? '#ffffff' : nodeColor}
          emissive={nodeColor}
          emissiveIntensity={isHovered || isSelected ? 1.2 : 0.4}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Label */}
      <Html center zIndexRange={[100, 0]} className="pointer-events-none">
        <div
          style={{
            color: isSelected ? '#fff' : nodeColor,
            fontSize: isSelected ? '13px' : isHovered ? '11px' : '9px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            textShadow: `0 0 12px ${nodeColor}`,
            opacity: isSelected || isHovered ? 1 : 0.65,
            transform: `translate(-50%, ${isSelected || isHovered ? '-26px' : '-18px'})`,
            letterSpacing: '0.04em',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-display, sans-serif)',
          }}
        >
          {skill.name}
        </div>
      </Html>
    </group>
  )
}

// ─── Constellation lines ─────────────────────────────────────────
function ConstellationLines({
  positions, hoveredIndex, selectedIndex
}: {
  positions: [number, number, number][]
  hoveredIndex: number | null
  selectedIndex: number | null
}) {
  const lines = useMemo(() => {
    const l: { start: number; end: number }[] = []
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i][0] - positions[j][0]
        const dy = positions[i][1] - positions[j][1]
        const dz = positions[i][2] - positions[j][2]
        if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 8) l.push({ start: i, end: j })
      }
    }
    return l.filter(() => Math.random() > 0.55)
  }, [positions])

  return (
    <group>
      {lines.map((line, idx) => {
        const hi = line.start === hoveredIndex || line.end === hoveredIndex || line.start === selectedIndex || line.end === selectedIndex
        return (
          <Line
            key={idx}
            points={[positions[line.start], positions[line.end]]}
            color={hi ? '#a5b4fc' : '#4338ca'}
            lineWidth={hi ? 1.5 : 0.4}
            transparent
            opacity={hi ? 0.7 : 0.12}
          />
        )
      })}
    </group>
  )
}

// ─── Selected skill tooltip ───────────────────────────────────────
function SkillTooltip({ skill, position }: { skill: Skill; position: [number, number, number] }) {
  const LEVELS = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']
  return (
    <Html position={position} center zIndexRange={[200, 100]}>
      <div style={{
        background: 'rgba(10,10,20,0.92)',
        border: `1px solid ${skill.color}60`,
        borderRadius: '10px',
        padding: '10px 14px',
        width: '140px',
        boxShadow: `0 0 20px ${skill.color}40`,
        backdropFilter: 'blur(12px)',
        color: '#fff',
        pointerEvents: 'none',
        transform: 'translate(-50%, -70px)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: skill.color, marginBottom: '4px' }}>{skill.name}</div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '6px' }}>{skill.category}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[1,2,3,4,5].map(n => (
            <div key={n} style={{ width: '16px', height: '4px', borderRadius: '2px', background: n <= skill.proficiency ? skill.color : '#374151' }} />
          ))}
        </div>
        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '4px' }}>{LEVELS[skill.proficiency]}</div>
      </div>
    </Html>
  )
}

// ─── Main export ───────────────────────────────────────────────
interface SkillSphereProps {
  onSkillSelect?: (skill: Skill) => void
  selectedCategory?: string
  className?: string
}

export function SkillSphere({ onSkillSelect, selectedCategory, className }: SkillSphereProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)

  const filteredSkills = useMemo(() => {
    if (!selectedCategory) return skills.slice(0, 28)
    return getSkillsByCategory(skills, selectedCategory as any).slice(0, 20)
  }, [selectedCategory])

  // Fibonacci sphere distribution
  const skillPositions = useMemo<[number, number, number][]>(() => {
    const R = 10
    const n = filteredSkills.length
    const inc = Math.PI * (3 - Math.sqrt(5))
    return filteredSkills.map((_, i) => {
      const y = ((i * 2) / n - 1) + (1 / n)
      const r = Math.sqrt(1 - y * y)
      const phi = i * inc
      return [Math.cos(phi) * r * R, y * R, Math.sin(phi) * r * R]
    })
  }, [filteredSkills])

  const hoveredIndex = hoveredSkill ? filteredSkills.findIndex(s => s.id === hoveredSkill.id) : null
  const selectedIndex = selectedSkill ? filteredSkills.findIndex(s => s.id === selectedSkill.id) : null

  return (
    <ThreeGate className={`relative ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, 0, 22], fov: 55 }}
        style={{ background: 'transparent' }}
        frameloop="always"
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting — cinematic neon */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-12, -8, -6]} intensity={3} color="#ec4899" />
        <pointLight position={[12, -8, 6]} intensity={3} color="#6366f1" />
        <pointLight position={[0, 14, 0]} intensity={2} color="#22d3ee" />

        {/* Sparkle field */}
        <Sparkles count={90} scale={30} size={1.5} speed={0.3} opacity={0.5} color="#a5b4fc" />

        {/* Decorative rings */}
        <NeonRing radius={11.5} color="#6366f1" tiltX={0.3} speed={0.2} />
        <NeonRing radius={12.5} color="#22d3ee" tiltX={-0.5} tiltZ={0.4} speed={-0.15} />
        <NeonRing radius={10.5} color="#ec4899" tiltX={1.0} tiltZ={-0.3} speed={0.25} />

        {/* Core */}
        <CoreSphere />

        {/* Constellation */}
        <ConstellationLines
          positions={skillPositions}
          hoveredIndex={hoveredIndex}
          selectedIndex={selectedIndex}
        />

        {/* Skill nodes */}
        {filteredSkills.map((skill, i) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            position={skillPositions[i]}
            isSelected={selectedSkill?.id === skill.id}
            isHovered={hoveredSkill?.id === skill.id}
            onClick={s => { setSelectedSkill(prev => prev?.id === s.id ? null : s); onSkillSelect?.(s) }}
            onHover={setHoveredSkill}
          />
        ))}

        {/* Tooltip on selected */}
        {selectedSkill && selectedIndex !== null && (
          <SkillTooltip skill={selectedSkill} position={skillPositions[selectedIndex]} />
        )}

        <OrbitControls
          enableZoom
          enablePan={false}
          autoRotate={!selectedSkill && !hoveredSkill}
          autoRotateSpeed={0.6}
          minDistance={12}
          maxDistance={30}
        />
      </Canvas>
    </ThreeGate>
  )
}
