'use client'
import { format, parseISO } from 'date-fns'
import type { WorldData } from '../../../../types/world'
import { UiButton } from '../kit/UiButton'
import { UiDivider } from '../kit/UiDivider'

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
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.01em',
              color: 'var(--gp-accent-ink)',
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
      <UiDivider />
      <UiButton href="/deadlines" variant="solid">
        Conference deadlines
      </UiButton>
    </div>
  )
}
