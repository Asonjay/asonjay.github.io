import type { Object3D } from 'three'

// Procedural contextual emotes: each clip poses the player rig as a pure
// function of normalized time t in [0,1]. Same technique as the walk cycle — no
// animation library. Transient clips return to neutral at t=1 (envelope goes
// 0 -> peak -> 0); held clips (`type`, `sit`) ramp to a pose and hold it while
// the station panel stays open. The controller resets the rig to neutral each
// frame before calling pose(), so poses set absolute channel values.

export type EmoteId =
  | 'wave'
  | 'type'
  | 'sit'
  | 'lean'
  | 'pullBook'
  | 'sway'
  | 'mailbox'
  | 'scratch'
  | 'pullCord'
  | 'peek'

export type PlayerRig = {
  body: Object3D
  head: Object3D
  armL: Object3D
  armR: Object3D
  legL: Object3D
  legR: Object3D
  root: Object3D
}

export type EmoteClip = { duration: number; pose(t: number, rig: PlayerRig): void }

// Emotes that hold their final pose while the panel is open, rather than
// returning to neutral when the clip finishes.
export const HELD_EMOTES: ReadonlySet<EmoteId> = new Set<EmoteId>(['type', 'sit'])

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t)
const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
// There-and-back envelope: 0 at the ends, 1 at the middle.
const arc = (t: number) => Math.sin(Math.PI * easeInOutQuad(clamp01(t)))

// Player model fronts +z at rotation.y = 0; the iso camera sits at (+x,+z), so
// facing it means yaw = atan2(offsetX, offsetZ) = π/4 (offsets are equal).
const FACE_CAMERA = Math.PI / 4

const shortestArc = (from: number, to: number) => {
  const d = to - from
  return Math.atan2(Math.sin(d), Math.cos(d))
}

// Ease root yaw from its neutral facing (set by the controller) toward a target.
function faceTarget(rig: PlayerRig, t: number, target: number) {
  const base = rig.root.rotation.y
  rig.root.rotation.y = base + easeInOutQuad(clamp01(t)) * shortestArc(base, target)
}

export const EMOTES: Record<EmoteId, EmoteClip> = {
  // About — turn to the camera and wave.
  wave: {
    duration: 1.2,
    pose(t, rig) {
      const a = arc(t)
      faceTarget(rig, t, FACE_CAMERA)
      rig.armR.rotation.z = 1.9 * a
      rig.armR.rotation.x = Math.sin(t * Math.PI * 6) * 0.35 * a
      rig.head.rotation.x = -0.12 * a
      rig.body.position.y = 0.02 * a
    },
  },

  // Publications — sit down at the desk and settle in to type.
  type: {
    duration: 1.0,
    pose(t, rig) {
      const h = easeInOutQuad(clamp01(t))
      rig.body.position.y = -0.32 * h
      rig.legL.rotation.x = 1.45 * h
      rig.legR.rotation.x = 1.45 * h
      rig.armL.rotation.x = -1.1 * h
      rig.armR.rotation.x = -1.1 * h
      rig.head.rotation.x = 0.15 * h
    },
  },

  // Projects — drop onto the sofa and lean back.
  sit: {
    duration: 0.9,
    pose(t, rig) {
      const h = easeInOutQuad(clamp01(t))
      rig.body.position.y = -0.34 * h
      rig.body.rotation.x = -0.12 * h
      rig.legL.rotation.x = 1.4 * h
      rig.legR.rotation.x = 1.4 * h
      rig.armL.rotation.x = -0.25 * h
      rig.armR.rotation.x = -0.25 * h
      rig.head.rotation.x = -0.05 * h
    },
  },

  // News / Life — lean in and tilt the head to read.
  lean: {
    duration: 1.0,
    pose(t, rig) {
      const a = arc(t)
      rig.body.rotation.x = 0.28 * a
      rig.head.rotation.x = 0.12 * a
      rig.head.rotation.z = 0.15 * a
      rig.armR.rotation.x = -0.2 * a
    },
  },

  // Blog — tiptoe and reach up to pull a book off the shelf.
  pullBook: {
    duration: 1.3,
    pose(t, rig) {
      const a = arc(t)
      rig.body.position.y = 0.12 * a
      rig.armR.rotation.x = -2.5 * a
      rig.armR.rotation.z = -0.2 * a
      rig.head.rotation.x = -0.18 * a
    },
  },

  // Music — sway side to side to the beat.
  sway: {
    duration: 1.5,
    pose(t, rig) {
      const a = arc(t)
      const s = Math.sin(t * Math.PI * 4)
      rig.body.rotation.z = s * 0.18 * a
      rig.head.rotation.z = s * 0.12 * a
      rig.armL.rotation.z = -s * 0.3 * a
      rig.armR.rotation.z = -s * 0.3 * a
      rig.body.position.y = Math.abs(s) * 0.04 * a
    },
  },

  // Contact — reach out and flip the mailbox flag up.
  mailbox: {
    duration: 1.1,
    pose(t, rig) {
      const a = arc(t)
      rig.armR.rotation.x = -1.3 * a
      rig.body.rotation.x = 0.12 * a
      rig.head.rotation.x = 0.1 * a
    },
  },

  // Deadlines — scratch head, puzzled.
  scratch: {
    duration: 1.2,
    pose(t, rig) {
      const a = arc(t)
      rig.armR.rotation.z = 2.4 * a
      rig.armR.rotation.x = -0.3 * a + Math.sin(t * Math.PI * 8) * 0.15 * a
      rig.head.rotation.z = -0.12 * a
    },
  },

  // Lamp — reach up and yank the pull cord.
  pullCord: {
    duration: 1.0,
    pose(t, rig) {
      const a = arc(t)
      const yank = t > 0.45 && t < 0.6 ? Math.sin(((t - 0.45) / 0.15) * Math.PI) * 0.5 : 0
      rig.armR.rotation.x = -2.2 * a + yank
      rig.body.position.y = 0.06 * a
      rig.head.rotation.x = -0.1 * a
    },
  },

  // Classic — bend over the trash can and peek inside.
  peek: {
    duration: 1.2,
    pose(t, rig) {
      const a = arc(t)
      faceTarget(rig, t, FACE_CAMERA)
      rig.body.rotation.x = 0.5 * a
      rig.head.rotation.x = 0.3 * a
      rig.armL.rotation.x = -0.4 * a
      rig.armR.rotation.x = -0.4 * a
    },
  },
}

// Frozen station ids -> contextual emote (design spec §4.2).
export const STATION_EMOTE: Record<string, EmoteId> = {
  about: 'wave',
  publications: 'type',
  projects: 'sit',
  blog: 'pullBook',
  music: 'sway',
  news: 'lean',
  life: 'lean',
  contact: 'mailbox',
  deadlines: 'scratch',
  lamp: 'pullCord',
  classic: 'peek',
}

// Reset every channel an emote can touch back to neutral; keep root yaw at the
// supplied facing. Called by the controller before each pose() and once when an
// emote ends so locomotion resumes cleanly.
export function resetRig(rig: PlayerRig, facing: number) {
  rig.body.rotation.set(0, 0, 0)
  rig.body.position.set(0, 0, 0)
  rig.body.scale.set(1, 1, 1)
  rig.head.rotation.set(0, 0, 0)
  rig.armL.rotation.set(0, 0, 0)
  rig.armR.rotation.set(0, 0, 0)
  rig.legL.rotation.set(0, 0, 0)
  rig.legR.rotation.set(0, 0, 0)
  rig.root.rotation.y = facing
}
