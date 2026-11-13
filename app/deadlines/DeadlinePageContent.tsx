'use client'

import { useState } from 'react'
import { Conference, SubjectFilter } from '../../types/deadline'
import { DeadlineCard } from '../../components/deadlineCard'

interface DeadlinePageContentProps {
  conferences: Conference[]
}

const FILTERS: { label: string; value: SubjectFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Machine Learning', value: 'ML' },
  { label: 'Computer Vision', value: 'CV' },
]

function matchesSubject(conference: Conference, filter: SubjectFilter): boolean {
  if (filter === 'all') return true
  const sub = conference.sub
  if (Array.isArray(sub)) return sub.includes(filter)
  return sub === filter
}

export default function DeadlinePageContent({
  conferences,
}: DeadlinePageContentProps) {
  const [activeFilter, setActiveFilter] = useState<SubjectFilter>('all')

  const filteredConferences = conferences.filter(conf =>
    matchesSubject(conf, activeFilter)
  )

  return (
    <div className="mt-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            aria-pressed={activeFilter === filter.value}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors border ${
              activeFilter === filter.value
                ? 'bg-[var(--color-solid)] text-[var(--color-on-solid)] border-[var(--color-solid)]'
                : 'text-fore-secondary border-[var(--color-border)] hover:text-fore-primary hover:bg-[var(--color-item-bg-hover)]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <p className="mb-4 font-mono-label text-xs text-fore-subtle">
        {filteredConferences.length} deadline{filteredConferences.length !== 1 ? 's' : ''}
      </p>

      {/* Conference Grid */}
      {filteredConferences.length === 0 ? (
        <div className="py-8 text-center text-fore-subtle font-mono-label text-sm">
          No deadlines found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredConferences.map(conference => (
            <div key={conference.id} className="panel-list-item !p-0 overflow-hidden">
              <DeadlineCard conference={conference} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
