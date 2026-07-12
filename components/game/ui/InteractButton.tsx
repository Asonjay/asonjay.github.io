'use client'
import { useGameStore } from '../systems/store'
import { useIsTouch } from '../systems/useIsTouch'
import { IconExclaim } from './kit/icons'

// Fixed bottom-right touch button, shown only when the player is standing at a
// station and no panel is open. Tapping it runs the SAME contextual interaction
// the E key does: it bumps the store's interactRequests counter, which Player
// consumes in its frame loop against the current nearby station. No interact
// logic lives here.
export function InteractButton() {
  const isTouch = useIsTouch()
  const nearby = useGameStore((s) => s.nearbyStationId)
  const openPanelId = useGameStore((s) => s.openPanelId)
  const requestInteract = useGameStore((s) => s.requestInteract)

  if (!isTouch || !nearby || openPanelId) return null

  return (
    <button
      type="button"
      aria-label="Interact"
      onClick={() => requestInteract()}
      className="gp-corners gp-pop"
      style={{
        position: 'fixed',
        right: 'calc(20px + env(safe-area-inset-right))',
        bottom: 'calc(28px + env(safe-area-inset-bottom))',
        width: 64,
        height: 64,
        zIndex: 31,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        cursor: 'pointer',
        border: 'none',
        background: 'var(--gp-accent)',
        color: '#111321',
        boxShadow: 'inset 0 0 0 2px var(--gp-accent), 0 4px 14px -4px var(--gp-glow)',
        touchAction: 'manipulation',
      }}
    >
      <IconExclaim />
    </button>
  )
}
