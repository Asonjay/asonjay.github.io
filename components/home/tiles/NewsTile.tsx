'use client'
import Link from 'next/link'
import { format, parseISO, isValid } from 'date-fns'
import type { NewsItem } from '../../../types/world'
import { TileCard } from '../TileCard'
import { HomeMdx } from '../HomeMdx'

// Never throw on a malformed date (this tile prerenders at build): fall back to
// the raw string if it isn't ISO-parseable.
function formatNewsDate(iso: string): string {
  const d = parseISO(iso)
  return isValid(d) ? format(d, 'MMM d, yyyy') : iso
}

// Recent news (desktop col-4). Latest few items (already capped on the server),
// each a date label + the item's mdx body rendered through HomeMdx.
export function NewsTile({ news }: { news: NewsItem[] }) {
  return (
    <TileCard area="news" label="Recent News">
      {news.length === 0 ? (
        <p className="home-muted" style={{ margin: 0, fontSize: 14 }}>
          No news yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {news.map((item, i) => (
            <div key={`${item.date}-${i}`}>
              <time
                dateTime={item.date}
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: 'var(--home-accent-ink)',
                }}
              >
                {formatNewsDate(item.date)}
              </time>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 2, color: 'var(--home-text)' }}>
                <HomeMdx code={item.code} />
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 1, background: 'var(--home-border)', margin: '13px 0 12px' }} />
      <Link href="/classic" className="home-link" style={{ fontSize: 13, fontWeight: 600 }}>
        More news →
      </Link>
    </TileCard>
  )
}
