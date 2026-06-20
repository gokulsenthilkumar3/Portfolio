'use client'

import { Environment, Float, Sparkles, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function VolumetricEnvironment({ theme }: { theme: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  const bgColor = theme === 'light' ? '#f8fafc' : '#050510'

  return (
    <>
      <color attach="background" args={[bgColor]} />
      
      {/* Dynamic Lighting and Fog */}
      <fog attach="fog" args={[bgColor, 5, 20]} />
      <ambientLight intensity={theme === 'light' ? 0.6 : 0.2} />
      <directionalLight position={[5, 5, 5]} intensity={theme === 'light' ? 1.5 : 1} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4f46e5" />
      <pointLight position={[5, -5, -5]} intensity={0.5} color="#ec4899" />

      <group ref={groupRef}>
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#4f46e5" />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} color="#ec4899" />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[5, 1, -1]} scale={[20, 0.1, 1]} color="#14b8a6" />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} color="#8b5cf6" />
          </group>
        </Environment>
      </group>

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sparkles count={200} scale={10} size={4} speed={0.4} opacity={0.2} color="#8b5cf6" />
        <Sparkles count={100} scale={10} size={6} speed={0.2} opacity={0.3} color="#ec4899" />
      </Float>

      <EffectComposer disableNormalPass multisampling={4}>
        <DepthOfField target={[0, 0, 0]} focalLength={0.02} bokehScale={1.5} height={480} />
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        <ChromaticAberration 
          blendFunction={BlendFunction.NORMAL} 
          offset={new THREE.Vector2(0.001, 0.001)} 
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  )
}
