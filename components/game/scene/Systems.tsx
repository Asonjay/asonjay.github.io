'use client'
import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createStationRegistry } from '../systems/interactions'
import { STATIONS } from '../systems/worldLayout'
import { useGameStore, playerPosRef, nameplateRef } from '../systems/store'
import { PLAYER_VISUAL_SCALE } from '../systems/playerConfig'

// Per-frame interaction loop: resolve the nearby station (updating the store
// only on change) and project its nameplate anchor into screen space for the
// HTML NameplateBubble. Uses a pooled Vector3 — no per-frame allocation.
// Anchor height rides the player's visual scale so the bubble keeps its
// head-clearance above the (now larger) character standing at the station.
const NAMEPLATE_Y = 2.7 * PLAYER_VISUAL_SCALE

export function Systems() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  const registry = useMemo(() => {
    const r = createStationRegistry()
    for (const s of STATIONS) r.add({ id: s.id, x: s.anchor.x, z: s.anchor.z, radius: s.radius })
    return r
  }, [])

  const v = useRef(new THREE.Vector3())
  const lastNear = useRef<string | null>(null)

  useFrame(() => {
    const p = playerPosRef.current
    const near = registry.nearestInRange(p.x, p.z)
    if (near !== lastNear.current) {
      lastNear.current = near
      useGameStore.getState().setNearbyStation(near)
    }

    const np = nameplateRef.current
    if (near) {
      const st = registry.get(near)!
      v.current.set(st.x, NAMEPLATE_Y, st.z).project(camera)
      np.x = (v.current.x * 0.5 + 0.5) * size.width
      np.y = (-v.current.y * 0.5 + 0.5) * size.height
      np.visible = v.current.z < 1
      np.id = near
    } else {
      np.visible = false
      np.id = null
    }
  })

  return null
}
