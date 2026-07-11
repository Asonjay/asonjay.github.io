'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, playerPosRef } from '../systems/store'
import { worldColliders, SPAWN } from '../systems/worldLayout'
import {
  MOVE_SPEED,
  ACCEL_LAMBDA,
  DECEL_LAMBDA,
  TURN_LAMBDA,
  STRIDE_FREQ,
  BOB_AMPLITUDE,
  LEAN_MAX,
  DELTA_CLAMP,
  PLAYER_RADIUS,
  PLAYER_COLORS,
} from '../systems/playerConfig'

const damp = THREE.MathUtils.damp

export function Player() {
  const group = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Group>(null!)
  const legL = useRef<THREE.Group>(null!)
  const legR = useRef<THREE.Group>(null!)
  const armL = useRef<THREE.Group>(null!)
  const armR = useRef<THREE.Group>(null!)

  // Per-instance mutable state — no per-frame allocation.
  const s = useRef({ vx: 0, vz: 0, facing: 0, phase: 0, prevSpeed: 0 })
  const reduce = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduce.current = mq.matches
    const onChange = () => {
      reduce.current = mq.matches
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const st = s.current
    const mv = useGameStore.getState().moveVector

    // Velocity: damp toward target (accelerate) or zero (decelerate).
    const moving = mv.x !== 0 || mv.z !== 0
    const lambda = moving ? ACCEL_LAMBDA : DECEL_LAMBDA
    st.vx = damp(st.vx, mv.x * MOVE_SPEED, lambda, dt)
    st.vz = damp(st.vz, mv.z * MOVE_SPEED, lambda, dt)

    // Axis-separated collision, X then Z — lets the player slide along walls.
    const pos = playerPosRef.current
    const nextX = pos.x + st.vx * dt
    if (worldColliders.canMoveTo(nextX, pos.z, PLAYER_RADIUS)) pos.x = nextX
    else st.vx = 0
    const nextZ = pos.z + st.vz * dt
    if (worldColliders.canMoveTo(pos.x, nextZ, PLAYER_RADIUS)) pos.z = nextZ
    else st.vz = 0

    const speed = Math.hypot(st.vx, st.vz)
    const speedRatio = speed / MOVE_SPEED

    // Facing: shortest-arc damp toward the movement direction.
    if (speed > 0.05) {
      const target = Math.atan2(st.vx, st.vz)
      let diff = target - st.facing
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      st.facing = damp(st.facing, st.facing + diff, TURN_LAMBDA, dt)
    }

    // Walk cycle: eased sin, opposite phase per limb, scaled by speed.
    st.phase += STRIDE_FREQ * speedRatio * dt
    const swing = Math.sin(st.phase) * 0.5 * speedRatio
    const swingOpp = Math.sin(st.phase + Math.PI) * 0.5 * speedRatio

    const accel = Math.abs(speed - st.prevSpeed) / Math.max(dt, 1e-4)
    const rm = reduce.current

    if (group.current) {
      group.current.position.set(pos.x, 0, pos.z)
      group.current.rotation.y = st.facing
    }
    if (body.current) {
      // Lean, bob and squash-stretch are decorative — off under reduced motion.
      body.current.rotation.x = rm ? 0 : LEAN_MAX * speedRatio
      body.current.position.y = rm ? 0 : Math.abs(Math.sin(st.phase)) * BOB_AMPLITUDE * speedRatio
      const sq = rm ? 0 : THREE.MathUtils.clamp(accel * 0.01, 0, 0.04)
      body.current.scale.set(1 - sq, 1 + sq, 1 - sq)
    }
    if (legL.current) legL.current.rotation.x = swing
    if (legR.current) legR.current.rotation.x = swingOpp
    if (armL.current) armL.current.rotation.x = swingOpp
    if (armR.current) armR.current.rotation.x = swing

    st.prevSpeed = speed
  })

  return (
    <group ref={group} position={[SPAWN.x, 0, SPAWN.z]}>
      <group ref={body}>
        {/* legs (pivot at hip) */}
        <group ref={legL} position={[-0.15, 0.7, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.22, 0.7, 0.26]} />
            <meshStandardMaterial color={PLAYER_COLORS.pants} />
          </mesh>
          <mesh position={[0, -0.72, 0.04]} castShadow>
            <boxGeometry args={[0.26, 0.14, 0.34]} />
            <meshStandardMaterial color={PLAYER_COLORS.shoes} />
          </mesh>
        </group>
        <group ref={legR} position={[0.15, 0.7, 0]}>
          <mesh position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.22, 0.7, 0.26]} />
            <meshStandardMaterial color={PLAYER_COLORS.pants} />
          </mesh>
          <mesh position={[0, -0.72, 0.04]} castShadow>
            <boxGeometry args={[0.26, 0.14, 0.34]} />
            <meshStandardMaterial color={PLAYER_COLORS.shoes} />
          </mesh>
        </group>

        {/* torso (hoodie) with accent zipper */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.56, 0.6, 0.34]} />
          <meshStandardMaterial color={PLAYER_COLORS.hoodie} />
        </mesh>
        <mesh position={[0, 1.0, 0.18]} castShadow>
          <boxGeometry args={[0.06, 0.5, 0.02]} />
          <meshStandardMaterial color={PLAYER_COLORS.accent} />
        </mesh>

        {/* arms (pivot at shoulder) */}
        <group ref={armL} position={[-0.36, 1.24, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.16, 0.52, 0.2]} />
            <meshStandardMaterial color={PLAYER_COLORS.hoodie} />
          </mesh>
        </group>
        <group ref={armR} position={[0.36, 1.24, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <boxGeometry args={[0.16, 0.52, 0.2]} />
            <meshStandardMaterial color={PLAYER_COLORS.hoodie} />
          </mesh>
        </group>

        {/* head, hair, glasses */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial color={PLAYER_COLORS.skin} />
        </mesh>
        <mesh position={[0, 1.67, -0.02]} castShadow>
          <boxGeometry args={[0.46, 0.2, 0.46]} />
          <meshStandardMaterial color={PLAYER_COLORS.hair} />
        </mesh>
        <mesh position={[0, 1.52, 0.22]}>
          <boxGeometry args={[0.52, 0.08, 0.05]} />
          <meshStandardMaterial color={PLAYER_COLORS.glasses} />
        </mesh>
      </group>
    </group>
  )
}
