import { getAllConferences } from '../lib/deadlines'
import { SubjectFilter } from '../types/deadline'
import { DeadlineCard } from './deadlineCard'

interface DeadlineListProps {
  filter?: SubjectFilter
  limit?: number
  compact?: boolean
}

const DeadlineList = async ({
  filter = 'all',
  limit,
  compact = false,
}: DeadlineListProps) => {
  try {
    let conferences = await getAllConferences(filter)

    if (limit && limit > 0) {
      conferences = conferences.slice(0, limit)
    }

    if (!conferences || conferences.length === 0) {
      return (
        <section className="py-4">
          <p className="text-fore-subtle">No upcoming deadlines found.</p>
        </section>
      )
    }

    if (compact) {
      return (
        <section className="flex flex-wrap gap-3">
          {conferences.map(conference => (
            <DeadlineCard
              key={conference.id}
              conference={conference}
              compact={true}
            />
          ))}
        </section>
      )
    }

    return (
      <section className="mb-6 mt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {conferences.map(conference => (
            <DeadlineCard key={conference.id} conference={conference} />
          ))}
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error loading deadlines:', error)
    return (
      <section className="py-4">
        <p className="text-fore-subtle">Error loading deadlines.</p>
      </section>
    )
  }
}

export default (DeadlineList as unknown) as (
  props: DeadlineListProps
) => JSX.Element
