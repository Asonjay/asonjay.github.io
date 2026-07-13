'use client'
import type { WorldData } from '../../../../types/world'
import { IconExternalLink } from '../kit/icons'

// Track list only — audio playback lives in the classic MiniPlayer; the url
// opens the source (SoundCloud) in a new tab via an SVG external-link glyph.
export function MusicPanel({ data }: { data: WorldData }) {
  if (data.playlist.length === 0) {
    return <p style={{ opacity: 0.7 }}>The playlist is empty.</p>
  }
  return (
    <ol style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.playlist.map((track, i) => (
        <li
          key={`${track.title}-${i}`}
          style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '8px 6px' }}
        >
          <span
            style={{
              flexShrink: 0,
              width: 22,
              textAlign: 'right',
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--gp-accent-ink)',
            }}
          >
            {i + 1}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gp-text)' }}>
              {track.title}
            </span>
            <span style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>{track.artist}</span>
          </span>
          {track.url && (
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${track.title} by ${track.artist}`}
              className="gp-link"
              style={{ flexShrink: 0, display: 'inline-flex', fontSize: 18, padding: 4, border: 'none' }}
            >
              <IconExternalLink />
            </a>
          )}
        </li>
      ))}
    </ol>
  )
}
