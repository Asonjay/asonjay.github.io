'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Voxel, PALETTE, getMaterial } from './Voxel'
import { useReactiveProp } from './useReactiveProp'
import { playerPosRef } from '../../systems/store'
import { reducedMotionRef } from '../../systems/reducedMotion'
import { DELTA_CLAMP } from '../../systems/playerConfig'

// Non-station decor: a rug that dips when stepped on, a potted plant and loose
// papers that wobble when bumped. None carry a collider.
const RUG = { x: -5.5, z: 2.5, w: 5, d: 5 }
const PLANT = { x: -11, z: 7.2 }
const PAPERS = { x: -3.8, z: -7.6 }
const damp = THREE.MathUtils.damp

export function SmallProps() {
  const rug = useRef<THREE.Mesh>(null)
  const plant = useRef<THREE.Group>(null)
  const papers = useRef<THREE.Group>(null)

  useReactiveProp({
    ref: plant,
    axis: 'z',
    trigger: { minX: PLANT.x - 0.6, maxX: PLANT.x + 0.6, minZ: PLANT.z - 0.6, maxZ: PLANT.z + 0.6 },
    impulse: 2.8,
    k: 70,
    c: 5,
  })
  useReactiveProp({
    ref: papers,
    axis: 'z',
    trigger: { minX: PAPERS.x - 0.7, maxX: PAPERS.x + 0.7, minZ: PAPERS.z - 0.7, maxZ: PAPERS.z + 0.7 },
    impulse: 3.5,
    k: 120,
    c: 6,
  })

  // Rug: subtle scale-y dip while the player stands on it.
  useFrame((_, rawDelta) => {
    const m = rug.current
    if (!m) return
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const p = playerPosRef.current
    const on =
      !reducedMotionRef.current &&
      Math.abs(p.x - RUG.x) < RUG.w / 2 &&
      Math.abs(p.z - RUG.z) < RUG.d / 2
    m.scale.y = damp(m.scale.y, on ? 0.55 : 1, 10, dt)
  })

  return (
    <group>
      {/* rug (dynamic: dips underfoot) */}
      <mesh
        ref={rug}
        position={[RUG.x, 0.03, RUG.z]}
        scale={[RUG.w, 0.04, RUG.d]}
        material={getMaterial(PALETTE.fabricRed)}
        receiveShadow
        userData={{ dynamic: true }}
        dispose={null}
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* potted plant (reactive) */}
      <group ref={plant} position={[PLANT.x, 0, PLANT.z]} userData={{ dynamic: true }}>
        <Voxel position={[0, 0.3, 0]} size={[0.6, 0.6, 0.6]} color={PALETTE.dirt} />
        <Voxel position={[0, 0.9, 0]} size={[1.0, 0.5, 1.0]} color={PALETTE.leaf} />
        <Voxel position={[0, 1.35, 0]} size={[0.75, 0.5, 0.75]} color={PALETTE.leaf} />
        <Voxel position={[0, 1.75, 0]} size={[0.4, 0.4, 0.4]} color={PALETTE.leaf} />
      </group>

      {/* loose papers (reactive) */}
      <group ref={papers} position={[PAPERS.x, 0, PAPERS.z]} userData={{ dynamic: true }}>
        <Voxel position={[0, 0.03, 0]} size={[0.5, 0.04, 0.6]} color={PALETTE.paper} rotation={[0, 0.2, 0]} />
        <Voxel position={[0.18, 0.06, 0.12]} size={[0.5, 0.04, 0.6]} color={PALETTE.fabricWhite} rotation={[0, -0.35, 0]} />
      </group>
    </group>
  )
}
