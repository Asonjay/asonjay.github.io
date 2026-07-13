import Link from 'next/link'
import type { HomePub } from '../types'
import { TileCard } from '../TileCard'
import { HomeButton } from '../HomeButton'

function PubRow({ pub }: { pub: HomePub }) {
  const hasLinks = pub.pdf || pub.doi || pub.code || pub.url
  return (
    <li style={{ listStyle: 'none' }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14.5,
          lineHeight: 1.35,
          color: 'var(--home-text)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {pub.title}
      </div>
      <div
        className="home-muted"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12.5, marginTop: 3 }}
      >
        {pub.venue ? <span style={{ fontStyle: 'italic' }}>{pub.venue}</span> : null}
        {pub.year ? <span>{pub.year}</span> : null}
      </div>
      {hasLinks ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 7 }}>
          {pub.pdf ? (
            <HomeButton href={pub.pdf} size="sm" newTab>
              PDF
            </HomeButton>
          ) : null}
          {pub.doi ? (
            <HomeButton href={`https://doi.org/${pub.doi}`} size="sm">
              DOI
            </HomeButton>
          ) : null}
          {pub.code ? (
            <HomeButton href={pub.code} size="sm">
              Code
            </HomeButton>
          ) : null}
          {pub.url && !pub.pdf ? (
            <HomeButton href={pub.url} size="sm">
              Link
            </HomeButton>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

// Selected publications (desktop col-8). Rows are filtered/trimmed/capped on the
// server; this only renders. Footer links out to the full list.
export function PublicationsTile({ publications }: { publications: HomePub[] }) {
  return (
    <TileCard area="pubs" label="Selected Publications">
      {publications.length === 0 ? (
        <p className="home-muted" style={{ margin: 0, fontSize: 14 }}>
          Publications coming soon.
        </p>
      ) : (
        <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {publications.map((pub, i) => (
            <PubRow key={`${pub.title}-${i}`} pub={pub} />
          ))}
        </ul>
      )}
      <div style={{ height: 1, background: 'var(--home-border)', margin: '14px 0 12px' }} />
      <Link href="/publications" className="home-link" style={{ fontSize: 13, fontWeight: 600 }}>
        All publications →
      </Link>
    </TileCard>
  )
}
