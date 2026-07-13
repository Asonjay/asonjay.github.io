import Link from 'next/link'
import type { ReactNode } from 'react'

// Fixed deep-navy palette — the tile reads as a little "screen" in BOTH themes
// (it previews the night-lit voxel study and pre-frames the live canvas Task 15
// drops in), so it deliberately does NOT follow the light/dark tokens.
const NAVY = {
  card: '#0e1226',
  screen: '#0a0e20',
  border: 'rgba(124, 154, 255, 0.5)',
  text: '#f2f4ff',
  muted: 'rgba(242, 244, 255, 0.72)',
  accent: '#7c9aff',
  ink: '#111321',
}

export type GameTileProps = {
  href?: string
  title?: string
  caption?: string
  // Shows the LIVE badge (a static dot + label this task — no pulse yet).
  live?: boolean
  // Task 15 seam: pass the live voxel canvas and it fills the screen area,
  // replacing the static preview. The grid renders <GameTile /> and never has to
  // change when the canvas arrives.
  children?: ReactNode
}

// Static isometric-cube mark centered in the preview screen (CSS/SVG only — no
// three here; the home tree stays three-free until Task 15).
function VoxelMark() {
  return (
    <svg
      width="46"
      height="46"
      viewBox="0 0 48 48"
      fill="none"
      stroke={NAVY.accent}
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ opacity: 0.85 }}
    >
      <path d="M24 6 42 16 42 32 24 42 6 32 6 16Z" />
      <path d="M24 6 24 24 42 16" />
      <path d="M24 24 24 42" />
      <path d="M24 24 6 16" />
    </svg>
  )
}

export function GameTile({
  href = '/study',
  title = "Jason's Voxel Study",
  caption = 'A walkable voxel study & courtyard.',
  live = true,
  children,
}: GameTileProps) {
  return (
    <div
      className="home-corners-lg home-card home-area-game"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        padding: 16,
        background: NAVY.card,
        color: NAVY.text,
        border: `1px solid ${NAVY.border}`,
        boxShadow: 'var(--home-shadow-panel)',
      }}
    >
      {/* Preview screen. Task 15 fills this with the live canvas via children. */}
      <div
        className="home-corners"
        style={{
          position: 'relative',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          background: NAVY.screen,
          border: `1px solid ${NAVY.border}`,
          backgroundImage: children
            ? undefined
            : 'radial-gradient(circle at 50% 42%, rgba(124,154,255,0.16), transparent 60%), radial-gradient(rgba(124,154,255,0.16) 1px, transparent 1px)',
          backgroundSize: children ? undefined : 'auto, 14px 14px',
        }}
      >
        {live ? (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 9px',
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: NAVY.text,
              background: 'rgba(10, 14, 32, 0.72)',
              border: `1px solid ${NAVY.border}`,
              zIndex: 2,
            }}
          >
            <span
              className="home-live-dot"
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: NAVY.accent,
                boxShadow: `0 0 6px ${NAVY.accent}`,
              }}
              aria-hidden="true"
            />
            LIVE
          </span>
        ) : null}

        {children ?? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <VoxelMark />
          </div>
        )}
      </div>

      <h2
        style={{
          margin: '14px 0 0',
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1.2,
          color: NAVY.text,
        }}
      >
        {title}
      </h2>
      <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.45, color: NAVY.muted }}>
        {caption}
      </p>

      <Link
        href={href}
        className="home-corners home-lift"
        style={{
          marginTop: 14,
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.02em',
          textDecoration: 'none',
          color: NAVY.ink,
          background: NAVY.accent,
          border: `1px solid ${NAVY.accent}`,
        }}
      >
        Enter
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  )
}
