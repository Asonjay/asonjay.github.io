'use client'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, playerPosRef } from '../systems/store'
import { worldColliders, SPAWN } from '../systems/worldLayout'
import { reducedMotionRef } from '../systems/reducedMotion'
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
import {
  EMOTES,
  STATION_EMOTE,
  HELD_EMOTES,
  resetRig,
  type EmoteId,
  type PlayerRig,
} from './emotes'
import { footstepDust } from './FootstepDust'

const damp = THREE.MathUtils.damp

export function Player() {
  const group = useRef<THREE.Group>(null!)
  const body = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Group>(null!)
  const legL = useRef<THREE.Group>(null!)
  const legR = useRef<THREE.Group>(null!)
  const armL = useRef<THREE.Group>(null!)
  const armR = useRef<THREE.Group>(null!)

  // Per-instance mutable state — no per-frame allocation.
  const s = useRef({
    vx: 0,
    vz: 0,
    facing: 0,
    phase: 0,
    prevSpeed: 0,
    prevSin: 0,
    emoteTime: 0,
    firedPanel: false,
    firedToggle: false,
    pendingStation: null as string | null,
    wasEmoting: false,
  })
  const rig = useRef<PlayerRig | null>(null)

  // Contextual-emote controller: E/Enter near a station plays its emote (the
  // panel opens at 60%, wired by the frame loop); Esc cancels an in-flight emote
  // (PanelHost owns Esc once a panel is actually open).
  // Under reduced motion the emote is skipped and the panel opens immediately.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const g = useGameStore.getState()
      if (k === 'escape') {
        // PanelHost owns Escape while a panel is open — stand down so one press
        // is one close. Before a panel opens (emote still playing toward its
        // 60% mark), Esc still cancels the in-flight emote.
        if (g.openPanelId !== null) return
        if (g.activeEmote !== null) {
          g.setActiveEmote(null)
          s.current.emoteTime = 0
          s.current.firedPanel = false
          s.current.firedToggle = false
          s.current.pendingStation = null
        }
        return
      }
      if (k !== 'e' && k !== 'enter') return
      if (g.openPanelId !== null || g.activeEmote !== null) return
      const near = g.nearbyStationId
      if (!near) return
      const emote = STATION_EMOTE[near]
      if (!emote) return
      if (reducedMotionRef.current) {
        // Skip the emote but still perform its action: the lamp toggles the
        // theme, every other station opens its panel.
        if (near === 'lamp') g.requestThemeToggle()
        else g.openPanel(near)
        return
      }
      s.current.pendingStation = near
      s.current.emoteTime = 0
      s.current.firedPanel = false
      s.current.firedToggle = false
      g.setActiveEmote(emote)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const st = s.current
    const g = useGameStore.getState()

    // Assemble the rig once all refs are live.
    if (
      !rig.current &&
      group.current &&
      body.current &&
      head.current &&
      armL.current &&
      armR.current &&
      legL.current &&
      legR.current
    ) {
      rig.current = {
        root: group.current,
        body: body.current,
        head: head.current,
        armL: armL.current,
        armR: armR.current,
        legL: legL.current,
        legR: legR.current,
      }
    }

    const pos = playerPosRef.current
    const emote = g.activeEmote as EmoteId | null

    // --- Emote branch: freeze locomotion and play the pose clip. ---
    if (emote && rig.current && EMOTES[emote]) {
      st.vx = 0
      st.vz = 0
      const clip = EMOTES[emote]
      st.emoteTime += dt
      const held = HELD_EMOTES.has(emote)
      const u = st.emoteTime / clip.duration
      const t = u > 1 ? 1 : u

      resetRig(rig.current, st.facing)
      clip.pose(t, rig.current)

      // Lamp: no panel — flip the site day/night theme at the cord's yank (50%).
      if (!st.firedToggle && st.pendingStation === 'lamp' && t >= 0.5) {
        st.firedToggle = true
        g.requestThemeToggle()
      }

      if (!st.firedPanel && t >= 0.6) {
        st.firedPanel = true
        if (st.pendingStation && st.pendingStation !== 'lamp') g.openPanel(st.pendingStation)
      }

      if (t >= 1 && (!held || g.openPanelId === null)) {
        st.facing = rig.current.root.rotation.y
        g.setActiveEmote(null)
        st.emoteTime = 0
        st.firedPanel = false
        st.firedToggle = false
        st.pendingStation = null
      }

      if (group.current) group.current.position.set(pos.x, 0, pos.z)
      st.wasEmoting = true
      st.prevSpeed = 0
      st.prevSin = 0
      return
    }

    // Returning from an emote: reset every posed channel to neutral once.
    if (st.wasEmoting) {
      if (rig.current) resetRig(rig.current, st.facing)
      st.wasEmoting = false
    }

    // --- Locomotion. ---
    const mv = g.moveVector
    const moving = mv.x !== 0 || mv.z !== 0
    const lambda = moving ? ACCEL_LAMBDA : DECEL_LAMBDA
    st.vx = damp(st.vx, mv.x * MOVE_SPEED, lambda, dt)
    st.vz = damp(st.vz, mv.z * MOVE_SPEED, lambda, dt)

    // Axis-separated collision, X then Z — lets the player slide along walls.
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

    // Footstep dust on stride zero-crossings (each foot plant) while moving.
    const sinP = Math.sin(st.phase)
    if (
      !reducedMotionRef.current &&
      speed > 1.2 &&
      st.prevSin !== 0 &&
      Math.sign(sinP) !== Math.sign(st.prevSin)
    ) {
      footstepDust.emit?.(pos.x, pos.z)
    }
    st.prevSin = sinP

    const accel = Math.abs(speed - st.prevSpeed) / Math.max(dt, 1e-4)
    const rm = reducedMotionRef.current

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

        {/* head group (pivot at neck) — hair, glasses ride along for emotes */}
        <group ref={head} position={[0, 1.32, 0]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshStandardMaterial color={PLAYER_COLORS.skin} />
          </mesh>
          <mesh position={[0, 0.35, -0.02]} castShadow>
            <boxGeometry args={[0.46, 0.2, 0.46]} />
            <meshStandardMaterial color={PLAYER_COLORS.hair} />
          </mesh>
          <mesh position={[0, 0.2, 0.22]}>
            <boxGeometry args={[0.52, 0.08, 0.05]} />
            <meshStandardMaterial color={PLAYER_COLORS.glasses} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
