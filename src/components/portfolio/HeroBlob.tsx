'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function Blob() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!mesh.current) return

    const targetX = state.pointer.y * 0.18
    const targetY = state.pointer.x * 0.24
    mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, targetX, 3.5, delta)
    mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, targetY, 3.5, delta)
    mesh.current.rotation.z += delta * 0.035
    mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, state.pointer.x * 0.2, 2.5, delta)
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, state.pointer.y * 0.12, 2.5, delta)
  })

  return (
    <mesh ref={mesh} scale={1.18}>
      <icosahedronGeometry args={[1.45, 5]} />
      <MeshDistortMaterial
        color="#16130d"
        emissive="#d4a853"
        emissiveIntensity={0.14}
        roughness={0.34}
        metalness={0.72}
        distort={0.28}
        speed={0.72}
      />
    </mesh>
  )
}

export function HeroBlob() {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 4.8], fov: 42 }}
    >
      <ambientLight intensity={0.18} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#f0ede8" />
      <pointLight position={[-3, -1, 2]} intensity={3.2} color="#d4a853" />
      <Blob />
    </Canvas>
  )
}
