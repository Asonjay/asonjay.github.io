'use client'
import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { playerPosRef, useGameStore } from '../systems/store'
import { reducedMotionRef } from '../systems/reducedMotion'
import { SPAWN } from '../systems/worldLayout'
import {
  VIEWSIZE_LANDSCAPE,
  VIEWSIZE_PORTRAIT,
  CAM_POS_LAMBDA,
  CAM_TARGET_LAMBDA,
  PANEL_DOLLY,
  PANEL_DOLLY_LAMBDA,
  DELTA_CLAMP,
} from '../systems/playerConfig'

const damp = THREE.MathUtils.damp
const OFFSET_X = 20
const OFFSET_Y = 20
const OFFSET_Z = 20

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)
  const lookAt = useRef(new THREE.Vector3(SPAWN.x, 0, SPAWN.z))
  // Resting ortho zoom, captured once before the dolly first runs. The resize
  // effect drives the frustum via top/bottom/left/right and never touches zoom,
  // so this base stays valid across resizes.
  const baseZoom = useRef<number | null>(null)

  // Ortho frustum from viewport aspect: vertical half-height is VIEWSIZE, width
  // scales with aspect. Re-run on resize.
  useLayoutEffect(() => {
    const aspect = width / height
    const viewSize = aspect < 1 ? VIEWSIZE_PORTRAIT : VIEWSIZE_LANDSCAPE
    camera.top = viewSize
    camera.bottom = -viewSize
    camera.left = -viewSize * aspect
    camera.right = viewSize * aspect
    camera.near = 0.1
    camera.far = 100
    camera.position.set(SPAWN.x + OFFSET_X, OFFSET_Y, SPAWN.z + OFFSET_Z)
    camera.lookAt(lookAt.current)
    camera.updateProjectionMatrix()
  }, [camera, width, height])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const p = playerPosRef.current
    camera.position.x = damp(camera.position.x, p.x + OFFSET_X, CAM_POS_LAMBDA, dt)
    camera.position.y = damp(camera.position.y, OFFSET_Y, CAM_POS_LAMBDA, dt)
    camera.position.z = damp(camera.position.z, p.z + OFFSET_Z, CAM_POS_LAMBDA, dt)
    lookAt.current.x = damp(lookAt.current.x, p.x, CAM_TARGET_LAMBDA, dt)
    lookAt.current.z = damp(lookAt.current.z, p.z, CAM_TARGET_LAMBDA, dt)
    camera.lookAt(lookAt.current)

    // Panel-open dolly (spec §4.4): ease the ortho zoom IN ~5% while a panel is
    // open (factor 1/PANEL_DOLLY), back out when it closes. Transient store read
    // — no subscription, no per-frame allocation. Snap under reduced motion.
    if (baseZoom.current === null) baseZoom.current = camera.zoom
    const openPanelId = useGameStore.getState().openPanelId
    const targetZoom = baseZoom.current * (openPanelId ? 1 / PANEL_DOLLY : 1)
    const nextZoom = reducedMotionRef.current
      ? targetZoom
      : damp(camera.zoom, targetZoom, PANEL_DOLLY_LAMBDA, dt)
    if (Math.abs(nextZoom - camera.zoom) > 1e-4) {
      camera.zoom = nextZoom
      camera.updateProjectionMatrix()
    }
  })

  return null
}
