// Attract-mode helpers for the homepage VoxelTile — the character wanders the
// study on his own and waves when the tile is hovered/focused. Pure module: it
// imports only the station→emote map (a plain object; emotes.ts type-imports
// three, so nothing here pulls in three/react/next at runtime) and is unit-tested
// in tests/game/attract.test.ts. No per-frame work lives here — VoxelTile's
// driver ticks a tiny ref state machine and calls walkToStation on transitions.

import { STATION_EMOTE, type EmoteId } from '../scene/emotes'

// The resolved effect of arriving at a station, computed by `arrivalEffects` and
// executed by Player.startInteract. `immediate` is used when there is no emote to
// play (unknown station or reduced motion) — it fires the interaction at once;
// otherwise the emote plays and `pendingStation` drives the panel/theme side
// effect at the clip's peak (null suppresses it — the attract-mode case).
export type ArrivalPlan = {
  emote: EmoteId | null
  pendingStation: string | null
  immediate: { openPanel?: string; toggleTheme?: boolean } | null
}

// Single source of truth for what an auto-walk arrival does. Mirrors the original
// startInteract branching for normal play, and adds the attract-mode suppression:
// when attractMode is true the station emote still plays (contextual delight) but
// NO panel opens and the lamp does NOT flip the site theme — in every branch,
// including reduced motion. Kept pure so the suppression rule ("attract arrival
// never opens a panel or toggles the theme") is provable by unit test.
export function arrivalEffects(
  attractMode: boolean,
  stationId: string,
  reducedMotion: boolean
): ArrivalPlan {
  const emote = STATION_EMOTE[stationId] ?? null
  if (!emote || reducedMotion) {
    // Nothing to animate: the interaction (if any) happens immediately. Attract
    // mode performs no interaction at all.
    if (attractMode) return { emote: null, pendingStation: null, immediate: null }
    if (stationId === 'lamp')
      return { emote: null, pendingStation: null, immediate: { toggleTheme: true } }
    return { emote: null, pendingStation: null, immediate: { openPanel: stationId } }
  }
  // The emote plays; pendingStation drives the delayed panel/theme side effect at
  // the emote's peak — suppressed (null) under attract mode.
  return { emote, pendingStation: attractMode ? null : stationId, immediate: null }
}

// Deterministic PRNG (mulberry32) so a mount's wander sequence is reproducible
// from its seed — no Math.random, no allocation beyond the returned closure.
export function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Pick the next wander target: a uniform choice among `ids`, never repeating the
// current one (so the character always moves somewhere new). Called only on a
// walk→dwell transition, never per frame.
export function pickNextStation(
  ids: readonly string[],
  current: string | null,
  rand: () => number
): string {
  if (ids.length === 0) return current ?? ''
  if (ids.length === 1) return ids[0]
  let idx = Math.floor(rand() * ids.length)
  if (idx >= ids.length) idx = ids.length - 1 // guard the rand()===1 edge
  if (ids[idx] === current) idx = (idx + 1) % ids.length
  return ids[idx]
}
