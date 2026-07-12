'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// Projects — wall-mounted TV (emissive) + console box on the -X backdrop wall,
// with a sofa facing it (back toward the camera). Emote: sit on the sofa.
const WALL_X = -11.85
const SOFA_X = -8.0

export function TvConsole() {
  const screen = useStationHighlight('projects', PALETTE.slate, '#78d0ff')

  return (
    <group>
      {/* TV: frame + emissive screen on the -X wall, facing +x */}
      <Voxel position={[WALL_X, 2.55, 0]} size={[0.14, 1.8, 2.7]} color={PALETTE.woodDark} />
      <mesh position={[WALL_X + 0.09, 2.55, 0]} material={screen} userData={{ dynamic: true }}>
        <boxGeometry args={[0.05, 1.5, 2.4]} />
      </mesh>

      {/* console box below the TV (solid) */}
      <Voxel position={[-11.3, 0.45, 0]} size={[0.9, 0.9, 1.4]} color={PALETTE.woodDark} />
      <Voxel position={[-11.25, 0.95, 0]} size={[0.7, 0.1, 1.0]} color={PALETTE.metal} />

      {/* sofa facing -X, backrest on the camera (+x) side */}
      <Voxel position={[SOFA_X, 0.32, 0]} size={[1.5, 0.45, 2.6]} color={PALETTE.fabricBlue} />
      <Voxel position={[SOFA_X + 0.55, 0.78, 0]} size={[0.4, 1.0, 2.6]} color={PALETTE.fabricBlue} />
      <Voxel position={[SOFA_X - 0.15, 0.66, 1.25]} size={[1.2, 0.4, 0.25]} color={PALETTE.fabricBlue} />
      <Voxel position={[SOFA_X - 0.15, 0.66, -1.25]} size={[1.2, 0.4, 0.25]} color={PALETTE.fabricBlue} />
      <Voxel position={[SOFA_X - 0.1, 0.62, 0.6]} size={[1.0, 0.22, 0.9]} color={PALETTE.fabricRed} />
      <Voxel position={[SOFA_X - 0.1, 0.62, -0.6]} size={[1.0, 0.22, 0.9]} color={PALETTE.fabricRed} />
    </group>
  )
}
