import { describe, it, expect } from 'vitest'
import { arrivalEffects, pickNextStation, makeRng } from '../../components/game/systems/attract'
import { STATION_EMOTE } from '../../components/game/scene/emotes'
import { STATIONS } from '../../components/game/systems/worldLayout'
import { useGameStore } from '../../components/game/systems/store'

// The homepage tile is the ONLY thing that flips attractMode; /study never does.
describe('store attract defaults', () => {
  it('attractMode is off and waveRequests is 0 by default', () => {
    const s = useGameStore.getState()
    expect(s.attractMode).toBe(false)
    expect(s.waveRequests).toBe(0)
  })
})

// attractMode=false must behave exactly like the original startInteract branching.
describe('arrivalEffects — normal play (attractMode false)', () => {
  it('station with an emote: plays it, defers the panel via pendingStation', () => {
    expect(arrivalEffects(false, 'about', false)).toEqual({
      emote: 'wave',
      pendingStation: 'about',
      immediate: null,
    })
  })
  it('lamp with motion: plays pullCord, defers the theme flip via pendingStation', () => {
    expect(arrivalEffects(false, 'lamp', false)).toEqual({
      emote: 'pullCord',
      pendingStation: 'lamp',
      immediate: null,
    })
  })
  it('reduced motion, normal station: opens the panel immediately, no emote', () => {
    expect(arrivalEffects(false, 'about', true)).toEqual({
      emote: null,
      pendingStation: null,
      immediate: { openPanel: 'about' },
    })
  })
  it('reduced motion, lamp: toggles the theme immediately, no emote', () => {
    expect(arrivalEffects(false, 'lamp', true)).toEqual({
      emote: null,
      pendingStation: null,
      immediate: { toggleTheme: true },
    })
  })
})

// The core suppression rule: in attract mode an arrival NEVER opens a panel or
// toggles the theme, for every station — the contextual emote still plays.
describe('arrivalEffects — attract mode never opens a panel or toggles the theme', () => {
  for (const st of STATIONS) {
    it(`${st.id}: plays its emote, no panel / no theme side effect`, () => {
      const plan = arrivalEffects(true, st.id, false)
      expect(plan.emote).toBe(STATION_EMOTE[st.id])
      expect(plan.pendingStation).toBeNull() // no deferred panel/theme
      expect(plan.immediate).toBeNull() // no immediate panel/theme
    })
    it(`${st.id}: reduced motion → nothing at all`, () => {
      expect(arrivalEffects(true, st.id, true)).toEqual({
        emote: null,
        pendingStation: null,
        immediate: null,
      })
    })
  }
})

describe('pickNextStation', () => {
  const ids = ['a', 'b', 'c']
  it('never repeats the current station', () => {
    const rand = makeRng(1)
    for (let i = 0; i < 200; i++) {
      expect(pickNextStation(ids, 'b', rand)).not.toBe('b')
    }
  })
  it('always returns an id from the pool', () => {
    const rand = makeRng(42)
    for (let i = 0; i < 200; i++) {
      expect(ids).toContain(pickNextStation(ids, null, rand))
    }
  })
  it('handles a single-element pool', () => {
    expect(pickNextStation(['only'], 'only', makeRng(7))).toBe('only')
  })
})
