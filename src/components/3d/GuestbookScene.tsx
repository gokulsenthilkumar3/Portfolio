'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeGate } from './ThreeGate'

function GlassShape() {
  const outerMeshRef = useRef<THREE.Mesh>(null)
  const innerMeshRef = useRef<THREE.Mesh>(null)

  // Rotate the shapes smoothly over time
  useFrame((state) => {
    if (outerMeshRef.current && innerMeshRef.current) {
      outerMeshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      outerMeshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      
      innerMeshRef.current.rotation.x = state.clock.elapsedTime * -0.5
      innerMeshRef.current.rotation.y = state.clock.elapsedTime * -0.2
    }
  })

  return (
    <Float floatIntensity={2} rotationIntensity={1} speed={2}>
      {/* Outer Glass Crystal */}
      <mesh ref={outerMeshRef}>
        {/* Icosahedron creates a beautiful faceted crystal look */}
        <icosahedronGeometry args={[2.5, 0]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#e0f2fe" // Light blue tint
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Decorative core inside the glass */}
      <mesh ref={innerMeshRef}>
         <octahedronGeometry args={[1, 0]} />
         <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} wireframe />
      </mesh>
    </Float>
  )
}

import { ErrorBoundary } from 'react-error-boundary'

function Fallback({ error }: { error: any }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-red-950/20 text-red-500 p-4 overflow-auto rounded-2xl border border-red-500/20">
      <p className="font-bold mb-2">3D Scene Error:</p>
      <pre className="text-xs">{error?.message || 'Unknown error'}</pre>
    </div>
  )
}

export function GuestbookScene({ className }: { className?: string }) {
  return (
    <ThreeGate className={className}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} frameloop="always">
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
          
          <GlassShape />
          
          {/* Adds realistic reflections to the glass material */}
          <Environment preset="city" />
          
          {/* Soft shadow directly underneath the object */}
          <ContactShadows 
            position={[0, -4, 0]} 
            opacity={0.5} 
            scale={15} 
            blur={2} 
            far={10} 
          />
        </Canvas>
      </ErrorBoundary>
    </ThreeGate>
  )
}
