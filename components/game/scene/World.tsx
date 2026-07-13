'use client'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ROOM, YARD, DOOR_GAP } from '../systems/worldLayout'
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
import { Fence } from './furniture/Fence'
import { GardenLamp } from './furniture/GardenLamp'
import { GardenBench } from './furniture/GardenBench'
import { Tree } from './furniture/Tree'
import { FlowerBed } from './furniture/FlowerBed'
import { PALETTE } from './furniture/Voxel'

const TILE_A = '#3a3f57'
const TILE_B = '#333750'
const WALL_COLOR = '#282b3d'

// Courtyard ground palette. Grass is 2-3 subtly varied greens (chosen per-cell
// from a cheap position hash); the plaza/path just outside the door is dirt.
// Both read via scene lighting, so they warm by day and dim by night with the
// garden lamppost adding a night pool.
const GRASS = ['#4c7d3b', '#578a44', '#436f36']
const PATH_COLOR = '#7b6a49'

const VIS_T = 0.3 // rendered wall thickness
const KNEE_H = 1.2
const DOOR_POST_H = 1.7

// Dirt plaza just outside the door: the walkable heart of the yard, where the
// mailbox and trash can anchors sit. Kept in sync with those anchors + DOOR_GAP.
function onPlaza(cx: number, cz: number): boolean {
  return cx >= YARD.minX && cx < 18 && cz >= DOOR_GAP.minZ && cz < DOOR_GAP.maxZ
}

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

// Courtyard ground (grass + dirt plaza) as ONE InstancedMesh — one draw call for
// the whole yard floor, like CheckerFloor. StaticMerge skips instanced meshes.
function CourtyardFloor() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const cells = useMemo(() => {
    const out: { x: number; z: number; color: string }[] = []
    for (let x = YARD.minX; x < YARD.maxX; x++) {
      for (let z = YARD.minZ; z < YARD.maxZ; z++) {
        const grass = GRASS[Math.abs(x * 7 + z * 13) % GRASS.length]
        out.push({ x: x + 0.5, z: z + 0.5, color: onPlaza(x, z) ? PATH_COLOR : grass })
      }
    }
    return out
  }, [])

  useLayoutEffect(() => {
    const mesh = ref.current
    const m = new THREE.Matrix4()
    const col = new THREE.Color()
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i]
      m.setPosition(c.x, -0.1, c.z)
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, col.set(c.color))
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

  // East divider (room's open side): two knee-height segments leaving the door
  // gap. Derived from ROOM + DOOR_GAP so the visuals track the colliders.
  const eastX = ROOM.maxX + VIS_T / 2
  const divSouthLen = DOOR_GAP.minZ - ROOM.minZ
  const divSouthMid = (ROOM.minZ + DOOR_GAP.minZ) / 2
  const divNorthLen = ROOM.maxZ - DOOR_GAP.maxZ
  const divNorthMid = (DOOR_GAP.maxZ + ROOM.maxZ) / 2

  // Backdrop (far from the iso camera at +X+Z): west (-X) and south (-Z) walls
  // are full height. Front (near the camera): the east (+X) divider and north
  // (+Z) wall are knee height so they never occlude the room. Inner faces sit on
  // the ROOM boundary. The east wall now opens into the courtyard (YARD).
  return (
    <group>
      <CheckerFloor />
      <CourtyardFloor />

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

      {/* east divider — knee height, split around the door gap */}
      <mesh position={[eastX, KNEE_H / 2, divSouthMid]} castShadow receiveShadow>
        <boxGeometry args={[VIS_T, KNEE_H, divSouthLen]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[eastX, KNEE_H / 2, divNorthMid]} castShadow receiveShadow>
        <boxGeometry args={[VIS_T, KNEE_H, divNorthLen]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      {/* door posts framing the gap (no collider — the gap is walkable) */}
      <mesh position={[ROOM.maxX, DOOR_POST_H / 2, DOOR_GAP.minZ]} castShadow receiveShadow>
        <boxGeometry args={[0.34, DOOR_POST_H, 0.34]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[ROOM.maxX, DOOR_POST_H / 2, DOOR_GAP.maxZ]} castShadow receiveShadow>
        <boxGeometry args={[0.34, DOOR_POST_H, 0.34]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>

      {/* north wall — knee height */}
      <mesh position={[midX, KNEE_H / 2, ROOM.maxZ + VIS_T / 2]} castShadow receiveShadow>
        <boxGeometry args={[spanX, KNEE_H, VIS_T]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>

      {/* Indoor stations & decor. Footprints/colliders live in worldLayout.ts. */}
      <AboutWall />
      <Desk />
      <WallCalendar />
      <NoticeBoard />
      <PhotoWall />
      <TvConsole />
      <Lamp />
      <Bookshelf />
      <Jukebox />
      <SmallProps />

      {/* Courtyard: moved stations (ids unchanged) + static garden decor. */}
      <Mailbox />
      <TrashCan />
      <Fence />
      <GardenLamp />
      <GardenBench />
      <Tree />
      <FlowerBed position={[12.9, 8.2]} />
      <FlowerBed
        position={[18.6, 7.2]}
        petals={[PALETTE.brass, PALETTE.fabricWhite, PALETTE.fabricRed]}
      />
      <FlowerBed
        position={[17.2, -7.4]}
        petals={[PALETTE.fabricWhite, PALETTE.fabricBlue, PALETTE.fabricWhite]}
      />
    </group>
  )
}
