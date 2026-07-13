'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorldData } from '../../../types/world'
import { useGameStore } from '../systems/store'
import { walkToStation } from '../systems/walkTo'
import { useIsTouch } from '../systems/useIsTouch'
import { STATION_SLOTS, SOCIAL_GLYPH } from './stationSlots'
import { IconSlot } from './kit/IconSlot'
import { UiButton } from './kit/UiButton'
import { UiDivider } from './kit/UiDivider'
import { IconPlay, IconSun, IconMoon, IconExternalLink } from './kit/icons'

// One station shortcut. Subscribes to only its own "nearby" flag so walking past
// stations re-renders just the entering/leaving slot, never the whole bar.
function StationSlot({
  slot,
  shaking,
  onActivate,
}: {
  slot: (typeof STATION_SLOTS)[number]
  shaking: boolean
  onActivate: (id: string) => void
}) {
  const active = useGameStore((s) => s.nearbyStationId === slot.id)
  const Icon = slot.Icon
  return (
    <IconSlot
      icon={<Icon />}
      label={slot.label}
      hotkey={slot.hotkey}
      active={active}
      onClick={() => onActivate(slot.id)}
      className={shaking ? 'gp-shake' : undefined}
    />
  )
}

export function Hotbar({
  data,
  isDark,
  onToggleTheme,
}: {
  data: WorldData
  isDark: boolean
  onToggleTheme: () => void
}) {
  const isTouch = useIsTouch()
  // Whether the viewport is md-up (Tailwind md = 768px), tracked live so the
  // number-key listener below can stand down whenever the bar itself is hidden.
  // The bar's visibility is `!isTouch && >=md` (touch -> null return; <md ->
  // `hidden md:block`), so the hotkeys must require BOTH conditions — otherwise a
  // non-touch window narrower than md keeps a ghost listener driving auto-walk
  // while the bar is invisible.
  const [isMdUp, setIsMdUp] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
    return window.matchMedia('(min-width: 768px)').matches
  })
  const [shakeId, setShakeId] = useState<string | null>(null)
  const shakeTimer = useRef<ReturnType<typeof setTimeout>>()

  // Flash a slot briefly when there's no route to its station (essentially never
  // in the sealed room, but the honest no-op feedback beats silence).
  const shake = useCallback((id: string) => {
    setShakeId(id)
    if (shakeTimer.current) clearTimeout(shakeTimer.current)
    shakeTimer.current = setTimeout(() => setShakeId(null), 220)
  }, [])

  useEffect(() => () => {
    if (shakeTimer.current) clearTimeout(shakeTimer.current)
  }, [])

  // Keep isMdUp in sync with live window resizes across the md boundary.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => setIsMdUp(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Path to a station and hand the route to the player (shared walk helper); the
  // slot shakes when there's no route.
  const walkTo = useCallback(
    (id: string) => {
      if (!walkToStation(id)) shake(id)
    },
    [shake]
  )

  // Slot click / hotkey. Pressing the station whose panel is already open just
  // closes it (toggle); anything else walks (switching mid-panel is allowed).
  const activate = useCallback(
    (id: string) => {
      const g = useGameStore.getState()
      if (g.openPanelId === id) {
        g.openPanel(null)
        return
      }
      walkTo(id)
    },
    [walkTo]
  )

  const openMusic = useCallback(() => useGameStore.getState().openPanel('music'), [])

  // Number-key hotkeys 1–9,0. Ignored on auto-repeat and while typing in a field
  // (none exist in-game, but guard anyway). Bound only when the bar is actually
  // shown — non-touch AND md-up — so a hidden bar (touch, or a window below md)
  // never swallows number keys.
  useEffect(() => {
    if (isTouch || !isMdUp) return
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      const t = e.target
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return
      let idx = -1
      if (e.key >= '1' && e.key <= '9') idx = e.key.charCodeAt(0) - 49
      else if (e.key === '0') idx = 9
      else return
      const slot = STATION_SLOTS[idx]
      if (slot) activate(slot.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activate, isTouch, isMdUp])

  // Touch devices get the mobile chrome (Joystick / InteractButton / HotbarSheet)
  // instead of this bar; the number-key listener above is already stood down.
  if (isTouch) return null

  return (
    <div
      // Desktop bar. Hidden below md (and stood down entirely on touch, above);
      // touch/small screens get the HotbarSheet menu instead.
      className="hidden md:block"
      style={{ position: 'fixed', left: '50%', bottom: 16, transform: 'translateX(-50%)', zIndex: 30 }}
    >
      <div
        className="gp-corners-lg gp-surface"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          padding: '8px 10px',
          maxWidth: 'calc(100vw - 24px)',
        }}
      >
        {STATION_SLOTS.map((slot) => (
          <StationSlot
            key={slot.id}
            slot={slot}
            shaking={shakeId === slot.id}
            onActivate={activate}
          />
        ))}

        <UiDivider orientation="vertical" />

        <IconSlot icon={<IconPlay />} label="Music" onClick={openMusic} />
        <IconSlot
          icon={isDark ? <IconMoon /> : <IconSun />}
          label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={onToggleTheme}
        />

        <UiDivider orientation="vertical" />

        {data.social.map((link) => {
          const G = SOCIAL_GLYPH[link.icon]
          return (
            <IconSlot
              key={link.label}
              icon={G ? <G /> : null}
              label={link.label}
              href={link.url}
            />
          )
        })}

        <UiButton href={data.cvUrl} newTab aria-label="CV (opens in a new tab)">
          <IconExternalLink />
          <span>CV</span>
        </UiButton>
      </div>
    </div>
  )
}
