import { useGameStore, playerPosRef } from './store'
import { STATIONS, makeGrid } from './worldLayout'
import { findPath } from './pathfinding'

// Path to a station's anchor and hand the route to the player as an auto-walk
// (Player fires the station's contextual interaction on arrival). Any open panel
// is closed first so a shortcut can interrupt/switch. Returns false when the id
// is unknown or no route exists, leaving it to the caller to signal the dead end
// (the hotbar shakes the slot; tap/menu simply no-op). Shared by the desktop
// hotbar, mobile tap-to-interact and the mobile menu so the walk path has ONE
// implementation. Impure (touches the store) but pulls in no three/react/next.
export function walkToStation(id: string): boolean {
  const station = STATIONS.find((s) => s.id === id)
  if (!station) return false
  const g = useGameStore.getState()
  if (g.openPanelId !== null) g.openPanel(null)
  // Cancel any in-flight emote so a shortcut retargets cleanly — otherwise the
  // emote's frame loop would still fire the old station's panel at its 60% mark.
  if (g.activeEmote !== null) g.setActiveEmote(null)
  const path = findPath(makeGrid(), playerPosRef.current, station.anchor)
  if (!path) return false
  g.setAutoWalk({ targetStationId: id, path })
  return true
}
