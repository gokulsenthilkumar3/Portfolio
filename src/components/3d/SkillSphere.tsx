'use client'

import React, { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Html, Text, Line, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '@/lib/data/content'
import { getSkillsByCategory } from '@/lib/utils/content-helpers'
import type { Skill } from '@/lib/types/portfolio'
import { ThreeGate } from './ThreeGate'

// ─── Neon Ring ────────────────────────────────────────────────────
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

// ─── Core Sphere ──────────────────────────────────────────────────
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
      <sphereGeometry args={[2.6, 48, 48]} />
      <meshStandardMaterial
        color="#1e40af"
        metalness={0.6}
        roughness={0.2}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  )
}

// ─── Skill Node ──────────────────────────────────────────────────
function SkillNode({ skill, position, isSelected, isHovered, onClick, onHover }: {
  skill: Skill
  position: [number, number, number]
  isSelected: boolean
  isHovered: boolean
  onClick: (s: Skill) => void
  onHover: (s: Skill | null) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)
  const baseSize = 0.22 + skill.proficiency * 0.08
  const nodeColor = skill.color || '#6366f1'

  const color = useMemo(() => {
    if (isSelected) return '#ffffff'
    if (isHovered) return skill.color || '#6366f1'
    return skill.color ? skill.color : '#6366f1'
  }, [isSelected, isHovered, skill.color])

  const scale = useMemo(() => {
    const baseScale = 0.4 + skill.proficiency * 0.08
    return isSelected ? baseScale * 1.5 : isHovered ? baseScale * 1.2 : baseScale
  }, [isSelected, isHovered, skill.proficiency])

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
    }
  })

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={isSelected ? 0.18 : isHovered ? 0.14 : 0.07} />
      </mesh>
      {/* Main geometry wrapped in Float */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerDown={e => {
            e.stopPropagation()
            pointerDownPos.current = { x: e.clientX, y: e.clientY }
          }}
          onPointerUp={e => {
            e.stopPropagation()
            if (pointerDownPos.current) {
              const dx = e.clientX - pointerDownPos.current.x
              const dy = e.clientY - pointerDownPos.current.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist < 5) {
                onClick(skill)
              }
            }
            pointerDownPos.current = null
          }}
          onPointerOver={e => { e.stopPropagation(); onHover(skill) }}
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
        
        {/* Label */}
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
      {/* Tooltip on select */}
      {isSelected && <SkillTooltip skill={skill} position={[0, baseSize * 8 + 1.2, 0]} />}
    </group>
  )
}

// ─── Constellation lines ───────────────────────────────────────────
function ConstellationLines({ positions, hoveredIndex, selectedIndex }: {
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
    <>
      {lines.map((line, idx) => {
        const hi = line.start === hoveredIndex || line.end === hoveredIndex ||
                   line.start === selectedIndex || line.end === selectedIndex
        return (
          <Line
            key={idx}
            points={[positions[line.start], positions[line.end]]}
            color={hi ? '#818cf8' : '#334155'}
            lineWidth={hi ? 1.2 : 0.4}
            transparent
            opacity={hi ? 0.7 : 0.2}
          />
        )
      })}
    </>
  )
}

// ─── Selected skill tooltip ────────────────────────────────────────
function SkillTooltip({ skill, position }: { skill: Skill; position: [number, number, number] }) {
  const LEVELS = ['', 'Beginner', 'Familiar', 'Proficient', 'Advanced', 'Expert']
  return (
    <Html position={position} center distanceFactor={10}>
      <div className="bg-card/90 border border-border rounded-lg px-3 py-2 text-xs shadow-xl min-w-[120px] text-center pointer-events-none">
        <div className="font-semibold text-foreground">{skill.name}</div>
        <div className="text-muted-foreground mt-0.5">{skill.category}</div>
        <div className="flex justify-center gap-0.5 mt-1">
          {[1,2,3,4,5].map(n => (
            <span key={n} className={`w-2 h-2 rounded-full ${n <= skill.proficiency ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
        <div className="text-primary/80 mt-0.5">{LEVELS[skill.proficiency]}</div>
      </div>
    </Html>
  )
}

// ─── Main export ──────────────────────────────────────────────────
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
    <ThreeGate>
      <Canvas
        camera={{ position: [0, 0, 22], fov: 55 }}
        className={className}
        style={{ cursor: hoveredSkill ? 'pointer' : 'grab' }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#818cf8" />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#34d399" />
        <Sparkles count={60} scale={22} size={1.2} speed={0.3} opacity={0.4} color="#818cf8" />

        <CoreSphere />

        <NeonRing radius={11} color="#818cf8" tiltX={0.3} speed={0.08} />
        <NeonRing radius={9.5} color="#34d399" tiltX={-0.5} tiltZ={0.4} speed={-0.06} />
        <NeonRing radius={10.5} color="#f472b6" tiltX={0.7} tiltZ={-0.3} speed={0.05} />

        <ConstellationLines
          positions={skillPositions}
          hoveredIndex={hoveredIndex}
          selectedIndex={selectedIndex}
        />

        {filteredSkills.map((skill, i) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            position={skillPositions[i]}
            isSelected={selectedSkill?.id === skill.id}
            isHovered={hoveredSkill?.id === skill.id}
            onClick={s => {
              setSelectedSkill(prev => prev?.id === s.id ? null : s)
              onSkillSelect?.(s)
            }}
            onHover={setHoveredSkill}
          />
        ))}

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
