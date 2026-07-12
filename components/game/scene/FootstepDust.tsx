'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DELTA_CLAMP } from '../systems/playerConfig'

// Pooled footstep dust: 8 small soft-white quads that puff up and fade on each
// stride. The Player calls `footstepDust.emit(x, z)` at walk-cycle zero
// crossings; emission is gated by reduced motion on the caller side.
const COUNT = 8
const SIZE = 0.15
const LIFE = 0.4
const RISE = 0.2

export const footstepDust: { emit: ((x: number, z: number) => void) | null } = { emit: null }

export function FootstepDust() {
  const meshes = useRef<THREE.Mesh[]>([])
  const ages = useRef<number[]>(Array.from({ length: COUNT }, () => LIFE + 1))
  const next = useRef(0)

  useEffect(() => {
    footstepDust.emit = (x, z) => {
      const i = next.current
      next.current = (i + 1) % COUNT
      ages.current[i] = 0
      const m = meshes.current[i]
      if (m) {
        m.position.set(x, 0.05, z)
        m.scale.setScalar(SIZE)
        m.visible = true
        ;(m.material as THREE.MeshBasicMaterial).opacity = 0.5
      }
    }
    return () => {
      footstepDust.emit = null
    }
  }, [])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    for (let i = 0; i < COUNT; i++) {
      if (ages.current[i] > LIFE) continue
      ages.current[i] += dt
      const m = meshes.current[i]
      if (!m) continue
      const k = ages.current[i] / LIFE
      if (k >= 1) {
        m.visible = false
        continue
      }
      ;(m.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k)
      m.position.y = 0.05 + RISE * k
      m.scale.setScalar(SIZE * (1 + k * 0.6))
    }
  })

  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshes.current[i] = el
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
          userData={{ dynamic: true }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}
