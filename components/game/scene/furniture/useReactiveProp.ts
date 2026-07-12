'use client'
import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Object3D } from 'three'
import { playerPosRef, useGameStore } from '../../systems/store'
import { reducedMotionRef } from '../../systems/reducedMotion'
import { DELTA_CLAMP } from '../../systems/playerConfig'
import type { AABB } from '../../systems/collision'
import type { EmoteId } from '../emotes'

type ReactiveOpts = {
  ref: MutableRefObject<Object3D | null>
  axis: 'x' | 'y' | 'z'
  // Player-overlap box (world XZ). Make it a touch larger than the prop so a
  // player pressed against a solid piece still trips it. Omit for props that
  // only open on an emote (e.g. the mailbox flag).
  trigger?: AABB
  impulse?: number // angular velocity kick when the player enters the trigger
  emoteOpen?: EmoteId // hold `restOpen` while this emote plays
  restOpen?: number // open angle (radians) on the chosen axis
  k?: number // spring stiffness
  c?: number // spring damping
}

// Spring-damped rotation for a reactive prop: a one-shot wobble when the player
// bumps it, and/or an eased open/close driven by a contextual emote (trash lid
// on `peek`, mailbox flag on `mailbox`). Pooled per-instance state — no
// per-frame allocation. All motion is suppressed under reduced motion.
export function useReactiveProp({
  ref,
  axis,
  trigger,
  impulse = 0,
  emoteOpen,
  restOpen = 0,
  k = 90,
  c = 8,
}: ReactiveOpts) {
  const s = useRef({ angle: 0, vel: 0, inside: false })

  useFrame((_, rawDelta) => {
    const obj = ref.current
    if (!obj) return
    const dt = Math.min(rawDelta, DELTA_CLAMP)
    const st = s.current
    const p = playerPosRef.current

    const rest =
      emoteOpen && useGameStore.getState().activeEmote === emoteOpen ? restOpen : 0

    const inside =
      !!trigger &&
      p.x > trigger.minX &&
      p.x < trigger.maxX &&
      p.z > trigger.minZ &&
      p.z < trigger.maxZ
    if (inside && !st.inside && impulse !== 0 && !reducedMotionRef.current) st.vel += impulse
    st.inside = inside

    const accel = -k * (st.angle - rest) - c * st.vel
    st.vel += accel * dt
    st.angle += st.vel * dt
    obj.rotation[axis] = st.angle
  })
}
