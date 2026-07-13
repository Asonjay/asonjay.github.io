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
  // Transient signal: the in-canvas lamp station can't touch the DOM theme hook,
  // so it bumps this counter; a VoxelHome-level effect flips the real site theme
  // once per increment. No theme value is stored here (source of truth stays
  // useDarkMode / localStorage `dark-mode`).
  themeToggleRequests: number
  // Transient signal: the touch interact button and tap-to-interact can't run
  // the keyboard path, so they bump this counter; Player consumes each bump in
  // its frame loop and runs the same contextual interaction the E key does
  // against the current nearby station. Mirrors themeToggleRequests.
  interactRequests: number
  // Attract mode: the homepage bento GameTile embeds a slim, self-playing scene
  // (components/game/VoxelTile). While true, auto-walk ARRIVAL plays the station
  // emote but opens NO panel and flips NO theme (see systems/attract.ts
  // `arrivalEffects` + Player's `startInteract`). Default false, so /study
  // (VoxelHome, which never sets it) behaves exactly as before.
  attractMode: boolean
  // Transient signal (mirrors interactRequests): the homepage tile bumps this on
  // hover / focus-visible and Player plays the wave emote once per increment.
  // Tile-only — never bumped on /study, and gated on attractMode in Player.
  waveRequests: number
  setMoveVector(v: { x: number; z: number }): void
  setAutoWalk(a: GameState['autoWalk']): void
  setNearbyStation(id: string | null): void
  openPanel(id: string | null): void
  setActiveEmote(id: string | null): void
  markWelcomeSeen(): void
  requestThemeToggle(): void
  requestInteract(): void
  setAttractMode(on: boolean): void
  requestWave(): void
}

export const useGameStore = create<GameState>((set) => ({
  moveVector: { x: 0, z: 0 },
  autoWalk: null,
  facing: 0,
  activeEmote: null,
  nearbyStationId: null,
  openPanelId: null,
  hasSeenWelcome: false,
  themeToggleRequests: 0,
  interactRequests: 0,
  attractMode: false,
  waveRequests: 0,
  setMoveVector: (v) => set({ moveVector: v }),
  setAutoWalk: (a) => set({ autoWalk: a }),
  setNearbyStation: (id) => set({ nearbyStationId: id }),
  openPanel: (id) => set({ openPanelId: id }),
  setActiveEmote: (id) => set({ activeEmote: id }),
  markWelcomeSeen: () => set({ hasSeenWelcome: true }),
  requestThemeToggle: () => set((s) => ({ themeToggleRequests: s.themeToggleRequests + 1 })),
  requestInteract: () => set((s) => ({ interactRequests: s.interactRequests + 1 })),
  setAttractMode: (on) => set({ attractMode: on }),
  requestWave: () => set((s) => ({ waveRequests: s.waveRequests + 1 })),
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
