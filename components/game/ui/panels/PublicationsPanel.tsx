'use client'
import type { WorldData } from '../../../../types/world'
import type { Publication } from '../../../../types/publication'
import { PixelButton } from '../kit/PixelButton'
import { PixelDivider } from '../kit/PixelDivider'

function PubRow({ pub }: { pub: Publication }) {
  return (
    <li style={{ listStyle: 'none' }}>
      <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.4, color: 'var(--gp-text)' }}>
        {pub.title}
      </div>
      {pub.authors?.length ? (
        <div style={{ fontSize: 12.5, opacity: 0.75, marginTop: 3 }}>
          {pub.authors.join(', ')}
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: 12.5,
          opacity: 0.9,
          marginTop: 3,
        }}
      >
        {pub.venue && <span style={{ fontStyle: 'italic' }}>{pub.venue}</span>}
        {pub.year ? <span>{pub.year}</span> : null}
      </div>
      {(pub.pdf || pub.doi || pub.code || pub.url) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {pub.pdf && <PixelButton href={pub.pdf}>PDF</PixelButton>}
          {pub.doi && <PixelButton href={`https://doi.org/${pub.doi}`}>DOI</PixelButton>}
          {pub.code && <PixelButton href={pub.code}>Code</PixelButton>}
          {pub.url && !pub.pdf && <PixelButton href={pub.url}>Link</PixelButton>}
        </div>
      )}
    </li>
  )
}

export function PublicationsPanel({ data }: { data: WorldData }) {
  // Selected first, preserving the year-descending order within each group.
  const selected = data.publications.filter(p => p.selected)
  const rest = data.publications.filter(p => !p.selected)
  const ordered = [...selected, ...rest]

  return (
    <div>
      <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {ordered.map((pub, i) => (
          <PubRow key={`${pub.title}-${i}`} pub={pub} />
        ))}
      </ul>
      <PixelDivider />
      <PixelButton href="/publications" variant="solid">
        All publications
      </PixelButton>
    </div>
  )
}
