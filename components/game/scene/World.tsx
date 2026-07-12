'use client'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ROOM } from '../systems/worldLayout'
import { AboutWall } from './furniture/AboutWall'
import { Desk } from './furniture/Desk'
import { WallCalendar } from './furniture/WallCalendar'
import { NoticeBoard } from './furniture/NoticeBoard'
import { PhotoWall } from './furniture/PhotoWall'
import { TvConsole } from './furniture/TvConsole'
import { Lamp } from './furniture/Lamp'
import { Bookshelf } from './furniture/Bookshelf'
import { Jukebox } from './furniture/Jukebox'
import { Mailbox } from './furniture/Mailbox'
import { TrashCan } from './furniture/TrashCan'
import { SmallProps } from './furniture/SmallProps'

const TILE_A = '#3a3f57'
const TILE_B = '#333750'
const WALL_COLOR = '#282b3d'

const VIS_T = 0.3 // rendered wall thickness
const KNEE_H = 1.2

function CheckerFloor() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const cells = useMemo(() => {
    const out: { x: number; z: number; even: boolean }[] = []
    for (let x = ROOM.minX; x < ROOM.maxX; x++) {
      for (let z = ROOM.minZ; z < ROOM.maxZ; z++) {
        out.push({ x: x + 0.5, z: z + 0.5, even: (x + z) % 2 === 0 })
      }
    }
    return out
  }, [])

  useLayoutEffect(() => {
    const mesh = ref.current
    const m = new THREE.Matrix4()
    const cA = new THREE.Color(TILE_A)
    const cB = new THREE.Color(TILE_B)
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i]
      m.setPosition(c.x, -0.1, c.z)
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, c.even ? cA : cB)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [cells])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cells.length]} receiveShadow>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial />
    </instancedMesh>
  )
}

export function World() {
  const spanX = ROOM.maxX - ROOM.minX
  const spanZ = ROOM.maxZ - ROOM.minZ
  const midX = (ROOM.minX + ROOM.maxX) / 2
  const midZ = (ROOM.minZ + ROOM.maxZ) / 2
  const fullH = ROOM.wallHeight

  // Backdrop (far from the iso camera at +X+Z): west (-X) and south (-Z) walls
  // are full height. Front (near the camera): east (+X) and north (+Z) walls are
  // knee height so they never occlude the room. Inner faces sit on the ROOM
  // boundary. (Brief calls these "N/E full / S/W knee"; under this camera the
  // backdrop is the -X/-Z pair.)
  return (
    <group>
      <CheckerFloor />

      {/* west + south full backdrop walls. They receive furniture shadows but do
          NOT cast: the F4 sun streams in from beyond the -Z (window) wall, so a
          casting shell would slab-shadow the room interior. Only props cast. */}
      <mesh position={[ROOM.minX - VIS_T / 2, fullH / 2, midZ]} receiveShadow>
        <boxGeometry args={[VIS_T, fullH, spanZ]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[midX, fullH / 2, ROOM.minZ - VIS_T / 2]} receiveShadow>
        <boxGeometry args={[spanX, fullH, VIS_T]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      {/* east wall — knee height */}
      <mesh position={[ROOM.maxX + VIS_T / 2, KNEE_H / 2, midZ]} castShadow receiveShadow>
        <boxGeometry args={[VIS_T, KNEE_H, spanZ]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      {/* north wall — knee height */}
      <mesh position={[midX, KNEE_H / 2, ROOM.maxZ + VIS_T / 2]} castShadow receiveShadow>
        <boxGeometry args={[spanX, KNEE_H, VIS_T]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>

      {/* Stations & decor. Footprints/colliders live in worldLayout.ts. */}
      <AboutWall />
      <Desk />
      <WallCalendar />
      <NoticeBoard />
      <PhotoWall />
      <TvConsole />
      <Lamp />
      <Bookshelf />
      <Jukebox />
      <Mailbox />
      <TrashCan />
      <SmallProps />
    </group>
  )
}
