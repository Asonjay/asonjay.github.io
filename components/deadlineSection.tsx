'use client'

import { useState } from 'react'
import { Conference, SubjectFilter } from '../types/deadline'
import { DeadlineCard } from './deadlineCard'
import { Clock24 } from './icons'

interface DeadlineSectionProps {
  conferences: Conference[]
  limit?: number
}

const FILTERS: { label: string; value: SubjectFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'ML', value: 'ML' },
  { label: 'CV', value: 'CV' },
  { label: 'Robotics', value: 'RO' },
]

function matchesSubject(conference: Conference, filter: SubjectFilter): boolean {
  if (filter === 'all') return true

  const sub = conference.sub
  if (Array.isArray(sub)) {
    return sub.includes(filter)
  }
  return sub === filter
}

export function DeadlineFilters({
  activeFilter,
  onFilterChange
}: {
  activeFilter: SubjectFilter
  onFilterChange: (filter: SubjectFilter) => void
}) {
  return (
    <span className="text-sm text-fore-subtle uppercase tracking-[.2em] mt-2">
      [
      {FILTERS.map((filter, index) => (
        <span key={filter.value}>
          {index > 0 && <span className="mx-1">·</span>}
          <button
            onClick={() => onFilterChange(filter.value)}
            className={`transition-colors ${
              activeFilter === filter.value
                ? 'text-accent'
                : 'hover:text-accent'
            }`}
          >
            {filter.label}
          </button>
        </span>
      ))}
      ]
    </span>
  )
}

export function DeadlineSection({ conferences, limit = 10 }: DeadlineSectionProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all')

  const filteredConferences = conferences
    .filter(conf => matchesSubject(conf, activeFilter))
    .slice(0, limit)

  return (
    <div>
      {/* Deadline cards */}
      {filteredConferences.length === 0 ? (
        <p className="text-fore-subtle text-sm">No deadlines for this category.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filteredConferences.map(conference => (
            <DeadlineCard
              key={conference.id}
              conference={conference}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function DeadlineSectionWithFilters({ conferences, limit = 10 }: DeadlineSectionProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all')

  const filteredConferences = conferences
    .filter(conf => matchesSubject(conf, activeFilter))
    .slice(0, limit)

  return (
    <div>
      {/* Filter links */}
      <div className="mb-4">
        <DeadlineFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Deadline cards */}
      {filteredConferences.length === 0 ? (
        <p className="text-fore-subtle text-sm">No deadlines for this category.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {filteredConferences.map(conference => (
            <DeadlineCard
              key={conference.id}
              conference={conference}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Helper to check if deadline is expired
function isExpired(conference: Conference): boolean {
  const deadline = new Date(conference.deadline)
  if (conference.timezone === 'UTC-12' || conference.timezone === 'AoE') {
    deadline.setHours(deadline.getHours() + 12)
  }
  return deadline <= new Date()
}

// Full section with icon, title, inline filters, and cards
export function DeadlineSectionFull({ conferences, limit = 10 }: DeadlineSectionProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all')
  const [showExpired, setShowExpired] = useState(false)

  const filteredBySubject = conferences.filter(conf => matchesSubject(conf, activeFilter))

  const upcomingConferences = filteredBySubject
    .filter(conf => !isExpired(conf))
    .slice(0, limit)

  const expiredConferences = filteredBySubject
    .filter(conf => isExpired(conf))

  return (
    <div className="mt-12">
      {/* Header with icon, title, and filters */}
      <div className="flex items-center space-x-3">
        <span className="p-3 rounded-full bg-back-subtle">
          <Clock24 />
        </span>
        <span className="mt-3 mb-2 uppercase tracking-[.2em] text-accent">
          <span className="text-xl">D</span>EADLINES
        </span>
        <DeadlineFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Deadline cards */}
      <div className="mt-4">
        {upcomingConferences.length === 0 && expiredConferences.length === 0 ? (
          <p className="text-fore-subtle text-sm">No deadlines for this category.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {upcomingConferences.map(conference => (
              <DeadlineCard
                key={conference.id}
                conference={conference}
                compact={true}
              />
            ))}

            {/* Show Expired button styled like a card */}
            {expiredConferences.length > 0 && !showExpired && (
              <button
                onClick={() => setShowExpired(true)}
                className="inline-flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-back-subtle transition-all hover:-translate-y-1 hover:shadow-md border-2 border-dashed border-fore-subtle/30 hover:border-accent w-[140px] text-fore-subtle hover:text-accent"
              >
                <span className="text-2xl">+{expiredConferences.length}</span>
                <span className="text-xs mt-1">Show Expired</span>
              </button>
            )}

            {/* Expired cards */}
            {showExpired && expiredConferences.map(conference => (
              <DeadlineCard
                key={conference.id}
                conference={conference}
                compact={true}
              />
            ))}

            {/* Hide Expired button */}
            {showExpired && expiredConferences.length > 0 && (
              <button
                onClick={() => setShowExpired(false)}
                className="inline-flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-back-subtle transition-all hover:-translate-y-1 hover:shadow-md border-2 border-dashed border-fore-subtle/30 hover:border-accent w-[140px] text-fore-subtle hover:text-accent"
              >
                <span className="text-lg">✕</span>
                <span className="text-xs mt-1">Hide Expired</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeadlineSection
