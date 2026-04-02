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
            className={`px-3 py-1.5 font-mono-label text-xs uppercase tracking-widest rounded-lg transition-all border ${
              activeFilter === filter.value
                ? 'text-accent bg-[rgba(255,255,255,0.08)] border-[var(--color-border)]'
                : 'text-fore-subtle border-transparent hover:text-accent hover:bg-[rgba(255,255,255,0.06)] hover:border-[var(--color-border)]'
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
