'use client'
import { format, parseISO } from 'date-fns'
import type { WorldData } from '../../../../types/world'
import { PixelButton } from '../kit/PixelButton'
import { PixelDivider } from '../kit/PixelDivider'

const DAY_MS = 86_400_000

// Days-remaining is measured from NEXT_PUBLIC_BUILD_DATE (a build-time constant),
// never new Date() — so the number can't silently drift or cause hydration lies.
// It is labeled "as of last build" to be honest about that.
export function DeadlinePanel({ data }: { data: WorldData }) {
  const next = data.nextDeadline

  let body
  if (next) {
    const buildRaw = process.env.NEXT_PUBLIC_BUILD_DATE
    const buildTime = buildRaw ? new Date(buildRaw).getTime() : NaN
    const dueTime = new Date(next.date).getTime()
    const days =
      Number.isNaN(buildTime) || Number.isNaN(dueTime)
        ? null
        : Math.max(0, Math.ceil((dueTime - buildTime) / DAY_MS))

    body = (
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gp-text)' }}>{next.name}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
          {format(parseISO(next.date), 'PPP')}
        </div>
        {days !== null && (
          <div
            style={{
              marginTop: 10,
              fontFamily: 'var(--font-pixel), monospace',
              fontSize: 11,
              color: 'var(--gp-accent)',
            }}
          >
            {days} {days === 1 ? 'day' : 'days'} left
          </div>
        )}
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>as of last build</div>
      </div>
    )
  } else {
    body = <p style={{ margin: 0, opacity: 0.8 }}>No upcoming deadlines (as of last build).</p>
  }

  return (
    <div>
      {body}
      <PixelDivider />
      <PixelButton href="/deadlines" variant="solid">
        Conference deadlines
      </PixelButton>
    </div>
  )
}
