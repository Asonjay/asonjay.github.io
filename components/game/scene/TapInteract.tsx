'use client'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../systems/store'
import { walkToStation } from '../systems/walkTo'

// Pointer travel (px) under which a press counts as a tap/click, not a drag.
const TAP_SLOP = 8

// Click / tap the scene to interact. Raycasts the furniture (each root group
// carries userData.stationId, stamped in the furniture files): tap the station
// you're already standing at and it interacts (via the shared requestInteract
// path); tap one further off and you auto-walk there (shared walkToStation, which
// fires the interaction on arrival). Works with a mouse on desktop and touch on
// mobile; taps on the DOM UI (hotbar/panels/joystick/buttons) never reach here
// because those are sibling overlays, not canvas children.
//
// We raycast ONLY the station roots, never the material-batched meshes StaticMerge
// adds (those span stations and carry no id). The originals StaticMerge hides are
// still hit — three's Raycaster ignores object.visible.
export function TapInteract() {
  const gl = useThree((s) => s.gl)
  const camera = useThree((s) => s.camera)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const el = gl.domElement
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const roots: THREE.Object3D[] = []
    const down = { x: 0, y: 0, id: -1, active: false }

    const onDown = (e: PointerEvent) => {
      down.x = e.clientX
      down.y = e.clientY
      down.id = e.pointerId
      down.active = true
    }

    const onUp = (e: PointerEvent) => {
      if (!down.active || e.pointerId !== down.id) return
      down.active = false
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_SLOP) return

      const g = useGameStore.getState()
      if (g.openPanelId !== null) return

      const rect = el.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(ndc, camera)

      roots.length = 0
      scene.traverse((o) => {
        if (o.userData && o.userData.stationId) roots.push(o)
      })
      const hits = raycaster.intersectObjects(roots, true)
      if (hits.length === 0) return

      let obj: THREE.Object3D | null = hits[0].object
      let stationId: string | undefined
      while (obj) {
        const sid = obj.userData?.stationId as string | undefined
        if (sid) {
          stationId = sid
          break
        }
        obj = obj.parent
      }
      if (!stationId) return

      // Standing at this station already -> interact in place; otherwise walk to
      // it (requestInteract keys off the nearby station, so the nearby check is
      // the correct gate — walkToStation fires the interaction on arrival).
      if (g.nearbyStationId === stationId) g.requestInteract()
      else walkToStation(stationId)
    }

    const onCancel = () => {
      down.active = false
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onCancel)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onCancel)
    }
  }, [gl, camera, scene])

  return null
}
