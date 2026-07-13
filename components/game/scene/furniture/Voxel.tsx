'use client'
import { forwardRef } from 'react'
import * as THREE from 'three'

// Shared voxel primitive. Every static furniture box reuses ONE unit-cube
// geometry (scaled per instance) and a MeshLambertMaterial cached by color, so
// hundreds of boxes cost a handful of GPU resources and StaticMerge can batch
// them by material. `dispose={null}` keeps R3F from freeing the shared cache
// when any single box unmounts.

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)

const materialCache = new Map<string, THREE.MeshLambertMaterial>()
export function getMaterial(color: string): THREE.MeshLambertMaterial {
  let mat = materialCache.get(color)
  if (!mat) {
    mat = new THREE.MeshLambertMaterial({ color })
    materialCache.set(color, mat)
  }
  return mat
}

// Prototype-derived voxel palette (see design spec §2).
// R3 brightness pass lifts the three darkest surfaces ~11–16% in lightness (hue
// kept) so furniture silhouettes read; keys are unchanged so StaticMerge still
// batches each color into one material.
export const PALETTE = {
  woodDark: '#442716', // R3 +11% L (was #3d2314) — darkest wood, lifted for readability
  woodLight: '#d2b48c',
  fabricBlue: '#4169e1',
  fabricRed: '#b22222',
  fabricWhite: '#f8f8ff',
  metal: '#708090',
  leaf: '#228b22',
  dirt: '#52351b', // R3 +11% L (was #4a3018) — courtyard ground
  cork: '#b98a5e',
  paper: '#efe9dd',
  slate: '#353c50', // R3 +16% L (was #2f3444) — navy furniture Jason flagged as too dark
  brass: '#c8a24a',
} as const

type VoxelProps = {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  castShadow?: boolean
  receiveShadow?: boolean
  rotation?: [number, number, number]
}

// A single static box. Center-positioned (native three), unit geometry scaled to
// `size`. Marked static via userData so StaticMerge folds it into a batch.
export const Voxel = forwardRef<THREE.Mesh, VoxelProps>(function Voxel(
  { position, size, color, castShadow = true, receiveShadow = true, rotation },
  ref
) {
  return (
    <mesh
      ref={ref}
      position={position}
      scale={size}
      rotation={rotation}
      geometry={UNIT_BOX}
      material={getMaterial(color)}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      userData={{ static: true }}
      dispose={null}
    />
  )
})
