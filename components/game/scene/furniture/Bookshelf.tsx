'use client'
import * as THREE from 'three'
import { Voxel, PALETTE } from './Voxel'
import { useStationHighlight } from './useStationHighlight'

// Blog — 5-shelf bookcase against the -X backdrop wall, packed with colored
// book spines. Emote: tiptoe and pull a book. One spine is the highlight mesh.
const CX = -11.5
const CZ = 4.5
const SHELF_Y = [0.7, 1.4, 2.1, 2.8, 3.5]
const SPINE = [PALETTE.fabricRed, PALETTE.fabricBlue, PALETTE.leaf, PALETTE.brass, PALETTE.fabricWhite]

export function Bookshelf() {
  const glow = useStationHighlight('blog', PALETTE.brass, '#ffcf6b')

  const books: JSX.Element[] = []
  let n = 0
  for (let s = 0; s < 4; s++) {
    for (let b = 0; b < 4; b++) {
      const z = CZ - 1.05 + b * 0.62 + (s % 2) * 0.08
      const h = 0.44 + ((n * 7) % 5) * 0.03
      books.push(
        <Voxel
          key={`bk-${n}`}
          position={[CX + 0.14, SHELF_Y[s] + 0.06 + h / 2, z]}
          size={[0.34, h, 0.16]}
          color={SPINE[n % SPINE.length]}
        />
      )
      n++
    }
  }

  return (
    <group userData={{ stationId: 'blog' }}>
      {/* carcass: back, sides, shelves */}
      <Voxel position={[CX - 0.24, 2.0, CZ]} size={[0.12, 4.0, 2.9]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 2.0, CZ - 1.45]} size={[0.5, 4.0, 0.1]} color={PALETTE.woodDark} />
      <Voxel position={[CX, 2.0, CZ + 1.45]} size={[0.5, 4.0, 0.1]} color={PALETTE.woodDark} />
      {[0.35, ...SHELF_Y, 3.95].map((y, i) => (
        <Voxel key={`sh-${i}`} position={[CX, y, CZ]} size={[0.5, 0.08, 2.8]} color={PALETTE.woodLight} />
      ))}
      {books}

      {/* highlight: a single glowing spine */}
      <mesh position={[CX + 0.16, SHELF_Y[2] + 0.34, CZ + 0.5]} material={glow} userData={{ dynamic: true }}>
        <boxGeometry args={[0.34, 0.5, 0.16]} />
      </mesh>
    </group>
  )
}
