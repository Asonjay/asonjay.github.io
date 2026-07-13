'use client'
import { format, parseISO } from 'date-fns'
import type { WorldData } from '../../../../types/world'
import { PanelMdx } from './panelMdx'

// Year-grouped list; each item's mdx `code` renders through the game MDX set.
export function NewsPanel({ data }: { data: WorldData }) {
  const grouped: Record<string, WorldData['news']> = {}
  for (const item of data.news) {
    const year = item.date.slice(0, 4)
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(item)
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  if (data.news.length === 0) {
    return <p style={{ opacity: 0.7 }}>No news yet.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {years.map(year => (
        <section key={year}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-barlow), sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: 'var(--gp-accent-ink)',
              }}
            >
              {year}
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--gp-border)', opacity: 0.4 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {grouped[year].map((item, i) => (
              <div key={`${year}-${i}`} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <time
                  dateTime={item.date}
                  style={{
                    flexShrink: 0,
                    width: 44,
                    textAlign: 'right',
                    fontFamily: 'var(--font-barlow), sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: 'var(--gp-accent-ink)',
                  }}
                >
                  {format(parseISO(item.date), 'MMM dd')}
                </time>
                <div style={{ flex: 1, minWidth: 0, fontSize: 14 }}>
                  <PanelMdx code={item.code} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
