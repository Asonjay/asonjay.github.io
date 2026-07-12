import { create } from 'zustand'
import { SPAWN } from './worldLayout'

export type GameState = {
  moveVector: { x: number; z: number }
  autoWalk: { targetStationId: string; path: { x: number; z: number }[] } | null
  facing: number
  activeEmote: string | null
  nearbyStationId: string | null
  openPanelId: string | null
  hasSeenWelcome: boolean
  setMoveVector(v: { x: number; z: number }): void
  setAutoWalk(a: GameState['autoWalk']): void
  setNearbyStation(id: string | null): void
  openPanel(id: string | null): void
  setActiveEmote(id: string | null): void
  markWelcomeSeen(): void
}

export const useGameStore = create<GameState>((set) => ({
  moveVector: { x: 0, z: 0 },
  autoWalk: null,
  facing: 0,
  activeEmote: null,
  nearbyStationId: null,
  openPanelId: null,
  hasSeenWelcome: false,
  setMoveVector: (v) => set({ moveVector: v }),
  setAutoWalk: (a) => set({ autoWalk: a }),
  setNearbyStation: (id) => set({ nearbyStationId: id }),
  openPanel: (id) => set({ openPanelId: id }),
  setActiveEmote: (id) => set({ activeEmote: id }),
  markWelcomeSeen: () => set({ hasSeenWelcome: true }),
}))

// Transient player position: read/written every frame without triggering
// re-renders. CameraRig follows it; Player owns the writes.
export const playerPosRef = { current: { x: SPAWN.x, z: SPAWN.z } }

// Transient nameplate projection: scene/Systems writes the nearby station's
// screen-space position each frame; ui/NameplateBubble reads it via rAF. Kept
// off the store state so it never triggers a React re-render per frame.
export const nameplateRef = {
  current: { visible: false, x: 0, y: 0, id: null as string | null },
}
