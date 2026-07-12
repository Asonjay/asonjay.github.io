'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import type { WorldData } from '../../../types/world'
import { useGameStore, playerPosRef } from '../systems/store'
import { STATIONS, makeGrid } from '../systems/worldLayout'
import { findPath } from '../systems/pathfinding'
import { IconSlot } from './kit/IconSlot'
import { PixelButton } from './kit/PixelButton'
import { PixelDivider } from './kit/PixelDivider'
import {
  IconIdCard,
  IconDesk,
  IconNewspaper,
  IconGamepad,
  IconBook,
  IconNote,
  IconPhoto,
  IconEnvelope,
  IconCalendar,
  IconTrash,
  IconPlay,
  IconSun,
  IconMoon,
  IconExternalLink,
} from './kit/icons'
import {
  MailAt24,
  GoogleScholar24,
  GitHub24,
  Twitter24,
  LinkedIn24,
} from '../../icons'

type Glyph = ComponentType<{ className?: string }>

// The ten station shortcuts, left-to-right, with their number hotkeys. Order and
// hotkeys are the F5 contract; icons mirror each station's in-world furniture so
// the bar reads as a map of the room.
const STATION_SLOTS: { id: string; label: string; hotkey: string; Icon: Glyph }[] = [
  { id: 'about', label: 'About', hotkey: '1', Icon: IconIdCard },
  { id: 'publications', label: 'Publications', hotkey: '2', Icon: IconDesk },
  { id: 'news', label: 'News', hotkey: '3', Icon: IconNewspaper },
  { id: 'projects', label: 'Projects', hotkey: '4', Icon: IconGamepad },
  { id: 'blog', label: 'Blog', hotkey: '5', Icon: IconBook },
  { id: 'music', label: 'Music', hotkey: '6', Icon: IconNote },
  { id: 'life', label: 'Life', hotkey: '7', Icon: IconPhoto },
  { id: 'contact', label: 'Contact', hotkey: '8', Icon: IconEnvelope },
  { id: 'deadlines', label: 'Deadlines', hotkey: '9', Icon: IconCalendar },
  { id: 'classic', label: 'Classic Site', hotkey: '0', Icon: IconTrash },
]

// WorldData social `icon` keys -> the classic SVG glyphs (reused per the global
// constraint — socials are the one place the game does not draw new kit icons).
const SOCIAL_GLYPH: Record<string, Glyph> = {
  email: MailAt24,
  scholar: GoogleScholar24,
  github: GitHub24,
  twitter: Twitter24,
  linkedin: LinkedIn24,
}

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

  // Path to a station and hand the route to the player; any open panel is closed
  // first so a shortcut can interrupt/switch.
  const walkTo = useCallback(
    (id: string) => {
      const station = STATIONS.find((s) => s.id === id)
      if (!station) return
      const g = useGameStore.getState()
      if (g.openPanelId !== null) g.openPanel(null)
      const path = findPath(makeGrid(), playerPosRef.current, station.anchor)
      if (!path) {
        shake(id)
        return
      }
      g.setAutoWalk({ targetStationId: id, path })
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
  // (none exist in-game, but guard anyway). Listener is added once and removed on
  // unmount.
  useEffect(() => {
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
  }, [activate])

  return (
    <div
      // Desktop only for now; the mobile sheet is Task 6.
      className="hidden md:block"
      style={{ position: 'fixed', left: '50%', bottom: 16, transform: 'translateX(-50%)', zIndex: 30 }}
    >
      <div
        className="gp-corners gp-surface"
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

        <PixelDivider orientation="vertical" />

        <IconSlot icon={<IconPlay />} label="Music" onClick={openMusic} />
        <IconSlot
          icon={isDark ? <IconMoon /> : <IconSun />}
          label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={onToggleTheme}
        />

        <PixelDivider orientation="vertical" />

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

        <PixelButton href={data.cvUrl} newTab aria-label="CV (opens in a new tab)">
          <IconExternalLink />
          <span>CV</span>
        </PixelButton>
      </div>
    </div>
  )
}
