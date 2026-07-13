import type { PlaylistTrack } from '../../../types/world'
import { TileCard } from '../TileCard'

// Tiny external-link glyph sized exactly (bespoke rather than the 24px
// components/icons External24, which can't be reliably shrunk via className).
function ExtGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, opacity: 0.8 }}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

function TrackRow({ track }: { track: PlaylistTrack }) {
  const inner = (
    <>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <span style={{ fontWeight: 600 }}>{track.title}</span>
        <span className="home-muted"> — {track.artist}</span>
      </span>
      {track.url ? <ExtGlyph /> : null}
    </>
  )
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    lineHeight: 1.4,
    color: 'var(--home-text)',
    textDecoration: 'none',
  } as const

  return track.url ? (
    <a href={track.url} target="_blank" rel="noopener noreferrer" style={rowStyle} className="home-track">
      {inner}
    </a>
  ) : (
    <span style={rowStyle}>{inner}</span>
  )
}

// Music (desktop col-3). First few playlist tracks (sliced on the server), each
// "Title — Artist" linking out.
export function MusicTile({ playlist }: { playlist: PlaylistTrack[] }) {
  return (
    <TileCard area="music" label="Music">
      {playlist.length === 0 ? (
        <p className="home-muted" style={{ margin: 0, fontSize: 13 }}>
          Nothing playing yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {playlist.map((track, i) => (
            <TrackRow key={`${track.title}-${i}`} track={track} />
          ))}
        </div>
      )}
    </TileCard>
  )
}
