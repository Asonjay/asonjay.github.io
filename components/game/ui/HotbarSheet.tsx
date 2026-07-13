'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { WorldData } from '../../../types/world'
import { useGameStore } from '../systems/store'
import { useIsTouch } from '../systems/useIsTouch'
import { walkToStation } from '../systems/walkTo'
import { STATION_SLOTS, SOCIAL_GLYPH } from './stationSlots'
import { IconSlot } from './kit/IconSlot'
import { UiButton } from './kit/UiButton'
import { UiDivider } from './kit/UiDivider'
import { IconPlay, IconSun, IconMoon, IconExternalLink, IconMenu, IconClose } from './kit/icons'

// Mobile replacement for the desktop Hotbar: a single menu button (bottom-center,
// between the joystick and the interact button) that fans out a bottom sheet with
// the 10 station shortcuts (2x5), a controls row (music, theme) and a socials row
// + CV. Picking a station closes the sheet and walks there (shared walkToStation).
// Backdrop tap or Escape closes. Touch-only; renders nothing on desktop.
export function HotbarSheet({
  data,
  isDark,
  onToggleTheme,
}: {
  data: WorldData
  isDark: boolean
  onToggleTheme: () => void
}) {
  const isTouch = useIsTouch()
  const openPanelId = useGameStore((s) => s.openPanelId)
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // Escape closes; focus moves into the sheet on open and back to the body after.
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    sheetRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (prev && document.contains(prev) && typeof prev.focus === 'function') prev.focus()
    }
  }, [open])

  if (!isTouch) return null

  const goStation = (id: string) => {
    setOpen(false)
    walkToStation(id)
  }
  const openMusic = () => {
    setOpen(false)
    useGameStore.getState().openPanel('music')
  }

  if (!open) {
    // A panel's backdrop covers the button; hide it so it can't be tapped
    // through, mirroring InteractButton.
    if (openPanelId) return null
    return (
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={false}
        onClick={() => setOpen(true)}
        style={menuButtonStyle}
      >
        <IconMenu />
      </button>
    )
  }

  return (
    <div
      className="gp-backdrop"
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="gp-surface gp-corners-lg gp-sheet"
        style={{
          width: '100%',
          maxWidth: '32rem',
          maxHeight: '80dvh',
          overflowY: 'auto',
          outline: 'none',
          padding: '14px 14px calc(14px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--gp-text)',
            }}
          >
            Menu
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="gp-corners gp-lift"
            style={closeButtonStyle}
          >
            <IconClose />
          </button>
        </div>

        {/* 10 stations, 2 rows x 5 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            justifyItems: 'center',
            gap: 8,
          }}
        >
          {STATION_SLOTS.map((slot) => {
            const Icon = slot.Icon
            return (
              <IconSlot
                key={slot.id}
                icon={<Icon />}
                label={slot.label}
                onClick={() => goStation(slot.id)}
              />
            )
          })}
        </div>

        <UiDivider />

        {/* controls: music + theme */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <IconSlot icon={<IconPlay />} label="Music" onClick={openMusic} />
          <IconSlot
            icon={isDark ? <IconMoon /> : <IconSun />}
            label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={onToggleTheme}
          />
        </div>

        <UiDivider />

        {/* socials + CV */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {data.social.map((link) => {
            const G = SOCIAL_GLYPH[link.icon]
            return <IconSlot key={link.label} icon={G ? <G /> : null} label={link.label} href={link.url} />
          })}
          <UiButton href={data.cvUrl} newTab aria-label="CV (opens in a new tab)">
            <IconExternalLink />
            <span>CV</span>
          </UiButton>
        </div>
      </div>
    </div>
  )
}

// A round FAB — circular to match the joystick and read as a warm action button.
const menuButtonStyle: CSSProperties = {
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: 'calc(20px + env(safe-area-inset-bottom))',
  width: 52,
  height: 52,
  zIndex: 31,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  cursor: 'pointer',
  background: 'var(--gp-bg)',
  color: 'var(--gp-text)',
  border: '1px solid var(--gp-border)',
  borderRadius: '50%',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.22)',
  touchAction: 'manipulation',
}

const closeButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 30,
  fontSize: 16,
  padding: 0,
  cursor: 'pointer',
  background: 'var(--gp-bg)',
  color: 'var(--gp-text)',
  border: '1px solid var(--gp-border)',
}
